import moment from "moment";
import { Router, Request, Response, NextFunction } from "express";
import { CPPTRO, CPPTRawatJalan, CPPTOK, CPPTFarmasi, CPPTRawatInap, CPPTGizi, CPPTUGD } from "./interfaces/cppt.model";
import { IGetHtuRequest, IGetMedsRequest, GetHtuRequest, GetMedsRequest, PostDaftarObat, IPostMedsToSimrs, IPostDaftarObat } from "./interfaces/outpatient/outpatient.request";
import { IMedicine, IHowToUse } from "./interfaces/outpatient/outpatient.model";
import RBAC from "../../../services/rbac";
import * as jsonpatch from "fast-json-patch";
import { v4 as uuid } from "uuid";
const debugEMR = require("debug")("emr");
import { ElasticLoggerService, SimrsService } from "./services";
import { isValidFile } from "./helpers/app.helper";
const CPPT = Router();

CPPT.route("/cppt/process").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response): Promise<void> => {
  const localDebug = debugEMR.extend(req.path);
  localDebug(`Request Begin`);

  try {
    const emrKeys = ["Kode_Cabang", "No_MR", "Pasien", "Tipe_Pasien"];
    let responseMessage: string = "";
    const cpptId = req.body["ID"];
    const emrData = await global.medicalRecord.get(req.emrID, emrKeys);
    localDebug(`Get Data ${req.emrID}`);
    if (emrData && emrData !== null) {

      const isDoctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${req.userId}')]`)

      let cpptData: any = {}
      let statusTebus;
      let sendPrescription = {};

      const checkPharm = await global.medicalRecord.keys(req.emrID, '.Farmasi');
      if (checkPharm !== null && checkPharm.includes('Tebus_Obat')) {
        const farmasi = await global.medicalRecord.get(req.emrID, ['Farmasi.Tebus_Obat']);
        statusTebus = farmasi.Status_Tebus;
      }

      //CPPT RO
      if (req.body.unit && req.body.unit === 'RO') {
        const doctorPreliminary = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${req.body['id-dokter-pengkaji']}')]`)

        const cpptNurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${req.body['id-perawat-cppt']}')]`)
        const jsonData = CPPTRO.createFromJson(req.body)

        cpptData = {
          ...jsonData,
          Nama_Perawat_Cppt: (cpptNurse && cpptNurse.length > 0) ? cpptNurse[0].Nama : '',
          Nama_Dokter_Pengkaji: (doctorPreliminary && doctorPreliminary.length > 0) ? doctorPreliminary[0].Nama : '',
          Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
          Updated_By: req.userId,
          Updated_By_Name: req.userProfile.nama,
          Is_Dokter: !!(isDoctor && Array.isArray(isDoctor) && isDoctor.length > 0),
        };
      }

      //CPPT FARMASI
      if (req.body.unit && req.body.unit === 'Farmasi') {
        const doctorPreliminary = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${req.body['id-dokter-pengkaji']}')]`)
        const cpptNurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${req.body['id-perawat-cppt']}')]`)

        const jsonData = CPPTFarmasi.createFromJson(req.body);
        cpptData = {
          ...jsonData,
          Nama_Perawat_Cppt: (cpptNurse && cpptNurse.length > 0) ? cpptNurse[0].Nama : '',
          Nama_Dokter_Pengkaji: (doctorPreliminary && doctorPreliminary.length > 0) ? doctorPreliminary[0].Nama : '',
          Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
          Updated_By: req.userId,
          Updated_By_Name: req.userProfile.nama,
          Is_Dokter: !!(isDoctor && Array.isArray(isDoctor) && isDoctor.length > 0),
        }
      }

      //CPPT RANAP
      if (req.body.unit && req.body.unit === 'RawatInap') {
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

        const postDaftarObat: any = [];

        for (const item of prescriptions) {
          const obat = PostDaftarObat.createFromPrescription(item);
          postDaftarObat.push(obat);
        }

        if (postDaftarObat.length > 0 && (req.body['is-form-dokter'] || req.body['is-form-dokter'] === 1)) {
          const paramsToSimrs: IPostMedsToSimrs = {
            company_code: req.body.kode_cabang,
            tipe_pelayanan: req.body.tipe_pasien,
            no_berobat: req.body.id_berobat,
            tgl_resep: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            id_dokter: req.body.id_dokter,
            keterangan: '',
            no_resep: '',
            emr: '1',
            berat_badan: 0,
            alergi: 'To Be Defined',
            daftar_obat: postDaftarObat,
          }

          if (statusTebus && statusTebus === '1') {
            console.log('statusTebus', statusTebus)
          }

          const result = await global.messagingService.sendMessage(emrData.Kode_Cabang, '/farmasi/resep_obat/tambah_emr', { ...paramsToSimrs, token: req.token });
          ElasticLoggerService().createLog(result ? { body: paramsToSimrs } : {}, '/messaging/farmasi', result?.body ?? {});
          sendPrescription = result && result.body ? result.body : {};
        }
        const pictureDataO = req.body['picture-data-o'] ? req.body['picture-data-o'] : undefined;
        const image2 = req.body['image-2'] ? req.body['image-2'] : undefined;
        if (image2) {
          image2.Url_Image = image2.Url_Image && image2.Url_Image !== '' && isValidFile(image2.Url_Image) ? global.storage.cleanUrl(image2.Url_Image) : '';
        }
        if (pictureDataO) {
          pictureDataO.Url_Image_Cppt_Data_O = pictureDataO.Url_Image_Cppt_Data_O && pictureDataO.Url_Image_Cppt_Data_O !== '' && isValidFile(pictureDataO.Url_Image_Cppt_Data_O) ? global.storage.cleanUrl(pictureDataO.Url_Image_Cppt_Data_O) : '';
        }
        const doctorPreliminary = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${req.body['id-dokter-pengkaji']}')]`)
        const cpptNurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${req.body['id-perawat-cppt']}')]`)

        const jsonData = CPPTRawatInap.createFromJson(req.body);
        cpptData = {
          ...jsonData,
          Resep: prescriptions ? prescriptions : [],
          ID_Petugas: req.userId ? req.userId : '',
          Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
          Is_Dokter: !!(isDoctor && Array.isArray(isDoctor) && isDoctor.length > 0),
          Nama_Perawat_Cppt: (cpptNurse && cpptNurse.length > 0) ? cpptNurse[0].Nama : '',
          Nama_Dokter_Pengkaji: (doctorPreliminary && doctorPreliminary.length > 0) ? doctorPreliminary[0].Nama : '',
          Picture_Data_O: (pictureDataO) ? pictureDataO : {},
          Image_2: image2 ?? {},
          Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
          Updated_By: (req.userId) ? req.userId : '',
        }
      }

      //CPPT Gizi
      if (req.body.unit && req.body.unit === 'Gizi') {
        const doctorPreliminary = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${req.body['id-dokter-pengkaji']}')]`)
        const cpptNurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${req.body['id-perawat-cppt']}')]`)

        const jsonData = CPPTGizi.createFromJson(req.body);
        cpptData = {
          ...jsonData,
          Nama_Perawat_Cppt: (cpptNurse && cpptNurse.length > 0) ? cpptNurse[0].Nama : '',
          Nama_Dokter_Pengkaji: (doctorPreliminary && doctorPreliminary.length > 0) ? doctorPreliminary[0].Nama : '',
          Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
          Updated_By: req.userId,
          Updated_By_Name: req.userProfile.nama,
          Is_Dokter: !!(isDoctor && Array.isArray(isDoctor) && isDoctor.length > 0),
        }
      }

      //CPPT UGD
      if (req.body.unit && req.body.unit === 'UGD') {
        const meds = await global.medicalRecord.get(`Obat:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`);
        const htu = await global.medicalRecord.get(`AturanPakai:{${emrData.Kode_Cabang}}`);

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
            alergi: 'To Be Defined',
            daftar_obat: postDaftarObat,
          }

          if (statusTebus && statusTebus === '1') {
            console.log('statusTebus', statusTebus)
          }

          const result = await global.messagingService.sendMessage(emrData.Kode_Cabang, '/farmasi/resep_obat/tambah_emr', { ...paramsToSimrs, token: req.token });
          sendPrescription = result && result.body ? result.body : {};
          ElasticLoggerService().createLog(result ? { body: paramsToSimrs } : {}, '/messaging/farmasi', result?.body ?? {});
        }

        const doctorPreliminary = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${req.body['id-dokter-pengkaji']}')]`)

        const cpptNurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${req.body['id-perawat-cppt']}')]`)
        const pictureDataO = req.body['picture-data-o'] ? req.body['picture-data-o'] : undefined;
        const image2 = req.body['image-2'] ? req.body['image-2'] : undefined;
        if (image2) {
          image2.Url_Image = image2.Url_Image && image2.Url_Image !== '' && isValidFile(image2.Url_Image) ? global.storage.cleanUrl(image2.Url_Image) : '';
        }
        if (pictureDataO) {
          pictureDataO.Url_Image_Cppt_Data_O = pictureDataO.Url_Image_Cppt_Data_O && pictureDataO.Url_Image_Cppt_Data_O !== '' && isValidFile(pictureDataO.Url_Image_Cppt_Data_O) ? global.storage.cleanUrl(pictureDataO.Url_Image_Cppt_Data_O) : '';
        }

        const jsonData = CPPTUGD.createFromJson(req.body)
        cpptData = {
          ...jsonData,
          Resep: prescriptions ? prescriptions : [],
          ID_Petugas: req.userId ? req.userId : '',
          Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
          Is_Dokter: !!(isDoctor && Array.isArray(isDoctor) && isDoctor.length > 0),
          Nama_Perawat_Cppt: (cpptNurse && cpptNurse.length > 0) ? cpptNurse[0].Nama : '',
          Nama_Dokter_Pengkaji: (doctorPreliminary && doctorPreliminary.length > 0) ? doctorPreliminary[0].Nama : '',
          Picture_Data_O: (pictureDataO) ? pictureDataO : {},
          Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
          Updated_By: (req.userId) ? req.userId : '',
        }
      }

      //CPPT RAJAL
      if (req.body.unit && req.body.unit === 'RawatJalan') {
        const meds = await global.medicalRecord.get(`Obat:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`);
        const htu = await global.medicalRecord.get(`AturanPakai:{${emrData.Kode_Cabang}}`);

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
            alergi: 'To Be Defined',
            daftar_obat: postDaftarObat,
          }

          if (statusTebus && statusTebus === '1') {
            console.log('statusTebus', statusTebus)
          }

          const result = await global.messagingService.sendMessage(emrData.Kode_Cabang, '/farmasi/resep_obat/tambah_emr', { ...paramsToSimrs, token: req.token });
          sendPrescription = result && result.body ? result.body : {};
          ElasticLoggerService().createLog(result ? { body: paramsToSimrs } : {}, '/messaging/farmasi', result?.body ?? {});
        }

        const doctorPreliminary = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${req.body['id-dokter-pengkaji']}')]`)

        const cpptNurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${req.body['id-perawat-cppt']}')]`)
        const pictureDataO = req.body['picture-data-o'] ? req.body['picture-data-o'] : undefined;
        const image2 = req.body['image-2'] ? req.body['image-2'] : undefined;
        if (image2) {
          image2.Url_Image = image2.Url_Image && image2.Url_Image !== '' && isValidFile(image2.Url_Image) ? global.storage.cleanUrl(image2.Url_Image) : '';
        }
        if (pictureDataO) {
          pictureDataO.Url_Image_Cppt_Data_O = pictureDataO.Url_Image_Cppt_Data_O && pictureDataO.Url_Image_Cppt_Data_O !== '' && isValidFile(pictureDataO.Url_Image_Cppt_Data_O) ? global.storage.cleanUrl(pictureDataO.Url_Image_Cppt_Data_O) : '';
        }

        const jsonData = CPPTRawatJalan.createFromJson(req.body)
        cpptData = {
          ...jsonData,
          Resep: prescriptions ? prescriptions : [],
          ID_Petugas: req.userId ? req.userId : '',
          Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
          Is_Dokter: !!(isDoctor && Array.isArray(isDoctor) && isDoctor.length > 0),
          Nama_Perawat_Cppt: (cpptNurse && cpptNurse.length > 0) ? cpptNurse[0].Nama : '',
          Nama_Dokter_Pengkaji: (doctorPreliminary && doctorPreliminary.length > 0) ? doctorPreliminary[0].Nama : '',
          Picture_Data_O: (pictureDataO) ? pictureDataO : {},
          Image_2: image2 ? image2 : {},
          Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
          Updated_By: (req.userId) ? req.userId : '',
        }
      }
      // CPPT OK
      if (req.body.unit && req.body.unit === 'OK') {
        const meds = await global.medicalRecord.get(`Obat:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`);
        const htu = await global.medicalRecord.get(`AturanPakai:{${emrData.Kode_Cabang}}`);

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
            alergi: 'To Be Defined',
            daftar_obat: postDaftarObat,
          }
          if (statusTebus && statusTebus === '1') {
            console.log('statusTebus', statusTebus);
          }

          const result = await global.messagingService.sendMessage(emrData.Kode_Cabang, '/farmasi/resep_obat/tambah_emr', { ...paramsToSimrs, token: req.token });
          sendPrescription = result && result.body ? result.body : {};
          ElasticLoggerService().createLog(result ? { body: paramsToSimrs } : {}, '/messaging/farmasi', result?.body ?? {});
        }
        const doctorPreliminary = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${req.body['id-dokter-pengkaji']}')]`)

        const cpptNurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${req.body['id-perawat-cppt']}')]`)
        const pictureDataO = req.body['picture-data-o'] ? req.body['picture-data-o'] : undefined;
        const picture = req.body['picture'] ? req.body['picture'] : undefined;
        const image2 = req.body['image-2'] ? req.body['image-2'] : undefined;
        if (image2) {
          image2.Url_Image = image2.Url_Image && image2.Url_Image !== '' && isValidFile(image2.Url_Image) ? global.storage.cleanUrl(image2.Url_Image) : '';
        }

        if (pictureDataO) {
          pictureDataO.Url_Image_Cppt_Data_O = pictureDataO.Url_Image_Cppt_Data_O && pictureDataO.Url_Image_Cppt_Data_O !== '' && isValidFile(pictureDataO.Url_Image_Cppt_Data_O) ? global.storage.cleanUrl(pictureDataO.Url_Image_Cppt_Data_O) : '';
        }

        if (picture) {
          picture.Url_Image_Cppt_Ok = picture.Url_Image_Cppt_Ok && picture.Url_Image_Cppt_Ok !== '' && isValidFile(picture.Url_Image_Cppt_Ok) ? global.storage.cleanUrl(picture.Url_Image_Cppt_Ok) : '';
        }

        const jsonData = CPPTOK.createFromJson(req.body)
        cpptData = {
          ...jsonData,
          Resep: prescriptions ? prescriptions : [],
          ID_Petugas: req.userId ? req.userId : '',
          Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
          Is_Dokter: !!(isDoctor && Array.isArray(isDoctor) && isDoctor.length > 0),
          Picture_Data_O: (pictureDataO) ? pictureDataO : {},
          Picture: (picture) ? picture : {},
          Nama_Perawat_Cppt: (cpptNurse && cpptNurse.length > 0) ? cpptNurse[0].Nama : '',
          Nama_Dokter_Pengkaji: (doctorPreliminary && doctorPreliminary.length > 0) ? doctorPreliminary[0].Nama : '',
          Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
          Updated_By: (req.userId) ? req.userId : '',
        }
      }

      if (!cpptId || cpptId === "") {
        // create CPPT
        cpptData.ID = uuid().replace(/-/g, "").toUpperCase();
        cpptData.ID_Petugas = req.userId;
        cpptData.Nama_Petugas = req.userProfile.nama;
        cpptData.Deleted = 0;
        await global.medicalRecord.addCPPT(req.emrID, cpptData);
        if (req.body && req.body.is_create_from_preliminary) {
          await global.medicalRecord.update(
            req.emrID,
            '$.Rawat_Jalan.Pengkajian_Awal.CPPT_ID',
            cpptData.ID,
          );
        }
        localDebug(`Create Data ${cpptData}`);
        responseMessage = "Data berhasil ditambah";
      } else {
        const searchQuery = `\'@Kode_Cabang:${emrData.Kode_Cabang} @No_MR:${emrData.No_MR} "${cpptId}"\'`;
        const result = await global.medicalRecord.findCPPT(searchQuery, {
          RETURN: ["$.Kode_Cabang", "$.No_MR", `$.Common.CPPT[?(@.ID=="${cpptId}")]`],
        });
        localDebug(`Search ${searchQuery}`);

        let data: any;
        if (result.documents.length > 0) {
          data = JSON.parse(result.documents[0].value[`$.Common.CPPT[?(@.ID=="${cpptId}")]`]);
          if (data["Deleted"] && data["Deleted"] === 1) {
            data = {};
            responseMessage = "Data CPPT tidak ada"
            if (req.body && req.body.is_create_from_preliminary) {
              cpptData.ID = uuid().replace(/-/g, "").toUpperCase();
              cpptData.ID_Petugas = req.userId;
              cpptData.Nama_Petugas = req.userProfile.nama;
              cpptData.Deleted = 0;
              await global.medicalRecord.addCPPT(req.emrID, cpptData);
              if (req.body && req.body.is_create_from_preliminary) {
                await global.medicalRecord.update(
                  req.emrID,
                  '$.Rawat_Jalan.Pengkajian_Awal.CPPT_ID',
                  cpptData.ID,
                );
              }
              localDebug(`Create Data ${cpptData}`);
              responseMessage = "Data berhasil ditambah";
            }
          } else {
            // update CPPT
            const userDetail = await RBAC.getInstance().getUserProfile(req.token, data.ID_Petugas);
            cpptData.ID = req.body["ID"];
            cpptData.ID_Petugas = data.ID_Petugas;
            cpptData.Nama_Petugas = userDetail.nama ? userDetail.nama : '';
            cpptData.Deleted = 0;
            const diff = jsonpatch.compare(data, cpptData);

            const updateDocument = jsonpatch.applyPatch(data, diff);
            localDebug(`Prepare Data ${diff}`);
            await global.medicalRecord.update(req.emrID, `$.Common.CPPT[?(@.ID=="${cpptId}")]`, updateDocument.newDocument);
            localDebug(`Update Data ${diff}`);
            responseMessage = "Data berhasil diubah";
          }
        } else {
          throw new Error("No Data");
        }
      }
      ElasticLoggerService().createHTTPResponse(req, res, 200, {
        message: responseMessage,
        prescription: sendPrescription,
      });
    }
    if (!emrData || (emrData && emrData === null)) {
      ElasticLoggerService().createHTTPResponse(req, res, 404, {
        message: "EMR Data Not Found",
      });
    }
  } catch (err: any) {
    localDebug(`Error ${err}`);
    ElasticLoggerService().createHTTPResponse(req, res, 500, {
      message: "Internal Server Error",
      error: err,
    });
  }
  localDebug(`Request End`);
});

