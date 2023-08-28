import e, { Router, Request, Response, NextFunction, response } from 'express'
import RBAC from '../../../services/rbac'
import moment from 'moment'
import { IUpdateToSimrs, UpdateToSimrs } from './interfaces/simrs/simrs.request';
import { OKCatatanKeperawatanPraOp, ICatatanKeperawatan, ICKPO, IFormLaporanPembedahan, ILaporanPembedahan, InstruksiPascaBedahRajal, AsesmenPraOperasi, StatusAnestesi, PersiapanPeralatan } from './interfaces/ok/ok.model';
import { SimrsService, ElasticLoggerService } from './services';
import * as jsonpatch from 'fast-json-patch';
import { GetLensListRequest, IGetLensListRequest, IUpdateAsesmenPraOperasi, IUpdateInstruksiPascaBedahRajal, IUpdatePersiapanPeralatan, IUpdateStatusAnestesi } from './interfaces/ok/ok.request';
import { getFirstEws, getLocalInjectionType, isValidFile } from './helpers/app.helper';
import { SurveilansInfeksiHais } from './interfaces/inpatient/inpatient.model';
import { IUpdateSurveilansInfeksiHais } from './interfaces/inpatient/inpatient.request';
const jp = require('jsonpath')
const OK = Router();

OK.route('/ok/laporan-pembedahan-anestesi-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'No_MR'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.OK');
      if (checkObject !== null && checkObject.includes("Laporan_Pembedahan_Anestesi")) {
        emrKeys.push("OK.Laporan_Pembedahan_Anestesi");
      }
      if (checkObject !== null && checkObject.includes('Laporan_Pemakaian_Implant')) {
        emrKeys.push('OK.Laporan_Pemakaian_Implant');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);

      if (result && result !== null) {
        const form = (result['OK.Laporan_Pembedahan_Anestesi']) ? result['OK.Laporan_Pembedahan_Anestesi'] : {};
        const implantLens = (result['OK.Laporan_Pemakaian_Implant']) ? result['OK.Laporan_Pemakaian_Implant'] : {};
        const injectionTypeName = getLocalInjectionType(form);

        if (injectionTypeName) {
          form.Lokal_Injeksi_Intravitreal_Tipe = injectionTypeName;
        }

        form.TTD_Dokter = (form.TTD_Dokter && form.TTD_Dokter !== '' && isValidFile(form.TTD_Dokter)) ? await global.storage.signUrl(form.TTD_Dokter, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : ''

        form.TTD_Perawat = (form.TTD_Perawat && form.TTD_Perawat !== '' && isValidFile(form.TTD_Perawat)) ? await global.storage.signUrl(form.TTD_Perawat, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : ''

        form.Lokal_Phaco_Gambar_Mata = (form.Lokal_Phaco_Gambar_Mata && form.Lokal_Phaco_Gambar_Mata !== '' && isValidFile(form.Lokal_Phaco_Gambar_Mata)) ? await global.storage.signUrl(form.Lokal_Phaco_Gambar_Mata, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : ''

        form.Umum_Phaco_Gambar_Mata = (form.Umum_Phaco_Gambar_Mata && form.Umum_Phaco_Gambar_Mata !== '' && isValidFile(form.Umum_Phaco_Gambar_Mata)) ? await global.storage.signUrl(form.Umum_Phaco_Gambar_Mata, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : ''

        form.Lokal_Chalazion_Gambar_Pra = (form.Lokal_Chalazion_Gambar_Pra && form.Lokal_Chalazion_Gambar_Pra !== '' && isValidFile(form.Lokal_Chalazion_Gambar_Pra)) ? await global.storage.signUrl(form.Lokal_Chalazion_Gambar_Pra, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        form.Lokal_Chalazion_Gambar_Pasca = (form.Lokal_Chalazion_Gambar_Pasca && form.Lokal_Chalazion_Gambar_Pasca !== '' && isValidFile(form.Lokal_Chalazion_Gambar_Pasca)) ? await global.storage.signUrl(form.Lokal_Chalazion_Gambar_Pasca, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        form.Lokal_Hordeolum_Gambar_Pra = (form.Lokal_Hordeolum_Gambar_Pra && form.Lokal_Hordeolum_Gambar_Pra !== '' && isValidFile(form.Lokal_Hordeolum_Gambar_Pra)) ? await global.storage.signUrl(form.Lokal_Hordeolum_Gambar_Pra, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        form.Lokal_Hordeolum_Gambar_Pasca = (form.Lokal_Hordeolum_Gambar_Pasca && form.Lokal_Hordeolum_Gambar_Pasca !== '' && isValidFile(form.Lokal_Hordeolum_Gambar_Pasca)) ? await global.storage.signUrl(form.Lokal_Hordeolum_Gambar_Pasca, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        form.Lokal_Pterygium_Gambar_Pra = (form.Lokal_Pterygium_Gambar_Pra && form.Lokal_Pterygium_Gambar_Pra !== '' && isValidFile(form.Lokal_Pterygium_Gambar_Pra)) ? await global.storage.signUrl(form.Lokal_Pterygium_Gambar_Pra, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        form.Lokal_Pterygium_Gambar_Pasca = (form.Lokal_Pterygium_Gambar_Pasca && form.Lokal_Pterygium_Gambar_Pasca !== '' && isValidFile(form.Lokal_Pterygium_Gambar_Pasca)) ? await global.storage.signUrl(form.Lokal_Pterygium_Gambar_Pasca, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        form.Url_Image_Stiker = (form.Url_Image_Stiker && form.Url_Image_Stiker !== '' && isValidFile(form.Url_Image_Stiker)) ? await global.storage.signUrl(form.Url_Image_Stiker, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        form.Grid_Chart_Img = (form.Grid_Chart_Img && form.Grid_Chart_Img !== '' && isValidFile(form.Grid_Chart_Img)) ? await global.storage.signUrl(form.Grid_Chart_Img, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        const lensList = await global.medicalRecord.get(`ObatIOL:{${result.Kode_Cabang}}:${result.Tipe_Pasien}`);

        const data: ILaporanPembedahan = {
          EMR_ID: req.emrID ? req.emrID : '',
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          form,
          daftar_lensa: lensList,
          lensa_implant: implantLens,
          grid_chart_json: form.Grid_Chart_Data,
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

OK.route('/ok/laporan-pembedahan-anestesi-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: any = req.body;
          const totalImplant = (dataToPost.jml_implant && Array.isArray(dataToPost.jml_implant) && dataToPost.jml_implant.length > 0) ? dataToPost.jml_implant : [];

          const totalImplantToPost = [];
          if (totalImplant && totalImplant.length > 0) {
            for (let i = 0; i < totalImplant.length; i += 1) {
              totalImplantToPost.push({
                id: i + 1,
                kd_barang: dataToPost['kd-barang-lensa'][i],
                nm_barang: dataToPost['nama-inventory-lensa'][i],
                distributor: dataToPost['distributor-lensa'][i],
                no_batch: dataToPost['no-batch-lensa'][i],
                exp_date: dataToPost['exp-date-lensa'][i],
                text_barcode: dataToPost['kode-produk-lensa'][i],
              });
            }
          }
          const operatorDoctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost['id-dokter-operator']}')]`)
          const anesthesiaDoctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost['id-dokter-anestesi']}')]`)
          const circularNurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==1&&@.Status_Dokter==0&&@.ID_Karyawan=='${dataToPost['id-perawat-sirkular']}')]`)
          const doctorNurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==1&&@.Status_Dokter==0&&@.ID_Karyawan=='${dataToPost['id-perawat-dokter-asisten-operator']}')]`)
          const doctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost['id-dokter']}')]`)
          const nurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==1&&@.Status_Dokter==0&&@.ID_Karyawan=='${dataToPost['id-perawat']}')]`)

          const redisJsonData: any = {
            Tanggal: dataToPost.tanggal ? dataToPost.tanggal : '',
            Detail_Implant: totalImplantToPost ? totalImplantToPost : [],
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Id_Perawat_Dokter_Asisten_Operator: dataToPost['id-perawat-dokter-asisten-operator'] ? dataToPost['id-perawat-dokter-asisten-operator'] : '',
            Nama_Perawat_Dokter_Asisten_Operator: (doctorNurse && doctorNurse.length > 0) ? doctorNurse[0].Nama : '',
            Id_Perawat_Sirkular: dataToPost['id-perawat-sirkular'] ? dataToPost['id-perawat-sirkular'] : '',
            Nama_Perawat_Sirkular: (circularNurse && circularNurse.length > 0) ? circularNurse[0].Nama : '',
            Id_Dokter_Anestesi: dataToPost['id-dokter-anestesi'] ? dataToPost['id-dokter-anestesi'] : '',
            Nama_Dokter_Anestesi: (anesthesiaDoctor && anesthesiaDoctor.length > 0) ? anesthesiaDoctor[0].Nama : '',
            Nama_Dokter_Operator: (operatorDoctor && operatorDoctor.length > 0) ? operatorDoctor[0].Nama : '',
            Nama_Dokter: (doctor && doctor.length > 0) ? doctor[0].Nama : '',
            Nama_Perawat: (nurse && nurse.length > 0) ? nurse[0].Nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const checkboxFields = [
            'Anestesi_Topikal',
            'Anestesi_Infiltrasi',
            'Anestesi_Field_Block',
            'Lokasi_OD',
            'Lokasi_OS',
            'Lokal_Phaco_0',
            'Lokal_Phaco_1',
            'Lokal_Phaco_2',
            'Lokal_Phaco_3',
            'Lokal_Phaco_4',
            'Lokal_Phaco_5',
            'Lokal_Phaco_6',
            'Lokal_Phaco_7',
            'Lokal_Phaco_8',
            'Lokal_Phaco_9',
            'Lokal_Phaco_10',
            'Lokal_Phaco_11',
            'Lokal_Phaco_12',
            'Lokal_Phaco_13',
            'Lokal_Phaco_14',
            'Lokal_Phaco_15',
            'Lokal_Phaco_16',
            'Lokal_Phaco_17',
            'Lokal_Phaco_18',
            'Lokal_Phaco_19',
            'Lokal_Phaco_20',
            'Lokal_Injeksi_Intravitreal_0',
            'Lokal_Injeksi_Intravitreal_1',
            'Lokal_Injeksi_Intravitreal_2',
            'Lokal_Injeksi_Intravitreal_3',
            'Lokal_Injeksi_Intravitreal_4',
            'Lokal_Injeksi_Intravitreal_5',
            'Lokal_Injeksi_Intravitreal_6',
            'Lokal_Injeksi_Intravitreal_7',
            'Lokal_Injeksi_Intravitreal_8',
            'Lokal_Chalazion_0',
            'Lokal_Chalazion_1',
            'Lokal_Chalazion_2',
            'Lokal_Chalazion_3',
            'Lokal_Chalazion_4',
            'Lokal_Chalazion_5',
            'Lokal_Chalazion_6',
            'Lokal_Chalazion_7',
            'Lokal_Chalazion_8',
            'Lokal_Hordeolum_0',
            'Lokal_Hordeolum_1',
            'Lokal_Hordeolum_2',
            'Lokal_Hordeolum_3',
            'Lokal_Hordeolum_4',
            'Lokal_Hordeolum_5',
            'Lokal_Hordeolum_6',
            'Lokal_Hordeolum_7',
            'Lokal_Hordeolum_8',
            'Lokal_Pterygium_0',
            'Lokal_Pterygium_1',
            'Lokal_Pterygium_2',
            'Lokal_Pterygium_3',
            'Lokal_Pterygium_4',
            'Lokal_Pterygium_5',
            'Lokal_Pterygium_6',
            'Lokal_Pterygium_7',
            'Lokal_Pterygium_8',
            'Lokal_Pterygium_9',
            'Umum_Phaco_0',
            'Umum_Phaco_1',
            'Umum_Phaco_2',
            'Umum_Phaco_3',
            'Umum_Phaco_4',
            'Umum_Phaco_5',
            'Umum_Phaco_6',
            'Umum_Phaco_7',
            'Umum_Phaco_8',
            'Umum_Phaco_9',
            'Umum_Phaco_10',
            'Umum_Phaco_11',
            'Umum_Phaco_12',
            'Umum_Phaco_13',
            'Umum_Phaco_14',
            'Umum_Phaco_15',
            'Umum_Phaco_16',
            'Umum_Phaco_17',
            'Umum_Phaco_18',
            'Umum_Phaco_19',
            'Umum_Phaco_20',
            'Pembedahan_Opsi_Kanan',
            'Pembedahan_Opsi_Kiri',
            'Pembedahan_Opsi_Emergency',
            'Pembedahan_Opsi_Elektif',
            'General_Anestesi',
            'Sedasi',
            'Lokal_Pterygium_Check_Injeksi',
            'Lokal_Pterygium_Bara_Sclera',
            'Lokal_Pterygium_Conjungtiva',
          ]
          for (const key of checkboxFields) {
            const name = key.replace(/_/g, '-').toLowerCase();
            redisJsonData[key] = dataToPost[name] && dataToPost[name] === '1' ? 1 : 0;
          }

          const radioList = [
            'Lokal_Pterygium_Injeksi',
            'Lokal_Pterygium_Exicisi',
            'Lokal_Pterygium_Clg',
            'Lokal_Pterygium_Diteteskan',
          ]
          for (const key of radioList) {
            const name = key.replace(/_/g, '-').toLowerCase();
            redisJsonData[key] = dataToPost[name] ? parseInt(dataToPost[name]) : null;
          }

          const dripList = [
            'Lokal_Pterygium_Diteteskan_1',
            'Lokal_Pterygium_Diteteskan_2',
            'Lokal_Pterygium_Diteteskan_3',
            'Lokal_Pterygium_Diteteskan_4',
            'Lokal_Hordeolum_Diteteskan_1',
            'Lokal_Hordeolum_Diteteskan_2',
            'Lokal_Hordeolum_Diteteskan_3',
            'Lokal_Hordeolum_Diteteskan_4',
            'Lokal_Chalazion_Diteteskan_1',
            'Lokal_Chalazion_Diteteskan_2',
            'Lokal_Chalazion_Diteteskan_3',
            'Lokal_Chalazion_Diteteskan_4',
            'Lokal_Injeksi_Intravitreal_Diteteskan',
            'Lokal_Injeksi_Intravitreal_Diteteskan_1',
            'Lokal_Injeksi_Intravitreal_Diteteskan_2',
            'Lokal_Injeksi_Intravitreal_Diteteskan_3',
          ]
          for (const key of dripList) {
            const name = key.replace(/_/g, '-').toLowerCase();
            redisJsonData[key] = dataToPost[name] ? parseInt(dataToPost[name]) : null;
          }

          const textFields = [
            'Lokal_Injeksi_Intravitreal_Tipe',
            'Lokal_Injeksi_Intravitreal_Tipe_1',
            'Lokal_Injeksi_Intravitreal_Tipe_2',
            'Lokal_Injeksi_Intravitreal_Tipe_3',
            'Lokal_Injeksi_Intravitreal_Tipe_4',
            'Lokal_Injeksi_Intravitreal_Tipe_5',
            'Lokal_Injeksi_Intravitreal_Tipe_6',
            'Lokal_Injeksi_Intravitreal_Tipe_7',

            'Lokal_Injeksi_Intravitreal_Pengukuran',

            'Lokal_Injeksi_Intravitreal_Injeksi',
            'Lokal_Injeksi_Intravitreal_Injeksi_1',
            'Lokal_Injeksi_Intravitreal_Injeksi_2',
            'Lokal_Injeksi_Intravitreal_Injeksi_3',
            'Lokal_Injeksi_Intravitreal_Injeksi_4',
            'Lokal_Injeksi_Intravitreal_Injeksi_5',
            'Lokal_Injeksi_Intravitreal_Injeksi_6',

            'Lokal_Injeksi_Intravitreal_Injeksi_Lain_Teks',

            'Lokal_Chalazion_Injeksi',
            'Lokal_Chalazion_Bagian',

            'Lokal_Hordeolum_Injeksi',
            'Lokal_Hordeolum_Bagian',

            'Pemakaian_Implant',
            'Jenis_Pembedahan',
            'Operasi_Ke',
            'Profilaksis',
            'Anestesi_Infiltrasi_Tipe',
            'Anestesi_Field_Block_Tipe',
            'Responhipersensitivitas',
            'Kejadiantoksikasi',
            'Penyakit_Komplikasi',
            'Jaringan_Patologi',
            'Jaringan_Pendarahan',
            'Jumlah_Pendarahan',
            'Jumlah_Darah_Hilang',
            'Jumlah_Darah_Masuk',
            'Jenis_Operasi',
            'ID_Dokter_Operator',
            'Perawat_Tipe',
            'ID_Perawat_Dokter',
            'Diagnosa_Pra_Bedah',
            'Diagnosa_Pasca_Bedah',
            'Cmb_Diagnosa_Pasca_Bedah',
            'Cmb_Tindakan_Bedah',
            'Tanggal_Pembedahan',
            'Lama_Pembedahan',
            'Waktu_Start_Lama_Pembedahan',
            'Waktu_End_Lama_Pembedahan',

            'Keterangan_Pembedahan',
            'Tindakan_Pembedahan',
            'ID_Implant',
            'Antibiotik_Jenis',
            'Obat_Obat',
            'Lokal_Phaco_Gambar_Mata',
            'Lokal_Custom_Keterangan',
            'Lokal_Chalazion_Gambar_Pra',
            'Lokal_Chalazion_Gambar_Pasca',
            'Lokal_Hordeolum_Gambar_Pra',
            'Lokal_Hordeolum_Gambar_Pasca',
            'Lokal_Pterygium_Gambar_Pra',
            'Lokal_Pterygium_Gambar_Pasca',
            'Umum_Custom_Keterangan',
            'Umum_Phaco_Gambar_Mata',
            'Penyakit_Komplikasi_Teks',
            'Konsultasi_Intra_Operatif',
            'Intruksi_Pasca_Bedah',
            'Tanggal_Jaringan_Patologi',
            'Macam_Jaringan',
            'TTD_Dokter',
            'ID_Dokter',
            'TTD_Perawat',
            'ID_Perawat',
            'Profilaksis_Ya_Teks',
            'Antibiotik_Waktu',
            'Skala_Anestesi',
            'Grid_Chart_Data',
            'Grid_Chart_Img',

            'Distributor_Lensa',
            'No_Batch_Lensa',
            'Exp_Date_Lensa',
            'Kode_Inventory',
            'Nama_Inventory',
            'Url_Image_Stiker',
            'Name_Image_Stiker',
            'Type_Image_Stiker',
            'Size_Image_Stiker',

            'Us_Absolute_1',
            'Us_Absolute_2',
            'Us_Absolute_3',
            'Us_Absolute_4',
            'Us_Absolute_5',
            'Us_Absolute_6',
            'Us_Elapsed_1',
            'Us_Elapsed_2',
            'Us_Elapsed_3',
            'Us_Elapsed_4',
            'Us_Elapsed_5',
            'Us_Elapsed_6',

            'Us_Absolute_UP_1',
            'Us_Absolute_UP_2',
            'Us_Absolute_UP_3',
            'Us_Absolute_UP_4',
            'Us_Absolute_UP_5',
            'Us_Absolute_UP_6',
            'Us_Elapsed_UP_1',
            'Us_Elapsed_UP_2',
            'Us_Elapsed_UP_3',
            'Us_Elapsed_UP_4',
            'Us_Elapsed_UP_5',
            'Us_Elapsed_UP_6',
            'Responhipersensitivitas_Ya_Teks',
            'Kejadiantoksikasi_Ya_Teks',
            'Lokal_Phaco_Knife',
            'Umum_Phaco_Knife',
          ]

          for (const key of textFields) {
            const name = key.replace(/_/g, '-').toLowerCase();
            redisJsonData[key] = dataToPost[name] ? dataToPost[name] : '';
          }

          redisJsonData.Lokal_Phaco_Gambar_Mata = (redisJsonData.Lokal_Phaco_Gambar_Mata && redisJsonData.Lokal_Phaco_Gambar_Mata !== '' && isValidFile(redisJsonData.Lokal_Phaco_Gambar_Mata)) ? global.storage.cleanUrl(redisJsonData.Lokal_Phaco_Gambar_Mata) : '';

          redisJsonData.Umum_Phaco_Gambar_Mata = (redisJsonData.Umum_Phaco_Gambar_Mata && redisJsonData.Umum_Phaco_Gambar_Mata !== '' && isValidFile(redisJsonData.Umum_Phaco_Gambar_Mata)) ? global.storage.cleanUrl(redisJsonData.Umum_Phaco_Gambar_Mata) : '';

          redisJsonData.Lokal_Chalazion_Gambar_Pra = (redisJsonData.Lokal_Chalazion_Gambar_Pra && redisJsonData.Lokal_Chalazion_Gambar_Pra !== '' && isValidFile(redisJsonData.Lokal_Chalazion_Gambar_Pra)) ? global.storage.cleanUrl(redisJsonData.Lokal_Chalazion_Gambar_Pra) : '';

          redisJsonData.Lokal_Chalazion_Gambar_Pasca = (redisJsonData.Lokal_Chalazion_Gambar_Pasca && redisJsonData.Lokal_Chalazion_Gambar_Pasca !== '' && isValidFile(redisJsonData.Lokal_Chalazion_Gambar_Pasca)) ? global.storage.cleanUrl(redisJsonData.Lokal_Chalazion_Gambar_Pasca) : '';

          redisJsonData.Lokal_Hordeolum_Gambar_Pra = (redisJsonData.Lokal_Hordeolum_Gambar_Pra && redisJsonData.Lokal_Hordeolum_Gambar_Pra !== '' && isValidFile(redisJsonData.Lokal_Hordeolum_Gambar_Pra)) ? global.storage.cleanUrl(redisJsonData.Lokal_Hordeolum_Gambar_Pra) : '';

          redisJsonData.Lokal_Hordeolum_Gambar_Pasca = (redisJsonData.Lokal_Hordeolum_Gambar_Pasca && redisJsonData.Lokal_Hordeolum_Gambar_Pasca !== '' && isValidFile(redisJsonData.Lokal_Hordeolum_Gambar_Pasca)) ? global.storage.cleanUrl(redisJsonData.Lokal_Hordeolum_Gambar_Pasca) : '';

          redisJsonData.Lokal_Pterygium_Gambar_Pra = (redisJsonData.Lokal_Pterygium_Gambar_Pra && redisJsonData.Lokal_Pterygium_Gambar_Pra !== '' && isValidFile(redisJsonData.Lokal_Pterygium_Gambar_Pra)) ? global.storage.cleanUrl(redisJsonData.Lokal_Pterygium_Gambar_Pra) : '';

          redisJsonData.Lokal_Pterygium_Gambar_Pasca = (redisJsonData.Lokal_Pterygium_Gambar_Pasca && redisJsonData.Lokal_Pterygium_Gambar_Pasca !== '' && isValidFile(redisJsonData.Lokal_Pterygium_Gambar_Pasca)) ? global.storage.cleanUrl(redisJsonData.Lokal_Pterygium_Gambar_Pasca) : '';

          redisJsonData.TTD_Dokter = (redisJsonData.TTD_Dokter && redisJsonData.TTD_Dokter !== '' && isValidFile(redisJsonData.TTD_Dokter)) ? global.storage.cleanUrl(redisJsonData.TTD_Dokter) : '';

          redisJsonData.TTD_Perawat = (redisJsonData.TTD_Perawat && redisJsonData.TTD_Perawat !== '' && isValidFile(redisJsonData.TTD_Perawat)) ? global.storage.cleanUrl(redisJsonData.TTD_Perawat) : '';

          redisJsonData.Url_Image_Stiker = (redisJsonData.Url_Image_Stiker && redisJsonData.Url_Image_Stiker !== '' && isValidFile(redisJsonData.Url_Image_Stiker)) ? global.storage.cleanUrl(redisJsonData.Url_Image_Stiker) : '';

          redisJsonData.Grid_Chart_Img = (redisJsonData.Grid_Chart_Img && redisJsonData.Grid_Chart_Img !== '' && isValidFile(redisJsonData.Grid_Chart_Img)) ? global.storage.cleanUrl(redisJsonData.Grid_Chart_Img) : '';

          const ok: IOperatieKamer = {
            Laporan_Pembedahan_Anestesi: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.OK && newEmrData.OK !== null) {
            newEmrData.OK.Laporan_Pembedahan_Anestesi = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.OK.Laporan_Pembedahan_Anestesi',
              updateDocument.newDocument.OK.Laporan_Pembedahan_Anestesi,
            );
            ElasticLoggerService().createLog(req, '/ok/laporan-pembedahan-anestesi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.OK = ok;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.OK', updateDocument.newDocument.OK);
            ElasticLoggerService().createLog(req, '/ok/laporan-pembedahan-anestesi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/ok/laporan-pembedahan-anestesi', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/ok/laporan-pembedahan-anestesi', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/ok/laporan-pembedahan-anestesi', `${err}`);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  })

OK.route('/ok/checklist-keselamatan-pasien-operasi-form')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'No_MR'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.OK');
      if (checkObject !== null && checkObject.includes("Checklist_Keselamatan")) {
        emrKeys.push("OK.Checklist_Keselamatan");
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);

      if (result && result !== null) {
        const form = (result['OK.Checklist_Keselamatan']) ? result['OK.Checklist_Keselamatan'] : {};

        const signImages = [
          'Sign_In_TTD_Dokter',
          'Sign_In_TTD_Penata',
          'Sign_In_TTD_Perawat',
          'Time_Out_TTD_Dokter',
          'Time_Out_TTD_Penata',
          'Time_Out_TTD_Perawat',
          'Sign_Out_TTD_Mata',
          'Sign_Out_TTD_Dokter',
          'Sign_Out_TTD_Penata',
          'Sign_Out_TTD_Perawat',
          'Sign_Out_TTD_Sirkuler',
        ]

        //add signUrl to all images
        for (const sign of signImages) {
          form[sign] = (form[sign] && form[sign] !== '' && isValidFile(form[sign])) ? await global.storage.signUrl(form[sign], new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';
        }


        const data: ICKPO = {
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

OK.route('/ok/checklist-keselamatan-pasien-operasi-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: any = req.body;

          const redisJsonData: any = {
            Waktu: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const rooms = [
            'Sign_In_Ruangan_Perawat',
            'Sign_In_Ruangan_Penata',
            'Sign_In_Ruangan_Dokter',
            'Time_Out_Ruangan_Perawat',
            'Time_Out_Ruangan_Penata',
            'Time_Out_Ruangan_Dokter',
            'Time_Out_Ruangan_Bedah',
            'Sign_Out_Ruangan_Perawat',
            'Sign_Out_Ruangan_Penata',
            'Sign_Out_Ruangan_Dokter',
            'Sign_Out_Ruangan_Bedah',
          ]

          for (const room of rooms) {
            const name = room.replace(/_/g, '-').toLowerCase();
            redisJsonData[room] = (dataToPost[name] && dataToPost[name] === '1') ? 1 : 0;
          }

          const radios = [
            'Sign_In_Informed',
            'Sign_In_Tanda',
            'Sign_In_Lengkap',
            'Sign_In_Implan',
            'Sign_In_Pulse_Oksimetri',
            'Sign_In_Alergi',
            'Sign_In_Pernafasan',
            'Sign_In_Pendarahan',
            'Time_Out_Perkenalan_Diri',
            'Time_Out_Baca_Ulang',
            'Time_Out_Profilaksis_Antibiotik',
            'Time_Out_Tidak_Rutin',
            'Time_Out_Pendarahan',
            'Time_Out_Anestesi_Khusus',
            'Time_Out_Steril',
            'Time_Out_Peralatan',
            'Time_Out_Hasil',
            'Sign_Out_Nama_Tindakan',
            'Sign_Out_Kelengkapan_Alat',
            'Sign_Out_Pelabelan_Spesimen',
            'Sign_Out_Masalah_Peralatan',
            'Sign_Out_Catatan_Khusus',
          ]

          for (const radio of radios) {
            const name = radio.replace(/_/g, '-').toLowerCase();
            redisJsonData[radio] = (dataToPost[name]) ? parseInt(dataToPost[name]) : undefined;
          }

          const texts = [
            'Sign_In_Waktu',
            'Time_Out_Waktu',
            'Sign_Out_Waktu',
            'Time_Out_Tidak_Rutin_Waktu',
            'Time_Out_Masalah',
            'Sign_In_ID_Dokter',
            'Sign_In_ID_Penata',
            'Sign_In_ID_Perawat',
            'Time_Out_ID_Dokter',
            'Time_Out_ID_Penata',
            'Time_Out_ID_Perawat',
            'Sign_Out_ID_Mata',
            'Sign_Out_ID_Dokter',
            'Sign_Out_ID_Penata',
            'Sign_Out_ID_Perawat',
            'Sign_Out_ID_Sirkuler',
          ]

          for (const text of texts) {
            const name = text.replace(/_/g, '-').toLowerCase();
            redisJsonData[text] = dataToPost[name] ? dataToPost[name] : '';
          }

          const doctorsName = [
            'Sign_In_ID_Dokter',
            'Time_Out_ID_Dokter',
            'Sign_Out_ID_Mata',
            'Sign_Out_ID_Dokter',
          ]

          const nurseName = [
            'Sign_In_ID_Penata',
            'Sign_In_ID_Perawat',
            'Time_Out_ID_Penata',
            'Time_Out_ID_Perawat',
            'Sign_Out_ID_Penata',
            'Sign_Out_ID_Perawat',
            'Sign_Out_ID_Sirkuler',
          ]

          for (const name of doctorsName) {
            const newKey = name.replace('ID', 'Nama');
            const newId = name.replace(/_/g, '-').toLowerCase();

            const doctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost[newId]}')]`);

            redisJsonData[newKey] = (doctor && Array.isArray(doctor) && doctor.length > 0 && doctor[0].Nama) ? doctor[0].Nama : '';
          }

          for (const name of nurseName) {
            const newKey = name.replace('ID', 'Nama');
            const newId = name.replace(/_/g, '-').toLowerCase();

            const nurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==1&&@.Status_Dokter==0&&@.ID_Karyawan=='${dataToPost[newId]}')]`);

            redisJsonData[newKey] = (nurse && Array.isArray(nurse) && nurse.length > 0 && nurse[0].Nama) ? nurse[0].Nama : '';
          }

          const signImages = [
            'Sign_In_TTD_Dokter',
            'Sign_In_TTD_Penata',
            'Sign_In_TTD_Perawat',

            'Time_Out_TTD_Dokter',
            'Time_Out_TTD_Penata',
            'Time_Out_TTD_Perawat',

            'Sign_Out_TTD_Mata',
            'Sign_Out_TTD_Dokter',
            'Sign_Out_TTD_Penata',
            'Sign_Out_TTD_Perawat',
            'Sign_Out_TTD_Sirkuler',
          ]

          for (const sign of signImages) {
            const name = sign.replace(/_/g, '-').toLowerCase();
            redisJsonData[sign] = (dataToPost[name] && dataToPost[name] !== '' && isValidFile(dataToPost[name])) ? global.storage.cleanUrl(dataToPost[name]) : undefined;
          }

          const ok: IOperatieKamer = {
            Checklist_Keselamatan: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.OK && newEmrData.OK !== null) {
            newEmrData.OK.Checklist_Keselamatan = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.OK.Checklist_Keselamatan',
              updateDocument.newDocument.OK.Checklist_Keselamatan,
            );
            ElasticLoggerService().createLog(req, '/ok/checklist-keselamatan', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.OK = ok;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.OK', updateDocument.newDocument.OK);
            ElasticLoggerService().createLog(req, '/ok/checklist-keselamatan', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/ok/checklist-keselamatan', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/ok/checklist-keselamatan', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/ok/checklist-keselamatan', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  })

OK.route('/ok/catatan-keperawatan-intra-operasi-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'No_MR'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.OK');
      if (checkObject !== null && checkObject.includes("Catatan_Keperawatan_Intra_Operasi")) {
        emrKeys.push("OK.Catatan_Keperawatan_Intra_Operasi");
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form = (result['OK.Catatan_Keperawatan_Intra_Operasi']) ? result['OK.Catatan_Keperawatan_Intra_Operasi'] : {};

        form.TTD_Perawat_Instrumen = (form.TTD_Perawat_Instrumen && form.TTD_Perawat_Instrumen !== '' && isValidFile(form.TTD_Perawat_Instrumen)) ? await global.storage.signUrl(form.TTD_Perawat_Instrumen, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        form.TTD_Perawat_Sirkuler = (form.TTD_Perawat_Sirkuler && form.TTD_Perawat_Sirkuler !== '' && isValidFile(form.TTD_Perawat_Sirkuler)) ? await global.storage.signUrl(form.TTD_Perawat_Sirkuler, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        form.Url_Image_Stiker = (form.Url_Image_Stiker && form.Url_Image_Stiker !== '' && isValidFile(form.Url_Image_Stiker)) ? await global.storage.signUrl(form.Url_Image_Stiker, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        const data: ICatatanKeperawatan = {
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

OK.route('/ok/catatan-keperawatan-intra-operasi-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: any = req.body;
          const redisJsonData: any = {
            Tanggal: dataToPost.tanggal ? dataToPost.tanggal : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const radios = [
            'Time_Out',
            'Time_Out_Waktu',
            'Ketersediaan_Instrumen',
            'Ketersediaan_Prothese',
            'Tipe_Operasi',
            'Tipe_Pembiusan',
            'Tingkat_Kesadaran',
            'Status_Emosi',
            'Posisi_Kanula',
            'Posisi_Operasi',
            'Posisi_Lengan',
            'Posisi_Alat',
            'Kateter_Urine',
            'Persiapan_Kulit',
            'Pemakaian_Diathermy',
            'Lokasi_Elektrode',
            'Unit_Pemanas',
            'Unit_Pendingin',
            'Pemakaian_Laser',
            'Pemakaian_Implant',
            'Irigasi_Luka',
            'Pemakaian_Cairan',
            'Balutan_Cairan',
            'Spesimen_Cairan',
          ];

          for (const radio of radios) {
            const name = radio.replace(/_/g, '-').toLowerCase();
            redisJsonData[radio] = (dataToPost[name]) ? parseInt(dataToPost[name]) : undefined;
          }

          const checkboxes = [
            'Posisi_Kanula_1',
            'Posisi_Kanula_2',
            'Posisi_Kanula_3',
            'Posisi_Kanula_4',
            'Posisi_Kanula_5',
            'Posisi_Kanula_6',
            'Posisi_Kanula_7',
            'Posisi_Kanula_8',
            'Posisi_Operasi_1',
            'Posisi_Operasi_2',
            'Posisi_Operasi_3',
            'Posisi_Operasi_4',
            'Posisi_Operasi_5',
            'Posisi_Lengan_1',
            'Posisi_Lengan_2',
            'Posisi_Lengan_3',
            'Posisi_Lengan_4',
            'Posisi_Lengan_5',
            'Lokasi_Elektrode_1',
            'Lokasi_Elektrode_2',
            'Lokasi_Elektrode_3',
            'Lokasi_Elektrode_4',
            'Lokasi_Elektrode_5',
            'Kondisi_Sebelum_1',
            'Kondisi_Sebelum_2',
            'Kondisi_Sebelum_3',
            'Kondisi_Sesudah_1',
            'Kondisi_Sesudah_2',
            'Kondisi_Sesudah_3',
            'Pemakaian_Diathermy_1',
            'Pemakaian_Diathermy_2',
            'Pemakaian_Diathermy_3',
          ];

          for (const checkbox of checkboxes) {
            const name = checkbox.replace(/_/g, '-').toLowerCase();
            redisJsonData[checkbox] = (dataToPost[name]) ? dataToPost[name] : 0;
          }

          const texts = [
            'Jenis_Operasi',
            'Time_Out_Waktu',
            'Ketersediaan_Instrumen_Waktu',
            'Ketersediaan_Prothese_Waktu',
            'Mulai_Waktu',
            'Selesai_Waktu',
            'Posisi_Kanula_Teks',
            'Posisi_Kanula_Lain_Teks',
            'Tingkat_Kesadaran_Lain_Teks',
            'Posisi_Operasi_Teks',
            'Posisi_Operasi_Lain_Teks',
            'Posisi_Operasi_Diawasi',
            'Posisi_Lengan_Lain_Teks',
            'Posisi_Alat_Lain_Teks',
            'Persiapan_Kulit_Lain_Teks',
            'Lokasi_Elektrode_Lain_Teks',
            'Kondisi_Sebelum',
            'Kondisi_Sesudah',
            'Kondisi_Sebelum_Lain_Teks',
            'Kondisi_Sesudah_Lain_Teks',
            'Kode_Unit_Elektrosurgikal',
            'Pemanas_Pengaturan_Temperatur',
            'Pemanas_Mulai_Waktu',
            'Pemanas_Selesai_Waktu',
            'Pemanas_Kode_Unit',
            'Pendingin_Pengaturan_Temperatur',
            'Pendingin_Mulai_Waktu',
            'Pendingin_Selesai_Waktu',
            'Pendingin_Kode_Unit',
            'Laser_Power',
            'Laser_Durasi',
            'Laser_Kode_Model',
            'Laser_Tanggal',
            'Laser_Interval',
            'Laser_Jumlah_Tembak',
            'Irigasi_Luka_Lain_Teks',
            'Pemakaian_Cairan_Air_Teks',
            'Pemakaian_Cairan_Lain_Teks',
            'Pemakaian_Cairan_Sodium_Teks',
            'Pemakaian_Cairan_Histologi_Teks',
            'Pemakaian_Cairan_Sitologi_Teks',
            'Pemakaian_Cairan_Kultur_Teks',
            'Spesimen_Cairan_Pemeriksaan',
            'Spesimen_Jumlah_Jaringan',
            'Spesimen_Jenis_Jaringan',
            'Spesimen_Keterangan',
            'ID_Perawat_Instrumen',
            'ID_Perawat_Sirkuler',
            'ID_Posisi_Operasi_Diawasi',
            'ID_Laser_Diawasi_1',
            'ID_Laser_Diawasi_2',
            'ID_Laser_Diawasi_3',
            'Name_Image_Stiker',
            'Type_Image_Stiker',
            'Size_Image_Stiker',
            'Implant_Pabrik',
            'Implant_Type',
            'Implant_Size',
            'Implant_Seri',
          ];

          for (const text of texts) {
            const name = text.replace(/_/g, '-').toLowerCase();
            redisJsonData[text] = (dataToPost[name]) ? dataToPost[name] : '';
          }

          const images = [
            'TTD_Perawat_Instrumen',
            'TTD_Perawat_Sirkuler',
            'Url_Image_Stiker',
          ]

          for (const image of images) {
            const name = image.replace(/_/g, '-').toLowerCase();
            redisJsonData[image] = (dataToPost[name] && dataToPost[name] !== '' && isValidFile(dataToPost[name])) ? global.storage.cleanUrl(dataToPost[name]) : undefined;
          }

          const laserName = [
            'ID_Laser_Diawasi_1',
            'ID_Laser_Diawasi_2',
            'ID_Laser_Diawasi_3',
          ]

          for (const laser of laserName) {
            const newKey = laser.replace('ID', 'Nama');
            const newId = laser.replace(/_/g, '-').toLowerCase();

            const officer = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost[newId]}')]`);

            redisJsonData[newKey] = (officer && Array.isArray(officer) && officer.length > 0 && officer[0].Nama) ? officer[0].Nama : '';
          }

          const names = [
            'ID_Posisi_Operasi_Diawasi',
            'ID_Perawat_Instrumen',
            'ID_Perawat_Sirkuler',
          ]

          for (const name of names) {
            const newKey = name.replace('ID', 'Nama');
            const newId = name.replace(/_/g, '-').toLowerCase();

            const officer = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost[newId]}')]`);

            redisJsonData[newKey] = (officer && Array.isArray(officer) && officer.length > 0 && officer[0].Nama) ? officer[0].Nama : '';
          }

          const ok: IOperatieKamer = {
            Catatan_Keperawatan_Intra_Operasi: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.OK && newEmrData.OK !== null) {
            newEmrData.OK.Catatan_Keperawatan_Intra_Operasi = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.OK.Catatan_Keperawatan_Intra_Operasi',
              updateDocument.newDocument.OK.Catatan_Keperawatan_Intra_Operasi,
            );
            ElasticLoggerService().createLog(req, '/ok/catatan-keperawatan-intra-operasi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.OK = ok;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.OK', updateDocument.newDocument.OK);
            ElasticLoggerService().createLog(req, '/ok/catatan-keperawatan-intra-operasi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/ok/catatan-keperawatan-intra-operasi', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/ok/catatan-keperawatan-intra-operasi', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/ok/catatan-keperawatan-intra-operasi', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  })

