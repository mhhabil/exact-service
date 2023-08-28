import moment from "moment";
import { Router, Request, Response, NextFunction } from "express";
import RBAC from "../../../services/rbac";
const jp = require("jsonpath");
import * as jsonpatch from "fast-json-patch";
import { v4 as uuid } from "uuid";
const debugEMR = require("debug")("emr");
import { ElasticLoggerService, SimrsService } from "./services";
import { isValidFile } from "./helpers/app.helper";
import { EdukasiHarian } from "./interfaces/daily-education/daily-education.model";
const EH = Router();

EH.route('/edukasi-harian/process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const localDebug = debugEMR.extend(req.path);
    localDebug(`Request Begin`);
    let responseMessage: string = '';
    try {
      const emrKeys = ["Kode_Cabang", "No_MR", "Pasien", "Tipe_Pasien"];
      const id = req.body["ID"];
      const fields = await global.medicalRecord.getFields(req.emrID, req.body.fields || []);
      const emrData = await global.medicalRecord.get(req.emrID, emrKeys);
      localDebug(`Get Data ${req.emrID}`);
      if (emrData && emrData !== null) {
        const educationProvider = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${req.body['id-pemberi-edukasi']}'&&@.Status_Aktif==1)]`)

        const jsonData = EdukasiHarian.createFromJson(req.body);
        const fixedData = {
          ...jsonData,
          Nama_Pemberi_Edukasi: (educationProvider && Array.isArray(educationProvider) && educationProvider.length > 0 && educationProvider[0].Nama) ? educationProvider[0].Nama : '',
          Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
          Updated_By: (req.userId) ? req.userId : '',
        }

        if (!id || id === '') {
          const redisJsonData: IEdukasiHarian = {
            ...fixedData,
            ID: uuid().replace(/-/g, "").toUpperCase(),
            ID_Petugas: req.userId ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
          }
          await global.medicalRecord.addEdukasiHarian(req.emrID, redisJsonData);
          responseMessage = 'Data berhasil ditambah';
        } else {
          const searchQuery = `\'@Kode_Cabang:${emrData.Kode_Cabang} @No_MR:${emrData.No_MR} "${id}"\'`;
          const result = await global.medicalRecord.findEdukasiHarian(searchQuery, {
            RETURN: ["$.Kode_Cabang", "$.No_MR", `$.Common.Edukasi_Harian[?(@.ID=="${id}")]`],
          });
          localDebug(`Search ${searchQuery}`);

          let data: any;
          if (result.documents.length > 0) {
            data = JSON.parse(result.documents[0].value[`$.Common.Edukasi_Harian[?(@.ID=="${id}")]`]);
            if (data["Deleted"] && data["Deleted"] === 1) {
              data = {};
            } else {
              // update EdukasiHarian
              const redisJsonData: IEdukasiHarian = {
                ...fixedData,
                ID: id ? id : '',
                ID_Petugas: data.ID_Petugas ? data.ID_Petugas : '',
                Nama_Petugas: data.Nama_Petugas ? data.Nama_Petugas : '',
              }
              const diff = jsonpatch.compare(data, redisJsonData);
              const patch = [];
              for (let i = 0; i < diff.length; i++) {
                if (diff[i].op === "add" || diff[i].op === "replace") patch.push(diff[i]);
              }
              localDebug(`Compare Data ${patch}`);

              const updateDocument = jsonpatch.applyPatch(data, patch);
              localDebug(`Prepare Data ${patch}`);
              await global.medicalRecord.update(req.emrID, `$.Common.Edukasi_Harian[?(@.ID=="${id}")]`, updateDocument.newDocument);
              localDebug(`Update Data ${patch}`);
              responseMessage = "Data berhasil diubah";
            }
          } else {
            throw new Error("No Data");
          }
        }
        ElasticLoggerService().createHTTPResponse(req, res, 200, {
          message: responseMessage,
        });
      }
      if (!emrData || (emrData && emrData === null)) {
        ElasticLoggerService().createHTTPResponse(req, res, 404, {
          message: "EMR Data Not Found",
        });
      }
    } catch (err) {
      localDebug(`Error ${err}`);
      ElasticLoggerService().createHTTPResponse(req, res, 500, {
        message: "Internal Server Error",
        error: err,
      });
    }
  });

