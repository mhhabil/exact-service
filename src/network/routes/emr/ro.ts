/* eslint-disable camelcase */
import moment from "moment";
import e, { Router, Request, Response, NextFunction } from "express";
import * as jsonpatch from "fast-json-patch";
import { AppRequest, IAppRequest } from "./interfaces/app/app.request";
import {
  IRefraksiOptisi,
  IRefraksiOptisiKMB,
  IRefraksiOptisiData,
  IRefraksiOptisiKML,
  IRefraksiOptisiKoreksi1,
  IRefraksiOptisiKoreksi2,
  IRefraksiOptisiPengkajianAwal,
  IRefraksiOptisiRPL,
  IRefraksiOptisiRPLStreak,
} from "./interfaces/ro.model";
import RBAC from "../../../services/rbac";
import { ElasticLoggerService } from "./services";
import { isValidFile } from "./helpers/app.helper";
import { IUpdateROPengkajianAwal } from "./interfaces/ro/ro.request";
import { PengkajianAwalRO } from "./interfaces/ro/ro.model";

const RO = Router();

RO.route("/ro/pengkajian-awal-form").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const emrKeys = ["Pasien", 'No_MR', 'Kode_Cabang'];
  const checkObject = await global.medicalRecord.keys(req.emrID, ".RO");
  if (checkObject !== null && checkObject.includes("Pengkajian_Awal")) {
    emrKeys.push("RO.Pengkajian_Awal");
  }

  const emrData = await global.medicalRecord.get(req.emrID, emrKeys);
  const anamnesa = await global.medicalRecord.get(`Anamnesa:{${emrData.Kode_Cabang}}`);
  const fields = await global.medicalRecord.getFields(req.emrID, req.body.fields || []);

  const form = emrData['RO.Pengkajian_Awal'] ? emrData['RO.Pengkajian_Awal'] : {};

  form.TTD_Petugas_RO = (form.TTD_Petugas_RO && form.TTD_Petugas_RO !== '' && isValidFile(form.TTD_Petugas_RO)) ? await global.storage.signUrl(form.TTD_Petugas_RO, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

  form.TTD_Pasien = (form.TTD_Pasien && form.TTD_Pasien !== '' && isValidFile(form.TTD_Pasien)) ? await global.storage.signUrl(form.TTD_Pasien, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

  if (!res.writableEnded) {
    res.status(200).json({
      message: "OK",
      data: {
        EMR_ID: req.emrID,
        nomor_mr: emrData.No_MR,
        pasien: emrData.Pasien,
        anamnesa,
        form,
        fields,
      },
    });
  }
});

RO.route('/ro/pengkajian-awal-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdateROPengkajianAwal = req.body;
          const employee = await global.medicalRecord.get(`Employee:{${req.body.kode_cabang}}:${req.body.tipe_pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${req.body["id-petugas-ro"]}')]`)
          const fixedData = PengkajianAwalRO.createFromJson(dataToPost);
          const redisJsonData: IRefraksiOptisiPengkajianAwal = {
            ...fixedData,
            Nama_Petugas_RO: employee && Array.isArray(employee) && employee.length > 0 && employee[0] ? employee[0].Nama : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Waktu: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
            Updated_By_Name: req.userProfile.nama,
          }

          const anamnesa = await global.medicalRecord.get(`Anamnesa:{${req.body.kode_cabang}}`);
          let anamnesaName = '';
          if (anamnesa && anamnesa !== null) {
            const selectedAnamnesa = Array.isArray(anamnesa) && anamnesa.find((val: any) => req.body.keluhan === val.ID_Anamnesa.toString())
            anamnesaName = (selectedAnamnesa && selectedAnamnesa.Nama) ? selectedAnamnesa.Nama : '';
          }
          if (req.body.keluhan !== "Lain-lain") {
            redisJsonData.Keluhan_Lain = "";
            redisJsonData.Keluhan = anamnesaName;
            redisJsonData.ID_Keluhan = req.body.keluhan;
          } else {
            redisJsonData.Keluhan_Lain = req.body["keluhan-lain"];
            redisJsonData.Keluhan = "";
            redisJsonData.ID_Keluhan = "Lain-lain";
          }

          const ro: IRefraksiOptisi = {
            Pengkajian_Awal: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.RO && newEmrData.RO !== null) {
            newEmrData.RO.Pengkajian_Awal = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.RO.Pengkajian_Awal',
              updateDocument.newDocument.RO.Pengkajian_Awal,
            );
            ElasticLoggerService().createLog(req, '/ro/pengkajian-awal', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                data: updateDocument.newDocument.RO.Pengkajian_Awal,
              })
            }
          } else {
            newEmrData.RO = ro;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.RO', updateDocument.newDocument.RO);
            ElasticLoggerService().createLog(req, '/ro/pengkajian-awal', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                data: updateDocument.newDocument.RO.Pengkajian_Awal,
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/ro/pengkajian-awal', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/ro/pengkajian-awal', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/ro/pengkajian-awal', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  })

export { RO };
