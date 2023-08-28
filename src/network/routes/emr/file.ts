/* eslint-disable no-tabs */
import { Router, Request, Response, NextFunction } from "express";
import RBAC from "../../../services/rbac";
import moment from "moment";
import { ElasticLoggerService } from "./services";
import { getOriginalDicom, isValidFile } from "./helpers/app.helper";
import * as jsonpatch from "fast-json-patch";
import { SEPFileNameRequest } from "./interfaces/file/file.request";
import { UpdatePDFHeaderRequest } from "./interfaces/account.model";
const jp = require("jsonpath");
const short = require("short-uuid");
const sizeOf = require("image-size");
const File = Router();
const debugEMR = require("debug")("emr");
const googleDocs = require("@googleapis/docs");
const googleDrive = require("@googleapis/drive");
const googleHealthcare = require("@googleapis/healthcare");
const healthcare = googleHealthcare.healthcare({
  version: "v1",
  auth: new googleHealthcare.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  }),
  headers: {
    Accept: "application/dicom+json",
  },
});

const auth = new googleDrive.auth.GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file"],
});
const drive = googleDrive.drive({
  version: "v3",
  auth: new googleDrive.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file"],
  }),
});

const docs = googleDocs.docs({
  version: "v1",
  auth: new googleDocs.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/documents", "https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive.readonly"],
  }),
});
const { Storage } = require("@google-cloud/storage");
const storage = new Storage();

function isObject(obj: any) {
  if (typeof obj === "object" && !Array.isArray(obj)) return true;
  return false;
}

function isArray(arr: any) {
  return !!Array.isArray(arr);
}

function getArray(value: unknown): Array<unknown> {
  return isArray(value) ? [value] : [];
}

function getString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function addDelimiter(a: string, b: string): string {
  return a ? `${a}.${b}` : b;
}

function getJSONPath(arr: Array<string>, obj: any, head: string) {
  if (obj != null || obj != undefined) {
    const result = Object.entries(obj).reduce((result: any, [key, value]) => {
      const fullpath = addDelimiter(head, key);
      if (isObject(value)) {
        getJSONPath(arr, value, fullpath);
      } else if (isArray(value)) {
        const localArr: Array<unknown> = getArray(value);
        for (let i = 0; i < localArr.length; i++) {
          getJSONPath(arr, localArr[i], `${fullpath}[${i}]`);
        }
      } else {
        if (getString(value) != undefined) {
          arr.push(fullpath);
        }
      }
    }, []);
  }
}

function getObjectID(obj: any, title: string): string {
  if (obj.inlineObjects != null) {
    for (var key in obj.inlineObjects) {
      if (obj.inlineObjects[key].inlineObjectProperties.embeddedObject.title == title) {
        return key;
      }
    }
  }
  if (obj.positionedObjects != null) {
    for (var key in obj.positionedObjects) {
      if (obj.positionedObjects[key].positionedObjectProperties.embeddedObject.title == title) {
        return key;
      }
    }
  }
  return "";
}

function getTableObject(template: any, index: number): any {
  let counter: number = 0;
  for (const key in template.body.content) {
    const obj = template.body.content[key];
    if (obj.hasOwnProperty("table")) {
      if (counter == index) {
        return obj;
      }
      counter++;
    }
  }
  return null;
}
File.route("/file/log").post(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Testing only will delete soon
  await global.medicalRecord.logChange(req.body.emr_id, "UPDATE");
  res.status(200).json({message:"OK"});
})


File.route("/file/doc/removeOne").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const fileId: string = req.body.file_id || "";
  // Delete Output Template Document
  try {
    await drive.files.delete({
      supportsAllDrives: true,
      supportsTeamDrives: true,
      fileId,
    });
    if (!res.writableEnded)
      res.status(200).json({
        message: "OK",
      });
  } catch (e) {
    if (!res.writableEnded)
      res.status(500).json({
        message: "Internal Server Error",
        err: e,
      });
  }
});

File.route("/file/doc/remove").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let formName: string = req.body.form_name || "";
  formName = formName.replace("/", "_");
  const outputWordIDs = await global.medicalRecord.getAllWordTemplate(req.emrParams.Kode_Cabang, formName);
  for (let i = 0; i < outputWordIDs.length; i++) {
    // Delete Output Template Document
    await drive.files.delete({
      supportsAllDrives: true,
      supportsTeamDrives: true,
      fileId: outputWordIDs[i],
    });
  }
  if (!res.writableEnded)
    res.status(200).json({
      message: "OK",
    });
});

File.route("/file/doc/generate").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let formName: string = req.body.form_name || "";
    formName = formName.replace("/", "_");
    // Create New Output Template Document
    const wordTemplateID = await global.medicalRecord.get(`Config:{${req.emrParams.Kode_Cabang}}`, [`word_templates.${formName}`]);
    const folderTemplates = await global.medicalRecord.get(`Config:{${req.emrParams.Kode_Cabang}}`, [`folder_templates`]);
    const result: Array<object> = [];
    for (let i = 0; i < 10; i++) {
      const ID = short("0123456789").new();
      const newWordTemplate = await drive.files.copy({
        supportsAllDrives: true,
        supportsTeamDrives: true,
        fileId: wordTemplateID,
        requestBody: {
          name: `${formName}_${ID}`,
          parents: [folderTemplates],
        },
      });
      await global.medicalRecord.addWordTemplate(req.emrParams.Kode_Cabang, formName, newWordTemplate.data.id);
      result.push(newWordTemplate.data);
    }
    if (!res.writableEnded)
      res.status(200).json({
        message: "OK",
        data: result,
      });
  } catch (e) {}
});

File.route("/file/doc/get").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let formName: string = req.body.form_name || "";
  formName = formName.replace("/", "_");
  const ID = short("0123456789").new();
  // Create New Output Template Document
  const wordTemplateID = await global.medicalRecord.get(`Config:{${req.emrParams.Kode_Cabang}}`, [`word_templates.${formName}`]);
  const wordTemplate = await docs.documents.get({
    documentId: wordTemplateID,
    fields: "*",
  });
  if (!res.writableEnded)
    res.status(200).json(wordTemplate.data);
});

File.route("/file/pdf/remove_templates").post(RBAC.getInstance().isUserAuthenticated, async (req:Request, res: Response, next: NextFunction): Promise<void> => {
  await global.messagingService.sendMessage(
    'emr',
    '/clear_word_templates',
    req.body,
  );
  res.status(200).json({
    message: 'OK',
  });
});

