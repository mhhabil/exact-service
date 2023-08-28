import moment from "moment";
import { Router, Request, Response, NextFunction } from "express";
import RBAC from "../../../services/rbac";
import * as jsonpatch from "fast-json-patch";
import { v4 as uuid } from "uuid";
const debugEMR = require("debug")("emr");
import { ElasticLoggerService, SimrsService } from "./services";
import { getFirstEws, getLastCpptDoctorData, isValidFile } from "./helpers/app.helper";
import { PatientTransfer } from "./interfaces/patient-transfer/patient-transfer.model";
import { IUpdateTransferPasien } from "./interfaces/patient-transfer/patient-transfer.request";
const PT = Router();

PT.route('/transfer-pasien/item')
  .get(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Common'];
    try {
      const checkObject = await global.medicalRecord.keys(req.query.emr_id, '.Common');
      const checkRO = await global.medicalRecord.keys(req.query.emr_id, '.RO');
      const checkUgd = await global.medicalRecord.keys(req.emrID, '.UGD');
      const checkRajal = await global.medicalRecord.keys(req.emrID, '.Rawat_Jalan');
      if (checkUgd !== null && checkUgd.includes('Assesmen')) {
        emrKeys.push('UGD.Assesmen');
      }
      if (checkObject !== null && checkObject.includes('Transfer_Pasien')) {
        emrKeys.push('Common.Transfer_Pasien');
      }
      if (checkRO !== null && checkRO.includes('Pengkajian_Awal')) {
        emrKeys.push('RO.Pengkajian_Awal');
      }
      if (checkRajal !== null && checkRajal.includes('Pemberian_Informasi')) {
        emrKeys.push('Rawat_Jalan.Pemberian_Informasi');
      }
      const result = await global.medicalRecord.get(req.query.emr_id, emrKeys);
      if (result && result !== null) {
        const informConsent = result['Rawat_Jalan.Pemberian_Informasi'] ?? {};
        const records: Array<ITransferPasien> = result['Common.Transfer_Pasien'] && Array.isArray(result['Common.Transfer_Pasien']) ? result['Common.Transfer_Pasien'] : [];
        const ro = result['RO.Pengkajian_Awal'] ?? {};
        const cppt = await getLastCpptDoctorData(result.Kode_Cabang, result.No_MR);
        const assessmentUgd = result['UGD.Assesmen'] ?? {};
        const ews = await getFirstEws(req.query.emr_id);
        for (let i = 0; i < records.length; i += 1) {
          if (records[i].Tanda_Tangan_Perawat_Penerima && records[i].Tanda_Tangan_Perawat_Penerima !== '' && isValidFile(records[i].Tanda_Tangan_Perawat_Penerima)) {
            records[i].Tanda_Tangan_Perawat_Penerima = await global.storage.signUrl(records[i].Tanda_Tangan_Perawat_Penerima, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
          }
          if (records[i].Tanda_Tangan_Perawat_Pengantar && records[i].Tanda_Tangan_Perawat_Pengantar !== '' && isValidFile(records[i].Tanda_Tangan_Perawat_Pengantar)) {
            records[i].Tanda_Tangan_Perawat_Pengantar = await global.storage.signUrl(records[i].Tanda_Tangan_Perawat_Pengantar, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
          }
          if (records[i].PDF && records[i].PDF !== '' && isValidFile(records[i].PDF)) {
            records[i].PDF = await global.storage.signUrl(records[i].PDF, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
          }
        }
        const total = records.length;
        const data: any = {
          total,
          totalFiltered: records.length,
          EMR_ID: req.query.emr_id,
          pasien: result.Pasien,
          records,
          ro,
          cppt,
          asesmen: assessmentUgd,
          inform_consent: informConsent ?? {},
          ews: ews && ews.Td && ews.Td.includes('/') ? ews : ews && ews.Td && ews.Td_1 ? {...ews, Td: `${ews.Td}/${ews.Td_1}`} : {},
        }
        if (!res.writableEnded) {
          res.status(200).json({
            message: 'OK',
            data,
          })
        }
      }
      if (!result || result === null) {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'Patient data not found',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        });
      }
    }
  });

