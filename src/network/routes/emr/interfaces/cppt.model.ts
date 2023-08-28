import { isValidFile } from "../helpers/app.helper"

export interface ICPPTRO {
	ID?: string
	Data_S: string
	Data_O: string
	Data_O_Json?: any
	Data_A: string
	Data_A_Text?: string
	Data_P: string
	Instruksi_PPA: string
	Unit: string
	Waktu: string
  ID_Pelayanan: string;
	ID_Petugas?: string
	Nama_Petugas?: string
	Is_Dokter: string
	Id_Perawat_Cppt: string
	TTD_Perawat_Cppt: string
	Nama_Perawat_Cppt: string
	Id_Dokter_Pengkaji: string
	TTD_Dokter_Pengkaji: string
	Nama_Dokter_Pengkaji: string
	Updated_At: string
	Updated_By: string
	Updated_By_Name: string
}

export class CPPTRO {
  ID?: string
  Data_S: string
  Data_O: string
  Data_O_Json?: any
  Data_A: string
  Data_A_Text?: string
  Data_P: string
  Instruksi_PPA: string
  Unit: string
  Waktu: string
  ID_Pelayanan: string;
  ID_Petugas?: string
  Nama_Petugas?: string
  Is_Dokter: string
  Id_Perawat_Cppt: string
  TTD_Perawat_Cppt: string
  Nama_Perawat_Cppt: string
  Id_Dokter_Pengkaji: string
  TTD_Dokter_Pengkaji: string
  Nama_Dokter_Pengkaji: string
  Updated_At: string
  Updated_By: string
  Updated_By_Name: string

  constructor(req: ICPPTRO) {
    this.ID = req.ID;
    this.Data_S = req.Data_S;
    this.Data_O = req.Data_O;
    this.Data_O_Json = req.Data_O_Json;
    this.Data_A = req.Data_A;
    this.Data_A_Text = req.Data_A_Text;
    this.Data_P = req.Data_P;
    this.Instruksi_PPA = req.Instruksi_PPA;
    this.Unit = req.Unit;
    this.Waktu = req.Waktu;
    this.ID_Pelayanan = req.ID_Pelayanan;
    this.ID_Petugas = req.ID_Petugas;
    this.Is_Dokter = req.Is_Dokter;
    this.Id_Perawat_Cppt = req.Id_Perawat_Cppt;
    this.TTD_Perawat_Cppt = req.TTD_Perawat_Cppt;
    this.Nama_Perawat_Cppt = req.Nama_Perawat_Cppt;
    this.Id_Dokter_Pengkaji = req.Id_Dokter_Pengkaji;
    this.TTD_Dokter_Pengkaji = req.TTD_Dokter_Pengkaji;
    this.Nama_Dokter_Pengkaji = req.Nama_Dokter_Pengkaji;
    this.Updated_At = req.Updated_At;
    this.Updated_By = req.Updated_By;
    this.Updated_By_Name = req.Updated_By_Name;
  }

  static createFromJson(json: any) {
    return {
      ID_Pelayanan: json['id-pelayanan'] ? json['id-pelayanan'] : '',
      Data_S: json["data-s"] ? json["data-s"] : '',
      Data_O: json["data-o"] ? json["data-o"] : '',
      Data_O_Json: json['data-o-json'] ? json['data-o-json'] : {},
      Cmb_Data_O: json['cmb-data-o'] && json['cmb-data-o'] === '1' ? 1 : 2,
      Data_A: json["data-a"] ? json["data-a"] : '',
      Data_A_Text: json["data-a-text"] ? json["data-a-text"] : '',
      Data_P: json["data-p"] ? json["data-p"] : '',
      Instruksi_PPA: json["instruksi-ppa"] ? json["instruksi-ppa"] : '',
      Unit: json["unit"] ? json["unit"] : 'RO',
      Waktu: json["waktu"] ? json["waktu"] : '',
      Id_Perawat_Cppt: json["id-perawat-cppt"] ? json["id-perawat-cppt"] : '',
      TTD_Perawat_Cppt: (json["ttd-perawat-cppt"] && json["ttd-perawat-cppt"] !== '' && isValidFile(json["ttd-perawat-cppt"])) ? global.storage.cleanUrl(json["ttd-perawat-cppt"]) : '',
      Id_Dokter_Pengkaji: json["id-dokter-pengkaji"] ? json["id-dokter-pengkaji"] : '',
      TTD_Dokter_Pengkaji: (json["ttd-dokter-pengkaji"] && json["ttd-dokter-pengkaji"] !== '' && isValidFile(json["ttd-dokter-pengkaji"])) ? global.storage.cleanUrl(json["ttd-dokter-pengkaji"]) : '',
    }
  }
}

export interface ICPPTFarmasi {
  ID?: string
	Data_S: string
	Data_O: string
  Data_O_Tambahan: string;
  Masalah_Obat_Radio: string;
  Masalah_Obat_Teks: string;
  Efek_Samping_Obat: string;
  Interaksi_Obat: string;
  Monitor_Terapi: string;
  Monitor_Efek_Samping: string;
  Anjuran_Dokter: string;
  Anjuran_Perawat: string;
	Instruksi_PPA: string
	Unit: string
	Waktu: string
  ID_Pelayanan: string;
	ID_Petugas?: string
	Nama_Petugas?: string
	Is_Dokter: string
	Id_Perawat_Cppt: string
	TTD_Perawat_Cppt: string
	Nama_Perawat_Cppt: string
	Id_Dokter_Pengkaji: string
	TTD_Dokter_Pengkaji: string
	Nama_Dokter_Pengkaji: string
	Updated_At: string
	Updated_By: string
	Updated_By_Name: string
}

