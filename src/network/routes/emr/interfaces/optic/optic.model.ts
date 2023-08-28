import { isValidFile } from "../../helpers/app.helper";
import { IUpdateResepKacamata } from "./optic.request";

export interface IGlassesPrescriptionDetail {
  Reading: string;
  Distance: string;
}

export interface IGlassesPrescriptionEyes {
  Ax?: IGlassesPrescriptionDetail;
  Va?: IGlassesPrescriptionDetail;
  Cyl?: IGlassesPrescriptionDetail;
  Sph?: IGlassesPrescriptionDetail;
}

export interface IPrescriptionDetail {
  No_Faktur: number;
  ID_Resep_H: number;
}

export interface IFormResepKacamata {
  Pengkajian_Awal_Od: string;
  Pengkajian_Awal_Os: string;
  PD?: IGlassesPrescriptionDetail;
  Left?: IGlassesPrescriptionEyes;
  Right?: IGlassesPrescriptionEyes;
  ID_Resep?: IPrescriptionDetail;
  Dokter_Id: string;
  ID_Petugas: string;
  TTD_Dokter: string;
  Updated_At: string;
  Updated_By: string;
  Dokter_Nama: string;
  Catatan_Lain: string;
  Nama_Petugas: string;
  Tanggal_Resep: string;
}

export class FormResepKacamata {
  Pengkajian_Awal_Od: string;
  Pengkajian_Awal_Os: string;
  PD?: IGlassesPrescriptionDetail;
  Left?: IGlassesPrescriptionEyes;
  Right?: IGlassesPrescriptionEyes;
  ID_Resep?: IPrescriptionDetail;
  Dokter_Id: string;
  ID_Petugas: string;
  TTD_Dokter: string;
  Updated_At: string;
  Updated_By: string;
  Dokter_Nama: string;
  Catatan_Lain: string;
  Nama_Petugas: string;
  Tanggal_Resep: string;

  constructor(glassesPrescriptionFormModel: IFormResepKacamata) {
    this.Pengkajian_Awal_Od = glassesPrescriptionFormModel.Pengkajian_Awal_Od;
    this.Pengkajian_Awal_Os = glassesPrescriptionFormModel.Pengkajian_Awal_Os;
    this.PD = glassesPrescriptionFormModel.PD;
    this.Left = glassesPrescriptionFormModel.Left;
    this.Right = glassesPrescriptionFormModel.Right;
    this.ID_Resep = glassesPrescriptionFormModel.ID_Resep;
    this.Dokter_Id = glassesPrescriptionFormModel.Dokter_Id;
    this.ID_Petugas = glassesPrescriptionFormModel.ID_Petugas;
    this.TTD_Dokter = glassesPrescriptionFormModel.TTD_Dokter;
    this.Updated_At = glassesPrescriptionFormModel.Updated_At;
    this.Updated_By = glassesPrescriptionFormModel.Updated_By;
    this.Dokter_Nama = glassesPrescriptionFormModel.Dokter_Nama;
    this.Catatan_Lain = glassesPrescriptionFormModel.Catatan_Lain;
    this.Nama_Petugas = glassesPrescriptionFormModel.Nama_Petugas;
    this.Tanggal_Resep = glassesPrescriptionFormModel.Tanggal_Resep;
  }

