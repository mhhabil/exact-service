import { getEmployeeName, isValidFile } from "../../helpers/app.helper";
import { IUpdatePernyataanBPJS, IUpdatePernyataanUMUM, IUpdateResumeMedis } from "./information.request";

export interface IResumeMedisForm {
  Tindakan: string;
  Usg_Mata?: number;
  ID_Dokter:string;
  TTD_Dokter: string;
  Updated_At: string;
  Updated_By: string;
  Foto_Fundus?: number;
  Nama_Dokter: string;
  Alasan_Kontrol: string;
  Tanggal_Kontrol: string;
  Updated_By_Name: string;
  Alasan_Belum_Dapat:string;
  Pemeriksaan_Oct_Papil?: number;
  Rencana_Tindak_Lanjut: string;
  Laboratorium_Radiologi?: number;
  Pemeriksaan_Oct_Retina?: number;
  Pemeriksaan_Lapang_Pandang?: number;
}

export class ResumeMedisForm {
  Tindakan: string;
  Usg_Mata?: number;
  ID_Dokter:string;
  TTD_Dokter: string;
  Updated_At: string;
  Updated_By: string;
  Foto_Fundus?: number;
  Nama_Dokter: string;
  Alasan_Kontrol: string;
  Tanggal_Kontrol: string;
  Updated_By_Name: string;
  Alasan_Belum_Dapat:string;
  Pemeriksaan_Oct_Papil?: number;
  Rencana_Tindak_Lanjut: string;
  Laboratorium_Radiologi?: number;
  Pemeriksaan_Oct_Retina?: number;
  Pemeriksaan_Lapang_Pandang?: number;

  constructor(req: IResumeMedisForm) {
    this.Tindakan = req.Tindakan;
    this.Usg_Mata = req.Usg_Mata;
    this.ID_Dokter = req.ID_Dokter;
    this.TTD_Dokter = req.TTD_Dokter;
    this.Updated_At = req.Updated_At;
    this.Updated_By = req.Updated_By;
    this.Foto_Fundus = req.Foto_Fundus;
    this.Nama_Dokter = req.Nama_Dokter;
    this.Alasan_Kontrol = req.Alasan_Kontrol;
    this.Tanggal_Kontrol = req.Tanggal_Kontrol;
    this.Updated_By_Name = req.Updated_By_Name;
    this.Alasan_Belum_Dapat = req.Alasan_Belum_Dapat;
    this.Pemeriksaan_Oct_Papil = req.Pemeriksaan_Oct_Papil;
    this.Rencana_Tindak_Lanjut = req.Rencana_Tindak_Lanjut;
    this.Laboratorium_Radiologi = req.Laboratorium_Radiologi;
    this.Pemeriksaan_Oct_Retina = req.Pemeriksaan_Oct_Retina;
    this.Pemeriksaan_Lapang_Pandang = req.Pemeriksaan_Lapang_Pandang;
  }

  static createFromJson(json: IUpdateResumeMedis) {
    return {
      Tindakan: json.tindakan ?? '',
      Usg_Mata: json["usg-mata"] ? parseInt(json["usg-mata"]) : undefined,
      ID_Dokter: json["id-dokter"] ?? '',
      TTD_Dokter: json["ttd-dokter"] && json["ttd-dokter"] !== '' && isValidFile(json["ttd-dokter"]) ? json["ttd-dokter"] : '',
      Foto_Fundus: json["foto-fundus"] ? parseInt(json["foto-fundus"]) : undefined,
      Alasan_Kontrol: json["alasan-kontrol"] ?? '',
      Tanggal_Kontrol: json["tanggal-kontrol"] ?? '',
      Alasan_Belum_Dapat: json["alasan-belum-dapat"] ?? '',
      Pemeriksaan_Oct_Papil: json["pemeriksaan-oct-papil"] ? parseInt(json["pemeriksaan-oct-papil"]) : undefined,
      Rencana_Tindak_Lanjut: json["rencana-tindak-lanjut"] ?? '',
      Laboratorium_Radiologi: json["laboratorium-radiologi"] ? parseInt(json["laboratorium-radiologi"]) : undefined,
      Pemeriksaan_Oct_Retina: json["pemeriksaan-oct-retina"] ? parseInt(json["pemeriksaan-oct-retina"]) : undefined,
      Pemeriksaan_Lapang_Pandang: json["pemeriksaan-lapang-pandang"] ? parseInt(json["pemeriksaan-lapang-pandang"]) : undefined,
    }
  }
}

export class PernyataanBPJS {
  Tanggal_TTD: string;
  ID_TTD_Petugas: string;
  Nama_TTD_Petugas: string;
  ID_TTD_Saksi: string;
  Nama_TTD_Saksi: string;
  TTD_Pasien: string;
  TTD_Wali: string;
  TTD_Petugas: string;
  TTD_Saksi: string;
  Penanggung_Jawab: string;
  Nama_Wali: string;
  Alamat_Wali: string;
  Hubungan_Wali: string;
  Umur_Wali: string;
  Jenis_Kelamin_Wali: string;
  ID_Petugas?: string;
  Nama_Petugas?: string;
  Updated_At?: string;
  Updated_By?: string;
  Updated_By_Name?: string;