PT.route('/transfer-pasien/process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const localDebug = debugEMR.extend(req.path);
    localDebug(`Request Begin`);
    let responseMessage: string = '';
    try {
      const emrKeys = ["Kode_Cabang", "No_MR", "Pasien", "Tipe_Pasien"];
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Common');
      if (checkObject !== null && checkObject.includes('Transfer_Pasien')) {
        emrKeys.push('Common.Transfer_Pasien');
      }
      const id = req.body.id;
      const dataToPost: IUpdateTransferPasien = req.body;
      const emrData = await global.medicalRecord.get(req.emrID, emrKeys);
      localDebug(`Get Data ${req.emrID}`);
      if (emrData && emrData !== null) {
        const nurse1 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==1&&@.Status_Dokter==0&&@.ID_Karyawan=='${dataToPost.id_tanda_tangan_perawat_penerima}')]`);
        const nurse2 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==1&&@.Status_Dokter==0&&@.ID_Karyawan=='${dataToPost.id_tanda_tangan_perawat_pengantar}')]`);
        const doctor1 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost.id_dokter_dpjp}')]`);
        const doctor2 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost.id_dokter_operator}')]`);
        const jsonData = await PatientTransfer.createFromJson(dataToPost);
        const fixedData = {
          ...jsonData,
          Nama_Dokter_Dpjp: doctor1 && Array.isArray(doctor1) && doctor1.length > 0 && doctor1[0] ? doctor1[0].Nama : '',
          Nama_Dokter_Operator: doctor2 && Array.isArray(doctor2) && doctor2.length > 0 && doctor2[0] ? doctor2[0].Nama : '',
          Nama_Perawat_Pengantar: nurse2 && Array.isArray(nurse2) && nurse2.length > 0 && nurse2[0] ? nurse2[0].Nama : '',
          Nama_Perawat_Penerima: nurse1 && Array.isArray(nurse1) && nurse1.length > 0 && nurse1[0] ? nurse1[0].Nama : '',
          ID_Petugas: (req.userId) ? req.userId : '',
          Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
          Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
          Updated_By: (req.userId) ? req.userId : '',
        }

        let data = {};
        if (!id || id === '') {
          const redisJsonData = {
            ...fixedData,
            ID: uuid().replace(/-/g, "").toUpperCase(),
          }
          await global.medicalRecord.addTransferPasien(req.emrID, redisJsonData);
          data = redisJsonData;
          responseMessage = 'Data berhasil ditambah';
        } else {
          const list = emrData['Common.Transfer_Pasien'] && Array.isArray(emrData['Common.Transfer_Pasien']) ? emrData['Common.Transfer_Pasien'] : [];
          const selectedObject = list.find((item: any) => item.ID === id);
          if (selectedObject) {
            const redisJsonData = {
              ...fixedData,
              ID: id ?? '',
            }
            const diff = jsonpatch.compare(selectedObject, redisJsonData);
            const patch = [];
            for (let i = 0; i < diff.length; i++) {
              if (diff[i].op === "add" || diff[i].op === "replace") patch.push(diff[i]);
            }
            localDebug(`Compare Data ${patch}`);

            const updateDocument = jsonpatch.applyPatch(selectedObject, patch);
            localDebug(`Prepare Data ${patch}`);
            await global.medicalRecord.update(req.emrID, `$.Common.Transfer_Pasien[?(@.ID=="${id}")]`, updateDocument.newDocument);
            localDebug(`Update Data ${patch}`);
            data = updateDocument.newDocument;
            responseMessage = "Data berhasil diubah";
          } else {
            throw new Error("No Data");
          }
        }
        ElasticLoggerService().createHTTPResponse(req, res, 200, {
          message: responseMessage,
          data,
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

PT.route('/transfer-pasien/delete')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const emrKeys: Array<string> = [];
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Common')
      if (checkObject && checkObject !== null && checkObject.includes('Transfer_Pasien')) {
        emrKeys.push('Common.Transfer_Pasien');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);

      if (result && Array.isArray(result) && result.length > 0) {
        const index = result.findIndex((val: any) => val.ID === req.body.id);
        await global.medicalRecord.deleteTransferPasien(req.emrID, index);
        if (!res.writableEnded) {
          res.status(200).json({
            message: 'OK',
          })
        }
      } else {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'No Data',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        })
      }
    }
  });

PT.route('/transfer-pasien/pdf')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const id = req.body.id;
      const data = req.body.data;
      const preview = req.body.preview;
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
          await global.medicalRecord.addPDF(req.emrID, pdf);

          const consult = await global.medicalRecord.get(req.emrID, `$.Common.Transfer_Pasien.[?(@.ID=="${id}")]`)

          const oldData = consult[0]
          const data = {
            ...consult[0],
            PDF: url,
          };
          const diff = jsonpatch.compare(oldData, data);
          const updateDocument = jsonpatch.applyPatch(oldData, diff);
          await global.medicalRecord.update(req.emrID, `$.Common.Transfer_Pasien[?(@.ID=="${id}")]`, updateDocument.newDocument);

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
      ElasticLoggerService().createErrorLog(req, '/transfer-pasien/pdf', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        });
      }
    }
  })

export { PT };