File.route("/file/pdf/generate_v3").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = req.body.data;
    const preview = req.body.preview;
    // let headerData = {};
    // const resultHeader = await global.medicalRecord.get(`HeaderPDF:{${req.emrParams.Kode_Cabang}}`);
    // if (resultHeader && resultHeader !== '') {
    //   headerData = await UpdatePDFHeaderRequest.createPdfHeaderModel(resultHeader);
    // }
    const pdfx = await global.storage.convertDocToPdf2(
      req.emrParams.Kode_Cabang,
      req.body.form_name,
      req.body.emr_id,
      req.body.row_filter,
      data,
      req.body.converter || '',
    );

    if (pdfx && pdfx !== null) {
      if (preview) {
        res.status(200).set({
          "Cache-Control": "no-cache",
          "Content-Type": "application/pdf",
          "Content-Length": pdfx.length,
          "Content-Disposition": `attachment; filename=test.pdf`,
        }).send(pdfx);
      } else {
        const result = await global.medicalRecord.get(req.body.emr_id, ["Kode_Cabang", "Jenis_Pelayanan", "Tanggal_Masuk", "Tipe_Pasien", "No_MR", "ID_Pelayanan"]);
        const branchTimezone = await global.medicalRecord.getConfigValue(result.Kode_Cabang, "timezone");
        const resultPDF = await global.storage.uploadFromMemory(`pdfs/${result.Kode_Cabang}/${result.Jenis_Pelayanan}/${moment.unix(result.Tanggal_Masuk).format("YYYY")}/${moment.unix(result.Tanggal_Masuk).format("MM")}/${result.Tipe_Pasien}/${result.No_MR}/${result.ID_Pelayanan}/${req.body.form_name}_${moment().utcOffset(branchTimezone).format("YYYYMMDDHHmmss")}.pdf`, pdfx);

        // Save PDF URL
        const url = encodeURI(`https://${resultPDF.bucket}/${resultPDF.name}?generation=${resultPDF.generation}`);
        // await global.medicalRecord.setField(req.emrID, req.body.form_name, "", url);
        const pdf: IPDF = {
          Version: await global.medicalRecord.getPDFLastVersion(req.emrID, req.body.form_name),
          URL: url,
          Form_Name: req.body.form_name,
          Visit_Date: moment.unix(result.Tanggal_Masuk).format("YYYY-MM-DD"),
          Created_At: moment().utcOffset(branchTimezone).format("YYYY-MM-DD HH:mm:ss"),
          Created_By: req.userId,
          Created_By_Name: req.userProfile.nama,
        };
        if (req.body.form_name !== 'lampiran_diagnostik') {
          await global.medicalRecord.addPDF(req.emrID, pdf);
        }

        // Signed URL
        const signUrl = url && url !== "" && isValidFile(url) ? await global.storage.signUrl(url, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : undefined;

        if (!res.writableEnded) {
          ElasticLoggerService().createHTTPResponse(req, res, 200, {
            message: "OK",
            data: {
              url,
              signUrl,
            },
          });
        }
      }
    }
  } catch (err) {
    if (!res.writableEnded) {
      console.error(err)
      ElasticLoggerService().createErrorLog(req, 'file/pdf/generate_v3', err);
      res.status(500).json({
        message: err,
      })
    }
  }
});

File.route('/file/pdf/get-sep-filename')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      let url = undefined;
      let signUrl = undefined;
      const bucketName = process.env.GCP_BUCKET_NAME ?? '';
      const dataToPost = new SEPFileNameRequest(req.body);
      const emrKeys = ["Kode_Cabang", "Jenis_Pelayanan", "Tanggal_Masuk", "Tipe_Pasien", "No_MR", "ID_Pelayanan", "No_SEP"];
      const result = await global.medicalRecord.get(req.body.emr_id, emrKeys);
      const pdfBaseUrl = global.storage.cleanUrl(dataToPost.src_url);
      const pdfDirectory = pdfBaseUrl.replace(`https://${bucketName}/`, '');
      const x = pdfDirectory.split('?')
      x.splice(-1);
      const gcsDir = x.join();

      const destFileName = `/pdfs/${result.Kode_Cabang}/${moment.unix(result.Tanggal_Masuk).format("YYYY")}/${moment.unix(result.Tanggal_Masuk).format("MM")}/${result.No_SEP}_${result.No_MR}_${dataToPost.form_name}.pdf`

      const sepPdf = await global.storage.copyFile(gcsDir, destFileName);

      url = encodeURI(`https://${sepPdf.bucket}/${sepPdf.name}?generation=${sepPdf.generation}`);
      signUrl = url && url !== '' && isValidFile(url) ? await global.storage.signUrl(url, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : undefined;

      if (!res.writableEnded) {
        res.status(200).json({
          message: 'OK',
          data: {
            url,
            signUrl,
          },
        });
      }

    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        });
      }
    }
  });

File.route("/file/pdf/generate_v2").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  try {
    const data = req.body.data;
    const pdfx = await global.storage.convertDocToPdf(req.emrParams.Kode_Cabang, req.body.form_name, data);

    if (pdfx && pdfx !== null) {
      const result = await global.medicalRecord.get(req.emrID, ["Kode_Cabang", "Jenis_Pelayanan", "Tanggal_Masuk", "Tipe_Pasien", "No_MR", "ID_Pelayanan"]);
      const branchTimezone = await global.medicalRecord.getConfigValue(result.Kode_Cabang, "timezone");
      const resultPDF = await global.storage.uploadFromMemory(`pdfs/${result.Kode_Cabang}/${result.Jenis_Pelayanan}/${moment.unix(result.Tanggal_Masuk).format("YYYY")}/${moment.unix(result.Tanggal_Masuk).format("MM")}/${result.Tipe_Pasien}/${result.No_MR}/${result.ID_Pelayanan}/${req.body.form_name}_${moment().utcOffset(branchTimezone).format("YYYYMMDDHHmmss")}.pdf`, pdfx);

      // Save PDF URL
      const url = encodeURI(`https://${resultPDF.bucket}/${resultPDF.name}?generation=${resultPDF.generation}`);
      // await global.medicalRecord.setField(req.emrID, req.body.form_name, "", url);
      const pdf: IPDF = {
        Version: await global.medicalRecord.getPDFLastVersion(req.emrID, req.body.form_name),
        URL: url,
        Form_Name: req.body.form_name,
        Visit_Date: moment.unix(result.Tanggal_Masuk).format("YYYY-MM-DD"),
        Created_At: moment().utcOffset(branchTimezone).format("YYYY-MM-DD HH:mm:ss"),
        Created_By: req.userId,
        Created_By_Name: req.userProfile.nama,
      };
      if (req.body.form_name !== 'lampiran_diagnostik') {
        await global.medicalRecord.addPDF(req.emrID, pdf);
      }

      // Signed URL
      const signUrl = url && url !== "" && isValidFile(url) ? await global.storage.signUrl(url, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : undefined;

      if (!res.writableEnded) {
        ElasticLoggerService().createHTTPResponse(req, res, 200, {
          message: "OK",
          data: {
            url,
            signUrl,
          },
        });
      }
    }
  } catch (err) {
    if (!res.writableEnded) {
      console.error(err)
      ElasticLoggerService().createErrorLog(req, 'file/pdf/generate_v2', err);
      res.status(500).json({
        message: err,
      })
    }
  }
});

