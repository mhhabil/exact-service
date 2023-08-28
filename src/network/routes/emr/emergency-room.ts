import { Router, Request, Response, NextFunction } from "express";
import RBAC from "../../../services/rbac";
import moment from "moment";
const jp = require("jsonpath");
import * as jsonpatch from "fast-json-patch";
import { ElasticLoggerService } from "./services";
import { isValidFile } from "./helpers/app.helper";
import { Assesmen, IAssesmen, IUpdateBPRJUGD } from "./interfaces/emergency-room/emergency-room.request";
import { IHowToUse, IMedicine } from "./interfaces/outpatient/outpatient.model";
import { breathHelp, breathWay, circulation, conciusness, functionPreliminary, informationOrigin, respiratory, resusitasiCirculation, secondaryTriase } from "./interfaces/emergency-room/emergency-room.vars";
import { IPostMedsToSimrs, PostDaftarObat } from "./interfaces/outpatient/outpatient.request";
import { BPRJModel } from "./interfaces/emergency-room/emergency-room.model";
const UGD = Router();

UGD.route('/ugd/formulir-triase-form')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.UGD');
      if (checkObject !== null && checkObject.includes('Formulir_Triase')) {
        emrKeys.push('UGD.Formulir_Triase');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form: IFormFormulirTriase = result['UGD.Formulir_Triase'] ? result['UGD.Formulir_Triase'] : {}

        if (form.TTD_Perawat && form.TTD_Perawat !== '' && isValidFile(form.TTD_Perawat)) {
          form.TTD_Perawat = await global.storage.signUrl(form.TTD_Perawat, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
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

UGD.route('/ugd/formulir-triase-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.');
        if (emrData && emrData !== null) {
          const dataToPost: any = req.body;
          const nurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_perawat}')]`)

          const redisJsonData: any = {
            Waktu_Kedatangan: dataToPost['waktu-kedatangan'] ?? '',
            Cara_Datang: dataToPost['cara-datang'] ?? '',
            Jenis_Kasus_Trauma: dataToPost['jenis-kasus-trauma'] ?? '',
            Jenis_Kasus_Kecelakaan: dataToPost['jenis-kasus-kecelakaan'] ?? '',
            Kesadaran_Kategori: dataToPost['kesadaran-kategori'] ?? '',
            Jalan_Nafas_Kategori: dataToPost['jalan-nafas-kategori'] ?? '',
            Pernafasan_Kategori: dataToPost['pernafasan-kategori'] ?? '',
            Sirkulasi_Kategori: dataToPost['sirkulasi-kategori'] ?? '',
            Tanda_Lain_Kategori: dataToPost['tanda-lain-kategori'] ?? '',
            Respon_Time: dataToPost['respon-time'] ?? '',
            Jenis_Emergency: dataToPost['jenis-emergency'] ?? '',
            Warna_Triase: dataToPost['warna-triase'] ?? '',
            ID_Perawat: dataToPost.id_perawat ?? '',
            TTD_Perawat: dataToPost.ttd_perawat && dataToPost.ttd_perawat !== '' && isValidFile(dataToPost.ttd_perawat) ? global.storage.cleanUrl(dataToPost.ttd_perawat) : '',
            Nama_Perawat: nurse && Array.isArray(nurse) && nurse.length > 0 && nurse[0] ? nurse[0].Nama : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const kesadaran1 = [
            'Kesadaran_1_GCS_9',
            'Kesadaran_1_Kejang',
            'Kesadaran_1_Tidak_Ada_Respon',
          ];

          const jalanNafas1 = ['Jalan_Nafas_1_Sumbatan'];

          const pernafasan1 = [
            'Pernafasan_1_Hipoventilasi',
            'Pernafasan_1_Bradipnoe',
            'Pernafasan_1_Sianosis',
          ];

          const sirkulasi1 = [
            'Sirkulasi_1_Henti_Jantung',
            'Sirkulasi_1_Nadi_Tidak_Teraba',
            'Sirkulasi_1_Akral_Dingin',
          ];


          const tandaLain1 = ['Tanda_Lain_1_Threatening'];

          const kesadaran2 = [
            'Kesadaran_2_GCS_9_12',
            'Kesadaran_2_Hemiparesis',
            'Kesadaran_2_Gelisah',
            'Kesadaran_2_Nyeri_Dada',
          ];

          const jalanNafas2 = [
            'Jalan_Nafas_2_Bebas',
            'Jalan_Nafas_2_Ancaman',
          ];

          const pernafasan2 = [
            'Pernafasan_2_Takipnoe',
            'Pernafasan_2_Mengi',
          ];

          const sirkulasi2 = [
            'Sirkulasi_2_Nadi_Teraba_Lemah',
            'Sirkulasi_2_Bradikardi',
            'Sirkulasi_2_Takikardi',
            'Sirkulasi_2_Pucat',
            'Sirkulasi_2_Akral_Dingin',
            'Sirkulasi_2_CRT_2_Detik',
          ];

          const tandaLain2 = [
            'Tanda_Lain_2_Trauma_Tembus',
            'Tanda_Lain_2_Trauma_Kimia',
            'Tanda_Lain_2_Penurunan_Visus',
            'Tanda_Lain_2_Nyeri_Mendadak',
          ];

          const kesadaran3 = [
            'Kesadaran_3_GCS_12_15',
            'Kesadaran_3_Apatis',
            'Kesadaran_3_Samnolen',
            'Kesadaran_3_Bebas',
          ];

          const jalanNafas3 = ['Jalan_Nafas_3_Bebas'];

          const pernafasan3 = [
            'Pernafasan_3_Normal',
            'Pernafasan_3_Mengi',
            'Pernafasan_3_Sesak',
          ];

          const sirkulasi3 = [
            'Sirkulasi_3_Nadi_Kuat',
            'Sirkulasi_3_Takikardia',
            'Sirkulasi_3_TDS_160',
            'Sirkulasi_3_TDD_100',
          ];

          const tandaLain3 = [
            'Tanda_Lain_3_Visus_Abnormal',
            'Tanda_Lain_3_Nyeri_Sedang',
          ];

          const kesadaran4 = ['Kesadaran_4_GCS_15'];

          const jalanNafas4 = ['Jalan_Nafas_4_Bebas'];

          const pernafasan4 = ['Pernafasan_4_Normal'];

          const sirkulasi4 = [
            'Sirkulasi_4_Nadi_Kuat',
            'Sirkulasi_4_Nadi_Normal',
            'Sirkulasi_4_TDS_100_120',
            'Sirkulasi_4_TDD_70_90',
          ];

          const tandaLain4 = [
            'Tanda_Lain_4_Visus_Normal',
            'Tanda_Lain_4_Nyeri_Mata',
          ];

          const kesadaran5 = ['Kesadaran_5_GCS_15'];

          const jalanNafas5 = ['Jalan_Nafas_5_Bebas'];

          const pernafasan5 = ['Pernafasan_5_Normal'];

          const sirkulasi5 = [
            'Sirkulasi_5_Nadi_Kuat',
            'Sirkulasi_5_Nadi_Normal',
            'Sirkulasi_5_TDS_100_120',
            'Sirkulasi_5_TDD_70_90',
          ];

          const tandaLain5 = [
            'Tanda_Lain_5_Visus_Normal',
            'Tanda_Lain_5_Tidak_Ada_Nyeri',
          ];

          const kesadaran6 = [
            'Kesadaran_6_GCS_0',
            'Kesadaran_6_Tanda_Kehidupan',
          ];

          const jalanNafas6 = ['Jalan_Nafas_6_Tidak_Ada'];

          const pernafasan6 = ['Pernafasan_6_Minus'];

          const sirkulasi6 = [
            'Sirkulasi_6_Nadi_Minus',
            'Sirkulasi_6_Frekuensi_Nadi_Minus',
            'Sirkulasi_6_TDS_Minus',
          ];

          const tandaLain6 = ['Tanda_Lain_6_Visus_Minus'];

          for (const item of kesadaran1) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['kesadaran-kategori'] === '1' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of jalanNafas1) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['jalan-nafas-kategori'] === '1' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of pernafasan1) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['pernafasan-kategori'] === '1' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of sirkulasi1) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['sirkulasi-kategori'] === '1' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of tandaLain1) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['tanda-lain-kategori'] === '1' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of kesadaran2) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['kesadaran-kategori'] === '2' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of jalanNafas2) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['jalan-nafas-kategori'] === '2' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of pernafasan2) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['pernafasan-kategori'] === '2' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of sirkulasi2) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['sirkulasi-kategori'] === '2' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of tandaLain2) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['tanda-lain-kategori'] === '2' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of kesadaran3) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['kesadaran-kategori'] === '3' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of jalanNafas3) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['jalan-nafas-kategori'] === '3' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of pernafasan3) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['pernafasan-kategori'] === '3' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of sirkulasi3) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['sirkulasi-kategori'] === '3' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of tandaLain3) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['tanda-lain-kategori'] === '3' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of kesadaran4) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['kesadaran-kategori'] === '4' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of jalanNafas4) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['jalan-nafas-kategori'] === '4' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of pernafasan4) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['pernafasan-kategori'] === '4' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of sirkulasi4) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['sirkulasi-kategori'] === '4' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of tandaLain4) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['tanda-lain-kategori'] === '4' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of kesadaran5) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['kesadaran-kategori'] === '5' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of jalanNafas5) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['jalan-nafas-kategori'] === '5' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of pernafasan5) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['pernafasan-kategori'] === '5' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of sirkulasi5) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['sirkulasi-kategori'] === '5' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of tandaLain5) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['tanda-lain-kategori'] === '5' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of kesadaran6) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['kesadaran-kategori'] === '6' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of jalanNafas6) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['jalan-nafas-kategori'] === '6' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of pernafasan6) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['pernafasan-kategori'] === '6' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of sirkulasi6) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['sirkulasi-kategori'] === '6' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          for (const item of tandaLain6) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost['tanda-lain-kategori'] === '6' && dataToPost[dashedItem] === '1' ? 1 : 0;
          }

          const ugd: IEmergencyRoom = {
            Formulir_Triase: redisJsonData,
          };

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData));
          if (newEmrData.UGD && newEmrData.UGD !== null) {
            newEmrData.UGD.Formulir_Triase = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.UGD.Formulir_Triase',
              updateDocument.newDocument.UGD.Formulir_Triase,
            );
            ElasticLoggerService().createLog(req, '/ugd/formulir-triase', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.UGD = ugd;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.UGD', updateDocument.newDocument.UGD);
            ElasticLoggerService().createLog(req, '/ugd/formulir-triase', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/ugd/formulir-triase', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/ugd/formulir-triase', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/ugd/formulir-triase', `${err}`);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

UGD.route('/ugd/assesmen-form')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Wali', 'Tipe_Pasien'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.UGD');
      const checkPharm = await global.medicalRecord.keys(req.emrID, '.Farmasi');
      if (checkObject !== null && checkObject.includes('Formulir_Triase')) {
        emrKeys.push('UGD.Formulir_Triase')
      }
      if (checkObject !== null && checkObject.includes('Assesmen')) {
        emrKeys.push('UGD.Assesmen');
      }
      if (checkPharm !== null && checkPharm.includes('Tebus_Obat')) {
        emrKeys.push('Farmasi.Tebus_Obat');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      const config = await global.medicalRecord.get(`Config:{${result.Kode_Cabang}}`);
      if (result && result !== null) {
        const form: IFormAssesmenUGD = result['UGD.Assesmen'] ? result['UGD.Assesmen'] : {};
        const formTriase: IFormFormulirTriase = result['UGD.Formulir_Triase'] ? result['UGD.Formulir_Triase'] : {};
        const farmasi = result['Farmasi.Tebus_Obat'] ? result['Farmasi.Tebus_Obat'] : {};
        const meds = await global.medicalRecord.get(`Obat:{${result.Kode_Cabang}}:${result.Tipe_Pasien}`);
        const htu = await global.medicalRecord.get(`AturanPakai:{${result.Kode_Cabang}}`);

        if (!form.Triase_Sekunder || (form.Triase_Sekunder && form.Triase_Sekunder === '')) {
          form.Triase_Sekunder = formTriase.Warna_Triase ?? '';
        }

        if (form.TTD_Perawat && form.TTD_Perawat !== '' && isValidFile(form.TTD_Perawat)) {
          form.TTD_Perawat = await global.storage.signUrl(form.TTD_Perawat, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (form.Gambar_Mata_OD && form.Gambar_Mata_OD !== '' && isValidFile(form.Gambar_Mata_OD)) {
          form.Gambar_Mata_OD = await global.storage.signUrl(form.Gambar_Mata_OD, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (form.Gambar_Mata_OS && form.Gambar_Mata_OS !== '' && isValidFile(form.Gambar_Mata_OS)) {
          form.Gambar_Mata_OS = await global.storage.signUrl(form.Gambar_Mata_OS, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (form.TTD_Dokter_Mata && form.TTD_Dokter_Mata !== '' && isValidFile(form.TTD_Dokter_Mata)) {
          form.TTD_Dokter_Mata = await global.storage.signUrl(form.TTD_Dokter_Mata, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (form.TTD_Dokter_Pengkaji && form.TTD_Dokter_Pengkaji !== '' && isValidFile(form.TTD_Dokter_Pengkaji)) {
          form.TTD_Dokter_Pengkaji = await global.storage.signUrl(form.TTD_Dokter_Pengkaji, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }

        const data = {
          EMR_ID: req.emrID ? req.emrID : '',
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          isDefault: config && config !== null ? config.dpad : false,
          form,
          farmasi,
          obat: meds ?? [],
          aturan_pakai: htu ?? [],
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

UGD.route('/ugd/assesmen-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.');
        if (emrData && emrData !== null) {
          const dataToPost: any = req.body;
          const meds = await global.medicalRecord.get(`Obat:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`);
          const htu = await global.medicalRecord.get(`AturanPakai:{${emrData.Kode_Cabang}}`);

          //Resep Dokter Spesialis
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

          const postDaftarObat: any = [];

          for (const item of prescriptions) {
            const obat = PostDaftarObat.createFromPrescription(item);
            postDaftarObat.push(obat);
          }

          //Resep Dokter UMUM
          const generalPrescriptions: Array<IPrescription> | Array<any> = [];

          for (let i = 0; i < (dataToPost['nama-obat-umum'] ? dataToPost['nama-obat-umum'] : []).length; i += 1) {
            const medsCode = dataToPost['nama-obat-umum'][i] ? dataToPost['nama-obat-umum'][i] : ''
            const total = dataToPost['jumlah-umum'][i] ? dataToPost['jumlah-umum'][i] : '';
            const note = dataToPost['catatan-umum'][i] ? dataToPost['catatan-umum'][i] : '';
            const howToUse = dataToPost['aturan-pakai-umum'][i] ? dataToPost['aturan-pakai-umum'][i] : '';

            const selectedMeds = meds && Array.isArray(meds) && meds.find((med: IMedicine) => med.Kode_Inventory.toString() === medsCode.toString());

            const selectedHtu = htu && Array.isArray(htu) && htu.find((howTo: IHowToUse) => howTo.ID_AturanPakai === parseInt(howToUse));

            if (selectedMeds && selectedHtu) {
              generalPrescriptions.push({
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

          const postDaftarObatUmum: any = [];

          for (const item of prescriptions) {
            const obat = PostDaftarObat.createFromPrescription(item);
            postDaftarObatUmum.push(obat);
          }

          const triaseSekunder = secondaryTriase.find((val: any) => val.id === dataToPost["triase-radio"]);
          const kesadaran = conciusness.find((val: any) => val.id === dataToPost["kesadaran-radio"]);
          const pernafasan = respiratory.find((val: any) => val.id === dataToPost["pernafasan-radio"]);
          const sirkulasi = circulation.find((val: any) => val.id === dataToPost["sirkulasi-radio"]);
          const jalanNafas = breathWay.find((val: any) => val.id === dataToPost["jalanNafas-radio"]);
          const bantuanNafas = breathHelp.find((val: any) => val.id === dataToPost["bantuanNafas-radio"]);
          const sirkulasiResusitasi = resusitasiCirculation.find((val: any) => val.id === dataToPost["sirkulasiResusitasi-radio"]);
          const asalInformasi = informationOrigin.find((val: any) => val.id === dataToPost["asal-informasi-radio"]);
          const pengkajianFungsi = functionPreliminary.find((val: any) => val.id === dataToPost["pengkajian-fungsi-radio"]);

          const doctorPreliminary = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost['pengkajian-dokter']}')]`)
          const eyeDoctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost['dokter-mata-dokter']}')]`)
          const jsonData = Assesmen.createFromJson(dataToPost);
          const nurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_perawat}')]`)
          const redisJsonData: any = {
            ...jsonData,
            Triase_Sekunder: triaseSekunder && triaseSekunder.name ? triaseSekunder.name : '',
            Kesadaran_Teks: kesadaran && kesadaran.name ? kesadaran.name : '',
            Pernafasan_Teks: pernafasan && pernafasan.name ? pernafasan.name : '',
            Sirkulasi_Teks: sirkulasi && sirkulasi.name ? sirkulasi.name : '',
            Jalan_Nafas_Teks: jalanNafas && jalanNafas.name ? jalanNafas.name : '',
            Bantuan_Nafas_Teks: bantuanNafas && bantuanNafas.name ? bantuanNafas.name : '',
            Sirkulasi_Resusitasi_Teks: sirkulasiResusitasi && sirkulasiResusitasi.name ? sirkulasiResusitasi.name : '',
            Asal_Informasi_Teks: asalInformasi && asalInformasi.name ? asalInformasi.name : '',
            Pengkajian_Fungsi_Teks: pengkajianFungsi && pengkajianFungsi.name ? pengkajianFungsi.name : '',
            Resep: prescriptions ?? [],
            Resep_Umum: generalPrescriptions ?? [],
            ID_Perawat: dataToPost.id_perawat ?? '',
            TTD_Perawat: dataToPost.ttd_perawat && dataToPost.ttd_perawat !== '' && isValidFile(dataToPost.ttd_perawat) ? global.storage.cleanUrl(dataToPost.ttd_perawat) : '',
            Nama_Perawat: nurse && Array.isArray(nurse) && nurse.length > 0 && nurse[0] ? nurse[0].Nama : '',
            Nama_Pengkajian_Dokter: (doctorPreliminary && Array.isArray(doctorPreliminary) && doctorPreliminary.length > 0 && doctorPreliminary[0].Nama) ? doctorPreliminary[0].Nama : '',
            Nama_Dokter_Mata_Dokter: (eyeDoctor && Array.isArray(eyeDoctor) && eyeDoctor.length > 0 && eyeDoctor[0].Nama) ? eyeDoctor[0].Nama : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const paramsToSimrs: IPostMedsToSimrs = {
            company_code: req.body.kode_cabang,
            tipe_pelayanan: req.body.tipe_pasien,
            no_berobat: req.body.id_pelayanan,
            tgl_resep: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            id_dokter: req.body.id_dokter,
            keterangan: '',
            no_resep: '',
            emr: '1',
            berat_badan: redisJsonData.Nutrisi_Berat ? redisJsonData.Nutrisi_Berat : '0',
            alergi: 'To Be Defined',
            daftar_obat: postDaftarObat,
          }

          const paramsToSimrsUmum: IPostMedsToSimrs = {
            company_code: req.body.kode_cabang,
            tipe_pelayanan: req.body.tipe_pasien,
            no_berobat: req.body.id_pelayanan,
            tgl_resep: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            id_dokter: req.body.id_dokter,
            keterangan: '',
            no_resep: '',
            emr: '1',
            berat_badan: redisJsonData.Nutrisi_Berat ? redisJsonData.Nutrisi_Berat : '0',
            alergi: 'To Be Defined',
            daftar_obat: postDaftarObatUmum,
          }

          const result = await global.messagingService.sendMessage(emrData.Kode_Cabang, '/farmasi/resep_obat/tambah_emr', { ...paramsToSimrs, token: req.token });
          const sendPrescription = result && result.body ? result.body : {};
          ElasticLoggerService().createLog(result ? { body: paramsToSimrs } : {}, '/messaging/farmasi', result?.body ?? {});

          const resultUmum = await global.messagingService.sendMessage(emrData.Kode_Cabang, '/farmasi/resep_obat/tambah_emr', { ...paramsToSimrsUmum, token: req.token });
          const sendPrescriptionUmum = resultUmum && resultUmum.body ? resultUmum.body : {};
          ElasticLoggerService().createLog(resultUmum ? { body: paramsToSimrsUmum } : {}, '/messaging/farmasi', resultUmum?.body ?? {});

          for (let i = 0; i < 8; i += 1) {
            redisJsonData[`Keperawatan_Diagnosa_${i}`] = dataToPost[`keperawatan-diagnosa-${i}`] && dataToPost[`keperawatan-diagnosa-${i}`] === '1' ? 1 : 0;
            redisJsonData[`Keperawatan_Rencana_${i}`] = dataToPost[`keperawatan-rencana-${i}`] && dataToPost[`keperawatan-rencana-${i}`] === '1' ? 1 : 0;
          }

          const pengkajians = [
            'Pengkajian_Kepala',
            'Pengkajian_Mata',
            'Pengkajian_Telinga',
            'Pengkajian_Hidung',
            'Pengkajian_Gigi',
            'Pengkajian_Tenggorokan',
            'Pengkajian_Leher',
            'Pengkajian_Dada',
            'Pengkajian_Jantung',
            'Pengkajian_Paru',
            'Pengkajian_Abdomen',
            'Pengkajian_Genitalia',
            'Pengkajian_Kandungan',
            'Pengkajian_Eks_Atas',
            'Pengkajian_Eks_Bawah',
            'Pengkajian_Pemeriksaan_Penunjang',
            'Pengkajian_Assesmen',
            'Pengkajian_Terapi_Penatalaksaan',
            'Pengkajian_Anjuran',
            'Dokter_Mata_Diagnosa',
            'Dokter_Mata_Terapi',
            'Dokter_Mata_Anjuran',
            'Dokter_Mata_Rencana_Pengobatan',
          ]

          for (const item of pengkajians) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[item] = dataToPost[dashedItem]
          }


          const pemeriksaanDokters = [
            'Dokter_Mata_Posisi',
            'Dokter_Mata_Pergerakan',
            'Dokter_Mata_Palpebra_Superior',
            'Dokter_Mata_Conj_Tarsal_Superior',
            'Dokter_Mata_Conj_Tarsal_Inferior',
            'Dokter_Mata_Conj_Bulbi',
            'Dokter_Mata_Cornea',
            'Dokter_Mata_COA',
            'Dokter_Mata_Pupil',
            'Dokter_Mata_Iris',
            'Dokter_Mata_Lensa',
            'Dokter_Mata_Vitreous',
            'Dokter_Mata_Funduscopy',
          ]

          for (const item of pemeriksaanDokters) {
            const dashedItem = item.replace(/_/g, '-').toLowerCase();
            redisJsonData[`${item}_OD`] = dataToPost[`${dashedItem}-od`];
            redisJsonData[`${item}_OS`] = dataToPost[`${dashedItem}-os`];
          }

          const ugd: IEmergencyRoom = {
            Assesmen: redisJsonData,
          }
          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.UGD && newEmrData.UGD !== null) {
            newEmrData.UGD.Assesmen = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.UGD.Assesmen',
              updateDocument.newDocument.UGD.Assesmen,
            );
            ElasticLoggerService().createLog(req, '/ugd/assesmen', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                prescription: sendPrescription,
              })
            }
          } else {
            newEmrData.UGD = ugd;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.UGD', updateDocument.newDocument.UGD);
            ElasticLoggerService().createLog(req, '/ugd/assesmen', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                prescription: sendPrescription,
              });
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/ugd/assesmen', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/ugd/assesmen', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/ugd/assesmen', `${err}`);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

UGD.route('/ugd/bukti-pelayanan-rawat-jalan-form')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien']
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.UGD');
      if (checkObject !== null && checkObject.includes('Bukti_Pelayanan')) {
        emrKeys.push('UGD.Bukti_Pelayanan');
      }

      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const meds = await global.medicalRecord.get(`Obat:{${result.Kode_Cabang}}:${result.Tipe_Pasien}`);
        const htu = await global.medicalRecord.get(`AturanPakai:{${result.Kode_Cabang}}`);
        const form = result['UGD.Bukti_Pelayanan'] ? result['UGD.Bukti_Pelayanan'] : {};

        form.TTD_Dokter = (form.TTD_Dokter && form.TTD_Dokter !== '' && isValidFile(form.TTD_Dokter)) ? await global.storage.signUrl(form.TTD_Dokter, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        form.Tanda_Tangan_Pasien = (form.Tanda_Tangan_Pasien && form.Tanda_Tangan_Pasien !== '' && isValidFile(form.Tanda_Tangan_Pasien)) ? await global.storage.signUrl(form.Tanda_Tangan_Pasien, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        form.Tanda_Tangan_Wali = (form.Tanda_Tangan_Wali && form.Tanda_Tangan_Wali !== '' && isValidFile(form.Tanda_Tangan_Wali)) ? await global.storage.signUrl(form.Tanda_Tangan_Wali, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        if (form.OD && form?.OD?.Eye_Image && form?.OD?.Eye_Image !== '' && isValidFile(form?.OD?.Eye_Image)) {
          form.OD.Eye_Image = await global.storage.signUrl(form.OD.Eye_Image, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }

        if (form.OS && form?.OS?.Eye_Image && form?.OS?.Eye_Image !== '' && isValidFile(form?.OS?.Eye_Image)) {
          form.OS.Eye_Image = await global.storage.signUrl(form.OS.Eye_Image, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
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
          obat: meds ? meds : [],
          aturan_pakai: htu ? htu : [],
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

UGD.route('/ugd/bukti-pelayanan-rawat-jalan-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdateBPRJUGD = req.body;
          const meds = await global.medicalRecord.get(`Obat:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`);
          const htu = await global.medicalRecord.get(`AturanPakai:{${emrData.Kode_Cabang}}`);

          const prescriptions: Array<IPrescription> | Array<any> = [];

          for (let i = 0; i < (req.body['nama-obat'] ? req.body['nama-obat'] : []).length; i += 1) {
            const medsCode = req.body['nama-obat'][i] ? req.body['nama-obat'][i] : '';
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
          const selectedDoctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost.doctor_id}')]`)
          const fixedData = BPRJModel.createFromJson(dataToPost);
          const redisJsonData: IBPRJUGD = {
            ...fixedData,
            Resep: prescriptions,
            Nama_Dokter: (selectedDoctor && Array.isArray(selectedDoctor) && selectedDoctor.length > 0 && selectedDoctor[0] && selectedDoctor[0].Nama) ? selectedDoctor[0].Nama : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const ugd: IEmergencyRoom = {
            Bukti_Pelayanan: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.UGD && newEmrData.UGD !== null) {
            newEmrData.UGD.Bukti_Pelayanan = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.UGD.Bukti_Pelayanan',
              updateDocument.newDocument.UGD.Bukti_Pelayanan,
            );
            const data: any = {
              EMR_ID: req.emrID,
              nomor_mr: (emrData.No_MR) ? emrData.No_MR : '',
              id_pelayanan: (emrData.ID_Pelayanan && emrData.ID_Pelayanan !== '') ? emrData.ID_Pelayanan : '',
              jenis_pelayanan: (emrData.Jenis_Pelayanan && emrData.Jenis_Pelayanan !== '') ? emrData.Jenis_Pelayanan : '',
              kode_cabang: (emrData.Kode_Cabang && emrData.Kode_Cabang !== '') ? emrData.Kode_Cabang : '',
              pasien: (emrData.Pasien) ? emrData.Pasien : {},
              tipe_pasien: (emrData.Tipe_Pasien && emrData.Tipe_Pasien !== '') ? emrData.Tipe_Pasien : '',
              form: updateDocument.newDocument.UGD.Bukti_Pelayanan,
            }
            ElasticLoggerService().createLog(req, '/ugd/bprj', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                data,
              })
            }
          } else {
            newEmrData.UGD = ugd;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.UGD', updateDocument.newDocument.UGD);
            const data: any = {
              EMR_ID: req.emrID,
              nomor_mr: (emrData.No_MR) ? emrData.No_MR : '',
              id_pelayanan: (emrData.ID_Pelayanan && emrData.ID_Pelayanan !== '') ? emrData.ID_Pelayanan : '',
              jenis_pelayanan: (emrData.Jenis_Pelayanan && emrData.Jenis_Pelayanan !== '') ? emrData.Jenis_Pelayanan : '',
              kode_cabang: (emrData.Kode_Cabang && emrData.Kode_Cabang !== '') ? emrData.Kode_Cabang : '',
              pasien: (emrData.Pasien) ? emrData.Pasien : {},
              tipe_pasien: (emrData.Tipe_Pasien && emrData.Tipe_Pasien !== '') ? emrData.Tipe_Pasien : '',
              form: updateDocument.newDocument.UGD.Bukti_Pelayanan,
            }
            ElasticLoggerService().createLog(req, '/ugd/bprj', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                data,
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/ugd/bprj', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/ugd/bprj', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/ugd/bprj', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

export { UGD };