  static createFromJson(json: IUpdateResepKacamata) {
    return {
      Dokter_Id: (json.dokter) ? json.dokter : '',
      TTD_Dokter: (json["ttd-dokter"] && json["ttd-dokter"] !== '' && isValidFile(json["ttd-dokter"])) ? global.storage.cleanUrl(json["ttd-dokter"]) : '',
      Catatan_Lain: (json["catatan-lain"]) ? json["catatan-lain"] : '',
      Tanggal_Resep: (json["tanggal-resep"]) ? json["tanggal-resep"] : '',
      Pengkajian_Awal_Od: (json["pengkajian-awal-od"]) ? json["pengkajian-awal-od"] : '',
      Pengkajian_Awal_Os: (json["pengkajian-awal-os"]) ? json["pengkajian-awal-os"] : '',
      Left: {
        Sph: {
          Reading: (json.sph_left_reading) ? json.sph_left_reading : '',
          Distance: (json.sph_left_distance) ? json.sph_left_distance : '',
        },
        Cyl: {
          Reading: (json.cyl_left_reading) ? json.cyl_left_reading : '',
          Distance: (json.cyl_left_distance) ? json.cyl_left_distance : '',
        },
        Ax: {
          Reading: (json.ax_left_reading) ? json.ax_left_reading : '',
          Distance: (json.ax_left_distance) ? json.ax_left_distance : '',
        },
        Va: {
          Reading: (json.va_left_reading) ? json.va_left_reading : '',
          Distance: (json.va_left_distance) ? json.va_left_distance : '',
        },
      },
      Right: {
        Sph: {
          Reading: (json.sph_right_reading) ? json.sph_right_reading : '',
          Distance: (json.sph_right_distance) ? json.sph_right_distance : '',
        },
        Cyl: {
          Reading: (json.cyl_right_reading) ? json.cyl_right_reading : '',
          Distance: (json.cyl_right_distance) ? json.cyl_right_distance : '',
        },
        Ax: {
          Reading: (json.ax_right_reading) ? json.ax_right_reading : '',
          Distance: (json.ax_right_distance) ? json.ax_right_distance : '',
        },
        Va: {
          Reading: (json.va_right_reading) ? json.va_right_reading : '',
          Distance: (json.va_right_distance) ? json.va_right_distance : '',
        },
      },
      PD: {
        Reading: (json.pd_reading) ? json.pd_reading : '',
        Distance: (json.pd_distance) ? json.pd_distance : '',
      },
    }
  }
}

export interface IPreliminaryStudyDetail {
  Va: string;
  Add: string;
  Cyl: string;
  Sph: string;
  Axis: string;
  False: string;
  Jagger: string;
  Select: string;
  Pd_Jauh: string;
  Pd_Dekat: string;
  Adaptasi?: string;
}

export interface IPreliminaryStudyODOS {
  PH: string;
  VA: string;
  Add: string;
  False: string;
  Jagger: string;
  Schiotz: string;
  Non_Contact: string;
  Tanam_Lensa: string;
  KMB?: IPreliminaryStudyDetail;
  KML?: IPreliminaryStudyDetail;
  RPL?: IPreliminaryStudyDetail;
  Koreksi_1?: IPreliminaryStudyDetail;
  Koreksi_2?: IPreliminaryStudyDetail;
  RPL_Streak?: IPreliminaryStudyDetail;
}

export interface IPreliminaryStudyForm {
  Keluhan: string;
  Id_Keluhan: string;
  Keluhan_Lain: string;
  Catatan_Lain: string;
  ID_Petugas: string;
  ID_Petugas_Ro: string;
  Nama_Petugas: string;
  Nama_Petugas_Ro: string;
  TTD_Petugas_Ro: string;
  Updated_At: string;
  Updated_By: string;
  Waktu: string;
  OD?: IPreliminaryStudyODOS;
  OS?: IPreliminaryStudyODOS;
}

export interface IPatientModel {
  Agama: string;
  Alamat: string;
  Global_No_MR: string;
  Jenis_Kelamin: string;
  Kabupaten: string;
  Nama: string;
  No_BPJS: string;
  No_HP: string;
  No_MR: string;
  No_Telepon: string;
  Pekerjaan: string;
  Pendidikan: string;
  Provinsi: string;
  Status_Nikah: string;
  Suku: string;
  Tempat_Lahir: string;
  Tgl_Daftar: string;
  Tgl_Lahir: string;
  Umur: number;
}

export interface IResepKacamata {
  EMR_ID: any;
  nomor_mr: string;
  id_pelayanan: string;
  jenis_pelayanan: string;
  kode_cabang: string;
  tipe_pasien: string;
  form: IFormResepKacamata;
  formRO: IPreliminaryStudyForm;
  pasien: IPatientModel;
}