File.route("/file/pdf/generate").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let formName: string = req.body.form_name || "";
  formName = formName.replace("/", "_");
  const ID = short("0123456789").new();
  let outputWordID: string = "";
  let wordTemplateID: string = "";
  let folderTemplates: string = "";
  try {
    wordTemplateID = await global.medicalRecord.get(`Config:{${req.emrParams.Kode_Cabang}}`, [`word_templates.${formName}`]);
    folderTemplates = await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "folder_templates");
    // await global.medicalRecord.get(`Config:{${req.emrParams.Kode_Cabang}}`, [`folder_templates`]);
    const imagesPath: Array<string> = [];
    getJSONPath(imagesPath, req.body.data.images, "$");
    const textPath: Array<string> = [];
    getJSONPath(textPath, req.body.data.text, "$");

    outputWordID = await global.medicalRecord.getWordTemplate(req.emrParams.Kode_Cabang, formName);
    const wordTemplate = await docs.documents.get({
      documentId: outputWordID,
      fields: "*",
    });
    const batchRequest: Array<object> = [];

    // tables
    const tables = req.body.data.table;
    for (var i = 0; i < tables.length; i++) {
      const table = getTableObject(wordTemplate.data, tables[i].index);
      if (table != null) {
        const locationIndex: number = table.startIndex;
        const totalColumns: number = tables[i].columns;
        const startIndex: number = table.table.tableRows[table.table.rows - 1].endIndex;
        let nextIndex: number = startIndex;
        // Generate table rows first
        for (var j = 0; j < tables[i].content.length; j++) {
          batchRequest.push({
            insertTableRow: {
              tableCellLocation: {
                columnIndex: table.table.columns - 1,
                rowIndex: table.table.rows - 1,
                tableStartLocation: {
                  index: locationIndex,
                },
              },
              insertBelow: true,
            },
          });
        }
        // Insert content into table cells
        for (var j = 0; j < tables[i].content.length; j++) {
          for (let k = 1; k <= totalColumns; k++) {
            nextIndex = generateCellBatchRequest(tables[i].content[j][`col_${  k}`], batchRequest, (nextIndex += 2));
          }
          nextIndex += 1;
        }
      }
    }

    // text
    for (var i = 0; i < textPath.length; i++) {
      batchRequest.push({
        replaceAllText: {
          containsText: {
            text: `${textPath[i].replace("$.", "{")  }}`,
          },
          replaceText: jp.query(req.body.data.text, textPath[i])[0],
        },
      });
    }
    // images
    let imageId: string = "";
    for (var i = 0; i < imagesPath.length; i++) {
      imageId = getObjectID(wordTemplate.data, imagesPath[i].replace("$.", ""));
      if (imageId != "") {
        batchRequest.push({
          replaceImage: {
            imageObjectId: imageId,
            imageReplaceMethod: "CENTER_CROP",
            uri: jp.query(req.body.data.images, imagesPath[i])[0],
          },
        });
      }
    }
    if (batchRequest.length > 0) {
      const finalWord = await docs.documents.batchUpdate({
        documentId: outputWordID,
        requestBody: {
          requests: batchRequest,
        },
      });
      const pdfExported = await drive.files.export({ fileId: outputWordID, mimeType: "application/pdf" }, { responseType: "arraybuffer" });
      const data = Buffer.from(pdfExported.data);

      const result = await global.medicalRecord.get(req.emrID, ["Kode_Cabang", "Jenis_Pelayanan", "Tanggal_Masuk", "Tipe_Pasien", "No_MR", "ID_Pelayanan"]);
      // Delete Output Template Document
      //await drive.files.delete({
      //    supportsAllDrives: true,
      //    supportsTeamDrives: true,
      //    fileId: outputWordID,
      //});
      // Upload into Google Cloud Storage
      const branchTimezone = await global.medicalRecord.getConfigValue(result.Kode_Cabang, "timezone");
      const resultPDF = await global.storage.uploadFromMemory(`pdfs/${result.Kode_Cabang}/${result.Jenis_Pelayanan}/${moment.unix(result.Tanggal_Masuk).format("YYYY")}/${moment.unix(result.Tanggal_Masuk).format("MM")}/${result.Tipe_Pasien}/${result.No_MR}/${result.ID_Pelayanan}/${formName}_${moment().utcOffset(branchTimezone).format("YYYYMMDDHHmmss")}.pdf`, data);

      // Save PDF URL
      const url = encodeURI(`https://${resultPDF.bucket}/${resultPDF.name}?generation=${resultPDF.generation}`);
      await global.medicalRecord.setField(req.emrID, formName, "", url);

      // Save PDF creation into history
      const pdf: IPDF = {
        Version: await global.medicalRecord.getPDFLastVersion(req.emrID, formName),
        URL: url,
        Form_Name: formName,
        Visit_Date: moment.unix(result.Tanggal_Masuk).format("YYYY-MM-DD"),
        Created_At: moment().utcOffset(branchTimezone).format("YYYY-MM-DD HH:mm:ss"),
        Created_By: req.userId,
        Created_By_Name: req.userProfile.nama,
      };
      const resultArrayPDF = await global.medicalRecord.addPDF(req.emrID, pdf);

      // Signed URL
      const signUrl = url && url !== "" && isValidFile(url) ? await global.storage.signUrl(url, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : undefined;

      ElasticLoggerService().createHTTPResponse(req, res, 200, {
        message: "OK",
        data: {
          url,
          signUrl,
        },
      });
    }
  } catch (err) {
    console.error(err);
    ElasticLoggerService().createErrorLog(req, "/file/pdf/generate", err);
    if (!res.writableEnded)
      res.status(500).json({
        message: err,
      });
  } finally {
    if (outputWordID != "") {
      // Create New Output Template Document
      const newWordTemplate = await drive.files.copy({
        supportsAllDrives: true,
        supportsTeamDrives: true,
        fileId: wordTemplateID,
        requestBody: {
          name: `${formName}_${ID}`,
          parents: [folderTemplates],
        },
      });
      await global.medicalRecord.addWordTemplate(req.emrParams.Kode_Cabang, formName, newWordTemplate.data.id);
    }
  }
});
function generateCellBatchRequest(obj: any, batchRequest: Array<object>, nextIndex: number): number {
  if (obj.type == "text") {
    const values = obj.value.split(/\r\n|\r|\n/);
    for (let m = 0; m < values.length; m++) {
      values[m] += "\n";
      batchRequest.push({
        insertText: {
          location: {
            index: nextIndex,
          },
          text: values[m],
        },
      });
      nextIndex += values[m].length;
    }
  } else if (obj.type == "array") {
    for (let i = 0; i < obj.value.length; i++) {
      nextIndex = generateCellBatchRequest(obj.value[i], batchRequest, nextIndex);
    }
  } else if (obj.type == "image") {
    batchRequest.push({
      insertInlineImage: {
        location: {
          index: nextIndex,
        },
        objectSize: {
          height: {
            unit: "PT",
            magnitude: obj.height,
          },
          width: {
            unit: "PT",
            magnitude: obj.width,
          },
        },
        uri: obj.value,
      },
    });
    nextIndex += 1;
  }
  return nextIndex;
}
File.route("/file/pdf/find").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let formName: string = req.body.form_name || "";
    formName = formName.replace("/", "_");
    const result = await global.medicalRecord.getPDFs(req.emrID, formName);
    if (result && Array.isArray(result) && result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        // Signed URL
        result[i].URL = result[i].URL && result[i].URL !== "" && isValidFile(result[i].URL) ? await global.storage.signUrl(result[i].URL, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : "";
      }
      if (!res.writableEnded) {
        res.status(200).json({
          message: "OK",
          data: result,
        });
      }
    } else {
      if (!res.writableEnded) {
        res.status(200).json({
          message: 'OK',
          data: (result && result !== null && Array.isArray(result)) ? result : [],
        })
      }
    }
  } catch (err) {
    ElasticLoggerService().createErrorLog(req.body, "/file/pdf/find", err);
    if (!res.writableEnded) {
      res.status(500).json({
        message: err,
      });
    }
  }
});

File.route("/file/pdf/upload").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const formName = req.body.form_name;
  const visitDate = req.body.visit_date;
  const data: any = req.files;
  try {
    if (!data || (data && data === null)) {
      ElasticLoggerService().createHTTPResponse(req, res, 400, {
        message: "PDF File is required",
      });
      return;
    }
    const result = await global.medicalRecord.get(req.emrID, ["Kode_Cabang", "Jenis_Pelayanan", "Tanggal_Masuk", "Tipe_Pasien", "No_MR", "ID_Pelayanan"]);

    // Upload into Google Cloud Storage
    const resultPDF = await global.storage.uploadFromMemory(`pdfs/${result.Kode_Cabang}/${result.Jenis_Pelayanan}/${moment.unix(result.Tanggal_Masuk).format("YYYY")}/${moment.unix(result.Tanggal_Masuk).format("MM")}/${result.Tipe_Pasien}/${result.No_MR}/${result.ID_Pelayanan}/${formName}.pdf`, data.pdf.data);

    // Save PDF URL
    const url = encodeURI(`https://${resultPDF.bucket}/${resultPDF.name}?generation=${resultPDF.generation}`);
    await global.medicalRecord.setField(req.emrID, formName, "", url);

    // Save PDF creation into history
    const pdf: IPDF = {
      Version: await global.medicalRecord.getPDFLastVersion(req.emrID, formName),
      URL: url,
      Form_Name: formName,
      Visit_Date: visitDate,
      Created_At: moment()
        .utcOffset(await global.medicalRecord.getConfigValue(result.Kode_Cabang, "timezone"))
        .format("YYYY-MM-DD HH:mm:ss"),
      Created_By: req.userId,
      Created_By_Name: req.userProfile.nama,
    };
    const resultArrayPDF = await global.medicalRecord.addPDF(req.emrID, pdf);

    // Signed URL
    const signUrl = url && url !== "" && isValidFile(url) ? await global.storage.signUrl(url, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : undefined;

    ElasticLoggerService().createHTTPResponse(req, res, 200, {
      message: "OK",
      data: {
        url,
        signUrl,
      },
    });
  } catch (err) {
    ElasticLoggerService().createHTTPResponse(req, res, 500, {
      message: "Internal Server Error",
      error: err,
    });
  }
});

