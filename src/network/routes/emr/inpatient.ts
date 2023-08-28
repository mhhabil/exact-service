import { Router, Request, Response, NextFunction } from "express";
import RBAC from "services/rbac";
import moment from "moment";
import * as jsonpatch from 'fast-json-patch';
import { v4 as uuid } from "uuid";
import { ElasticLoggerService } from "./services";
import {
  IUpdateCatatanMedisAwal,
  IUpdateDpjp,
  IUpdateFormulirPraAnestesi,
  IUpdatePemberianInformasiResikoPasienJatuh,
  IUpdatePengkajianAwalGizi,
  IUpdatePengkajianAwalKeperawatanAnak,
  IUpdatePengkajianAwalKeperawatanDewasa,
  IUpdatePersetujuanTindakanAnestesi,
  IUpdateRencanaAsuhanKeperawatan,
  IUpdateRencanaPemulanganPasien,
  IUpdateResumePasienPulang,
  IUpdateSuratPerintahRawatInap,
  IUpdateSurveilansInfeksiHais,
} from "./interfaces/inpatient/inpatient.request";
import {
  AsesmenUlangTandaVital,
  CatatanMedisAwal,
  Dpjp,
  EarlyWarningScoring,
  FormulirPraAnestesi,
  ImplementasiPasienResikoJatuh,
  InfeksiDaerahOperasi,
  MonitoringSkalaNyeri,
  PemberianInformasi,
  PemberianInformasiResikoPasienJatuh,
  PengkajianAwalGizi,
  PengkajianResikoJatuhAnak,
  PengkajianResikoJatuhDewasa,
  PersetujuanTindakanAnestesi,
  PersetujuanTindakanDokter,
  RanapPengkajianAwalKeperawatanAnak,
  RanapPengkajianAwalKeperawatanDewasa,
  RencanaAsuhanKeperawatan,
  RencanaPemulanganPasien,
  ResumePasienPulang,
  SuratPerintahRawatInap,
  SurveilansInfeksiHais,
} from "./interfaces/inpatient/inpatient.model";
import { getCpptNurseData, getFirstEarlyWarningScoreType, getFirstEws, getInpatientCpptDoctor, getInpatientCpptNurse, getLastCpptDoctorData, isValidFile } from "./helpers/app.helper";
import { ChecklistPraOperasiForm, IHowToUse, IMedicine, IMedsPackage, PenandaanAreaPembedahan, RajalCatatanKeperawatanPra, SerahTerimaPasien } from "./interfaces/outpatient/outpatient.model";
import { IUpdateAsesmenPraOperasi } from "./interfaces/ok/ok.request";
import { AsesmenPraOperasi } from "./interfaces/ok/ok.model";
import { IPostMedsToSimrs, IUpdateChecklistPraOperasi, IUpdatePenandaanAreaPembedahan, IUpdateSerahTerimaPasien, PostDaftarObat } from "./interfaces/outpatient/outpatient.request";
const debugEMR = require("debug")("emr");

const Inpatient = Router();

