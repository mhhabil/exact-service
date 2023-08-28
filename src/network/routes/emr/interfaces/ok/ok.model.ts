import { isValidFile } from '../../helpers/app.helper';
import { BaseModel, IBaseModel } from '../app/app.model';
import { IPatientModel } from '../optic/optic.model'
import { IUpdateAsesmenPraOperasi, IUpdateInstruksiPascaBedahRajal, IUpdateOKCatatanKeperawatanPra, IUpdatePersiapanPeralatan, IUpdateStatusAnestesi, IUpdateSurveilansInfeksiHais } from './ok.request';

export interface IFormLaporanPembedahan {
  Tanggal: string;
  ID_Dokter: string;
  Sedasi: number;
  Kejadiantoksikasi: string;
  Lokasi_OD: number;
  Lokasi_OS: number;
  Pemakaian_Implant: any;
  Lokal_Injeksi_Intravitreal_Pengukuran: any;
  Lokal_Pterygium_Injeksi: any;
  Lokal_Pterygium_Diteteskan: any;
  Umum_Chalazion_Diteteskan_1: any;
  Umum_Chalazion_Diteteskan_2: any;
  Umum_Chalazion_Diteteskan_4: any;
  Umum_Chalazion_Bagian: any
  Umum_Chalazion_Injeksi: any;
  Umum_Chalazion_0: any;
  Umum_Chalazion_1: any;
  Umum_Chalazion_2: any;
  Umum_Chalazion_3: any;
  Umum_Chalazion_4: any;
  Umum_Chalazion_5: any;
  Umum_Chalazion_6: any;
  Umum_Chalazion_7: any;
  Umum_Chalazion_8: any;
  Obat_Obat: string;
  ID_Perawat: string;
  ID_Petugas: string;
  TTD_Dokter: string;
  Updated_At: string;
  Id_Dokter_Anestesi: string;
  Nama_Dokter_Anestesi: string;
  Anestesi_Field_Block_Tipe: string;
  Operasi_Ke: string;
  Updated_By: string;
  Profilaksis: string;
  TTD_Perawat: string;
  General_Anestesi: number;
  Responhipersensitivitas: string;
  Lokal_Pterygium_Exicisi: any;
  Nama_Petugas: string;
  Umum_Phaco_0: number;
  Umum_Phaco_1: number;
  Umum_Phaco_2: number;
  Umum_Phaco_3: number;
  Umum_Phaco_4: number;
  Umum_Phaco_5: number;
  Umum_Phaco_6: number;
  Umum_Phaco_7: number;
  Umum_Phaco_8: number;
  Umum_Phaco_9: number;
  Us_Elapsed_1: string;
  Us_Elapsed_2: string;
  Us_Elapsed_3: string;
  Us_Elapsed_4: string;
  Us_Elapsed_5: string;
  Us_Elapsed_6: string;
  Kejadiantoksikasi_Ya_Teks: string;
  Jenis_Pembedahan: string;
  Anestesi_Infiltrasi_Tipe: string;
  Jaringan_Pendarahan: string;
  Jenis_Operasi: string;
  Lokal_Injeksi_Intravitreal_Tipe_1: string;
  Lokal_Injeksi_Intravitreal_Tipe_2: string;
  Lokal_Injeksi_Intravitreal_Tipe_3: string;
  Lokal_Injeksi_Intravitreal_Tipe_4: string;
  Lokal_Injeksi_Intravitreal_Tipe_5: string;
  Lokal_Injeksi_Intravitreal_Tipe_6: string;
  Lokal_Injeksi_Intravitreal_Tipe_7: string;
  Lokal_Injeksi_Intravitreal_Diteteskan_1: any;
  Lokal_Injeksi_Intravitreal_Diteteskan_2: any;
  Lokal_Injeksi_Intravitreal_Diteteskan_3: any;
  Lokal_Phaco_0: number;
  Lokal_Phaco_1: number;
  Lokal_Phaco_2: number;
  Lokal_Phaco_3: number;
  Lokal_Phaco_4: number;
  Lokal_Phaco_5: number;
  Lokal_Phaco_6: number;
  Lokal_Phaco_7: number;
  Lokal_Phaco_8: number;
  Lokal_Phaco_9: number;
  Umum_Phaco_10: number;
  Umum_Phaco_11: number;
  Umum_Phaco_12: number;
  Umum_Phaco_13: number;
  Umum_Phaco_14: number;
  Umum_Phaco_15: number;
  Umum_Phaco_16: number;
  Umum_Phaco_17: number;
  Umum_Phaco_18: number;
  Umum_Phaco_19: number;
  Umum_Phaco_20: number;
  Us_Absolute_1: string;
  Us_Absolute_2: string;
  Us_Absolute_3: string;
  Us_Absolute_4: string;
  Us_Absolute_5: string;
  Us_Absolute_6: string;
  Detail_Implant: any;
  Lokal_Chalazion_Bagian: any;
  Lokal_Chalazion_Injeksi: any;
  Grid_Chart_Img: string;
  Kode_Inventory: string;
  Lokal_Phaco_10: number;
  Lokal_Phaco_11: number;
  Lokal_Phaco_12: number;
  Lokal_Phaco_13: number;
  Lokal_Phaco_14: number;
  Lokal_Phaco_15: number;
  Lokal_Phaco_16: number;
  Lokal_Phaco_17: number;
  Lokal_Phaco_18: number;
  Lokal_Phaco_19: number;
  Lokal_Phaco_20: number;
  Macam_Jaringan: string;
  Skala_Anestesi: string;
  Grid_Chart_Data: string;
  Lama_Pembedahan: string;
  Responhipersensitivitas_Ya_Teks: string;
  Cmb_Tindakan_Bedah: string;
  Us_Elapsed_UP_1: string;
  Us_Elapsed_UP_2: string;
  Us_Elapsed_UP_3: string;
  Us_Elapsed_UP_4: string;
  Us_Elapsed_UP_5: string;
  Us_Elapsed_UP_6: string;
  Anestesi_Topikal: number;
  Antibiotik_Jenis: string;
  Antibiotik_Waktu: string;
  Url_Image_Stiker: string;
  Us_Absolute_UP_1: string;
  Us_Absolute_UP_2: string;
  Us_Absolute_UP_3: string;
  Us_Absolute_UP_4: string;
  Us_Absolute_UP_5: string;
  Us_Absolute_UP_6: string;
  ID_Perawat_Dokter: string;
  Lokal_Chalazion_0: number;
  Lokal_Chalazion_1: number;
  Lokal_Chalazion_2: number;
  Lokal_Chalazion_3: number;
  Lokal_Chalazion_4: number;
  Lokal_Chalazion_5: number;
  Lokal_Chalazion_6: number;
  Lokal_Chalazion_7: number;
  Lokal_Chalazion_8: number;
  Lokal_Chalazion_Diteteskan_1: any;
  Lokal_Chalazion_Diteteskan_2: any;
  Lokal_Chalazion_Diteteskan_4: any;
  Lokal_Hordeolum_0: number;
  Lokal_Hordeolum_1: number;
  Lokal_Hordeolum_2: number;
  Lokal_Hordeolum_3: number;
  Lokal_Hordeolum_4: number;
  Lokal_Hordeolum_5: number;
  Lokal_Hordeolum_6: number;
  Lokal_Hordeolum_7: number;
  Lokal_Hordeolum_8: number;
  Lokal_Hordeolum_Diteteskan_1: any;
  Lokal_Hordeolum_Diteteskan_2: any;
  Lokal_Hordeolum_Diteteskan_3: any;
  Lokal_Hordeolum_Diteteskan_4: any;
  Lokal_Pterygium_0: number;
  Lokal_Pterygium_1: number;
  Lokal_Pterygium_2: number;
  Lokal_Pterygium_3: number;
  Lokal_Pterygium_4: number;
  Lokal_Pterygium_5: number;
  Lokal_Pterygium_6: number;
  Lokal_Pterygium_7: number;
  Lokal_Pterygium_8: number;
  Lokal_Pterygium_9: number;
  Lokal_Injeksi_Intravitreal_Injeksi_1: string;
  Lokal_Injeksi_Intravitreal_Injeksi_2: string;
  Lokal_Injeksi_Intravitreal_Injeksi_3: string;
  Lokal_Injeksi_Intravitreal_Injeksi_4: string;
  Lokal_Injeksi_Intravitreal_Injeksi_5: string;
  Lokal_Injeksi_Intravitreal_Injeksi_6: string;
  Name_Image_Stiker: string;
  Size_Image_Stiker: string;
  Type_Image_Stiker: string;
  Diagnosa_Pra_Bedah: string;
  ID_Dokter_Operator: string;
  Tanggal_Pembedahan: string;
  Anestesi_Infiltrasi: number;
  Id_Perawat_Sirkular: string;
  Profilaksis_Ya_Teks: string;
  Tindakan_Pembedahan: string;
  Anestesi_Field_Block: number;
  Diagnosa_Pasca_Bedah: string;
  Pembedahan_Opsi_Kiri: number;
  Keterangan_Pembedahan: string;
  Nama_Perawat_Sirkular: string;
  Pembedahan_Opsi_Kanan: number;
  Umum_Custom_Keterangan: string;
  Umum_Phaco_Gambar_Mata: string;
  Lokal_Custom_Keterangan: string;
  Lokal_Phaco_Gambar_Mata: string;
  Pembedahan_Opsi_Elektif: number;
  Cmb_Diagnosa_Pasca_Bedah: string;
  Penyakit_Komplikasi: string;
  Penyakit_Komplikasi_Teks: string;
  Konsultasi_Intra_Operatif: string;
  Pembedahan_Opsi_Emergency: number;
  Tanggal_Jaringan_Patologi: string;
  Lokal_Chalazion_Gambar_Pra: string;
  Lokal_Hordeolum_Gambar_Pra: string;
  Lokal_Pterygium_Gambar_Pra: string;
  Lokal_Chalazion_Gambar_Pasca: string;
  Lokal_Hordeolum_Gambar_Pasca: string;
  Lokal_Injeksi_Intravitreal_0: number;
  Lokal_Injeksi_Intravitreal_1: number;
  Lokal_Injeksi_Intravitreal_2: number;
  Lokal_Injeksi_Intravitreal_3: number;
  Lokal_Injeksi_Intravitreal_4: number;
  Lokal_Injeksi_Intravitreal_5: number;
  Lokal_Injeksi_Intravitreal_6: number;
  Lokal_Injeksi_Intravitreal_7: number;
  Lokal_Injeksi_Intravitreal_8: number;
  Lokal_Pterygium_Gambar_Pasca: string;
  Id_Perawat_Dokter_Asisten_Operator: string;
  Nama_Perawat_Dokter_Asisten_Operator: string;
  Lokal_Injeksi_Intravitreal_Injeksi_Lain_Teks: string;
}