File.route("/file/pdf/dash-item").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const localDebug = debugEMR.extend(req.path);
    localDebug(`Request Begin`);

    const limit = req.body.limit || 10;
    const offset: number = req.body.offset || 0;
    const sortDir = req.body.sort || "DESC";
    const search: string = req.body.search && req.body.search !== '' ? req.body.search : '';
    const emrKeys = ["Kode_Cabang", "No_MR", "Pasien"];
    const emrData = await global.medicalRecord.get(req.emrID, emrKeys);
    if (!emrData || (emrData && emrData === null)) {
      ElasticLoggerService().createHTTPResponse(req, res, 404, {
        message: "EMR Data Not Found",
      });
    } else {
      localDebug(`Get EMR Data ${JSON.stringify(emrData)}`);
      let searchParam = "";
      if (search !== "") searchParam = `@Form_Name:*${search.toLowerCase()}*`;
      const searchQuery = `\'${searchParam} @Kode_Cabang:${emrData.Kode_Cabang} @No_MR:${emrData.No_MR}\'`;
      const result = await global.medicalRecord.findPdf(searchQuery, {
        LIMIT: { from: 0, size: 10000 },
        RETURN: ["$.Kode_Cabang", "$.No_MR", "$.PDFs", "$.No_SEP"],
      });
      localDebug(`Search ${searchQuery}`);
      localDebug(result);

      if (result && result !== null) {
        let records: any = [];
        // Merge PDFs from multiple visits
        for (let i = 0; i < result.documents.length; i++) {
          if (result.documents[i].value["$.PDFs"] !== undefined) {
            const pdfs = JSON.parse(result.documents[i].value["$.PDFs"]);
            const sep = result?.documents[i]?.value["$.No_SEP"] ?? '';
            for (let j = 0; j < pdfs.length; j++) {
              pdfs[j]["EMR_ID"] = result.documents[i].id;
              pdfs[j]["No_SEP"] = sep;
            }
            records = records.concat(pdfs);
          }
        }
        localDebug(`Merge Data`);
        if (search && search !== '') {
          const query = search.toLowerCase();
          records = records.filter((item: any) => item.Form_Name.toLowerCase().indexOf(query) >= 0);
        }

        const total = records.length;
        // Sort PDFs based on param direction
        records.sort((a: any, b: any) => {
          if (sortDir === "ASC") {
            return moment(a.Visit_Date).unix() - moment(b.Visit_Date).unix();
          } else if (sortDir === "DESC") {
            return moment(b.Visit_Date).unix() - moment(a.Visit_Date).unix();
          }
        });
        localDebug(`Sort Data`);

        // Show based on param offset and param limit
        records = records.slice(offset, offset + limit > records.length ? records.length : offset + limit);
        localDebug(`Slice Data`);

        for (let i = 0; i < records.length; i++) {
          records[i].SignURL = records[i].URL && records[i].URL !== "" && isValidFile(records[i].URL) ? await global.storage.signUrl(records[i].URL, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : "";
        }
        if (!res.writableEnded) res.status(200).json({
          message: "OK",
          data: {
            total,
            totalFiltered: records.length,
            EMR_ID: req.emrID,
            pasien: emrData.Pasien,
            records,
          },
        });
      } else if (!result || (result && result === null)) {
        if (!res.writableEnded) res.status(500).json({
          message: "Data not found",
        });
      }
    }
    localDebug(`Request End`);
  } catch (err) {
    ElasticLoggerService().createHTTPErrorResponse(
      req,
      res,
      500,
      {
        message: "Internal Server Error",
      },
      err,
    );
  }
});

File.route("/file/image/upload").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const formName = req.body.form_name;
  const componentId = req.body.component_id;
  const imageData = req.body.image;

  try {
    const base64EncodedString = imageData.replace(/^data:\w+\/\w+;base64,/, "");
    const fileBuffer = Buffer.from(base64EncodedString, "base64");

    const result = await global.medicalRecord.get(req.emrID, ["Kode_Cabang", "Jenis_Pelayanan", "Tanggal_Masuk", "Tipe_Pasien", "No_MR", "ID_Pelayanan"]);

    const resultJPEG = await global.storage.uploadFromMemory(`images/${result.Kode_Cabang}/${result.Jenis_Pelayanan}/${moment.unix(result.Tanggal_Masuk).format("YYYY")}/${moment.unix(result.Tanggal_Masuk).format("MM")}/${result.Tipe_Pasien}/${result.No_MR}/${result.ID_Pelayanan}/${formName}/${componentId}.jpeg`, fileBuffer);
    const url = encodeURI(`https://${resultJPEG.bucket}/${resultJPEG.name}?generation=${resultJPEG.generation}`);
    await global.medicalRecord.setField(req.emrID, formName, componentId, url);
    const signUrl = url && url !== "" && isValidFile(url) ? await global.storage.signUrl(url, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : undefined;

    const fieldValue = await global.medicalRecord.getField(req.emrID, formName, componentId);
    ElasticLoggerService().createHTTPResponse(req, res, 200, {
      message: "OK",
      data: {
        url,
        signUrl,
      },
    });
  } catch (err) {
    ElasticLoggerService().createHTTPErrorResponse(req, res, 500, { message: "Internal Server Error" }, err);
  }
});

File.route('/file/image/upload-general')
  .post(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const dataToPost = req.body;
      const imageData = dataToPost.image;
      const companyCode = dataToPost.company_code;
      const componentId = dataToPost.component_id;
      const base64EncodedString = imageData.replace(/^data:\w+\/\w+;base64,/, "");
      const fileBuffer = Buffer.from(base64EncodedString, "base64");
      const resultJPEG = await global.storage.uploadFromMemory(`images/${companyCode}/general/${componentId}.jpeg`, fileBuffer);
      const url = encodeURI(`https://${resultJPEG.bucket}/${resultJPEG.name}?generation=${resultJPEG.generation}`);
      const signUrl = url && url !== "" && isValidFile(url) ? await global.storage.signUrl(url, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : undefined;
      if (!res.writableEnded) {
        res.status(200)
          .json({
            message: 'OK',
            url,
            signUrl,
          })
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500)
          .json({
            message: err,
          })
      }
    }
  });

File.route("/file/upload/image-pin").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const imageData = req.body.image;
  try {
    const base64EncodedString = imageData.replace(/^data:\w+\/\w+;base64,/, "");
    const fileBuffer = Buffer.from(base64EncodedString, "base64");

    const resultJPEG = await global.storage.uploadFromMemory(`signatures/${req.userId}.jpeg`, fileBuffer);
    const url = encodeURI(`https://${resultJPEG.bucket}/${resultJPEG.name}?generation=${resultJPEG.generation}`);
    const signUrl = url && url !== "" && isValidFile(url) ? await global.storage.signUrl(url, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : undefined;
    ElasticLoggerService().createHTTPResponse(req, res, 200, {
      message: "OK",
      data: {
        url,
        signUrl,
      },
    });
  } catch (err) {
    ElasticLoggerService().createHTTPErrorResponse(req, res, 500, { message: "Internal Server Error" }, err);
  }
});