EH.route('/edukasi-harian/view')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const localDebug = debugEMR.extend(req.path);
    localDebug(`Request Begin`);
    const emrKeys = ["Kode_Cabang", "No_MR", "Pasien"];
    const edukasiId = req.body["item-id"];

    const emrData = await global.medicalRecord.get(req.emrID, emrKeys);
    if (emrData === null) {
      ElasticLoggerService().createHTTPResponse(req, res, 404, {
        message: "EMR Data Not Found",
      });
    } else {
      try {
        const searchQuery = `\'@Kode_Cabang:${emrData.Kode_Cabang} @No_MR:${emrData.No_MR} "${edukasiId}"\'`;
        const result = await global.medicalRecord.findEdukasiHarian(searchQuery, {
          RETURN: ["$.Kode_Cabang", "$.No_MR", `$.Common.Edukasi_Harian[?(@.ID=="${edukasiId}")]`],
        });
        localDebug(`Search ${searchQuery}`);

        if (result.documents.length > 0) {
          const data = JSON.parse(result.documents[0].value[`$.Common.Edukasi_Harian[?(@.ID=="${edukasiId}")]`]);

          if (data && data !== null && (!data.Deleted || (data.Deleted && data.Deleted !== 1))) {
            data.EMR_ID = result.documents[0].id ? result.documents[0].id : '';

            data.TTD_Pemberi_Edukasi = (data.TTD_Pemberi_Edukasi && data.TTD_Pemberi_Edukasi !== '' && isValidFile(data.TTD_Pemberi_Edukasi)) ? await global.storage.signUrl(data.TTD_Pemberi_Edukasi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

            data.Tanda_Tangan = (data.Tanda_Tangan && data.Tanda_Tangan !== '' && isValidFile(data.Tanda_Tangan)) ? await global.storage.signUrl(data.Tanda_Tangan, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

            if (!res.writableEnded) {
              res.status(200).json({
                message: "OK",
                data,
              });
            }
          }

          if (data && data.Deleted && data.Deleted === 1) {
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                data: {},
              })
            }
          }

        }
      } catch (err) {
        localDebug(`Error ${err}`);
        ElasticLoggerService().createHTTPResponse(req, res, 500, {
          message: "Internal Server Error",
          error: err,
        });
      }
      localDebug(`Request End`);
    }
  });

EH.route('/edukasi-harian/item')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const localDebug = debugEMR.extend(req.path);
    localDebug(`Request Begin`);

    const limit = req.body.limit || 100;
    const offset: number = req.body.offset || 0;
    const sortDir = req.body.sort || "ASC";
    const emrKeys = ["Kode_Cabang", "No_MR", "Pasien"];
    const emrData = await global.medicalRecord.get(req.emrID, emrKeys);
    if (emrData === null) {
      ElasticLoggerService().createHTTPResponse(req, res, 404, {
        message: "EMR Data Not Found",
      });
    } else {
      localDebug(`Get EMR Data ${JSON.stringify(emrData)}`);
      const fields = await global.medicalRecord.getFields(req.emrID, req.body.fields || []);
      localDebug(`Get Fields ${JSON.stringify(req.body.fields)}`);

      const searchQuery = `\'@Kode_Cabang:${emrData.Kode_Cabang} @No_MR:${emrData.No_MR}\'`;
      const result = await global.medicalRecord.find(searchQuery, {
        LIMIT: { from: 0, size: 10000 },
        RETURN: ["$.Kode_Cabang", "$.No_MR", "$.Common.Edukasi_Harian"],
      });
      localDebug(`Search ${searchQuery}`);
      localDebug(result);
      let records: any = [];
      // Merge EdukasiHarian from multiple visits
      for (let i = 0; i < result.documents.length; i++) {
        if (result.documents[i].value["$.Common.Edukasi_Harian"] !== undefined) {
          const objDailyEdu = JSON.parse(result.documents[i].value["$.Common.Edukasi_Harian"]);
          for (let j = 0; j < objDailyEdu.length; j++) {
            objDailyEdu[j]["EMR_ID"] = result.documents[i].id;
          }
          records = records.concat(objDailyEdu);
        }
      }
      localDebug(`Merge Data`);

      const total = records.length;
      // Sort EdukasiHarian based on param direction
      records.sort((a: any, b: any) => {
        if (sortDir === "ASC") {
          return moment(a.Waktu).unix() - moment(b.Waktu).unix();
        } else if (sortDir === "DESC") {
          return moment(b.Waktu).unix() - moment(a.Waktu).unix();
        }
      });
      localDebug(`Sort Data`);

      // Show based on param offset and param limit
      records = records.slice(offset, offset + limit > records.length ? records.length : offset + limit);
      localDebug(`Slice Data`);

      records = records.filter((val: any) => !val.Deleted || (val.Deleted && val.Deleted !== 1))

      // Show just used fields
      for (let i = 0; i < records.length; i++) {
        records[i].TTD_Pemberi_Edukasi = (records[i].TTD_Pemberi_Edukasi && records[i].TTD_Pemberi_Edukasi !== '' && isValidFile(records[i].TTD_Pemberi_Edukasi)) ? await global.storage.signUrl(records[i].TTD_Pemberi_Edukasi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        records[i].Tanda_Tangan = (records[i].Tanda_Tangan && records[i].Tanda_Tangan !== '' && isValidFile(records[i].Tanda_Tangan)) ? await global.storage.signUrl(records[i].Tanda_Tangan, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';
      }
      localDebug(`Create Custom Data`);

      if (!res.writableEnded) {
        res.status(200).json({
          message: "OK",
          data: {
            total,
            totalFiltered: records.length,
            EMR_ID: req.emrID,
            pasien: emrData.Pasien,
            records,
            fields,
          },
        });
      }
    }
    localDebug(`Request End`);
  });