CPPT.route("/cppt/view").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const localDebug = debugEMR.extend(req.path);
  localDebug(`Request Begin`);
  const emrKeys = ["Kode_Cabang", "No_MR", "Pasien"];
  const cpptId = req.body["item-id"];

  const emrData = await global.medicalRecord.get(req.emrID, emrKeys);
  if (emrData === null) {
    ElasticLoggerService().createHTTPResponse(req, res, 404, {
      message: "EMR Data Not Found",
    });
  } else {
    try {
      const searchQuery = `\'@Kode_Cabang:${emrData.Kode_Cabang} @No_MR:${emrData.No_MR} "${cpptId}"\'`;
      const result = await global.medicalRecord.findCPPT(searchQuery, {
        RETURN: ["$.Kode_Cabang", "$.No_MR", `$.Common.CPPT[?(@.ID=="${cpptId}")]`],
      });
      localDebug(`Search ${searchQuery}`);

      if (result.documents.length > 0) {
        const data = JSON.parse(result.documents[0].value[`$.Common.CPPT[?(@.ID=="${cpptId}")]`]);
        data.EMR_ID = result.documents[0].id ? result.documents[0].id : '';

        const pictureDataO = data.Picture_Data_O ? data.Picture_Data_O : undefined;

        data.TTD_Perawat_Cppt = (data.TTD_Perawat_Cppt && data.TTD_Perawat_Cppt !== '' && isValidFile(data.TTD_Perawat_Cppt)) ? await global.storage.signUrl(data.TTD_Perawat_Cppt, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        data.TTD_Dokter_Pengkaji = (data.TTD_Dokter_Pengkaji && data.TTD_Dokter_Pengkaji !== '' && isValidFile(data.TTD_Dokter_Pengkaji)) ? await global.storage.signUrl(data.TTD_Dokter_Pengkaji, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        data.Gambar_Mata_OD = (data.Gambar_Mata_OD && data.Gambar_Mata_OD !== '' && isValidFile(data.Gambar_Mata_OD)) ? await global.storage.signUrl(data.Gambar_Mata_OD, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        data.Gambar_Mata_OS = (data.Gambar_Mata_OS && data.Gambar_Mata_OS !== '' && isValidFile(data.Gambar_Mata_OS)) ? await global.storage.signUrl(data.Gambar_Mata_OS, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        data.Gambar_Retina_OD = (data.Gambar_Retina_OD && data.Gambar_Retina_OD !== '' && isValidFile(data.Gambar_Retina_OD)) ? await global.storage.signUrl(data.Gambar_Retina_OD, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        data.Gambar_Retina_OS = (data.Gambar_Retina_OS && data.Gambar_Retina_OS !== '' && isValidFile(data.Gambar_Retina_OS)) ? await global.storage.signUrl(data.Gambar_Retina_OS, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        data.TTD_Dokter_Dpjp = (data.TTD_Dokter_Dpjp && data.TTD_Dokter_Dpjp !== '' && isValidFile(data.TTD_Dokter_Dpjp)) ? await global.storage.signUrl(data.TTD_Dokter_Dpjp, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        if (pictureDataO) {
          data.Picture_Data_O.Url_Image_Cppt_Data_O = (pictureDataO && pictureDataO.Url_Image_Cppt_Data_O && pictureDataO.Url_Image_Cppt_Data_O !== '' && isValidFile(pictureDataO.Url_Image_Cppt_Data_O)) ? await global.storage.signUrl(pictureDataO.Url_Image_Cppt_Data_O, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';
        }

        data.Picture = (data.Picture && data.Picture !== '' && isValidFile(data.Picture)) ? await global.storage.signUrl(data.Picture, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        res.status(200).json({
          message: "OK",
          data,
        });

        if (data["Deleted"] && data["Deleted"] === 1) {
          res.status(200).json({
            message: 'OK',
            data: {},
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
    localDebug(`Request End`);
  }
});

CPPT.route("/cppt/item").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const localDebug = debugEMR.extend(req.path);
  localDebug(`Request Begin`);

  const limit = req.body.limit || 100;
  const offset: number = req.body.offset || 0;
  const sortDir = req.body.sort || "DESC";
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
      RETURN: ["$.Kode_Cabang", "$.No_MR", "$.Common.CPPT", "$.Jenis_Pelayanan"],
    });
    const anamnesa = await global.medicalRecord.get(`Anamnesa:{${emrData.Kode_Cabang}}`);
    localDebug(`Search ${searchQuery}`);
    localDebug(result);
    let records: any = [];
    // Merge CPPT from multiple visits
    for (let i = 0; i < result.documents.length; i++) {
      if (result.documents[i].value["$.Common.CPPT"] !== undefined) {
        const objCPPT = JSON.parse(result.documents[i].value["$.Common.CPPT"]);
        const serviceType = result.documents[i].value["$.Jenis_Pelayanan"] ?? ''
        for (let j = 0; j < objCPPT.length; j++) {
          const checkPharm = await global.medicalRecord.keys(result.documents[i].id, '.Farmasi');
          if (checkPharm !== null && checkPharm.includes('Tebus_Obat') && objCPPT[j]['Unit'] === 'RawatJalan') {
            const farmasi = await global.medicalRecord.get(result.documents[i].id, ['Farmasi.Tebus_Obat'])
            objCPPT[j]['formFarmasi'] = farmasi ?? {}
          }

          if (serviceType === 'RawatInap' && objCPPT[j]['Unit'] === 'RawatInap') {
            const checkInpat = await global.medicalRecord.keys(result.documents[i].id, '.Rawat_Inap');
            if (checkInpat !== null && checkInpat.includes('Daftar_Resep_Visit_Dokter')) {
              const inpatient = await global.medicalRecord.get(result.documents[i].id, ['Rawat_Inap.Daftar_Resep_Visit_Dokter']);
              const medsRedeem: ITebusObatRanap = inpatient && Array.isArray(inpatient) ? inpatient.find((item: any) => item.ID === objCPPT[j]['ID_Berobat']) : undefined;
              let pharmacyForm = {};
              if (medsRedeem) {
                pharmacyForm = {
                  Status_Tebus: medsRedeem.Status_Tebus,
                  Waktu_Tebus: medsRedeem.Waktu_Tebus,
                  Daftar_Tebus: medsRedeem.Daftar_Tebus,
                  Keterangan: medsRedeem.Keterangan,
                }
              }
              objCPPT[j]['formFarmasi'] = pharmacyForm ?? {}
            }
          }
          objCPPT[j]["EMR_ID"] = result.documents[i].id;
        }
        records = records.concat(objCPPT);
      }
    }

    localDebug(`Merge Data`);

    const total = records.length;

    // Remove deleted CPPT
    records = records.filter((val: any) => !val.Deleted || (val.Deleted && val.Deleted !== 1))

    // Sort CPPT based on param direction
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

    // Show just used fields
    for (let i = 0; i < records.length; i++) {
      const pictureDataO = records[i] && records[i].Picture_Data_O ? records[i].Picture_Data_O : undefined;
      const picture = records[i] && records[i].Picture ? records[i].Picture : undefined;
      const image2 = records[i] && records[i].Image_2 ? records[i].Image_2 : undefined;
      records[i].TTD_Perawat_Cppt = (records[i].TTD_Perawat_Cppt && records[i].TTD_Perawat_Cppt !== '' && isValidFile(records[i].TTD_Perawat_Cppt)) ? await global.storage.signUrl(records[i].TTD_Perawat_Cppt, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

      records[i].TTD_Dokter_Pengkaji = (records[i].TTD_Dokter_Pengkaji && records[i].TTD_Dokter_Pengkaji !== '' && isValidFile(records[i].TTD_Dokter_Pengkaji)) ? await global.storage.signUrl(records[i].TTD_Dokter_Pengkaji, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

      records[i].Gambar_Mata_OD = (records[i].Gambar_Mata_OD && records[i].Gambar_Mata_OD !== '' && isValidFile(records[i].Gambar_Mata_OD)) ? await global.storage.signUrl(records[i].Gambar_Mata_OD, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

      records[i].Gambar_Mata_OS = (records[i].Gambar_Mata_OS && records[i].Gambar_Mata_OS !== '' && isValidFile(records[i].Gambar_Mata_OS)) ? await global.storage.signUrl(records[i].Gambar_Mata_OS, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

      records[i].Gambar_Retina_OD = (records[i].Gambar_Retina_OD && records[i].Gambar_Retina_OD !== '' && isValidFile(records[i].Gambar_Retina_OD)) ? await global.storage.signUrl(records[i].Gambar_Retina_OD, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

      records[i].Gambar_Retina_OS = (records[i].Gambar_Retina_OS && records[i].Gambar_Retina_OS !== '' && isValidFile(records[i].Gambar_Retina_OS)) ? await global.storage.signUrl(records[i].Gambar_Retina_OS, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

      records[i].TTD_Dokter_Dpjp = (records[i].TTD_Dokter_Dpjp && records[i].TTD_Dokter_Dpjp !== '' && isValidFile(records[i].TTD_Dokter_Dpjp)) ? await global.storage.signUrl(records[i].TTD_Dokter_Dpjp, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

      if (pictureDataO) {
        records[i].Picture_Data_O.Url_Image_Cppt_Data_O = (pictureDataO && pictureDataO.Url_Image_Cppt_Data_O && pictureDataO.Url_Image_Cppt_Data_O !== '' && isValidFile(pictureDataO.Url_Image_Cppt_Data_O)) ? await global.storage.signUrl(pictureDataO.Url_Image_Cppt_Data_O, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';
      }

      if (picture) {
        records[i].Picture.Url_Image_Cppt_Ok = (picture && picture.Url_Image_Cppt_Ok && picture.Url_Image_Cppt_Ok !== '' && isValidFile(picture.Url_Image_Cppt_Ok)) ? await global.storage.signUrl(picture.Url_Image_Cppt_Ok, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';
      }

      if (image2) {
        records[i].Image_2.Url_Image = (image2 && image2.Url_Image && image2.Url_Image !== '' && isValidFile(image2.Url_Image)) ? await global.storage.signUrl(image2.Url_Image, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';
      }
    }
    localDebug(`Create Custom Data`);

    res.status(200).json({
      message: "OK",
      data: {
        total,
        totalFiltered: records.length,
        EMR_ID: req.emrID,
        pasien: emrData.Pasien,
        records,
        fields,
        anamnesa: anamnesa && anamnesa !== null ? anamnesa : [],
      },
    });
  }
  localDebug(`Request End`);
});

CPPT.route('/cppt/item-day')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const sortDir: 'ASC' | 'DESC' = req.body.sort || "DESC";
      const emrKeys: Array<string> = ["Kode_Cabang", "No_MR", "Pasien"];
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Common')
      if (checkObject && checkObject !== null && checkObject.includes('CPPT')) {
        emrKeys.push('Common.CPPT');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const cpptRecords = result['Common.CPPT'] ?? undefined;
        if (cpptRecords) {
          const records = cpptRecords.filter((item: any) => !item.Deleted || (item.Deleted && item.Deleted !== 1))
          const total = records.length;
          records.sort((a: any, b: any) => {
            if (sortDir === "ASC") {
              return moment(a.Waktu).unix() - moment(b.Waktu).unix();
            } else if (sortDir === "DESC") {
              return moment(b.Waktu).unix() - moment(a.Waktu).unix();
            }
          });
          for (let i = 0; i < records.length; i += 1) {
            const pictureDataO = records[i] && records[i].Picture_Data_O ? records[i].Picture_Data_O : undefined;
            const picture = records[i] && records[i].Picture ? records[i].Picture : undefined;
            records[i].TTD_Perawat_Cppt = (records[i].TTD_Perawat_Cppt && records[i].TTD_Perawat_Cppt !== '' && isValidFile(records[i].TTD_Perawat_Cppt)) ? await global.storage.signUrl(records[i].TTD_Perawat_Cppt, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

            records[i].TTD_Dokter_Pengkaji = (records[i].TTD_Dokter_Pengkaji && records[i].TTD_Dokter_Pengkaji !== '' && isValidFile(records[i].TTD_Dokter_Pengkaji)) ? await global.storage.signUrl(records[i].TTD_Dokter_Pengkaji, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

            records[i].Gambar_Mata_OD = (records[i].Gambar_Mata_OD && records[i].Gambar_Mata_OD !== '' && isValidFile(records[i].Gambar_Mata_OD)) ? await global.storage.signUrl(records[i].Gambar_Mata_OD, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

            records[i].Gambar_Mata_OS = (records[i].Gambar_Mata_OS && records[i].Gambar_Mata_OS !== '' && isValidFile(records[i].Gambar_Mata_OS)) ? await global.storage.signUrl(records[i].Gambar_Mata_OS, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

            records[i].Gambar_Retina_OD = (records[i].Gambar_Retina_OD && records[i].Gambar_Retina_OD !== '' && isValidFile(records[i].Gambar_Retina_OD)) ? await global.storage.signUrl(records[i].Gambar_Retina_OD, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

            records[i].Gambar_Retina_OS = (records[i].Gambar_Retina_OS && records[i].Gambar_Retina_OS !== '' && isValidFile(records[i].Gambar_Retina_OS)) ? await global.storage.signUrl(records[i].Gambar_Retina_OS, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

            records[i].TTD_Dokter_Dpjp = (records[i].TTD_Dokter_Dpjp && records[i].TTD_Dokter_Dpjp !== '' && isValidFile(records[i].TTD_Dokter_Dpjp)) ? await global.storage.signUrl(records[i].TTD_Dokter_Dpjp, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

            if (pictureDataO) {
              records[i].Picture_Data_O.Url_Image_Cppt_Data_O = (pictureDataO && pictureDataO.Url_Image_Cppt_Data_O && pictureDataO.Url_Image_Cppt_Data_O !== '' && isValidFile(pictureDataO.Url_Image_Cppt_Data_O)) ? await global.storage.signUrl(pictureDataO.Url_Image_Cppt_Data_O, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';
            }

            if (picture) {
              records[i].Picture.Url_Image_Cppt_Ok = (picture && picture.Url_Image_Cppt_Ok && picture.Url_Image_Cppt_Ok !== '' && isValidFile(picture.Url_Image_Cppt_Ok)) ? await global.storage.signUrl(picture.Url_Image_Cppt_Ok, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';
            }
          }
          res.status(200).json({
            message: 'OK',
            data: {
              EMR_ID: req.emrID,
              total,
              records,
            },
          })
        } else {
          res.status(200).json({
            message: 'OK',
            data: {
              EMR_ID: req.emrID,
              total: 0,
              records: [],
            },
          })
        }
      } else {
        res.status(500).json({
          message: 'No Data',
        })
      }
    } catch (err) {
      res.status(500).json({
        message: err,
      })
    }
  })

CPPT.route('/cppt/validate-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const emrKeys = ["Kode_Cabang", "No_MR", "Pasien"];
      const cpptId = req.body["ID"];
      const emrData = await global.medicalRecord.get(req.emrID, emrKeys);

      if (emrData && emrData !== null) {
        if (cpptId && cpptId !== null) {
          const searchQuery = `\'@Kode_Cabang:${emrData.Kode_Cabang} @No_MR:${emrData.No_MR} "${cpptId}"\'`;
          const result = await global.medicalRecord.findCPPT(searchQuery, {
            RETURN: ["$.Kode_Cabang", "$.No_MR", `$.Common.CPPT[?(@.ID=="${cpptId}")]`],
          });

          if (result.documents.length > 0) {
            const oldData = JSON.parse(result.documents[0].value[`$.Common.CPPT[?(@.ID=="${cpptId}")]`]);

            let data = JSON.parse(result.documents[0].value[`$.Common.CPPT[?(@.ID=="${cpptId}")]`]);

            const dpjpDoctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${req.body['dokter-dpjp']}')]`)
            if (data["Deleted"] && data["Deleted"] === 1) {
              data = {};
              ElasticLoggerService().createHTTPResponse(req, res, 404, {
                message: "File Has Been Deleted",
              });
            } else {
              // update CPPT
              data.Validated_At = moment().format("YYYY-MM-DD HH:mm:ss");
              data.Dokter_Dpjp_Nama = (dpjpDoctor && dpjpDoctor.length > 0) ? dpjpDoctor[0].Nama : '';
              data.Dokter_Dpjp_Id = req.body['dokter-dpjp'] ? req.body['dokter-dpjp'] : '';
              data.TTD_Dokter_Dpjp = (req.body['ttd-dokter-pemeriksa'] && req.body['ttd-dokter-pemeriksa'] !== '' && isValidFile(req.body['ttd-dokter-pemeriksa'])) ? global.storage.cleanUrl(req.body['ttd-dokter-pemeriksa']) : '';

              const diff = jsonpatch.compare(oldData, data);
              const patch = [];
              for (let i = 0; i < diff.length; i++) {
                if (diff[i].op === "add" || diff[i].op === "replace") patch.push(diff[i]);
              }
              const updateDocument = jsonpatch.applyPatch(oldData, patch);
              await global.medicalRecord.update(req.emrID, `$.Common.CPPT[?(@.ID=="${cpptId}")]`, updateDocument.newDocument);
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
        if (!cpptId || (cpptId && cpptId === null)) {
          ElasticLoggerService().createHTTPResponse(req, res, 500, {
            message: "No CPPT ID",
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

// CPPT.route('/cppt/delete')
//   .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
//     req: Request,
//     res: Response,
//     next: NextFunction,
//   ): Promise<void> => {
//     try {
//       const emrKeys: Array<string> = [];
//       const checkObject = await global.medicalRecord.keys(req.emrID, '.Common')
//       if (checkObject && checkObject !== null && checkObject.includes('CPPT')) {
//         emrKeys.push('Common.CPPT');
//       }
//       const result = await global.medicalRecord.get(req.emrID, emrKeys);

//       if (result && Array.isArray(result) && result.length > 0) {
//         const index = result.findIndex((val: any) => val.ID === req.body.ID);
//         await global.medicalRecord.deleteCPPT(req.emrID, index);
//       }
//       res.status(200).json({
//         message: 'OK',
//       })
//     } catch (err) {

//     }
//   })

CPPT.route('/cppt/delete')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const emrKeys = ["Kode_Cabang", "No_MR", "Pasien"];
      const cpptId = req.body['item-id'];
      const emrData = await global.medicalRecord.get(req.emrID, emrKeys);

      if (emrData && emrData !== null) {
        if (cpptId && cpptId !== null) {
          const searchQuery = `\'@Kode_Cabang:${emrData.Kode_Cabang} @No_MR:${emrData.No_MR} "${cpptId}"\'`;
          const result = await global.medicalRecord.findCPPT(searchQuery, {
            RETURN: ["$.Kode_Cabang", "$.No_MR", `$.Common.CPPT[?(@.ID=="${cpptId}")]`],
          });

          if (result.documents.length > 0) {
            const oldData = JSON.parse(result.documents[0].value[`$.Common.CPPT[?(@.ID=="${cpptId}")]`]);

            let data = JSON.parse(result.documents[0].value[`$.Common.CPPT[?(@.ID=="${cpptId}")]`]);

            if (data["Deleted"] && data["Deleted"] === 1) {
              data = {};
              ElasticLoggerService().createHTTPResponse(req, res, 404, {
                message: "File Has Been Deleted",
              });
            } else {
              // update CPPT
              data.Deleted = 1;
              data.Deleted_At = moment().format("YYYY-MM-DD HH:mm:ss");
              data.Deleted_By = req.userId;
              data.Deleted_By_Nama = req.userProfile.nama;

              if (data.Unit === 'RawatInap' && data.Is_Form_Dokter) {
                await global.medicalRecord.update(
                  req.emrID,
                  '$.Rawat_Inap.Catatan_Medis_Awal.CPPT_ID',
                  '',
                );
              }

              const diff = jsonpatch.compare(oldData, data);
              const patch = [];
              for (let i = 0; i < diff.length; i++) {
                if (diff[i].op === "add" || diff[i].op === "replace") patch.push(diff[i]);
              }
              const updateDocument = jsonpatch.applyPatch(oldData, patch);
              await global.medicalRecord.update(req.emrID, `$.Common.CPPT[?(@.ID=="${cpptId}")]`, updateDocument.newDocument);
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
        if (!cpptId || (cpptId && cpptId === null)) {
          ElasticLoggerService().createHTTPResponse(req, res, 500, {
            message: "No CPPT ID",
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

export { CPPT };
