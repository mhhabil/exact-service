import { isValidFile } from "../../helpers/app.helper"
import { IDailyEducationRequest } from "./daily-education.request"

export interface IEdukasiHarian {
	Alamat: string
	ID: string
	ID_Pemberi_Edukasi: string
	ID_Petugas: string
	Nama: string
	Nama_Pemberi_Edukasi: string
	Nama_Petugas: string
	Pendengar: string
	Tanda_Tangan: string;
	TTD_Pemberi_Edukasi: string
	Telepon: string
	Unit: string
	Updated_At: string
	Updated_By: string
	Uraian: string
	Waktu: string
}

export class EdukasiHarian {
  Alamat: string
  ID: string
  ID_Pemberi_Edukasi: string
  ID_Petugas: string
  Nama: string
  Nama_Pemberi_Edukasi: string
  Nama_Petugas: string
  Pendengar: string
  Tanda_Tangan: string;
  TTD_Pemberi_Edukasi: string
  Telepon: string
  Unit: string
  Updated_At: string
  Updated_By: string
  Uraian: string
  Waktu: string

  constructor(req: IEdukasiHarian) {
    this.Alamat = req.Alamat;
    this.ID = req.ID;
    this.ID_Pemberi_Edukasi = req.ID_Pemberi_Edukasi;
    this.ID_Petugas = req.ID_Petugas;
    this.Nama = req.Nama;
    this.Nama_Pemberi_Edukasi = req.Nama_Pemberi_Edukasi;
    this.Nama_Petugas = req.Nama_Petugas;
    this.Pendengar = req.Pendengar;
    this.Tanda_Tangan = req.Tanda_Tangan;
    this.TTD_Pemberi_Edukasi = req.TTD_Pemberi_Edukasi;
    this.Telepon = req.Telepon;
    this.Unit = req.Unit;
    this.Updated_At = req.Updated_At;
    this.Updated_By = req.Updated_By;
    this.Uraian = req.Uraian;
    this.Waktu = req.Waktu;
  }

  static createFromJson(json: IDailyEducationRequest) {
    return {
      Alamat: json.alamat ? json.alamat : '',
      ID_Pemberi_Edukasi: json["id-pemberi-edukasi"] ? json["id-pemberi-edukasi"] : '',
      Nama: json.nama ? json.nama : '',
      Pendengar: (json["pendengar-radio"] && json["pendengar-radio"] === '1') ? 'Pasien' : 'Wali',
      Tanda_Tangan: (json["tanda-tangan"] && json["tanda-tangan"] !== '' && isValidFile(json["tanda-tangan"])) ? global.storage.cleanUrl(json["tanda-tangan"]) : '',
      TTD_Pemberi_Edukasi: (json["ttd-pemberi-edukasi"] && json["ttd-pemberi-edukasi"] !== '' && isValidFile(json["ttd-pemberi-edukasi"])) ? global.storage.cleanUrl(json["ttd-pemberi-edukasi"]) : '',
      Telepon: json.telepon ? json.telepon : '',
      Unit: json.unit ? json.unit : '',
      Uraian: json.uraian ? json.uraian : '',
      Waktu: json.waktu ? json.waktu : '',
    }
  }
}