  constructor(model: IPernyataanBPJS) {
    this.Tanggal_TTD = model.Tanggal_TTD;
    this.ID_TTD_Petugas = model.ID_TTD_Petugas;
    this.Nama_TTD_Petugas = model.Nama_TTD_Petugas;
    this.ID_TTD_Saksi = model.ID_TTD_Saksi;
    this.Nama_TTD_Saksi = model.Nama_TTD_Saksi;
    this.TTD_Pasien = model.TTD_Pasien;
    this.TTD_Wali = model.TTD_Wali;
    this.TTD_Petugas = model.TTD_Petugas;
    this.TTD_Saksi = model.TTD_Saksi;
    this.Nama_Wali = model.Nama_Wali;
    this.Alamat_Wali = model.Alamat_Wali;
    this.Hubungan_Wali = model.Hubungan_Wali;
    this.Umur_Wali = model.Umur_Wali;
    this.Jenis_Kelamin_Wali = model.Jenis_Kelamin_Wali;
    this.Penanggung_Jawab = model.Penanggung_Jawab;
    this.ID_Petugas = model.ID_Petugas;
    this.Nama_Petugas = model.Nama_Petugas;
    this.Updated_At = model.Updated_At;
    this.Updated_By = model.Updated_By;
    this.Updated_By_Name = model.Updated_By_Name;
  }

  static async createFromJson(json: IUpdatePernyataanBPJS) {
    const officerName = await getEmployeeName(json, json.id_ttd_petugas);
    const witnessName = await getEmployeeName(json, json.id_ttd_saksi);
    return new PernyataanBPJS({
      Tanggal_TTD: json.tanggal_ttd,
      ID_TTD_Petugas: json.id_ttd_petugas,
      Nama_TTD_Petugas: officerName ?? '',
      ID_TTD_Saksi: json.id_ttd_saksi,
      Nama_TTD_Saksi: witnessName ?? '',
      TTD_Pasien: json.ttd_pasien && json.ttd_pasien !== '' && isValidFile(json.ttd_pasien) ? global.storage.cleanUrl(json.ttd_pasien) : '',
      TTD_Wali: json.ttd_wali && json.ttd_wali !== '' && isValidFile(json.ttd_wali) ? global.storage.cleanUrl(json.ttd_wali) : '',
      TTD_Petugas: json.ttd_petugas && json.ttd_petugas !== '' && isValidFile(json.ttd_petugas) ? global.storage.cleanUrl(json.ttd_petugas) : '',
      TTD_Saksi: json.ttd_saksi && json.ttd_saksi !== '' && isValidFile(json.ttd_saksi) ? global.storage.cleanUrl(json.ttd_saksi) : '',
      Penanggung_Jawab: json.penanggung_jawab ?? '',
      Nama_Wali: json.nama_wali ?? '',
      Alamat_Wali: json.alamat_wali ?? '',
      Hubungan_Wali: json.hubungan_wali ?? '',
      Umur_Wali: json.umur_wali ?? '',
      Jenis_Kelamin_Wali: json.jenis_kelamin_wali ?? '',
    })
  }
}

export class PernyataanUMUM {
  Tanggal_TTD: string;
  ID_TTD_Petugas: string;
  Nama_TTD_Petugas: string;
  ID_TTD_Saksi: string;
  Nama_TTD_Saksi: string;
  TTD_Pasien: string;
  TTD_Wali: string;
  TTD_Petugas: string;
  TTD_Saksi: string;
  NIK: string;
  ID_Petugas?: string;
  Nama_Petugas?: string;
  Updated_At?: string;
  Updated_By?: string;
  Updated_By_Name?: string;

  constructor(model: IPernyataanUMUM) {
    this.Tanggal_TTD = model.Tanggal_TTD;
    this.ID_TTD_Petugas = model.ID_TTD_Petugas;
    this.Nama_TTD_Petugas = model.Nama_TTD_Petugas;
    this.ID_TTD_Saksi = model.ID_TTD_Saksi;
    this.Nama_TTD_Saksi = model.Nama_TTD_Saksi;
    this.NIK = model.NIK;
    this.TTD_Pasien = model.TTD_Pasien;
    this.TTD_Wali = model.TTD_Wali;
    this.TTD_Petugas = model.TTD_Petugas;
    this.TTD_Saksi = model.TTD_Saksi;
    this.ID_Petugas = model.ID_Petugas;
    this.Nama_Petugas = model.Nama_Petugas;
    this.Updated_At = model.Updated_At;
    this.Updated_By = model.Updated_By;
    this.Updated_By_Name = model.Updated_By_Name;
  }

  static async createFromJson(json: IUpdatePernyataanUMUM) {
    const officerName = await getEmployeeName(json, json.id_ttd_petugas);
    const witnessName = await getEmployeeName(json, json.id_ttd_saksi);
    return new PernyataanUMUM({
      Tanggal_TTD: json.tanggal_ttd,
      ID_TTD_Petugas: json.id_ttd_petugas,
      Nama_TTD_Petugas: officerName ?? '',
      ID_TTD_Saksi: json.id_ttd_saksi,
      Nama_TTD_Saksi: witnessName ?? '',
      NIK: json.nik ?? '',
      TTD_Pasien: json.ttd_pasien && json.ttd_pasien !== '' && isValidFile(json.ttd_pasien) ? global.storage.cleanUrl(json.ttd_pasien) : '',
      TTD_Wali: json.ttd_wali && json.ttd_wali !== '' && isValidFile(json.ttd_wali) ? global.storage.cleanUrl(json.ttd_wali) : '',
      TTD_Petugas: json.ttd_petugas && json.ttd_petugas !== '' && isValidFile(json.ttd_petugas) ? global.storage.cleanUrl(json.ttd_petugas) : '',
      TTD_Saksi: json.ttd_saksi && json.ttd_saksi !== '' && isValidFile(json.ttd_saksi) ? global.storage.cleanUrl(json.ttd_saksi) : '',
    })
  }
}