export interface ILaporanPembedahan {
  EMR_ID: any;
  nomor_mr: string;
  id_pelayanan: string;
  jenis_pelayanan: string;
  kode_cabang: string;
  tipe_pasien: string;
  daftar_lensa: Array<any>;
  pasien: IPatientModel;
  form: any;
  lensa_implant: any;
  grid_chart_json: any;
}

export interface IFormCKPO {
  Waktu: string;
  ID_Petugas: string;
  Updated_At: string;
  Updated_By: string;
  Nama_Petugas: string;
  Sign_In_Tanda: number;
  Sign_In_Waktu: string;
  Sign_In_Alergi: number;
  Sign_In_Implan: number;
  Sign_Out_Waktu: string;
  Time_Out_Hasil: number;
  Time_Out_Waktu: string;
  Sign_In_Lengkap: number;
  Time_Out_Steril: number;
  Sign_In_Informed: number;
  Sign_Out_ID_Mata: string;
  Time_Out_Masalah: string;
  Sign_In_ID_Dokter: string;
  Sign_In_ID_Penata: string;
  Sign_Out_TTD_Mata: string;
  Sign_In_ID_Perawat: string;
  Sign_In_Pendarahan: number;
  Sign_In_Pernafasan: number;
  Sign_In_TTD_Dokter: string;
  Sign_In_TTD_Penata: string;
  Sign_Out_ID_Dokter: string;
  Sign_Out_ID_Penata: string;
  Sign_Out_Nama_Mata: string;
  Time_Out_ID_Dokter: string;
  Time_Out_ID_Penata: string;
  Time_Out_Peralatan: number;
  Sign_In_Nama_Dokter: string;
  Sign_In_Nama_Penata: string;
  Sign_In_TTD_Perawat: string;
  Sign_Out_ID_Perawat: string;
  Sign_Out_TTD_Dokter: string;
  Sign_Out_TTD_Penata: string;
  Time_Out_Baca_Ulang: number;
  Time_Out_ID_Perawat: string;
  Time_Out_Pendarahan: number;
  Time_Out_TTD_Dokter: string;
  Time_Out_TTD_Penata: string;
  Sign_In_Nama_Perawat: string;
  Sign_Out_ID_Sirkuler: string;
  Sign_Out_Nama_Dokter: string;
  Sign_Out_Nama_Penata: string;
  Sign_Out_TTD_Perawat: string;
  Time_Out_Nama_Dokter: string;
  Time_Out_Nama_Penata: string;
  Time_Out_TTD_Perawat: string;
  Time_Out_Tidak_Rutin: number;
  Sign_Out_Nama_Perawat: string;
  Sign_Out_TTD_Sirkuler: string;
  Time_Out_Nama_Perawat: string;
  Sign_In_Ruangan_Dokter: number;
  Sign_In_Ruangan_Penata: number;
  Sign_Out_Nama_Sirkuler: string;
  Sign_Out_Nama_Tindakan: number;
  Sign_Out_Ruangan_Bedah: number;
  Time_Out_Ruangan_Bedah: number;
  Sign_In_Pulse_Oksimetri: number;
  Sign_In_Ruangan_Perawat: number;
  Sign_Out_Catatan_Khusus: number;
  Sign_Out_Ruangan_Dokter: number;
  Sign_Out_Ruangan_Penata: number;
  Time_Out_Ruangan_Dokter: number;
  Time_Out_Ruangan_Penata: number;
  Sign_Out_Ruangan_Perawat: number;
  Time_Out_Anestesi_Khusus: number;
  Time_Out_Perkenalan_Diri: number;
  Time_Out_Ruangan_Perawat: number;
  Sign_Out_Kelengkapan_Alat: number;
  Sign_Out_Masalah_Peralatan: number;
  Time_Out_Tidak_Rutin_Waktu: string;
  Sign_Out_Pelabelan_Spesimen: number;
  Time_Out_Profilaksis_Antibiotik: number;
}