OK.route('/ok/catatan-keperawatan-pra-operasi-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'No_MR'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.OK');
      const checkOutpatient = await global.medicalRecord.keys(req.emrID, '.Rawat_Jalan');
      const checkInpatient = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      if (checkObject !== null && checkObject.includes("Catatan_Keperawatan_Pra_Operasi")) {
        emrKeys.push("OK.Catatan_Keperawatan_Pra_Operasi");
      }
      if (checkOutpatient !== null && checkOutpatient.includes('Catatan_Keperawatan_Pra_Operasi')) {
        emrKeys.push("Rawat_Jalan.Catatan_Keperawatan_Pra_Operasi");
      }
      if (checkInpatient !== null && checkInpatient.includes("Catatan_Keperawatan_Pra_Operasi")) {
        emrKeys.push("Rawat_Inap.Catatan_Keperawatan_Pra_Operasi");
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form = (result['OK.Catatan_Keperawatan_Pra_Operasi']) ? result['OK.Catatan_Keperawatan_Pra_Operasi'] : {};
        const rajal = (result['Rawat_Jalan.Catatan_Keperawatan_Pra_Operasi']) ? result['Rawat_Jalan.Catatan_Keperawatan_Pra_Operasi'] : {};
        const ranap = (result['Rawat_Inap.Catatan_Keperawatan_Pra_Operasi']) ? result['Rawat_Inap.Catatan_Keperawatan_Pra_Operasi'] : {};

        if (rajal.TTD_Perawat_Penerima && rajal.TTD_Perawat_Penerima !== '' && isValidFile(rajal.TTD_Perawat_Penerima)) {
          rajal.TTD_Perawat_Penerima = await global.storage.signUrl(rajal.TTD_Perawat_Penerima, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (rajal.TTD_Perawat_Ruangan && rajal.TTD_Perawat_Ruangan !== '' && isValidFile(rajal.TTD_Perawat_Ruangan)) {
          rajal.TTD_Perawat_Ruangan = await global.storage.signUrl(rajal.TTD_Perawat_Ruangan, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
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
          rajal,
          ranap,
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

OK.route('/ok/catatan-keperawatan-pra-operasi-process')
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
          const fixedData = OKCatatanKeperawatanPraOp.createFromJson(dataToPost);
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

            'Lain_Site_Marking',
            'Lain_Penjelasan_Singkat',
          ];

          for (const item of radios) {
            const dashedKey = item.toLowerCase();

            redisJsonData[item] = dataToPost[dashedKey] && dataToPost[dashedKey] === '1' ? 1 : dataToPost[dashedKey] && dataToPost[dashedKey] === '0' ? 0 : null;
            redisJsonData[`${item}_Keterangan`] = dataToPost[`${dashedKey}_keterangan`] ?? '';
          }

          const ok: IOperatieKamer = {
            Catatan_Keperawatan_Pra_Operasi: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.OK && newEmrData.OK !== null) {
            newEmrData.OK.Catatan_Keperawatan_Pra_Operasi = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.OK.Catatan_Keperawatan_Pra_Operasi',
              updateDocument.newDocument.OK.Catatan_Keperawatan_Pra_Operasi,
            );
            ElasticLoggerService().createLog(req, '/ok/catatan-keperawatan-pra-operasi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.OK = ok;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.OK', updateDocument.newDocument.OK);
            ElasticLoggerService().createLog(req, '/ok/catatan-keperawatan-pra-operasi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/ok/catatan-keperawatan-pra-operasi', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/ok/catatan-keperawatan-pra-operasi', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/ok/catatan-keperawatan-pra-operasi', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  })

OK.route('/ok/catatan-keperawatan-peri-operatif-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'No_MR'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.OK');
      if (checkObject !== null && checkObject.includes("Catatan_Keperawatan_Intra_Operasi")) {
        emrKeys.push("OK.Catatan_Keperawatan_Intra_Operasi");
      }
      if (checkObject !== null && checkObject.includes('Intra_Operatif')) {
        emrKeys.push('OK.Intra_Operatif');
      }
      if (checkObject !== null && checkObject.includes('Catatan_Keperawatan_Pasca_Operasi')) {
        emrKeys.push('OK.Catatan_Keperawatan_Pasca_Operasi');
      }
      if (checkObject !== null && checkObject.includes('Pasca_Operatif')) {
        emrKeys.push('OK.Pasca_Operatif');
      }
      const checkUgd = await global.medicalRecord.keys(req.emrID, '.UGD');
      if (checkUgd !== null && checkUgd.includes('Assesmen')) {
        emrKeys.push('UGD.Assesmen');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const ck_intra_operasi = (result['OK.Catatan_Keperawatan_Intra_Operasi']) ? result['OK.Catatan_Keperawatan_Intra_Operasi'] : {};
        const intra_operatif = (result['OK.Intra_Operatif']) ? result['OK.Intra_Operatif'] : {};
        const ck_pasca_operasi = (result['OK.Catatan_Keperawatan_Pasca_Operasi']) ? result['OK.Catatan_Keperawatan_Pasca_Operasi'] : {};
        const pasca_operatif = (result['OK.Pasca_Operatif']) ? result['OK.Pasca_Operatif'] : {};
        const assessmentUgd = result['UGD.Assesmen'] ?? {};
        const ews = await getFirstEws(req.emrID);

        if (ck_intra_operasi.TTD_Perawat_Instrumen && ck_intra_operasi.TTD_Perawat_Instrumen !== '' && isValidFile(ck_intra_operasi.TTD_Perawat_Instrumen)) {
          ck_intra_operasi.TTD_Perawat_Instrumen = await global.storage.signUrl(ck_intra_operasi.TTD_Perawat_Instrumen, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }

        if (ck_intra_operasi.TTD_Perawat_Sirkuler && ck_intra_operasi.TTD_Perawat_Sirkuler !== '' && isValidFile(ck_intra_operasi.TTD_Perawat_Sirkuler)) {
          ck_intra_operasi.TTD_Perawat_Sirkuler = await global.storage.signUrl(ck_intra_operasi.TTD_Perawat_Sirkuler, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }

        if (ck_intra_operasi.Url_Image_Stiker && ck_intra_operasi.Url_Image_Stiker !== '' && isValidFile(ck_intra_operasi.Url_Image_Stiker)) {
          ck_intra_operasi.Url_Image_Stiker = await global.storage.signUrl(ck_intra_operasi.Url_Image_Stiker, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (intra_operatif.TTD_Perawat_Kecemasan && intra_operatif.TTD_Perawat_Kecemasan !== '' && isValidFile(intra_operatif.TTD_Perawat_Kecemasan)) {
          intra_operatif.TTD_Perawat_Kecemasan = await global.storage.signUrl(intra_operatif.TTD_Perawat_Kecemasan, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (intra_operatif.TTD_Perawat_Penglihatan && intra_operatif.TTD_Perawat_Penglihatan !== '' && isValidFile(intra_operatif.TTD_Perawat_Penglihatan)) {
          intra_operatif.TTD_Perawat_Penglihatan = await global.storage.signUrl(intra_operatif.TTD_Perawat_Penglihatan, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (intra_operatif.TTD_Perawat_Nyeri && intra_operatif.TTD_Perawat_Nyeri !== '' && isValidFile(intra_operatif.TTD_Perawat_Nyeri)) {
          intra_operatif.TTD_Perawat_Nyeri = await global.storage.signUrl(intra_operatif.TTD_Perawat_Nyeri, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (intra_operatif.TTD_Perawat_Infeksi && intra_operatif.TTD_Perawat_Infeksi !== '' && isValidFile(intra_operatif.TTD_Perawat_Infeksi)) {
          intra_operatif.TTD_Perawat_Infeksi = await global.storage.signUrl(intra_operatif.TTD_Perawat_Infeksi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (intra_operatif.TTD_Perawat_Tinggi_Cedera && intra_operatif.TTD_Perawat_Tinggi_Cedera !== '' && isValidFile(intra_operatif.TTD_Perawat_Tinggi_Cedera)) {
          intra_operatif.TTD_Perawat_Tinggi_Cedera = await global.storage.signUrl(intra_operatif.TTD_Perawat_Tinggi_Cedera, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (intra_operatif.TTD_Perawat_Kekurangan_Cairan && intra_operatif.TTD_Perawat_Kekurangan_Cairan !== '' && isValidFile(intra_operatif.TTD_Perawat_Kekurangan_Cairan)) {
          intra_operatif.TTD_Perawat_Kekurangan_Cairan = await global.storage.signUrl(intra_operatif.TTD_Perawat_Kekurangan_Cairan, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (intra_operatif.TTD_Perawat_Gangguan_Pola_Nafas && intra_operatif.TTD_Perawat_Gangguan_Pola_Nafas !== '' && isValidFile(intra_operatif.TTD_Perawat_Gangguan_Pola_Nafas)) {
          intra_operatif.TTD_Perawat_Gangguan_Pola_Nafas = await global.storage.signUrl(intra_operatif.TTD_Perawat_Gangguan_Pola_Nafas, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (ck_pasca_operasi.TTD_Perawat && ck_pasca_operasi.TTD_Perawat !== '' && isValidFile(ck_pasca_operasi)) {
          ck_pasca_operasi.TTD_Perawat = await global.storage.signUrl(ck_pasca_operasi.TTD_Perawat, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (pasca_operatif.TTD_Perawat_Nyeri && pasca_operatif.TTD_Perawat_Nyeri !== '' && isValidFile(pasca_operatif.TTD_Perawat_Nyeri)) {
          pasca_operatif.TTD_Perawat_Nyeri = await global.storage.signUrl(pasca_operatif.TTD_Perawat_Nyeri, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (pasca_operatif.TTD_Perawat_Infeksi && pasca_operatif.TTD_Perawat_Infeksi !== '' && isValidFile(pasca_operatif.TTD_Perawat_Infeksi)) {
          pasca_operatif.TTD_Perawat_Infeksi = await global.storage.signUrl(pasca_operatif.TTD_Perawat_Infeksi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (pasca_operatif.TTD_Perawat_Perubahan && pasca_operatif.TTD_Perawat_Perubahan !== '' && isValidFile(pasca_operatif.TTD_Perawat_Perubahan)) {
          pasca_operatif.TTD_Perawat_Perubahan = await global.storage.signUrl(pasca_operatif.TTD_Perawat_Perubahan, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (pasca_operatif.TTD_Perawat_Kecemasan_Pasca && pasca_operatif.TTD_Perawat_Kecemasan_Pasca !== '' && isValidFile(pasca_operatif.TTD_Perawat_Kecemasan_Pasca)) {
          pasca_operatif.TTD_Perawat_Kecemasan_Pasca = await global.storage.signUrl(pasca_operatif.TTD_Perawat_Kecemasan_Pasca, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }

        const data: any = {
          EMR_ID: req.emrID ? req.emrID : '',
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          ck_intra_operasi,
          intra_operatif,
          ck_pasca_operasi,
          pasca_operatif,
          asesmen: assessmentUgd,
          ews: ews && ews.Td && ews.Td.includes('/') ? ews : ews && ews.Td && ews.Td_1 ? {...ews, Td: `${ews.Td}/${ews.Td_1}`} : {},
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

OK.route('/ok/catatan-keperawatan-peri-operatif-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: any = req.body;

          //Catatan Keperawatan Peri Operatif
          const ckIntraOperasi: any = {
            Tanggal: dataToPost.tanggal ? dataToPost.tanggal : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const radios = [
            'Time_Out',
            'Time_Out_Waktu',
            'Ketersediaan_Instrumen',
            'Ketersediaan_Prothese',
            'Tipe_Operasi',
            'Tipe_Pembiusan',
            'Tingkat_Kesadaran',
            'Status_Emosi',
            'Posisi_Kanula',
            'Posisi_Operasi',
            'Posisi_Lengan',
            'Posisi_Alat',
            'Kateter_Urine',
            'Persiapan_Kulit',
            'Pemakaian_Diathermy',
            'Lokasi_Elektrode',
            'Unit_Pemanas',
            'Unit_Pendingin',
            'Pemakaian_Laser',
            'Pemakaian_Implant',
            'Irigasi_Luka',
            'Pemakaian_Cairan',
            'Balutan_Cairan',
            'Spesimen_Cairan',
          ];

          for (const radio of radios) {
            const name = radio.replace(/_/g, '-').toLowerCase();
            ckIntraOperasi[radio] = (dataToPost[name]) ? parseInt(dataToPost[name]) : undefined;
          }

          const checkboxes = [
            'Posisi_Kanula_1',
            'Posisi_Kanula_2',
            'Posisi_Kanula_3',
            'Posisi_Kanula_4',
            'Posisi_Kanula_5',
            'Posisi_Kanula_6',
            'Posisi_Kanula_7',
            'Posisi_Kanula_8',
            'Posisi_Operasi_1',
            'Posisi_Operasi_2',
            'Posisi_Operasi_3',
            'Posisi_Operasi_4',
            'Posisi_Operasi_5',
            'Posisi_Lengan_1',
            'Posisi_Lengan_2',
            'Posisi_Lengan_3',
            'Posisi_Lengan_4',
            'Posisi_Lengan_5',
            'Lokasi_Elektrode_1',
            'Lokasi_Elektrode_2',
            'Lokasi_Elektrode_3',
            'Lokasi_Elektrode_4',
            'Lokasi_Elektrode_5',
            'Kondisi_Sebelum_1',
            'Kondisi_Sebelum_2',
            'Kondisi_Sebelum_3',
            'Kondisi_Sesudah_1',
            'Kondisi_Sesudah_2',
            'Kondisi_Sesudah_3',
            'Pemakaian_Diathermy_1',
            'Pemakaian_Diathermy_2',
            'Pemakaian_Diathermy_3',
          ];

          for (const checkbox of checkboxes) {
            const name = checkbox.replace(/_/g, '-').toLowerCase();
            ckIntraOperasi[checkbox] = (dataToPost[name]) ? dataToPost[name] : 0;
          }

          const texts = [
            'Jenis_Operasi',
            'Time_Out_Waktu',
            'Ketersediaan_Instrumen_Waktu',
            'Ketersediaan_Prothese_Waktu',
            'Mulai_Waktu',
            'Selesai_Waktu',
            'Posisi_Kanula_Teks',
            'Posisi_Kanula_Lain_Teks',
            'Tingkat_Kesadaran_Lain_Teks',
            'Posisi_Operasi_Teks',
            'Posisi_Operasi_Lain_Teks',
            'Posisi_Operasi_Diawasi',
            'Posisi_Lengan_Lain_Teks',
            'Posisi_Alat_Lain_Teks',
            'Persiapan_Kulit_Lain_Teks',
            'Lokasi_Elektrode_Lain_Teks',
            'Kondisi_Sebelum',
            'Kondisi_Sesudah',
            'Kondisi_Sebelum_Lain_Teks',
            'Kondisi_Sesudah_Lain_Teks',
            'Kode_Unit_Elektrosurgikal',
            'Pemanas_Pengaturan_Temperatur',
            'Pemanas_Mulai_Waktu',
            'Pemanas_Selesai_Waktu',
            'Pemanas_Kode_Unit',
            'Pendingin_Pengaturan_Temperatur',
            'Pendingin_Mulai_Waktu',
            'Pendingin_Selesai_Waktu',
            'Pendingin_Kode_Unit',
            'Laser_Power',
            'Laser_Durasi',
            'Laser_Kode_Model',
            'Laser_Tanggal',
            'Laser_Interval',
            'Laser_Jumlah_Tembak',
            'Jenis_Balutan',
            'Jenis_Spesimen',
            'Lain_Spesimen',
            'Tanggal_Kadaluarsa',
            'Irigasi_Luka_Lain_Teks',
            'Pemakaian_Cairan_Air_Teks',
            'Pemakaian_Cairan_Lain_Teks',
            'Pemakaian_Cairan_Sodium_Teks',
            'Pemakaian_Cairan_Histologi_Teks',
            'Pemakaian_Cairan_Sitologi_Teks',
            'Pemakaian_Cairan_Kultur_Teks',
            'Spesimen_Cairan_Pemeriksaan',
            'Spesimen_Jumlah_Jaringan',
            'Spesimen_Jenis_Jaringan',
            'Spesimen_Keterangan',
            'ID_Perawat_Instrumen',
            'ID_Perawat_Sirkuler',
            'ID_Posisi_Operasi_Diawasi',
            'ID_Laser_Diawasi_1',
            'ID_Laser_Diawasi_2',
            'ID_Laser_Diawasi_3',
            'Name_Image_Stiker',
            'Type_Image_Stiker',
            'Size_Image_Stiker',
            'Implant_Pabrik',
            'Implant_Type',
            'Implant_Size',
            'Implant_Seri',
          ];

          for (const text of texts) {
            const name = text.replace(/_/g, '-').toLowerCase();
            ckIntraOperasi[text] = (dataToPost[name]) ? dataToPost[name] : '';
          }

          const images = [
            'TTD_Perawat_Instrumen',
            'TTD_Perawat_Sirkuler',
            'Url_Image_Stiker',
          ]

          for (const image of images) {
            const name = image.replace(/_/g, '-').toLowerCase();
            ckIntraOperasi[image] = (dataToPost[name] && dataToPost[name] !== '' && isValidFile(dataToPost[name])) ? global.storage.cleanUrl(dataToPost[name]) : undefined;
          }

          const laserName = [
            'ID_Laser_Diawasi_1',
            'ID_Laser_Diawasi_2',
            'ID_Laser_Diawasi_3',
          ]

          for (const laser of laserName) {
            const newKey = laser.replace('ID', 'Nama');
            const newId = laser.replace(/_/g, '-').toLowerCase();

            const officer = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost[newId]}')]`);

            ckIntraOperasi[newKey] = (officer && Array.isArray(officer) && officer.length > 0 && officer[0].Nama) ? officer[0].Nama : '';
          }

          const names = [
            'ID_Posisi_Operasi_Diawasi',
            'ID_Perawat_Instrumen',
            'ID_Perawat_Sirkuler',
          ]

          for (const name of names) {
            const newKey = name.replace('ID', 'Nama');
            const newId = name.replace(/_/g, '-').toLowerCase();

            const officer = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost[newId]}')]`);

            ckIntraOperasi[newKey] = (officer && Array.isArray(officer) && officer.length > 0 && officer[0].Nama) ? officer[0].Nama : '';
          }

          //Intra Operatif
          const intraOperatif: any = {
            Waktu: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const checkboxIntraOperatif = [
            'Gangguan_Pola_Nafas_Diagnosa_Neuromuskular',
            'Gangguan_Pola_Nafas_Diagnosa_Sekret',

            'Gangguan_Pola_Nafas_Intervensi_Miringkan_Kepala',
            'Gangguan_Pola_Nafas_Intervensi_Rahang',
            'Gangguan_Pola_Nafas_Intervensi_Observasi',
            'Gangguan_Pola_Nafas_Intervensi_TTV',
            'Gangguan_Pola_Nafas_Intervensi_Suction',
            'Gangguan_Pola_Nafas_Intervensi_O2',
            'Gangguan_Pola_Nafas_Intervensi_Obat',
            'Gangguan_Pola_Nafas_Evaluasi_TTV',
            'Gangguan_Pola_Nafas_Evaluasi_Nafas_Spontan',
            'Gangguan_Pola_Nafas_Evaluasi_Sianosis',
            'Gangguan_Pola_Nafas_Evaluasi_O2',
            'Gangguan_Pola_Nafas_Evaluasi_Observasi',
            'Kekurangan_Cairan_Diagnosa_Intake',
            'Kekurangan_Cairan_Diagnosa_Abnormal',
            'Kekurangan_Cairan_Diagnosa_Integritas',
            'Kekurangan_Cairan_Diagnosa_Puasa',
            'Kekurangan_Cairan_Intervensi_Ukur',
            'Kekurangan_Cairan_Intervensi_TTV',
            'Kekurangan_Cairan_Intervensi_Mual_Muntah',
            'Kekurangan_Cairan_Intervensi_Pembalut_Luka',
            'Kekurangan_Cairan_Intervensi_Suhu_Tubuh',
            'Kekurangan_Cairan_Evaluasi_TTV',
            'Kekurangan_Cairan_Evaluasi_Input',
            'Kekurangan_Cairan_Evaluasi_Output',
            'Kekurangan_Cairan_Evaluasi_Mukosa',
            'Kekurangan_Cairan_Evaluasi_Turgor',
            'Tinggi_Cedera_Diagnosa_Pemajanan',
            'Tinggi_Cedera_Diagnosa_Hipoksia',
            'Tinggi_Cedera_Intervensi_Lepas_Gigi',
            'Tinggi_Cedera_Intervensi_Periksa_Identitas',
            'Tinggi_Cedera_Intervensi_Terkunci',
            'Tinggi_Cedera_Intervensi_Sabuk_Pengaman',
            'Tinggi_Cedera_Intervensi_Posisi',
            'Tinggi_Cedera_Intervensi_Elektrikal',
            'Tinggi_Cedera_Intervensi_Plate_Diatermi',
            'Tinggi_Cedera_Intervensi_Cairan',
            'Tinggi_Cedera_Intervensi_Jumlah_Pemakaian',
            'Tinggi_Cedera_Evaluasi_Posisi',
            'Tinggi_Cedera_Evaluasi_Prosedur',
            'Tinggi_Cedera_Evaluasi_Jumlah',
            'Infeksi_Diagnosa_Trauma',
            'Infeksi_Diagnosa_Lingkungan',
            'Infeksi_Diagnosa_Peralatan',
            'Infeksi_Intervensi_Cuci_Tangan',
            'Infeksi_Intervensi_Disinfeksi',
            'Infeksi_Intervensi_Kadaluarsa',
            'Infeksi_Intervensi_Sterilitas',
            'Infeksi_Intervensi_Penutup',
            'Infeksi_Evaluasi_Pertahankan',
            'Nyeri_Diagnosa_Luka',
            'Nyeri_Diagnosa_Pemasangan_Alat',
            'Nyeri_Intervensi_Skala_Nyeri',
            'Nyeri_Intervensi_Teknik_Relaksasi',
            'Nyeri_Intervensi_Posisi_Nyaman',
            'Nyeri_Intervensi_Teknik_Distraksi',
            'Nyeri_Intervensi_Kolaborasi',
            'Nyeri_Evaluasi_Berkurang',
            'Nyeri_Evaluasi_Teknik',
            'Penglihatan_Diagnosa_Penurunan',
            'Penglihatan_Diagnosa_Perlindungan',
            'Penglihatan_Intervensi_Ketajaman',
            'Penglihatan_Intervensi_Orientasi',
            'Penglihatan_Intervensi_Alternative',
            'Penglihatan_Intervensi_Cegah_Sinar',
            'Penglihatan_Intervensi_Optimal_Lingkungan',
            'Penglihatan_Evaluasi_Kemampuan',
            'Penglihatan_Evaluasi_Perubahan',
            'Kecemasan_Diagnosa_Prosedur',
            'Kecemasan_Diagnosa_Kurang_Pengetahuan',
            'Kecemasan_Intervensi_Gambaran',
            'Kecemasan_Intervensi_Beri_Waktu',
            'Kecemasan_Intervensi_Informasi',
            'Kecemasan_Intervensi_Kesempatan',
            'Kecemasan_Evaluasi_Berkurang',
            'Kecemasan_Evaluasi_Tenang',
          ]

          for (const item of checkboxIntraOperatif) {
            const name = item.replace(/_/g, '-').toLowerCase();
            intraOperatif[item] = (dataToPost[name] && dataToPost[name] === '1') ? 1 : 0;
          }

          const intraOperatifText = [
            'Gangguan_Pola_Nafas_Evaluasi_O2_Teks',
            'Kekurangan_Cairan_Evaluasi_Input_Teks',
            'Kekurangan_Cairan_Evaluasi_Output_Teks',
            'Tanggal_Perawat_Kecemasan',
            'Tanggal_Perawat_Penglihatan',
            'Tanggal_Perawat_Nyeri',
            'Tanggal_Perawat_Infeksi',
            'Tanggal_Perawat_Tinggi_Cedera',
            'Tanggal_Perawat_Kekurangan_Cairan',
            'Tanggal_Perawat_Gangguan_Pola_Nafas',

            'ID_Perawat_Kecemasan',
            'ID_Perawat_Penglihatan',
            'ID_Perawat_Nyeri',
            'ID_Perawat_Infeksi',
            'ID_Perawat_Tinggi_Cedera',
            'ID_Perawat_Kekurangan_Cairan',
            'ID_Perawat_Gangguan_Pola_Nafas',
          ]

          for (const item of intraOperatifText) {
            const name = item.replace(/_/g, '-').toLowerCase();
            intraOperatif[item] = dataToPost[name] ?? '';
          }

          const intraOperatifSigns = [
            'TTD_Perawat_Kecemasan',
            'TTD_Perawat_Penglihatan',
            'TTD_Perawat_Nyeri',
            'TTD_Perawat_Infeksi',
            'TTD_Perawat_Tinggi_Cedera',
            'TTD_Perawat_Kekurangan_Cairan',
            'TTD_Perawat_Gangguan_Pola_Nafas',
          ]

          for (const item of intraOperatifSigns) {
            const name = item.replace(/_/g, '-').toLowerCase();
            intraOperatif[item] = dataToPost[name] && dataToPost[name] !== '' && isValidFile(dataToPost[name]) ? global.storage.cleanUrl(dataToPost[name]) : '';
          }

          const namaIntraOperatif = [
            'ID_Perawat_Kecemasan',
            'ID_Perawat_Penglihatan',
            'ID_Perawat_Nyeri',
            'ID_Perawat_Infeksi',
            'ID_Perawat_Tinggi_Cedera',
            'ID_Perawat_Kekurangan_Cairan',
            'ID_Perawat_Gangguan_Pola_Nafas',
            'ID_Dokter',
          ]

          for (const name of namaIntraOperatif) {
            const newKey = name.replace('ID', 'Nama');
            const newId = name.replace(/_/g, '-').toLowerCase();

            const officer = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost[newId]}')]`);

            intraOperatif[newKey] = (officer && Array.isArray(officer) && officer.length > 0 && officer[0].Nama) ? officer[0].Nama : '';
          }

          //Catatan Keperawatan Pasca Operasi
          const nurseDoctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost['id-perawat-dokter']}')]`);
          const nurseCkPas = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost['id-perawat']}')]`);

          const actuals: any = [];
          for (let i = 0; i < (dataToPost['time-masalah-aktual'] ? dataToPost['time-masalah-aktual'] : []).length; i += 1) {
            const actualProblemTime = dataToPost['time-masalah-aktual'][i] ?? '';
            const actualProblemText = dataToPost['masalah-aktual-teks'][i] ?? '';
            const actualInstructionText = dataToPost['masalah-aktual-intruksi-teks'][i] ?? '';
            const actualActionText = dataToPost['masalah-aktual-tindakan-teks'][i] ?? '';

            actuals.push({
              Time_Masalah_Aktual: actualProblemTime,
              Masalah_Aktual_Teks: actualProblemText,
              Masalah_Aktual_Instruksi_Teks: actualInstructionText,
              Masalah_Aktual_Tindakan_Teks: actualActionText,
            });
          }
          const ckPascaOperasi: any = {
            Tanggal: dataToPost.tanggal,
            Aktual: actuals,
            ID_Perawat_Dokter: dataToPost['id-perawat-dokter'],
            Nama_Perawat_Dokter: nurseDoctor && Array.isArray(nurseDoctor) && nurseDoctor.length > 0 && nurseDoctor[0] ? nurseDoctor[0].Nama : '',
            TTD_Perawat: dataToPost['ttd-perawat'] && dataToPost['ttd-perawat'] !== '' && isValidFile(dataToPost['ttd-perawat']) ? global.storage.cleanUrl(dataToPost['ttd-perawat']) : '',
            ID_Perawat: dataToPost['id-perawat'] ?? '',
            Nama_Perawat: nurseCkPas && Array.isArray(nurseCkPas) && nurseCkPas.length > 0 && nurseCkPas[0] ? nurseCkPas[0].Nama : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
            Tingkat_Kesadaran: dataToPost['tingkat-kesadaran-ckpo'] ? parseInt(dataToPost['tingkat-kesadaran-ckpo']) : null,
            Time_Out_Waktu: dataToPost['time-out-waktu-ckpo'] ?? '',
            Grid_Chart_Img: dataToPost['grid-chart-img'] && dataToPost['grid-chart-img'] !== '' && isValidFile(dataToPost['grid-chart-img']) ? global.storage.cleanUrl(dataToPost['grid-chart-img']) : '',
          }

          const ckPascaOperasiRadio = [
            'Rawat_Pasca',
            'Transport',
            'Keadaan_Umum',
            // 'Tingkat_Kesadaran',
            'Jalan_Nafas',
            'Pernafasan',
            'Terapi_Oksigen',
            'Sirkulasi',
            'Posisi_Pasien',
            'Skor',
            'Aldrette_Aktivitas',
            'Aldrette_Pernafasan',
            'Aldrette_Sirkulasi',
            'Aldrette_Kesadaran',
            'Aldrette_Saturasi',
            'Steward_Pergerakan',
            'Steward_Pernafasan',
            'Steward_Kesadaran',
          ]

          for (const item of ckPascaOperasiRadio) {
            const name = item.replace(/_/g, '-').toLowerCase();
            ckPascaOperasi[item] = (dataToPost[name]) ? parseInt(dataToPost[name]) : null;
          }

          const ckPascaOperasiCheckbox = [
            'Kulit_Datang_Kering',
            'Kulit_Datang_Lembab',
            'Kulit_Datang_Merah_Muda',
            'Kulit_Datang_Biru',
            'Kulit_Datang_Hangat',
            'Kulit_Datang_Dingin',
            'Kulit_Datang_Lain',
            'Kulit_Keluar_Kering',
            'Kulit_Keluar_Lembab',
            'Kulit_Keluar_Merah_Muda',
            'Kulit_Keluar_Biru',
            'Kulit_Keluar_Hangat',
            'Kulit_Keluar_Dingin',
            'Kulit_Keluar_Lain',
          ]

          for (const item of ckPascaOperasiCheckbox) {
            const name = item.replace(/_/g, '-').toLowerCase();
            ckPascaOperasi[item] = (dataToPost[name] && dataToPost[name] === '1') ? 1 : 0;
          }

          const ckPascaOperasiCheckboxTime = [
            'Check_Time_Nadi_Teratur_Masuk',
            'Check_Time_Nadi_Teratur_Keluar',
            'Check_Time_Nadi_Tidakteratur_Masuk',
            'Check_Time_Nadi_Tidakteratur_Keluar',
            'Check_Time_Nadi_Lemah_Masuk',
            'Check_Time_Nadi_Lemah_Keluar',
            'Check_Time_Nadi_Kuat_Masuk',
            'Check_Time_Nadi_Kuat_Keluar',
            "Check_Time_Napas_Teratur_Masuk",
            "Check_Time_Napas_Teratur_Keluar",
            "Check_Time_Napas_Tidakteratur_Masuk",
            "Check_Time_Napas_Tidakteratur_Keluar",
            "Check_Time_Napas_Dangkal_Masuk",
            "Check_Time_Napas_Dangkal_Keluar",
            "Check_Time_Napas_Dalam_Masuk",
            "Check_Time_Napas_Dalam_Keluar",
            "Check_Time_Napas_Sukar_Masuk",
            "Check_Time_Napas_Sukar_Keluar",
            "Check_Time_Napas_Terapi_Masuk",
            "Check_Time_Napas_Terapi_Keluar",
            "Check_Time_Spo_Masuk",
            "Check_Time_Spo_Keluar",
            "Check_Time_Urine_Satu",
            "Check_Time_Urine_Dua",
            "Check_Time_Urine_Tiga",
            "Check_Time_Urine_Empat",
          ]

          for (const item of ckPascaOperasiCheckboxTime) {
            const name = item.replace(/_/g, '-').toLowerCase();
            ckPascaOperasi[item] = (dataToPost[name] && dataToPost[name] === '1') ? 1 : 0;
          }

          const ckPascaOperasiText = [
            'LA_GA',
            // 'Time_Out_Waktu',
            'Tanggal_Pasca_Operasi',
            'Terapi_Oksigen_Lain_Teks',
            'Kulit_Datang_Lain_Teks',
            'Kulit_Keluar_Lain_Teks',
            'Posisi_Pasien_Lain_Teks',
            'Skala_Anestesi',
            'Grid_Chart_Data',
            'Time_Nadi_Teratur_Masuk',
            'Time_Nadi_Teratur_Keluar',
            'Time_Nadi_Tidakteratur_Masuk',
            'Time_Nadi_Tidakteratur_Keluar',
            'Time_Nadi_Lemah_Masuk',
            'Time_Nadi_Lemah_Keluar',
            'Time_Nadi_Kuat_Masuk',
            'Time_Nadi_Kuat_Keluar',
            "Time_Napas_Teratur_Masuk",
            "Time_Napas_Teratur_Keluar",
            "Time_Napas_Tidakteratur_Masuk",
            "Time_Napas_Tidakteratur_Keluar",
            "Time_Napas_Dangkal_Masuk",
            "Time_Napas_Dangkal_Keluar",
            "Time_Napas_Dalam_Masuk",
            "Time_Napas_Dalam_Keluar",
            "Time_Napas_Sukar_Masuk",
            "Time_Napas_Sukar_Keluar",
            "Time_Napas_Terapi_Masuk",
            "Time_Napas_Terapi_Keluar",
            "Time_Spo_Masuk",
            "Time_Spo_Keluar",
            "Time_Urine_Satu",
            "Time_Urine_Dua",
            "Time_Urine_Tiga",
            "Time_Urine_Empat",
            "Time_Urine_Total",
            "Time_Pemberitahu_Ruang",
            "Time_Perawat_Ruang",
          ]

          for (const item of ckPascaOperasiText) {
            const name = item.replace(/_/g, '-').toLowerCase();
            ckPascaOperasi[item] = dataToPost[name] ?? '';
          }

          //Pasca Operatif
          const nursePain = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost['id-perawat-nyeri-pasca']}')]`);
          const nurseInfection = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost['id-perawat-infeksi-pasca']}')]`);
          const nurseNervous = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost['id-perawat-kecemasan-pasca']}')]`);
          const pascaOperatif: any = {
            Waktu: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
            TTD_Perawat_Nyeri: dataToPost['ttd-perawat-nyeri-pasca'] && dataToPost['ttd-perawat-nyeri-pasca'] !== '' && isValidFile(dataToPost['ttd-perawat-nyeri-pasca']) ? global.storage.cleanUrl(dataToPost['ttd-perawat-nyeri-pasca']) : '',
            TTD_Perawat_Infeksi: dataToPost['ttd-perawat-infeksi-pasca'] && dataToPost['ttd-perawat-infeksi-pasca'] !== '' && isValidFile(dataToPost['ttd-perawat-infeksi-pasca']) ? global.storage.cleanUrl(dataToPost['ttd-perawat-infeksi-pasca']) : '',
            TTD_Perawat_Perubahan: dataToPost['ttd-perawat-perubahan'] && dataToPost['ttd-perawat-perubahan'] !== '' && isValidFile(dataToPost['ttd-perawat-perubahan']) ? global.storage.cleanUrl(dataToPost['ttd-perawat-perubahan']) : '',
            TTD_Perawat_Kecemasan_Pasca: dataToPost['ttd-perawat-kecemasan-pasca'] && dataToPost['ttd-perawat-kecemasan-pasca'] !== '' && isValidFile(dataToPost['ttd-perawat-kecemasan-pasca']) ? global.storage.cleanUrl(dataToPost['ttd-perawat-kecemasan-pasca']) : '',
            Nyeri_Diagnosa_Luka: dataToPost['nyeri-diagnosa-luka-pasca'] && dataToPost['nyeri-diagnosa-luka-pasca'] === '1' ? 1 : 0,
            Nyeri_Intervensi_Posisi_Nyaman: dataToPost['nyeri-intervensi-posisi-nyaman-pasca'] && dataToPost['nyeri-intervensi-posisi-nyaman-pasca'] === '1' ? 1 : 0,
            Nyeri_Intervensi_Teknik_Distraksi: dataToPost['nyeri-intervensi-teknik-distraksi-pasca'] && dataToPost['nyeri-intervensi-teknik-distraksi-pasca'] === '1' ? 1 : 0,
            ID_Perawat_Nyeri: dataToPost['id-perawat-nyeri-pasca'] ?? '',
            Tanggal_Perawat_Nyeri: dataToPost['tanggal-perawat-nyeri-pasca'] ?? '',
            Infeksi_Diagnosa_Trauma: dataToPost['infeksi-diagnosa-trauma-pasca'] && dataToPost['infeksi-diagnosa-trauma-pasca'] === '1' ? 1 : 0,
            Infeksi_Diagnosa_Lingkungan: dataToPost['infeksi-diagnosa-lingkungan-pasca'] && dataToPost['infeksi-diagnosa-lingkungan-pasca'] === '1' ? 1 : 0,
            Infeksi_Diagnosa_Peralatan: dataToPost['infeksi-diagnosa-peralatan-pasca'] && dataToPost['infeksi-diagnosa-peralatan-pasca'] === '1' ? 1 : 0,
            Infeksi_Intervensi_Cuci_Tangan: dataToPost['infeksi-intervensi-cuci-tangan-pasca'] && dataToPost['infeksi-intervensi-cuci-tangan-pasca'] === '1' ? 1 : 0,
            Infeksi_Intervensi_Disinfeksi: dataToPost['infeksi-intervensi-disinfeksi-pasca'] && dataToPost['infeksi-intervensi-disinfeksi-pasca'] === '1' ? 1 : 0,
            Infeksi_Intervensi_Kadaluarsa: dataToPost['infeksi-intervensi-kadaluarsa-pasca'] && dataToPost['infeksi-intervensi-kadaluarsa-pasca'] === '1' ? 1 : 0,
            Infeksi_Intervensi_Sterilitas: dataToPost['infeksi-intervensi-sterilitas-pasca'] && dataToPost['infeksi-intervensi-sterilitas-pasca'] === '1' ? 1 : 0,
            Infeksi_Intervensi_Penutup: dataToPost['infeksi-intervensi-penutup-pasca'] && dataToPost['infeksi-intervensi-penutup-pasca'] === '1' ? 1 : 0,
            Infeksi_Evaluasi_Pertahankan: dataToPost['infeksi-evaluasi-pertahankan-pasca'] && dataToPost['infeksi-evaluasi-pertahankan-pasca'] === '1' ? 1 : 0,
            ID_Perawat_Infeksi: dataToPost['id-perawat-infeksi-pasca'] ?? '',
            Tanggal_Perawat_Infeksi: dataToPost['tanggal-perawat-infeksi-pasca'] ?? '',
            ID_Perawat_Kecemasan: dataToPost['id-perawat-kecemasan-pasca'] ?? '',
            Tanggal_Perawat_Kecemasan: dataToPost['tanggal-perawat-kecemasan-pasca'] ?? '',
            Nama_Perawat_Nyeri: (nursePain && Array.isArray(nursePain) && nursePain.length > 0 && nursePain[0].Nama) ? nursePain[0].Nama : '',
            Nama_Perawat_Infeksi: (nurseInfection && Array.isArray(nurseInfection) && nurseInfection.length > 0 && nurseInfection[0].Nama) ? nurseInfection[0].Nama : '',
            Nama_Perawat_Kecemasan: (nurseNervous && Array.isArray(nurseNervous) && nurseNervous.length > 0 && nurseNervous[0].Nama) ? nurseNervous[0].Nama : '',
          }

          const pascaOperatifCheckbox = [
            // 'Nyeri_Diagnosa_Luka',
            'Nyeri_Diagnosa_Gaangguan_Kulit',
            'Nyeri_Intervensi_Kaji_Lokasi',
            'Nyeri_Intervensi_Kaji_Ttv',
            'Nyeri_Intervensi_Teknik_Relaksaksi',
            // 'Nyeri_Intervensi_Posisi_Nyaman',
            // 'Nyeri_Intervensi_Teknik_Distraksi',
            'Nyeri_Intervensi_Pemeberian_Analgesi',
            'Nyeri_Evaluasi_Ttv',
            'Nyeri_Evaluasi_Nyeri_Terkontrol',
            'Nyeri_Evaluasi_Nyeri_Berkurang',
            'Nyeri_Evaluasi_Diobservasi',
            // 'Infeksi_Diagnosa_Trauma',
            // 'Infeksi_Diagnosa_Lingkungan',
            // 'Infeksi_Diagnosa_Peralatan',
            // 'Infeksi_Intervensi_Cuci_Tangan',
            // 'Infeksi_Intervensi_Disinfeksi',
            // 'Infeksi_Intervensi_Kadaluarsa',
            // 'Infeksi_Intervensi_Sterilitas',
            // 'Infeksi_Intervensi_Penutup',
            // 'Infeksi_Evaluasi_Pertahankan',
            'Perubahan_Diagnosa_Suhu',
            'Perubahan_Diagnosa_Obat',
            'Perubahan_Diagnosa_Dehidrasi',
            'Perubahan_Intervensi_Catatan_Suhu',
            'Perubahan_Intervensi_Kaji_Suhu',
            'Perubahan_Intervensi_Kolaborasi',
            'Perubahan_Evaluasi_Pasien_Dingin',
            'Perubahan_Evaluasi_Pasien_Menggigil',
            'Perubahan_Evaluasi_Suhu_Ruangan',
            'Kecemasan_Pasca_Operatif_Diagnosa_Perawatan_Luka',
            'Kecemasan_Pasca_Operatif_Intervensi_Gambar_Luka',
            'Kecemasan_Pasca_Operatif_Intervensi_Waktu_Perasaan',
            'Kecemasan_Pasca_Operatif_Intervensi_Beri_Informasi',
            'Kecemasan_Pasca_Operatif_Intervensi_Perbaikan_Pengelihatan',
            'Kecemasan_Pasca_Operatif_Intervensi_Perasaan_Klien',
            'Kecemasan_Pasca_Operatif_Intervensi_Kesempatan_Bertanya',
            'Kecemasan_Pasca_Operatif_Intervensi_Nomor_Pasien',
            'Kecemasan_Pasca_Operatif_Evaluasi_Kecemasan',
            'Kecemasan_Pasca_Operatif_Evaluasi_Tenang_Selama',
          ]

          for (const item of pascaOperatifCheckbox) {
            const name = item.replace(/_/g, '-').toLowerCase();
            pascaOperatif[item] = (dataToPost[name] && dataToPost[name] === '1') ? 1 : 0;
          }

          const pascaOperatifText = [
            'Evaluasi_Suhu_Ruangan_Teks',
            // 'Tanggal_Perawat_Nyeri',
            // 'Tanggal_Perawat_Infeksi',
            'Tanggal_Perawat_Perubahan',
            // 'Tanggal_Perawat_Kecemasan_Pasca',

            // 'ID_Perawat_Nyeri',
            // 'ID_Perawat_Infeksi',
            'ID_Perawat_Perubahan',
            // 'ID_Perawat_Kecemasan_Pasca',
          ]

          for (const item of pascaOperatifText) {
            const name = item.replace(/_/g, '-').toLowerCase();
            pascaOperatif[item] = dataToPost[name] ?? '';
          }

          const pascaOperatifNama = [
            // 'ID_Perawat_Nyeri',
            // 'ID_Perawat_Infeksi',
            'ID_Perawat_Perubahan',
            // 'ID_Perawat_Kecemasan_Pasca',
            'ID_Dokter',
          ]

          for (const name of pascaOperatifNama) {
            const newKey = name.replace('ID', 'Nama');
            const newId = name.replace(/_/g, '-').toLowerCase();

            const officer = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost[newId]}')]`);

            pascaOperatif[newKey] = (officer && Array.isArray(officer) && officer.length > 0 && officer[0].Nama) ? officer[0].Nama : '';
          }

          const ok: IOperatieKamer = {
            Catatan_Keperawatan_Intra_Operasi: ckIntraOperasi,
            Intra_Operatif: intraOperatif,
            Catatan_Keperawatan_Pasca_Operasi: ckPascaOperasi,
            Pasca_Operatif: pascaOperatif,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.OK && newEmrData.OK !== null) {
            newEmrData.OK.Catatan_Keperawatan_Intra_Operasi = ckIntraOperasi;
            newEmrData.OK.Intra_Operatif = intraOperatif;
            newEmrData.OK.Catatan_Keperawatan_Pasca_Operasi = ckPascaOperasi;
            newEmrData.OK.Pasca_Operatif = pascaOperatif;

            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.OK.Catatan_Keperawatan_Intra_Operasi',
              updateDocument.newDocument.OK.Catatan_Keperawatan_Intra_Operasi,
            );
            await global.medicalRecord.update(
              req.emrID,
              '$.OK.Intra_Operatif',
              updateDocument.newDocument.OK.Intra_Operatif,
            );
            await global.medicalRecord.update(
              req.emrID,
              '$.OK.Catatan_Keperawatan_Pasca_Operasi',
              updateDocument.newDocument.OK.Catatan_Keperawatan_Pasca_Operasi,
            );
            await global.medicalRecord.update(
              req.emrID,
              '$.OK.Pasca_Operatif',
              updateDocument.newDocument.OK.Pasca_Operatif,
            );
            ElasticLoggerService().createLog(req, '/ok/catatan-keperawatan-intra-operasi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.OK = ok;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.OK', updateDocument.newDocument.OK);
            ElasticLoggerService().createLog(req, '/ok/catatan-keperawatan-intra-operasi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/ok/catatan-keperawatan-intra-operasi', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/ok/catatan-keperawatan-intra-operasi', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/ok/catatan-keperawatan-intra-operasi', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

OK.route('/ok/instruksi-pasca-bedah-rajal-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'No_MR'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.OK');
      if (checkObject !== null && checkObject.includes("Instruksi_Pasca_Bedah_Rajal")) {
        emrKeys.push("OK.Instruksi_Pasca_Bedah_Rajal");
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form: IInstruksiPascaBedahRajal = (result['OK.Instruksi_Pasca_Bedah_Rajal']) ? result['OK.Instruksi_Pasca_Bedah_Rajal'] : {};

        if (form.TTD_DPJP && form.TTD_DPJP !== '' && isValidFile(form.TTD_DPJP)) {
          form.TTD_DPJP = await global.storage.signUrl(form.TTD_DPJP, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (form.TTD_Pasien && form.TTD_Pasien !== '' && isValidFile(form.TTD_Pasien)) {
          form.TTD_Pasien = await global.storage.signUrl(form.TTD_Pasien, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
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

OK.route('/ok/instruksi-pasca-bedah-rajal-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdateInstruksiPascaBedahRajal = req.body;
          const doctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.Status_Perawat==0&&@.Status_Dokter==1&&@.ID_Karyawan=='${dataToPost.id_dpjp}')]`)
          const fixedData = InstruksiPascaBedahRajal.createFromJson(dataToPost);
          const redisJsonData: IInstruksiPascaBedahRajal = {
            ...fixedData,
            Nama_DPJP: doctor && Array.isArray(doctor) && doctor.length > 0 && doctor[0] ? doctor[0].Nama : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Waktu: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const ok: IOperatieKamer = {
            Instruksi_Pasca_Bedah_Rajal: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.OK && newEmrData.OK !== null) {
            newEmrData.OK.Instruksi_Pasca_Bedah_Rajal = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.OK.Instruksi_Pasca_Bedah_Rajal',
              updateDocument.newDocument.OK.Instruksi_Pasca_Bedah_Rajal,
            );
            ElasticLoggerService().createLog(req, '/ok/instruksi-pasca-bedah-rajal', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                data: updateDocument.newDocument.OK.Instruksi_Pasca_Bedah_Rajal,
              })
            }
          } else {
            newEmrData.OK = ok;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.OK', updateDocument.newDocument.OK);
            ElasticLoggerService().createLog(req, '/ok/instruksi-pasca-bedah-rajal', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                data: updateDocument.newDocument.OK.Instruksi_Pasca_Bedah_Rajal,
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/ok/instruksi-pasca-bedah-rajal', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/ok/instruksi-pasca-bedah-rajal', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/ok/instruksi-pasca-bedah-rajal', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

OK.route('/ok/surveilans-infeksi-hais-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'OK'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.OK');
      const checkRajal = await global.medicalRecord.keys(req.emrID, '.Rawat_Jalan');
      if (checkObject !== null && checkObject.includes('Surveilans_Infeksi_Hais')) {
        emrKeys.push('OK.Surveilans_Infeksi_Hais');
      }
      if (checkRajal !== null && checkRajal.includes('Pemberian_Informasi')) {
        emrKeys.push('Rawat_Jalan.Pemberian_Informasi');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form: ISurveilansInfeksiHaisRanap = result['OK.Surveilans_Infeksi_Hais'] ? result['OK.Surveilans_Infeksi_Hais'] : {};
        const informConsent = result['Rawat_Jalan.Pemberian_Informasi'] ?? {};
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
          inform_consent: informConsent ?? {},
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

OK.route('/ok/surveilans-infeksi-hais-process')
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

          const inpatient: IOperatieKamer = {
            Surveilans_Infeksi_Hais: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.OK && newEmrData.OK !== null) {
            newEmrData.OK.Surveilans_Infeksi_Hais = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.OK.Surveilans_Infeksi_Hais',
              updateDocument.newDocument.OK.Surveilans_Infeksi_Hais,
            );
            ElasticLoggerService().createLog(req, '/ok/surveilans-infeksi-hais', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                data: updateDocument.newDocument.OK.Surveilans_Infeksi_Hais,
              })
            }
          } else {
            newEmrData.OK = inpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.OK', updateDocument.newDocument.OK);
            ElasticLoggerService().createLog(req, '/ok/surveilans-infeksi-hais', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                data: updateDocument.newDocument.OK.Surveilans_Infeksi_Hais,
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/ok/surveilans-infeksi-hais', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/ok/surveilans-infeksi-hais', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/ok/surveilans-infeksi-hais', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  })

OK.route('/ok/asesmen-pra-operasi-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'No_MR', 'Rawat_Inap', 'Rawat_Jalan'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.OK');
      if (checkObject !== null && checkObject.includes("Asesmen_Pra_Operasi")) {
        emrKeys.push("OK.Asesmen_Pra_Operasi");
      }
      const checkUgd = await global.medicalRecord.keys(req.emrID, '.UGD');
      if (checkUgd !== null && checkUgd.includes('Assesmen')) {
        emrKeys.push('UGD.Assesmen');
      }
      const checkRajal = await global.medicalRecord.keys(req.emrID, '.Rawat_Jalan');
      if (checkRajal !== null && checkRajal.includes("Catatan_Keperawatan_Pra_Operasi")) {
        emrKeys.push("Rawat_Jalan.Catatan_Keperawatan_Pra_Operasi");
      }
      if (checkRajal !== null && checkRajal.includes('Pemberian_Informasi')) {
        emrKeys.push('Rawat_Jalan.Pemberian_Informasi');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form: IAsesmenPraOperasi = (result['OK.Asesmen_Pra_Operasi']) ? result['OK.Asesmen_Pra_Operasi'] : {};
        const rawat_jalan: IRawatJalan = result['Rawat_Jalan'] ?? {};
        const rawat_inap: IRawatInap = result['Rawat_Inap'] ?? {};
        const assessmentUgd = result['UGD.Assesmen'] ?? {};
        const ews = await getFirstEws(req.emrID);
        const vitalSign = result['Rawat_Jalan.Catatan_Keperawatan_Pra_Operasi'] ?? {};
        const informConsent = result['Rawat_Jalan.Pemberian_Informasi'] ?? {};

        if (form.TTD_Dokter && form.TTD_Dokter !== '' && isValidFile(form.TTD_Dokter)) {
          form.TTD_Dokter = await global.storage.signUrl(form.TTD_Dokter, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
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
          rawat_jalan,
          rawat_inap,
          asesmen: assessmentUgd,
          inform_consent: informConsent ?? {},
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

OK.route('/ok/asesmen-pra-operasi-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdateAsesmenPraOperasi = req.body;
          const officer1 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_dokter_ttd}')]`)
          const fixedData = AsesmenPraOperasi.createFromJson(dataToPost);
          const redisJsonData: IAsesmenPraOperasi = {
            ...fixedData,
            Nama_Dokter: officer1 && Array.isArray(officer1) && officer1.length > 0 && officer1[0] ? officer1[0].Nama : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const ok: IOperatieKamer = {
            Asesmen_Pra_Operasi: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.OK && newEmrData.OK !== null) {
            newEmrData.OK.Asesmen_Pra_Operasi = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.OK.Asesmen_Pra_Operasi',
              updateDocument.newDocument.OK.Asesmen_Pra_Operasi,
            );
            ElasticLoggerService().createLog(req, '/ok/asesmen-pra-operasi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.OK = ok;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.OK', updateDocument.newDocument.OK);
            ElasticLoggerService().createLog(req, '/ok/asesmen-pra-operasi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/ok/asesmen-pra-operasi', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/ok/asesmen-pra-operasi', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/ok/asesmen-pra-operasi', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

OK.route('/ok/status-anestesi-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'No_MR'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.OK');
      if (checkObject !== null && checkObject.includes("Status_Anestesi")) {
        emrKeys.push("OK.Status_Anestesi");
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form: IStatusAnestesi = (result['OK.Status_Anestesi']) ? result['OK.Status_Anestesi'] : {};

        if (form.TTD_Dokter_Anestesi && form.TTD_Dokter_Anestesi !== '' && isValidFile(form.TTD_Dokter_Anestesi)) {
          form.TTD_Dokter_Anestesi = await global.storage.signUrl(form.TTD_Dokter_Anestesi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }

        if (form.TTD_Penata_Anestesi && form.TTD_Penata_Anestesi !== '' && isValidFile(form.TTD_Penata_Anestesi)) {
          form.TTD_Penata_Anestesi = await global.storage.signUrl(form.TTD_Penata_Anestesi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }

        if (form.Url_Image_Chart && form.Url_Image_Chart !== '' && isValidFile(form.Url_Image_Chart)) {
          form.Url_Image_Chart = await global.storage.signUrl(form.Url_Image_Chart, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }

        if (form.Image_1 && form.Image_1 !== '' && isValidFile(form.Image_1)) {
          form.Image_1 = await global.storage.signUrl(form.Image_1, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }

        if (form.Image_2 && form.Image_2 !== '' && isValidFile(form.Image_2)) {
          form.Image_2 = await global.storage.signUrl(form.Image_2, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }

        if (form.Image_3 && form.Image_3 !== '' && isValidFile(form.Image_3)) {
          form.Image_3 = await global.storage.signUrl(form.Image_3, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
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

OK.route('/ok/status-anestesi-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdateStatusAnestesi = req.body;
          const dpjpAnesthesia = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_dpjp_anestesi}')]`)
          const dpjpSurgery = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_dpjp_bedah}')]`)
          const assistantAnesthesia = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_asisten_anestesi}')]`)
          const signMakeUp = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_penata_anestesi}')]`)
          const signDoctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_dokter_anestesi}')]`)
          const fixedData = StatusAnestesi.createFromJson(dataToPost);
          const redisJsonData: IStatusAnestesi = {
            ...fixedData,
            Nama_Asisten_Anestesi: assistantAnesthesia && Array.isArray(assistantAnesthesia) && assistantAnesthesia.length > 0 && assistantAnesthesia[0] ? assistantAnesthesia[0].Nama : '',
            Nama_Dokter_Anestesi: signDoctor && Array.isArray(signDoctor) && signDoctor.length > 0 && signDoctor[0] ? signDoctor[0].Nama : '',
            Nama_DPJP_Anestesi: dpjpAnesthesia && Array.isArray(dpjpAnesthesia) && dpjpAnesthesia.length > 0 && dpjpAnesthesia[0] ? dpjpAnesthesia[0].Nama : '',
            Nama_DPJP_Bedah: dpjpSurgery && Array.isArray(dpjpSurgery) && dpjpSurgery.length > 0 && dpjpSurgery[0] ? dpjpSurgery[0].Nama : '',
            Nama_Penata_Anestesi: signMakeUp && Array.isArray(signMakeUp) && signMakeUp.length > 0 && signMakeUp[0] ? signMakeUp[0].Nama : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const ok: IOperatieKamer = {
            Status_Anestesi: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.OK && newEmrData.OK !== null) {
            newEmrData.OK.Status_Anestesi = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.OK.Status_Anestesi',
              updateDocument.newDocument.OK.Status_Anestesi,
            );
            ElasticLoggerService().createLog(req, '/ok/status-anestesi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                pasien: emrData.Pasien ?? {},
                data: updateDocument.newDocument.OK.Status_Anestesi,
              })
            }
          } else {
            newEmrData.OK = ok;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.OK', updateDocument.newDocument.OK);
            ElasticLoggerService().createLog(req, '/ok/status-anestesi', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                pasien: emrData.Pasien ?? {},
                data: updateDocument.newDocument.OK.Status_Anestesi,
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/ok/status-anestesi', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/ok/status-anestesi', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/ok/status-anestesi', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

OK.route('/ok/persiapan-peralatan-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'No_MR'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.OK');
      if (checkObject !== null && checkObject.includes("Persiapan_Peralatan")) {
        emrKeys.push("OK.Persiapan_Peralatan");
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form: IPersiapanPeralatan = (result['OK.Persiapan_Peralatan']) ? result['OK.Persiapan_Peralatan'] : {};

        if (form.TTD_Dokter_Anestesi && form.TTD_Dokter_Anestesi !== '' && isValidFile(form.TTD_Dokter_Anestesi)) {
          form.TTD_Dokter_Anestesi = await global.storage.signUrl(form.TTD_Dokter_Anestesi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }

        if (form.TTD_Penata_Anestesi && form.TTD_Penata_Anestesi !== '' && isValidFile(form.TTD_Penata_Anestesi)) {
          form.TTD_Penata_Anestesi = await global.storage.signUrl(form.TTD_Penata_Anestesi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
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

OK.route('/ok/persiapan-peralatan-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdatePersiapanPeralatan = req.body;
          const signMakeUp = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_penata_anestesi}')]`)
          const signDoctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_dokter_anestesi}')]`)
          const fixedData = PersiapanPeralatan.createFromJson(dataToPost);
          const redisJsonData: IPersiapanPeralatan = {
            ...fixedData,
            Nama_Dokter_Anestesi: signDoctor && Array.isArray(signDoctor) && signDoctor.length > 0 && signDoctor[0] ? signDoctor[0].Nama : '',
            Nama_Penata_Anestesi: signMakeUp && Array.isArray(signMakeUp) && signMakeUp.length > 0 && signMakeUp[0] ? signMakeUp[0].Nama : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const ok: IOperatieKamer = {
            Persiapan_Peralatan: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.OK && newEmrData.OK !== null) {
            newEmrData.OK.Persiapan_Peralatan = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.OK.Persiapan_Peralatan',
              updateDocument.newDocument.OK.Persiapan_Peralatan,
            );
            ElasticLoggerService().createLog(req, '/ok/persiapan-peralatan', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                data: updateDocument.newDocument.OK.Persiapan_Peralatan,
              })
            }
          } else {
            newEmrData.OK = ok;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.OK', updateDocument.newDocument.OK);
            ElasticLoggerService().createLog(req, '/ok/persiapan-peralatan', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                data: updateDocument.newDocument.OK.Persiapan_Peralatan,
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/ok/persiapan-peralatan', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/ok/persiapan-peralatan', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/ok/persiapan-peralatan', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

export { OK }