export class CPPTFarmasi {
  ID?: string
  Data_S: string
  Data_O: string
  Data_O_Tambahan: string;
  Masalah_Obat_Radio: string;
  Masalah_Obat_Teks: string;
  Efek_Samping_Obat: string;
  Interaksi_Obat: string;
  Monitor_Terapi: string;
  Monitor_Efek_Samping: string;
  Anjuran_Dokter: string;
  Anjuran_Perawat: string;
  Instruksi_PPA: string
  Unit: string
  Waktu: string
  ID_Pelayanan: string;
  ID_Petugas?: string
  Nama_Petugas?: string
  Is_Dokter: string
  Id_Perawat_Cppt: string
  TTD_Perawat_Cppt: string
  Nama_Perawat_Cppt: string
  Id_Dokter_Pengkaji: string
  TTD_Dokter_Pengkaji: string
  Nama_Dokter_Pengkaji: string
  Updated_At: string
  Updated_By: string
  Updated_By_Name: string

  constructor(req: ICPPTFarmasi) {
    this.ID = req.ID;
    this.Data_S = req.Data_S;
    this.Data_O = req.Data_O;
    this.Data_O_Tambahan = req.Data_O_Tambahan;
    this.Masalah_Obat_Radio = req.Masalah_Obat_Radio;
    this.Masalah_Obat_Teks = req.Masalah_Obat_Teks;
    this.Efek_Samping_Obat = req.Efek_Samping_Obat;
    this.Interaksi_Obat = req.Interaksi_Obat;
    this.Monitor_Terapi = req.Monitor_Terapi;
    this.Monitor_Efek_Samping = req.Monitor_Efek_Samping;
    this.Anjuran_Dokter = req.Anjuran_Dokter;
    this.Anjuran_Perawat = req.Anjuran_Perawat;
    this.Instruksi_PPA = req.Instruksi_PPA;
    this.Unit = req.Unit;
    this.Waktu = req.Waktu;
    this.ID_Pelayanan = req.ID_Pelayanan;
    this.ID_Petugas = req.ID_Petugas;
    this.Nama_Petugas = req.Nama_Petugas;
    this.Is_Dokter = req.Is_Dokter;
    this.Id_Perawat_Cppt = req.Id_Perawat_Cppt;
    this.TTD_Perawat_Cppt = req.TTD_Perawat_Cppt;
    this.Nama_Perawat_Cppt = req.Nama_Perawat_Cppt;
    this.Id_Dokter_Pengkaji = req.Id_Dokter_Pengkaji;
    this.TTD_Dokter_Pengkaji = req.TTD_Dokter_Pengkaji;
    this.Nama_Dokter_Pengkaji = req.Nama_Dokter_Pengkaji;
    this.Updated_At = req.Updated_At;
    this.Updated_By = req.Updated_By;
    this.Updated_By_Name = req.Updated_By_Name;
  }

  static createFromJson(json: any) {
    return {
      ID_Pelayanan: json['id-pelayanan'] ? json['id-pelayanan'] : '',
      Data_S: json['data-s'] ? json['data-s'] : '',
      Data_O: json['data-o'] ? json['data-o'] : '',
      Data_O_Tambahan: json['data-o-tambahan'] ? json['data-o-tambahan'] : '',
      Masalah_Obat_Radio: json['masalah-obat-radio'] ? json['masalah-obat-radio'] : '',
      Masalah_Obat_Teks: json['masalah-obat-teks'] ? json['masalah-obat-teks'] : '',
      Efek_Samping_Obat_Radio: json['efek-samping-obat-radio'] ?? '',
      Efek_Samping_Obat: json['efek-samping-obat'] ? json['efek-samping-obat'] : '',
      Interaksi_Obat_Radio: json['interaksi-obat-radio'] ?? '',
      Interaksi_Obat: json['interaksi-obat'] ? json['interaksi-obat'] : '',
      Monitor_Terapi: json['monitor-terapi'] ? json['monitor-terapi'] : '',
      Monitor_Efek_Samping: json['monitor-efek-samping'] ? json['monitor-efek-samping'] : '',
      Anjuran_Dokter: json['anjuran-dokter'] ? json['anjuran-dokter'] : '',
      Anjuran_Perawat: json['anjuran-perawat'] ? json['anjuran-perawat'] : '',
      Instruksi_PPA: json['instruksi-ppa'] ? json['instruksi-ppa'] : '',
      Unit: 'Farmasi',
      Waktu: json['waktu'] ? json['waktu'] : '',
      Id_Perawat_Cppt: json['id-perawat-cppt'] ? json['id-perawat-cppt'] : '',
      TTD_Perawat_Cppt: (json['ttd-perawat-cppt'] && json['ttd-perawat-cppt'] !== '' && isValidFile(json['ttd-perawat-cppt'])) ? global.storage.cleanUrl(json['ttd-perawat-cppt']) : '',
      Id_Dokter_Pengkaji: json['id-dokter-pengkaji'] ? json['id-dokter-pengkaji'] : '',
      TTD_Dokter_Pengkaji: (json['ttd-dokter-pengkaji'] && json['ttd-dokter-pengkaji'] !== '' && isValidFile(json['ttd-dokter-pengkaji'])) ? global.storage.cleanUrl(json['ttd-dokter-pengkaji']) : '',
    }
  }
}