File.route("/file/sign-url").post(RBAC.getInstance().isUserAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const url = req.body.url;
  const signUrl = await global.storage.signUrl(url, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
  if (!res.writableEnded)
    res.status(200).json({
      message: "OK",
      data: {
        url: signUrl,
      },
    });
});
File.route("/file/generate-sign-cookie").post(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const prefixUrl = req.body.prefixUrl;
  const url = req.body.url;
  const signPrefixCookie = await global.storage.signCookie(prefixUrl, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
  const signPrefixUrl = await global.storage.signUrlPrefix(prefixUrl, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
  const signUrl = await global.storage.signUrl(url, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
  if (!res.writableEnded)
    res.status(200).json({
      message: "OK",
      cookie: signPrefixCookie,
      prefixUrl: signPrefixUrl,
      url: signUrl,
    });
});

File.route("/file/dicom/copy").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const resultEMR = await global.medicalRecord.get(req.emrID, ["Kode_Cabang", "Tipe_Pasien", "Jenis_Pelayanan", "ID_Pelayanan", "No_MR", "Tanggal_Masuk", "Jam_Masuk", "Pasien"]);
  try {
    const fileBytes = await global.dicom.imageRendered(resultEMR.Kode_Cabang, {
      StudyInstanceUID: req.body.source.StudyInstanceUID,
      SeriesInstanceUID: req.body.source.SeriesInstanceUID,
      SOPInstanceUID: req.body.source.SOPInstanceUID,
    });
    const dicomMetadata = req.body.target;
    const result = await global.dicom.uploadImageFile(resultEMR.Kode_Cabang, dicomMetadata, fileBytes);
    const resultArrayDicom = await global.medicalRecord.addDicom(req.emrID, dicomMetadata);
    if (!res.writableEnded)
      res.status(200).json({ message: "OK", data: dicomMetadata });
  } catch (err) {
    ElasticLoggerService().createHTTPErrorResponse(
      req,
      res,
      500,
      {
        message: "Upload DICOM failed",
      },
      err,
    );
  }
});

File.route("/file/dicom/upload-image").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data: any = req.files;
    if (data === null) {
      if (!res.writableEnded)
        res.status(400).json({
          message: "Image File is required",
        });
      return;
    }
    const resultEMR = await global.medicalRecord.get(req.emrID, ["Kode_Cabang", "Tipe_Pasien", "Jenis_Pelayanan", "ID_Pelayanan", "No_MR", "Tanggal_Masuk", "Jam_Masuk", "Pasien"]);
    const operatorID = req.body.operator_id;
    const doctorID = req.body.doctor_id;
    var studyID = resultEMR.ID_Pelayanan;
    if (resultEMR.Jenis_Pelayanan == "RawatInap") {
      studyID = moment.unix(parseInt(resultEMR.Tanggal_Masuk)).format("YYYYMMDD") + resultEMR.Jam_Masuk.replace(/:/g, "");
    }
    const seriesDate = req.body.series_date.replace(/-/g, "");
    const seriesTime = req.body.series_time.replace(/:/g, "");
    const seriesDescription = req.body.series_description;
    const modalityID = req.body.modality_id;
    const modalityCode = req.body.modality_code;
    const modalityName = req.body.modality_name;

    // Data Dicom
    const hospitalCode = await global.medicalRecord.getHospitalCode(resultEMR.Kode_Cabang);
    const branchTimezone = await global.medicalRecord.getConfigValue(resultEMR.Kode_Cabang, "timezone");
    const employees = await global.medicalRecord.get(`Employee:{${resultEMR.Kode_Cabang}}:${resultEMR.Tipe_Pasien}`, ".");
    const dicomMetadata: IDicomMetadata = {
      StudyInstanceUID: global.dicom.generateNewUID(hospitalCode, resultEMR.Tipe_Pasien, studyID, false),
      SeriesInstanceUID: global.dicom.generateNewUID(hospitalCode, resultEMR.Tipe_Pasien, studyID, true),
      SOPInstanceUID: global.dicom.generateNewUID(hospitalCode, resultEMR.Tipe_Pasien, studyID, true),
      SOPClassUID: "1.2.840.10008.5.1.4.1.1.77.1.4",
      PatientID: resultEMR.Pasien.No_MR,
      PatientName: resultEMR.Pasien.Nama,
      PatientBirthDate: resultEMR.Pasien.Tgl_Lahir.replace(/-/g, ""),
      PatientSex: resultEMR.Pasien.Jenis_Kelamin === "Laki-Laki" ? "M" : "F",
      IssuerOfPatientID: resultEMR.Kode_Cabang,
      InstitutionName: await global.medicalRecord.getConfigValue(resultEMR.Kode_Cabang, "institution_name"),
      StudyID: studyID,
      StudyDate: moment.unix(parseInt(resultEMR.Tanggal_Masuk)).format("YYYYMMDD"),
      StudyTime: `${resultEMR.Jam_Masuk.replace(/:/g, "")}00`,
      SeriesDate: seriesDate,
      SeriesTime: seriesTime,
      SeriesDescription: seriesDescription,
      Modality: modalityCode,
      ModalityID: modalityID,
      ModalityName: modalityName,
      OperatorsName: jp.query(employees, `$[?(@.ID_Karyawan=='${operatorID}' && @.Status_Dokter==0 && @.Status_Perawat==1 && @.Status_Aktif==1)]`)[0].Nama,
      ReferringPhysicianName: jp.query(employees, `$[?(@.ID_Karyawan=='${doctorID}' && @.Status_Dokter==1 && @.Status_Perawat==0 && @.Status_Aktif==1)]`)[0].Nama,
      Created_At: moment().utcOffset(branchTimezone).format("YYYY-MM-DD HH:mm:ss"),
      Created_By: req.userId,
      Created_By_Name: req.userProfile.nama,
    };
    const resultThumbnail = await global.storage.uploadFromMemory(`images/${resultEMR.Kode_Cabang}/${resultEMR.Jenis_Pelayanan}/${moment.unix(resultEMR.Tanggal_Masuk).format("YYYY")}/${moment.unix(resultEMR.Tanggal_Masuk).format("MM")}/${resultEMR.Tipe_Pasien}/${resultEMR.No_MR}/${resultEMR.ID_Pelayanan}/${dicomMetadata.SOPInstanceUID}.jpg`, data.image_thumbnail.data);

    dicomMetadata.Thumbnail = encodeURI(`https://${resultThumbnail.bucket}/${resultThumbnail.name}?generation=${resultThumbnail.generation}`);
    await global.dicom.uploadImageFile(resultEMR.Kode_Cabang, dicomMetadata, data.image.data);
    const originalImage = await getOriginalDicom(dicomMetadata, resultEMR);
    if (originalImage) {
      dicomMetadata.Original = originalImage;
    }
    await global.medicalRecord.addDicom(req.emrID, dicomMetadata);
    if (!res.writableEnded) {
      res.status(200).json({ message: "OK", data: dicomMetadata });
    }
  } catch (err) {
    ElasticLoggerService().createHTTPErrorResponse(
      req,
      res,
      500,
      {
        message: "Upload DICOM failed",
      },
      err,
    );
  }
});