export interface ICKPO {
  EMR_ID: any;
  nomor_mr: string;
  id_pelayanan: string;
  jenis_pelayanan: string;
  kode_cabang: string;
  tipe_pasien: string;
  pasien: IPatientModel;
  form: any;
}

export interface ICatatanKeperawatanForm {
  Time_Out: number;
  ID_Petugas: string;
  Updated_At: string;
  Updated_By: string;
  Laser_Power: string;
  Mulai_Waktu: string;
  Posisi_Alat: number;
  Implant_Seri: string;
  Implant_Size: string;
  Implant_Type: string;
  Irigasi_Luka: number;
  Laser_Durasi: string;
  Nama_Petugas: string;
  Status_Emosi: number;
  Tipe_Operasi: number;
  Unit_Pemanas: number;
  Jenis_Operasi: string;
  Kateter_Urine: number;
  Laser_Tanggal: string;
  Posisi_Kanula: number;
  Posisi_Lengan: number;
  Selesai_Waktu: string;
  Balutan_Cairan: number;
  Implant_Pabrik: string;
  Laser_Interval: string;
  Posisi_Operasi: number;
  Time_Out_Waktu: string;
  Tipe_Pembiusan: number;
  Unit_Pendingin: number;
  Kondisi_Sebelum: string;
  Kondisi_Sesudah: string;
  Pemakaian_Laser: number;
  Persiapan_Kulit: number;
  Posisi_Kanula_1: number;
  Posisi_Kanula_2: number;
  Posisi_Kanula_3: number;
  Posisi_Kanula_4: number;
  Posisi_Kanula_5: number;
  Posisi_Kanula_6: number;
  Posisi_Kanula_7: number;
  Posisi_Kanula_8: number;
  Posisi_Lengan_1: number;
  Posisi_Lengan_2: number;
  Posisi_Lengan_3: number;
  Posisi_Lengan_4: number;
  Posisi_Lengan_5: number;
  Spesimen_Cairan: number;
  Laser_Kode_Model: string;
  Lokasi_Elektrode: number;
  Pemakaian_Cairan: number;
  Posisi_Operasi_1: number;
  Posisi_Operasi_2: number;
  Posisi_Operasi_3: number;
  Posisi_Operasi_4: number;
  Posisi_Operasi_5: number;
  Url_Image_Stiker: string;
  Name_Image_Stiker: string;
  Pemakaian_Implant: number;
  Pemanas_Kode_Unit: string;
  Size_Image_Stiker: string;
  Tingkat_Kesadaran: number;
  Type_Image_Stiker: string;
  ID_Laser_Diawasi_1: string;
  ID_Laser_Diawasi_2: string;
  ID_Laser_Diawasi_3: string;
  ID_Perawat_Sirkuler: string;
  Laser_Jumlah_Tembak: string;
  Pemakaian_Diathermy: number;
  Pemanas_Mulai_Waktu: string;
  Pendingin_Kode_Unit: string;
  Spesimen_Keterangan: string;
  ID_Perawat_Instrumen: string;
  Nama_Laser_Diawasi_1: string;
  Nama_Laser_Diawasi_2: string;
  Nama_Laser_Diawasi_3: string;
  TTD_Perawat_Sirkuler: string;
  Ketersediaan_Prothese: number;
  Nama_Perawat_Sirkuler: string;
  Pemakaian_Diathermy_1: number;
  Pemakaian_Diathermy_2: number;
  Pemakaian_Diathermy_3: number;
  Pemanas_Selesai_Waktu: string;
  Pendingin_Mulai_Waktu: string;
  Posisi_Alat_Lain_Teks: string;
  TTD_Perawat_Instrumen: string;
  Irigasi_Luka_Lain_Teks: string;
  Ketersediaan_Instrumen: number;
  Nama_Perawat_Instrumen: string;
  Pendingin_Selesai_Waktu: string;
  Posisi_Kanula_Lain_Teks: string;
  Posisi_Lengan_Lain_Teks: string;
  Spesimen_Jenis_Jaringan: string;
  Posisi_Operasi_Lain_Teks: string;
  Spesimen_Jumlah_Jaringan: string;
  ID_Posisi_Operasi_Diawasi: string;
  Kode_Unit_Elektrosurgikal: string;
  Kondisi_Sebelum_Lain_Teks: string;
  Kondisi_Sesudah_Lain_Teks: string;
  Pemakaian_Cairan_Air_Teks: string;
  Persiapan_Kulit_Lain_Teks: string;
  Lokasi_Elektrode_Lain_Teks: string;
  Pemakaian_Cairan_Lain_Teks: string;
  Ketersediaan_Prothese_Waktu: string;
  Nama_Posisi_Operasi_Diawasi: string;
  Spesimen_Cairan_Pemeriksaan: string;
  Tingkat_Kesadaran_Lain_Teks: string;
  Ketersediaan_Instrumen_Waktu: string;
  Pemakaian_Cairan_Kultur_Teks: string;
  Pemakaian_Cairan_Sodium_Teks: string;
  Pemanas_Pengaturan_Temperatur: string;
  Pemakaian_Cairan_Sitologi_Teks: string;
  Pemakaian_Cairan_Histologi_Teks: string;
  Pendingin_Pengaturan_Temperatur: string;
}

export interface ICatatanKeperawatan extends IBaseModel {
  form: ICatatanKeperawatanForm;
}