export interface ICPPTRawatInap {
  ID?: string;
	Data_A: string
	Data_A_Lain_Text: string
	Data_O: string
	Data_P: string
	Data_P_Lain_Text: string
	Data_S: string
	Data_S_Lain_Text: string
	Gambar_Mata_OD: string
	Gambar_Mata_OS: string
	Gambar_Retina_OD: string
	Gambar_Retina_OS: string
	ID_Pelayanan: string
	ID_Petugas: string
	Id_Dokter_Pengkaji: string
	Id_Perawat_Cppt: string
	Instruksi_PPA: string
	Is_Dokter: boolean
	Is_Form_Dokter: number
	Nama_Dokter_Pengkaji: string
	Nama_Perawat_Cppt: string
	Nama_Petugas: string
	Pediatrik: IPediatric
	Resep: Array<IPrescription>
	Submit_Mata: number
	Submit_Pediatrik: number
	Submit_Retina: number
	TTD_Dokter_Pengkaji: string;
	TTD_Perawat_Cppt: string;
	Unit: string;
	Updated_At: string;
	Updated_By: string;
	Waktu: string;
}

export class CPPTRawatInap {
  ID?: string;
  Data_A: string
  Data_A_Lain_Text: string
  Data_O: string
  Data_P: string
  Data_P_Lain_Text: string
  Data_S: string
  Data_S_Lain_Text: string
  Gambar_Mata_OD: string
  Gambar_Mata_OS: string
  Gambar_Retina_OD: string
  Gambar_Retina_OS: string
  ID_Pelayanan: string
  ID_Petugas: string
  Id_Dokter_Pengkaji: string
  Id_Perawat_Cppt: string
  Instruksi_PPA: string
  Is_Dokter: boolean
  Is_Form_Dokter: number
  Nama_Dokter_Pengkaji: string
  Nama_Perawat_Cppt: string
  Nama_Petugas: string
  Pediatrik: IPediatric
  Resep: Array<IPrescription>
  Submit_Mata: number
  Submit_Pediatrik: number
  Submit_Retina: number
  TTD_Dokter_Pengkaji: string;
  TTD_Perawat_Cppt: string;
  Unit: string;
  Updated_At: string;
  Updated_By: string;
  Waktu: string;

  constructor(req: ICPPTRawatInap) {
    this.ID = req.ID;
    this.Data_A = req.Data_A;
    this.Data_A_Lain_Text = req.Data_A_Lain_Text;
    this.Data_O = req.Data_O;
    this.Data_P = req.Data_P;
    this.Data_P_Lain_Text = req.Data_P_Lain_Text;
    this.Data_S = req.Data_S;
    this.Data_S_Lain_Text = req.Data_S_Lain_Text;
    this.Gambar_Mata_OD = req.Gambar_Mata_OD;
    this.Gambar_Mata_OS = req.Gambar_Mata_OS;
    this.Gambar_Retina_OD = req.Gambar_Retina_OD;
    this.Gambar_Retina_OS = req.Gambar_Retina_OS;
    this.ID_Pelayanan = req.ID_Pelayanan;
    this.ID_Petugas = req.ID_Petugas;
    this.Id_Dokter_Pengkaji = req.Id_Dokter_Pengkaji;
    this.Id_Perawat_Cppt = req.Id_Perawat_Cppt;
    this.Instruksi_PPA = req.Instruksi_PPA;
    this.Is_Dokter = req.Is_Dokter;
    this.Is_Form_Dokter = req.Is_Form_Dokter;
    this.Nama_Dokter_Pengkaji = req.Nama_Dokter_Pengkaji;
    this.Nama_Perawat_Cppt = req.Nama_Perawat_Cppt;
    this.Nama_Petugas = req.Nama_Petugas;
    this.Pediatrik = req.Pediatrik;
    this.Resep = (req.Resep && Array.isArray(req.Resep)) ? req.Resep : [];
    this.Submit_Mata = req.Submit_Mata;
    this.Submit_Pediatrik = req.Submit_Pediatrik;
    this.Submit_Retina = req.Submit_Retina;
    this.TTD_Dokter_Pengkaji = req.TTD_Dokter_Pengkaji;
    this.TTD_Perawat_Cppt = req.TTD_Perawat_Cppt;
    this.Unit = req.Unit;
    this.Updated_At = req.Updated_At;
    this.Updated_By = req.Updated_By;
    this.Waktu = req.Waktu;
  }