File.route("/file/dicom/patient").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const searchQuery = `\'@Kode_Cabang:${req.emrParams.Kode_Cabang} @No_MR:${req.emrParams.No_MR}\'`;
    const resultEMR = await global.medicalRecord.get(req.emrID, ["Kode_Cabang", "Tipe_Pasien", "Jenis_Pelayanan", "ID_Pelayanan", "No_MR", "Tanggal_Masuk", "Jam_Masuk", "Pasien"]);
    const result = await global.medicalRecord.find(searchQuery, {
      LIMIT: { from: 0, size: 10000 },
      RETURN: ["$.Kode_Cabang", "$.No_MR", "$.No_SEP", "$.Tanggal_Masuk", "$.Jam_Masuk", "$.Tipe_Pasien", "$.Jenis_Pelayanan", "$.ID_Pelayanan", "$.Created_Date", "$.Pasien", "$.Is_Batal", "$.Rawat_Jalan.ID_Dokter", "$.Rawat_Jalan.Nama_Dokter", "$.Rawat_Inap.ID_Dokter", "$.Rawat_Inap.Nama_Dokter"],
    });
  } catch (err) {}
});

File.route("/file/dicom/modality-list").get(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const modalityFromRedis = await global.medicalRecord.get("modality_mapping", ".");
    modalityFromRedis.sort((a: any, b: any) => {
      if (a.modality_name < b.modality_name) {
        return -1;
      }
      if (a.modality_name > b.modality_name) {
        return 1;
      }
      return 0;
    })
    if (modalityFromRedis && modalityFromRedis !== null) {
      if (!res.writableEnded) {
        res.status(200).json({
          message: "OK",
          data: {
            modality: modalityFromRedis,
          },
        });
      }
    }
    if (!modalityFromRedis || (modalityFromRedis && modalityFromRedis === null)) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: "Modality not found",
        });
      }
    }
  } catch (err) {
    ElasticLoggerService().createHTTPErrorResponse(
      req,
      res,
      500,
      {
        message: "Internal Server Error",
      },
      err,
    );
  }
});

File.route("/file/dicom/in_patient").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
  } catch (err) {}
});

File.route("/file/dicom/out_patient").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
  } catch (err) {}
});

