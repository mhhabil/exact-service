import moment from "moment";
import { Router, Request, Response, NextFunction } from "express";
import RBAC from "../../../services/rbac";
const jp = require("jsonpath");
import * as jsonpatch from "fast-json-patch";
import { v4 as uuid } from "uuid";
const debugEMR = require("debug")("emr");
import { ElasticLoggerService, SimrsService } from "./services";
import { isValidFile } from "./helpers/app.helper";
import { IUpdateEdukasiTerintegrasi } from "./interfaces/integrated-education/integrated-education.request";
import { EdukasiTerintegrasi } from "./interfaces/integrated-education/integrated-education.model";
const IE = Router();

IE.route('/edukasi-integrasi/index')
  .get(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Common', 'Rawat_Inap'];
    try {
      const checkObject = await global.medicalRecord.keys(req.query.emr_id, '.Common');
      if (checkObject !== null && checkObject.includes('Edukasi_Integrasi')) {
        emrKeys.push('Common.Edukasi_Integrasi');
      }
      const result = await global.medicalRecord.get(req.query.emr_id, emrKeys);
      if (result && result !== null) {
        const form: IEdukasiTerintegrasi = result['Common.Edukasi_Integrasi'] ?? {};
        const inpatient: IRawatInap = result['Rawat_Inap'] ?? {};

        if (form.TTD_Edukator_DPJP && form.TTD_Edukator_DPJP !== '' && isValidFile(form.TTD_Edukator_DPJP)) {
          form.TTD_Edukator_DPJP = await global.storage.signUrl(form.TTD_Edukator_DPJP, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Edukator_Gizi && form.TTD_Edukator_Gizi !== '' && isValidFile(form.TTD_Edukator_Gizi)) {
          form.TTD_Edukator_Gizi = await global.storage.signUrl(form.TTD_Edukator_Gizi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Edukator_Post_Operasi && form.TTD_Edukator_Post_Operasi !== '' && isValidFile(form.TTD_Edukator_Post_Operasi)) {
          form.TTD_Edukator_Post_Operasi = await global.storage.signUrl(form.TTD_Edukator_Post_Operasi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Edukator_Dokter && form.TTD_Edukator_Dokter !== '' && isValidFile(form.TTD_Edukator_Dokter)) {
          form.TTD_Edukator_Dokter = await global.storage.signUrl(form.TTD_Edukator_Dokter, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Edukator_Farmasi && form.TTD_Edukator_Farmasi !== '' && isValidFile(form.TTD_Edukator_Farmasi)) {
          form.TTD_Edukator_Farmasi = await global.storage.signUrl(form.TTD_Edukator_Farmasi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Edukator_Mencuci_Tangan && form.TTD_Edukator_Mencuci_Tangan !== '' && isValidFile(form.TTD_Edukator_Mencuci_Tangan)) {
          form.TTD_Edukator_Mencuci_Tangan = await global.storage.signUrl(form.TTD_Edukator_Mencuci_Tangan, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Edukator_Penggunaan_Peralatan && form.TTD_Edukator_Penggunaan_Peralatan !== '' && isValidFile(form.TTD_Edukator_Penggunaan_Peralatan)) {
          form.TTD_Edukator_Penggunaan_Peralatan = await global.storage.signUrl(form.TTD_Edukator_Penggunaan_Peralatan, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Edukator_Hak_Kewajiban && form.TTD_Edukator_Hak_Kewajiban !== '' && isValidFile(form.TTD_Edukator_Hak_Kewajiban)) {
          form.TTD_Edukator_Hak_Kewajiban = await global.storage.signUrl(form.TTD_Edukator_Hak_Kewajiban, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Edukator_Informasi_Lain && form.TTD_Edukator_Informasi_Lain !== '' && isValidFile(form.TTD_Edukator_Informasi_Lain)) {
          form.TTD_Edukator_Informasi_Lain = await global.storage.signUrl(form.TTD_Edukator_Informasi_Lain, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Edukator_Keperawatan && form.TTD_Edukator_Keperawatan !== '' && isValidFile(form.TTD_Edukator_Keperawatan)) {
          form.TTD_Edukator_Keperawatan = await global.storage.signUrl(form.TTD_Edukator_Keperawatan, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Edukator_Manajemen_Nyeri && form.TTD_Edukator_Manajemen_Nyeri !== '' && isValidFile(form.TTD_Edukator_Manajemen_Nyeri)) {
          form.TTD_Edukator_Manajemen_Nyeri = await global.storage.signUrl(form.TTD_Edukator_Manajemen_Nyeri, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Edukator_Rohaniawan && form.TTD_Edukator_Rohaniawan !== '' && isValidFile(form.TTD_Edukator_Rohaniawan)) {
          form.TTD_Edukator_Rohaniawan = await global.storage.signUrl(form.TTD_Edukator_Rohaniawan, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Penerima_Edukasi_DPJP && form.TTD_Penerima_Edukasi_DPJP !== '' && isValidFile(form.TTD_Penerima_Edukasi_DPJP)) {
          form.TTD_Penerima_Edukasi_DPJP = await global.storage.signUrl(form.TTD_Penerima_Edukasi_DPJP, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Penerima_Edukasi_Gizi && form.TTD_Penerima_Edukasi_Gizi !== '' && isValidFile(form.TTD_Penerima_Edukasi_Gizi)) {
          form.TTD_Penerima_Edukasi_Gizi = await global.storage.signUrl(form.TTD_Penerima_Edukasi_Gizi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Penerima_Edukasi_Dokter && form.TTD_Penerima_Edukasi_Dokter !== '' && isValidFile(form.TTD_Penerima_Edukasi_Dokter)) {
          form.TTD_Penerima_Edukasi_Dokter = await global.storage.signUrl(form.TTD_Penerima_Edukasi_Dokter, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Penerima_Edukasi_Farmasi && form.TTD_Penerima_Edukasi_Farmasi !== '' && isValidFile(form.TTD_Penerima_Edukasi_Farmasi)) {
          form.TTD_Penerima_Edukasi_Farmasi = await global.storage.signUrl(form.TTD_Penerima_Edukasi_Farmasi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Penerima_Edukasi_Post_Operasi && form.TTD_Penerima_Edukasi_Post_Operasi !== '' && isValidFile(form.TTD_Penerima_Edukasi_Post_Operasi)) {
          form.TTD_Penerima_Edukasi_Post_Operasi = await global.storage.signUrl(form.TTD_Penerima_Edukasi_Post_Operasi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Penerima_Edukasi_Mencuci_Tangan && form.TTD_Penerima_Edukasi_Mencuci_Tangan !== '' && isValidFile(form.TTD_Penerima_Edukasi_Mencuci_Tangan)) {
          form.TTD_Penerima_Edukasi_Mencuci_Tangan = await global.storage.signUrl(form.TTD_Penerima_Edukasi_Mencuci_Tangan, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Penerima_Edukasi_Penggunaan_Peralatan && form.TTD_Penerima_Edukasi_Penggunaan_Peralatan !== '' && isValidFile(form.TTD_Penerima_Edukasi_Penggunaan_Peralatan)) {
          form.TTD_Penerima_Edukasi_Penggunaan_Peralatan = await global.storage.signUrl(form.TTD_Penerima_Edukasi_Penggunaan_Peralatan, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Penerima_Edukasi_Hak_Kewajiban && form.TTD_Penerima_Edukasi_Hak_Kewajiban !== '' && isValidFile(form.TTD_Penerima_Edukasi_Hak_Kewajiban)) {
          form.TTD_Penerima_Edukasi_Hak_Kewajiban = await global.storage.signUrl(form.TTD_Penerima_Edukasi_Hak_Kewajiban, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Penerima_Edukasi_Informasi_Lain && form.TTD_Penerima_Edukasi_Informasi_Lain !== '' && isValidFile(form.TTD_Penerima_Edukasi_Informasi_Lain)) {
          form.TTD_Penerima_Edukasi_Informasi_Lain = await global.storage.signUrl(form.TTD_Penerima_Edukasi_Informasi_Lain, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Penerima_Edukasi_Keperawatan && form.TTD_Penerima_Edukasi_Keperawatan !== '' && isValidFile(form.TTD_Penerima_Edukasi_Keperawatan)) {
          form.TTD_Penerima_Edukasi_Keperawatan = await global.storage.signUrl(form.TTD_Penerima_Edukasi_Keperawatan, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Penerima_Edukasi_Manajemen_Nyeri && form.TTD_Penerima_Edukasi_Manajemen_Nyeri !== '' && isValidFile(form.TTD_Penerima_Edukasi_Manajemen_Nyeri)) {
          form.TTD_Penerima_Edukasi_Manajemen_Nyeri = await global.storage.signUrl(form.TTD_Penerima_Edukasi_Manajemen_Nyeri, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Penerima_Edukasi_Rohaniawan && form.TTD_Penerima_Edukasi_Rohaniawan !== '' && isValidFile(form.TTD_Penerima_Edukasi_Rohaniawan)) {
          form.TTD_Penerima_Edukasi_Rohaniawan = await global.storage.signUrl(form.TTD_Penerima_Edukasi_Rohaniawan, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        const data: any = {
          EMR_ID: req.query.emr_id,
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          form,
          rawat_inap: inpatient,
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

IE.route('/edukasi-integrasi/process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const localDebug = debugEMR.extend(req.path);
    localDebug(`Request Begin`);
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.');
        localDebug(`Get Data ${req.emrID}`);
        if (emrData && emrData !== null) {
          const dataToPost: IUpdateEdukasiTerintegrasi = req.body;
          const officer1 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_edukator_dpjp}')]`);
          const officer2 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_edukator_informasi_lain}')]`);
          const officer3 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_edukator_keperawatan}')]`);
          const officer4 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_edukator_manajemen_nyeri}')]`);
          const officer5 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_edukator_gizi}')]`);
          const officer6 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_edukator_post_op}')]`);
          const officer7 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_edukator_farmasi}')]`);
          const officer8 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_edukator_dokter}')]`);
          const officer9 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_edukator_mencuci_tangan}')]`);
          const officer10 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_edukator_penggunaan_peralatan}')]`);
          const officer11 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_edukator_hak_kewajiban}')]`);
          const jsonData = EdukasiTerintegrasi.createFromJson(dataToPost);
          const redisJsonData: IEdukasiTerintegrasi = {
            ...jsonData,
            Nama_Edukator_DPJP: officer1 && Array.isArray(officer1) && officer1.length > 0 && officer1[0] ? officer1[0].Nama : '',
            Nama_Edukator_Gizi: officer5 && Array.isArray(officer5) && officer5.length > 0 && officer5[0] ? officer5[0].Nama : '',
            Nama_Edukator_Manajemen_Nyeri: officer4 && Array.isArray(officer4) && officer4.length > 0 && officer4[0] ? officer4[0].Nama : '',
            Nama_Edukator_Post_Operasi: officer6 && Array.isArray(officer6) && officer6.length > 0 && officer6[0] ? officer6[0].Nama : '',
            Nama_Edukator_Keperawatan: officer3 && Array.isArray(officer3) && officer3.length > 0 && officer3[0] ? officer3[0].Nama : '',
            Nama_Edukator_Farmasi: officer7 && Array.isArray(officer7) && officer7.length > 0 && officer7[0] ? officer7[0].Nama : '',
            Nama_Edukator_Dokter: officer8 && Array.isArray(officer8) && officer8.length > 0 && officer8[0] ? officer8[0].Nama : '',
            Nama_Edukator_Rohaniawan: officer5 && Array.isArray(officer5) && officer5.length > 0 && officer5[0] ? officer5[0].Nama : '',
            Nama_Edukator_Mencuci_Tangan: officer9 && Array.isArray(officer9) && officer9.length > 0 && officer9[0] ? officer9[0].Nama : '',
            Nama_Edukator_Penggunaan_Peralatan: officer10 && Array.isArray(officer10) && officer10.length > 0 && officer10[0] ? officer10[0].Nama : '',
            Nama_Edukator_Hak_Kewajiban: officer11 && Array.isArray(officer11) && officer11.length > 0 && officer11[0] ? officer11[0].Nama : '',
            Nama_Edukator_Informasi_Lain: officer2 && Array.isArray(officer2) && officer2.length > 0 && officer2[0] ? officer2[0].Nama : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }
          const common: ICommon = {
            Edukasi_Integrasi: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Common && newEmrData.Common !== null) {
            newEmrData.Common.Edukasi_Integrasi = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Common.Edukasi_Integrasi',
              updateDocument.newDocument.Common.Edukasi_Integrasi,
            );
            ElasticLoggerService().createLog(req, '/edukasi-integrasi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                data: {
                  EMR_ID: req.emrID,
                  nomor_mr: (emrData.No_MR) ? emrData.No_MR : '',
                  id_pelayanan: (emrData.ID_Pelayanan && emrData.ID_Pelayanan !== '') ? emrData.ID_Pelayanan : '',
                  jenis_pelayanan: (emrData.Jenis_Pelayanan && emrData.Jenis_Pelayanan !== '') ? emrData.Jenis_Pelayanan : '',
                  kode_cabang: (emrData.Kode_Cabang && emrData.Kode_Cabang !== '') ? emrData.Kode_Cabang : '',
                  pasien: (emrData.Pasien) ? emrData.Pasien : {},
                  tipe_pasien: (emrData.Tipe_Pasien && emrData.Tipe_Pasien !== '') ? emrData.Tipe_Pasien : '',
                  form: updateDocument.newDocument.Common.Edukasi_Integrasi ?? {},
                },
              })
            }
          } else {
            newEmrData.Common = common;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Common', updateDocument.newDocument.Common);
            ElasticLoggerService().createLog(req, '/edukasi-integrasi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/edukasi-integrasi', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/edukasi-integrasi', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      localDebug(`Error ${err}`);
      ElasticLoggerService().createHTTPResponse(req, res, 500, {
        message: "Internal Server Error",
        error: err,
      });
    }
  })

export { IE };