EH.route('/edukasi-harian/delete')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const emrKeys = ["Kode_Cabang", "No_MR", "Pasien"];
      const edukasiId = req.body['item-id'];
      const emrData = await global.medicalRecord.get(req.emrID, emrKeys);

      if (emrData && emrData !== null) {
        if (edukasiId && edukasiId !== null) {
          const searchQuery = `\'@Kode_Cabang:${emrData.Kode_Cabang} @No_MR:${emrData.No_MR} "${edukasiId}"\'`;
          const result = await global.medicalRecord.findEdukasiHarian(searchQuery, {
            RETURN: ["$.Kode_Cabang", "$.No_MR", `$.Common.Edukasi_Harian[?(@.ID=="${edukasiId}")]`],
          });

          if (result.documents.length > 0) {
            const oldData = JSON.parse(result.documents[0].value[`$.Common.Edukasi_Harian[?(@.ID=="${edukasiId}")]`]);

            let data = JSON.parse(result.documents[0].value[`$.Common.Edukasi_Harian[?(@.ID=="${edukasiId}")]`]);

            if (data["Deleted"] && data["Deleted"] === 1) {
              data = {};
              ElasticLoggerService().createHTTPResponse(req, res, 404, {
                message: "File Has Been Deleted",
              });
            } else {
              // update Edukasi_Harian
              data.Deleted = 1;
              data.Deleted_At = moment().format("YYYY-MM-DD HH:mm:ss");
              data.Deleted_By = req.userId;
              data.Deleted_By_Nama = req.userProfile.nama;

              const diff = jsonpatch.compare(oldData, data);
              const patch = [];
              for (let i = 0; i < diff.length; i++) {
                if (diff[i].op === "add" || diff[i].op === "replace") patch.push(diff[i]);
              }
              const updateDocument = jsonpatch.applyPatch(oldData, patch);
              await global.medicalRecord.update(req.emrID, `$.Common.Edukasi_Harian[?(@.ID=="${edukasiId}")]`, updateDocument.newDocument);
              ElasticLoggerService().createHTTPResponse(req, res, 200, {
                message: "OK",
              });
            }
          } else {
            ElasticLoggerService().createHTTPResponse(req, res, 500, {
              message: "Data Not Found",
            });
            throw new Error("No Data");
          }
        }
        if (!edukasiId || (edukasiId && edukasiId === null)) {
          ElasticLoggerService().createHTTPResponse(req, res, 500, {
            message: "No Edukasi Harian ID",
          });
        }
      }
      if (!emrData || (emrData && emrData === null)) {
        ElasticLoggerService().createHTTPResponse(req, res, 500, {
          message: "EMR Data Not Found",
        });
      }
    } catch (err) {
      ElasticLoggerService().createHTTPResponse(req, res, 500, {
        message: `${err}`,
      });
    }
  })

export { EH };