File.route("/file/dicom/search").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const localDebug = debugEMR.extend(req.path);
  const sortDir = req.body.sort ?? 'DESC';
  localDebug(`Request Begin`);
  try {
    const emrKeys = ["Kode_Cabang", "No_MR", "Pasien"];
    const emrData = await global.medicalRecord.get(req.emrID, emrKeys);
    if (emrData && emrData !== null) {
      const searchQuery = `\'@Kode_Cabang:${emrData.Kode_Cabang} @No_MR:${emrData.No_MR}\'`;
      const result = await global.medicalRecord.find(searchQuery, {
        LIMIT: { from: 0, size: 10000 },
        RETURN: ["$.Kode_Cabang", "$.ID_Pelayanan", "$.No_MR", "$.Dicoms", "$.Rawat_Jalan", "$.Rawat_Inap", "$.Tanggal_Masuk"],
      });
      localDebug(`Search ${searchQuery}`);
      if (result && result !== null) {
        const records = result.documents;
        const isDicom = records && Array.isArray(records) && records.filter((record: any) => record.value["$.Dicoms"]);
        if (isDicom) {
          const finalDicom: any = [];
          for (let j = 0; j < isDicom.length; j += 1) {
            const objDicoms = JSON.parse(isDicom[j].value["$.Dicoms"]);
            const outpatient = JSON.parse(isDicom[j].value["$.Rawat_Jalan"]);
            const inpatient = JSON.parse(isDicom[j].value["$.Rawat_Inap"]);
            const treatmentDate = JSON.parse(isDicom[j].value["$.Tanggal_Masuk"]);
            const emrKeysId = ["Kode_Cabang", "No_MR", "Tipe_Pasien", "Tanggal_Masuk", 'ID_Pelayanan', 'Jenis_Pelayanan'];
            const emrDataId = await global.medicalRecord.get(isDicom[j].id, emrKeysId);
            let treatmentId = ''
            if (isDicom[j].value["$.ID_Pelayanan"] && isDicom[j].value["$.ID_Pelayanan"].includes('_')) {
              treatmentId = isDicom[j].value["$.ID_Pelayanan"];
            } else {
              treatmentId = JSON.parse(isDicom[j].value["$.ID_Pelayanan"]);
            }
            if (objDicoms && objDicoms.length > 0) {
              for (let i = 0; i < objDicoms.length; i += 1) {
                if (objDicoms[i].PDF && objDicoms[i].PDF !== '' && isValidFile(objDicoms[i].PDF)) {
                  objDicoms[i].PDF = await global.storage.signUrl(objDicoms[i].PDF, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
                }
                if (objDicoms[i].Original && objDicoms[i].Original !== '' && isValidFile(objDicoms[i].Original)) {
                  objDicoms[i].Original = await global.storage.signUrl(objDicoms[i].Original, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
                }
                objDicoms[i].Thumbnail = objDicoms[i].Thumbnail && objDicoms[i].Thumbnail !== "" && isValidFile(objDicoms[i].Thumbnail) ? await global.storage.signUrl(objDicoms[i].Thumbnail, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : undefined;
                objDicoms[i].Viewer = `${global.dicom.getUrl(emrData.Kode_Cabang, objDicoms[i].StudyInstanceUID)}&Token=${req.token}`;
              }
              finalDicom.push({
                EMR_ID: isDicom[j].id,
                MRNumber: emrData.No_MR,
                DoctorName: emrDataId?.Jenis_Pelayanan === 'RawatJalan' ? outpatient.Nama_Dokter : emrDataId?.Jenis_Pelayanan === 'RawatInap' ? inpatient.Nama_Dokter : '',
                TreatmentDate: moment.unix(parseInt(treatmentDate)).format("YYYY-MM-DD"),
                TreatmentNumber: treatmentId ? treatmentId : "",
                StudyInstanceUID: objDicoms && objDicoms.length > 0 ? objDicoms[0].StudyInstanceUID : "",
                PatientName: objDicoms && objDicoms.length > 0 ? objDicoms[0].PatientName : "",
                Instance: objDicoms,
              });
            }
          }
          finalDicom.sort((a: any, b: any) => {
            if (sortDir === "ASC") {
              return moment(a.TreatmentDate).unix() - moment(b.TreatmentDate).unix();
            } else if (sortDir === "DESC") {
              return moment(b.TreatmentDate).unix() - moment(a.TreatmentDate).unix();
            }
          });
          ElasticLoggerService().createLog(req, "/file/dicom/search", "OK");
          if (!res.writableEnded) {
            res.status(200).json({
              message: "OK",
              data: {
                No_MR: emrData.No_MR,
                Treatment_Episode: finalDicom,
              },
            });
          }
        }
      }
    }
    if (!emrData || (emrData && emrData === null)) {
      const errorMessage = "Patient data not found";
      ElasticLoggerService().createErrorLog(req, "/file/dicom/search", errorMessage);
      if (!res.writableEnded) {
        res.status(500).json({
          message: errorMessage,
        });
      }
    }
    localDebug(`Merge Data, Sign Thumbnail URL & OHIF Viewer URL`);
  } catch (err) {
    ElasticLoggerService().createErrorLog(req, "/file/dicom/search", `${err}`);
    if (!res.writableEnded) {
      res.status(500).json({
        message: `${err}`,
      });
    }
  }
  localDebug(`Request End`);
});

File.route('/file/dicom/generate-original')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const dataToPost = req.body;
      const emrKeys = ["Kode_Cabang", "No_MR", "Pasien", "Tipe_Pasien"];
      const emrData = await global.medicalRecord.get(req.emrID, emrKeys);
      const dicomData = (await global.medicalRecord.get(req.emrID, `$.Dicoms[?(@.StudyInstanceUID=='${dataToPost.StudyInstanceUID}'&&@.SeriesInstanceUID=='${dataToPost.SeriesInstanceUID}'&&@.SOPInstanceUID=='${dataToPost.SOPInstanceUID}')]`))[0]

      if (emrData && emrData !== null && dicomData && dicomData !== null) {
        const urlOriginalImage = await getOriginalDicom(dataToPost, emrData);
        dicomData.Original = urlOriginalImage;
        await global.medicalRecord.update(req.emrID, `$.Dicoms[?(@.SOPInstanceUID=='${dataToPost.SOPInstanceUID}')]`, dicomData);
        if (!res.writableEnded) {
          ElasticLoggerService().createLog(req, '/file/dicom/generate-original', 'OK')
          res.status(200).json({
            message: 'OK',
          })
        }
      } else {
        if (!res.writableEnded) {
          ElasticLoggerService().createErrorLog(req, '/file/dicom/generate-original', 'No Data')
          res.status(500).json({
            message: 'No Data',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        ElasticLoggerService().createErrorLog(req, '/file/dicom/generate-original', err)
        res.status(500).json({
          message: err,
        })
      }
    }
  });

File.route('/file/dicom/download-pdf').post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response): Promise<void> => {
  const resultEMR = await global.medicalRecord.get(req.emrID, ["Kode_Cabang", "Tipe_Pasien", "Jenis_Pelayanan", "ID_Pelayanan", "No_MR", "Tanggal_Masuk", "Jam_Masuk", "Pasien"]);
  const dicomMetadata: IDicomMetadata = {
    StudyInstanceUID: req.body.StudyInstanceUID,
    SeriesInstanceUID: req.body.SeriesInstanceUID,
    SOPInstanceUID: req.body.SOPInstanceUID,
  };
  var url:string = '';
  var signUrl:string = '';

  try {
    const branchTimezone = await global.medicalRecord.getConfigValue(resultEMR.Kode_Cabang, "timezone");
    const dicomData = (await global.medicalRecord.get(req.emrID, `$.Dicoms[?(@.StudyInstanceUID=='${dicomMetadata.StudyInstanceUID}'&&@.SeriesInstanceUID=='${dicomMetadata.SeriesInstanceUID}'&&@.SOPInstanceUID=='${dicomMetadata.SOPInstanceUID}')]`))[0]
    if (dicomData['PDF']) {
      url = dicomData.PDF;
      signUrl = (isValidFile(url) ? (await global.storage.signUrl(url, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))) : undefined);
    } else {
      const fileBytes = await global.dicom.imageRendered(resultEMR.Kode_Cabang, dicomMetadata);
      const destination = `images/${resultEMR.Kode_Cabang}/${resultEMR.Jenis_Pelayanan}/${moment.unix(resultEMR.Tanggal_Masuk).format("YYYY")}/${moment.unix(resultEMR.Tanggal_Masuk).format("MM")}/${resultEMR.Tipe_Pasien}/${resultEMR.No_MR}/${resultEMR.ID_Pelayanan}/${dicomMetadata.SOPInstanceUID}_original.jpg`;

      if (!(await global.storage.existsGCSUrl(destination))) {
        const resultOriginal = await global.storage.uploadFromMemory(destination, fileBytes);
        url = encodeURI(`https://${resultOriginal.bucket}/${resultOriginal.name}?generation=${resultOriginal.generation}`);

        signUrl = url && url !== "" && isValidFile(url) ? await global.storage.signUrl(url, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : undefined;
      } else {
        const resultOriginal = await global.storage.getMetadata(destination);
        url = encodeURI(`https://${resultOriginal.bucket}/${resultOriginal.name}?generation=${resultOriginal.generation}`);
        signUrl = url && url !== "" && isValidFile(url) ? await global.storage.signUrl(url, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : undefined;
      }

      const data = {
        alat_pemeriksaan: dicomData.ModalityName,
        tgl_berobat: dicomData.StudyDate,
        mr: dicomData.PatientID,
        nama: dicomData.PatientName,
        dokter_berobat: dicomData.ReferringPhysicianName,
        perawat: dicomData.OperatorsName,
        gambar_diagnostik: signUrl
      };
      // const pdfx = await global.storage.convertDocToPdf(resultEMR.Kode_Cabang, "lampiran_diagnostik", data);

      const pdfx = await global.storage.convertDocToPdf2(
        req.emrParams.Kode_Cabang,
        'diagnostik_hasil-pemeriksaan',
        req.body.emr_id,
        '',
        data,
      );

      if (pdfx && pdfx !== null) {
        const resultPDF = await global.storage.uploadFromMemory(`pdfs/${resultEMR.Kode_Cabang}/${resultEMR.Jenis_Pelayanan}/${moment.unix(resultEMR.Tanggal_Masuk).format("YYYY")}/${moment.unix(resultEMR.Tanggal_Masuk).format("MM")}/${resultEMR.Tipe_Pasien}/${resultEMR.No_MR}/${resultEMR.ID_Pelayanan}/lampiran_diagnostik_${moment().utcOffset(branchTimezone).format("YYYYMMDDHHmmss")}.pdf`, pdfx);

        // Save PDF URL
        url = encodeURI(`https://${resultPDF.bucket}/${resultPDF.name}?generation=${resultPDF.generation}`);

        // Signed URL
        signUrl = url && url !== "" && isValidFile(url) ? await global.storage.signUrl(url, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : undefined;

        dicomData['PDF'] = url;
        await global.medicalRecord.update(req.emrID, `$.Dicoms[?(@.SOPInstanceUID=='${dicomMetadata.SOPInstanceUID}')]`, dicomData);
      }
    }

    if (!res.writableEnded) {
      res.status(200).json({
        message: 'OK',
        data: {
          url,
          signUrl,
        }
      })
    }
  } catch (err) {
    console.error("Retrieve Image URL of DICOM instance failed: ");
    console.error(err);
    if (!res.writableEnded) {
      res.status(500).json({
        message: "Retrieve Image URL of DICOM instance failed",
        error: err,
      });
    }
  }
});

File.route('/file/dicom/add-pdf')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response): Promise<void> => {
    const dataToPost = req.body;
    try {
      if (dataToPost && req.emrID) {
        const dicomData = await global.medicalRecord.get(req.emrID, `$.Dicoms[?(@.StudyInstanceUID=='${dataToPost.StudyInstanceUID}'&&@.SeriesInstanceUID=='${dataToPost.SeriesInstanceUID}'&&@.SOPInstanceUID=='${dataToPost.SOPInstanceUID}')]`)

        if (dicomData && dicomData !== null && Array.isArray(dicomData) && dicomData.length > 0) {
          const oldData = dicomData[0]
          const data = {
            ...dicomData[0],
            PDF: dataToPost.pdf_url,
          };
          const diff = jsonpatch.compare(oldData, data);
          const patch = [];
          for (let i = 0; i < diff.length; i++) {
            if (diff[i].op === "add" || diff[i].op === "replace") patch.push(diff[i]);
          }
          const updateDocument = jsonpatch.applyPatch(oldData, patch);
          await global.medicalRecord.update(req.emrID, `$.Dicoms[?(@.StudyInstanceUID=='${dataToPost.StudyInstanceUID}'&&@.SeriesInstanceUID=='${dataToPost.SeriesInstanceUID}'&&@.SOPInstanceUID=='${dataToPost.SOPInstanceUID}')]`, updateDocument.newDocument);
          ElasticLoggerService().createLog(req, '/file/dicom/add-pdf', 'OK');
          if (!res.writableEnded) {
            res.status(200).json({
              message: 'OK',
            })
          }
        } else {
          ElasticLoggerService().createErrorLog(req, '/file/dicom/add-pdf', 'Dicom Data Not Found');
          if (!res.writableEnded) {
            res.status(500).json({
              message: 'Dicom Data Not Found',
            })
          }
        }
      } else {
        if (!res.writableEnded) {
          ElasticLoggerService().createErrorLog(req, '/file/dicom/add-pdf', 'EMR_ID not provided');
          res.status(500).json({
            message: 'EMR_ID not provided',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        ElasticLoggerService().createErrorLog(req, '/file/dicom/add-pdf', err);
        res.status(500).json({
          message: err,
        })
      }
    }
  })

File.route("/file/dicom/metadata").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const resultEMR = await global.medicalRecord.get(req.emrID, ["Kode_Cabang", "Tipe_Pasien", "Jenis_Pelayanan", "ID_Pelayanan", "No_MR", "Tanggal_Masuk", "Jam_Masuk", "Pasien"]);
  const dicomMetadata: IDicomMetadata = {
    StudyInstanceUID: req.body.StudyInstanceUID,
    SeriesInstanceUID: req.body.SeriesInstanceUID,
    SOPInstanceUID: req.body.SOPInstanceUID,
  };


  try {
    const metadata = await global.dicom.metadata(resultEMR.Kode_Cabang, dicomMetadata);
    if (!res.writableEnded)
      res.status(200).json(metadata);
  } catch (err) {
    console.error("Retrieve Metadata DICOM study failed: ");
    console.error(err);
    if (!res.writableEnded)
      res.status(200).json({ message: "Retrieve Metadata DICOM study failed" });
  }
});

