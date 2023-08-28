import e, { Router, Request, Response, NextFunction } from 'express'
import RBAC from '../../../services/rbac'
import moment from 'moment'
import { ElasticLoggerService, SimrsService } from './services';
import { v4 as uuid } from "uuid";
import * as jsonpatch from 'fast-json-patch';
import { IUpdateToSimrs, UpdateToSimrs } from './interfaces/simrs/simrs.request';
import { IGetMedsRequest, IGetHtuRequest, GetMedsRequest, GetHtuRequest, IUpdatePengkajianAwal, IUpdateRisikoJatuh, IBiometricExamRequest, PostDaftarObat, IUpdatePengkajianAwalKeperawatan, IUpdateBPRJ, IUpdatePemberianInformasi, IUpdatePersetujuanTindakanDokter, IUpdateChecklistPraOperasi, IUpdatePenandaanAreaPembedahan, IUpdateSerahTerimaPasien, IUpdateKonsultasi, UpdateResumeMedisPdf } from './interfaces/outpatient/outpatient.request';
import { BPRJForm, DoctorPreliminaryStudyFormModel, FallRiskForm, IBPRJ, IBPRJForm, IDoctorPreliminaryStudyFormModel, IFallRiskForm, IHowToUse, IMedicine, IPengkajianAwal, IPengkajianAwalKeperawatan, IPengkajianAwalKeperawatanForm, IPrescription, IRisikoJatuh, IMedsPackage, PemberianInformasi, PengkajianAwalKeperawatanForm, PersetujuanTindakanDokter, IPersetujuanTindakanDokter, RajalCatatanKeperawatanPra, ChecklistPraOperasiForm, PenandaanAreaPembedahan, SerahTerimaPasien, Konsultasi } from './interfaces/outpatient/outpatient.model';
import { getCpptDoctorData, getCpptNurseData, getFirstEws, getHandling, isValidFile } from './helpers/app.helper';
const jp = require('jsonpath')
const debugEMR = require("debug")("emr");
const Outpatient = Router();