export class OKCatatanKeperawatanPraOp {
  static createFromJson(json: IUpdateOKCatatanKeperawatanPra) {
    const mentalStatus = {
      1: (json.status_mental && json.status_mental.includes('1')) ? 1 : 0,
      2: (json.status_mental && json.status_mental.includes('2')) ? 1 : 0,
      3: (json.status_mental && json.status_mental.includes('3')) ? 1 : 0,
      4: (json.status_mental && json.status_mental.includes('4')) ? 1 : 0,
      5: (json.status_mental && json.status_mental.includes('5')) ? 1 : 0,
    }

    const supportingInvestigation = {
      1: (json.pemeriksaan_penunjang && json.pemeriksaan_penunjang.includes('1')) ? 1 : 0,
      2: (json.pemeriksaan_penunjang && json.pemeriksaan_penunjang.includes('2')) ? 1 : 0,
      3: (json.pemeriksaan_penunjang && json.pemeriksaan_penunjang.includes('3')) ? 1 : 0,
      4: (json.pemeriksaan_penunjang && json.pemeriksaan_penunjang.includes('4')) ? 1 : 0,
      5: (json.pemeriksaan_penunjang && json.pemeriksaan_penunjang.includes('5')) ? 1 : 0,
      6: (json.pemeriksaan_penunjang && json.pemeriksaan_penunjang.includes('6')) ? 1 : 0,
      7: (json.pemeriksaan_penunjang && json.pemeriksaan_penunjang.includes('7')) ? 1 : 0,
      8: (json.pemeriksaan_penunjang && json.pemeriksaan_penunjang.includes('8')) ? 1 : 0,
    }

    return {
      Status_Mental: {
        Sadar_Penuh: mentalStatus[1],
        Bingung: mentalStatus[2],
        Agitasi: mentalStatus[3],
        Mengantuk: mentalStatus[4],
        Koma: mentalStatus[5],
      },
      Pemeriksaan_Penunjang: {
        Laboratorium: supportingInvestigation[1],
        Rongent: supportingInvestigation[2],
        Foto_Fundus: supportingInvestigation[3],
        USG_Mata: supportingInvestigation[4],
        Koma: supportingInvestigation[5],
        Biometri: supportingInvestigation[6],
        Tidak_Ada: supportingInvestigation[7],
        Lain_lain: supportingInvestigation[8],
      },
      Riwayat_Penyakit_Radio: json.riwayat_penyakit ?? '',
      Riwayat_Penyakit_Keterangan: json.riwayat_penyakit_keterangan ?? '',
      Pengobatan_Saat_Ini: json.pengobatan_saat_ini ?? '',
      Pengobatan_Saat_Ini_Keterangan: json.pengobatan_saat_ini_keterangan ?? '',
      Alat_Bantu: json.alat_bantu ?? '',
      Alat_Bantu_Keterangan: json.alat_bantu_keterangan ?? '',
      Operasi_Sebelumnya: json.operasi_sebelumnya ?? '',
      Operasi_Sebelumnya_Keterangan: json.operasi_sebelumnya_keterangan ?? '',
      Operasi_Sebelumnya_Tanggal: json.operasi_sebelumnya_tanggal ?? '',
      Operasi_Sebelumnya_Di: json.operasi_sebelumnya_di ?? '',
      Alergi: json.alergi ?? '',
      Alergi_Keterangan: json.alergi_keterangan ?? '',
      Bb: json.bb ?? '',
      Tb: json.tb ?? '',
      Td: json.td ?? '',
      Nadi: json.nadi ?? '',
      Rr: json.rr ?? '',
      T: json.t ?? '',
      Sat: json.sat ?? '',
      Skala_Nyeri: json.skala_nyeri ?? '',
      Suhu: json.suhu ?? '',
      Pemeriksaan_Penunjang_Keterangan: json.pemeriksaan_penunjang_keterangan ?? '',
      Tanggal: json.tanggal ?? '',
      TTD_Perawat_Ruangan: json['ttd-perawat-ruangan'] && json['ttd-perawat-ruangan'] !== '' && isValidFile(json['ttd-perawat-ruangan']) ? global.storage.cleanUrl(json['ttd-perawat-ruangan']) : '',
      ID_Perawat_Ruangan: json['id-perawat-ruangan'] ?? '',
      TTD_Perawat_Penerima: json['ttd-perawat-penerima'] && json['ttd-perawat-penerima'] !== '' && isValidFile(json['ttd-perawat-penerima']) ? global.storage.cleanUrl(json['ttd-perawat-penerima']) : '',
      ID_Perawat_Penerima: json['id-perawat-penerima'] ?? '',
    }
  }
}

export class InstruksiPascaBedahRajal {
  static createFromJson(json: IUpdateInstruksiPascaBedahRajal) {
    return {
      Anjuran_Kendaraan: json.anjuran_kendaraan && json.anjuran_kendaraan === '1' ? 1 : 0,
      Anjuran_Alat_Berat: json.anjuran_alat_berat && json.anjuran_alat_berat === '1' ? 1 : 0,
      Anjuran_Alkohol: json.anjuran_alkohol && json.anjuran_alkohol === '1' ? 1 : 0,
      Anjuran_Ekstremitas: json.anjuran_ekstremitas && json.anjuran_ekstremitas === '1' ? 1 : 0,
      Anjuran_Obat: json.anjuran_obat && json.anjuran_obat === '1' ? 1 : 0,
      Anjuran_Lain: json.anjuran_lain && json.anjuran_lain === '1' ? 1 : 0,
      Anjuran_Terkena: json.anjuran_terkena && json.anjuran_terkena === '1' ? 1 : 0,
      Anjuran_Tidur_Eyeshield: json.anjuran_tidur_eyeshield && json.anjuran_tidur_eyeshield === '1' ? 1 : 0,
      Anjuran_Tidur_Telentang: json.anjuran_tidur_telentang && json.anjuran_tidur_telentang === '1' ? 1 : 0,
      Anjuran_Tidur_Telungkup: json.anjuran_tidur_telungkup && json.anjuran_tidur_telungkup === '1' ? 1 : 0,
      Anjuran_Tidur_Membungkuk: json.anjuran_tidur_membungkuk && json.anjuran_tidur_membungkuk === '1' ? 1 : 0,
      Anjuran_Tidur_Dll: json.anjuran_tidur_dll && json.anjuran_tidur_dll === '1' ? 1 : 0,
      Pendamping_Keluarga: json.pendamping_keluarga && json.pendamping_keluarga === '1' ? 1 : 0,
      Pendamping_Medis: json.pendamping_medis && json.pendamping_medis === '1' ? 1 : 0,
      Pendamping_Lain: json.pendamping_lain && json.pendamping_lain === '1' ? 1 : 0,
      Keluhan_Rumah: json.keluhan_rumah ?? '',
      Terjadi_Rumah: json.terjadi_rumah ?? '',
      Mobilisasi: json.mobilisasi ?? '',
      Anjuran_Lain_Teks: json.anjuran_lain_teks ?? '',
      Pendamping_Keluarga_Teks: json.pendamping_keluarga_teks ?? '',
      Pendamping_Lain_Teks: json.pendamping_lain_teks ?? '',
      Anjuran_Tidur_Lain_Teks: json.anjuran_tidur_lain_teks ?? '',
      Nomor_Dihubungi: json.nomor_dihubungi ?? '',
      Jadwal_Kontrol: json.jadwal_kontrol ?? '',
      Lain_Lain: json.lain_lain ?? '',
      TTD_DPJP: json.ttd_dpjp && json.ttd_dpjp !== '' && isValidFile(json.ttd_dpjp) ? global.storage.cleanUrl(json.ttd_dpjp) : '',
      TTD_Pasien: json.ttd_pasien && json.ttd_pasien !== '' && isValidFile(json.ttd_pasien) ? global.storage.cleanUrl(json.ttd_pasien) : '',
      ID_DPJP: json.id_dpjp ?? '',
      // Nama_DPJP
    }
  }
}