Inpatient.route('/rawat-inap/pengkajian-awal-keperawatan-dewasa-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Rawat_Inap'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      const checkUgd = await global.medicalRecord.keys(req.emrID, '.UGD');
      if (checkUgd !== null && checkUgd.includes('Assesmen')) {
        emrKeys.push('UGD.Assesmen');
      }
      if (checkObject !== null && checkObject.includes('Pengkajian_Awal_Keperawatan_Dewasa')) {
        emrKeys.push('Rawat_Inap.Pengkajian_Awal_Keperawatan_Dewasa');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form: IRanapPengkajianAwalKeperawatanDewasa = result['Rawat_Inap.Pengkajian_Awal_Keperawatan_Dewasa'] ? result['Rawat_Inap.Pengkajian_Awal_Keperawatan_Dewasa'] : {}
        const rawat_inap = result['Rawat_Inap'] ? result['Rawat_Inap'] : {}
        const assessmentUgd = result['UGD.Assesmen'] ?? {};
        const ews = await getFirstEws(req.emrID);

        if (form.TTD_Perawat_Pengkajian_Keluar && form.TTD_Perawat_Pengkajian_Keluar !== '' && isValidFile(form.TTD_Perawat_Pengkajian_Keluar)) {
          form.TTD_Perawat_Pengkajian_Keluar = await global.storage.signUrl(form.TTD_Perawat_Pengkajian_Keluar, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Perawat_Pengkajian_Masuk && form.TTD_Perawat_Pengkajian_Masuk !== '' && isValidFile(form.TTD_Perawat_Pengkajian_Masuk)) {
          form.TTD_Perawat_Pengkajian_Masuk = await global.storage.signUrl(form.TTD_Perawat_Pengkajian_Masuk, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.Gambar_Mata_OD && form.Gambar_Mata_OD !== '' && isValidFile(form.Gambar_Mata_OD)) {
          form.Gambar_Mata_OD = await global.storage.signUrl(form.Gambar_Mata_OD, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.Gambar_Mata_OS && form.Gambar_Mata_OS !== '' && isValidFile(form.Gambar_Mata_OS)) {
          form.Gambar_Mata_OS = await global.storage.signUrl(form.Gambar_Mata_OS, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }

        const data: any = {
          EMR_ID: req.emrID,
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          form,
          rawat_inap,
          asesmen: assessmentUgd,
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

Inpatient.route('/rawat-inap/pengkajian-awal-keperawatan-dewasa-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdatePengkajianAwalKeperawatanDewasa = req.body;
          const nurseout = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==1&&@.Status_Dokter==0&&@.ID_Karyawan=='${dataToPost["id-perawat-pengkajian-keluar"]}')]`)
          const nursein = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==1&&@.Status_Dokter==0&&@.ID_Karyawan=='${dataToPost["id-perawat-pengkajian-masuk"]}')]`)
          const fixedData = RanapPengkajianAwalKeperawatanDewasa.createFromJson(dataToPost);
          const redisJsonData: IRanapPengkajianAwalKeperawatanDewasa = {
            ...fixedData,
            Nama_Perawat_Pengkajian_Keluar: nurseout && Array.isArray(nurseout) && nurseout.length > 0 && nurseout[0] ? nurseout[0].Nama : '',
            Nama_Perawat_Pengkajian_Masuk: nursein && Array.isArray(nursein) && nursein.length > 0 && nursein[0] ? nursein[0].Nama : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const inpatient: IRawatInap = {
            Pengkajian_Awal_Keperawatan_Dewasa: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Inap && newEmrData.Rawat_Inap !== null) {
            newEmrData.Rawat_Inap.Pengkajian_Awal_Keperawatan_Dewasa = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Inap.Pengkajian_Awal_Keperawatan_Dewasa',
              updateDocument.newDocument.Rawat_Inap.Pengkajian_Awal_Keperawatan_Dewasa,
            );
            ElasticLoggerService().createLog(req, '/rawat-inap/pengkajian-awal-keperawatan-dewasa', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.Rawat_Inap = inpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Inap', updateDocument.newDocument.Rawat_Inap);
            ElasticLoggerService().createLog(req, '/rawat-inap/pengkajian-awal-keperawatan-dewasa', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-inap/pengkajian-awal-keperawatan-dewasa', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-inap/pengkajian-awal-keperawatan-dewasa', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-inap/pengkajian-awal-keperawatan-dewasa', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  })

Inpatient.route('/rawat-inap/pengkajian-awal-keperawatan-anak-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Rawat_Inap'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      const checkUgd = await global.medicalRecord.keys(req.emrID, '.UGD');
      if (checkUgd !== null && checkUgd.includes('Assesmen')) {
        emrKeys.push('UGD.Assesmen');
      }
      if (checkObject !== null && checkObject.includes('Pengkajian_Awal_Keperawatan_Anak')) {
        emrKeys.push('Rawat_Inap.Pengkajian_Awal_Keperawatan_Anak');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form: IRanapPengkajianAwalKeperawatanAnak = result['Rawat_Inap.Pengkajian_Awal_Keperawatan_Anak'] ? result['Rawat_Inap.Pengkajian_Awal_Keperawatan_Anak'] : {}
        const rawat_inap = result['Rawat_Inap'] ? result['Rawat_Inap'] : {}
        const assessmentUgd = result['UGD.Assesmen'] ?? {};
        const ews = await getFirstEws(req.emrID);

        if (form.TTD_Perawat_Pengkaji && form.TTD_Perawat_Pengkaji !== '' && isValidFile(form.TTD_Perawat_Pengkaji)) {
          form.TTD_Perawat_Pengkaji = await global.storage.signUrl(form.TTD_Perawat_Pengkaji, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }

        const data: any = {
          EMR_ID: req.emrID,
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          form,
          rawat_inap,
          asesmen: assessmentUgd,
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
  })

Inpatient.route('/rawat-inap/pengkajian-awal-keperawatan-anak-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdatePengkajianAwalKeperawatanAnak = req.body;
          const nurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==1&&@.Status_Dokter==0&&@.ID_Karyawan=='${dataToPost.id_perawat_pengkaji}')]`)
          const fixedData = RanapPengkajianAwalKeperawatanAnak.createFromJson(dataToPost);
          const redisJsonData: IRanapPengkajianAwalKeperawatanAnak = {
            ...fixedData,
            Nama_Perawat_Pengkaji: nurse && Array.isArray(nurse) && nurse.length > 0 && nurse[0] ? nurse[0].Nama : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const inpatient: IRawatInap = {
            Pengkajian_Awal_Keperawatan_Anak: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Inap && newEmrData.Rawat_Inap !== null) {
            newEmrData.Rawat_Inap.Pengkajian_Awal_Keperawatan_Anak = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Inap.Pengkajian_Awal_Keperawatan_Anak',
              updateDocument.newDocument.Rawat_Inap.Pengkajian_Awal_Keperawatan_Anak,
            );
            ElasticLoggerService().createLog(req, '/rawat-inap/pengkajian-awal-keperawatan-anak', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.Rawat_Inap = inpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Inap', updateDocument.newDocument.Rawat_Inap);
            ElasticLoggerService().createLog(req, '/rawat-inap/pengkajian-awal-keperawatan-anak', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-inap/pengkajian-awal-keperawatan-anak', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-inap/pengkajian-awal-keperawatan-anak', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-inap/pengkajian-awal-keperawatan-anak', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  })

Inpatient.route('/rawat-inap/pengkajian-early-warning-scoring-system-item')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Rawat_Inap'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      if (checkObject !== null && checkObject.includes('Pengkajian_Early_Warning_Scoring_System')) {
        emrKeys.push('Rawat_Inap.Pengkajian_Early_Warning_Scoring_System');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const records = result['Rawat_Inap.Pengkajian_Early_Warning_Scoring_System'] && Array.isArray(result['Rawat_Inap.Pengkajian_Early_Warning_Scoring_System']) ? result['Rawat_Inap.Pengkajian_Early_Warning_Scoring_System'] : [];

        for (let i = 0; i < records.length; i += 1) {
          if (records[i].TTD_Perawat && records[i].TTD_Perawat !== '' && isValidFile(records[i].TTD_Perawat)) {
            records[i].TTD_Perawat = await global.storage.signUrl(records[i].TTD_Perawat);
          }
        }
        const total = records.length;
        const data: any = {
          total,
          totalFiltered: records.length,
          EMR_ID: req.emrID,
          pasien: result.Pasien,
          records,
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
  })

Inpatient.route('/rawat-inap/pengkajian-early-warning-scoring-system-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const ewsType = await getFirstEarlyWarningScoreType(req.emrID);
    const type = req.body.tipe_ews ? req.body.tipe_ews : ewsType ? ewsType : '';
    let responseMessage: string = '';
    try {
      const emrKeys = ["Kode_Cabang", "No_MR", "Pasien", "Tipe_Pasien", 'Rawat_Inap'];
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      if (checkObject !== null && checkObject.includes('Pengkajian_Early_Warning_Scoring_System')) {
        emrKeys.push('Rawat_Inap.Pengkajian_Early_Warning_Scoring_System');
      }
      const id = req.body.id;
      const emrData = await global.medicalRecord.get(req.emrID, emrKeys);
      if (emrData && emrData !== null) {
        let jsonData = {};
        if (type && type === '1') {
          jsonData = EarlyWarningScoring.adultCreateFromJson(req.body);
        }
        if (type && type === '2') {
          jsonData = EarlyWarningScoring.childrenCreateFromJson(req.body);
        }
        const nurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==1&&@.Status_Dokter==0&&@.ID_Karyawan=='${req.body.id_perawat}')]`)
        const fixedData = {
          ...jsonData,
          Tipe_Ews: type ? type : '',
          Pengkaji: req.userProfile && req.userProfile.nama ? req.userProfile.nama : '',
          Pengkaji_Id: req.userId ?? '',
          TTD_Perawat: req.body.ttd_perawat && req.body.ttd_perawat !== '' && isValidFile(req.body.ttd_perawat) ? global.storage.cleanUrl(req.body.ttd_perawat) : '',
          ID_Perawat: req.body.id_perawat ?? '',
          Nama_Perawat: nurse && Array.isArray(nurse) && nurse.length > 0 && nurse[0] ? nurse[0].Nama : '',
          Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
          Updated_By: (req.userId) ? req.userId : '',
        }

        if (!id || id === '') {
          const redisJsonData = {
            ...fixedData,
            ID: uuid().replace(/-/g, "").toUpperCase(),
          }
          await global.medicalRecord.addEarlyWarningScoring(req.emrID, redisJsonData);
          responseMessage = 'Data berhasil ditambah';
        } else {
          const listPrja = emrData['Rawat_Inap.Pengkajian_Early_Warning_Scoring_System'] && Array.isArray(emrData['Rawat_Inap.Pengkajian_Early_Warning_Scoring_System']) ? emrData['Rawat_Inap.Pengkajian_Early_Warning_Scoring_System'] : [];
          const selectedObject = listPrja.find((item: any) => item.ID === id);
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

            const updateDocument = jsonpatch.applyPatch(selectedObject, patch);
            await global.medicalRecord.update(req.emrID, `$.Rawat_Inap.Pengkajian_Early_Warning_Scoring_System[?(@.ID=="${id}")]`, updateDocument.newDocument);
            responseMessage = "Data berhasil diubah";
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
      ElasticLoggerService().createHTTPResponse(req, res, 500, {
        message: "Internal Server Error",
        error: err,
      });
    }
  })

Inpatient.route('/rawat-inap/pengkajian-early-warning-scoring-system-delete')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const emrKeys: Array<string> = [];
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap')
      if (checkObject && checkObject !== null && checkObject.includes('Pengkajian_Early_Warning_Scoring_System')) {
        emrKeys.push('Rawat_Inap.Pengkajian_Early_Warning_Scoring_System');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);

      if (result && Array.isArray(result) && result.length > 0) {
        const index = result.findIndex((val: any) => val.ID === req.body.id);
        await global.medicalRecord.deleteEarlyWarningScore(req.emrID, index);
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
  })

Inpatient.route('/rawat-inap/rencana-pemulangan-pasien-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Rawat_Inap'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      const checkRajal = await global.medicalRecord.keys(req.emrID, '.Rawat_Jalan');
      const checkUgd = await global.medicalRecord.keys(req.emrID, '.UGD');
      if (checkObject !== null && checkObject.includes('Rencana_Pemulangan_Pasien')) {
        emrKeys.push('Rawat_Inap.Rencana_Pemulangan_Pasien');
      }
      if (checkUgd !== null && checkUgd.includes('Assesmen')) {
        emrKeys.push('UGD.Assesmen');
      }
      if (checkRajal !== null && checkRajal.includes('Pemberian_Informasi')) {
        emrKeys.push('Rawat_Jalan.Pemberian_Informasi');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form: IRencanaPemulanganPasien = result['Rawat_Inap.Rencana_Pemulangan_Pasien'] ? result['Rawat_Inap.Rencana_Pemulangan_Pasien'] : {}
        const informConsent = result['Rawat_Jalan.Pemberian_Informasi'] ?? {};
        if (form.Tanda_Tangan_Pasien && form.Tanda_Tangan_Pasien !== '' && isValidFile(form.Tanda_Tangan_Pasien)) {
          form.Tanda_Tangan_Pasien = await global.storage.signUrl(form.Tanda_Tangan_Pasien, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.Tanda_Tangan_Perawat_Pengkaji && form.Tanda_Tangan_Perawat_Pengkaji !== '' && isValidFile(form.Tanda_Tangan_Perawat_Pengkaji)) {
          form.Tanda_Tangan_Perawat_Pengkaji = await global.storage.signUrl(form.Tanda_Tangan_Perawat_Pengkaji, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        const ugd = result['UGD.Assesmen'] ? result['UGD.Assesmen'] : {};
        const rawat_inap = result['Rawat_Inap'] ? result['Rawat_Inap'] : {}
        const nama_dokter = rawat_inap.Nama_Dokter ?? '';
        const jam_masuk = `${rawat_inap.Tgl_Masuk} ${rawat_inap.Jam_Masuk}`;
        const cppt = getLastCpptDoctorData(req.emrParams.Kode_Cabang, req.emrParams.No_MR);


        const data: any = {
          EMR_ID: req.emrID,
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          form,
          rawat_inap,
          nama_dokter,
          jam_masuk,
          diagnosa_medis: ugd.Dokter_Mata_Diagnosa ?? '',
          cppt,
          inform_consent: informConsent ?? {},
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
  })

Inpatient.route('/rawat-inap/rencana-pemulangan-pasien-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdateRencanaPemulanganPasien = req.body;
          const dpjpName = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.pasien_dpjp}')]`)
          const nurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==1&&@.Status_Dokter==0&&@.ID_Karyawan=='${dataToPost.pasien_perawat}')]`)
          const nurse1 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==1&&@.Status_Dokter==0&&@.ID_Karyawan=='${dataToPost.id_perawat_pengkaji}')]`)
          const fixedData = RencanaPemulanganPasien.createFromJson(dataToPost);
          const redisJsonData: IRencanaPemulanganPasien = {
            ...fixedData,
            Nama_Dokter_DPJP: dpjpName && Array.isArray(dpjpName) && dpjpName.length > 0 && dpjpName[0] ? dpjpName[0].Nama : '',
            Pasien_Perawat_Nama: nurse && Array.isArray(nurse) && nurse.length > 0 && nurse[0] ? nurse[0].Nama : '',
            Nama_Perawat_Pengkaji: nurse1 && Array.isArray(nurse1) && nurse1.length > 0 && nurse1[0] ? nurse1[0].Nama : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const inpatient: IRawatInap = {
            Rencana_Pemulangan_Pasien: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Inap && newEmrData.Rawat_Inap !== null) {
            newEmrData.Rawat_Inap.Rencana_Pemulangan_Pasien = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Inap.Rencana_Pemulangan_Pasien',
              updateDocument.newDocument.Rawat_Inap.Rencana_Pemulangan_Pasien,
            );
            ElasticLoggerService().createLog(req, '/rawat-inap/rencana-pemulangan-pasien', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.Rawat_Inap = inpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Inap', updateDocument.newDocument.Rawat_Inap);
            ElasticLoggerService().createLog(req, '/rawat-inap/rencana-pemulangan-pasien', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-inap/rencana-pemulangan-pasien', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-inap/rencana-pemulangan-pasien', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-inap/rencana-pemulangan-pasien', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  })

Inpatient.route('/rawat-inap/pengkajian-resiko-jatuh-anak-item')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Rawat_Inap'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      if (checkObject !== null && checkObject.includes('Pengkajian_Resiko_Jatuh_Anak')) {
        emrKeys.push('Rawat_Inap.Pengkajian_Resiko_Jatuh_Anak');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const records = result['Rawat_Inap.Pengkajian_Resiko_Jatuh_Anak'] && Array.isArray(result['Rawat_Inap.Pengkajian_Resiko_Jatuh_Anak']) ? result['Rawat_Inap.Pengkajian_Resiko_Jatuh_Anak'] : [];

        for (let i = 0; i < records.length; i += 1) {
          if (records[i].TTD_Petugas && records[i].TTD_Petugas !== '' && isValidFile(records[i].TTD_Petugas)) {
            records[i].TTD_Petugas = await global.storage.signUrl(records[i].TTD_Petugas, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
          }
        }
        const total = records.length;
        const data: any = {
          total,
          totalFiltered: records.length,
          EMR_ID: req.emrID,
          pasien: result.Pasien,
          records,
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
  })

Inpatient.route('/rawat-inap/pengkajian-resiko-jatuh-anak-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const localDebug = debugEMR.extend(req.path);
    localDebug(`Request Begin`);
    let responseMessage: string = '';
    try {
      const emrKeys = ["Kode_Cabang", "No_MR", "Pasien", "Tipe_Pasien", 'Rawat_Inap'];
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      if (checkObject !== null && checkObject.includes('Pengkajian_Resiko_Jatuh_Anak')) {
        emrKeys.push('Rawat_Inap.Pengkajian_Resiko_Jatuh_Anak');
      }
      const id = req.body.id;
      const dataToPost = req.body;
      const emrData = await global.medicalRecord.get(req.emrID, emrKeys);
      localDebug(`Get Data ${req.emrID}`);
      if (emrData && emrData !== null) {
        const officer = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.petugas}')]`)
        const jsonData = PengkajianResikoJatuhAnak.createFromJson(dataToPost);
        const fixedData = {
          ...jsonData,
          Pengkaji: req.userProfile && req.userProfile.nama ? req.userProfile.nama : '',
          Pengkaji_Id: req.userId ?? '',
          Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
          Updated_By: (req.userId) ? req.userId : '',
          Nama_Petugas: officer && Array.isArray(officer) && officer.length > 0 && officer[0] ? officer[0].Nama : '',
        }

        let data;
        if (!id || id === '') {
          const redisJsonData = {
            ...fixedData,
            ID: uuid().replace(/-/g, "").toUpperCase(),
          }
          await global.medicalRecord.addPengkajianResikoJatuhAnak(req.emrID, redisJsonData);
          responseMessage = 'Data berhasil ditambah';
          data = redisJsonData;
        } else {
          const listPrja = emrData['Rawat_Inap.Pengkajian_Resiko_Jatuh_Anak'] && Array.isArray(emrData['Rawat_Inap.Pengkajian_Resiko_Jatuh_Anak']) ? emrData['Rawat_Inap.Pengkajian_Resiko_Jatuh_Anak'] : [];
          const selectedObject = listPrja.find((item: any) => item.ID === id);
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
            await global.medicalRecord.update(req.emrID, `$.Rawat_Inap.Pengkajian_Resiko_Jatuh_Anak[?(@.ID=="${id}")]`, updateDocument.newDocument);
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
  })

Inpatient.route('/rawat-inap/pengkajian-resiko-jatuh-anak-delete')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const emrKeys: Array<string> = [];
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap')
      if (checkObject && checkObject !== null && checkObject.includes('Pengkajian_Resiko_Jatuh_Anak')) {
        emrKeys.push('Rawat_Inap.Pengkajian_Resiko_Jatuh_Anak');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);

      if (result && Array.isArray(result) && result.length > 0) {
        const index = result.findIndex((val: any) => val.ID === req.body.id);
        await global.medicalRecord.deletePengkajianResikoJatuhAnak(req.emrID, index);
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
  })

Inpatient.route('/rawat-inap/catatan-medis-awal-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Rawat_Inap'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      const checkRajal = await global.medicalRecord.keys(req.emrID, '.Rawat_Jalan');
      if (checkObject !== null && checkObject.includes('Catatan_Medis_Awal')) {
        emrKeys.push('Rawat_Inap.Catatan_Medis_Awal');
      }
      if (checkObject !== null && checkObject.includes('Daftar_Resep_Visit_Dokter')) {
        emrKeys.push('Rawat_Inap.Daftar_Resep_Visit_Dokter');
      }
      if (checkObject !== null && checkObject.includes('Daftar_Visit_Dokter')) {
        emrKeys.push('Rawat_Inap.Daftar_Visit_Dokter');
      }
      const checkUgd = await global.medicalRecord.keys(req.emrID, '.UGD');
      if (checkUgd !== null && checkUgd.includes('Assesmen')) {
        emrKeys.push('UGD.Assesmen');
      }
      if (checkRajal !== null && checkRajal.includes('Pemberian_Informasi')) {
        emrKeys.push('Rawat_Jalan.Pemberian_Informasi');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const meds = await global.medicalRecord.get(`Obat:{${result.Kode_Cabang}}:${result.Tipe_Pasien}`);
        const htu = await global.medicalRecord.get(`AturanPakai:{${result.Kode_Cabang}}`);
        let medsPackage: any = await global.medicalRecord.get(`PaketObat:{${result.Kode_Cabang}}`);
        if (medsPackage && medsPackage !== null && Array.isArray(medsPackage)) {
          const activePackage = medsPackage.filter((item: IMedsPackage) => item.Status_Aktif)
          const serviceFiltered = activePackage.filter((item: IMedsPackage) => item.Tipe_Pelayanan === result.Tipe_Pasien);
          medsPackage = serviceFiltered;
        }
        const form: ICatatanMedisAwal = result['Rawat_Inap.Catatan_Medis_Awal'] ? result['Rawat_Inap.Catatan_Medis_Awal'] : {}
        const visits: Array<IDaftarVisitDokter> = result['Rawat_Inap.Daftar_Visit_Dokter'] && Array.isArray(result['Rawat_Inap.Daftar_Visit_Dokter']) ? result['Rawat_Inap.Daftar_Visit_Dokter'] : [];
        const prescriptions = result['Rawat_Inap.Daftar_Resep_Visit_Dokter'] ?? [];
        const informConsent = result['Rawat_Jalan.Pemberian_Informasi'] ?? {};
        const assessmentUgd = result['UGD.Assesmen'] ?? {};
        const ews = await getFirstEws(req.emrID);

        //GET Tebus Obat
        let pharmacy = undefined;
        if (form.No_Berobat && Array.isArray(prescriptions) && prescriptions.length > 0) {
          const findPharmacy = prescriptions.find((item: any) => item.ID_Berobat === form.No_Berobat)
          if (findPharmacy) {
            pharmacy = findPharmacy;
          } else {
            pharmacy = undefined;
          }
        }

        const image1 = form.Image_1 ?? undefined;
        const image2 = form.Image_2 ?? undefined;

        if (form.TTD_Dokter && form.TTD_Dokter !== '' && isValidFile(form.TTD_Dokter)) {
          form.TTD_Dokter = await global.storage.signUrl(form.TTD_Dokter, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }

        if (form.Gambar_Mata_OD && form.Gambar_Mata_OD !== '' && isValidFile(form.Gambar_Mata_OD)) {
          form.Gambar_Mata_OD = await global.storage.signUrl(form.Gambar_Mata_OD, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }

        if (form.Gambar_Mata_OS && form.Gambar_Mata_OS !== '' && isValidFile(form.Gambar_Mata_OS)) {
          form.Gambar_Mata_OS = await global.storage.signUrl(form.Gambar_Mata_OS, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }

        if (form.Gambar_Retina_OD && form.Gambar_Retina_OD !== '' && isValidFile(form.Gambar_Retina_OD)) {
          form.Gambar_Retina_OD = await global.storage.signUrl(form.Gambar_Retina_OD, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }

        if (form.Gambar_Retina_OS && form.Gambar_Retina_OS !== '' && isValidFile(form.Gambar_Retina_OS)) {
          form.Gambar_Retina_OS = await global.storage.signUrl(form.Gambar_Retina_OS, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }

        if (image1 && image1.Url_Image && image1.Url_Image !== '' && isValidFile(image1.Url_Image)) {
          form.Image_1.Url_Image = await global.storage.signUrl(form.Image_1.Url_Image, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }

        if (image2 && image2.Url_Image && image2.Url_Image !== '' && isValidFile(image2.Url_Image)) {
          form.Image_2.Url_Image = await global.storage.signUrl(form.Image_2.Url_Image, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }


        const data: any = {
          EMR_ID: req.emrID,
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          form,
          asesmen: assessmentUgd,
          obat: meds ?? [],
          aturan_pakai: htu ?? [],
          paket_obat: medsPackage ?? [],
          pharmacy: pharmacy ?? {},
          inform_consent: informConsent ?? {},
          visits,
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
  })

Inpatient.route('/rawat-inap/catatan-medis-awal-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdateCatatanMedisAwal = req.body;
          const meds = await global.medicalRecord.get(`Obat:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`);
          const htu = await global.medicalRecord.get(`AturanPakai:{${emrData.Kode_Cabang}}`);
          let sendPrescription = {};
          const isDoctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${req.userId}')]`)

          const prescriptions: Array<IPrescription> | Array<any> = [];

          for (let i = 0; i < (req.body['nama-obat'] ? req.body['nama-obat'] : []).length; i += 1) {
            const medsCode = req.body['nama-obat'][i] ? req.body['nama-obat'][i] : ''
            const total = req.body['jumlah'][i] ? req.body['jumlah'][i] : '';
            const note = req.body['catatan'][i] ? req.body['catatan'][i] : '';
            const howToUse = req.body['aturan-pakai'][i] ? req.body['aturan-pakai'][i] : '';

            const selectedMeds = meds && Array.isArray(meds) && meds.find((med: IMedicine) => med.Kode_Inventory.toString() === medsCode.toString());

            const selectedHtu = htu && Array.isArray(htu) && htu.find((howTo: IHowToUse) => howTo.ID_AturanPakai === parseInt(howToUse));

            if (selectedMeds && selectedHtu) {
              prescriptions.push({
                ID_Obat: selectedMeds.Kode_Inventory,
                Nama_Obat: selectedMeds.Nama_Inventory,
                ID_Satuan: selectedMeds.ID_Satuan,
                Nama_Satuan: selectedMeds.Nama_Satuan,
                ID_AturanPakai: selectedHtu.ID_AturanPakai,
                Nama_AturanPakai: selectedHtu.Nama,
                Kode_AturanPakai: selectedHtu.Kode,
                Jumlah: total,
                Catatan: note,
              })
            }
          }

          const postDaftarObat: any = [];

          for (const item of prescriptions) {
            const obat = PostDaftarObat.createFromPrescription(item);
            postDaftarObat.push(obat);
          }

          if (postDaftarObat.length > 0 && (req.body['is-form-dokter'] || req.body['is-form-dokter'] === 1)) {
            const paramsToSimrs: IPostMedsToSimrs = {
              company_code: req.body.kode_cabang,
              tipe_pelayanan: req.body.tipe_pasien,
              no_berobat: req.body.id_pelayanan,
              tgl_resep: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
              id_dokter: req.body.id_dokter,
              keterangan: '',
              no_resep: '',
              emr: '1',
              berat_badan: 0,
              alergi: '',
              daftar_obat: postDaftarObat,
            }

            const result = await global.messagingService.sendMessage(emrData.Kode_Cabang, '/farmasi/resep_obat/tambah_emr', { ...paramsToSimrs, token: req.token });
            sendPrescription = result && result.body ? result.body : {};
            ElasticLoggerService().createLog(result ? { body: paramsToSimrs } : {}, '/messaging/farmasi', result?.body ?? {});
          }

          const pictureDataO = dataToPost.image_1 ? CatatanMedisAwal.createImageCppt(dataToPost.image_1) : undefined;
          const image2 = dataToPost.image_2 ? dataToPost.image_2 : undefined;
          if (image2) {
            image2.Url_Image = image2.Url_Image && image2.Url_Image !== '' && isValidFile(image2.Url_Image) ? global.storage.cleanUrl(image2.Url_Image) : '';
          }
          if (pictureDataO) {
            pictureDataO.Url_Image_Cppt_Data_O = pictureDataO.Url_Image_Cppt_Data_O && pictureDataO.Url_Image_Cppt_Data_O !== '' && isValidFile(pictureDataO.Url_Image_Cppt_Data_O) ? global.storage.cleanUrl(pictureDataO.Url_Image_Cppt_Data_O) : '';
          }

          const doctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost["id-dokter"]}')]`)
          const fixedData = CatatanMedisAwal.createFromJson(dataToPost);
          const redisJsonData: ICatatanMedisAwal = {
            ...fixedData,
            Resep: prescriptions ?? [],
            Nama_Dokter: doctor && Array.isArray(doctor) && doctor.length > 0 && doctor[0] ? doctor[0].Nama : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }


          //Create CPPT Data
          const doctorPreliminary = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${dataToPost["id-dokter"]}')]`)
          const cpptRawData = CatatanMedisAwal.createToCPPT(dataToPost);
          const cpptData: any = {
            ...cpptRawData,
            Resep: prescriptions ?? [],
            ID_Petugas: req.userId ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Is_Dokter: !!(isDoctor && Array.isArray(isDoctor) && isDoctor.length > 0),
            Nama_Perawat_Cppt: '',
            Nama_Dokter_Pengkaji: (doctorPreliminary && doctorPreliminary.length > 0) ? doctorPreliminary[0].Nama : '',
            Picture_Data_O: (pictureDataO) ? pictureDataO : {},
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }
          const cpptId = dataToPost.cppt_id ?? '';

          if (!cpptId || cpptId === "") {
            // create CPPT
            cpptData.ID = uuid().replace(/-/g, "").toUpperCase();
            cpptData.ID_Petugas = req.userId;
            cpptData.Nama_Petugas = req.userProfile.nama;
            cpptData.Deleted = 0;
            redisJsonData.CPPT_ID = cpptData.ID;
            await global.medicalRecord.addCPPT(req.emrID, cpptData);
          } else {
            const searchQuery = `\'@Kode_Cabang:${emrData.Kode_Cabang} @No_MR:${emrData.No_MR} "${cpptId}"\'`;
            const result = await global.medicalRecord.findCPPT(searchQuery, {
              RETURN: ["$.Kode_Cabang", "$.No_MR", `$.Common.CPPT[?(@.ID=="${cpptId}")]`],
            });
            let data: any;
            if (result.documents.length > 0) {
              data = JSON.parse(result.documents[0].value[`$.Common.CPPT[?(@.ID=="${cpptId}")]`]);
              if (data["Deleted"] && data["Deleted"] === 1) {
                data = {};
                cpptData.ID = uuid().replace(/-/g, "").toUpperCase();
                cpptData.ID_Petugas = req.userId;
                cpptData.Nama_Petugas = req.userProfile.nama;
                cpptData.Deleted = 0;
                redisJsonData.CPPT_ID = cpptData.ID;
                await global.medicalRecord.addCPPT(req.emrID, cpptData);
              } else {
                // update CPPT
                const userDetail = await RBAC.getInstance().getUserProfile(req.token, data.ID_Petugas);
                cpptData.ID = dataToPost.cppt_id;
                cpptData.ID_Petugas = data.ID_Petugas;
                cpptData.Nama_Petugas = userDetail.nama ? userDetail.nama : '';
                cpptData.Deleted = 0;
                redisJsonData.CPPT_ID = dataToPost.cppt_id;
                const diff = jsonpatch.compare(data, cpptData);

                const updateDocument = jsonpatch.applyPatch(data, diff);
                await global.medicalRecord.update(req.emrID, `$.Common.CPPT[?(@.ID=="${cpptId}")]`, updateDocument.newDocument);
              }
            }
          }

          const inpatient: IRawatInap = {
            Catatan_Medis_Awal: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Inap && newEmrData.Rawat_Inap !== null) {
            newEmrData.Rawat_Inap.Catatan_Medis_Awal = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Inap.Catatan_Medis_Awal',
              updateDocument.newDocument.Rawat_Inap.Catatan_Medis_Awal,
            );
            ElasticLoggerService().createLog(req, '/rawat-inap/catatan-medis-awal', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.Rawat_Inap = inpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Inap', updateDocument.newDocument.Rawat_Inap);
            ElasticLoggerService().createLog(req, '/rawat-inap/catatan-medis-awal', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-inap/catatan-medis-awal', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-inap/catatan-medis-awal', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-inap/catatan-medis-awal', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  })

Inpatient.route('/rawat-inap/pengkajian-resiko-jatuh-dewasa-item')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Rawat_Inap'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      if (checkObject !== null && checkObject.includes('Pengkajian_Resiko_Jatuh_Dewasa')) {
        emrKeys.push('Rawat_Inap.Pengkajian_Resiko_Jatuh_Dewasa');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const records = result['Rawat_Inap.Pengkajian_Resiko_Jatuh_Dewasa'] && Array.isArray(result['Rawat_Inap.Pengkajian_Resiko_Jatuh_Dewasa']) ? result['Rawat_Inap.Pengkajian_Resiko_Jatuh_Dewasa'] : [];

        for (let i = 0; i < records.length; i += 1) {
          if (records[i].TTD_Perawat && records[i].TTD_Perawat !== '' && isValidFile(records[i].TTD_Perawat)) {
            records[i].TTD_Perawat = await global.storage.signUrl(records[i].TTD_Perawat, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
          }
        }
        const total = records.length;
        const data: any = {
          total,
          totalFiltered: records.length,
          EMR_ID: req.emrID,
          pasien: result.Pasien,
          records,
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
  })

Inpatient.route('/rawat-inap/pengkajian-resiko-jatuh-dewasa-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const localDebug = debugEMR.extend(req.path);
    localDebug(`Request Begin`);
    let responseMessage: string = '';
    try {
      const emrKeys = ["Kode_Cabang", "No_MR", "Pasien", "Tipe_Pasien", 'Rawat_Inap'];
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      if (checkObject !== null && checkObject.includes('Pengkajian_Resiko_Jatuh_Dewasa')) {
        emrKeys.push('Rawat_Inap.Pengkajian_Resiko_Jatuh_Dewasa');
      }
      const id = req.body.id;
      const dataToPost = req.body;
      const emrData = await global.medicalRecord.get(req.emrID, emrKeys);
      localDebug(`Get Data ${req.emrID}`);
      if (emrData && emrData !== null) {
        const officer = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_perawat}')]`)
        const jsonData = PengkajianResikoJatuhDewasa.createFromJson(dataToPost);
        const fixedData = {
          ...jsonData,
          Pengkaji: req.userProfile && req.userProfile.nama ? req.userProfile.nama : '',
          Pengkaji_Id: req.userId ?? '',
          Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
          Updated_By: (req.userId) ? req.userId : '',
          Nama_Perawat: officer && Array.isArray(officer) && officer.length > 0 && officer[0] ? officer[0].Nama : '',
        }

        let data;
        if (!id || id === '') {
          const redisJsonData = {
            ...fixedData,
            ID: uuid().replace(/-/g, "").toUpperCase(),
          }
          await global.medicalRecord.addPengkajianResikoJatuhDewasa(req.emrID, redisJsonData);
          responseMessage = 'Data berhasil ditambah';
          data = redisJsonData;
        } else {
          const listPrjd = emrData['Rawat_Inap.Pengkajian_Resiko_Jatuh_Dewasa'] && Array.isArray(emrData['Rawat_Inap.Pengkajian_Resiko_Jatuh_Dewasa']) ? emrData['Rawat_Inap.Pengkajian_Resiko_Jatuh_Dewasa'] : [];
          const selectedObject = listPrjd.find((item: any) => item.ID === id);
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
            await global.medicalRecord.update(req.emrID, `$.Rawat_Inap.Pengkajian_Resiko_Jatuh_Dewasa[?(@.ID=="${id}")]`, updateDocument.newDocument);
            localDebug(`Update Data ${patch}`);
            responseMessage = "Data berhasil diubah";
            data = updateDocument.newDocument;
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
  })

Inpatient.route('/rawat-inap/pengkajian-resiko-jatuh-dewasa-delete')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const emrKeys: Array<string> = [];
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap')
      if (checkObject && checkObject !== null && checkObject.includes('Pengkajian_Resiko_Jatuh_Dewasa')) {
        emrKeys.push('Rawat_Inap.Pengkajian_Resiko_Jatuh_Dewasa');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);

      if (result && Array.isArray(result) && result.length > 0) {
        const index = result.findIndex((val: any) => val.ID === req.body.id);
        await global.medicalRecord.deletePengkajianResikoJatuhDewasa(req.emrID, index);
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
  })

Inpatient.route('/rawat-inap/implementasi-pasien-resiko-jatuh-item')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Rawat_Inap'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      if (checkObject !== null && checkObject.includes('Implementasi_Pasien_Resiko_Jatuh')) {
        emrKeys.push('Rawat_Inap.Implementasi_Pasien_Resiko_Jatuh');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const records: Array<IImplementasiPasienResikoJatuh> = result['Rawat_Inap.Implementasi_Pasien_Resiko_Jatuh'] && Array.isArray(result['Rawat_Inap.Implementasi_Pasien_Resiko_Jatuh']) ? result['Rawat_Inap.Implementasi_Pasien_Resiko_Jatuh'] : [];

        for (let i = 0; i < records.length; i += 1) {
          if (records[i].TTD_Perawat && records[i].TTD_Perawat !== '' && isValidFile(records[i].TTD_Perawat)) {
            records[i].TTD_Perawat = await global.storage.signUrl(records[i].TTD_Perawat, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
          }
        }
        const total = records.length;
        const data: any = {
          total,
          totalFiltered: records.length,
          EMR_ID: req.emrID,
          pasien: result.Pasien,
          records,
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
  })

Inpatient.route('/rawat-inap/implementasi-pasien-resiko-jatuh-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const localDebug = debugEMR.extend(req.path);
    localDebug(`Request Begin`);
    let responseMessage: string = '';
    try {
      const emrKeys = ["Kode_Cabang", "No_MR", "Pasien", "Tipe_Pasien", 'Rawat_Inap'];
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      if (checkObject !== null && checkObject.includes('Implementasi_Pasien_Resiko_Jatuh')) {
        emrKeys.push('Rawat_Inap.Implementasi_Pasien_Resiko_Jatuh');
      }
      const id = req.body.id;
      const dataToPost = req.body;
      const emrData = await global.medicalRecord.get(req.emrID, emrKeys);
      localDebug(`Get Data ${req.emrID}`);
      if (emrData && emrData !== null) {
        const nurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_perawat}')]`)
        const jsonData = ImplementasiPasienResikoJatuh.createFromJson(dataToPost);
        const fixedData = {
          ...jsonData,
          ID_Petugas: (req.userId) ? req.userId : '',
          Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
          Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
          Updated_By: (req.userId) ? req.userId : '',
          Nama_Perawat: nurse && Array.isArray(nurse) && nurse.length > 0 && nurse[0] ? nurse[0].Nama : '',
        }

        if (!id || id === '') {
          const redisJsonData = {
            ...fixedData,
            ID: uuid().replace(/-/g, "").toUpperCase(),
          }
          await global.medicalRecord.addImplementasiPasienResikoJatuh(req.emrID, redisJsonData);
          responseMessage = 'Data berhasil ditambah';
        } else {
          const listPrjd = emrData['Rawat_Inap.Implementasi_Pasien_Resiko_Jatuh'] && Array.isArray(emrData['Rawat_Inap.Implementasi_Pasien_Resiko_Jatuh']) ? emrData['Rawat_Inap.Implementasi_Pasien_Resiko_Jatuh'] : [];
          const selectedObject = listPrjd.find((item: any) => item.ID === id);
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
            await global.medicalRecord.update(req.emrID, `$.Rawat_Inap.Implementasi_Pasien_Resiko_Jatuh[?(@.ID=="${id}")]`, updateDocument.newDocument);
            localDebug(`Update Data ${patch}`);
            responseMessage = "Data berhasil diubah";
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
  })

Inpatient.route('/rawat-inap/implementasi-pasien-resiko-jatuh-delete')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const emrKeys: Array<string> = [];
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap')
      if (checkObject && checkObject !== null && checkObject.includes('Implementasi_Pasien_Resiko_Jatuh')) {
        emrKeys.push('Rawat_Inap.Implementasi_Pasien_Resiko_Jatuh');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);

      if (result && Array.isArray(result) && result.length > 0) {
        const index = result.findIndex((val: any) => val.ID === req.body.id);
        await global.medicalRecord.deleteImplementasiPasienResikoJatuh(req.emrID, index);
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
  })

Inpatient.route('/rawat-inap/monitoring-skala-nyeri-item')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Rawat_Inap'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      if (checkObject !== null && checkObject.includes('Monitoring_Skala_Nyeri')) {
        emrKeys.push('Rawat_Inap.Monitoring_Skala_Nyeri');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const records: Array<IMonitoringSkalaNyeri> = result['Rawat_Inap.Monitoring_Skala_Nyeri'] && Array.isArray(result['Rawat_Inap.Monitoring_Skala_Nyeri']) ? result['Rawat_Inap.Monitoring_Skala_Nyeri'] : [];

        for (let i = 0; i < records.length; i += 1) {
          if (records[i].TTD_Perawat && records[i].TTD_Perawat !== '' && isValidFile(records[i].TTD_Perawat)) {
            records[i].TTD_Perawat = await global.storage.signUrl(records[i].TTD_Perawat, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
          }
        }

        const total = records.length;
        const data: any = {
          total,
          totalFiltered: records.length,
          EMR_ID: req.emrID,
          pasien: result.Pasien,
          records,
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

Inpatient.route('/rawat-inap/monitoring-skala-nyeri-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const localDebug = debugEMR.extend(req.path);
    localDebug(`Request Begin`);
    let data = {};
    let responseMessage: string = '';
    try {
      const emrKeys = ["Kode_Cabang", "No_MR", "Pasien", "Tipe_Pasien", 'Rawat_Inap'];
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      if (checkObject !== null && checkObject.includes('Monitoring_Skala_Nyeri')) {
        emrKeys.push('Rawat_Inap.Monitoring_Skala_Nyeri');
      }
      const id = req.body.id;
      const dataToPost = req.body;
      const emrData = await global.medicalRecord.get(req.emrID, emrKeys);
      localDebug(`Get Data ${req.emrID}`);
      if (emrData && emrData !== null) {
        const nurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_perawat}')]`)
        const jsonData = MonitoringSkalaNyeri.createFromJson(dataToPost);
        const fixedData = {
          ...jsonData,
          Nama_Perawat: nurse && Array.isArray(nurse) && nurse.length > 0 && nurse[0] ? nurse[0].Nama : '',
          ID_Petugas: (req.userId) ? req.userId : '',
          Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
          Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
          Updated_By: (req.userId) ? req.userId : '',
        }

        if (!id || id === '') {
          const redisJsonData = {
            ...fixedData,
            ID: uuid().replace(/-/g, "").toUpperCase(),
          }
          await global.medicalRecord.addMonitoringSkalaNyeri(req.emrID, redisJsonData);
          data = redisJsonData;
          responseMessage = 'Data berhasil ditambah';
        } else {
          const listPrjd = emrData['Rawat_Inap.Monitoring_Skala_Nyeri'] && Array.isArray(emrData['Rawat_Inap.Monitoring_Skala_Nyeri']) ? emrData['Rawat_Inap.Monitoring_Skala_Nyeri'] : [];
          const selectedObject = listPrjd.find((item: any) => item.ID === id);
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
            await global.medicalRecord.update(req.emrID, `$.Rawat_Inap.Monitoring_Skala_Nyeri[?(@.ID=="${id}")]`, updateDocument.newDocument);
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

Inpatient.route('/rawat-inap/monitoring-skala-nyeri-delete')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const emrKeys: Array<string> = [];
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap')
      if (checkObject && checkObject !== null && checkObject.includes('Monitoring_Skala_Nyeri')) {
        emrKeys.push('Rawat_Inap.Monitoring_Skala_Nyeri');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);

      if (result && Array.isArray(result) && result.length > 0) {
        const index = result.findIndex((val: any) => val.ID === req.body.id);
        await global.medicalRecord.deleteMonitoringSkalaNyeri(req.emrID, index);
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
  })

Inpatient.route('/rawat-inap/asesmen-ulang-tanda-vital-item')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Rawat_Inap'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      if (checkObject !== null && checkObject.includes('Asesmen_Ulang_Tanda_Vital')) {
        emrKeys.push('Rawat_Inap.Asesmen_Ulang_Tanda_Vital');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const records = result['Rawat_Inap.Asesmen_Ulang_Tanda_Vital'] && Array.isArray(result['Rawat_Inap.Asesmen_Ulang_Tanda_Vital']) ? result['Rawat_Inap.Asesmen_Ulang_Tanda_Vital'] : [];

        for (let i = 0; i < records.length; i += 1) {
          if (records[i].TTD_Perawat && records[i].TTD_Perawat !== '' && isValidFile(records[i].TTD_Perawat)) {
            records[i].TTD_Perawat = await global.storage.signUrl(records[i].TTD_Perawat, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
          }
        }
        const total = records.length;
        const data: any = {
          total,
          totalFiltered: records.length,
          EMR_ID: req.emrID,
          pasien: result.Pasien,
          records,
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
  })

Inpatient.route('/rawat-inap/asesmen-ulang-tanda-vital-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const localDebug = debugEMR.extend(req.path);
    localDebug(`Request Begin`);
    let responseMessage: string = '';
    let data = {};
    try {
      const emrKeys = ["Kode_Cabang", "No_MR", "Pasien", "Tipe_Pasien", 'Rawat_Inap'];
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      if (checkObject !== null && checkObject.includes('Asesmen_Ulang_Tanda_Vital')) {
        emrKeys.push('Rawat_Inap.Asesmen_Ulang_Tanda_Vital');
      }
      const id = req.body.id;
      const dataToPost = req.body;
      const emrData = await global.medicalRecord.get(req.emrID, emrKeys);
      localDebug(`Get Data ${req.emrID}`);
      if (emrData && emrData !== null) {
        const officer = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_perawat}')]`)
        const jsonData = AsesmenUlangTandaVital.createFromJson(dataToPost);
        const fixedData = {
          ...jsonData,
          Nama_Perawat: officer && Array.isArray(officer) && officer.length > 0 && officer[0] ? officer[0].Nama : '',
          ID_Petugas: (req.userId) ? req.userId : '',
          Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
          Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
          Updated_By: (req.userId) ? req.userId : '',
        }

        if (!id || id === '') {
          const redisJsonData = {
            ...fixedData,
            ID: uuid().replace(/-/g, "").toUpperCase(),
          }
          await global.medicalRecord.addAsesmenUlangTandaVital(req.emrID, redisJsonData);
          data = redisJsonData;
          responseMessage = 'Data berhasil ditambah';
        } else {
          const listPrjd = emrData['Rawat_Inap.Asesmen_Ulang_Tanda_Vital'] && Array.isArray(emrData['Rawat_Inap.Asesmen_Ulang_Tanda_Vital']) ? emrData['Rawat_Inap.Asesmen_Ulang_Tanda_Vital'] : [];
          const selectedObject = listPrjd.find((item: any) => item.ID === id);
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
            await global.medicalRecord.update(req.emrID, `$.Rawat_Inap.Asesmen_Ulang_Tanda_Vital[?(@.ID=="${id}")]`, updateDocument.newDocument);
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
  })

Inpatient.route('/rawat-inap/asesmen-ulang-tanda-vital-view')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const emrKeys: Array<string> = [];
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap')
      if (checkObject && checkObject !== null && checkObject.includes('Asesmen_Ulang_Tanda_Vital')) {
        emrKeys.push('Rawat_Inap.Asesmen_Ulang_Tanda_Vital');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);

      if (result && Array.isArray(result) && result.length > 0) {
        const data = result.find((val: any) => val.ID === req.body.id);
        if (data) {
          if (!res.writableEnded) {
            res.status(200).json({
              message: 'OK',
              data,
            })
          }
        } else {
          if (!res.writableEnded) {
            res.status(500).json({
              message: 'ID not found',
            })
          }
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
  })

Inpatient.route('/rawat-inap/asesmen-ulang-tanda-vital-delete')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const emrKeys: Array<string> = [];
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap')
      if (checkObject && checkObject !== null && checkObject.includes('Asesmen_Ulang_Tanda_Vital')) {
        emrKeys.push('Rawat_Inap.Asesmen_Ulang_Tanda_Vital');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);

      if (result && Array.isArray(result) && result.length > 0) {
        const index = result.findIndex((val: any) => val.ID === req.body.id);
        await global.medicalRecord.deleteAsesmenUlangTandaVital(req.emrID, index);
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
  })

Inpatient.route('/rawat-inap/infeksi-daerah-operasi-item')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Rawat_Inap'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      if (checkObject !== null && checkObject.includes('Infeksi_Daerah_Operasi')) {
        emrKeys.push('Rawat_Inap.Infeksi_Daerah_Operasi');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const records = result['Rawat_Inap.Infeksi_Daerah_Operasi'] && Array.isArray(result['Rawat_Inap.Infeksi_Daerah_Operasi']) ? result['Rawat_Inap.Infeksi_Daerah_Operasi'] : [];

        for (let i = 0; i < records.length; i += 1) {
          if (records[i].TTD_Pegawai && records[i].TTD_Pegawai !== '' && isValidFile(records[i].TTD_Pegawai)) {
            records[i].TTD_Pegawai = await global.storage.signUrl(records[i].TTD_Pegawai, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
          }
        }
        const total = records.length;
        const data: any = {
          total,
          totalFiltered: records.length,
          EMR_ID: req.emrID,
          pasien: result.Pasien,
          records,
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
  })

Inpatient.route('/rawat-inap/infeksi-daerah-operasi-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const localDebug = debugEMR.extend(req.path);
    localDebug(`Request Begin`);
    let responseMessage: string = '';
    try {
      const emrKeys = ["Kode_Cabang", "No_MR", "Pasien", "Tipe_Pasien", 'Rawat_Inap'];
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      if (checkObject !== null && checkObject.includes('Infeksi_Daerah_Operasi')) {
        emrKeys.push('Rawat_Inap.Infeksi_Daerah_Operasi');
      }
      const id = req.body.id;
      const dataToPost = req.body;
      const emrData = await global.medicalRecord.get(req.emrID, emrKeys);
      localDebug(`Get Data ${req.emrID}`);
      if (emrData && emrData !== null) {
        const officer = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_pegawai}')]`)
        const jsonData = InfeksiDaerahOperasi.createFromJson(dataToPost);
        const fixedData = {
          ...jsonData,
          Nama_Pegawai: officer && Array.isArray(officer) && officer.length > 0 && officer[0] ? officer[0].Nama : '',
          ID_Petugas: (req.userId) ? req.userId : '',
          Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
          Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
          Updated_By: (req.userId) ? req.userId : '',
        }

        if (!id || id === '') {
          const redisJsonData = {
            ...fixedData,
            ID: uuid().replace(/-/g, "").toUpperCase(),
          }
          await global.medicalRecord.addInfeksiDaerahOperasi(req.emrID, redisJsonData);
          responseMessage = 'Data berhasil ditambah';
        } else {
          const listPrjd = emrData['Rawat_Inap.Infeksi_Daerah_Operasi'] && Array.isArray(emrData['Rawat_Inap.Infeksi_Daerah_Operasi']) ? emrData['Rawat_Inap.Infeksi_Daerah_Operasi'] : [];
          const selectedObject = listPrjd.find((item: any) => item.ID === id);
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
            await global.medicalRecord.update(req.emrID, `$.Rawat_Inap.Infeksi_Daerah_Operasi[?(@.ID=="${id}")]`, updateDocument.newDocument);
            localDebug(`Update Data ${patch}`);
            responseMessage = "Data berhasil diubah";
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
  })

Inpatient.route('/rawat-inap/infeksi-daerah-operasi-delete')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const emrKeys: Array<string> = [];
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap')
      if (checkObject && checkObject !== null && checkObject.includes('Infeksi_Daerah_Operasi')) {
        emrKeys.push('Rawat_Inap.Infeksi_Daerah_Operasi');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);

      if (result && Array.isArray(result) && result.length > 0) {
        const index = result.findIndex((val: any) => val.ID === req.body.id);
        await global.medicalRecord.deleteInfeksiDaerahOperasi(req.emrID, index);
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
  })

Inpatient.route('/rawat-inap/inform-consent')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Rawat_Inap']
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      if (checkObject !== null && checkObject.includes('Persetujuan_Tindakan_Dokter')) {
        emrKeys.push('Rawat_Inap.Persetujuan_Tindakan_Dokter');
      }
      if (checkObject !== null && checkObject.includes('Pemberian_Informasi')) {
        emrKeys.push('Rawat_Inap.Pemberian_Informasi');
      }

      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const doctorsConsent: IPersetujuanTindakanDokter = result['Rawat_Inap.Persetujuan_Tindakan_Dokter'] ? result['Rawat_Inap.Persetujuan_Tindakan_Dokter'] : {};
        const informationProvision: IPemberianInformasi = result['Rawat_Inap.Pemberian_Informasi'] ? result['Rawat_Inap.Pemberian_Informasi'] : {};
        const rawatInap = result['Rawat_Inap'] ? result['Rawat_Inap'] : {};

        if (doctorsConsent.Tanda_Tangan_Pasien && doctorsConsent.Tanda_Tangan_Pasien !== '' && isValidFile(doctorsConsent.Tanda_Tangan_Pasien)) {
          doctorsConsent.Tanda_Tangan_Pasien = await global.storage.signUrl(doctorsConsent.Tanda_Tangan_Pasien, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }

        if (doctorsConsent.Tanda_Tangan_Saksi && doctorsConsent.Tanda_Tangan_Saksi !== '' && isValidFile(doctorsConsent.Tanda_Tangan_Saksi)) {
          doctorsConsent.Tanda_Tangan_Saksi = await global.storage.signUrl(doctorsConsent.Tanda_Tangan_Saksi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }

        if (doctorsConsent.Tanda_Tangan_Saksi_2 && doctorsConsent.Tanda_Tangan_Saksi_2 !== '' && isValidFile(doctorsConsent.Tanda_Tangan_Saksi_2)) {
          doctorsConsent.Tanda_Tangan_Saksi_2 = await global.storage.signUrl(doctorsConsent.Tanda_Tangan_Saksi_2, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }

        if (informationProvision.TTD_Dokter_Pelaksana && informationProvision.TTD_Dokter_Pelaksana !== '' && isValidFile(informationProvision.TTD_Dokter_Pelaksana)) {
          informationProvision.TTD_Dokter_Pelaksana = await global.storage.signUrl(informationProvision.TTD_Dokter_Pelaksana, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }

        if (informationProvision.TTD_Pasien && informationProvision.TTD_Pasien !== '' && isValidFile(informationProvision.TTD_Pasien)) {
          informationProvision.TTD_Pasien = await global.storage.signUrl(informationProvision.TTD_Pasien, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }

        const data = {
          EMR_ID: req.emrID ? req.emrID : '',
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          doctors_consent: doctorsConsent,
          information_provision: informationProvision,
          rawat_inap: rawatInap,
        }

        if (!res.writableEnded) {
          res.status(200).json({
            message: 'OK',
            data,
          })
        }
      }
      if (!result || (result && result === null)) {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'Patient Data Not Found',
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

Inpatient.route('/rawat-inap/inform-consent-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: any = req.body;

          const doctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost.dokter_pelaksana_informasi}')]`)
          const informationDoctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost['dokter-pelaksana']}')]`)
          const informProvider = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost['pemberi-informasi']}')]`)

          const fixedInformationProvision = PemberianInformasi.createFromJson(dataToPost);
          const informationProvisionData: IPemberianInformasi = {
            ...fixedInformationProvision,
            Nama_Dokter_Pelaksana: doctor && Array.isArray(doctor) && doctor.length > 0 && doctor[0] ? doctor[0].Nama : '',
            Nama_Dokter_Pelaksana_Informasi: informationDoctor && Array.isArray(informationDoctor) && informationDoctor.length > 0 && informationDoctor[0] ? informationDoctor[0].Nama : '',
            Nama_Pemberi_Informasi: informProvider && Array.isArray(informProvider) && informProvider.length > 0 && informProvider[0] ? informProvider[0].Nama : '',
            ID_Petugas: req.userId ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const witness = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost['id-saksi']}')]`)
          const doctorAction = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost.dokter_pelaksana}')]`)

          const fixedDoctorsConsent = PersetujuanTindakanDokter.createFromJson(dataToPost);
          const doctorsConsentData: any = {
            ...fixedDoctorsConsent,
            Nama_Saksi: witness && Array.isArray(witness) && witness.length > 0 && witness[0] ? witness[0].Nama : '',
            Nama_Dokter_Pelaksana: doctorAction && Array.isArray(doctorAction) && doctorAction.length > 0 && doctorAction[0] ? doctorAction[0].Nama : '',
            Nama_Saksi_Keluarga: dataToPost['nama-saksi-keluarga'] ?? '',
            ID_Petugas: req.userId ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          if (dataToPost['tandaTangan-radio'] && dataToPost['tandaTangan-radio'] !== '1') {
            doctorsConsentData.Tanda_Tangan_Nama = dataToPost['tandaTangan-nama'] ?? '';
            doctorsConsentData.Tanda_Tangan_TglLahir = dataToPost['tandaTangan-tglLahir'] ?? '';
            doctorsConsentData.Tanda_Tangan_JK = dataToPost['tandaTangan-jk'] ?? '';
            doctorsConsentData.Tanda_Tangan_Telp = dataToPost['tandaTangan-telp'] ?? '';
            doctorsConsentData.Tanda_Tangan_Alamat = dataToPost['tandaTangan-alamat'] ?? '';
            doctorsConsentData.Tanda_Tangan_Hubungan = dataToPost['tandaTangan-hubungan'] ?? '';
          }

          const outpatient: IRawatInap = {
            Pemberian_Informasi: informationProvisionData,
            Persetujuan_Tindakan_Dokter: doctorsConsentData,
          };

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Inap && newEmrData.Rawat_Inap !== null) {
            newEmrData.Rawat_Inap.Pemberian_Informasi = informationProvisionData;
            newEmrData.Rawat_Inap.Persetujuan_Tindakan_Dokter = doctorsConsentData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Inap.Pemberian_Informasi',
              updateDocument.newDocument.Rawat_Inap.Pemberian_Informasi,
            );
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Inap.Persetujuan_Tindakan_Dokter',
              updateDocument.newDocument.Rawat_Inap.Persetujuan_Tindakan_Dokter,
            )
            ElasticLoggerService().createLog(req, '/rawat-inap/formulir-persetujuan-tindakan-kedokteran', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                data: {
                  information_provision: updateDocument.newDocument.Rawat_Inap.Pemberian_Informasi ?? {},
                  doctors_consent: updateDocument.newDocument.Rawat_Inap.Persetujuan_Tindakan_Dokter ?? {},
                },
              })
            }
          } else {
            newEmrData.Rawat_Inap = outpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Inap', updateDocument.newDocument.Rawat_Inap);
            ElasticLoggerService().createLog(req, '/rawat-inap/formulir-persetujuan-tindakan-kedokteran', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                data: {
                  information_provision: updateDocument.newDocument.Rawat_Inap.Pemberian_Informasi ?? {},
                  doctors_consent: updateDocument.newDocument.Rawat_Inap.Persetujuan_Tindakan_Dokter ?? {},
                },
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-inap/formulir-persetujuan-tindakan-kedokteran', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-inap/formulir-persetujuan-tindakan-kedokteran', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-inap/formulir-persetujuan-tindakan-kedokteran', `${err}`);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  })

Inpatient.route('/rawat-inap/dpjp-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Rawat_Inap'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      const checkUgd = await global.medicalRecord.keys(req.emrID, '.UGD');
      const checkRajal = await global.medicalRecord.keys(req.emrID, '.Rawat_Jalan');
      if (checkObject !== null && checkObject.includes('Dpjp')) {
        emrKeys.push('Rawat_Inap.Dpjp');
      }
      if (checkUgd !== null && checkUgd.includes('Assesmen')) {
        emrKeys.push('UGD.Assesmen');
      }
      if (checkRajal !== null && checkRajal.includes('Pemberian_Informasi')) {
        emrKeys.push('Rawat_Jalan.Pemberian_Informasi');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form: IDpjp = result['Rawat_Inap.Dpjp'] ? result['Rawat_Inap.Dpjp'] : {}
        const informConsent = result['Rawat_Jalan.Pemberian_Informasi'] ?? {};
        const assessment = result['UGD.Assesmen'] ?? {};
        const lastCppt = await getLastCpptDoctorData(req.emrParams.Kode_Cabang, req.emrParams.No_MR);
        const billingTypeId = result.Rawat_Inap && result.Rawat_Inap.ID_Tipe_Tagihan ? result.Rawat_Inap.ID_Tipe_Tagihan : '';
        const billingTypeName = result.Rawat_Inap && result.Rawat_Inap.Nama_Tipe_Tagihan ? result.Rawat_Inap.Nama_Tipe_Tagihan : '';

        if (form.TTD_Dokter_Dpjp_1 && form.TTD_Dokter_Dpjp_1 !== '' && isValidFile(form.TTD_Dokter_Dpjp_1)) {
          form.TTD_Dokter_Dpjp_1 = await global.storage.signUrl(form.TTD_Dokter_Dpjp_1, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (form.TTD_Dokter_Dpjp_2 && form.TTD_Dokter_Dpjp_2 !== '' && isValidFile(form.TTD_Dokter_Dpjp_2)) {
          form.TTD_Dokter_Dpjp_2 = await global.storage.signUrl(form.TTD_Dokter_Dpjp_2, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (form.TTD_Dokter_Dpjp_3 && form.TTD_Dokter_Dpjp_3 !== '' && isValidFile(form.TTD_Dokter_Dpjp_3)) {
          form.TTD_Dokter_Dpjp_3 = await global.storage.signUrl(form.TTD_Dokter_Dpjp_3, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (form.TTD_Dokter_Dpjp_4 && form.TTD_Dokter_Dpjp_4 !== '' && isValidFile(form.TTD_Dokter_Dpjp_4)) {
          form.TTD_Dokter_Dpjp_4 = await global.storage.signUrl(form.TTD_Dokter_Dpjp_4, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (form.TTD_Dokter_Peralihan && form.TTD_Dokter_Peralihan !== '' && isValidFile(form.TTD_Dokter_Peralihan)) {
          form.TTD_Dokter_Peralihan = await global.storage.signUrl(form.TTD_Dokter_Peralihan, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (form.TTD_Dokter_Ppds && form.TTD_Dokter_Ppds !== '' && isValidFile(form.TTD_Dokter_Ppds)) {
          form.TTD_Dokter_Ppds = await global.storage.signUrl(form.TTD_Dokter_Ppds, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (form.TTD_Dokter_Ruangan && form.TTD_Dokter_Ruangan !== '' && isValidFile(form.TTD_Dokter_Ruangan)) {
          form.TTD_Dokter_Ruangan = await global.storage.signUrl(form.TTD_Dokter_Ruangan, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (form.TTD_Dokter_Utama && form.TTD_Dokter_Utama !== '' && isValidFile(form.TTD_Dokter_Utama)) {
          form.TTD_Dokter_Utama = await global.storage.signUrl(form.TTD_Dokter_Utama, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }

        const data: any = {
          EMR_ID: req.emrID,
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          form,
          diagnosa_medis: assessment.Dokter_Mata_Diagnosa,
          cppt: lastCppt ?? {},
          inform_consent: informConsent ?? {},
          tipe_tagihan: {
            id: billingTypeId ?? '',
            name: billingTypeName ?? '',
          },
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
  })

Inpatient.route('/rawat-inap/dpjp-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdateDpjp = req.body;
          const mainDoctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost.dokter_utama}')]`)
          const ppdsDoctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost.ppds}')]`)
          const roomDoctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost.dokter_ruangan}')]`)
          const dpjp1 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost.dokter_dpjp_1}')]`)
          const dpjp2 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost.dokter_dpjp_2}')]`)
          const dpjp3 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost.dokter_dpjp_3}')]`)
          const dpjp4 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost.dokter_dpjp_4}')]`)
          const dpjpTransition = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost.dokter_peralihan}')]`)
          const fixedData = Dpjp.createFromJson(dataToPost);
          const redisJsonData: IDpjp = {
            ...fixedData,
            Dokter_Dpjp_Utama_Nama: mainDoctor && Array.isArray(mainDoctor) && mainDoctor.length > 0 && mainDoctor[0] ? mainDoctor[0].Nama : '',
            Dokter_Ppds_Nama: ppdsDoctor && Array.isArray(ppdsDoctor) && ppdsDoctor.length > 0 && ppdsDoctor[0] ? ppdsDoctor[0].Nama : '',
            Dokter_Ruangan_Nama: roomDoctor && Array.isArray(roomDoctor) && roomDoctor.length > 0 && roomDoctor[0] ? roomDoctor[0].Nama : '',
            Dokter_Dpjp_1_Nama: dpjp1 && Array.isArray(dpjp1) && dpjp1.length > 0 && dpjp1[0] ? dpjp1[0].Nama : '',
            Dokter_Dpjp_2_Nama: dpjp2 && Array.isArray(dpjp2) && dpjp2.length > 0 && dpjp2[0] ? dpjp2[0].Nama : '',
            Dokter_Dpjp_3_Nama: dpjp3 && Array.isArray(dpjp3) && dpjp3.length > 0 && dpjp3[0] ? dpjp3[0].Nama : '',
            Dokter_Dpjp_4_Nama: dpjp4 && Array.isArray(dpjp4) && dpjp4.length > 0 && dpjp4[0] ? dpjp4[0].Nama : '',
            Dokter_Dpjp_Peralihan_Nama: dpjpTransition && Array.isArray(dpjpTransition) && dpjpTransition.length > 0 && dpjpTransition[0] ? dpjpTransition[0].Nama : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const inpatient: IRawatInap = {
            Dpjp: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Inap && newEmrData.Rawat_Inap !== null) {
            newEmrData.Rawat_Inap.Dpjp = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Inap.Dpjp',
              updateDocument.newDocument.Rawat_Inap.Dpjp,
            );
            ElasticLoggerService().createLog(req, '/rawat-inap/dpjp', 'OK');
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
                  form: updateDocument.newDocument.Rawat_Inap.Dpjp ?? {},
                },
              })
            }
          } else {
            newEmrData.Rawat_Inap = inpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Inap', updateDocument.newDocument.Rawat_Inap);
            ElasticLoggerService().createLog(req, '/rawat-inap/dpjp', 'OK');
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
                  form: updateDocument.newDocument.Rawat_Inap.Dpjp ?? {},
                },
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-inap/dpjp', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-inap/dpjp', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-inap/dpjp', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  })

Inpatient.route('/rawat-inap/resume-pasien-pulang-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Rawat_Inap'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      const checkRo = await global.medicalRecord.keys(req.emrID, '.RO');
      const checkOK = await global.medicalRecord.keys(req.emrID, '.OK');
      const checkRajal = await global.medicalRecord.keys(req.emrID, '.Rawat_Jalan');
      if (checkObject !== null && checkObject.includes('Resume_Pasien_Pulang')) {
        emrKeys.push('Rawat_Inap.Resume_Pasien_Pulang');
      }
      if (checkRo !== null && checkRo.includes('Pengkajian_Awal')) {
        emrKeys.push('RO.Pengkajian_Awal');
      }
      if (checkOK !== null && checkOK.includes('Laporan_Pembedahan_Anestesi')) {
        emrKeys.push('OK.Laporan_Pembedahan_Anestesi');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      const meds = await global.medicalRecord.get(`Obat:{${result.Kode_Cabang}}:${result.Tipe_Pasien}`);
      const htu = await global.medicalRecord.get(`AturanPakai:{${result.Kode_Cabang}}`);
      const cppt_perawat = await getInpatientCpptNurse(req.emrID);
      const cppt_dokter = await getInpatientCpptDoctor(req.emrID);
      if (result && result !== null) {
        const form: IResumePasienPulang = result['Rawat_Inap.Resume_Pasien_Pulang'] ? result['Rawat_Inap.Resume_Pasien_Pulang'] : {}
        const informConsent = result['Rawat_Jalan.Pemberian_Informasi'] ?? {};
        const ro = result['RO.Pengkajian_Awal'] ?? {};
        const ok = result['OK.Laporan_Pembedahan_Anestesi'] ?? {};

        if (form.Tanda_Tangan_Pasien && form.Tanda_Tangan_Pasien !== '' && isValidFile(form.Tanda_Tangan_Pasien)) {
          form.Tanda_Tangan_Pasien = await global.storage.signUrl(form.Tanda_Tangan_Pasien, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.Tanda_Tangan_Petugas && form.Tanda_Tangan_Petugas !== '' && isValidFile(form.Tanda_Tangan_Petugas)) {
          form.Tanda_Tangan_Petugas = await global.storage.signUrl(form.Tanda_Tangan_Petugas, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }

        const data: any = {
          EMR_ID: req.emrID,
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          form,
          obat: meds ?? [],
          aturan_pakai: htu ?? [],
          inform_consent: informConsent ?? {},
          cppt_perawat,
          cppt_dokter,
          ro,
          ok,
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
  })

Inpatient.route('/rawat-inap/resume-pasien-pulang-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdateResumePasienPulang = req.body;
          const officer = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_ttd_petugas}')]`)
          const fixedData = ResumePasienPulang.createFromJson(dataToPost);
          const redisJsonData: IResumePasienPulang = {
            ...fixedData,
            Nama_TTD_Petugas: officer && Array.isArray(officer) && officer.length > 0 && officer[0] ? officer[0].Nama : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const inpatient: IRawatInap = {
            Resume_Pasien_Pulang: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Inap && newEmrData.Rawat_Inap !== null) {
            newEmrData.Rawat_Inap.Resume_Pasien_Pulang = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Inap.Resume_Pasien_Pulang',
              updateDocument.newDocument.Rawat_Inap.Resume_Pasien_Pulang,
            );
            ElasticLoggerService().createLog(req, '/rawat-inap/resume-pasien-pulang', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.Rawat_Inap = inpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Inap', updateDocument.newDocument.Rawat_Inap);
            ElasticLoggerService().createLog(req, '/rawat-inap/resume-pasien-pulang', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-inap/resume-pasien-pulang', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-inap/resume-pasien-pulang', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-inap/resume-pasien-pulang', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  })

Inpatient.route('/rawat-inap/formulir-pra-anestesi-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Rawat_Inap'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      if (checkObject !== null && checkObject.includes('Formulir_Pra_Anestesi')) {
        emrKeys.push('Rawat_Inap.Formulir_Pra_Anestesi');
      }
      const checkUgd = await global.medicalRecord.keys(req.emrID, '.UGD');
      if (checkUgd !== null && checkUgd.includes('Assesmen')) {
        emrKeys.push('UGD.Assesmen');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form: IFormulirPraAnestesi = result['Rawat_Inap.Formulir_Pra_Anestesi'] ? result['Rawat_Inap.Formulir_Pra_Anestesi'] : {}
        const assessmentUgd = result['UGD.Assesmen'] ?? {};
        const ews = await getFirstEws(req.emrID);

        if (form.Tanda_Tangan_Dokter && form.Tanda_Tangan_Dokter !== '' && isValidFile(form.Tanda_Tangan_Dokter)) {
          form.Tanda_Tangan_Dokter = await global.storage.signUrl(form.Tanda_Tangan_Dokter, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }

        if (form.Tanda_Tangan_Pasien && form.Tanda_Tangan_Pasien !== '' && isValidFile(form.Tanda_Tangan_Pasien)) {
          form.Tanda_Tangan_Pasien = await global.storage.signUrl(form.Tanda_Tangan_Pasien, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }

        const data: any = {
          EMR_ID: req.emrID,
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          form,
          asesmen: assessmentUgd,
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
  })

Inpatient.route('/rawat-inap/formulir-pra-anestesi-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdateFormulirPraAnestesi = req.body;
          const officer = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_ttd_dokter}')]`)
          const fixedData = FormulirPraAnestesi.createFromJson(dataToPost);
          const redisJsonData: IFormulirPraAnestesi = {
            ...fixedData,
            Waktu: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Nama_TTD_Dokter: officer && Array.isArray(officer) && officer.length > 0 && officer[0] ? officer[0].Nama : '',
            Updated_By: (req.userId) ? req.userId : '',
          }

          const inpatient: IRawatInap = {
            Formulir_Pra_Anestesi: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Inap && newEmrData.Rawat_Inap !== null) {
            newEmrData.Rawat_Inap.Formulir_Pra_Anestesi = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Inap.Formulir_Pra_Anestesi',
              updateDocument.newDocument.Rawat_Inap.Formulir_Pra_Anestesi,
            );
            ElasticLoggerService().createLog(req, '/rawat-inap/formulir-pra-anestesi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.Rawat_Inap = inpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Inap', updateDocument.newDocument.Rawat_Inap);
            ElasticLoggerService().createLog(req, '/rawat-inap/formulir-pra-anestesi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-inap/formulir-pra-anestesi', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-inap/formulir-pra-anestesi', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-inap/formulir-pra-anestesi', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  })

Inpatient.route('/rawat-inap/persetujuan-tindakan-anestesi-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Rawat_Inap'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      if (checkObject !== null && checkObject.includes('Persetujuan_Tindakan_Anestesi')) {
        emrKeys.push('Rawat_Inap.Persetujuan_Tindakan_Anestesi');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form: IPersetujuanTindakanAnestesi = result['Rawat_Inap.Persetujuan_Tindakan_Anestesi'] ? result['Rawat_Inap.Persetujuan_Tindakan_Anestesi'] : {}

        if (form.TTD_Dokter_Pelaksana && form.TTD_Dokter_Pelaksana !== '' && isValidFile(form.TTD_Dokter_Pelaksana)) {
          form.TTD_Dokter_Pelaksana = await global.storage.signUrl(form.TTD_Dokter_Pelaksana, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Penerima_Informasi && form.TTD_Penerima_Informasi !== '' && isValidFile(form.TTD_Penerima_Informasi)) {
          form.TTD_Penerima_Informasi = await global.storage.signUrl(form.TTD_Penerima_Informasi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.Tanda_Tangan_Saksi_2 && form.Tanda_Tangan_Saksi_2 !== '' && isValidFile(form.Tanda_Tangan_Saksi_2)) {
          form.Tanda_Tangan_Saksi_2 = await global.storage.signUrl(form.Tanda_Tangan_Saksi_2, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.Tanda_Tangan_Pasien && form.Tanda_Tangan_Pasien !== '' && isValidFile(form.Tanda_Tangan_Pasien)) {
          form.Tanda_Tangan_Pasien = await global.storage.signUrl(form.Tanda_Tangan_Pasien, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.Tanda_Tangan_Saksi && form.Tanda_Tangan_Saksi !== '' && isValidFile(form.Tanda_Tangan_Saksi)) {
          form.Tanda_Tangan_Saksi = await global.storage.signUrl(form.Tanda_Tangan_Saksi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }

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
  })

Inpatient.route('/rawat-inap/persetujuan-tindakan-anestesi-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdatePersetujuanTindakanAnestesi = req.body;
          const witness = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_saksi}')]`)
          const doctor1 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_dokter_pelaksana}')]`)
          const doctor2 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_pemberi_informasi}')]`)
          const doctor3 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_dokter_pelaksana_ttd}')]`)
          const fixedData = PersetujuanTindakanAnestesi.createFromJson(dataToPost);
          const redisJsonData: IPersetujuanTindakanAnestesi = {
            ...fixedData,
            Waktu: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Nama_Saksi: witness && Array.isArray(witness) && witness.length > 0 && witness[0] ? witness[0].Nama : '',
            Nama_Dokter_Pelaksana: doctor1 && Array.isArray(doctor1) && doctor1.length > 0 && doctor1[0] ? doctor1[0].Nama : '',
            Nama_Pemberi_Informasi: doctor2 && Array.isArray(doctor2) && doctor2.length > 0 && doctor2[0] ? doctor2[0].Nama : '',
            Nama_Dokter_Pelaksana_TTD: doctor3 && Array.isArray(doctor3) && doctor3.length > 0 && doctor3[0] ? doctor3[0].Nama : '',
            Updated_By_Name: req.userProfile.nama ?? '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const inpatient: IRawatInap = {
            Persetujuan_Tindakan_Anestesi: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Inap && newEmrData.Rawat_Inap !== null) {
            newEmrData.Rawat_Inap.Persetujuan_Tindakan_Anestesi = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Inap.Persetujuan_Tindakan_Anestesi',
              updateDocument.newDocument.Rawat_Inap.Persetujuan_Tindakan_Anestesi,
            );
            ElasticLoggerService().createLog(req, '/rawat-inap/persetujuan-tindakan-anestesi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.Rawat_Inap = inpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Inap', updateDocument.newDocument.Rawat_Inap);
            ElasticLoggerService().createLog(req, '/rawat-inap/persetujuan-tindakan-anestesi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-inap/persetujuan-tindakan-anestesi', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-inap/persetujuan-tindakan-anestesi', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-inap/persetujuan-tindakan-anestesi', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

Inpatient.route('/rawat-inap/rencana-asuhan-keperawatan-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Rawat_Inap'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      const checkRajal = await global.medicalRecord.keys(req.emrID, '.Rawat_Jalan');
      if (checkObject !== null && checkObject.includes('Rencana_Asuhan_Keperawatan')) {
        emrKeys.push('Rawat_Inap.Rencana_Asuhan_Keperawatan');
      }
      if (checkRajal !== null && checkRajal.includes('Pemberian_Informasi')) {
        emrKeys.push('Rawat_Jalan.Pemberian_Informasi');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      const rooms = await global.medicalRecord.get(`Rooms:{${result.Kode_Cabang}}`)
      if (result && result !== null) {
        const form = result['Rawat_Inap.Rencana_Asuhan_Keperawatan'] ? result['Rawat_Inap.Rencana_Asuhan_Keperawatan'] : {}
        const informConsent = result['Rawat_Jalan.Pemberian_Informasi'] ?? {};
        const data: any = {
          EMR_ID: req.emrID,
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          form,
          inform_consent: informConsent ?? {},
          kamar: rooms ?? [],
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

Inpatient.route('/rawat-inap/rencana-asuhan-keperawatan-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdateRencanaAsuhanKeperawatan = req.body;
          const nurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.perawat_id}')]`)
          const fixedData = RencanaAsuhanKeperawatan.createFromJson(dataToPost);
          const redisJsonData: IRencanaAsuhanKeperawatan = {
            ...fixedData,
            Nama_Perawat: nurse && Array.isArray(nurse) && nurse.length > 0 && nurse[0] ? nurse[0].Nama : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const inpatient: IRawatInap = {
            Rencana_Asuhan_Keperawatan: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Inap && newEmrData.Rawat_Inap !== null) {
            newEmrData.Rawat_Inap.Rencana_Asuhan_Keperawatan = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Inap.Rencana_Asuhan_Keperawatan',
              updateDocument.newDocument.Rawat_Inap.Rencana_Asuhan_Keperawatan,
            );
            ElasticLoggerService().createLog(req, '/rawat-inap/rencana-asuhan-keperawatan', 'OK');
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
                  form: updateDocument.newDocument.Rawat_Inap.Rencana_Asuhan_Keperawatan ?? {},
                },
              })
            }
          } else {
            newEmrData.Rawat_Inap = inpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Inap', updateDocument.newDocument.Rawat_Inap);
            ElasticLoggerService().createLog(req, '/rawat-inap/rencana-asuhan-keperawatan', 'OK');
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
                  form: updateDocument.newDocument.Rawat_Inap.Rencana_Asuhan_Keperawatan ?? {},
                },
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-inap/rencana-asuhan-keperawatan', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-inap/rencana-asuhan-keperawatan', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-inap/rencana-asuhan-keperawatan', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

Inpatient.route('/rawat-inap/surat-perintah-rawat-inap-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Rawat_Inap'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      const checkUgd = await global.medicalRecord.keys(req.emrID, '.UGD');
      const checkRajal = await global.medicalRecord.keys(req.emrID, '.Rawat_Jalan');
      if (checkObject !== null && checkObject.includes('Surat_Perintah_Rawat_Inap')) {
        emrKeys.push('Rawat_Inap.Surat_Perintah_Rawat_Inap');
      }
      if (checkObject !== null && checkObject.includes('Rencana_Pemulangan_Pasien')) {
        emrKeys.push('Rawat_Inap.Rencana_Pemulangan_Pasien');
      }
      if (checkUgd !== null && checkUgd.includes('Assesmen')) {
        emrKeys.push('UGD.Assesmen');
      }
      if (checkRajal !== null && checkRajal.includes('Pemberian_Informasi')) {
        emrKeys.push('Rawat_Jalan.Pemberian_Informasi');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form = result['Rawat_Inap.Surat_Perintah_Rawat_Inap'] ? result['Rawat_Inap.Surat_Perintah_Rawat_Inap'] : {};
        const informConsent = result['Rawat_Jalan.Pemberian_Informasi'] ?? {};
        const assesmen = result['UGD.Assesmen'] ?? {};
        const plan = result['Rawat_Inap.Rencana_Pemulangan_Pasien'] ? result['Rawat_Inap.Rencana_Pemulangan_Pasien'] : {};

        if (form.TTD_Dokter && form.TTD_Dokter !== '' && isValidFile(form.TTD_Dokter)) {
          form.TTD_Dokter = await global.storage.signUrl(form.TTD_Dokter, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (plan.Pasien_Tanggal && plan.Estimasi_Pemulangan_Pasien && !form.Lama_Opname) {
          const startDate: Date = new Date(plan.Pasien_Tanggal);
          const endDate: Date = new Date(plan.Estimasi_Pemulangan_Pasien);
          const diffTime = endDate.getTime() - startDate.getTime();
          const diffDays = diffTime / (1000 * 3600 * 24);
          form.Lama_Opname = diffDays;
        }
        const data: any = {
          EMR_ID: req.emrID,
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          form,
          inform_consent: informConsent ?? {},
          assesmen,
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

Inpatient.route('/rawat-inap/surat-perintah-rawat-inap-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdateSuratPerintahRawatInap = req.body;
          const doctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_dokter_rawat_inap}')]`)
          const fixedData = SuratPerintahRawatInap.createFromJson(dataToPost);
          const redisJsonData: ISuratPerintahRawatInap = {
            ...fixedData,
            Nama_Dokter_Rawat_Inap: doctor && Array.isArray(doctor) && doctor.length > 0 && doctor[0] ? doctor[0].Nama : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const inpatient: IRawatInap = {
            Surat_Perintah_Rawat_Inap: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Inap && newEmrData.Rawat_Inap !== null) {
            newEmrData.Rawat_Inap.Surat_Perintah_Rawat_Inap = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Inap.Surat_Perintah_Rawat_Inap',
              updateDocument.newDocument.Rawat_Inap.Surat_Perintah_Rawat_Inap,
            );
            ElasticLoggerService().createLog(req, '/rawat-inap/surat-perintah-rawat-inap', 'OK');
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
                  form: updateDocument.newDocument.Rawat_Inap.Surat_Perintah_Rawat_Inap ?? {},
                },
              })
            }
          } else {
            newEmrData.Rawat_Inap = inpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Inap', updateDocument.newDocument.Rawat_Inap);
            ElasticLoggerService().createLog(req, '/rawat-inap/surat-perintah-rawat-inap', 'OK');
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
                  form: updateDocument.newDocument.Rawat_Inap.Surat_Perintah_Rawat_Inap ?? {},
                },
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-inap/surat-perintah-rawat-inap', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-inap/surat-perintah-rawat-inap', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-inap/surat-perintah-rawat-inap', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

Inpatient.route('/rawat-inap/pengkajian-awal-gizi-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Rawat_Inap'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      if (checkObject !== null && checkObject.includes('Pengkajian_Awal_Gizi')) {
        emrKeys.push('Rawat_Inap.Pengkajian_Awal_Gizi');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form = result['Rawat_Inap.Pengkajian_Awal_Gizi'] ? result['Rawat_Inap.Pengkajian_Awal_Gizi'] : {};

        if (form.TTD_Petugas_Gizi && form.TTD_Petugas_Gizi !== '' && isValidFile(form.TTD_Petugas_Gizi)) {
          form.TTD_Petugas_Gizi = await global.storage.signUrl(form.TTD_Petugas_Gizi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
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

Inpatient.route('/rawat-inap/pengkajian-awal-gizi-process')
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

          const inpatient: IRawatInap = {
            Pengkajian_Awal_Gizi: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Inap && newEmrData.Rawat_Inap !== null) {
            newEmrData.Rawat_Inap.Pengkajian_Awal_Gizi = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Inap.Pengkajian_Awal_Gizi',
              updateDocument.newDocument.Rawat_Inap.Pengkajian_Awal_Gizi,
            );
            ElasticLoggerService().createLog(req, '/rawat-inap/pengkajian-awal-gizi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                data: updateDocument.newDocument.Rawat_Inap.Pengkajian_Awal_Gizi,
              })
            }
          } else {
            newEmrData.Rawat_Inap = inpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Inap', updateDocument.newDocument.Rawat_Inap);
            ElasticLoggerService().createLog(req, '/rawat-inap/pengkajian-awal-gizi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                data: updateDocument.newDocument.Rawat_Inap.Pengkajian_Awal_Gizi,
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-inap/pengkajian-awal-gizi', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-inap/pengkajian-awal-gizi', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-inap/pengkajian-awal-gizi', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  })

Inpatient.route('/rawat-inap/pemberian-informasi-resiko-pasien-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Rawat_Inap'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      if (checkObject !== null && checkObject.includes('Pemberian_Informasi_Resiko_Pasien_Jatuh')) {
        emrKeys.push('Rawat_Inap.Pemberian_Informasi_Resiko_Pasien_Jatuh');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form: IPemberianInformasiResikoPasienJatuh = result['Rawat_Inap.Pemberian_Informasi_Resiko_Pasien_Jatuh'] ? result['Rawat_Inap.Pemberian_Informasi_Resiko_Pasien_Jatuh'] : {};

        if (form.TTD_Pemberi_Informasi && form.TTD_Pemberi_Informasi !== '' && isValidFile(form.TTD_Pemberi_Informasi)) {
          form.TTD_Pemberi_Informasi = await global.storage.signUrl(form.TTD_Pemberi_Informasi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Penerima_Informasi && form.TTD_Penerima_Informasi !== '' && isValidFile(form.TTD_Penerima_Informasi)) {
          form.TTD_Penerima_Informasi = await global.storage.signUrl(form.TTD_Penerima_Informasi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
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

Inpatient.route('/rawat-inap/pemberian-informasi-resiko-pasien-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdatePemberianInformasiResikoPasienJatuh = req.body;
          const officer1 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_pemberi_informasi}')]`)
          const officer3 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_ttd_pemberi_informasi}')]`)
          const officer4 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_ttd_penerima_informasi}')]`)
          const fixedData = PemberianInformasiResikoPasienJatuh.createFromJson(dataToPost);
          const redisJsonData: IPemberianInformasiResikoPasienJatuh = {
            ...fixedData,
            Nama_Pemberi_Informasi: officer1 && Array.isArray(officer1) && officer1.length > 0 && officer1[0] ? officer1[0].Nama : '',
            Nama_TTD_Pemberi_Informasi: officer3 && Array.isArray(officer3) && officer3.length > 0 && officer3[0] ? officer3[0].Nama : '',
            Nama_TTD_Penerima_Informasi: officer4 && Array.isArray(officer4) && officer4.length > 0 && officer4[0] ? officer4[0].Nama : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const inpatient: IRawatInap = {
            Pemberian_Informasi_Resiko_Pasien_Jatuh: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Inap && newEmrData.Rawat_Inap !== null) {
            newEmrData.Rawat_Inap.Pemberian_Informasi_Resiko_Pasien_Jatuh = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Inap.Pemberian_Informasi_Resiko_Pasien_Jatuh',
              updateDocument.newDocument.Rawat_Inap.Pemberian_Informasi_Resiko_Pasien_Jatuh,
            );
            ElasticLoggerService().createLog(req, '/rawat-inap/pemberian-informasi-pasien-jatuh', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.Rawat_Inap = inpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Inap', updateDocument.newDocument.Rawat_Inap);
            ElasticLoggerService().createLog(req, '/rawat-inap/pemberian-informasi-pasien-jatuh', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-inap/pemberian-informasi-pasien-jatuh', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-inap/pemberian-informasi-pasien-jatuh', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-inap/pemberian-informasi-pasien-jatuh', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

Inpatient.route('/rawat-inap/get-visit')
  .get(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Rawat_Inap'];
    try {
      const checkObject = await global.medicalRecord.keys(req.query.emr_id, '.Rawat_Inap');
      if (checkObject !== null && checkObject.includes('Daftar_Visit_Dokter')) {
        emrKeys.push('Rawat_Inap.Daftar_Visit_Dokter');
      }
      const result = await global.medicalRecord.get(req.query.emr_id, emrKeys);
      if (result && result !== null) {
        const records: Array<IDaftarVisitDokter> = result['Rawat_Inap.Daftar_Visit_Dokter'] && Array.isArray(result['Rawat_Inap.Daftar_Visit_Dokter']) ? result['Rawat_Inap.Daftar_Visit_Dokter'] : [];

        const total = records.length;
        const data: any = {
          total,
          EMR_ID: req.query.emr_id,
          pasien: result.Pasien,
          records,
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
  })

Inpatient.route('/rawat-inap/surveilans-infeksi-hais-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Rawat_Inap'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      if (checkObject !== null && checkObject.includes('Surveilans_Infeksi_Hais')) {
        emrKeys.push('Rawat_Inap.Surveilans_Infeksi_Hais');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form: ISurveilansInfeksiHaisRanap = result['Rawat_Inap.Surveilans_Infeksi_Hais'] ? result['Rawat_Inap.Surveilans_Infeksi_Hais'] : {};

        if (form.TTD_Perawat && form.TTD_Perawat !== '' && isValidFile(form.TTD_Perawat)) {
          form.TTD_Perawat = await global.storage.signUrl(form.TTD_Perawat, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Perawat_IPCN && form.TTD_Perawat_IPCN !== '' && isValidFile(form.TTD_Perawat_IPCN)) {
          form.TTD_Perawat_IPCN = await global.storage.signUrl(form.TTD_Perawat_IPCN, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
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

Inpatient.route('/rawat-inap/surveilans-infeksi-hais-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdateSurveilansInfeksiHais = req.body;
          const nurse1 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_perawat}')]`)
          const nurse2 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_perawat_ipcn}')]`)
          const fixedData = SurveilansInfeksiHais.createFromJson(dataToPost);
          const redisJsonData: ISurveilansInfeksiHaisRanap = {
            ...fixedData,
            Nama_Perawat: nurse1 && Array.isArray(nurse1) && nurse1.length > 0 && nurse1[0] ? nurse1[0].Nama : '',
            Nama_Perawat_IPCN: nurse2 && Array.isArray(nurse2) && nurse2.length > 0 && nurse2[0] ? nurse2[0].Nama : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const inpatient: IRawatInap = {
            Surveilans_Infeksi_Hais: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Inap && newEmrData.Rawat_Inap !== null) {
            newEmrData.Rawat_Inap.Surveilans_Infeksi_Hais = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Inap.Surveilans_Infeksi_Hais',
              updateDocument.newDocument.Rawat_Inap.Surveilans_Infeksi_Hais,
            );
            ElasticLoggerService().createLog(req, '/rawat-inap/surveilans-infeksi-hais', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                data: updateDocument.newDocument.Rawat_Inap.Surveilans_Infeksi_Hais,
              })
            }
          } else {
            newEmrData.Rawat_Inap = inpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Inap', updateDocument.newDocument.Rawat_Inap);
            ElasticLoggerService().createLog(req, '/rawat-inap/surveilans-infeksi-hais', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                data: updateDocument.newDocument.Rawat_Inap.Surveilans_Infeksi_Hais,
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-inap/surveilans-infeksi-hais', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-inap/surveilans-infeksi-hais', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-inap/surveilans-infeksi-hais', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

Inpatient.route('/rawat-inap/catatan-keperawatan-pra-operasi-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'No_MR'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      const checkOK = await global.medicalRecord.keys(req.emrID, '.OK');
      if (checkObject !== null && checkObject.includes("Catatan_Keperawatan_Pra_Operasi")) {
        emrKeys.push("Rawat_Inap.Catatan_Keperawatan_Pra_Operasi");
      }
      if (checkOK !== null && checkOK.includes("Catatan_Keperawatan_Pra_Operasi")) {
        emrKeys.push("OK.Catatan_Keperawatan_Pra_Operasi");
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      const ews = await getFirstEws(req.emrID);
      const cppt = await getCpptNurseData(req.emrID, 'RawatInap');
      if (result && result !== null) {
        const form: IRajalCatatanKeperawatanPraOp = (result['Rawat_Inap.Catatan_Keperawatan_Pra_Operasi']) ? result['Rawat_Inap.Catatan_Keperawatan_Pra_Operasi'] : {};
        const ok = result['OK.Catatan_Keperawatan_Pra_Operasi'] ?? {};
        if (form.TTD_Perawat_Penerima && form.TTD_Perawat_Penerima !== '' && isValidFile(form.TTD_Perawat_Penerima)) {
          form.TTD_Perawat_Penerima = await global.storage.signUrl(form.TTD_Perawat_Penerima, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (form.TTD_Perawat_Ruangan && form.TTD_Perawat_Ruangan !== '' && isValidFile(form.TTD_Perawat_Ruangan)) {
          form.TTD_Perawat_Ruangan = await global.storage.signUrl(form.TTD_Perawat_Ruangan, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }

        const data = {
          EMR_ID: req.emrID ? req.emrID : '',
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          form,
          ok,
          ews: ews && ews.Td && ews.Td.includes('/') ? ews : ews && ews.Td && ews.Td_1 ? {...ews, Td: `${ews.Td}/${ews.Td_1}`} : {},
          cppt,
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
  });

Inpatient.route('/rawat-inap/catatan-keperawatan-pra-operasi-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: any = req.body;
          const roomNurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==1&&@.Status_Dokter==0&&@.ID_Karyawan=='${dataToPost['id-perawat-ruangan']}')]`)
          const nurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==1&&@.Status_Dokter==0&&@.ID_Karyawan=='${dataToPost['id-perawat-penerima']}')]`)
          const fixedData = RajalCatatanKeperawatanPra.createFromJson(dataToPost);
          const redisJsonData: any = {
            ...fixedData,
            Nama_Perawat_Ruangan: roomNurse && Array.isArray(roomNurse) && roomNurse.length > 0 && roomNurse[0] ? roomNurse[0].Nama : '',
            Nama_Perawat_Penerima: nurse && Array.isArray(nurse) && nurse.length > 0 && nurse[0] ? nurse[0].Nama : '',
            Tanggal: dataToPost.tanggal ? dataToPost.tanggal : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const radios = [
            'Verifikasi_Periksa_Identitas',
            'Verifikasi_Periksa_Gelang',
            'Verifikasi_Surat_Pengantar_Operasi',
            'Verifikasi_Jenis_Lokasi_Operasi',
            'Verifikasi_Masalah_Bahasa_Komunikasi',
            'Verifikasi_Surat_Izin_Operasi',
            'Verifikasi_Persetujuan_Anestesi',
            'Verifikasi_Kelengkapan_Resume_Medis',
            'Verifikasi_Kelengkapan_X_Ray',

            'Persiapan_Puasa',
            'Persiapan_Prothese_Luar',
            'Persiapan_Prothese_Dalam',
            'Persiapan_Penjepit_Rambut',
            'Persiapan_Kulit',
            'Persiapan_Alat_Bantu',
            'Persiapan_Obat_Disertakan',
            'Persiapan_Obat_Terakhir_Diberikan',
            'Persiapan_Vaskuler_Akses',
          ];

          for (const item of radios) {
            const dashedKey = item.toLowerCase();

            redisJsonData[item] = dataToPost[dashedKey] && dataToPost[dashedKey] === '1' ? 1 : dataToPost[dashedKey] && dataToPost[dashedKey] === '0' ? 0 : null;
            redisJsonData[`${item}_Keterangan`] = dataToPost[`${dashedKey}_keterangan`] ?? '';
          }

          const outpatient: IRawatInap = {
            Catatan_Keperawatan_Pra_Operasi: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Inap && newEmrData.Rawat_Inap !== null) {
            newEmrData.Rawat_Inap.Catatan_Keperawatan_Pra_Operasi = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Inap.Catatan_Keperawatan_Pra_Operasi',
              updateDocument.newDocument.Rawat_Inap.Catatan_Keperawatan_Pra_Operasi,
            );
            ElasticLoggerService().createLog(req, '/rawat-inap/catatan-keperawatan-pra-operasi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.Rawat_Inap = outpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Inap', updateDocument.newDocument.Rawat_Inap);
            ElasticLoggerService().createLog(req, '/rawat-inap/catatan-keperawatan-pra-operasi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-inap/catatan-keperawatan-pra-operasi', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-inap/catatan-keperawatan-pra-operasi', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-inap/catatan-keperawatan-pra-operasi', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

Inpatient.route('/rawat-inap/checklist-pra-operasi-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'No_MR'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      if (checkObject !== null && checkObject.includes("Checklist_Pra_Operasi")) {
        emrKeys.push("Rawat_Inap.Checklist_Pra_Operasi");
      }
      if (checkObject !== null && checkObject.includes("Catatan_Keperawatan_Pra_Operasi")) {
        emrKeys.push("Rawat_Inap.Catatan_Keperawatan_Pra_Operasi");
      }
      const checkUgd = await global.medicalRecord.keys(req.emrID, '.UGD');
      if (checkUgd !== null && checkUgd.includes('Assesmen')) {
        emrKeys.push('UGD.Assesmen');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form: IChecklistPraOperasi = (result['Rawat_Inap.Checklist_Pra_Operasi']) ? result['Rawat_Inap.Checklist_Pra_Operasi'] : {};
        const vitalSign = result['Rawat_Inap.Catatan_Keperawatan_Pra_Operasi'] ?? {};
        const ews = await getFirstEws(req.emrID);
        const assessmentUgd = result['UGD.Assesmen'] ?? {};

        if (form.Tanda_Tangan_Perawat_Pengantar && form.Tanda_Tangan_Perawat_Pengantar !== '' && isValidFile(form.Tanda_Tangan_Perawat_Pengantar)) {
          form.Tanda_Tangan_Perawat_Pengantar = await global.storage.signUrl(form.Tanda_Tangan_Perawat_Pengantar, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (form.Tanda_Tangan_Perawat_Penerima && form.Tanda_Tangan_Perawat_Penerima !== '' && isValidFile(form.Tanda_Tangan_Perawat_Penerima)) {
          form.Tanda_Tangan_Perawat_Penerima = await global.storage.signUrl(form.Tanda_Tangan_Perawat_Penerima, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (form.Tanda_Tangan_Kepala_Bedah && form.Tanda_Tangan_Kepala_Bedah !== '' && isValidFile(form.Tanda_Tangan_Kepala_Bedah)) {
          form.Tanda_Tangan_Kepala_Bedah = await global.storage.signUrl(form.Tanda_Tangan_Kepala_Bedah, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }

        const data = {
          EMR_ID: req.emrID ? req.emrID : '',
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          form,
          asesmen: assessmentUgd,
          ews: ews && ews.Td && ews.Td.includes('/') ? ews : ews && ews.Td && ews.Td_1 ? {...ews, Td: `${ews.Td}/${ews.Td_1}`} : {},
          tanda_vital: vitalSign,
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
  });

Inpatient.route('/rawat-inap/checklist-pra-operasi-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdateChecklistPraOperasi = req.body;
          const nurse1 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==1&&@.Status_Dokter==0&&@.ID_Karyawan=='${dataToPost['id-tanda-tangan-perawat-pengantar']}')]`)
          const nurse2 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==1&&@.Status_Dokter==0&&@.ID_Karyawan=='${dataToPost['id-tanda-tangan-perawat-penerima']}')]`)
          const nurse3 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==1&&@.Status_Dokter==0&&@.ID_Karyawan=='${dataToPost['id-tanda-tangan-kepala-bedah']}')]`)
          const doctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost.dokter_id}')]`)
          const fixedData = ChecklistPraOperasiForm.createFromJson(dataToPost);
          const redisJsonData: IChecklistPraOperasi = {
            ...fixedData,
            Dokter_Anestesi_Nama: doctor && Array.isArray(doctor) && doctor.length > 0 && doctor[0] ? doctor[0].Nama : '',
            Nama_Perawat_Pengantar: nurse1 && Array.isArray(nurse1) && nurse1.length > 0 && nurse1[0] ? nurse1[0].Nama : '',
            Nama_Perawat_Penerima: nurse2 && Array.isArray(nurse2) && nurse2.length > 0 && nurse2[0] ? nurse2[0].Nama : '',
            Nama_Kepala_Bedah: nurse3 && Array.isArray(nurse3) && nurse3.length > 0 && nurse3[0] ? nurse3[0].Nama : '',
            Tanggal: dataToPost.tanggal ? dataToPost.tanggal : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const outpatient: IRawatInap = {
            Checklist_Pra_Operasi: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Inap && newEmrData.Rawat_Inap !== null) {
            newEmrData.Rawat_Inap.Checklist_Pra_Operasi = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Inap.Checklist_Pra_Operasi',
              updateDocument.newDocument.Rawat_Inap.Checklist_Pra_Operasi,
            );
            ElasticLoggerService().createLog(req, '/rawat-inap/checklist-pra-operasi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.Rawat_Inap = outpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Inap', updateDocument.newDocument.Rawat_Inap);
            ElasticLoggerService().createLog(req, '/rawat-inap/checklist-pra-operasi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-inap/checklist-pra-operasi', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-inap/checklist-pra-operasi', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-inap/checklist-pra-operasi', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

Inpatient.route('/rawat-inap/serah-terima-pasien-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'No_MR'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      if (checkObject !== null && checkObject.includes("Serah_Terima_Pasien")) {
        emrKeys.push("Rawat_Inap.Serah_Terima_Pasien");
      }
      if (checkObject !== null && checkObject.includes("Catatan_Keperawatan_Pra_Operasi")) {
        emrKeys.push("Rawat_Inap.Catatan_Keperawatan_Pra_Operasi");
      }
      const checkUgd = await global.medicalRecord.keys(req.emrID, '.UGD');
      if (checkUgd !== null && checkUgd.includes('Assesmen')) {
        emrKeys.push('UGD.Assesmen');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form: ISerahTerimaPasien = (result['Rawat_Inap.Serah_Terima_Pasien']) ? result['Rawat_Inap.Serah_Terima_Pasien'] : {};
        const vitalSign = result['Rawat_Inap.Catatan_Keperawatan_Pra_Operasi'] ?? {};
        const assessmentUgd = result['UGD.Assesmen'] ?? {};
        const ews = await getFirstEws(req.emrID);

        if (form.TTD_Perawat_Kamar_Bedah && form.TTD_Perawat_Kamar_Bedah !== '' && isValidFile(form.TTD_Perawat_Kamar_Bedah)) {
          form.TTD_Perawat_Kamar_Bedah = await global.storage.signUrl(form.TTD_Perawat_Kamar_Bedah, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (form.TTD_Perawat_Ranap_Rajal && form.TTD_Perawat_Ranap_Rajal !== '' && isValidFile(form.TTD_Perawat_Ranap_Rajal)) {
          form.TTD_Perawat_Ranap_Rajal = await global.storage.signUrl(form.TTD_Perawat_Ranap_Rajal, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }

        const data = {
          EMR_ID: req.emrID ? req.emrID : '',
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          form,
          asesmen: assessmentUgd,
          ews: ews && ews.Td && ews.Td.includes('/') ? ews : ews && ews.Td && ews.Td_1 ? {...ews, Td: `${ews.Td}/${ews.Td_1}`} : {},
          tanda_vital: vitalSign,
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
  });

Inpatient.route('/rawat-inap/serah-terima-pasien-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdateSerahTerimaPasien = req.body;
          const nurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==1&&@.Status_Dokter==0&&@.ID_Karyawan=='${dataToPost.id_perawat_kamar_bedah}')]`)
          const nurse1 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==1&&@.Status_Dokter==0&&@.ID_Karyawan=='${dataToPost.id_perawat_ranap_rajal}')]`)
          const fixedData = SerahTerimaPasien.createFromJson(dataToPost);
          const redisJsonData: ISerahTerimaPasien = {
            ...fixedData,
            Nama_Perawat_Kamar_Bedah: nurse && Array.isArray(nurse) && nurse.length > 0 && nurse[0] ? nurse[0].Nama : '',
            Nama_Perawat_Ranap_Rajal: nurse1 && Array.isArray(nurse1) && nurse1.length > 0 && nurse1[0] ? nurse1[0].Nama : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const outpatient: IRawatInap = {
            Serah_Terima_Pasien: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Inap && newEmrData.Rawat_Inap !== null) {
            newEmrData.Rawat_Inap.Serah_Terima_Pasien = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Inap.Serah_Terima_Pasien',
              updateDocument.newDocument.Rawat_Inap.Serah_Terima_Pasien,
            );
            ElasticLoggerService().createLog(req, '/rawat-inap/serah-terima-pasien', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.Rawat_Inap = outpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Inap', updateDocument.newDocument.Rawat_Inap);
            ElasticLoggerService().createLog(req, '/rawat-inap/serah-terima-pasien', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-inap/serah-terima-pasien', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-inap/serah-terima-pasien', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-inap/serah-terima-pasien', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

Inpatient.route('/rawat-inap/penandaan-area-pembedahan-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'No_MR', 'Rawat_Inap'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      if (checkObject !== null && checkObject.includes("Penandaan_Area_Pembedahan")) {
        emrKeys.push("Rawat_Inap.Penandaan_Area_Pembedahan");
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form: IPenandaanAreaPembedahan = (result['Rawat_Inap.Penandaan_Area_Pembedahan']) ? result['Rawat_Inap.Penandaan_Area_Pembedahan'] : {};
        const outpatient = (result['Rawat_Inap']) ? result['Rawat_Inap'] : {};
        const inpatient = result['Rawat_Inap'] ?? {};

        let operationPack = '';

        if (result['Jenis_Pelayanan'] && result['Jenis_Pelayanan'] === 'RawatJalan') {
          operationPack = outpatient.Nama_Paket_Operasi ?? '';
        }

        if (result['Jenis_Pelayanan'] && result['Jenis_Pelayanan'] === 'RawatInap') {
          if (inpatient.Nama_Paket_Operasi && Array.isArray(inpatient.Nama_Paket_Operasi) && inpatient.Nama_Paket_Operasi[0]) {
            operationPack = inpatient.Nama_Paket_Operasi[0].Nama_Paket_Operasi ?? '';
          }
        }

        if (form.Gambar_Body && form.Gambar_Body !== '' && isValidFile(form.Gambar_Body)) {
          form.Gambar_Body = await global.storage.signUrl(form.Gambar_Body, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (form.Gambar_Head && form.Gambar_Head !== '' && isValidFile(form.Gambar_Head)) {
          form.Gambar_Head = await global.storage.signUrl(form.Gambar_Head, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (form.Tanda_Tangan_Pasien && form.Tanda_Tangan_Pasien !== '' && isValidFile(form.Tanda_Tangan_Pasien)) {
          form.Tanda_Tangan_Pasien = await global.storage.signUrl(form.Tanda_Tangan_Pasien, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (form.Tanda_Tangan_Perawat && form.Tanda_Tangan_Perawat !== '' && isValidFile(form.Tanda_Tangan_Perawat)) {
          form.Tanda_Tangan_Perawat = await global.storage.signUrl(form.Tanda_Tangan_Perawat, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (form.TTD_Dokter_Pelaksana && form.TTD_Dokter_Pelaksana !== '' && isValidFile(form.TTD_Dokter_Pelaksana)) {
          form.TTD_Dokter_Pelaksana = await global.storage.signUrl(form.TTD_Dokter_Pelaksana, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }

        const data = {
          EMR_ID: req.emrID ? req.emrID : '',
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          form,
          rawat_inap: outpatient,
          paket_operasi: operationPack,
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
  });

Inpatient.route('/rawat-inap/penandaan-area-pembedahan-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdatePenandaanAreaPembedahan = req.body;
          const nurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==1&&@.Status_Dokter==0&&@.ID_Karyawan=='${dataToPost['id-perawat']}')]`)
          const doctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost['dokter_pelaksana']}')]`)
          const operationDoctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost.dokter_operasi}')]`)
          const fixedData = PenandaanAreaPembedahan.createFromJson(dataToPost);
          const redisJsonData: IPenandaanAreaPembedahan = {
            ...fixedData,
            Nama_Dokter_Pelaksana: doctor && Array.isArray(doctor) && doctor.length > 0 && doctor[0] ? doctor[0].Nama : '',
            Nama_Perawat: nurse && Array.isArray(nurse) && nurse.length > 0 && nurse[0] ? nurse[0].Nama : '',
            Dokter_Operasi_Nama: operationDoctor && Array.isArray(operationDoctor) && operationDoctor.length > 0 && operationDoctor[0] ? operationDoctor[0].Nama : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const outpatient: IRawatInap = {
            Penandaan_Area_Pembedahan: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Inap && newEmrData.Rawat_Inap !== null) {
            newEmrData.Rawat_Inap.Penandaan_Area_Pembedahan = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Inap.Penandaan_Area_Pembedahan',
              updateDocument.newDocument.Rawat_Inap.Penandaan_Area_Pembedahan,
            );
            ElasticLoggerService().createLog(req, '/rawat-inap/penandaan-area-pembedahan', 'OK');
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
                  form: updateDocument.newDocument.Rawat_Inap.Penandaan_Area_Pembedahan ?? {},
                },
              })
            }
          } else {
            newEmrData.Rawat_Inap = outpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Inap', updateDocument.newDocument.Rawat_Inap);
            ElasticLoggerService().createLog(req, '/rawat-inap/penandaan-area-pembedahan', 'OK');
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
                  form: updateDocument.newDocument.Rawat_Inap.Penandaan_Area_Pembedahan ?? {},
                },
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-inap/penandaan-area-pembedahan', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-inap/penandaan-area-pembedahan', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-inap/penandaan-area-pembedahan', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });


export { Inpatient };

