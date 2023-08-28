import { RedisClientOptions, createClient } from "redis";
import * as url from "url";
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const short = require("short-uuid");
var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');
import delay from "delay";
const path = require("path");
const ImageModule = require("docxtemplater-image-module");
const https = require("https");
import moment from "moment";
const http = require("http");
const Stream = require("stream").Transform;
const {JSONPath} = require('jsonpath-plus');
import { PDFEngine } from "chromiumly";
const { Storage } = require("@google-cloud/storage");
const googleDrive = require("@googleapis/drive");
const drive = googleDrive.drive({
  version: "v3",
  auth: new googleDrive.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file"],
  }),
});
const base64Regex = /^data:image\/(png|jpg|svg|svg\+xml);base64,/;
const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);

const apm = require("elastic-apm-node");

import { spawn } from 'child_process';

function getHttpData(url:string, callback:any) {
  var req = (url.substr(0, 5) === "https" ? https : http)
    .request(url, function (response:any) {
      if (response.statusCode !== 200) {
        return callback(
          new Error(
            `Request to ${url} failed, status code: ${response.statusCode}`
          )
        );
      }

      const data = new Stream();
      response.on("data", function (chunk:any) {
        data.push(chunk);
      });
      response.on("end", function () {
        responded = true;
        callback(null, data.read());
      });
      response.on("error", function (e:any) {
        console.log(e)
        callback(e);
      });
    });
  var responded = false;
  req.on("error", function(e:any) {
    if (responded)
      return;
    responded = true;
    return callback(e);
  });
  req.end();
}

function base64Parser(dataURL:string) {
  if (
    typeof dataURL !== "string" ||
        !base64Regex.test(dataURL)
  ) {
    return false;
  }
  const stringBase64 = dataURL.replace(base64Regex, "");

  // For nodejs
  if (typeof Buffer !== "undefined" && Buffer.from) {
    return Buffer.from(stringBase64, "base64");
  }

  // For browsers :
  const binaryString = window.atob(stringBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    const ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
  }
  return bytes.buffer;
}

class StorageService {
  readonly prefix: string = "Storage:";
  private client: any;
  private storage: any;
  private bucketName: string;
  private keyName: string;
  private keyValue: string;
  /*
	constructor(keyFilename:string, bucketName:string, options:RedisClientOptions){
		this.storage = new Storage({keyFilename: keyFilename})
		this.bucketName = bucketName
		this.client = createClient(options)
		this.client.on('error', (err:any) => console.log('Redis Client Error', err));
	}
	*/
  constructor(bucketName: string, keyName: string, keyValue: string, options: RedisClientOptions) {
    this.storage = new Storage();
    this.bucketName = bucketName;
    this.keyName = keyName;
    this.keyValue = keyValue;
    this.client = createClient(options);
    this.client.on("error", (err: any) => console.log("Redis Client Error", err));
  }

  async connect() {
    await this.client.connect();
  }