  static createFromJson(json: any) {
    return {
      ID_Berobat: json['id_berobat'] ? json['id_berobat'] : '',
      Data_A: json['data-a'] ? json['data-a'] : '',
      Data_A_Lain_Text: json['data-a-lain-text'] ? json['data-a-lain-text'] : '',
      Data_S: json['data-s'] ? json['data-s'] : '',
      Data_S_Lain_Text: json['data-s-lain-text'] ? json['data-s-lain-text'] : '',
      Data_O: json['data-o'] ? json['data-o'] : '',
      Data_O_Tambahan: json['data-o-tambahan'] ? json['data-o-tambahan'] : '',
      Data_P: json['data-p'] ? json['data-p'] : '',
      Data_P_Lain_Text: json['data-p-lain-text'] ? json['data-p-lain-text'] : '',
      Instruksi_PPA: json['instruksi-ppa'] ? json['instruksi-ppa'] : '',
      Submit_Mata: (json['submit-mata'] && json['submit-mata'] === '1') ? 1 : 0,
      Gambar_Mata_OD: (json['gambar-mata-od'] && json['gambar-mata-od'] !== '' && isValidFile(json['gambar-mata-od'])) ? global.storage.cleanUrl(json['gambar-mata-od']) : '',
      Gambar_Mata_OS: (json['gambar-mata-os'] && json['gambar-mata-os'] !== '' && isValidFile(json['gambar-mata-os'])) ? global.storage.cleanUrl(json['gambar-mata-os']) : '',
      Submit_Retina: (json['submit-retina'] && json['submit-retina'] === '1') ? 1 : 0,
      Gambar_Retina_OD: (json['gambar-retina-od'] && json['gambar-retina-od'] !== '' && isValidFile(json['gambar-retina-od'])) ? global.storage.cleanUrl(json['gambar-retina-od']) : '',
      Gambar_Retina_OS: (json['gambar-retina-os'] && json['gambar-retina-os'] !== '' && isValidFile(json['gambar-retina-os'])) ? global.storage.cleanUrl(json['gambar-retina-os']) : '',
      Submit_Pediatrik: (json['submit-pediatrik'] && json['submit-pediatrik'] === '1') ? 1 : 0,
      Pediatrik: json.pediatrik ? json.pediatrik : {},
      Unit: 'RawatInap',
      Waktu: json['waktu'] ? json['waktu'] : '',
      Anjuran: json['anjuran'] ? json['anjuran'] : '',
      Is_Form_Dokter: (json['is-form-dokter']) ? 1 : 0,
      Id_Perawat_Cppt: json['id-perawat-cppt'] ? json['id-perawat-cppt'] : '',
      TTD_Perawat_Cppt: (json['ttd-perawat-cppt'] && json['ttd-perawat-cppt'] !== '' && isValidFile(json['ttd-perawat-cppt'])) ? global.storage.cleanUrl(json['ttd-perawat-cppt']) : '',
      Id_Dokter_Pengkaji: json['id-dokter-pengkaji'] ? json['id-dokter-pengkaji'] : '',
      TTD_Dokter_Pengkaji: (json['ttd-dokter-pengkaji'] && json['ttd-dokter-pengkaji'] !== '' && isValidFile(json['ttd-dokter-pengkaji'])) ? global.storage.cleanUrl(json['ttd-dokter-pengkaji']) : '',
      TD: json.td ?? '',
      KGD: json.kgd ?? '',
      Konsultasi: json.konsultasi ?? '',
    }
  }
}
export interface ICPPTRawatJalan {
	ID?: string;
	Data_A: string
	Data_A_Lain_Text: string
	Data_O: string
	Data_P: string
	Data_P_Lain_Text: string
	Data_S: string
	Data_S_Lain_Text: string
	Gambar_Mata_OD: string
	Gambar_Mata_OS: string
	Gambar_Retina_OD: string
	Gambar_Retina_OS: string
	ID_Pelayanan: string
	ID_Petugas: string
	Id_Dokter_Pengkaji: string
	Id_Perawat_Cppt: string
	Instruksi_PPA: string
	Is_Dokter: boolean
	Is_Form_Dokter: number
	Nama_Dokter_Pengkaji: string
	Nama_Perawat_Cppt: string
	Nama_Petugas: string
	Pediatrik: IPediatric
	Resep: Array<IPrescription>
	Submit_Mata: number
	Submit_Pediatrik: number
	Submit_Retina: number
	TTD_Dokter_Pengkaji: string;
	TTD_Perawat_Cppt: string;
	Unit: string;
	Updated_At: string;
	Updated_By: string;
	Waktu: string;
}

export class CPPTUGD {
  ID?: string;
  Data_A: string
  Data_A_Lain_Text: string
  Data_O: string
  Data_P: string
  Data_P_Lain_Text: string
  Data_S: string
  Data_S_Lain_Text: string
  Gambar_Mata_OD: string
  Gambar_Mata_OS: string
  Gambar_Retina_OD: string
  Gambar_Retina_OS: string
  ID_Pelayanan: string
  ID_Petugas: string
  Id_Dokter_Pengkaji: string
  Id_Perawat_Cppt: string
  Instruksi_PPA: string
  Is_Dokter: boolean
  Is_Form_Dokter: number
  Nama_Dokter_Pengkaji: string
  Nama_Perawat_Cppt: string
  Nama_Petugas: string
  Pediatrik: IPediatric
  Resep: Array<IPrescription>
  Submit_Mata: number
  Submit_Pediatrik: number
  Submit_Retina: number
  TTD_Dokter_Pengkaji: string;
  TTD_Perawat_Cppt: string;
  Unit: string;
  Updated_At: string;
  Updated_By: string;
  Waktu: string;

  constructor(req: ICPPTRawatJalan) {
    this.ID = req.ID;
    this.Data_A = req.Data_A;
    this.Data_A_Lain_Text = req.Data_A_Lain_Text;
    this.Data_O = req.Data_O;
    this.Data_P = req.Data_P;
    this.Data_P_Lain_Text = req.Data_P_Lain_Text;
    this.Data_S = req.Data_S;
    this.Data_S_Lain_Text = req.Data_S_Lain_Text;
    this.Gambar_Mata_OD = req.Gambar_Mata_OD;
    this.Gambar_Mata_OS = req.Gambar_Mata_OS;
    this.Gambar_Retina_OD = req.Gambar_Retina_OD;
    this.Gambar_Retina_OS = req.Gambar_Retina_OS;
    this.ID_Pelayanan = req.ID_Pelayanan;
    this.ID_Petugas = req.ID_Petugas;
    this.Id_Dokter_Pengkaji = req.Id_Dokter_Pengkaji;
    this.Id_Perawat_Cppt = req.Id_Perawat_Cppt;
    this.Instruksi_PPA = req.Instruksi_PPA;
    this.Is_Dokter = req.Is_Dokter;
    this.Is_Form_Dokter = req.Is_Form_Dokter;
    this.Nama_Dokter_Pengkaji = req.Nama_Dokter_Pengkaji;
    this.Nama_Perawat_Cppt = req.Nama_Perawat_Cppt;
    this.Nama_Petugas = req.Nama_Petugas;
    this.Pediatrik = req.Pediatrik;
    this.Resep = (req.Resep && Array.isArray(req.Resep)) ? req.Resep : [];
    this.Submit_Mata = req.Submit_Mata;
    this.Submit_Pediatrik = req.Submit_Pediatrik;
    this.Submit_Retina = req.Submit_Retina;
    this.TTD_Dokter_Pengkaji = req.TTD_Dokter_Pengkaji;
    this.TTD_Perawat_Cppt = req.TTD_Perawat_Cppt;
    this.Unit = req.Unit;
    this.Updated_At = req.Updated_At;
    this.Updated_By = req.Updated_By;
    this.Waktu = req.Waktu;
  }