export class SurveilansInfeksiHais {
  static createFromJson(json: IUpdateSurveilansInfeksiHais) {
    return {
      Jenis_Operasi: json.jenis_operasi ?? '',
      Asa_Score: json.asa_score ?? '',
      Jenis_Anestesi: json.jenis_anestesi ?? '',
      Dokter_Anestesi_Id: json.dokter_anestesi ?? '',
      // Dokter_Anestesi_Nama
      Kelembaban_Udara: json.kelembaban_udara ?? '',
      Suhu_Ruangan: json.suhu_ruangan ?? '',
      Komplikasi_Saat_Operasi: json.komplikasi_saat_operasi ?? '',
      Indikator_Instrumen: json.indikator_instrumen ?? '',
      Disinfeksi_Kulit: json.disinfeksi_kulit ?? '',
      Jahitan: json.jahitan ?? '',
      Profilaksis: json.profilaksis ?? '',
      Profilaksis_Nama_Obat: json.profilaksis_nama_obat ?? '',
      Profilaksis_Dosis: json.profilaksis_dosis ?? '',
      Profilaksis_Jam_Beri_Obat: json.profilaksis_jam_beri_obat ?? '',
      Antibiotik_Tambahan: json.antibiotik_tambahan ?? '',
      Antibiotik_Tambahan_Nama_Obat: json.antibiotik_tambahan_nama_obat ?? '',
      Antibiotik_Tambahan_Dosis: json.antibiotik_tambahan_dosis ?? '',
      Antibiotik_Tambahan_Jam_Beri_Obat: json.antibiotik_tambahan_jam_beri_obat ?? '',
      Implant: json.implant ?? '',
      Sterilisasi_Cssd: json.sterilisasi_cssd ?? '',
      Dokter_Operasi_Id: json.dokter_operasi ?? '',
      // Dokter_Operasi_Nama
      Asisten_Operasi_Id: json.asisten_operasi ?? '',
      // Asisten_Operasi_Nama
      Urutan_Operasi: json.urutan_operasi ?? '',
      Kualifikasi_Dokter_Bedah: json.kualifikasi_dokter_bedah ?? '',
      Lama_Operasi: json.lama_operasi ?? '',
      Jumlah_Staf_Operasi: json.jumlah_staf_operasi ?? '',
      Ruang_Operasi: json.ruang_operasi ?? '',
      Klasifikasi_Luka: json.klasifikasi_luka ?? '',
      Prosedur_Operasi: json.prosedur_operasi ?? '',
      Diagnosa_Akhir: json.diagnosa_akhir ?? '',
      Tanggal_Keluar: json.tanggal_keluar ?? '',
      Cara_Pulang_Pasien: json.cara_pulang_pasien ?? '',
      Cara_Pulang_Pasien_Pindah_Rs_Tujuan: json.cara_pulang_pasien_pindah_rs_tujuan ?? '',
      Hais_ID_Perawat: json.hais_id_perawat ?? '',
      Hais_TTD_Perawat: json.hais_ttd_perawat && json.hais_ttd_perawat !== '' && isValidFile(json.hais_ttd_perawat) ? global.storage.cleanUrl(json.hais_ttd_perawat) : '',
      // Hais_Nama_Perawat
      Hais_ID_Ipcn: json.hais_id_ipcn ?? '',
      Hais_TTD_Ipcn: json.hais_ttd_ipcn && json.hais_ttd_ipcn !== '' && isValidFile(json.hais_ttd_ipcn) ? global.storage.cleanUrl(json.hais_ttd_ipcn) : '',
      // Hais_Nama_Ipcn
    }
  }
}

export class AsesmenPraOperasi {
  static createFromJson(json: IUpdateAsesmenPraOperasi) {
    return {
      Td: json.td ?? '',
      Nadi: json.nadi ?? '',
      Rr: json.rr ?? '',
      Suhu: json.suhu ?? '',
      Skala_Nyeri: json.skala_nyeri ?? '',
      Alergi: json.alergi ?? '',
      Alergi_Keterangan: json.alergi_keterangan ?? '',
      Penyakit_Peserta: json.penyakit_peserta && !Array.isArray(json.penyakit_peserta) ? json.penyakit_peserta : '',
      Penyakit_Peserta_Keterangan: json.penyakit_peserta_keterangan ?? '',
      Pengobatan_Saat_Ini: json.pengobatan_saat_ini && !Array.isArray(json.pengobatan_saat_ini) ? json.pengobatan_saat_ini : '',
      Pengobatan_Saat_Ini_Lain: json.pengobatan_saat_ini_lain ?? '',
      Tonometri: json.tonometri ?? '',
      Biometri: json.biometri ?? '',
      Usg_Mata: json.usg_mata ?? '',
      Foto_Fundus: json.foto_fundus ?? '',
      Oct_Makula: json.oct_makula ?? '',
      Dll: json.dll ?? '',
      Hasil_Konsultasi: json.hasil_konsultasi ?? '',
      Persediaan_Darah: json.persediaan_darah ?? '',
      Persetujuan: json.persetujuan ?? '',
      Anestesi: json.anestesi ?? '',
      Jenis_Kasus: json.jenis_kasus ?? '',
      Diagnosa: json.diagnosa ?? '',
      Rencana_Operasi: json.rencana_operasi ?? '',
      Tanggal_Operasi: json.tanggal_operasi ?? '',
      Ahli_Bedah: json.ahli_bedah ?? '',
      Tanggal: json.tanggal ?? '',
      TTD_Dokter: json.ttd_dokter && json.ttd_dokter !== '' && isValidFile(json.ttd_dokter) ? global.storage.cleanUrl(json.ttd_dokter) : '',
      ID_Dokter: json.id_dokter_ttd ?? '',
      // Nama_Dokter
    }
  }
}