  async convertDocToPdf3(branchCode:string, formName:string, emrID:string, rowFilter:string, data:any, converter?:string) {
    try {
      const formFilename = await global.medicalRecord.get(`Config:{${branchCode}}`, [`.word_templates_gcs.${formName.replace("/","_")}`]);
      var pathname = `docs/${branchCode}/${formFilename}`;
      var directory = __dirname;
      if (!fs.existsSync(path.resolve(__dirname, pathname))) {
        var paths: Array<string> = pathname.split("/");
        for (var i = 0; i < paths.length - 1; i++) {
          if (paths[i] != "") {
            directory = `${directory}/${paths[i]}`;
            if (!fs.existsSync(directory)) {
              fs.mkdirSync(directory);
            }
          }
        }
        var filename = `${directory}/${paths[paths.length - 1]}`;
        const file = await this.storage.bucket(this.bucketName).file(pathname);
        const contentDownload = await file.download({
          destination: filename,
        });
      }

      const content = fs.readFileSync(path.resolve(__dirname, pathname), "binary");
      const zip = new PizZip(content);

      const imageOpts = {
        getImage: function (tagValue:any, tagName:string) {
          const base64Value = base64Parser(tagValue);
          if (base64Value) {
            return base64Value;
          }
          // tagValue is "https://docxtemplater.com/xt-pro-white.png"
          // tagName is "image"
          return new Promise(function (resolve:any, reject:any) {
            getHttpData(tagValue, function (err:any, data:Buffer) {
              if (err) {
                return reject(err);
              }
              resolve(data);
            });
          });
        },
        // getImage: as usual
        getSize: function (img:Buffer, tagValue:any, tagName:string, context:any) {
          const part = context.part;
          if (part.module === "open-xml-templating/docxtemplater-replace-image-module") {
            return [
              part.width,
              part.height
            ]
          }
          const sizeOf = require("image-size");
          const sizeObj = sizeOf(img);
          const maxWidth = context.part.containerWidth;
          const maxHeight =
                  context.part.containerHeight ||
                  context.part.containerWidth;

          const widthRatio = sizeObj.width / maxWidth;
          const heightRatio = sizeObj.height / maxHeight;
          if (widthRatio < 1 && heightRatio < 1) {
            return [sizeObj.width, sizeObj.height];
          }
          let finalWidth, finalHeight;
          if (widthRatio > heightRatio) {
            finalWidth = maxWidth;
            finalHeight = sizeObj.height / widthRatio;
          } else {
            finalHeight = maxHeight;
            finalWidth = sizeObj.width / heightRatio;
          }

          return [Math.round(finalWidth), Math.round(finalHeight)];
        },
      };

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        modules: [new ImageModule(imageOpts)],
      });

      var formData:any = {};

      // Version 3.1
      var templateData = await global.medicalRecord.get(`DataTemplates:{${branchCode}}:${formName.replace("/","_")}`, [`.`]);
      if (templateData != null) {
        var arrData = [];
        for (var key in templateData) {
          if (typeof templateData[key] == "string") {
            if (rowFilter != "") {
              if (templateData[key].includes("{row_filter}")) {
                templateData[key] = templateData[key].replace("{row_filter}", rowFilter);
              }
            }
            arrData.push(templateData[key])
          } else if (typeof templateData[key] == "object") {
            arrData.push(templateData[key]["root"]);
            console.log(templateData[key])
          }
        }
        const jsonData = await global.medicalRecord.get(emrID, arrData);
        if (jsonData != null) {
          const regexPath = /\{\$?[\w*\.*]*\}/g;
          for (var key in templateData) {
            if (typeof templateData[key] == "string") {
              formData[key] = jsonData[templateData[key]][0];
            } else if (typeof templateData[key] == "object") {
              var jsonItems = jsonData[templateData[key]["root"]][0];
              var items:Array<any> = [];
              for (var i = 0, n = jsonItems.length; i < n; i++) {
                var item:any = {};
                for (var keyItem in templateData[key]) {
                  if (keyItem != "root") {
                    if (typeof templateData[key][keyItem] == "string") {
                      if (templateData[key][keyItem].includes("eval")) {
                        var tempTemplate = templateData[key][keyItem];
                        const found = tempTemplate.match(regexPath);
                        if (found != null) {
                          for (var j = 0 ; j < found.length; j++) {
                            const itemPath = found[j].replace(".*.", `.[${i}].`).replace(/\{/g, "").replace(/\}/g, "");
                            const valuePath = JSONPath({path: itemPath, json: jsonItems})[0];
                            if (typeof valuePath == "string") {
                              tempTemplate = tempTemplate.replace(found[j],`'${valuePath}'`)
                            } else {
                              tempTemplate = tempTemplate.replace(found[j],valuePath)
                            }
                          }
                          tempTemplate = tempTemplate.replace("eval","").replace(/\{/g, "").replace(/\}/g, "");
                          const val = eval(eval(tempTemplate));
                          item[keyItem] = val;
                        }
                      } else {
                        item[keyItem] = JSONPath({path: templateData[key][keyItem].replace(".*.", `.[${i}].`), json: jsonItems})[0]
                      }
                    } else if (typeof templateData[key][keyItem] == "object") {
                      var jsonSubItems = JSONPath({path: templateData[key][keyItem]["root"].replace(".*.", `.[${i}].`), json: jsonItems})[0]
                      var subItems:Array<any> = [];
                      if (jsonSubItems != null) {
                        for (var j = 0, n = jsonSubItems.length; j < n; j++) {
                          var subItem:any = {};
                          console.log(jsonData[templateData[key][keyItem]])
                          for (var keySubItem in templateData[key][keyItem]) {
                            if (keySubItem != "root") {
                              subItem[keySubItem] = JSONPath({path: templateData[key][keyItem][keySubItem].replace(".*.", `.[${j}].`), json: jsonSubItems})[0]
                            }
                          }
                          subItem["no"] = j + 1;
                          subItems.push(subItem)
                        }
                      }
                      item[keyItem] = subItems;
                    }
                  }
                }
                items.push(item);
              }
              formData[key] = items;
            }
          }
        }
      }
      // Custom Data
      for (var key in data) {
        formData[key] = data[key];
      }
      for ( var key in formData) {
        if (formData[key] !== undefined) {
          formData[key] = await this.processData(key, formData[key]);
        }
      }
      try {
        console.log(`formData: ${JSON.stringify(formData)}`)
        await doc.renderAsync(formData);
      } catch (err) {
        console.log(`Error docxtemplate. branchCode:${branchCode} formName:${formName} emrID:${emrID} rowFilter:${rowFilter} formData:${JSON.stringify(formData)}`)
        throw err;
      }