  static createFromJson(json: any) {
    return {
      ID_Pelayanan: json['id-pelayanan'] ? json['id-pelayanan'] : '',
      Data_A: json['data-a'] ? json['data-a'] : '',
      Data_A_Lain_Text: json['data-a-lain-text'] ? json['data-a-lain-text'] : '',
      Data_S: json['data-s'] ? json['data-s'] : '',
      Data_S_Lain_Text: json['data-s-lain-text'] ? json['data-s-lain-text'] : '',
      Data_O: json['data-o'] ? json['data-o'] : '',
      Data_O_Tambahan: json['data-o-tambahan'] ? json['data-o-tambahan'] : '',
      Data_P: json['data-p'] ? json['data-p'] : '',
      Data_P_Lain_Text: json['data-p-lain-text'] ? json['data-p-lain-text'] : '',
      Instruksi_PPA: json['instruksi-ppa'] ? json['instruksi-ppa'] : '',
      Kesimpulan_Pemeriksaan: json.kesimpulan_pemeriksaan ?? '',
      Submit_Mata: (json['submit-mata'] && json['submit-mata'] === '1') ? 1 : 0,
      Gambar_Mata_OD: (json['gambar-mata-od'] && json['gambar-mata-od'] !== '' && isValidFile(json['gambar-mata-od'])) ? global.storage.cleanUrl(json['gambar-mata-od']) : '',
      Gambar_Mata_OS: (json['gambar-mata-os'] && json['gambar-mata-os'] !== '' && isValidFile(json['gambar-mata-os'])) ? global.storage.cleanUrl(json['gambar-mata-os']) : '',
      Submit_Retina: (json['submit-retina'] && json['submit-retina'] === '1') ? 1 : 0,
      Gambar_Retina_OD: (json['gambar-retina-od'] && json['gambar-retina-od'] !== '' && isValidFile(json['gambar-retina-od'])) ? global.storage.cleanUrl(json['gambar-retina-od']) : '',
      Gambar_Retina_OS: (json['gambar-retina-os'] && json['gambar-retina-os'] !== '' && isValidFile(json['gambar-retina-os'])) ? global.storage.cleanUrl(json['gambar-retina-os']) : '',
      Submit_Pediatrik: (json['submit-pediatrik'] && json['submit-pediatrik'] === '1') ? 1 : 0,
      Pediatrik: json.pediatrik ? json.pediatrik : {},
      Unit: 'UGD',
      Waktu: json['waktu'] ? json['waktu'] : '',
      Anjuran: json['anjuran'] ? json['anjuran'] : '',
      Is_Form_Dokter: (json['is-form-dokter']) ? 1 : 0,
      Id_Perawat_Cppt: json['id-perawat-cppt'] ? json['id-perawat-cppt'] : '',
      TTD_Perawat_Cppt: (json['ttd-perawat-cppt'] && json['ttd-perawat-cppt'] !== '' && isValidFile(json['ttd-perawat-cppt'])) ? global.storage.cleanUrl(json['ttd-perawat-cppt']) : '',
      Id_Dokter_Pengkaji: json['id-dokter-pengkaji'] ? json['id-dokter-pengkaji'] : '',
      TTD_Dokter_Pengkaji: (json['ttd-dokter-pengkaji'] && json['ttd-dokter-pengkaji'] !== '' && isValidFile(json['ttd-dokter-pengkaji'])) ? global.storage.cleanUrl(json['ttd-dokter-pengkaji']) : '',
      TD: json.td ?? '',
      KGD: json.kgd ?? '',
      Konsultasi: json.konsultasi ?? '',
    }
  }
}

export class CPPTRawatJalan {
  ID?: string;
  Data_A: string
  Data_A_Lain_Text: string
  Data_O: string
  Data_P: string
  Data_P_Lain_Text: string
  Data_S: string
  Data_S_Lain_Text: string
  Gambar_Mata_OD: string
  Gambar_Mata_OS: string
  Gambar_Retina_OD: string
  Gambar_Retina_OS: string
  ID_Pelayanan: string
  ID_Petugas: string
  Id_Dokter_Pengkaji: string
  Id_Perawat_Cppt: string
  Instruksi_PPA: string
  Is_Dokter: boolean
  Is_Form_Dokter: number
  Nama_Dokter_Pengkaji: string
  Nama_Perawat_Cppt: string
  Nama_Petugas: string
  Pediatrik: IPediatric
  Resep: Array<IPrescription>
  Submit_Mata: number
  Submit_Pediatrik: number
  Submit_Retina: number
  TTD_Dokter_Pengkaji: string;
  TTD_Perawat_Cppt: string;
  Unit: string;
  Updated_At: string;
  Updated_By: string;
  Waktu: string;