File.route("/file/dicom/image_url").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const resultEMR = await global.medicalRecord.get(req.emrID, ["Kode_Cabang", "Tipe_Pasien", "Jenis_Pelayanan", "ID_Pelayanan", "No_MR", "Tanggal_Masuk", "Jam_Masuk", "Pasien"]);
  const dicomMetadata: IDicomMetadata = {
    StudyInstanceUID: req.body.StudyInstanceUID,
    SeriesInstanceUID: req.body.SeriesInstanceUID,
    SOPInstanceUID: req.body.SOPInstanceUID,
  };

  try {
    const fileBytes = await global.dicom.imageRendered(resultEMR.Kode_Cabang, dicomMetadata);
    const destination = `images/${resultEMR.Kode_Cabang}/${resultEMR.Jenis_Pelayanan}/${moment.unix(resultEMR.Tanggal_Masuk).format("YYYY")}/${moment.unix(resultEMR.Tanggal_Masuk).format("MM")}/${resultEMR.Tipe_Pasien}/${resultEMR.No_MR}/${resultEMR.ID_Pelayanan}/${dicomMetadata.SOPInstanceUID}_original.png`;
    var signUrl:string = '';
    if (!(await global.storage.existsGCSUrl(destination))) {
      const resultOriginal = await global.storage.uploadFromMemory(destination, fileBytes);
      const url = encodeURI(`https://${resultOriginal.bucket}/${resultOriginal.name}?generation=${resultOriginal.generation}`);

      signUrl = url && url !== "" && isValidFile(url) ? await global.storage.signUrl(url, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : undefined;
    } else {
      const resultOriginal = await global.storage.getMetadata(destination);
      const url = encodeURI(`https://${resultOriginal.bucket}/${resultOriginal.name}?generation=${resultOriginal.generation}`);
      signUrl = url && url !== "" && isValidFile(url) ? await global.storage.signUrl(url, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : undefined;
    }

    if (!res.writableEnded)
      res.status(200).json({
        message: "OK",
        signUrl: signUrl
      })
  } catch (err) {
    console.error("Retrieve Image URL of DICOM instance failed: ");
    console.error(err);
    if (!res.writableEnded)
      res.status(200).json({ message: "Retrieve Image URL of DICOM instance failed" });
  }
});

File.route("/file/dicom/rendered").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const resultEMR = await global.medicalRecord.get(req.emrID, ["Kode_Cabang", "Tipe_Pasien", "Jenis_Pelayanan", "ID_Pelayanan", "No_MR", "Tanggal_Masuk", "Jam_Masuk", "Pasien"]);

  const dicomMetadata: IDicomMetadata = {
    StudyInstanceUID: req.body.StudyInstanceUID,
    SeriesInstanceUID: req.body.SeriesInstanceUID,
    SOPInstanceUID: req.body.SOPInstanceUID,
  };

  try {
    const fileBytes = await global.dicom.imageRendered(resultEMR.Kode_Cabang, dicomMetadata);
    if (!res.writableEnded)
      res.status(200).set({
        "Cache-Control": "no-cache",
        "Content-Type": "image/jpeg",
        "Content-Length": fileBytes.length,
        "Content-Disposition": `attachment; filename=${dicomMetadata.StudyInstanceUID}.jpg`,
      }).send(fileBytes);
  } catch (err) {
    console.error("Retrieve Rendered DICOM study failed: ");
    console.error(err);
    if (!res.writableEnded)
      res.status(200).json({ message: "Retrieve Rendered DICOM study failed" });
  }
});

File.route("/file/dicom/download").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const resultEMR = await global.medicalRecord.get(req.emrID, ["Kode_Cabang", "Tipe_Pasien", "Jenis_Pelayanan", "ID_Pelayanan", "No_MR", "Tanggal_Masuk", "Jam_Masuk", "Pasien"]);

  const dicomMetadata: IDicomMetadata = {
    StudyInstanceUID: req.body.StudyInstanceUID,
    SeriesInstanceUID: req.body.SeriesInstanceUID,
    SOPInstanceUID: req.body.SOPInstanceUID,
  };

  try {
    const fileBytes = await global.dicom.download(resultEMR.Kode_Cabang, dicomMetadata);
    if (!res.writableEnded)
      res.status(200).set({
        "Cache-Control": "no-cache",
        "Content-Type": "application/dicom; transfer-syntax=*",
        "Content-Length": fileBytes.length,
        "Content-Disposition": `attachment; filename=${dicomMetadata.StudyInstanceUID}.dcm`,
      }).send(fileBytes);
  } catch (err) {
    console.error("Retrieve Rendered DICOM study failed: ");
    console.error(err);
    if (!res.writableEnded)
      res.status(200).json({ message: "Retrieve Rendered DICOM study failed" });
  }
});

File.route("/file/dicom/delete").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const SOPInstanceUID = req.body.SOPInstanceUID;
    const resultEMR = await global.medicalRecord.get(req.emrID, ["Kode_Cabang", "Tipe_Pasien", "Jenis_Pelayanan", "ID_Pelayanan", "No_MR", "Tanggal_Masuk", "Jam_Masuk", "Pasien", `.Dicoms[?(@.SOPInstanceUID=="${SOPInstanceUID}")]`]);
    const dicomObj = resultEMR[`.Dicoms[?(@.SOPInstanceUID=="${SOPInstanceUID}")]`];
    const resultDeleteInEMR = await global.medicalRecord.deleteDicom(req.emrID, SOPInstanceUID);
    const resultDeleteInGoogleHealthcare = await global.dicom.delete(resultEMR["Kode_Cabang"], dicomObj["StudyInstanceUID"], dicomObj["SeriesInstanceUID"], dicomObj["SOPInstanceUID"]);
    await global.storage.delete(dicomObj.Thumbnail);
    ElasticLoggerService().createLog(req, '/file/dicom/delete', 'OK')
    if (!res.writableEnded) {
      res.status(200).json({ message: "Deleted DICOM study success" });
    }
  } catch (err) {
    ElasticLoggerService().createErrorLog(req, '/file/dicom/delete', err)
    if (!res.writableEnded) {
      res.status(500).json({
        message: "Delete DICOM study failed",
        error: `${err}`,
      });
    }
  }
});

export { File };