export class StatusAnestesi {
  static createFromJson(json: IUpdateStatusAnestesi) {
    return {
      ID_DPJP_Anestesi: json.id_dpjp_anestesi ?? '',
      ID_DPJP_Bedah: json.id_dpjp_bedah ?? '',
      ID_Asisten_Anestesi: json.id_asisten_anestesi ?? '',
      Diagnosa_Pra_Bedah: json.diagnosa_pra_bedah ?? '',
      Diagnosis_Pasca_Bedah: json.diagnosis_pasca_bedah ?? '',
      Jenis_Pembedahan: json.jenis_pembedahan ?? '',
      Teknik_Anestesi: json.teknik_anestesi ?? '',
      Teknik_Anestesi_Lainnya: json.teknik_anestesi_lainnya ?? '',
      Teknik_Khusus_Hipotensi: json.teknik_khusus_hipotensi && json.teknik_khusus_hipotensi === '1' ? '1' : '0',
      Teknik_Khusus_Bronkoskopi: json.teknik_khusus_bronkoskopi && json.teknik_khusus_bronkoskopi === '1' ? '1' : '0',
      Teknik_Khusus_TCI: json.teknik_khusus_tci && json.teknik_khusus_tci === '1' ? '1' : '0',
      Teknik_Khusus_Glidescope: json.teknik_khusus_glidescope && json.teknik_khusus_glidescope === '1' ? '1' : '0',
      Teknik_Khusus_CPB: json.teknik_khusus_cpb && json.teknik_khusus_cpb === '1' ? '1' : '0',
      Teknik_Khusus_USG: json.teknik_khusus_usg && json.teknik_khusus_usg === '1' ? '1' : '0',
      Teknik_Khusus_Ventilasi: json.teknik_khusus_ventilasi && json.teknik_khusus_ventilasi === '1' ? '1' : '0',
      Teknik_Khusus_Stimulator: json.teknik_khusus_stimulator && json.teknik_khusus_stimulator === '1' ? '1' : '0',
      Teknik_Khusus_Lainnya: json.teknik_khusus_lainnya && json.teknik_khusus_lainnya === '1' ? '1' : '0',
      Teknik_Khusus_Lainnya_Teks: json.teknik_khusus_lainnya_teks ?? '',
      Monitoring_EKG: json.monitoring_ekg && json.monitoring_ekg === '1' ? '1' : '0',
      Monitoring_EKG_Teks: json.monitoring_ekg_teks ?? '',
      Monitoring_NIBP: json.monitoring_nibp && json.monitoring_nibp === '1' ? '1' : '0',
      Monitoring_Cath: json.monitoring_cath && json.monitoring_cath === '1' ? '1' : '0',
      Monitoring_Arteri: json.monitoring_arteri && json.monitoring_arteri === '1' ? '1' : '0',
      Monitoring_Arteri_Teks: json.monitoring_arteri_teks ?? '',
      Monitoring_NGT: json.monitoring_ngt && json.monitoring_ngt === '1' ? '1' : '0',
      Monitoring_SpO2: json.monitoring_spo2 && json.monitoring_spo2 === '1' ? '1' : '0',
      Monitoring_EtCO2: json.monitoring_etco2 && json.monitoring_etco2 === '1' ? '1' : '0',
      Monitoring_BIS: json.monitoring_bis && json.monitoring_bis === '1' ? '1' : '0',
      Monitoring_Katerer: json.monitoring_katerer && json.monitoring_katerer === '1' ? '1' : '0',
      Monitoring_Stetoskop: json.monitoring_stetoskop && json.monitoring_stetoskop === '1' ? '1' : '0',
      Monitoring_CVP: json.monitoring_cvp && json.monitoring_cvp === '1' ? '1' : '0',
      Monitoring_CVP_Teks: json.monitoring_cvp_teks ?? '',
      Monitoring_Temp: json.monitoring_temp && json.monitoring_temp === '1' ? '1' : '0',
      Monitoring_Lainnya: json.monitoring_lainnya && json.monitoring_lainnya === '1' ? '1' : '0',
      Monitoring_Lainnya_Teks: json.monitoring_lainnya_teks ?? '',
      ASA: json.asa ?? '',
      Alergi: json.alergi ?? '',
      Alergi_Keterangan: json.alergi_keterangan ?? '',
      Penyulit_Pra_Anestesi: json.penyulit_pra_anestesi ?? '',
      Checklist_Inform_Consent: json.checklist_inform_consent && json.checklist_inform_consent === '1' ? '1' : '0',
      Checklist_Monitoring: json.checklist_monitoring && json.checklist_monitoring === '1' ? '1' : '0',
      Checklist_Obat_Anestesi: json.checklist_obat_anestesi && json.checklist_obat_anestesi === '1' ? '1' : '0',
      Checklist_Obat_Emergensi: json.checklist_obat_emergensi && json.checklist_obat_emergensi === '1' ? '1' : '0',
      Checklist_Tatalaksana: json.checklist_tatalaksana && json.checklist_tatalaksana === '1' ? '1' : '0',
      Checklist_Mesin: json.checklist_mesin && json.checklist_mesin === '1' ? '1' : '0',
      Checklist_Suction: json.checklist_suction && json.checklist_suction === '1' ? '1' : '0',
      Jam_Pra_Induksi: json.jam_pra_induksi ?? '',
      Pra_Induksi_Kesadaran: json.pra_induksi_kesadaran ?? '',
      Pra_Induksi_Denyut_Nadi: json.pra_induksi_denyut_nadi ?? '',
      Pra_Induksi_Lainnya: json.pra_induksi_lainnya ?? '',
      Pra_Induksi_RR: json.pra_induksi_rr ?? '',
      Pra_Induksi_Saturasi: json.pra_induksi_saturasi ?? '',
      Pra_Induksi_Suhu: json.pra_induksi_suhu ?? '',
      Pra_Induksi_Tekanan_Darah: json.pra_induksi_tekanan_darah ?? '',
      Catatan: json.catatan ?? '',
      Image_1: json.image_1 && json.image_1 !== '' && isValidFile(json.image_1) ? global.storage.cleanUrl(json.image_1) : '',
      Image_2: json.image_2 && json.image_2 !== '' && isValidFile(json.image_2) ? global.storage.cleanUrl(json.image_2) : '',
      Image_3: json.image_3 && json.image_3 !== '' && isValidFile(json.image_3) ? global.storage.cleanUrl(json.image_3) : '',
      Infus_Perifer_1: json.infus_perifer_1 ?? '',
      Infus_Perifer_2: json.infus_perifer_2 ?? '',
      Infus_Perifer_3: json.infus_perifer_3 ?? '',
      Posisi: json.posisi ?? '',
      Posisi_Lainnya: json.posisi_lainnya ?? '',
      Premedikasi_IM: json.premedikasi_im ?? '',
      Premedikasi_IV: json.premedikasi_iv ?? '',
      Premedikasi_Oral: json.premedikasi_oral ?? '',
      Induksi_Intravena: json.induksi_intravena ?? '',
      Induksi_Inhalasi: json.induksi_inhalasi ?? '',
      Face_Mask_No: json.face_mask_no ?? '',
      Oro_No: json.oro_no ?? '',
      ETT_No: json.ett_no ?? '',
      ETT_Fiksasi: json.ett_fiksasi ?? '',
      ETT_Jenis: json.ett_jenis ?? '',
      LMA_Jenis: json.lma_jenis ?? '',
      LMA_No: json.lma_no ?? '',
      Trakhesotomi: json.trakhesotomi ?? '',
      Bronkoskopi_Fiber: json.bronkoskopi_fiber ?? '',
      Glidescope: json.glidescope ?? '',
      Tata_Laksana_Lainnya: json.tata_laksana_lainnya ?? '',
      Intubasi_Sesudah_Tidur: json.intubasi_sesudah_tidur && json.intubasi_sesudah_tidur === '1' ? '1' : '0',
      Intubasi_Blind: json.intubasi_blind && json.intubasi_blind === '1' ? '1' : '0',
      Intubasi_Cuff: json.intubasi_cuff && json.intubasi_cuff === '1' ? '1' : '0',
      Intubasi_Dengan_Stilet: json.intubasi_dengan_stilet && json.intubasi_dengan_stilet === '1' ? '1' : '0',
      Intubasi_Dengan_Stilet_Teks: json.intubasi_dengan_stilet_teks ?? '',
      Intubasi_Kanan: json.intubasi_kanan && json.intubasi_kanan === '1' ? '1' : '0',
      Intubasi_Kiri: json.intubasi_kiri && json.intubasi_kiri === '1' ? '1' : '0',
      Intubasi_Level_ETT: json.intubasi_level_ett && json.intubasi_level_ett === '1' ? '1' : '0',
      Intubasi_Nasal: json.intubasi_nasal && json.intubasi_nasal === '1' ? '1' : '0',
      Intubasi_Oral: json.intubasi_oral && json.intubasi_oral === '1' ? '1' : '0',
      Intubasi_Pack: json.intubasi_pack && json.intubasi_pack === '1' ? '1' : '0',
      Intubasi_Sulit_Intubasi: json.intubasi_sulit_intubasi && json.intubasi_sulit_intubasi === '1' ? '1' : '0',
      Intubasi_Sulit_Intubasi_Teks: json.intubasi_sulit_intubasi_teks ?? '',
      Intubasi_Sulit_Ventilasi: json.intubasi_sulit_ventilasi && json.intubasi_sulit_ventilasi === '1' ? '1' : '0',
      Intubasi_Sulit_Ventilasi_Teks: json.intubasi_sulit_ventilasi_teks ?? '',
      Intubasi_Trakheostomi: json.intubasi_trakheostomi && json.intubasi_trakheostomi === '1' ? '1' : '0',
      Ventilasi_Kendali: json.ventilasi_kendali && json.ventilasi_kendali === '1' ? '1' : '0',
      Ventilasi_Lainnya: json.ventilasi_lainnya && json.ventilasi_lainnya === '1' ? '1' : '0',
      Ventilasi_Lainnya_Teks: json.ventilasi_lainnya_teks ?? '',
      Ventilasi_Spontan: json.ventilasi_spontan && json.ventilasi_spontan === '1' ? '1' : '0',
      Ventilasi_Ventilator: json.ventilasi_ventilator && json.ventilasi_ventilator === '1' ? '1' : '0',
      Ventilasi_Ventilator_PEEP: json.ventilasi_ventilator_peep ?? '',
      Ventilasi_Ventilator_RR: json.ventilasi_ventilator_rr ?? '',
      Ventilasi_Ventilator_TV: json.ventilasi_ventilator_tv ?? '',
      CKP_Jam_Masuk: json.ckp_jam_masuk ?? '',
      CKP_Tekanan_Darah: json.ckp_tekanan_darah ?? '',
      CKP_Denyut_Nadi: json.ckp_denyut_nadi ?? '',
      CKP_Instruksi_Khusus: json.ckp_instruksi_khusus ?? '',
      CKP_Kesadaran: json.ckp_kesadaran ?? '',
      CKP_Penyulit_Intra_Operatif: json.ckp_penyulit_intra_operatif ?? '',
      CKP_Pernafasan: json.ckp_pernafasan ?? '',
      CKP_RR: json.ckp_rr ?? '',
      CKP_Suhu: json.ckp_suhu ?? '',
      VAS: json.vas ?? '',
      VAS_Pulih: json.vas_pulih ?? '',
      Jam_Keluar_Pulih: json.jam_keluar_pulih ?? '',
      Aldrette_Aktivitas: json.aldrette_aktivitas ?? '',
      Aldrette_Kesadaran: json.aldrette_kesadaran ?? '',
      Aldrette_Pernafasan: json.aldrette_pernafasan ?? '',
      Aldrette_Sirkulasi: json.aldrette_sirkulasi ?? '',
      Aldrette_Skor_VAS: json.aldrette_skor_vas ?? '',
      Aldrette_Total: json.aldrette_total ?? '',
      Aldrette_Warna_Kulit: json.aldrette_warna_kulit ?? '',
      Steward_Kesadaran: json.steward_kesadaran ?? '',
      Steward_Motorik: json.steward_motorik ?? '',
      Steward_Pernafasan: json.steward_pernafasan ?? '',
      Steward_Skor_VAS: json.steward_skor_vas ?? '',
      Steward_Total: json.steward_total ?? '',
      Pindah_Ke: json.pindah_ke ?? '',
      Pindah_Ke_Lainnya: json.pindah_ke_lainnya ?? '',
      Json_Image_Chart: json.json_image_chart ?? '',
      Url_Image_Chart: json.url_image_chart && json.url_image_chart !== '' && isValidFile(json.url_image_chart) ? global.storage.cleanUrl(json.url_image_chart) : '',
      Name_Image_Chart: json.name_image_chart ?? '',
      Size_Image_Chart: json.size_image_chart ?? '',
      Type_Image_Chart: json.type_image_chart ?? '',
      Skala_Anestesi: json.skala_anestesi ?? '',
      Catatan_Khusus_Ruang_Pemulihan: json.catatan_khusus_ruang_pemulihan ?? '',
      IPA_Antibiotik: json.ipa_antibiotik ?? '',
      IPA_Diet: json.ipa_diet ?? '',
      IPA_Infus: json.ipa_infus ?? '',
      IPA_Lainnya: json.ipa_lainnya ?? '',
      IPA_Obat: json.ipa_obat ?? '',
      IPA_Penanganan_Mual: json.ipa_penanganan_mual ?? '',
      IPA_Pengelolaan_Nyeri: json.ipa_pengelolaan_nyeri ?? '',
      IPA_Tensi_Selama: json.ipa_tensi_selama ?? '',
      IPA_Tensi_Setiap: json.ipa_tensi_setiap ?? '',
      TTD_Dokter_Anestesi: json.ttd_dokter_anestesi && json.ttd_dokter_anestesi !== '' && isValidFile(json.ttd_dokter_anestesi) ? global.storage.cleanUrl(json.ttd_dokter_anestesi) : '',
      ID_Dokter_Anestesi: json.id_dokter_anestesi ?? '',
      TTD_Penata_Anestesi: json.ttd_penata_anestesi && json.ttd_penata_anestesi !== '' && isValidFile(json.ttd_penata_anestesi) ? global.storage.cleanUrl(json.ttd_penata_anestesi) : '',
      ID_Penata_Anestesi: json.id_penata_anestesi ?? '',
    }
  }
}