  constructor(req: ICPPTRawatJalan) {
    this.ID = req.ID;
    this.Data_A = req.Data_A;
    this.Data_A_Lain_Text = req.Data_A_Lain_Text;
    this.Data_O = req.Data_O;
    this.Data_P = req.Data_P;
    this.Data_P_Lain_Text = req.Data_P_Lain_Text;
    this.Data_S = req.Data_S;
    this.Data_S_Lain_Text = req.Data_S_Lain_Text;
    this.Gambar_Mata_OD = req.Gambar_Mata_OD;
    this.Gambar_Mata_OS = req.Gambar_Mata_OS;
    this.Gambar_Retina_OD = req.Gambar_Retina_OD;
    this.Gambar_Retina_OS = req.Gambar_Retina_OS;
    this.ID_Pelayanan = req.ID_Pelayanan;
    this.ID_Petugas = req.ID_Petugas;
    this.Id_Dokter_Pengkaji = req.Id_Dokter_Pengkaji;
    this.Id_Perawat_Cppt = req.Id_Perawat_Cppt;
    this.Instruksi_PPA = req.Instruksi_PPA;
    this.Is_Dokter = req.Is_Dokter;
    this.Is_Form_Dokter = req.Is_Form_Dokter;
    this.Nama_Dokter_Pengkaji = req.Nama_Dokter_Pengkaji;
    this.Nama_Perawat_Cppt = req.Nama_Perawat_Cppt;
    this.Nama_Petugas = req.Nama_Petugas;
    this.Pediatrik = req.Pediatrik;
    this.Resep = (req.Resep && Array.isArray(req.Resep)) ? req.Resep : [];
    this.Submit_Mata = req.Submit_Mata;
    this.Submit_Pediatrik = req.Submit_Pediatrik;
    this.Submit_Retina = req.Submit_Retina;
    this.TTD_Dokter_Pengkaji = req.TTD_Dokter_Pengkaji;
    this.TTD_Perawat_Cppt = req.TTD_Perawat_Cppt;
    this.Unit = req.Unit;
    this.Updated_At = req.Updated_At;
    this.Updated_By = req.Updated_By;
    this.Waktu = req.Waktu;
  }

  static createFromJson(json: any) {
    return {
      ID_Pelayanan: json['id-pelayanan'] ? json['id-pelayanan'] : '',
      Data_A: json['data-a'] ? json['data-a'] : '',
      Data_A_Lain_Text: json['data-a-lain-text'] ? json['data-a-lain-text'] : '',
      Data_S: json['data-s'] ? json['data-s'] : '',
      Data_S_Lain_Text: json['data-s-lain-text'] ? json['data-s-lain-text'] : '',
      Data_O: json['data-o'] ? json['data-o'] : '',
      Data_O_Tambahan: json['data-o-tambahan'] ? json['data-o-tambahan'] : '',
      Data_P: json['data-p'] ? json['data-p'] : '',
      Data_P_Lain_Text: json['data-p-lain-text'] ? json['data-p-lain-text'] : '',
      Instruksi_PPA: json['instruksi-ppa'] ? json['instruksi-ppa'] : '',
      Kesimpulan_Pemeriksaan: json.kesimpulan_pemeriksaan ?? '',
      Submit_Mata: (json['submit-mata'] && json['submit-mata'] === '1') ? 1 : 0,
      Gambar_Mata_OD: (json['gambar-mata-od'] && json['gambar-mata-od'] !== '' && isValidFile(json['gambar-mata-od'])) ? global.storage.cleanUrl(json['gambar-mata-od']) : '',
      Gambar_Mata_OS: (json['gambar-mata-os'] && json['gambar-mata-os'] !== '' && isValidFile(json['gambar-mata-os'])) ? global.storage.cleanUrl(json['gambar-mata-os']) : '',
      Submit_Retina: (json['submit-retina'] && json['submit-retina'] === '1') ? 1 : 0,
      Gambar_Retina_OD: (json['gambar-retina-od'] && json['gambar-retina-od'] !== '' && isValidFile(json['gambar-retina-od'])) ? global.storage.cleanUrl(json['gambar-retina-od']) : '',
      Gambar_Retina_OS: (json['gambar-retina-os'] && json['gambar-retina-os'] !== '' && isValidFile(json['gambar-retina-os'])) ? global.storage.cleanUrl(json['gambar-retina-os']) : '',
      Submit_Pediatrik: (json['submit-pediatrik'] && json['submit-pediatrik'] === '1') ? 1 : 0,
      Pediatrik: json.pediatrik ? json.pediatrik : {},
      Unit: 'RawatJalan',
      Waktu: json['waktu'] ? json['waktu'] : '',
      Anjuran: json['anjuran'] ? json['anjuran'] : '',
      Is_Form_Dokter: (json['is-form-dokter']) ? 1 : 0,
      Id_Perawat_Cppt: json['id-perawat-cppt'] ? json['id-perawat-cppt'] : '',
      TTD_Perawat_Cppt: (json['ttd-perawat-cppt'] && json['ttd-perawat-cppt'] !== '' && isValidFile(json['ttd-perawat-cppt'])) ? global.storage.cleanUrl(json['ttd-perawat-cppt']) : '',
      Id_Dokter_Pengkaji: json['id-dokter-pengkaji'] ? json['id-dokter-pengkaji'] : '',
      TTD_Dokter_Pengkaji: (json['ttd-dokter-pengkaji'] && json['ttd-dokter-pengkaji'] !== '' && isValidFile(json['ttd-dokter-pengkaji'])) ? global.storage.cleanUrl(json['ttd-dokter-pengkaji']) : '',
      TD: json.td ?? '',
      KGD: json.kgd ?? '',
      Konsultasi: json.konsultasi ?? '',
    }
  }
}