      const buf = doc.getZip().generate({
        type: "nodebuffer",
        // compression: DEFLATE adds a compression step.
        // For a 50MB output document, expect 500ms additional CPU time
        compression: "DEFLATE",
      });
      if (converter == 'unoconv') {
        const childProcess = spawn('python', ['/usr/bin/unoconvert','--convert-to', 'pdf', '-', '-']);
        childProcess.stdin.write(buf);
        childProcess.stdin.end();

        const stdout: Uint8Array[] = [];
        for await (const chunk of childProcess.stdout) {
          stdout.push(chunk);
        }

        const exitCode = await new Promise( (resolve, reject) => {
          childProcess.on('close', resolve);
        });
        if( exitCode) {
          throw new Error( `subprocess error exit ${exitCode}`);
        }
        return Buffer.concat(stdout);
      } else {
        const buffer = await libre.convertAsync(buf, ".pdf", undefined);
        return buffer;
      }


    } catch (err) {
      console.error(err)
    }

  }

  async convertDocToPdf2(branchCode:string, formName:string, emrID:string, rowFilter:string, data:any, converter?:string) {
    apm.setLabel('emrID', emrID);
    apm.setLabel('branchCode', branchCode);
    apm.setLabel('formName', formName);
    const pathname = `docs/${branchCode}/${formName}.docx`;
    const paths: Array<string> = pathname.split("/");
    let directory = __dirname;
    if (!fs.existsSync(path.resolve(__dirname, pathname))) {
      const span = apm.startSpan('Download Template');
      for (let i = 0; i < paths.length - 1; i++) {
        if (paths[i] !== "") {
          directory = `${directory}/${paths[i]}`;
          if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
          }
        }
      }
      try {
        const fileId = await global.medicalRecord.get(`Config:{${branchCode}}`, [`.word_templates.${formName.replace('/', '_')}`]);
        const docxExported = await drive.files.export({ fileId, mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }, { responseType: "arraybuffer" });
        const data = Buffer.from(docxExported.data);
        fs.writeFileSync(path.resolve(__dirname, pathname), data);
        if (span) span.end();
      } catch (err) {
        console.error(err)
      }
    }

    const formData: any = {};
    try {
      const spanDocx = apm.startSpan('Render Document');
      const content = fs.readFileSync(path.resolve(__dirname, pathname), "binary");
      const zip = new PizZip(content);

      const imageOpts = {
        getImage (tagValue:any, tagName:string) {
          const base64Value = base64Parser(tagValue);
          if (base64Value) {
            return base64Value;
          }
          // tagValue is "https://docxtemplater.com/xt-pro-white.png"
          // tagName is "image"
          return new Promise(function (resolve:any, reject:any) {
            getHttpData(tagValue, function (err:any, data:Buffer) {
              if (err) {
                return reject(err);
              }
              resolve(data);
            });
          });
        },
        // getImage: as usual
        getSize (img:Buffer, tagValue:any, tagName:string, context:any) {
          const part = context.part;
          if (part.module === "open-xml-templating/docxtemplater-replace-image-module") {
            return [
              part.width,
              part.height,
            ]
          }
          const sizeOf = require("image-size");
          const sizeObj = sizeOf(img);
          const maxWidth = context.part.containerWidth;
          const maxHeight =
                  context.part.containerHeight ||
                  context.part.containerWidth;

          const widthRatio = sizeObj.width / maxWidth;
          const heightRatio = sizeObj.height / maxHeight;
          if (widthRatio < 1 && heightRatio < 1) {
            return [sizeObj.width, sizeObj.height];
          }
          let finalWidth, finalHeight;
          if (widthRatio > heightRatio) {
            finalWidth = maxWidth;
            finalHeight = sizeObj.height / widthRatio;
          } else {
            finalHeight = maxHeight;
            finalWidth = sizeObj.width / heightRatio;
          }

          return [Math.round(finalWidth), Math.round(finalHeight)];
        },
      };

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        modules: [new ImageModule(imageOpts)],
      });

      // Version 3.1
      const spanTemplate = apm.startSpan('Get Document Data Template');
      const templateData = await global.medicalRecord.get(`DataTemplates:{${branchCode}}:${formName.replace("/", "_")}`, [`.`]);
      if (templateData !== null) {
        const arrData = [];
        for (const key in templateData) {
          if (typeof templateData[key] === "string") {
            if (rowFilter !== "") {
              if (templateData[key].includes("{row_filter}")) {
                templateData[key] = templateData[key].replace("{row_filter}", rowFilter);
              }
            }
            arrData.push(templateData[key])
          } else if (typeof templateData[key] === "object") {
            arrData.push(templateData[key]["root"]);
            console.log(templateData[key])
          }
        }
        if (spanTemplate) spanTemplate.end();
        var spanPopulateData = apm.startSpan('Generate Data Template');
        const jsonData = await global.medicalRecord.get(emrID, arrData);
        if (jsonData !== null) {
          const regexPath = /\{\$?[\w*\.*]*\}/g;
          for (const key in templateData) {
            if (typeof templateData[key] === "string") {
              formData[key] = jsonData[templateData[key]][0];
            } else if (typeof templateData[key] === "object") {
              const jsonItems = jsonData[templateData[key]["root"]][0];
              const items: Array<any> = [];
              for (let i = 0, n = jsonItems.length; i < n; i++) {
                const item: any = {};
                for (const keyItem in templateData[key]) {
                  if (keyItem !== "root") {
                    if (typeof templateData[key][keyItem] === "string") {
                      if (templateData[key][keyItem].includes("eval")) {
                        let tempTemplate = templateData[key][keyItem];
                        const found = tempTemplate.match(regexPath);
                        //console.log(`${templateData[key]}.${keyItem}`)
                        //console.log(found)
                        if (found !== null) {
                          for (let j = 0; j < found.length; j++) {
                            const itemPath = found[j].replace(".*.", `.[${i}].`).replace(/\{/g, "").replace(/\}/g, "");
                            const valuePath = JSONPath({path: itemPath, json: jsonItems})[0];
                            if (typeof valuePath === "string") {
                              tempTemplate = tempTemplate.replace(found[j], `'${valuePath}'`)
                            } else {
                              tempTemplate = tempTemplate.replace(found[j], valuePath)
                            }
                          }
                          tempTemplate = tempTemplate.replace("eval", "").replace(/\{/g, "").replace(/\}/g, "");
                          const val = eval(eval(tempTemplate));
                          item[keyItem] = val;
                        }
                      } else {
                        item[keyItem] = JSONPath({path: templateData[key][keyItem].replace(".*.", `.[${i}].`), json: jsonItems})[0]
                      }
                    } else if (typeof templateData[key][keyItem] === "object") {
                      const jsonSubItems = JSONPath({path: templateData[key][keyItem]["root"].replace(".*.", `.[${i}].`), json: jsonItems})[0]
                      const subItems: Array<any> = [];
                      if (jsonSubItems !== null) {
                        for (let j = 0, n = jsonSubItems.length; j < n; j++) {
                          const subItem: any = {};
                          console.log(jsonData[templateData[key][keyItem]])
                          for (const keySubItem in templateData[key][keyItem]) {
                            if (keySubItem !== "root") {
                              subItem[keySubItem] = JSONPath({path: templateData[key][keyItem][keySubItem].replace(".*.", `.[${j}].`), json: jsonSubItems})[0]
                            }
                          }
                          subItem["no"] = j + 1;
                          subItems.push(subItem)
                        }
                      }
                      item[keyItem] = subItems;
                    }
                  }
                }
                items.push(item);
              }
              formData[key] = items;
            }
          }
        }
      }
      // Custom Data
      for (const key in data) {
        formData[key] = data[key];
      }
      for (const key in formData) {
        if (formData[key] !== undefined) {
          formData[key] = await this.processData(key, formData[key]);
        }
      }
      if (spanPopulateData) spanPopulateData.end();
      console.log(`formData: ${JSON.stringify(formData)}`)
      await doc.renderAsync(formData);

      const buf = doc.getZip().generate({
        type: "nodebuffer",
        // compression: DEFLATE adds a compression step.
        // For a 50MB output document, expect 500ms additional CPU time
        compression: "DEFLATE",
      });
      if (spanDocx) {
        spanDocx.setLabel('emrID', emrID);
        spanDocx.setLabel('branchCode', branchCode);
        spanDocx.setLabel('formName', formName);
        spanDocx.end();
      }

      const spanLibre = apm.startSpan('Convert Document');
      if (converter === 'unoconv') {
        const childProcess = spawn('python', ['/usr/bin/unoconvert', '--convert-to', 'pdf', '-', '-']);
        childProcess.stdin.write(buf);
        childProcess.stdin.end();

        const stdout: Uint8Array[] = [];
        for await (const chunk of childProcess.stdout) {
          stdout.push(chunk);
        }
        /*
        let error = "";
        for await (const chunk of childProcess.stderr) {
            console.error('stderr chunk: '+chunk);
            error += chunk;
        }*/
        const exitCode = await new Promise((resolve, reject) => {
          childProcess.on('close', resolve);
        });
        if (exitCode) {
          throw new Error(`subprocess error exit ${exitCode}`);
        }
        if (spanLibre) spanLibre.end();
        return Buffer.concat(stdout);
      } else {
        const buffer = await libre.convertAsync(buf, ".pdf", undefined);
        if (spanLibre) spanLibre.end();
        return buffer;
      }
    } catch (err) {
      console.log(`Error docxtemplate. branchCode:${branchCode} formName:${formName} emrID:${emrID} rowFilter:${rowFilter} formData:${JSON.stringify(formData)}`)
      throw err;
    }
  }

  private async processData(key:string, value:any):Promise<any> {
    if ((typeof value === "string") && value.includes("files-emr")) {
      // GCS data
      return await this.signUrl(value);
    } else if ((typeof value === "string") && value.includes("1.2.360.1")) {
      // Dicom data
      const result = await global.medicalRecord.findDicom(`@SOPInstanceUID:{${value.replace(/[.@]/g, '\\$&')}}`, {
        LIMIT: { from: 0, size: 10000 },
        RETURN: ["$.Kode_Cabang", "$.ID_Pelayanan", "$.No_MR", `$.Dicoms[?(@.SOPInstanceUID=="${value}")]`, "$.Rawat_Jalan", "$.Tanggal_Masuk"],
      });
      const resultEMR = result.documents[0].value;
      const dicom = JSON.parse(resultEMR[`$.Dicoms[?(@.SOPInstanceUID=="${value}")]`]);
      const dicomMetadata: IDicomMetadata = {
        StudyInstanceUID: dicom.StudyInstanceUID,
        SeriesInstanceUID: dicom.SeriesInstanceUID,
        SOPInstanceUID: dicom.SOPInstanceUID,
      };
      const destination = `images/${resultEMR["$.Kode_Cabang"]}/${resultEMR["$.Jenis_Pelayanan"]}/${moment.unix(resultEMR["$.Tanggal_Masuk"]).format("YYYY")}/${moment.unix(resultEMR["$.Tanggal_Masuk"]).format("MM")}/${resultEMR["$.Tipe_Pasien"]}/${resultEMR["$.No_MR"]}/${resultEMR["$.ID_Pelayanan"]}/${dicomMetadata.SOPInstanceUID}_original.png`;
      let signUrl: string = '';
      if (!(await global.storage.existsGCSUrl(destination))) {
        const fileBytes = await global.dicom.imageRendered(resultEMR["$.Kode_Cabang"], dicomMetadata);
        const resultOriginal = await global.storage.uploadFromMemory(destination, fileBytes);
        const url = encodeURI(`https://${resultOriginal.bucket}/${resultOriginal.name}?generation=${resultOriginal.generation}`);
        signUrl = await global.storage.signUrl(url);
      } else {
        const resultOriginal = await global.storage.getMetadata(destination);
        const url = encodeURI(`https://${resultOriginal.bucket}/${resultOriginal.name}?generation=${resultOriginal.generation}`);
        signUrl = await global.storage.signUrl(url);
      }
      return signUrl;
    } else if (typeof value === "object" && Array.isArray(value)) {
      for (let i = 0, n = value.length; i < n; i++) {
        for (const subKey in value[i]) {
          if (value[i][subKey] !== undefined) {
            value[i][subKey] = await this.processData(`${value[i]}.${subKey}`, value[i][subKey]);
          }
        }
        //value[i] = await this.processData(`${key}[${i}]`, value[i])
      }
      return value;
    } else {
      return value;
    }
  }

  async convertDocToPdf(branchCode:string, formName:string, data:any) {
    var pathname = `docs/${branchCode}/${formName}.docx`;
    var paths: Array<string> = pathname.split("/");
    var directory = __dirname;
    if (!fs.existsSync(path.resolve(__dirname, pathname))) {
      for (var i = 0; i < paths.length - 1; i++) {
        if (paths[i] != "") {
          directory = `${directory}/${paths[i]}`;
          if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
          }
        }
      }

      var filename = `${directory}/${paths[paths.length - 1]}`;
      try {
        const file = await this.storage.bucket(this.bucketName).file(pathname);
        const contentDownload = await file.download({
          destination: filename,
        });
      } catch (err) {
        console.error(err)
      }
    }


    const content = fs.readFileSync(path.resolve(__dirname, pathname), "binary");
    const zip = new PizZip(content);

    const imageOpts = {
      getImage: function (tagValue:any, tagName:string) {
        console.log(tagValue, tagName);
        const base64Value = base64Parser(tagValue);
        if (base64Value) {
          return base64Value;
        }
        // tagValue is "https://docxtemplater.com/xt-pro-white.png"
        // tagName is "image"
        return new Promise(function (resolve:any, reject:any) {
          getHttpData(tagValue, function (err:any, data:Buffer) {
            if (err) {
              return reject(err);
            }
            resolve(data);
          });
        });
      },
      // getImage: as usual
      getSize: function (img:Buffer, tagValue:any, tagName:string, context:any) {
        console.log(tagValue, tagName);
        const sizeOf = require("image-size");
        const sizeObj = sizeOf(img);
        const maxWidth = context.part.containerWidth;
        const maxHeight =
                context.part.containerHeight ||
                context.part.containerWidth;

        const widthRatio = sizeObj.width / maxWidth;
        const heightRatio = sizeObj.height / maxHeight;
        if (widthRatio < 1 && heightRatio < 1) {
          return [sizeObj.width, sizeObj.height];
        }
        let finalWidth, finalHeight;
        if (widthRatio > heightRatio) {
          finalWidth = maxWidth;
          finalHeight = sizeObj.height / widthRatio;
        } else {
          finalHeight = maxHeight;
          finalWidth = sizeObj.width / heightRatio;
        }

        return [Math.round(finalWidth), Math.round(finalHeight)];
      },
    };

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      modules: [new ImageModule(imageOpts)],
    });
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
    await doc.renderAsync(data);

    const buf = doc.getZip().generate({
      type: "nodebuffer",
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: "DEFLATE",
    });
    const ID = short("0123456789").new();
    const sourceFilepath = path.resolve(__dirname, `${ID}.docx`);
    fs.writeFileSync(sourceFilepath, buf);

    const buffer = await PDFEngine.convert({
      files: [sourceFilepath]
    });
    fs.unlinkSync(sourceFilepath)
    return buffer;

  }

  async uploadFromMemory(path: string, data: any): Promise<any> {
    const file = await this.storage.bucket(this.bucketName).file(path);
    await file.save(data);
    const [metadata] = await file.getMetadata();
    return metadata;
  }

  async copyFile(srcFileName: string, destFileName: string) {
    const copyDestination = await this.storage.bucket(this.bucketName).file(destFileName);

    const copyOptions = {
      preconditionOpts: {
        ifGenerationMatch: 0,
      },
    }

    await this.storage
      .bucket(this.bucketName)
      .file(srcFileName)
      .copy(copyDestination, copyOptions);
    const [metadata] = await copyDestination.getMetadata()

    return metadata;
  }

  async delete(path: string): Promise<any> {
    try {
      if (path.indexOf(this.bucketName) > 0) path = path.replace(`https://${this.bucketName}/`, "");
      if (path.indexOf("?generation") > 0) path = path.substring(0, path.indexOf("?generation"));
      await this.storage.bucket(this.bucketName).file(path).delete();
    } catch (err) {
      throw err;
    }
  }

  async signCookie(urlPrefix: string, expires: Date): Promise<string> {
    // Base64url encode the url prefix
    const urlPrefixEncoded = Buffer.from(urlPrefix).toString("base64").replace(/\+/g, "-").replace(/\//g, "_");

    // Input to be signed
    const input = `URLPrefix=${urlPrefixEncoded}:Expires=${expires.getTime() / 1000}:KeyName=${this.keyName}`;

    // Create bytes from given key string.
    const keyBytes = Buffer.from(this.keyValue, "base64");

    // Use key bytes and crypto.createHmac to produce a base64 encoded signature which is then escaped to be base64url encoded.
    const { createHmac } = await import("crypto");
    const signature = createHmac("sha1", keyBytes).update(input).digest("base64").replace(/\+/g, "-").replace(/\//g, "_");

    // Adding the signature on the end if the cookie value
    const signedValue = `${input}:Signature=${signature}`;

    return signedValue;
  }

  async signUrlPrefix(urlPrefix: string, expires: Date) {
    // Base64url encode the url prefix
    const urlPrefixEncoded = Buffer.from(urlPrefix).toString("base64").replace(/\+/g, "-").replace(/\//g, "_");

    // Input to be signed
    const input = `URLPrefix=${urlPrefixEncoded}&Expires=${expires.getTime() / 1000}&KeyName=${this.keyName}`;

    const keyBytes = Buffer.from(this.keyValue, "base64");

    const { createHmac } = await import("crypto");
    const signature = createHmac("sha1", keyBytes).update(input).digest("base64").replace(/\+/g, "-").replace(/\//g, "_");

    // Adding the signature on the end if the cookie value
    const signedValue = `${input}&Signature=${signature}`;
    return signedValue;
  }

  cleanUrl(urlString: string | undefined) {
    // Input to be signed
    if (urlString) {
      const urlObject = url.parse(urlString, true);
      let queryParams = "";
      const ignoreQueryParams = ["Expires", "KeyName", "Signature"];
      if (urlObject.query !== null) {
        for (const key in urlObject.query) {
          if (!ignoreQueryParams.includes(key)) {
            if (queryParams !== "") queryParams += "&";
            queryParams = `${queryParams}${key}=${urlObject.query[key]}`;
          }
        }
        if (queryParams !== "") queryParams = `?${queryParams}&`;
        else queryParams = "?";
      }

      return `${urlObject.protocol}//${urlObject.host}${urlObject.pathname}${queryParams}`;
    } else {
      return "";
    }
  }

  async existsGCSUrl(destination: string) {
    try {
      const result = await this.storage.bucket(this.bucketName).file(destination).exists();
      return result[0];
    } catch (err) {
      return false;
    }
  }

  async getMetadata(destination: string) {
    const [result] = await this.storage.bucket(this.bucketName).file(destination).getMetadata();
    return result;
  }

  async signUrl(urlString: string, expires: Date = new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) {
    if (urlString === null) return "";

    const input = `${this.cleanUrl(urlString)}Expires=${expires.getTime() / 1000}&KeyName=${this.keyName}`;
    const keyBytes = Buffer.from(this.keyValue, "base64");

    const { createHmac } = await import("crypto");
    const signature = createHmac("sha1", keyBytes).update(input).digest("base64").replace(/\+/g, "-").replace(/\//g, "_");

    // Adding the signature on the end if the cookie value
    const signedValue = `${input}&Signature=${signature}`;
    return signedValue;
  }
}

export { StorageService };