export class PersiapanPeralatan {
  static createFromJson(json: IUpdatePersiapanPeralatan) {
    return {
      Unit: 'OK',
      Tanggal_Tindakan: json.tanggal_tindakan ?? '',
      Jenis_Operasi: json.jenis_operasi ?? '',
      Teknik_Anestesi: json.teknik_anestesi ?? '',
      Listrik_1: json.listrik_1 && json.listrik_1 === '1' ? '1' : '0',
      Listrik_2: json.listrik_2 && json.listrik_2 === '1' ? '1' : '0',
      Listrik_3: json.listrik_3 && json.listrik_3 === '1' ? '1' : '0',
      Gas_1: json.gas_1 && json.gas_1 === '1' ? '1' : '0',
      Gas_2: json.gas_2 && json.gas_2 === '1' ? '1' : '0',
      Gas_3: json.gas_3 && json.gas_3 === '1' ? '1' : '0',
      Gas_4: json.gas_4 && json.gas_4 === '1' ? '1' : '0',
      Gas_5: json.gas_5 && json.gas_5 === '1' ? '1' : '0',
      Gas_6: json.gas_6 && json.gas_6 === '1' ? '1' : '0',
      Mesin_Anestesi_1: json.mesin_anestesi_1 && json.mesin_anestesi_1 === '1' ? '1' : '0',
      Mesin_Anestesi_2: json.mesin_anestesi_2 && json.mesin_anestesi_2 === '1' ? '1' : '0',
      Mesin_Anestesi_3: json.mesin_anestesi_3 && json.mesin_anestesi_3 === '1' ? '1' : '0',
      Mesin_Anestesi_4: json.mesin_anestesi_4 && json.mesin_anestesi_4 === '1' ? '1' : '0',
      Mesin_Anestesi_5: json.mesin_anestesi_5 && json.mesin_anestesi_5 === '1' ? '1' : '0',
      Manajemen_Nafas_1: json.manajemen_nafas_1 && json.manajemen_nafas_1 === '1' ? '1' : '0',
      Manajemen_Nafas_2: json.manajemen_nafas_2 && json.manajemen_nafas_2 === '1' ? '1' : '0',
      Manajemen_Nafas_3: json.manajemen_nafas_3 && json.manajemen_nafas_3 === '1' ? '1' : '0',
      Manajemen_Nafas_4: json.manajemen_nafas_4 && json.manajemen_nafas_4 === '1' ? '1' : '0',
      Manajemen_Nafas_5: json.manajemen_nafas_5 && json.manajemen_nafas_5 === '1' ? '1' : '0',
      Manajemen_Nafas_6: json.manajemen_nafas_6 && json.manajemen_nafas_6 === '1' ? '1' : '0',
      Manajemen_Nafas_7: json.manajemen_nafas_7 && json.manajemen_nafas_7 === '1' ? '1' : '0',
      Manajemen_Nafas_8: json.manajemen_nafas_8 && json.manajemen_nafas_8 === '1' ? '1' : '0',
      Manajemen_Nafas_9: json.manajemen_nafas_9 && json.manajemen_nafas_9 === '1' ? '1' : '0',
      Pemantauan_1: json.pemantauan_1 && json.pemantauan_1 === '1' ? '1' : '0',
      Pemantauan_2: json.pemantauan_2 && json.pemantauan_2 === '1' ? '1' : '0',
      Pemantauan_3: json.pemantauan_3 && json.pemantauan_3 === '1' ? '1' : '0',
      Pemantauan_4: json.pemantauan_4 && json.pemantauan_4 === '1' ? '1' : '0',
      Pemantauan_5: json.pemantauan_5 && json.pemantauan_5 === '1' ? '1' : '0',
      Pemantauan_6: json.pemantauan_6 && json.pemantauan_6 === '1' ? '1' : '0',
      Lainnya_1: json.lainnya_1 && json.lainnya_1 === '1' ? '1' : '0',
      Lainnya_2: json.lainnya_2 && json.lainnya_2 === '1' ? '1' : '0',
      Lainnya_3: json.lainnya_3 && json.lainnya_3 === '1' ? '1' : '0',
      Lainnya_4: json.lainnya_4 && json.lainnya_4 === '1' ? '1' : '0',
      Lainnya_5: json.lainnya_5 && json.lainnya_5 === '1' ? '1' : '0',
      Lainnya_6: json.lainnya_6 && json.lainnya_6 === '1' ? '1' : '0',
      Lainnya_7: json.lainnya_7 && json.lainnya_7 === '1' ? '1' : '0',
      Obat_1: json.obat_1 && json.obat_1 === '1' ? '1' : '0',
      Obat_2: json.obat_2 && json.obat_2 === '1' ? '1' : '0',
      Obat_3: json.obat_3 && json.obat_3 === '1' ? '1' : '0',
      Obat_4: json.obat_4 && json.obat_4 === '1' ? '1' : '0',
      Obat_5: json.obat_5 && json.obat_5 === '1' ? '1' : '0',
      Obat_6: json.obat_6 && json.obat_6 === '1' ? '1' : '0',
      Obat_7: json.obat_7 && json.obat_7 === '1' ? '1' : '0',
      Obat_7_Teks: json.obat_7_teks ?? '',
      TTD_Dokter_Anestesi: json.ttd_dokter_anestesi && json.ttd_dokter_anestesi !== '' && isValidFile(json.ttd_dokter_anestesi) ? global.storage.cleanUrl(json.ttd_dokter_anestesi) : '',
      ID_Dokter_Anestesi: json.id_dokter_anestesi ?? '',
      TTD_Penata_Anestesi: json.ttd_penata_anestesi && json.ttd_penata_anestesi !== '' && isValidFile(json.ttd_penata_anestesi) ? global.storage.cleanUrl(json.ttd_penata_anestesi) : '',
      ID_Penata_Anestesi: json.id_penata_anestesi ?? '',
    }
  }
}