export interface ICPPTOK {
  ID?: string;
	Data_A: string
	Data_A_Lain_Text: string
	Data_O: string
	Data_P: string
	Data_S: string
	Data_S_Lain_Text: string
	Gambar_Mata_OD: string
	Gambar_Mata_OS: string
	Gambar_Retina_OD: string
	Gambar_Retina_OS: string
	ID_Pelayanan: string
	ID_Petugas: string
	Id_Dokter_Pengkaji: string
	Id_Perawat_Cppt: string
	Instruksi_PPA: string
	Is_Dokter: boolean
	Is_Form_Dokter: number
	Nama_Dokter_Pengkaji: string
	Nama_Perawat_Cppt: string
	Nama_Petugas: string
  Picture: string;
	Resep: Array<IPrescription>
	Submit_Mata: number
	Submit_Retina: number
	TTD_Dokter_Pengkaji: string;
	TTD_Perawat_Cppt: string;
	Unit: string;
	Updated_At: string;
	Updated_By: string;
	Waktu: string;
}

export class CPPTOK {
  ID?: string;
  Data_A: string
  Data_A_Lain_Text: string
  Data_O: string
  Data_P: string
  Data_S: string
  Data_S_Lain_Text: string
  Gambar_Mata_OD: string
  Gambar_Mata_OS: string
  Gambar_Retina_OD: string
  Gambar_Retina_OS: string
  ID_Pelayanan: string
  ID_Petugas: string
  Id_Dokter_Pengkaji: string
  Id_Perawat_Cppt: string
  Instruksi_PPA: string
  Is_Dokter: boolean
  Is_Form_Dokter: number
  Nama_Dokter_Pengkaji: string
  Nama_Perawat_Cppt: string
  Nama_Petugas: string
  Picture: string;
  Resep: Array<IPrescription>
  Submit_Mata: number
  Submit_Retina: number
  TTD_Dokter_Pengkaji: string;
  TTD_Perawat_Cppt: string;
  Unit: string;
  Updated_At: string;
  Updated_By: string;
  Waktu: string;

  constructor(req: ICPPTOK) {
    this.ID = req.ID;
    this.Data_A = req.Data_A;
    this.Data_A_Lain_Text = req.Data_A_Lain_Text;
    this.Data_O = req.Data_O;
    this.Data_P = req.Data_P;
    this.Data_S = req.Data_S;
    this.Data_S_Lain_Text = req.Data_S_Lain_Text;
    this.Gambar_Mata_OD = req.Gambar_Mata_OD;
    this.Gambar_Mata_OS = req.Gambar_Mata_OS;
    this.Gambar_Retina_OD = req.Gambar_Retina_OD;
    this.Gambar_Retina_OS = req.Gambar_Retina_OS;
    this.ID_Pelayanan = req.ID_Pelayanan;
    this.ID_Petugas = req.ID_Petugas;
    this.Id_Dokter_Pengkaji = req.Id_Dokter_Pengkaji;
    this.Id_Perawat_Cppt = req.Id_Perawat_Cppt;
    this.Instruksi_PPA = req.Instruksi_PPA;
    this.Is_Dokter = req.Is_Dokter;
    this.Is_Form_Dokter = req.Is_Form_Dokter;
    this.Nama_Dokter_Pengkaji = req.Nama_Dokter_Pengkaji;
    this.Nama_Perawat_Cppt = req.Nama_Perawat_Cppt;
    this.Nama_Petugas = req.Nama_Petugas;
    this.Picture = req.Picture;
    this.Resep = (req.Resep && Array.isArray(req.Resep)) ? req.Resep : [];
    this.Submit_Mata = req.Submit_Mata;
    this.Submit_Retina = req.Submit_Retina;
    this.TTD_Dokter_Pengkaji = req.TTD_Dokter_Pengkaji;
    this.TTD_Perawat_Cppt = req.TTD_Perawat_Cppt;
    this.Unit = req.Unit;
    this.Updated_At = req.Updated_At;
    this.Updated_By = req.Updated_By;
    this.Waktu = req.Waktu;
  }

  static createFromJson(json: any) {
    return {
      ID_Pelayanan: json['id-pelayanan'] ? json['id-pelayanan'] : '',
      Data_A: json['data-a'] ? json['data-a'] : '',
      Data_A_Lain_Text: json['data-a-lain-text'] ? json['data-a-lain-text'] : '',
      Data_S: json['data-s'] ? json['data-s'] : '',
      Data_S_Lain_Text: json['data-s-lain-text'] ? json['data-s-lain-text'] : '',
      Data_O: json['data-o'] ? json['data-o'] : '',
      Data_P: json['data-p'] ? json['data-p'] : '',
      Instruksi_PPA: json['instruksi-ppa'] ? json['instruksi-ppa'] : '',
      Submit_Mata: (json['submit-mata'] && json['submit-mata'] === '1') ? 1 : 0,
      Gambar_Mata_OD: (json['gambar-mata-od'] && json['gambar-mata-od'] !== '' && isValidFile(json['gambar-mata-od'])) ? global.storage.cleanUrl(json['gambar-mata-od']) : '',
      Gambar_Mata_OS: (json['gambar-mata-os'] && json['gambar-mata-os'] !== '' && isValidFile(json['gambar-mata-os'])) ? global.storage.cleanUrl(json['gambar-mata-os']) : '',
      Submit_Retina: (json['submit-retina'] && json['submit-retina'] === '1') ? 1 : 0,
      Gambar_Retina_OD: (json['gambar-retina-od'] && json['gambar-retina-od'] !== '' && isValidFile(json['gambar-retina-od'])) ? global.storage.cleanUrl(json['gambar-retina-od']) : '',
      Gambar_Retina_OS: (json['gambar-retina-os'] && json['gambar-retina-os'] !== '' && isValidFile(json['gambar-retina-os'])) ? global.storage.cleanUrl(json['gambar-retina-os']) : '',
      Unit: 'OK',
      Waktu: json['waktu'] ? json['waktu'] : '',
      Anjuran: json['anjuran'] ? json['anjuran'] : '',
      Is_Form_Dokter: (json['is-form-dokter']) ? 1 : 0,
      Id_Perawat_Cppt: json['id-perawat-cppt'] ? json['id-perawat-cppt'] : '',
      TTD_Perawat_Cppt: (json['ttd-perawat-cppt'] && json['ttd-perawat-cppt'] !== '' && isValidFile(json['ttd-perawat-cppt'])) ? global.storage.cleanUrl(json['ttd-perawat-cppt']) : '',
      Id_Dokter_Pengkaji: json['id-dokter-pengkaji'] ? json['id-dokter-pengkaji'] : '',
      TTD_Dokter_Pengkaji: (json['ttd-dokter-pengkaji'] && json['ttd-dokter-pengkaji'] !== '' && isValidFile(json['ttd-dokter-pengkaji'])) ? global.storage.cleanUrl(json['ttd-dokter-pengkaji']) : '',
    }
  }
}