Outpatient.route('/rawat-jalan/pengkajian-awal-form')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien']
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Jalan');
      const checkRo = await global.medicalRecord.keys(req.emrID, '.RO');
      const checkPharm = await global.medicalRecord.keys(req.emrID, '.Farmasi');
      if (checkObject !== null && checkObject.includes('Pengkajian_Awal')) {
        emrKeys.push('Rawat_Jalan.Pengkajian_Awal');
      }
      if (checkRo !== null && checkRo.includes('Pengkajian_Awal')) {
        emrKeys.push('RO.Pengkajian_Awal');
      }
      if (checkPharm !== null && checkPharm.includes('Tebus_Obat')) {
        emrKeys.push('Farmasi.Tebus_Obat');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      const config = await global.medicalRecord.get(`Config:{${result.Kode_Cabang}}`);
      const meds = await global.medicalRecord.get(`Obat:{${result.Kode_Cabang}}:${result.Tipe_Pasien}`);
      const htu = await global.medicalRecord.get(`AturanPakai:{${result.Kode_Cabang}}`);
      let medsPackage: any = await global.medicalRecord.get(`PaketObat:{${result.Kode_Cabang}}`);
      if (medsPackage && medsPackage !== null && Array.isArray(medsPackage)) {
        const activePackage = medsPackage.filter((item: IMedsPackage) => item.Status_Aktif)
        const serviceFiltered = activePackage.filter((item: IMedsPackage) => item.Tipe_Pelayanan === result.Tipe_Pasien);
        medsPackage = serviceFiltered;
      }
      if (result && result !== null) {
        const form = result['Rawat_Jalan.Pengkajian_Awal'] ? result['Rawat_Jalan.Pengkajian_Awal'] : {}

        const image1 = form && form.Image_1 ? form.Image_1 : undefined;
        const image2 = form && form.Image_2 ? form.Image_2 : undefined;

        form.Gambar_Mata_OD = (form.Gambar_Mata_OD && form.Gambar_Mata_OD !== '' && isValidFile(form.Gambar_Mata_OD)) ? await global.storage.signUrl(form.Gambar_Mata_OD, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        form.Gambar_Mata_OS = (form.Gambar_Mata_OS && form.Gambar_Mata_OS !== '' && isValidFile(form.Gambar_Mata_OS)) ? await global.storage.signUrl(form.Gambar_Mata_OS, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        form.Gambar_Retina_OD = (form.Gambar_Retina_OD && form.Gambar_Retina_OD !== '' && isValidFile(form.Gambar_Retina_OD)) ? await global.storage.signUrl(form.Gambar_Retina_OD, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        form.Gambar_Retina_OS = (form.Gambar_Retina_OS && form.Gambar_Retina_OS !== '' && isValidFile(form.Gambar_Retina_OS)) ? await global.storage.signUrl(form.Gambar_Retina_OS, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        form.TTD_Dokter_Pengkaji = (form.TTD_Dokter_Pengkaji && form.TTD_Dokter_Pengkaji !== '' && isValidFile(form.TTD_Dokter_Pengkaji)) ? await global.storage.signUrl(form.TTD_Dokter_Pengkaji, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        if (image1 && image1.Url_Image && image1.Url_Image !== '' && isValidFile(image1.Url_Image)) {
          image1.Url_Image = await global.storage.signUrl(image1.Url_Image, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }

        if (image2 && image2.Url_Image && image2.Url_Image !== '' && isValidFile(image2.Url_Image)) {
          image2.Url_Image = await global.storage.signUrl(image2.Url_Image, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }

        const data: IPengkajianAwal = {
          EMR_ID: req.emrID,
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          isDefault: config && config !== null ? config.dpad : false,
          form,
          formFarmasi: (result['Farmasi.Tebus_Obat']) ? result['Farmasi.Tebus_Obat'] : {},
          formRO: (result['RO.Pengkajian_Awal']) ? result['RO.Pengkajian_Awal'] : {},
          obat: meds ? meds : [],
          aturan_pakai: htu ? htu : [],
          paket_obat: medsPackage ?? [],
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

Outpatient.route('/rawat-jalan/pengkajian-awal-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdatePengkajianAwal = req.body;
          const meds = await global.medicalRecord.get(`Obat:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`);
          const htu = await global.medicalRecord.get(`AturanPakai:{${emrData.Kode_Cabang}}`);

          const prescriptions: Array<IPrescription> | Array<any> = [];

          for (let i = 0; i < (dataToPost['nama-obat'] ? dataToPost['nama-obat'] : []).length; i += 1) {
            const medsCode = dataToPost['nama-obat'][i] ? dataToPost['nama-obat'][i] : ''
            const total = dataToPost['jumlah'][i] ? dataToPost['jumlah'][i] : '';
            const note = dataToPost['catatan'][i] ? dataToPost['catatan'][i] : '';
            const howToUse = dataToPost['aturan-pakai'][i] ? dataToPost['aturan-pakai'][i] : '';

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

          const doctorTreating = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost['id-dokter-pengkaji']}')]`)
          const jsonData = DoctorPreliminaryStudyFormModel.createFromJson(dataToPost);
          const redisJsonData: IDoctorPreliminaryStudyFormModel = {
            ...jsonData,
            Resep: prescriptions ? prescriptions : [],
            Nama_Dokter_Pengkaji: (doctorTreating && doctorTreating.length > 0) ? doctorTreating[0].Nama : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const outpatient: IRawatJalan = {
            Pengkajian_Awal: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Jalan && newEmrData.Rawat_Jalan !== null) {
            newEmrData.Rawat_Jalan.Pengkajian_Awal = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Jalan.Pengkajian_Awal',
              updateDocument.newDocument.Rawat_Jalan.Pengkajian_Awal,
            );
            ElasticLoggerService().createLog(req, '/rawat-jalan/pengkajian-awal', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.Rawat_Jalan = outpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Jalan', updateDocument.newDocument.Rawat_Jalan);
            ElasticLoggerService().createLog(req, '/rawat-jalan/pengkajian-awal', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-jalan/pengkajian-awal', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-jalan/pengkajian-awal', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-jalan/pengkajian-awal', `${err}`);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  })

Outpatient.route('/rawat-jalan/pengkajian-awal-keperawatan-form')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Wali', 'Tipe_Pasien']
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Jalan');
      if (checkObject !== null && checkObject.includes('Pengkajian_Awal_Keperawatan')) {
        emrKeys.push('Rawat_Jalan.Pengkajian_Awal_Keperawatan');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form: IPengkajianAwalKeperawatanForm = result['Rawat_Jalan.Pengkajian_Awal_Keperawatan'] ? result['Rawat_Jalan.Pengkajian_Awal_Keperawatan'] : {};

        if ((form.TTD_Perawat_Pengkajian_Masuk && form.TTD_Perawat_Pengkajian_Masuk !== '' && isValidFile(form.TTD_Perawat_Pengkajian_Masuk))) {
          form.TTD_Perawat_Pengkajian_Masuk = await global.storage.signUrl(form.TTD_Perawat_Pengkajian_Masuk, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        const data: IPengkajianAwalKeperawatan = {
          EMR_ID: req.emrID,
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          wali: (result.Wali) ? result.Wali : {},
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
      if (!result || (result && result === null)) {
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

Outpatient.route('/rawat-jalan/pengkajian-awal-keperawatan-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdatePengkajianAwalKeperawatan = req.body;
          const nurseIn = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==1&&@.Status_Dokter==0&&@.ID_Karyawan=='${dataToPost['id-perawat-pengkajian-masuk']}')]`);
          const nurseOut = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==1&&@.Status_Dokter==0&&@.ID_Karyawan=='${dataToPost['id-perawat-pengkajian-keluar']}')]`);
          const jsonData = PengkajianAwalKeperawatanForm.createFromJson(dataToPost);
          const redisJsonData: IPengkajianAwalKeperawatanForm = {
            ...jsonData,
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Nama_Perawat_Pengkajian_Masuk: (nurseIn && nurseIn.length > 0) ? nurseIn[0].Nama : '',
            Nama_Perawat_Pengkajian_Keluar: (nurseOut && nurseOut.length > 0) ? nurseOut[0].Nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }
          const outpatient: IRawatJalan = {
            Pengkajian_Awal_Keperawatan: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Jalan && newEmrData.Rawat_Jalan !== null) {
            newEmrData.Rawat_Jalan.Pengkajian_Awal_Keperawatan = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Jalan.Pengkajian_Awal_Keperawatan',
              updateDocument.newDocument.Rawat_Jalan.Pengkajian_Awal_Keperawatan,
            );
            ElasticLoggerService().createLog(req, '/rawat-jalan/pengkajian-awal-keperawatan', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.Rawat_Jalan = outpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Jalan', updateDocument.newDocument.Rawat_Jalan);
            ElasticLoggerService().createLog(req, '/rawat-jalan/pengkajian-awal-keperawatan', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-jalan/pengkajian-awal-keperawatan', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-jalan/pengkajian-awal-keperawatan', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-jalan/pengkajian-awal-keperawatan', `${err}`);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

Outpatient.route('/rawat-jalan/risiko-jatuh-form')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien']
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Jalan');
      if (checkObject !== null && checkObject.includes('Risiko_Jatuh')) {
        emrKeys.push('Rawat_Jalan.Risiko_Jatuh');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form = result['Rawat_Jalan.Risiko_Jatuh'] ? result['Rawat_Jalan.Risiko_Jatuh'] : {}

        form.Tanda_Tangan = (form.Tanda_Tangan && form.Tanda_Tangan !== '' && isValidFile(form.Tanda_Tangan)) ? await global.storage.signUrl(form.Tanda_Tangan, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        const data: IRisikoJatuh = {
          EMR_ID: req.emrID ? req.emrID : '',
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

Outpatient.route('/rawat-jalan/risiko-jatuh-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdateRisikoJatuh = req.body;
          const officer = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost['id-tanda-tangan']}')]`)

          const dataAlatBantu = {
            1: (dataToPost['alatBantu-value'] && dataToPost['alatBantu-value'].includes('1')) ? 1 : 0,
            2: (dataToPost['alatBantu-value'] && dataToPost['alatBantu-value'].includes('2')) ? 1 : 0,
            3: (dataToPost['alatBantu-value'] && dataToPost['alatBantu-value'].includes('3')) ? 1 : 0,
            4: (dataToPost['alatBantu-value'] && dataToPost['alatBantu-value'].includes('4')) ? 1 : 0,
          }

          const jsonData = FallRiskForm.createFromJson(dataToPost);
          const redisJsonData: IFallRiskForm = {
            ...jsonData,
            Waktu: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Berjalan_Alat_Bantu_Data: {
              Kruk: dataAlatBantu[1],
              Tripot: dataAlatBantu[2],
              Kursi_Roda: dataAlatBantu[3],
              Orang_Lain: dataAlatBantu[4],
            },
            Tindakan_Rendah_Edukasi: (dataToPost['hasil-value'] && dataToPost['hasil-value'] === '1') ? undefined : (dataToPost['rendah-edukasi-radio']) ? parseInt(dataToPost['rendah-edukasi-radio']) : undefined,
            Tindakan_Tinggi_Pasang_Stiker: (!dataToPost['menopang-radio'] || (dataToPost['menopang-radio'] && dataToPost['menopang-radio'] === '0')) ? undefined : dataToPost['tinggi-stiker-radio'] ? parseInt(dataToPost['tinggi-stiker-radio']) : undefined,
            Tindakan_Tinggi_Kuning: (!dataToPost['menopang-radio'] || (dataToPost['menopang-radio'] && dataToPost['menopang-radio'] === '0')) ? undefined : dataToPost['tinggi-kuning-radio'] ? parseInt(dataToPost['tinggi-kuning-radio']) : undefined,
            Tindakan_Tinggi_Edukasi: (!dataToPost['menopang-radio'] || (dataToPost['menopang-radio'] && dataToPost['menopang-radio'] === '0')) ? undefined : dataToPost['tinggi-edukasi-radio'] ? parseInt(dataToPost['tinggi-edukasi-radio']) : undefined,
            Nama_Tanda_Tangan: (officer && Array.isArray(officer) && officer.length > 0 && officer[0] && officer[0].Nama) ? officer[0].Nama : '',
            ID_Petugas: req.userId ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const outpatient: IRawatJalan = {
            Risiko_Jatuh: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Jalan && newEmrData.Rawat_Jalan !== null) {
            newEmrData.Rawat_Jalan.Risiko_Jatuh = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Jalan.Risiko_Jatuh',
              updateDocument.newDocument.Rawat_Jalan.Risiko_Jatuh,
            );
            ElasticLoggerService().createLog(req, '/rawat-jalan/risiko-jatuh', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.Rawat_Jalan = outpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Jalan', updateDocument.newDocument.Rawat_Jalan);
            ElasticLoggerService().createLog(req, '/rawat-jalan/risiko-jatuh', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-jalan/risiko-jatuh', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-jalan/risiko-jatuh', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-jalan/risiko-jatuh', `${err}`);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  })

Outpatient.route('/rawat-jalan/bukti-pelayanan-rawat-jalan-form')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien']
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Jalan');
      const checkOptic = await global.medicalRecord.keys(req.emrID, '.Optik')
      const checkOk = await global.medicalRecord.keys(req.emrID, '.OK');
      const checkPharm = await global.medicalRecord.keys(req.emrID, '.Farmasi');
      if (checkObject !== null && checkObject.includes('Bukti_Pelayanan')) {
        emrKeys.push('Rawat_Jalan.Bukti_Pelayanan');
      }
      if (checkPharm !== null && checkPharm.includes('Tebus_Obat')) {
        emrKeys.push('Farmasi.Tebus_Obat');
      }
      if (checkObject !== null && checkObject.includes('Pengkajian_Awal')) {
        emrKeys.push('Rawat_Jalan.Pengkajian_Awal');
      }
      if (checkOptic !== null && checkOptic.includes("Resep_Kacamata")) {
        emrKeys.push("Optik.Resep_Kacamata");
      }
      if (checkOk !== null && checkOk.includes('Laporan_Pembedahan_Anestesi')) {
        emrKeys.push('OK.Laporan_Pembedahan_Anestesi');
      }

      const checkRo = await global.medicalRecord.keys(req.emrID, '.RO');
      if (checkRo !== null && checkRo.includes('Pengkajian_Awal')) {
        emrKeys.push('RO.Pengkajian_Awal');
      }

      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form = result['Rawat_Jalan.Bukti_Pelayanan'] ? result['Rawat_Jalan.Bukti_Pelayanan'] : {};
        const glassesPresc = result['Optik.Resep_Kacamata'] ? result['Optik.Resep_Kacamata'] : {};
        const surgeryReport = result['OK.Laporan_Pembedahan_Anestesi'] ? result['OK.Laporan_Pembedahan_Anestesi'] : {};
        const medsRedeem = result['Farmasi.Tebus_Obat'] ? result['Farmasi.Tebus_Obat'] : {};
        const cpptNurse = await getCpptNurseData(req.emrID, 'RawatJalan');

        let pengkajian_awal = undefined;
        if (!pengkajian_awal) {
          const cpptRajal =  await getCpptDoctorData(req.emrID, 'RawatJalan')
          const cpptOK = await getCpptDoctorData(req.emrID, 'OK');
          if (cpptRajal) {
            pengkajian_awal = cpptRajal;
          } else if (!cpptRajal && cpptOK) {
            pengkajian_awal = cpptOK;
          }
        }
        const ro = result['RO.Pengkajian_Awal'] ? result['RO.Pengkajian_Awal'] : {};

        form.TTD_Dokter = (form.TTD_Dokter && form.TTD_Dokter !== '' && isValidFile(form.TTD_Dokter)) ? await global.storage.signUrl(form.TTD_Dokter, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        form.Tanda_Tangan_Pasien = (form.Tanda_Tangan_Pasien && form.Tanda_Tangan_Pasien !== '' && isValidFile(form.Tanda_Tangan_Pasien)) ? await global.storage.signUrl(form.Tanda_Tangan_Pasien, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        form.Tanda_Tangan_Wali = (form.Tanda_Tangan_Wali && form.Tanda_Tangan_Wali !== '' && isValidFile(form.Tanda_Tangan_Wali)) ? await global.storage.signUrl(form.Tanda_Tangan_Wali, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        if (pengkajian_awal && pengkajian_awal.Gambar_Mata_OD) {
          pengkajian_awal.Gambar_Mata_OD = (pengkajian_awal.Gambar_Mata_OD && pengkajian_awal.Gambar_Mata_OD !== '' && isValidFile(pengkajian_awal.Gambar_Mata_OD)) ? await global.storage.signUrl(pengkajian_awal.Gambar_Mata_OD, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';
        }

        if (pengkajian_awal && pengkajian_awal.Gambar_Mata_OS) {
          pengkajian_awal.Gambar_Mata_OS = (pengkajian_awal.Gambar_Mata_OS && pengkajian_awal.Gambar_Mata_OS !== '' && isValidFile(pengkajian_awal.Gambar_Mata_OS)) ? await global.storage.signUrl(pengkajian_awal.Gambar_Mata_OS, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';
        }

        if (pengkajian_awal && pengkajian_awal.Gambar_Retina_OD) {
          pengkajian_awal.Gambar_Retina_OD = (pengkajian_awal.Gambar_Retina_OD && pengkajian_awal.Gambar_Retina_OD !== '' && isValidFile(pengkajian_awal.Gambar_Retina_OD)) ? await global.storage.signUrl(pengkajian_awal.Gambar_Retina_OD, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';
        }

        if (pengkajian_awal && pengkajian_awal.Gambar_Retina_OS) {
          pengkajian_awal.Gambar_Retina_OS = (pengkajian_awal.Gambar_Retina_OS && pengkajian_awal.Gambar_Retina_OS !== '' && isValidFile(pengkajian_awal.Gambar_Retina_OS)) ? await global.storage.signUrl(pengkajian_awal.Gambar_Retina_OS, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';
        }

        if (pengkajian_awal && pengkajian_awal.TTD_Dokter_Pengkaji) {
          pengkajian_awal.TTD_Dokter_Pengkaji = (pengkajian_awal.TTD_Dokter_Pengkaji && pengkajian_awal.TTD_Dokter_Pengkaji !== '' && isValidFile(pengkajian_awal.TTD_Dokter_Pengkaji)) ? await global.storage.signUrl(pengkajian_awal.TTD_Dokter_Pengkaji, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';
        }

        const data: IBPRJ = {
          EMR_ID: req.emrID ? req.emrID : '',
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          form,
          pengkajian_awal: pengkajian_awal ? pengkajian_awal : {},
          cppt_perawat: cpptNurse ?? {},
          resep_kacamata: glassesPresc,
          laporan_pembedahan: surgeryReport,
          ro,
          tebus_obat: medsRedeem,
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
  });

Outpatient.route('/rawat-jalan/bukti-pelayanan-rawat-jalan-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdateBPRJ = req.body;
          const selectedDoctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost['id-dokter']}')]`)
          const fixedData = BPRJForm.createFromJson(dataToPost);

          const redisJsonData: IBPRJForm = {
            ...fixedData,
            Waktu: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Nama_Dokter: (selectedDoctor && Array.isArray(selectedDoctor) && selectedDoctor.length > 0 && selectedDoctor[0] && selectedDoctor[0].Nama) ? selectedDoctor[0].Nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: req.userId ? req.userId : '',
          }

          const outpatient: IRawatJalan = {
            Bukti_Pelayanan: redisJsonData,
          };

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Jalan && newEmrData.Rawat_Jalan !== null) {
            newEmrData.Rawat_Jalan.Bukti_Pelayanan = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Jalan.Bukti_Pelayanan',
              updateDocument.newDocument.Rawat_Jalan.Bukti_Pelayanan,
            );
            ElasticLoggerService().createLog(req, '/rawat-jalan/bprj', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.Rawat_Jalan = outpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Jalan', updateDocument.newDocument.Rawat_Jalan);
            ElasticLoggerService().createLog(req, '/rawat-jalan/bprj', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-jalan/bprj', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-jalan/bprj', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-jalan/bprj', `${err}`);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

Outpatient.route('/rawat-jalan/pemberian-informasi-form')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien']
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Jalan');
      if (checkObject !== null && checkObject.includes('Pemberian_Informasi')) {
        emrKeys.push('Rawat_Jalan.Pemberian_Informasi');
      }

      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form: IPemberianInformasi = result['Rawat_Jalan.Pemberian_Informasi'] ? result['Rawat_Jalan.Pemberian_Informasi'] : {};

        form.TTD_Dokter_Pelaksana = (form.TTD_Dokter_Pelaksana && form.TTD_Dokter_Pelaksana !== '' && isValidFile(form.TTD_Dokter_Pelaksana)) ? await global.storage.signUrl(form.TTD_Dokter_Pelaksana, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        form.TTD_Pasien = (form.TTD_Pasien && form.TTD_Pasien !== '' && isValidFile(form.TTD_Pasien)) ? await global.storage.signUrl(form.TTD_Pasien, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        const data = {
          EMR_ID: req.emrID ? req.emrID : '',
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

Outpatient.route('/rawat-jalan/pemberian-informasi-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdatePemberianInformasi = req.body;
          const doctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost['dokter-pelaksana']}')]`)
          const informationDoctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost['dokter-pelaksana']}')]`)
          const informProvider = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost['pemberi-informasi']}')]`)
          const fixedData = PemberianInformasi.createFromJson(dataToPost);
          const redisJsonData: IPemberianInformasi = {
            ...fixedData,
            Nama_Dokter_Pelaksana_Informasi: informationDoctor && Array.isArray(informationDoctor) && informationDoctor.length > 0 && informationDoctor[0] ? informationDoctor[0].Nama : '',
            Nama_Dokter_Pelaksana: doctor && Array.isArray(doctor) && doctor.length > 0 && doctor[0] ? doctor[0].Nama : '',
            Nama_Pemberi_Informasi: informProvider && Array.isArray(informProvider) && informProvider.length > 0 && informProvider[0] ? informProvider[0].Nama : '',
            ID_Petugas: req.userId ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }
          const outpatient: IRawatJalan = {
            Pemberian_Informasi: redisJsonData,
          };

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Jalan && newEmrData.Rawat_Jalan !== null) {
            newEmrData.Rawat_Jalan.Pemberian_Informasi = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Jalan.Pemberian_Informasi',
              updateDocument.newDocument.Rawat_Jalan.Pemberian_Informasi,
            );
            ElasticLoggerService().createLog(req, '/rawat-jalan/pemberian-informasi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.Rawat_Jalan = outpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Jalan', updateDocument.newDocument.Rawat_Jalan);
            ElasticLoggerService().createLog(req, '/rawat-jalan/pemberian-informasi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-jalan/pemberian-informasi', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-jalan/pemberian-informasi', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-jalan/pemberian-informasi', `${err}`);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  })

Outpatient.route('/rawat-jalan/persetujuan-tindakan-dokter-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Rawat_Jalan']
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Jalan');
      if (checkObject !== null && checkObject.includes('Persetujuan_Tindakan_Dokter')) {
        emrKeys.push('Rawat_Jalan.Persetujuan_Tindakan_Dokter');
      }

      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form: IPersetujuanTindakanDokter = result['Rawat_Jalan.Persetujuan_Tindakan_Dokter'] ? result['Rawat_Jalan.Persetujuan_Tindakan_Dokter'] : {};
        const rawatJalan = result['Rawat_Jalan'] ? result['Rawat_Jalan'] : {};

        if (form.Tanda_Tangan_Pasien && form.Tanda_Tangan_Pasien !== '' && isValidFile(form.Tanda_Tangan_Pasien)) {
          form.Tanda_Tangan_Pasien = await global.storage.signUrl(form.Tanda_Tangan_Pasien, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }

        if (form.Tanda_Tangan_Saksi && form.Tanda_Tangan_Saksi !== '' && isValidFile(form.Tanda_Tangan_Saksi)) {
          form.Tanda_Tangan_Saksi = await global.storage.signUrl(form.Tanda_Tangan_Saksi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }

        if (form.Tanda_Tangan_Saksi_2 && form.Tanda_Tangan_Saksi_2 !== '' && isValidFile(form.Tanda_Tangan_Saksi_2)) {
          form.Tanda_Tangan_Saksi_2 = await global.storage.signUrl(form.Tanda_Tangan_Saksi_2, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
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
          rawat_jalan: rawatJalan,
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

Outpatient.route('/rawat-jalan/persetujuan-tindakan-dokter-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdatePersetujuanTindakanDokter = req.body;
          const witness = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost['id-saksi']}')]`)
          const doctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost.dokter_pelaksana}')]`)
          const fixedData = PersetujuanTindakanDokter.createFromJson(dataToPost);
          const redisJsonData: any = {
            ...fixedData,
            Nama_Saksi: witness && Array.isArray(witness) && witness.length > 0 && witness[0] ? witness[0].Nama : '',
            Nama_Dokter_Pelaksana: doctor && Array.isArray(doctor) && doctor.length > 0 && doctor[0] ? doctor[0].Nama : '',
            Nama_Saksi_Keluarga: dataToPost['nama-saksi-keluarga'] ?? '',
            ID_Petugas: req.userId ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          if (dataToPost['tandaTangan-radio'] && dataToPost['tandaTangan-radio'] !== '1') {
            redisJsonData.Tanda_Tangan_Nama = dataToPost['tandaTangan-nama'] ?? '';
            redisJsonData.Tanda_Tangan_TglLahir = dataToPost['tandaTangan-tglLahir'] ?? '';
            redisJsonData.Tanda_Tangan_JK = dataToPost['tandaTangan-jk'] ?? '';
            redisJsonData.Tanda_Tangan_Telp = dataToPost['tandaTangan-telp'] ?? '';
            redisJsonData.Tanda_Tangan_Alamat = dataToPost['tandaTangan-alamat'] ?? '';
            redisJsonData.Tanda_Tangan_Hubungan = dataToPost['tandaTangan-hubungan'] ?? '';
          }

          const outpatient: IRawatJalan = {
            Persetujuan_Tindakan_Dokter: redisJsonData,
          };

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Jalan && newEmrData.Rawat_Jalan !== null) {
            newEmrData.Rawat_Jalan.Persetujuan_Tindakan_Dokter = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Jalan.Persetujuan_Tindakan_Dokter',
              updateDocument.newDocument.Rawat_Jalan.Persetujuan_Tindakan_Dokter,
            );
            ElasticLoggerService().createLog(req, '/rawat-jalan/persetujuan-tindakan-dokter', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.Rawat_Jalan = outpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Jalan', updateDocument.newDocument.Rawat_Jalan);
            ElasticLoggerService().createLog(req, '/rawat-jalan/persetujuan-tindakan-dokter', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-jalan/persetujuan-tindakan-dokter', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-jalan/persetujuan-tindakan-dokter', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-jalan/persetujuan-tindakan-dokter', `${err}`);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  })

Outpatient.route('/rawat-jalan/inform-consent')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Rawat_Jalan']
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Jalan');
      if (checkObject !== null && checkObject.includes('Persetujuan_Tindakan_Dokter')) {
        emrKeys.push('Rawat_Jalan.Persetujuan_Tindakan_Dokter');
      }
      if (checkObject !== null && checkObject.includes('Pemberian_Informasi')) {
        emrKeys.push('Rawat_Jalan.Pemberian_Informasi');
      }

      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const doctorsConsent: IPersetujuanTindakanDokter = result['Rawat_Jalan.Persetujuan_Tindakan_Dokter'] ? result['Rawat_Jalan.Persetujuan_Tindakan_Dokter'] : {};
        const informationProvision: IPemberianInformasi = result['Rawat_Jalan.Pemberian_Informasi'] ? result['Rawat_Jalan.Pemberian_Informasi'] : {};
        const rawatJalan = result['Rawat_Jalan'] ? result['Rawat_Jalan'] : {};

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
          rawat_jalan: rawatJalan,
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

Outpatient.route('/rawat-jalan/inform-consent-process')
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

          const outpatient: IRawatJalan = {
            Pemberian_Informasi: informationProvisionData,
            Persetujuan_Tindakan_Dokter: doctorsConsentData,
          };

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Jalan && newEmrData.Rawat_Jalan !== null) {
            newEmrData.Rawat_Jalan.Pemberian_Informasi = informationProvisionData;
            newEmrData.Rawat_Jalan.Persetujuan_Tindakan_Dokter = doctorsConsentData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Jalan.Pemberian_Informasi',
              updateDocument.newDocument.Rawat_Jalan.Pemberian_Informasi,
            );
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Jalan.Persetujuan_Tindakan_Dokter',
              updateDocument.newDocument.Rawat_Jalan.Persetujuan_Tindakan_Dokter,
            )
            ElasticLoggerService().createLog(req, '/rawat-jalan/formulir-persetujuan-tindakan-kedokteran', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                data: {
                  information_provision: updateDocument.newDocument.Rawat_Jalan.Pemberian_Informasi ?? {},
                  doctors_consent: updateDocument.newDocument.Rawat_Jalan.Persetujuan_Tindakan_Dokter ?? {},
                },
              })
            }
          } else {
            newEmrData.Rawat_Jalan = outpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Jalan', updateDocument.newDocument.Rawat_Jalan);
            ElasticLoggerService().createLog(req, '/rawat-jalan/formulir-persetujuan-tindakan-kedokteran', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                data: {
                  information_provision: updateDocument.newDocument.Rawat_Jalan.Pemberian_Informasi ?? {},
                  doctors_consent: updateDocument.newDocument.Rawat_Jalan.Persetujuan_Tindakan_Dokter ?? {},
                },
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-jalan/formulir-persetujuan-tindakan-kedokteran', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-jalan/formulir-persetujuan-tindakan-kedokteran', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-jalan/formulir-persetujuan-tindakan-kedokteran', `${err}`);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  })

Outpatient.route('/rawat-jalan/catatan-keperawatan-pra-operasi-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'No_MR'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Jalan');
      const checkOK = await global.medicalRecord.keys(req.emrID, '.OK');
      if (checkObject !== null && checkObject.includes("Catatan_Keperawatan_Pra_Operasi")) {
        emrKeys.push("Rawat_Jalan.Catatan_Keperawatan_Pra_Operasi");
      }
      if (checkOK !== null && checkOK.includes("Catatan_Keperawatan_Pra_Operasi")) {
        emrKeys.push("OK.Catatan_Keperawatan_Pra_Operasi");
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form: IRajalCatatanKeperawatanPraOp = (result['Rawat_Jalan.Catatan_Keperawatan_Pra_Operasi']) ? result['Rawat_Jalan.Catatan_Keperawatan_Pra_Operasi'] : {};
        const ok = result['OK.Catatan_Keperawatan_Pra_Operasi'] ?? {};
        const cppt = await getCpptNurseData(req.emrID, 'RawatJalan');
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
  })

Outpatient.route('/rawat-jalan/catatan-keperawatan-pra-operasi-process')
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

          const outpatient: IRawatJalan = {
            Catatan_Keperawatan_Pra_Operasi: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Jalan && newEmrData.Rawat_Jalan !== null) {
            newEmrData.Rawat_Jalan.Catatan_Keperawatan_Pra_Operasi = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Jalan.Catatan_Keperawatan_Pra_Operasi',
              updateDocument.newDocument.Rawat_Jalan.Catatan_Keperawatan_Pra_Operasi,
            );
            ElasticLoggerService().createLog(req, '/rawat-jalan/catatan-keperawatan-pra-operasi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.Rawat_Jalan = outpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Jalan', updateDocument.newDocument.Rawat_Jalan);
            ElasticLoggerService().createLog(req, '/rawat-jalan/catatan-keperawatan-pra-operasi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-jalan/catatan-keperawatan-pra-operasi', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-jalan/catatan-keperawatan-pra-operasi', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-jalan/catatan-keperawatan-pra-operasi', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  })

Outpatient.route('/rawat-jalan/checklist-pra-operasi-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'No_MR'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Jalan');
      if (checkObject !== null && checkObject.includes("Checklist_Pra_Operasi")) {
        emrKeys.push("Rawat_Jalan.Checklist_Pra_Operasi");
      }
      if (checkObject !== null && checkObject.includes("Catatan_Keperawatan_Pra_Operasi")) {
        emrKeys.push("Rawat_Jalan.Catatan_Keperawatan_Pra_Operasi");
      }
      const checkUgd = await global.medicalRecord.keys(req.emrID, '.UGD');
      if (checkUgd !== null && checkUgd.includes('Assesmen')) {
        emrKeys.push('UGD.Assesmen');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form: IChecklistPraOperasi = (result['Rawat_Jalan.Checklist_Pra_Operasi']) ? result['Rawat_Jalan.Checklist_Pra_Operasi'] : {};
        const vitalSign = result['Rawat_Jalan.Catatan_Keperawatan_Pra_Operasi'] ?? {};
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
  })

Outpatient.route('/rawat-jalan/checklist-pra-operasi-process')
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

          const outpatient: IRawatJalan = {
            Checklist_Pra_Operasi: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Jalan && newEmrData.Rawat_Jalan !== null) {
            newEmrData.Rawat_Jalan.Checklist_Pra_Operasi = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Jalan.Checklist_Pra_Operasi',
              updateDocument.newDocument.Rawat_Jalan.Checklist_Pra_Operasi,
            );
            ElasticLoggerService().createLog(req, '/rawat-jalan/checklist-pra-operasi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.Rawat_Jalan = outpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Jalan', updateDocument.newDocument.Rawat_Jalan);
            ElasticLoggerService().createLog(req, '/rawat-jalan/checklist-pra-operasi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-jalan/checklist-pra-operasi', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-jalan/checklist-pra-operasi', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-jalan/checklist-pra-operasi', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  })

Outpatient.route('/rawat-jalan/penandaan-area-pembedahan-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'No_MR', 'Rawat_Jalan', 'Rawat_Inap'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Jalan');
      if (checkObject !== null && checkObject.includes("Penandaan_Area_Pembedahan")) {
        emrKeys.push("Rawat_Jalan.Penandaan_Area_Pembedahan");
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form: IPenandaanAreaPembedahan = (result['Rawat_Jalan.Penandaan_Area_Pembedahan']) ? result['Rawat_Jalan.Penandaan_Area_Pembedahan'] : {};
        const outpatient = (result['Rawat_Jalan']) ? result['Rawat_Jalan'] : {};
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
          rawat_jalan: outpatient,
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
  })

Outpatient.route('/rawat-jalan/penandaan-area-pembedahan-process')
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

          const outpatient: IRawatJalan = {
            Penandaan_Area_Pembedahan: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Jalan && newEmrData.Rawat_Jalan !== null) {
            newEmrData.Rawat_Jalan.Penandaan_Area_Pembedahan = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Jalan.Penandaan_Area_Pembedahan',
              updateDocument.newDocument.Rawat_Jalan.Penandaan_Area_Pembedahan,
            );
            ElasticLoggerService().createLog(req, '/rawat-jalan/penandaan-area-pembedahan', 'OK');
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
                  form: updateDocument.newDocument.Rawat_Jalan.Penandaan_Area_Pembedahan ?? {},
                },
              })
            }
          } else {
            newEmrData.Rawat_Jalan = outpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Jalan', updateDocument.newDocument.Rawat_Jalan);
            ElasticLoggerService().createLog(req, '/rawat-jalan/penandaan-area-pembedahan', 'OK');
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
                  form: updateDocument.newDocument.Rawat_Jalan.Penandaan_Area_Pembedahan ?? {},
                },
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-jalan/penandaan-area-pembedahan', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-jalan/penandaan-area-pembedahan', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-jalan/penandaan-area-pembedahan', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  })

Outpatient.route('/rawat-jalan/serah-terima-pasien-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'No_MR'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Rawat_Jalan');
      if (checkObject !== null && checkObject.includes("Serah_Terima_Pasien")) {
        emrKeys.push("Rawat_Jalan.Serah_Terima_Pasien");
      }
      if (checkObject !== null && checkObject.includes("Catatan_Keperawatan_Pra_Operasi")) {
        emrKeys.push("Rawat_Jalan.Catatan_Keperawatan_Pra_Operasi");
      }
      const checkUgd = await global.medicalRecord.keys(req.emrID, '.UGD');
      if (checkUgd !== null && checkUgd.includes('Assesmen')) {
        emrKeys.push('UGD.Assesmen');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form: ISerahTerimaPasien = (result['Rawat_Jalan.Serah_Terima_Pasien']) ? result['Rawat_Jalan.Serah_Terima_Pasien'] : {};
        const vitalSign = result['Rawat_Jalan.Catatan_Keperawatan_Pra_Operasi'] ?? {};
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

Outpatient.route('/rawat-jalan/serah-terima-pasien-process')
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

          const outpatient: IRawatJalan = {
            Serah_Terima_Pasien: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Rawat_Jalan && newEmrData.Rawat_Jalan !== null) {
            newEmrData.Rawat_Jalan.Serah_Terima_Pasien = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Rawat_Jalan.Serah_Terima_Pasien',
              updateDocument.newDocument.Rawat_Jalan.Serah_Terima_Pasien,
            );
            ElasticLoggerService().createLog(req, '/rawat-jalan/serah-terima-pasien', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.Rawat_Jalan = outpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Rawat_Jalan', updateDocument.newDocument.Rawat_Jalan);
            ElasticLoggerService().createLog(req, '/rawat-jalan/serah-terima-pasien', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/rawat-jalan/serah-terima-pasien', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/rawat-jalan/serah-terima-pasien', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-jalan/serah-terima-pasien', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

Outpatient.route('/rawat-jalan/resume-medis-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'No_MR'];
    try {
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const queryPatient = `\'@Kode_Cabang:${req.emrParams.Kode_Cabang} @No_MR:${req.emrParams.No_MR}\'`;
        const patientData = await global.medicalRecord.find(queryPatient, {
          SORTBY: { BY: "SORTBY_Tanggal_Masuk", DIRECTION: "DESC" },
          LIMIT: { from: 0, size: 10000 },
          RETURN: ["$.Kode_Cabang", "$.No_MR", "$.No_SEP", "$.Tanggal_Masuk", "$.Jam_Masuk", "$.Rawat_Jalan.Penanganan", "$.Rawat_Jalan.Nama_Dokter"],
        });
        const recordsPatient = []
        for (let i = 0; i < patientData.total; i += 1) {
          if (patientData.documents[i].value["$.Rawat_Jalan.Penanganan"] === '1.') {
            const emrKeysOut = ['No_MR'];
            const checkObject = await global.medicalRecord.keys(patientData.documents[i].id, '.Rawat_Jalan');
            if (checkObject !== null && checkObject.includes("Penandaan_Area_Pembedahan")) {
              emrKeysOut.push("Rawat_Jalan.Penandaan_Area_Pembedahan");
            }
            const resultPerId = await global.medicalRecord.get(patientData.documents[i].id, emrKeysOut);
            const areaMarking: IPenandaanAreaPembedahan = (resultPerId['Rawat_Jalan.Penandaan_Area_Pembedahan']) ? resultPerId['Rawat_Jalan.Penandaan_Area_Pembedahan'] : {};
            recordsPatient.push({
              EMR_ID: patientData.documents[i].id,
              Tgl_Berobat: moment.unix(parseInt(patientData.documents[i].value["$.Tanggal_Masuk"])).format("YYYY-MM-DD") ?? '',
              Nama_Dokter: patientData.documents[i].value["$.Rawat_Jalan.Nama_Dokter"] ?? '',
              Nama_Paket_Operasi: areaMarking.Prosedur_Operasi ?? '',
            });
          }
        }
        const searchQuery = `\'@Kode_Cabang:${result.Kode_Cabang} @No_MR:${result.No_MR}\'`;
        const cpptData = await global.medicalRecord.find(searchQuery, {
          LIMIT: { from: 0, size: 10000 },
          RETURN: ["$.Kode_Cabang", "$.No_MR", "$.Common.CPPT", "$.Jenis_Pelayanan"],
        });

        const records = [];
        for (let i = 0; i < cpptData.documents.length; i += 1) {
          if (cpptData.documents[i].value["$.Common.CPPT"]) {
            const cppts = JSON.parse(cpptData.documents[i].value["$.Common.CPPT"]);
            const arrCppt = cppts && Array.isArray(cppts) ? cppts : [];
            for (let j = 0; j < arrCppt.length; j += 1) {
              if (arrCppt[j].Unit === 'RawatJalan' && arrCppt[j].Is_Form_Dokter) {
                records.push({
                  Tanggal: arrCppt[j].Waktu ?? '',
                  Nama_Dokter: arrCppt[j].Nama_Dokter_Pengkaji ?? '',
                  Diagnosa: arrCppt[j].Data_A ?? '',
                  Terapi: arrCppt[j].Data_P ?? '',
                  Anjuran: arrCppt[j].Anjuran ?? '',
                  Resep: arrCppt[j].Resep ?? [],
                })
              }
            }
          }
        }

        if (!res.writableEnded) {
          res.status(200).json({
            message: 'OK',
            data: {
              encounters: recordsPatient,
              records,
            },
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

Outpatient.route('/rawat-jalan/resume-medis-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const dataToPost = UpdateResumeMedisPdf.createFromJson(req.body);
      const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tanggal_Masuk', 'Tipe_Pasien'];
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const data = {
          nomor_mr: result.No_MR ?? '',
          'pasien.Nama': dataToPost['pasien.Nama'] ?? '',
          'pasien.Tgl_Lahir': dataToPost['pasien.Tgl_Lahir'] ?? '',
          'pasien.Umur': dataToPost['pasien.Umur'] ?? '',
          'pasien.Jenis_Kelamin': dataToPost['pasien.Jenis_Kelamin'] ?? '',
          up: dataToPost.up ?? [],
          down: dataToPost.down ?? [],
          nik: dataToPost.nik ?? '',
        }

        const pdfx = await global.storage.convertDocToPdf2(
          result.Kode_Cabang,
          'rawat-jalan_resume-medis',
          req.emrID,
          '',
          data,
        );
        if (pdfx && pdfx !== null) {
          const branchTimezone = await global.medicalRecord.getConfigValue(result.Kode_Cabang, "timezone");
          const resultPDF = await global.storage.uploadFromMemory(`pdfs/${result.Kode_Cabang}/${result.Jenis_Pelayanan}/${moment.unix(result.Tanggal_Masuk).format("YYYY")}/${moment.unix(result.Tanggal_Masuk).format("MM")}/${result.Tipe_Pasien}/${result.No_MR}/${result.ID_Pelayanan}/rawat-jalan_resume-medis_${moment().utcOffset(branchTimezone).format("YYYYMMDDHHmmss")}.pdf`, pdfx);

          // Save PDF URL
          const url = encodeURI(`https://${resultPDF.bucket}/${resultPDF.name}?generation=${resultPDF.generation}`);
          const pdf: IPDF = {
            Version: await global.medicalRecord.getPDFLastVersion(req.emrID, req.body.form_name),
            URL: url,
            Form_Name: 'rawat-jalan_resume-medis',
            Visit_Date: moment.unix(result.Tanggal_Masuk).format("YYYY-MM-DD"),
            Created_At: moment().utcOffset(branchTimezone).format("YYYY-MM-DD HH:mm:ss"),
            Created_By: req.userId,
            Created_By_Name: req.userProfile.nama,
          };
          await global.medicalRecord.addPDF(req.emrID, pdf);
          const signUrl = url && url !== "" && isValidFile(url) ? await global.storage.signUrl(url, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : undefined;

          ElasticLoggerService().createLog(req, 'rawat-jalan/resume-medis', 'OK');
          if (!res.writableEnded) {
            res.status(200).json({
              message: 'OK',
              data: {
                url,
                signUrl,
              },
            });
          }
        } else {
          ElasticLoggerService().createErrorLog(req, 'rawat-jalan/resume-medis', 'Failed to generate PDF');
          if (!res.writableEnded) {
            res.status(500).json({
              message: 'Failed to generate PDF',
            })
          }
        }
      } else {
        ElasticLoggerService().createErrorLog(req, 'rawat-jalan/resume-medis', 'No Data');
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'No Data',
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, 'rawat-jalan/resume-medis', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        })
      }
    }
  });

export { Outpatient }
