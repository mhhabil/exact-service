import e, { Router, Request, Response, NextFunction, response } from 'express'
import RBAC from '../../../services/rbac'
import moment from 'moment'
import { IResepKacamata, IFormResepKacamata, FormResepKacamata } from './interfaces/optic/optic.model';
import { IUpdateResepKacamata, IBodyToSimrs, BodyToSimrs } from './interfaces/optic/optic.request';
import { IUpdateToSimrs, UpdateToSimrs } from './interfaces/simrs/simrs.request';
import { SimrsService, ElasticLoggerService } from './services';
import * as jsonpatch from 'fast-json-patch';
import { isValidFile } from './helpers/app.helper';
const jp = require('jsonpath')
const Optic = Router();

Optic.route('/optik/resep-kacamata-form')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'No_MR']
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Optik')
      const checkRo = await global.medicalRecord.keys(req.emrID, '.RO')
      if (checkRo !== null && checkRo.includes('Pengkajian_Awal')) {
        emrKeys.push('RO.Pengkajian_Awal');
      }
      if (checkObject !== null && checkObject.includes("Resep_Kacamata")) {
        emrKeys.push("Optik.Resep_Kacamata");
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys)
      if (result && result !== null) {
        const form = (result['Optik.Resep_Kacamata']) ? result['Optik.Resep_Kacamata'] : {};

        form.TTD_Dokter = (form.TTD_Dokter && form.TTD_Dokter !== '' && isValidFile(form.TTD_Dokter)) ? await global.storage.signUrl(form.TTD_Dokter, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        const data: IResepKacamata = {
          EMR_ID: req.emrID,
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: result.Pasien ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          form,
          formRO: (result['RO.Pengkajian_Awal']) ? result['RO.Pengkajian_Awal'] : {},
        }
        if (!res.writableEnded) {
          res.status(200).json({
            message: 'OK',
            data,
          });
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
        })
      }
    }
  })

Optic.route('/optik/resep-kacamata-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdateResepKacamata = req.body;
          const employees = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, '.')
          const doctorTreating = jp.query(employees, `$[?(@.ID_Karyawan=='${  req.body['dokter']   }' && @.Status_Dokter==1 && @.Status_Perawat==0 && @.Status_Aktif==1)]`)
          const jsonData = FormResepKacamata.createFromJson(dataToPost);
          const redisJsonData: IFormResepKacamata = {
            ...jsonData,
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Dokter_Nama: (doctorTreating && doctorTreating.length > 0) ? doctorTreating[0].Nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const optic: IOptic = {
            Resep_Kacamata: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Optik && newEmrData.Optik !== null) {
            newEmrData.Optik.Resep_Kacamata = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Optik.Resep_Kacamata',
              updateDocument.newDocument.Optik.Resep_Kacamata,
            );
            ElasticLoggerService().createLog(req, '/optik/resep-kacamata', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.Optik = optic;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Optik', updateDocument.newDocument.Optik);
            ElasticLoggerService().createLog(req, '/optik/resep-kacamata', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/optik/resep-kacamata', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/optik/resep-kacamata', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/optik/resep-kacamata', `${err}`);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  })

export { Optic };
