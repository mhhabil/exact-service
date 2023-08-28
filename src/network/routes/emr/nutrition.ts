import { Router, Request, Response, NextFunction } from "express";
import RBAC from "services/rbac";
import moment from "moment";
import * as jsonpatch from 'fast-json-patch';
import { v4 as uuid } from "uuid";
import { ElasticLoggerService } from "./services";
import { isValidFile } from "./helpers/app.helper";
import { IUpdatePengkajianAwalGizi } from "./interfaces/inpatient/inpatient.request";
import { PengkajianAwalGizi } from "./interfaces/inpatient/inpatient.model";
const debugEMR = require("debug")("emr");

const Nutrition = Router();

Nutrition.route('/gizi/pengkajian-awal-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Gizi');
      if (checkObject !== null && checkObject.includes('Pengkajian_Awal')) {
        emrKeys.push('Gizi.Pengkajian_Awal');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form = result['Gizi.Pengkajian_Awal'] ? result['Gizi.Pengkajian_Awal'] : {};

        if (form.TTD_Petugas_Gizi && form.TTD_Petugas_Gizi !== '' && isValidFile(form.TTD_Petugas_Gizi)) {
          form.TTD_Petugas_Gizi = await global.storage.signUrl(form.TTD_Petugas_Gizi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        console.log('result', result);
        const data: any = {
          EMR_ID: req.emrID,
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          form,
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

Nutrition.route('/gizi/pengkajian-awal-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdatePengkajianAwalGizi = req.body;
          const doctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_petugas_gizi}')]`)
          const fixedData = PengkajianAwalGizi.createFromJson(dataToPost);
          const redisJsonData: IPengkajianAwalGiziRanap = {
            ...fixedData,
            Nama_Petugas_Gizi: doctor && Array.isArray(doctor) && doctor.length > 0 && doctor[0] ? doctor[0].Nama : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const inpatient: IGizi = {
            Pengkajian_Awal: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Gizi && newEmrData.Gizi !== null) {
            newEmrData.Gizi.Pengkajian_Awal = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Gizi.Pengkajian_Awal',
              updateDocument.newDocument.Gizi.Pengkajian_Awal,
            );
            ElasticLoggerService().createLog(req, '/gizi/pengkajian-awal-gizi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                data: updateDocument.newDocument.Gizi.Pengkajian_Awal,
              })
            }
          } else {
            newEmrData.Gizi = inpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Gizi', updateDocument.newDocument.Gizi);
            ElasticLoggerService().createLog(req, '/gizi/pengkajian-awal-gizi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                data: updateDocument.newDocument.Gizi.Pengkajian_Awal,
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/gizi/pengkajian-awal-gizi', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/gizi/pengkajian-awal-gizi', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/gizi/pengkajian-awal-gizi', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

export { Nutrition }