export interface ICPPTGizi {
  ID?: string;
	Data_A: string;
  Data_D: string;
  Data_I: string;
  Data_M: string;
  Data_E: string;
	ID_Pelayanan: string
	ID_Petugas: string
	Id_Dokter_Pengkaji: string
	Id_Perawat_Cppt: string
	Instruksi_PPA: string
	Is_Dokter: boolean
	Nama_Dokter_Pengkaji: string
	Nama_Perawat_Cppt: string
	Nama_Petugas: string
	TTD_Dokter_Pengkaji: string;
	TTD_Perawat_Cppt: string;
	Unit: string;
	Updated_At: string;
	Updated_By: string;
	Waktu: string;
}

export class CPPTGizi {
  ID?: string;
  Data_A: string;
  Data_D: string;
  Data_I: string;
  Data_M: string;
  Data_E: string;
  ID_Pelayanan: string
  ID_Petugas: string
  Id_Dokter_Pengkaji: string
  Id_Perawat_Cppt: string
  Instruksi_PPA: string
  Is_Dokter: boolean
  Nama_Dokter_Pengkaji: string
  Nama_Perawat_Cppt: string
  Nama_Petugas: string
  TTD_Dokter_Pengkaji: string;
  TTD_Perawat_Cppt: string;
  Unit: string;
  Updated_At: string;
  Updated_By: string;
  Waktu: string;

  constructor(req: ICPPTGizi) {
    this.ID = req.ID;
    this.Data_A = req.Data_A;
    this.Data_D = req.Data_D
    this.Data_I = req.Data_I;
    this.Data_M = req.Data_M;
    this.Data_E = req.Data_E;
    this.ID_Pelayanan = req.ID_Pelayanan;
    this.ID_Petugas = req.ID_Petugas;
    this.Id_Dokter_Pengkaji = req.Id_Dokter_Pengkaji;
    this.Id_Perawat_Cppt = req.Id_Perawat_Cppt;
    this.Instruksi_PPA = req.Instruksi_PPA;
    this.Is_Dokter = req.Is_Dokter;
    this.Nama_Dokter_Pengkaji = req.Nama_Dokter_Pengkaji;
    this.Nama_Perawat_Cppt = req.Nama_Perawat_Cppt;
    this.Nama_Petugas = req.Nama_Petugas;
    this.TTD_Dokter_Pengkaji = req.TTD_Dokter_Pengkaji;
    this.TTD_Perawat_Cppt = req.TTD_Perawat_Cppt;
    this.Unit = req.Unit;
    this.Updated_At = req.Updated_At;
    this.Updated_By = req.Updated_By;
    this.Waktu = req.Waktu;
  }

  static createFromJson(json: any) {
    return {
      ID_Pelayanan: json['id-pelayanan'] ? json['id-pelayanan'] : '',
      Data_A: json['data-a'] ? json['data-a'] : '',
      Data_D: json['data-d'] ? json['data-d'] : '',
      Data_I: json['data-i'] ? json['data-i'] : '',
      Data_M: json['data-m'] ? json['data-m'] : '',
      Data_E: json['data-e'] ? json['data-e'] : '',
      Instruksi_PPA: json['instruksi-ppa'] ? json['instruksi-ppa'] : '',
      Unit: 'Gizi',
      Waktu: json['waktu'] ? json['waktu'] : '',
      Id_Perawat_Cppt: json['id-perawat-cppt'] ? json['id-perawat-cppt'] : '',
      TTD_Perawat_Cppt: (json['ttd-perawat-cppt'] && json['ttd-perawat-cppt'] !== '' && isValidFile(json['ttd-perawat-cppt'])) ? global.storage.cleanUrl(json['ttd-perawat-cppt']) : '',
      Id_Dokter_Pengkaji: json['id-dokter-pengkaji'] ? json['id-dokter-pengkaji'] : '',
      TTD_Dokter_Pengkaji: (json['ttd-dokter-pengkaji'] && json['ttd-dokter-pengkaji'] !== '' && isValidFile(json['ttd-dokter-pengkaji'])) ? global.storage.cleanUrl(json['ttd-dokter-pengkaji']) : '',
    }
  }
}
