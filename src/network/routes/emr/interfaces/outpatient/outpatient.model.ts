import moment from "moment";
import { isValidFile } from "../../helpers/app.helper";
import { BaseModel, IBaseModel } from "../app/app.model";
import { IFormLaporanPembedahan } from "../ok/ok.model";
import { IPreliminaryStudyForm, IResepKacamata } from "../optic/optic.model";
import { IRefraksiOptisiPengkajianAwal } from "../ro.model";
import { IImage, IUpdateBPRJ, IUpdateChecklistPraOperasi, IUpdateKonsultasi, IUpdatePemberianInformasi, IUpdatePenandaanAreaPembedahan, IUpdatePengkajianAwal, IUpdatePengkajianAwalKeperawatan, IUpdatePersetujuanTindakanDokter, IUpdateRajalCatatanKeperawatanPra, IUpdateRisikoJatuh, IUpdateSerahTerimaPasien } from "./outpatient.request";

export interface IMedicine {
  Kode_Inventory: string;
  Nama_Inventory: string;
  ID_Satuan: string;
  Nama_Satuan: string;
  Stok: string;
  Harga_Beli: number;
  Harga_Jual: number;
  Nama_Kategori: string;
  Fornas: string;
  Forkit: string;
  Status: number;
}

export interface IHowToUse {
  ID_AturanPakai: number;
  Kode_Cabang: string;
  Tipe_Pelayanan: string;
  Nama: string;
  Keterangan?: string;
  Upd_User: string;
  Upd_Waktu: string;
  Status_Aktif: boolean;
  Kode: string;
  RowNum: string;
  TotalItems: number;
  TotalPage: number;
}

export interface IPrescription {
  key?: string;
  Jumlah?: string;
  Catatan?: string;
  ID_Obat: string;
  ID_Satuan?: string;
  Nama_Obat?: string;
  Nama_Satuan: string;
  ID_AturanPakai?: number;
  Kode_AturanPakai: string;
  Nama_AturanPakai?: string;
}

export interface IPediatric {
  Hes_OD_Hes: string;
  Hes_OS_Hes: string;
  Okn_OD_Okn: string;
  Okn_OS_Okn: string;
  Raf_OD_Raf: string;
  Raf_OS_Raf: string;
  Tac_OD_At_38: string;
  Tac_OD_At_55: string;
  Tac_OD_At_84: string;
  Tac_OS_At_38: string;
  Tac_OS_At_55: string;
  Tac_OS_At_84: string;
  Cover_OD_Cover_1: string;
  Cover_OD_Cover_2: string;
  Cover_OD_Cover_3: string;
  Cover_OD_Cover_4: string;
  Cover_OD_Cover_5: string;
  Cover_OD_Cover_6: string;
  Cover_OS_Cover_1: string;
  Cover_OS_Cover_2: string;
  Cover_OS_Cover_3: string;
  Cover_OS_Cover_4: string;
  Cover_OS_Cover_5: string;
  Cover_OS_Cover_6: string;
  Prisma_OD_Prisma: string;
  Prisma_OS_Prisma: string;
  Randot_OD_Animal: string;
  Randot_OS_Animal: string;
  Rpl_Streak_OD_Va: string;
  Rpl_Streak_OS_Va: string;
  Submit_Pediatrik: string;
  Randot_OD_Circles: string;
  Randot_OS_Circles: string;
  Rpl_Streak_OD_False: string;
  Rpl_Streak_OS_False: string;
  Randot_OD_Randot_Form: string;
  Randot_OS_Randot_Form: string;
  Rpl_Streak_OD_Pd_Jauh: string;
  Rpl_Streak_OS_Pd_Jauh: string;
  Rpl_Streak_OD_Adaptasi: string;
  Rpl_Streak_OS_Adaptasi: string;
  Goniometer_OD_Goniometer: string;
  Goniometer_OS_Goniometer: string;
  Nearvision_OD_Select: string;
  Nearvision_OS_Select: string;
  Nearvision_OD_Nearvision: string;
  Nearvision_OS_Nearvision: string;
  Rpl_Streak_OD_Streak_Cyl: string;
  Rpl_Streak_OD_Streak_Sph: string;
  Rpl_Streak_OS_Streak_Cyl: string;
  Rpl_Streak_OS_Streak_Sph: string;
  Cardif_OD_Test_Distance_1: string;
  Cardif_OS_Test_Distance_1: string;
  Rpl_Streak_OD_Streak_Axis: string;
  Rpl_Streak_OS_Streak_Axis: string;
  Cardif_OD_Test_Distance_50: string;
  Cardif_OS_Test_Distance_50: string;
}

export interface IDoctorPreliminaryStudyFormModel {
  CPPT_ID: string;
  Resep: Array<IPrescription>;
  COA_OD: string;
  COA_OS: string;
  Terapi: string;
  Anjuran: string;
  Iris_OD: string;
  Iris_OS: string;
  Keluhan: string;
  Diagnosa: string;
  Canthal_Medial_OD: string;
  Canthal_Medial_OS: string;
  Canthal_Lateral_OD: string;
  Canthal_Lateral_OS: string;
  Sclera_OD: string;
  Sclera_OS: string;
  Data_Objektif_Lain: string;
  Image_1: IImage | {};
  Image_2: IImage | {};
  Lensa_OD: string;
  Lensa_OS: string;
  Pupil_OD: string;
  Pupil_OS: string;
  Cornea_OD: string;
  Cornea_OS: string;
  Pediatrik: any;
  Diagnosa_Keseragaman: string;
  Posisi_OD: string;
  Posisi_OS: string;
  ID_Petugas: string;
  Updated_At: string;
  Updated_By: string;
  Vitreous_OD: string;
  Vitreous_OS: string;
  Nama_Petugas: string;
  Conj_Bulbi_OD: string;
  Conj_Bulbi_OS: string;
  Funduscopy_OD: string;
  Funduscopy_OS: string;
  Pergerakan_OD: string;
  Pergerakan_OS: string;
  Submit_Retina: string;
  Gambar_Mata_OD: string;
  Gambar_Mata_OS: string;
  Gambar_Retina_OD: string;
  Gambar_Retina_OS: string;
  Submit_Pediatrik: string;
  ID_Dokter_Pengkaji: string;
  Tanggal_Pengkajian: string;
  TTD_Dokter_Pengkaji: string;
  Nama_Dokter_Pengkaji: string;
  Palpebra_Inferior_OD: string;
  Palpebra_Inferior_OS: string;
  Palpebra_Superior_OD: string;
  Palpebra_Superior_OS: string;
  Conj_Tarsal_Inferior_OD: string;
  Conj_Tarsal_Inferior_OS: string;
  Conj_Tarsal_Superior_OD: string;
  Conj_Tarsal_Superior_OS: string;
}

export class DoctorPreliminaryStudyFormModel {
  Resep: Array<IPrescription>;
  COA_OD: string;
  COA_OS: string;
  Terapi: string;
  Anjuran: string;
  Iris_OD: string;
  Iris_OS: string;
  Keluhan: string;
  Diagnosa: string;
  Canthal_Medial_OD: string;
  Canthal_Medial_OS: string;
  Canthal_Lateral_OD: string;
  Canthal_Lateral_OS: string;
  Sclera_OD: string;
  Sclera_OS: string;
  Data_Objektif_Lain: string;
  Image_1: IImage | {};
  Image_2: IImage | {};
  Lensa_OD: string;
  Lensa_OS: string;
  Pupil_OD: string;
  Pupil_OS: string;
  Cornea_OD: string;
  Cornea_OS: string;
  Pediatrik: IPediatric;
  Posisi_OD: string;
  Posisi_OS: string;
  ID_Petugas: string;
  Updated_At: string;
  Updated_By: string;
  Vitreous_OD: string;
  Vitreous_OS: string;
  Nama_Petugas: string;
  Conj_Bulbi_OD: string;
  Conj_Bulbi_OS: string;
  Funduscopy_OD: string;
  Funduscopy_OS: string;
  Pergerakan_OD: string;
  Pergerakan_OS: string;
  Submit_Retina: string;
  Gambar_Mata_OD: string;
  Gambar_Mata_OS: string;
  Gambar_Retina_OD: string;
  Gambar_Retina_OS: string;
  Submit_Pediatrik: string;
  ID_Dokter_Pengkaji: string;
  Tanggal_Pengkajian: string;
  TTD_Dokter_Pengkaji: string;
  Nama_Dokter_Pengkaji: string;
  Palpebra_Inferior_OD: string;
  Palpebra_Inferior_OS: string;
  Palpebra_Superior_OD: string;
  Palpebra_Superior_OS: string;
  Conj_Tarsal_Inferior_OD: string;
  Conj_Tarsal_Inferior_OS: string;
  Conj_Tarsal_Superior_OD: string;
  Conj_Tarsal_Superior_OS: string;

  constructor(doctorPreliminaryForm: IDoctorPreliminaryStudyFormModel) {
    this.Resep = doctorPreliminaryForm.Resep;
    this.COA_OD = doctorPreliminaryForm.COA_OD;
    this.COA_OS = doctorPreliminaryForm.COA_OS;
    this.Canthal_Lateral_OD = doctorPreliminaryForm.Canthal_Lateral_OD;
    this.Canthal_Lateral_OS = doctorPreliminaryForm.Canthal_Lateral_OS;
    this.Canthal_Medial_OD = doctorPreliminaryForm.Canthal_Medial_OD;
    this.Canthal_Medial_OS = doctorPreliminaryForm.Canthal_Medial_OS;
    this.Sclera_OD = doctorPreliminaryForm.Sclera_OD;
    this.Sclera_OS = doctorPreliminaryForm.Sclera_OS;
    this.Data_Objektif_Lain = doctorPreliminaryForm.Data_Objektif_Lain;
    this.Image_1 = doctorPreliminaryForm.Image_1;
    this.Image_2 = doctorPreliminaryForm.Image_2;
    this.Terapi = doctorPreliminaryForm.Terapi;
    this.Anjuran = doctorPreliminaryForm.Anjuran;
    this.Iris_OD = doctorPreliminaryForm.Iris_OD;
    this.Iris_OS = doctorPreliminaryForm.Iris_OS;
    this.Keluhan = doctorPreliminaryForm.Keluhan;
    this.Diagnosa = doctorPreliminaryForm.Diagnosa;
    this.Lensa_OD = doctorPreliminaryForm.Lensa_OD;
    this.Lensa_OS = doctorPreliminaryForm.Lensa_OS;
    this.Pupil_OD = doctorPreliminaryForm.Pupil_OD;
    this.Pupil_OS = doctorPreliminaryForm.Pupil_OS;
    this.Cornea_OD = doctorPreliminaryForm.Cornea_OD;
    this.Cornea_OS = doctorPreliminaryForm.Cornea_OS;
    this.Pediatrik = doctorPreliminaryForm.Pediatrik;
    this.Posisi_OD = doctorPreliminaryForm.Posisi_OD;
    this.Posisi_OS = doctorPreliminaryForm.Posisi_OS;
    this.ID_Petugas = doctorPreliminaryForm.ID_Petugas;
    this.Updated_At = doctorPreliminaryForm.Updated_At;
    this.Updated_By = doctorPreliminaryForm.Updated_By;
    this.Vitreous_OD = doctorPreliminaryForm.Vitreous_OD;
    this.Vitreous_OS = doctorPreliminaryForm.Vitreous_OS;
    this.Nama_Petugas = doctorPreliminaryForm.Nama_Petugas;
    this.Conj_Bulbi_OD = doctorPreliminaryForm.Conj_Bulbi_OD;
    this.Conj_Bulbi_OS = doctorPreliminaryForm.Conj_Bulbi_OS;
    this.Funduscopy_OD = doctorPreliminaryForm.Funduscopy_OD;
    this.Funduscopy_OS = doctorPreliminaryForm.Funduscopy_OS;
    this.Pergerakan_OD = doctorPreliminaryForm.Pergerakan_OD;
    this.Pergerakan_OS = doctorPreliminaryForm.Pergerakan_OS;
    this.Submit_Retina = doctorPreliminaryForm.Submit_Retina;
    this.Gambar_Mata_OD = doctorPreliminaryForm.Gambar_Mata_OD;
    this.Gambar_Mata_OS = doctorPreliminaryForm.Gambar_Mata_OS;
    this.Gambar_Retina_OD = doctorPreliminaryForm.Gambar_Retina_OD;
    this.Gambar_Retina_OS = doctorPreliminaryForm.Gambar_Retina_OS;
    this.Submit_Pediatrik = doctorPreliminaryForm.Submit_Pediatrik;
    this.ID_Dokter_Pengkaji = doctorPreliminaryForm.ID_Dokter_Pengkaji;
    this.Tanggal_Pengkajian = doctorPreliminaryForm.Tanggal_Pengkajian;
    this.TTD_Dokter_Pengkaji = doctorPreliminaryForm.TTD_Dokter_Pengkaji;
    this.Nama_Dokter_Pengkaji = doctorPreliminaryForm.Nama_Dokter_Pengkaji;
    this.Palpebra_Inferior_OD = doctorPreliminaryForm.Palpebra_Inferior_OD;
    this.Palpebra_Inferior_OS = doctorPreliminaryForm.Palpebra_Inferior_OS;
    this.Palpebra_Superior_OD = doctorPreliminaryForm.Palpebra_Superior_OD;
    this.Palpebra_Superior_OS = doctorPreliminaryForm.Palpebra_Superior_OS;
    this.Conj_Tarsal_Inferior_OD = doctorPreliminaryForm.Conj_Tarsal_Inferior_OD;
    this.Conj_Tarsal_Inferior_OS = doctorPreliminaryForm.Conj_Tarsal_Inferior_OS;
    this.Conj_Tarsal_Superior_OD = doctorPreliminaryForm.Conj_Tarsal_Superior_OD;
    this.Conj_Tarsal_Superior_OS = doctorPreliminaryForm.Conj_Tarsal_Superior_OS
  }

  static createFromJson(json: IUpdatePengkajianAwal) {
    const image1 = json['image-1'] ? json['image-1'] : undefined;
    const image2 = json['image-2'] ? json['image-2'] : undefined;
    if (image1) {
      image1.Url_Image = image1.Url_Image && image1.Url_Image !== '' && isValidFile(image1.Url_Image) ? global.storage.cleanUrl(image1.Url_Image) : '';
    }
    if (image2) {
      image2.Url_Image = image2.Url_Image && image2.Url_Image !== '' && isValidFile(image2.Url_Image) ? global.storage.cleanUrl(image2.Url_Image) : '';
    }
    return {
      Tanggal_Pengkajian: json.tanggal ? json.tanggal : '',
      Keluhan: json.keluhan ? json.keluhan : '',
      Diagnosa: json.diagnosa ? json.diagnosa : '',
      Catatan_Note: json['catatan-note'] ? json['catatan-note'] : '',
      Terapi: json.terapi ? json.terapi : '',
      Anjuran: json.anjuran ? json.anjuran : '',
      Gambar_Mata_OD: (json['gambar-mata-od'] && json['gambar-mata-od'] !== '' && isValidFile(json['gambar-mata-od'])) ? global.storage.cleanUrl(json['gambar-mata-od']) : '',
      Gambar_Mata_OS: (json['gambar-mata-os'] && json['gambar-mata-os'] !== '' && isValidFile(json['gambar-mata-os'])) ? global.storage.cleanUrl(json['gambar-mata-os']) : '',
      Gambar_Retina_OD: (json['gambar-retina-od'] && json['gambar-retina-od'] !== '' && isValidFile(json['gambar-retina-od'])) ? global.storage.cleanUrl(json['gambar-retina-od']) : '',
      Gambar_Retina_OS: (json['gambar-retina-os'] && json['gambar-retina-os'] !== '' && isValidFile(json['gambar-retina-os'])) ? global.storage.cleanUrl(json['gambar-retina-os']) : '',
      Submit_Retina: json['submit-retina'] ? json['submit-retina'] : '',
      Pediatrik: json.pediatrik ? json.pediatrik : {},
      Submit_Pediatrik: json["submit-pediatrik"] ? json["submit-pediatrik"] : '',
      TTD_Dokter_Pengkaji: (json['ttd-dokter-pengkaji'] && json['ttd-dokter-pengkaji'] !== '' && isValidFile(json['ttd-dokter-pengkaji'])) ? global.storage.cleanUrl(json['ttd-dokter-pengkaji']) : '',
      ID_Dokter_Pengkaji: json["id-dokter-pengkaji"] ? json["id-dokter-pengkaji"] : '',
      Posisi_OD: json["posisi-od"] ? json["posisi-od"] : '',
      Posisi_OS: json["posisi-os"] ? json["posisi-os"] : '',
      Pergerakan_OD: json['pergerakan-od'] ? json['pergerakan-od'] : '',
      Pergerakan_OS: json['pergerakan-os'] ? json['pergerakan-os'] : '',
      Canthal_Medial_OD: json["canthal-medial-od"] ?? '',
      Canthal_Medial_OS: json["canthal-medial-os"] ?? '',
      Canthal_Lateral_OD: json["canthal-lateral-od"] ?? '',
      Canthal_Lateral_OS: json["canthal-lateral-os"] ?? '',
      Sclera_OD: json["sclera-od"] ?? '',
      Sclera_OS: json["sclera-os"] ?? '',
      Data_Objektif_Lain: json["data-objektif-lain"] ?? '',
      Image_1: image1 ?? {},
      Image_2: image2 ?? {},
      Palpebra_Superior_OD: json["palpebra-superior-od"] ? json["palpebra-superior-od"] : '',
      Palpebra_Superior_OS: json["palpebra-superior-os"] ? json["palpebra-superior-os"] : '',
      Palpebra_Inferior_OD: json["palpebra-inferior-od"] ? json["palpebra-inferior-od"] : '',
      Palpebra_Inferior_OS: json["palpebra-inferior-os"] ? json["palpebra-inferior-os"] : '',
      Conj_Tarsal_Superior_OD: json["conj-tarsal-superior-od"] ? json["conj-tarsal-superior-od"] : '',
      Conj_Tarsal_Superior_OS: json["conj-tarsal-superior-os"] ? json["conj-tarsal-superior-os"] : '',
      Conj_Tarsal_Inferior_OD: json["conj-tarsal-inferior-od"] ? json["conj-tarsal-inferior-od"] : '',
      Conj_Tarsal_Inferior_OS: json["conj-tarsal-inferior-os"] ? json["conj-tarsal-inferior-os"] : '',
      Conj_Bulbi_OD: json["conj-bulbi-od"] ? json["conj-bulbi-od"] : '',
      Conj_Bulbi_OS: json["conj-bulbi-os"] ? json["conj-bulbi-os"] : '',
      Cornea_OD: json["cornea-od"] ? json["cornea-od"] : '',
      Cornea_OS: json["cornea-os"] ? json["cornea-os"] : '',
      COA_OD: json["coa-od"] ? json["coa-od"] : '',
      COA_OS: json["coa-os"] ? json["coa-os"] : '',
      Pupil_OD: json["pupil-od"] ? json["pupil-od"] : '',
      Pupil_OS: json["pupil-os"] ? json["pupil-os"] : '',
      Iris_OD: json["iris-od"] ? json["iris-od"] : '',
      Iris_OS: json["iris-os"] ? json["iris-os"] : '',
      Lensa_OD: json["lensa-od"] ? json["lensa-od"] : '',
      Lensa_OS: json["lensa-os"] ? json["lensa-os"] : '',
      Vitreous_OD: json["vitreous-od"] ? json["vitreous-od"] : '',
      Vitreous_OS: json["vitreous-os"] ? json["vitreous-os"] : '',
      Funduscopy_OD: json["funduscopy-od"] ? json["funduscopy-od"] : '',
      Funduscopy_OS: json["funduscopy-os"] ? json["funduscopy-os"] : '',
      CPPT_ID: json.cppt_id ? json.cppt_id : '',
      Diagnosa_Keseragaman: json["diagnosa-keseragaman"] ?? '',
      Kesimpulan_Pemeriksaan: json.kesimpulan_pemeriksaan ?? '',
    }
  }
}

export interface IPengkajianAwal extends IBaseModel {
  form: IDoctorPreliminaryStudyFormModel;
  formFarmasi: any;
  formRO: IPreliminaryStudyForm;
  isDefault: boolean;
  obat: Array<IMedicine>;
  aturan_pakai: Array<IHowToUse>;
  paket_obat: Array<IMedsPackage>
}

export class PengkajianAwal extends BaseModel {
  form: IDoctorPreliminaryStudyFormModel;
  formFarmasi: any;
  formRO: IPreliminaryStudyForm;
  isDefault: boolean;
  obat: Array<IMedicine>;
  aturan_pakai: Array<IHowToUse>;
  paket_obat: Array<IMedsPackage>

  constructor(req: IPengkajianAwal) {
    super(req);
    this.form = req.form;
    this.formFarmasi = req.formFarmasi;
    this.formRO = req.formRO;
    this.isDefault = req.isDefault;
    this.obat = (Array.isArray(req.obat)) ? req.obat : [];
    this.aturan_pakai = (Array.isArray(req.aturan_pakai)) ? req.aturan_pakai : [];
    this.paket_obat = (Array.isArray(req.paket_obat)) ? req.paket_obat : [];
  }

  static createFromJson(json: IPengkajianAwal) {
    return new PengkajianAwal(json);
  }
}

export interface IJenisPenyakit {
  Dm: number;
  Hati: number;
  Paru: number;
  Ginjal: number;
  Kanker: number;
  Stroke: number;
  Jantung: number;
  Lain_lain: number;
  Penurunan_Imunitas_Geriatri: number;
}

export interface IKetergantunganTerhadap {
  Rokok: number;
  Alkohol: number;
  Lain_lain: number;
  Obat_obatan: number;
}

export interface IPengkajianAwalKeperawatanForm {
  P: string;
  Bb: string;
  Tb: string;
  Td: string;
  Tanggal_Waktu: string;
  Nadi: string;
  Suhu: string;
  Nyeri: string;
  Bicara: string;
  Agama_Id: string;
  Kesadaran: string;
  Tabel_Tio: number;
  ID_Petugas: string;
  Keluhan_Utama: string;
  Komplikasi: string;
  Total_Skor: string;
  Updated_At: string;
  Updated_By: string;
  Bicara_Text: string;
  Skala_Nyeri: string;
  Tabel_Jatuh: number;
  Tabel_Nyeri: number;
  Asupan_Makan: string;
  Durasi_Nyeri: string;
  Lokasi_Nyeri: string;
  Nama_Petugas: string;
  Nyeri_Hilang: string;
  Skor_Nutrisi: string;
  Status_Nyeri: string;
  Cara_Berjalan: string;
  Status_Mental: string;
  Status_Sosial: string;
  Tabel_Infeksi: number;
  Tabel_Lainnya: number;
  Tabel_Wajah: string;
  Tabel_Kaki: string;
  Tabel_Aktifitas: string;
  Tabel_Menangis: string;
  Tabel_Kenyamanan: string;
  Waktu_Operasi: string;
  Bahasa_Isyarat: string;
  Jenis_Penyakit: IJenisPenyakit;
  Riwayat_Alergi: string;
  Skrining_Nyeri: string;
  Status_Ekonomi: string;
  Tabel_Gangguan: number;
  Diagnosa_Khusus: string;
  Frekwensi_Nyeri: string;
  Hambatan_Belajar: string;
  Hasil_Total_Skor: string;
  Nutrisi_Turun_Bb: string;
  Penanggung_Jawab: string;
  Perlu_Penerjemah: string;
  Status_Psikologi: string;
  Memegang_Penopang: string;
  Skor_Risiko_Jatuh: string;
  Status_Fungsional: string;
  Status_Mental_Text: string;
  Status_Ekonomi_Text: string;
  Tingkatan_Pendidikan: string;
  Hambatan_Belajar_Text: string;
  Jenis_Operasi_Dialami: string;
  Penanggung_Jawab_Nama: string;
  Perlu_Penerjemah_Text: string;
  Status_Psikologi_Text: string;
  Tabel_Masalah_Lainnya: string;
  Tabel_Rencana_Lainnya: string;
  Nyeri_Hilang_Lain_Text: string;
  Keterangan_Risiko_Jatuh: string;
  Ketergantungan_Terhadap: IKetergantunganTerhadap;
  Penanggung_Jawab_Alamat: string;
  Hubungan_Pasien_Keluarga: string;
  Mempunyai_Ketergantungan: string;
  Tabel_Kurang_Pengetahuan: number;
  Penanggung_Jawab_Hubungan: string;
  Riwayat_Alergi_Keterangan: string;
  Riwayat_Penyakit_Keluarga: string;
  Tingkatan_Pendidikan_Text: string;
  ID_Perawat_Pengkajian_Masuk: string;
  Status_Fungsional_Keterangan: string;
  TTD_Perawat_Pengkajian_Masuk: string;
  Beritahu_Dokter_Risiko_Cedera: string;
  Nama_Perawat_Pengkajian_Masuk: string;
  Jenis_Penyakit_Lain_Keterangan: string;
  Nama_Perawat_Pengkajian_Keluar: string;
  Beritahu_Dokter_Risiko_Cedera_Pukul: string;
  Beritahu_Dokter_Pemeriksaan_Fisik: string;
  Ketergantungan_Terhadap_Keterangan: string;
  Ketergantungan_Terhadap_Penjelasan: string;
  Status_Fungsional_Diberitahukan_Pukul: string;
  Beritahu_Dokter_Pemeriksaan_Fisik_Pukul: string;
  TTD_Perawat_Pengkajian_Keluar: string;
  ID_Perawat_Pengkajian_Keluar: string;
}

export class PengkajianAwalKeperawatanForm {
  P: string;
  Bb: string;
  Tb: string;
  Td: string;
  Nadi: string;
  Suhu: string;
  Nyeri: string;
  Bicara: string;
  Agama_Id: string;
  Kesadaran: string;
  Tabel_Tio: number;
  Keluhan_Utama: string;
  ID_Petugas: string;
  Komplikasi: string;
  Total_Skor: string;
  Updated_At: string;
  Updated_By: string;
  Bicara_Text: string;
  Skala_Nyeri: string;
  Tabel_Jatuh: number;
  Tabel_Nyeri: number;
  Tabel_Aktifitas: string;
  Tabel_Menangis: string;
  Tabel_Kenyamanan: string;
  Asupan_Makan: string;
  Durasi_Nyeri: string;
  Lokasi_Nyeri: string;
  Nama_Petugas: string;
  Nyeri_Hilang: string;
  Skor_Nutrisi: string;
  Status_Nyeri: string;
  Cara_Berjalan: string;
  Status_Mental: string;
  Status_Sosial: string;
  Tabel_Infeksi: number;
  Tabel_Lainnya: number;
  Waktu_Operasi: string;
  Bahasa_Isyarat: string;
  Jenis_Penyakit: IJenisPenyakit;
  Riwayat_Alergi: string;
  Skrining_Nyeri: string;
  Status_Ekonomi: string;
  Tabel_Gangguan: number;
  Tabel_Wajah: string;
  Tabel_Kaki: string;
  Diagnosa_Khusus: string;
  Frekwensi_Nyeri: string;
  Hambatan_Belajar: string;
  Hasil_Total_Skor: string;
  Nutrisi_Turun_Bb: string;
  Penanggung_Jawab: string;
  Perlu_Penerjemah: string;
  Status_Psikologi: string;
  Memegang_Penopang: string;
  Skor_Risiko_Jatuh: string;
  Status_Fungsional: string;
  Status_Mental_Text: string;
  Status_Ekonomi_Text: string;
  Tingkatan_Pendidikan: string;
  Hambatan_Belajar_Text: string;
  Jenis_Operasi_Dialami: string;
  Penanggung_Jawab_Nama: string;
  Perlu_Penerjemah_Text: string;
  Status_Psikologi_Text: string;
  Tabel_Masalah_Lainnya: string;
  Tabel_Rencana_Lainnya: string;
  Nyeri_Hilang_Lain_Text: string;
  Keterangan_Risiko_Jatuh: string;
  Ketergantungan_Terhadap: IKetergantunganTerhadap;
  Penanggung_Jawab_Alamat: string;
  Hubungan_Pasien_Keluarga: string;
  Mempunyai_Ketergantungan: string;
  Tabel_Kurang_Pengetahuan: number;
  Penanggung_Jawab_Hubungan: string;
  Riwayat_Alergi_Keterangan: string;
  Riwayat_Penyakit_Keluarga: string;
  Tingkatan_Pendidikan_Text: string;
  ID_Perawat_Pengkajian_Masuk: string;
  Status_Fungsional_Keterangan: string;
  TTD_Perawat_Pengkajian_Masuk: string;
  Beritahu_Dokter_Risiko_Cedera: string;
  Nama_Perawat_Pengkajian_Masuk: string;
  Jenis_Penyakit_Lain_Keterangan: string;
  Nama_Perawat_Pengkajian_Keluar: string;
  Beritahu_Dokter_Pemeriksaan_Fisik: string;
  Ketergantungan_Terhadap_Keterangan: string;
  Ketergantungan_Terhadap_Penjelasan: string;
  Status_Fungsional_Diberitahukan_Pukul: string;
  Beritahu_Dokter_Pemeriksaan_Fisik_Pukul: string;
  TTD_Perawat_Pengkajian_Keluar: string;
  ID_Perawat_Pengkajian_Keluar: string;

  constructor(form: IPengkajianAwalKeperawatanForm) {
    this.P = form.P;
    this.Bb = form.Bb;
    this.Tb = form.Tb;
    this.Td = form.Td;
    this.Nadi = form.Nadi;
    this.Suhu = form.Suhu;
    this.Nyeri = form.Nyeri;
    this.Bicara = form.Bicara;
    this.Agama_Id = form.Agama_Id;
    this.Kesadaran = form.Kesadaran;
    this.Tabel_Tio = form.Tabel_Tio;
    this.Keluhan_Utama = form.Keluhan_Utama;
    this.ID_Petugas = form.ID_Petugas;
    this.Komplikasi = form.Komplikasi;
    this.Total_Skor = form.Total_Skor;
    this.Updated_At = form.Updated_At;
    this.Updated_By = form.Updated_By;
    this.Bicara_Text = form.Bicara_Text;
    this.Skala_Nyeri = form.Skala_Nyeri;
    this.Tabel_Wajah = form.Tabel_Wajah;
    this.Tabel_Kaki = form.Tabel_Kaki;
    this.Tabel_Jatuh = form.Tabel_Jatuh;
    this.Tabel_Nyeri = form.Tabel_Nyeri;
    this.Tabel_Aktifitas = form.Tabel_Aktifitas;
    this.Tabel_Menangis = form.Tabel_Menangis;
    this.Tabel_Kenyamanan = form.Tabel_Kenyamanan;
    this.Asupan_Makan = form.Asupan_Makan;
    this.Durasi_Nyeri = form.Durasi_Nyeri;
    this.Lokasi_Nyeri = form.Lokasi_Nyeri;
    this.Nama_Petugas = form.Nama_Petugas;
    this.Nyeri_Hilang = form.Nyeri_Hilang;
    this.Skor_Nutrisi = form.Skor_Nutrisi;
    this.Status_Nyeri = form.Status_Nyeri;
    this.Cara_Berjalan = form.Cara_Berjalan;
    this.Status_Mental = form.Status_Mental;
    this.Status_Sosial = form.Status_Sosial;
    this.Tabel_Infeksi = form.Tabel_Infeksi;
    this.Tabel_Lainnya = form.Tabel_Lainnya;
    this.Waktu_Operasi = form.Waktu_Operasi;
    this.Bahasa_Isyarat = form.Bahasa_Isyarat;
    this.Jenis_Penyakit = form.Jenis_Penyakit;
    this.Riwayat_Alergi = form.Riwayat_Alergi;
    this.Skrining_Nyeri = form.Skrining_Nyeri;
    this.Status_Ekonomi = form.Status_Ekonomi;
    this.Tabel_Gangguan = form.Tabel_Gangguan;
    this.Diagnosa_Khusus = form.Diagnosa_Khusus;
    this.Frekwensi_Nyeri = form.Frekwensi_Nyeri;
    this.Hambatan_Belajar = form.Hambatan_Belajar;
    this.Hasil_Total_Skor = form.Hasil_Total_Skor;
    this.Nutrisi_Turun_Bb = form.Nutrisi_Turun_Bb;
    this.Penanggung_Jawab = form.Penanggung_Jawab;
    this.Perlu_Penerjemah = form.Perlu_Penerjemah;
    this.Status_Psikologi = form.Status_Psikologi;
    this.Memegang_Penopang = form.Memegang_Penopang;
    this.Skor_Risiko_Jatuh = form.Skor_Risiko_Jatuh;
    this.Status_Fungsional = form.Status_Fungsional;
    this.Status_Mental_Text = form.Status_Mental_Text;
    this.Status_Ekonomi_Text = form.Status_Ekonomi_Text;
    this.Tingkatan_Pendidikan = form.Tingkatan_Pendidikan;
    this.Hambatan_Belajar_Text = form.Hambatan_Belajar_Text;
    this.Jenis_Operasi_Dialami = form.Jenis_Operasi_Dialami;
    this.Penanggung_Jawab_Nama = form.Penanggung_Jawab_Nama;
    this.Perlu_Penerjemah_Text = form.Perlu_Penerjemah_Text;
    this.Status_Psikologi_Text = form.Status_Psikologi_Text;
    this.Tabel_Masalah_Lainnya = form.Tabel_Masalah_Lainnya;
    this.Tabel_Rencana_Lainnya = form.Tabel_Rencana_Lainnya;
    this.Nyeri_Hilang_Lain_Text = form.Nyeri_Hilang_Lain_Text;
    this.Keterangan_Risiko_Jatuh = form.Keterangan_Risiko_Jatuh;
    this.Ketergantungan_Terhadap = form.Ketergantungan_Terhadap;
    this.Penanggung_Jawab_Alamat = form.Penanggung_Jawab_Hubungan;
    this.Hubungan_Pasien_Keluarga = form.Hubungan_Pasien_Keluarga;
    this.Mempunyai_Ketergantungan = form.Mempunyai_Ketergantungan;
    this.Tabel_Kurang_Pengetahuan = form.Tabel_Kurang_Pengetahuan;
    this.Penanggung_Jawab_Hubungan = form.Penanggung_Jawab_Hubungan;
    this.Riwayat_Alergi_Keterangan = form.Riwayat_Alergi_Keterangan;
    this.Riwayat_Penyakit_Keluarga = form.Riwayat_Penyakit_Keluarga;
    this.Tingkatan_Pendidikan_Text = form.Tingkatan_Pendidikan_Text;
    this.ID_Perawat_Pengkajian_Masuk = form.ID_Perawat_Pengkajian_Masuk;
    this.Status_Fungsional_Keterangan = form.Status_Fungsional_Keterangan;
    this.TTD_Perawat_Pengkajian_Masuk = form.TTD_Perawat_Pengkajian_Masuk;
    this.Beritahu_Dokter_Risiko_Cedera = form.Beritahu_Dokter_Risiko_Cedera;
    this.Nama_Perawat_Pengkajian_Masuk = form.Nama_Perawat_Pengkajian_Masuk;
    this.Jenis_Penyakit_Lain_Keterangan = form.Jenis_Penyakit_Lain_Keterangan;
    this.Nama_Perawat_Pengkajian_Keluar = form.Nama_Perawat_Pengkajian_Keluar;
    this.Beritahu_Dokter_Pemeriksaan_Fisik = form.Beritahu_Dokter_Pemeriksaan_Fisik;
    this.Ketergantungan_Terhadap_Keterangan = form.Ketergantungan_Terhadap_Keterangan;
    this.Ketergantungan_Terhadap_Penjelasan = form.Ketergantungan_Terhadap_Penjelasan;
    this.Status_Fungsional_Diberitahukan_Pukul = form.Status_Fungsional_Diberitahukan_Pukul;
    this.Beritahu_Dokter_Pemeriksaan_Fisik_Pukul = form.Beritahu_Dokter_Pemeriksaan_Fisik_Pukul;
    this.TTD_Perawat_Pengkajian_Keluar = form.TTD_Perawat_Pengkajian_Keluar;
    this.ID_Perawat_Pengkajian_Keluar = form.ID_Perawat_Pengkajian_Keluar;
  }

  static createFromJson(json: IUpdatePengkajianAwalKeperawatan) {
    let addiction = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    };

    if (json.mempunyai_ketergantungan && json.mempunyai_ketergantungan === '1') {
      addiction = {
        1: json.ketergantungan_terhadap && Array.isArray(json.ketergantungan_terhadap) && json.ketergantungan_terhadap.includes('1') ? 1 : 0,
        2: json.ketergantungan_terhadap && Array.isArray(json.ketergantungan_terhadap) && json.ketergantungan_terhadap.includes('2') ? 1 : 0,
        3: json.ketergantungan_terhadap && Array.isArray(json.ketergantungan_terhadap) && json.ketergantungan_terhadap.includes('3') ? 1 : 0,
        4: json.ketergantungan_terhadap && Array.isArray(json.ketergantungan_terhadap) && json.ketergantungan_terhadap.includes('4') ? 1 : 0,
      }
    }

    let typeOfDiseases = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
    };

    if (json.diagnosa_khusus && json.diagnosa_khusus === '1') {
      typeOfDiseases = {
        1: json.jenis_penyakit && Array.isArray(json.jenis_penyakit) && json.jenis_penyakit.includes('1') ? 1 : 0,
        2: json.jenis_penyakit && Array.isArray(json.jenis_penyakit) && json.jenis_penyakit.includes('2') ? 1 : 0,
        3: json.jenis_penyakit && Array.isArray(json.jenis_penyakit) && json.jenis_penyakit.includes('3') ? 1 : 0,
        4: json.jenis_penyakit && Array.isArray(json.jenis_penyakit) && json.jenis_penyakit.includes('4') ? 1 : 0,
        5: json.jenis_penyakit && Array.isArray(json.jenis_penyakit) && json.jenis_penyakit.includes('5') ? 1 : 0,
        6: json.jenis_penyakit && Array.isArray(json.jenis_penyakit) && json.jenis_penyakit.includes('6') ? 1 : 0,
        7: json.jenis_penyakit && Array.isArray(json.jenis_penyakit) && json.jenis_penyakit.includes('7') ? 1 : 0,
        8: json.jenis_penyakit && Array.isArray(json.jenis_penyakit) && json.jenis_penyakit.includes('8') ? 1 : 0,
        9: json.jenis_penyakit && Array.isArray(json.jenis_penyakit) && json.jenis_penyakit.includes('9') ? 1 : 0,
      }
    }
    return {
      Penanggung_Jawab: json['penanggung-jawab'] && json['penanggung-jawab'] === '1' ? 'Pasien' : 'Wali',
      Penanggung_Jawab_Nama: json['penanggung-jawab-nama'] ? json['penanggung-jawab-nama'] : '',
      Penanggung_Jawab_Alamat: json['penanggung-jawab-alamat'] ? json['penanggung-jawab-alamat'] : '',
      Penanggung_Jawab_Hubungan: json['penanggung-jawab-hubungan'] ? json['penanggung-jawab-hubungan'] : '',
      Tanggal_Waktu: json.tanggal_waktu ?? '',
      Td: json.td ? json.td : '',
      Bb: json.bb ? json.bb : '',
      P: json.p ? json.p : '',
      Nadi: json.nadi ? json.nadi : '',
      Tb: json.tb ? json.tb : '',
      Suhu: json.suhu ? json.suhu : '',
      Status_Nyeri: json.status_nyeri ? json.status_nyeri : '',
      Keluhan_Utama: json.keluhan_utama ?? '',
      Tabel_Wajah: json.tabel_wajah ? json.tabel_wajah : '',
      Tabel_Kaki: json.tabel_kaki ? json.tabel_kaki : '',
      Tabel_Aktifitas: json.tabel_aktivitas ? json.tabel_aktivitas : '',
      Tabel_Menangis: json.tabel_menangis ? json.tabel_menangis : '',
      Tabel_Kenyamanan: json.tabel_kenyamanan ? json.tabel_kenyamanan : '',
      Total_Skor: json.total_skor ? json.total_skor : '',
      Hasil_Total_Skor: json.hasil_total_skor ? json.hasil_total_skor : '',
      Kesadaran: json.kesadaran ? json.kesadaran : '',
      Nyeri: json.nyeri ? json.nyeri : '',
      Skala_Nyeri: json.nyeri && json.nyeri === '1' && json.skala_nyeri ? json.skala_nyeri : '',
      Skrining_Nyeri: json.nyeri && json.nyeri === '1' && json.skrining_nyeri ? json.skrining_nyeri : '',
      Lokasi_Nyeri: json.nyeri && json.nyeri === '1' && json.lokasi_nyeri ? json.lokasi_nyeri : '',
      Durasi_Nyeri: json.nyeri && json.nyeri === '1' && json.durasi_nyeri ? json.durasi_nyeri : '',
      Frekwensi_Nyeri: json.nyeri && json.nyeri === '1' && json.frekwensi_nyeri ? json.frekwensi_nyeri : '',
      Nyeri_Hilang: json.nyeri && json.nyeri === '1' && json.nyeri_hilang ? json.nyeri_hilang : '',
      Nyeri_Hilang_Lain_Text: json.nyeri && json.nyeri === '1' && json.nyeri_hilang_lain_text ? json.nyeri_hilang_lain_text : '',
      Beritahu_Dokter_Pemeriksaan_Fisik: json.nyeri && json.nyeri === '1' && json.beritahu_dokter_pemeriksaan_fisik ? json.beritahu_dokter_pemeriksaan_fisik : '',
      Beritahu_Dokter_Pemeriksaan_Fisik_Pukul: json.nyeri && json.nyeri === '1' && json.beritahu_dokter_pemeriksaan_fisik_pukul ? json.beritahu_dokter_pemeriksaan_fisik_pukul : '',
      Cara_Berjalan: json.cara_berjalan ? json.cara_berjalan : '',
      Memegang_Penopang: json.memegang_penopang ? json.memegang_penopang : '',
      Skor_Risiko_Jatuh: json["hasil-value"] ? json["hasil-value"] : '',
      Keterangan_Risiko_Jatuh: json["hasil-teks"] ? json["hasil-teks"] : '',
      Beritahu_Dokter_Risiko_Cedera: json.beritahu_dokter_risiko_cedera ? json.beritahu_dokter_risiko_cedera : '',
      Beritahu_Dokter_Risiko_Cedera_Pukul: json.beritahu_dokter_risiko_cedera_pukul ?? '',
      Jenis_Operasi_Dialami: json.jenis_operasi_dialami ? json.jenis_operasi_dialami : '',
      Waktu_Operasi: json.waktu_operasi ? json.waktu_operasi : '',
      Komplikasi: json.komplikasi ? json.komplikasi : '',
      Riwayat_Penyakit_Keluarga: json.riwayat_penyakit_keluarga ? json.riwayat_penyakit_keluarga : '',
      Mempunyai_Ketergantungan: json.mempunyai_ketergantungan ? json.mempunyai_ketergantungan : '',
      Ketergantungan_Terhadap: {
        Obat_obatan: addiction[1],
        Rokok: addiction[2],
        Alkohol: addiction[3],
        Lain_lain: addiction[4],
      },
      Ketergantungan_Terhadap_Keterangan: json.mempunyai_ketergantungan && json.mempunyai_ketergantungan === '1' && json.ketergantungan_terhadap_keterangan ? json.ketergantungan_terhadap_keterangan : '',
      Ketergantungan_Terhadap_Penjelasan: json.mempunyai_ketergantungan && json.mempunyai_ketergantungan === '1' && json.ketergantungan_terhadap_penjelasan ? json.ketergantungan_terhadap_penjelasan : '',
      Riwayat_Alergi: json.riwayat_alergi ? json.riwayat_alergi : '',
      Riwayat_Alergi_Keterangan: json.riwayat_alergi_keterangan ? json.riwayat_alergi_keterangan : '',
      Nutrisi_Turun_Bb: json.nutrisi_turun_bb ? json.nutrisi_turun_bb : '',
      Asupan_Makan: json.asupan_makan ? json.asupan_makan : '',
      Diagnosa_Khusus: json.diagnosa_khusus ? json.diagnosa_khusus : '',
      Jenis_Penyakit: {
        Dm: typeOfDiseases[1],
        Ginjal: typeOfDiseases[2],
        Hati: typeOfDiseases[3],
        Jantung: typeOfDiseases[4],
        Paru: typeOfDiseases[5],
        Stroke: typeOfDiseases[6],
        Kanker: typeOfDiseases[7],
        Penurunan_Imunitas_Geriatri: typeOfDiseases[8],
        Lain_lain: typeOfDiseases[9],
      },
      Jenis_Penyakit_Lain_Keterangan: json.diagnosa_khusus && json.diagnosa_khusus === '1' && json.jenis_penyakit_keterangan ? json.jenis_penyakit_keterangan : '',
      Skor_Nutrisi: json.skor_nutrisi ? json.skor_nutrisi : '',
      Status_Fungsional: json.status_fungsional ? json.status_fungsional : '',
      Status_Fungsional_Keterangan: json.status_fungsional_keterangan ? json.status_fungsional_keterangan : '',
      Status_Fungsional_Diberitahukan_Pukul: json.status_fungsional_diberitahukan_pukul ? json.status_fungsional_diberitahukan_pukul : '',
      Bicara: json.bicara ? json.bicara : '',
      Bicara_Text: json.bicara_text ? json.bicara_text : '',
      Perlu_Penerjemah: json.perlu_penerjemah ? json.perlu_penerjemah : '',
      Perlu_Penerjemah_Text: json.perlu_penerjemah_text ? json.perlu_penerjemah_text : '',
      Bahasa_Isyarat: json.bahasa_isyarat ? json.bahasa_isyarat : '',
      Hambatan_Belajar: json.hambatan_belajar ? json.hambatan_belajar : '',
      Hambatan_Belajar_Text: json.hambatan_belajar_text ? json.hambatan_belajar_text : '',
      Tingkatan_Pendidikan: json.tingkat_pendidikan ? json.tingkat_pendidikan : '',
      Tingkatan_Pendidikan_Text: json.tingkat_pendidikan_text ? json.tingkat_pendidikan_text : '',
      Status_Ekonomi: json.status_ekonomi ? json.status_ekonomi : '',
      Status_Ekonomi_Text: json.status_ekonomi_text ? json.status_ekonomi_text : '',
      Status_Sosial: json.status_sosial ? json.status_sosial : '',
      Status_Psikologi: json.status_psikologi ? json.status_psikologi : '',
      Status_Psikologi_Text: json.status_psikologi_text ? json.status_psikologi_text : '',
      Status_Mental: json.status_mental ? json.status_mental : '',
      Status_Mental_Text: json.status_mental_text ? json.status_mental_text : '',
      Hubungan_Pasien_Keluarga: json.hubungan_pasien_keluarga ? json.hubungan_pasien_keluarga : '',
      Agama_Id: json.agama ? json.agama : '',
      Tabel_Masalah_Lainnya: json.tabel_masalah_lainnya ? json.tabel_masalah_lainnya : '',
      Tabel_Rencana_Lainnya: json.tabel_rencana_lainnya ? json.tabel_rencana_lainnya : '',
      TTD_Perawat_Pengkajian_Masuk: (json["ttd-perawat-pengkajian-masuk"] && json["ttd-perawat-pengkajian-masuk"] !== '' && isValidFile(json["ttd-perawat-pengkajian-masuk"])) ? global.storage.cleanUrl(json["ttd-perawat-pengkajian-masuk"]) : '',
      ID_Perawat_Pengkajian_Masuk: json["id-perawat-pengkajian-masuk"] ? json["id-perawat-pengkajian-masuk"] : '',
      TTD_Perawat_Pengkajian_Keluar: (json["ttd-perawat-pengkajian-keluar"] && json["ttd-perawat-pengkajian-keluar"] !== '' && isValidFile(json["ttd-perawat-pengkajian-keluar"])) ? global.storage.cleanUrl(json["ttd-perawat-pengkajian-keluar"]) : '',
      ID_Perawat_Pengkajian_Keluar: json["id-perawat-pengkajian-keluar"] ? json["id-perawat-pengkajian-keluar"] : '',
      Tabel_Gangguan: json.tabel_gangguan && json.tabel_gangguan === '1' ? 1 : 0,
      Tabel_Nyeri: json.tabel_nyeri && json.tabel_nyeri === '1' ? 1 : 0,
      Tabel_Infeksi: json.tabel_infeksi && json.tabel_infeksi === '1' ? 1 : 0,
      Tabel_Jatuh: json.tabel_jatuh && json.tabel_jatuh === '1' ? 1 : 0,
      Tabel_Tio: json.tabel_tio && json.tabel_tio === '1' ? 1 : 0,
      Tabel_Kurang_Pengetahuan: json.tabel_kurang_pengetahuan && json.tabel_kurang_pengetahuan === '1' ? 1 : 0,
      Tabel_Lainnya: json.tabel_lainnya && json.tabel_lainnya === '1' ? 1 : 0,
    }
  }
}

export interface IPengkajianAwalKeperawatan extends IBaseModel {
  form: IPengkajianAwalKeperawatanForm;
}

export interface PengkajianAwalKeperawatan extends BaseModel {
  form: IPengkajianAwalKeperawatanForm;
}

export interface IDataUtilities {
  Kruk: number;
  Tripot: number;
  Kursi_Roda: number;
  Orang_Lain: number;
}

export interface IFallRiskForm {
  Waktu: string;
  Berjalan_Tidak_Seimbang: number | undefined;
  Berjalan_Alat_Bantu: number | undefined;
  Berjalan_Alat_Bantu_Data: IDataUtilities;
  Menopang: number | undefined;
  Hasil_Angka: number | undefined;
  Hasil_Teks: string;
  Keterangan_Hasil: string;
  Tindakan_Tidak_Ada_Berisiko: number | undefined;
  Tindakan_Rendah_Edukasi: number | undefined;
  Tindakan_Tinggi_Pasang_Stiker: number | undefined;
  Tindakan_Tinggi_Kuning: number | undefined;
  Tindakan_Tinggi_Edukasi: number | undefined;
  Tanda_Tangan: string;
  Tanggal_Pengkaji: string;
  Tanggal_Hasil: string;
  Tanggal_Tindakan: string;
  ID_Tanda_Tangan: string;
  Nama_Tanda_Tangan: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;
}

export class FallRiskForm {
  Waktu: string;
  Berjalan_Tidak_Seimbang: number | undefined;
  Berjalan_Alat_Bantu: number | undefined;
  Berjalan_Alat_Bantu_Data: IDataUtilities;
  Menopang: number | undefined;
  Hasil_Angka: number | undefined;
  Hasil_Teks: string;
  Keterangan_Hasil: string;
  Tindakan_Tidak_Ada_Beresiko: number | undefined;
  Tindakan_Rendah_Edukasi: number | undefined;
  Tindakan_Tinggi_Pasang_Stiker: number | undefined;
  Tindakan_Tinggi_Kuning: number | undefined;
  Tindakan_Tinggi_Edukasi: number | undefined;
  Tanda_Tangan: string;
  Tanggal_Pengkaji: string;
  Tanggal_Hasil: string;
  Tanggal_Tindakan: string;
  ID_Tanda_Tangan: string;
  Nama_Tanda_Tangan: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;

  constructor(req: IFallRiskForm) {
    this.Waktu = req.Waktu;
    this.Berjalan_Tidak_Seimbang = req.Berjalan_Tidak_Seimbang;
    this.Berjalan_Alat_Bantu = req.Berjalan_Alat_Bantu;
    this.Berjalan_Alat_Bantu_Data = req.Berjalan_Alat_Bantu_Data;
    this.Menopang = req.Menopang;
    this.Hasil_Angka = req.Hasil_Angka;
    this.Hasil_Teks = req.Hasil_Teks;
    this.Keterangan_Hasil = req.Keterangan_Hasil;
    this.Tindakan_Tidak_Ada_Beresiko = req.Tindakan_Tidak_Ada_Berisiko;
    this.Tindakan_Rendah_Edukasi = req.Tindakan_Rendah_Edukasi;
    this.Tindakan_Tinggi_Pasang_Stiker = req.Tindakan_Tinggi_Pasang_Stiker;
    this.Tindakan_Tinggi_Kuning = req.Tindakan_Tinggi_Kuning;
    this.Tindakan_Tinggi_Edukasi = req.Tindakan_Tinggi_Edukasi;
    this.Tanda_Tangan = req.Tanda_Tangan;
    this.Tanggal_Pengkaji = req.Tanggal_Pengkaji;
    this.Tanggal_Hasil = req.Tanggal_Hasil;
    this.Tanggal_Tindakan = req.Tanggal_Tindakan;
    this.ID_Tanda_Tangan = req.ID_Tanda_Tangan;
    this.Nama_Tanda_Tangan = req.Nama_Tanda_Tangan;
    this.ID_Petugas = req.ID_Petugas;
    this.Nama_Petugas = req.Nama_Petugas;
    this.Updated_At = req.Updated_At;
    this.Updated_By = req.Updated_By;
  }

  static createFromJson(json: IUpdateRisikoJatuh) {
    return {
      Berjalan_Tidak_Seimbang: json['tidakSeimbang-radio'] ? parseInt(json['tidakSeimbang-radio']) : undefined,
      Berjalan_Alat_Bantu: json['alatBantu-radio'] ? parseInt(json['alatBantu-radio']) : undefined,
      Menopang: json['menopang-radio'] ? parseInt(json['menopang-radio']) : undefined,
      Hasil_Angka: json['hasil-value'] ? parseInt(json['hasil-value']) : undefined,
      Hasil_Teks: json['hasil-teks'] ? json['hasil-teks'] : '',
      Keterangan_Hasil: json['hasil-keterangan'] ? json['hasil-keterangan'] : '',
      Tindakan_Tidak_Ada_Berisiko: json['tidakBerisiko-radio'] ? parseInt(json['tidakBerisiko-radio']) : undefined,
      Tanda_Tangan: (json['tanda-tangan'] && json['tanda-tangan'] !== '' && isValidFile(json['tanda-tangan'])) ? global.storage.cleanUrl(json['tanda-tangan']) : '',
      Tanggal_Pengkaji: json['tanggal-pengkaji'] ? json['tanggal-pengkaji'] : '',
      Tanggal_Hasil: json['tanggal-hasil'] ? json['tanggal-hasil'] : '',
      Tanggal_Tindakan: json['tanggal-tindakan'] ? json['tanggal-tindakan'] : '',
      ID_Tanda_Tangan: json['id-tanda-tangan'] ? json['id-tanda-tangan'] : '',
    }
  }
}

export interface IRisikoJatuh extends IBaseModel{
  form: IFallRiskForm;
}

export class RisikoJatuh extends BaseModel {
  form: IFallRiskForm;

  constructor(req: IRisikoJatuh) {
    super(req);
    this.form = req.form;
  }
}

export interface ISelect {
  Select: string | null;
}

export interface IODOSDetail {
  KMB: ISelect;
  KML: ISelect;
  RPL: ISelect;
  Koreksi_1: ISelect;
  Koreksi_2: ISelect;
  RPL_Streak: ISelect;
}

export interface IBPRJForm {
  OD: IODOSDetail;
  OS: IODOSDetail;
  TD: string;
  KGD: string;
  Waktu: string;
  ID_Dokter: string;
  TTD_Dokter: string;
  Updated_At: string;
  Updated_By: string;
  Nama_Dokter: string;
  Sip_Dokter: string
  Tanggal_TTD: string;
  Tanda_Tangan_Wali: string;
  Tanda_Tangan_Radio: string;
  Tanda_Tangan_Pasien: string;
}

export class BPRJForm {
  OD: IODOSDetail;
  OS: IODOSDetail;
  TD: string;
  KGD: string;
  Waktu: string;
  ID_Dokter: string;
  TTD_Dokter: string;
  Updated_At: string;
  Updated_By: string;
  Nama_Dokter: string;
  Sip_Dokter: string
  Tanggal_TTD: string;
  Tanda_Tangan_Wali: string;
  Tanda_Tangan_Radio: string;
  Tanda_Tangan_Pasien: string;

  constructor(req: IBPRJForm) {
    this.OD = req.OD;
    this.OS = req.OS;
    this.TD = req.TD;
    this.KGD = req.KGD;
    this.Waktu = req.Waktu;
    this.ID_Dokter = req.ID_Dokter;
    this.TTD_Dokter = req.TTD_Dokter;
    this.Updated_At = req.Updated_At;
    this.Updated_By = req.Updated_By;
    this.Nama_Dokter = req.Nama_Dokter;
    this.Sip_Dokter = req.Sip_Dokter;
    this.Tanggal_TTD = req.Tanggal_TTD;
    this.Tanda_Tangan_Wali = req.Tanda_Tangan_Wali;
    this.Tanda_Tangan_Radio = req.Tanda_Tangan_Radio;
    this.Tanda_Tangan_Pasien = req.Tanda_Tangan_Pasien;
  }

  static createFromJson(json: IUpdateBPRJ) {
    return {
      OD: {
        KML: {
          Select: json['od-kml-select'] && json['od-kml-select'] === 'on' ? json['od-kml-select'] : null,
        },
        Koreksi_1: {
          Select: json['od-koreksi-1-select'] && json['od-koreksi-1-select'] === 'on' ? json['od-koreksi-1-select'] : null,
        },
        Koreksi_2: {
          Select: json['od-koreksi-2-select'] && json['od-koreksi-2-select'] === 'on' ? json['od-koreksi-2-select'] : null,
        },
        KMB: {
          Select: json['od-kmb-select'] && json['od-kmb-select'] === 'on' ? json['od-kmb-select'] : null,
        },
        RPL: {
          Select: json['od-rpl-select'] && json['od-rpl-select'] === 'on' ? json['od-rpl-select'] : null,
        },
        RPL_Streak: {
          Select: json['od-rpl-streak-select'] && json['od-rpl-streak-select'] === 'on' ? json['od-rpl-streak-select'] : null,
        },
        RPL_2: {
          Select: json['od-rpl-2-select'] && json['od-rpl-2-select'] === 'on' ? json['od-rpl-2-select'] : null,
        },
        RPL_Streak_2: {
          Select: json['od-rpl-streak-2-select'] && json['od-rpl-streak-2-select'] === 'on' ? json['od-rpl-streak-2-select'] : null,
        },
      },
      OS: {
        KML: {
          Select: json['os-kml-select'] && json['os-kml-select'] === 'on' ? json['os-kml-select'] : null,
        },
        Koreksi_1: {
          Select: json['os-koreksi-1-select'] && json['os-koreksi-1-select'] === 'on' ? json['os-koreksi-1-select'] : null,
        },
        Koreksi_2: {
          Select: json['os-koreksi-2-select'] && json['os-koreksi-2-select'] === 'on' ? json['os-koreksi-2-select'] : null,
        },
        KMB: {
          Select: json['os-kmb-select'] && json['os-kmb-select'] === 'on' ? json['os-kmb-select'] : null,
        },
        RPL: {
          Select: json['os-rpl-select'] && json['os-rpl-select'] === 'on' ? json['os-rpl-select'] : null,
        },
        RPL_Streak: {
          Select: json['os-rpl-streak-select'] && json['os-rpl-streak-select'] === 'on' ? json['os-rpl-streak-select'] : null,
        },
        RPL_2: {
          Select: json['os-rpl-2-select'] && json['os-rpl-2-select'] === 'on' ? json['os-rpl-2-select'] : null,
        },
        RPL_Streak_2: {
          Select: json['os-rpl-streak-2-select'] && json['os-rpl-streak-2-select'] === 'on' ? json['os-rpl-streak-2-select'] : null,
        },
      },
      KGD: json.kgd ? json.kgd : '',
      TD: json.td ? json.td : '',
      TTD_Dokter: (json['ttd-dokter'] && json['ttd-dokter'] !== '' && isValidFile(json['ttd-dokter'])) ? global.storage.cleanUrl(json['ttd-dokter']) : '',
      Tanggal_TTD: json['tanggal-ttd'] ? json['tanggal-ttd'] : '',
      ID_Dokter: json['id-dokter'] ? json['id-dokter'] : '',
      Sip_Dokter: json['sip-dokter'] ? json['sip-dokter'] : '',
      Tanda_Tangan_Pasien: (json['tanda-tangan-pasien'] && json['tanda-tangan-pasien'] !== '' && isValidFile(json['tanda-tangan-pasien'])) ? global.storage.cleanUrl(json['tanda-tangan-pasien']) : '',
      Tanda_Tangan_Wali: (json['tanda-tangan-wali'] && json['tanda-tangan-wali'] !== '' && isValidFile(json['tanda-tangan-wali'])) ? global.storage.cleanUrl(json['tanda-tangan-wali']) : '',
      Tanda_Tangan_Radio: json['tanda-tangan-radio'] ? json['tanda-tangan-radio'] : '',
    }
  }
}

export interface IBPRJ extends IBaseModel {
  form: IBPRJForm;
  cppt_perawat: any;
  pengkajian_awal: IDoctorPreliminaryStudyFormModel;
  ro: IRefraksiOptisiPengkajianAwal
  resep_kacamata: IFormResepKacamata;
  laporan_pembedahan: IFormLaporanPembedahan;
  tebus_obat: ITebusObat;
}

export class BPRJ extends BaseModel {
  form: BPRJForm;
  cppt_perawat: any;
  pengkajian_awal: DoctorPreliminaryStudyFormModel;
  ro: IRefraksiOptisiPengkajianAwal;
  resep_kacamata: IFormResepKacamata;
  laporan_pembedahan: IFormLaporanPembedahan;
  tebus_obat: ITebusObat;

  constructor(req: IBPRJ) {
    super(req);
    this.form = req.form;
    this.cppt_perawat = req.cppt_perawat;
    this.pengkajian_awal = req.pengkajian_awal;
    this.ro = req.ro;
    this.resep_kacamata = req.resep_kacamata;
    this.laporan_pembedahan = req.laporan_pembedahan;
    this.tebus_obat = req.tebus_obat;
  }
}

export interface ITreatmentNumber {
  ID: string;
  ID_Dokter: string;
  ID_Berobat: string;
  Penanganan: string;
  Dokter_Nama: string;
  Waktu_Visit: string;
}

export interface IBiometricExam extends IBaseModel {
  form: { [key: string]: { [key: string]: string } }
  no_berobat: Array<ITreatmentNumber>
}

export class BiometricExam extends BaseModel {
  form: { [key: string]: { [key: string]: string } }
  no_berobat: Array<ITreatmentNumber>

  constructor(req: IBiometricExam) {
    super(req);
    this.form = req.form;
    this.no_berobat = req.no_berobat;
  }
}

export class PemberianInformasi {
  Risiko: string
  Tujuan: string
  Hal_Lain: string
  Diagnosis: string
  Prognosis: string
  Tata_Cara: string
  ID_Petugas: string
  Komplikasi: string
  TTD_Pasien: string
  Updated_At: string
  Updated_By: string
  Nama_Petugas: string
  Risiko_Check: string
  Tujuan_Check: string
  Hal_Lain_Check: string
  Dasar_Diagnosis: string
  Diagnosis_Check: string
  Prognosis_Check: string
  Tata_Cara_Check: string
  Diagnosis_Custom: string
  Dokter_Pelaksana: string
  Komplikasi_Check: string
  Alternatif_Risiko: string
  Indikasi_Tindakan: string
  Penerima_Informasi: string
  Hal_Lain_Konsultasi: number
  ID_Dokter_Pelaksana: string
  Tindakan_Kedokteran: string
  ID_Pemberi_Informasi: string
  TTD_Dokter_Pelaksana: string
  Dasar_Diagnosis_Check: string
  Nama_Dokter_Pelaksana: string
  Tata_Cara_Tipe_Sedasi: number
  Nama_Pemberi_Informasi: string
  Alternatif_Resiko_Check: string
  Indikasi_Tindakan_Check: string
  Tata_Cara_Uraian_Singkat: number
  Nama_Tanda_Tangan_Petugas: string
  Tindakan_Kedokteran_Check: string
  Hal_Lain_Perluasan_Tindakan: number
  Alternatif_Risiko_Pilihan_Pengobatan: number

  constructor(req: IPemberianInformasi) {
    this.Risiko = req.Risiko;
    this.Tujuan = req.Tujuan;
    this.Hal_Lain = req.Hal_Lain;
    this.Diagnosis = req.Diagnosis;
    this.Prognosis = req.Prognosis;
    this.Tata_Cara = req.Tata_Cara;
    this.ID_Petugas = req.ID_Petugas;
    this.Komplikasi = req.Komplikasi;
    this.TTD_Pasien = req.TTD_Pasien;
    this.Updated_At = req.Updated_At;
    this.Updated_By = req.Updated_By;
    this.Nama_Petugas = req.Nama_Petugas;
    this.Risiko_Check = req.Risiko_Check;
    this.Tujuan_Check = req.Tujuan_Check;
    this.Hal_Lain_Check = req.Hal_Lain_Check;
    this.Dasar_Diagnosis = req.Dasar_Diagnosis;
    this.Diagnosis_Check = req.Diagnosis_Check;
    this.Prognosis_Check = req.Prognosis_Check;
    this.Tata_Cara_Check = req.Tata_Cara_Check;
    this.Diagnosis_Custom = req.Diagnosis_Custom;
    this.Dokter_Pelaksana = req.Dokter_Pelaksana;
    this.Komplikasi_Check = req.Komplikasi_Check;
    this.Alternatif_Risiko = req.Alternatif_Risiko;
    this.Indikasi_Tindakan = req.Indikasi_Tindakan;
    this.Penerima_Informasi = req.Penerima_Informasi;
    this.Hal_Lain_Konsultasi = req.Hal_Lain_Konsultasi;
    this.ID_Dokter_Pelaksana = req.ID_Dokter_Pelaksana;
    this.Tindakan_Kedokteran = req.Tindakan_Kedokteran;
    this.ID_Pemberi_Informasi = req.ID_Pemberi_Informasi;
    this.TTD_Dokter_Pelaksana = req.TTD_Dokter_Pelaksana;
    this.Dasar_Diagnosis_Check = req.Dasar_Diagnosis_Check;
    this.Nama_Dokter_Pelaksana = req.Nama_Dokter_Pelaksana;
    this.Tata_Cara_Tipe_Sedasi = req.Tata_Cara_Tipe_Sedasi;
    this.Nama_Pemberi_Informasi = req.Nama_Pemberi_Informasi;
    this.Alternatif_Resiko_Check = req.Alternatif_Resiko_Check;
    this.Indikasi_Tindakan_Check = req.Indikasi_Tindakan_Check;
    this.Tata_Cara_Uraian_Singkat = req.Tata_Cara_Uraian_Singkat;
    this.Nama_Tanda_Tangan_Petugas = req.Nama_Tanda_Tangan_Petugas;
    this.Tindakan_Kedokteran_Check = req.Tindakan_Kedokteran_Check;
    this.Hal_Lain_Perluasan_Tindakan = req.Hal_Lain_Perluasan_Tindakan;
    this.Alternatif_Risiko_Pilihan_Pengobatan = req.Alternatif_Risiko_Pilihan_Pengobatan;
  }

  static createFromJson(json: IUpdatePemberianInformasi) {
    return {
      Nama_Template: json.nama_template ?? '',
      ID_Dokter_Pelaksana: json["dokter-pelaksana"] ?? '',
      Nama_Wali: json.nama_wali ?? '',
      ID_Pemberi_Informasi: json["pemberi-informasi"] ?? '',
      Penerima_Informasi: json["penerima-informasi"] && json["penerima-informasi"] === '1' ? 'Pasien' : json["penerima-informasi"] && json["penerima-informasi"] === '2' ? 'Wali' : '',
      Diagnosis: json.diagnosis ?? '',
      Diagnosis_Custom: json["diagnosis-custom"] ?? '',
      Dasar_Diagnosis: json["dasar-diagnosis"] ?? '',
      Tindakan_Kedokteran: json["tindakan-kedokteran"] ?? '',
      Indikasi_Tindakan: json["indikasi-tindakan"] ?? '',
      Tata_Cara: json["tata-cara"] ?? '',
      Tata_Cara_Uraian_Singkat: json["tata-cara-uraian-singkat"] && json["tata-cara-uraian-singkat"] === '1' ? 1 : 0,
      Tata_Cara_Tipe_Sedasi: json["tata-cara-tipe-sedasi"] && json["tata-cara-tipe-sedasi"] === '1' ? 1 : 0,
      Tujuan: json.tujuan ?? '',
      Risiko: json.risiko ?? '',
      Komplikasi: json.komplikasi ?? '',
      Prognosis: json.prognosis ?? '',
      Alternatif_Risiko_Pilihan_Pengobatan: json["alternatif-risiko-pilihan-pengobatan"] && json["alternatif-risiko-pilihan-pengobatan"] === '1' ? 1 : 0,
      Alternatif_Risiko: json["alternatif-risiko"] ?? '',
      Hal_Lain_Perluasan_Tindakan: json["hal-lain-perluasan-tindakan"] && json["hal-lain-perluasan-tindakan"] === '1' ? 1 : 0,
      Hal_Lain_Konsultasi: json["hal-lain-konsultasi"] && json["hal-lain-konsultasi"] === '1' ? 1 : 0,
      Hal_Lain: json["hal-lain"] ?? '',
      TTD_Pasien: json["ttd-pasien"] && json["ttd-pasien"] !== '' && isValidFile(json["ttd-pasien"]) ? global.storage.cleanUrl(json["ttd-pasien"]) : '',
      TTD_Dokter_Pelaksana: json["ttd-dokter-pelaksana"] && json["ttd-dokter-pelaksana"] !== '' && isValidFile(json["ttd-dokter-pelaksana"]) ? global.storage.cleanUrl(json["ttd-dokter-pelaksana"]) : '',
      Dokter_Pelaksana: json.dokter_pelaksana_informasi ?? '',
      Diagnosis_Check: json["diagnosis-check"] && json["diagnosis-check"] === '1' ? '1' : '',
      Dasar_Diagnosis_Check: json["dasar-diagnosis-check"] && json["dasar-diagnosis-check"] === '1' ? '1' : '',
      Tindakan_Kedokteran_Check: json["tindakan-kedokteran-check"] && json["tindakan-kedokteran-check"] === '1' ? '1' : '',
      Indikasi_Tindakan_Check: json["indikasi-tindakan-check"] && json["indikasi-tindakan-check"] === '1' ? '1' : '',
      Tata_Cara_Check: json["tata-cara-check"] && json["tata-cara-check"] === '1' ? '1' : '',
      Tujuan_Check: json["tujuan-check"] && json["tujuan-check"] === '1' ? '1' : '',
      Risiko_Check: json["risiko-check"] && json["risiko-check"] === '1' ? '1' : '',
      Komplikasi_Check: json["komplikasi-check"] && json["komplikasi-check"] === '1' ? '1' : '',
      Prognosis_Check: json["prognosis-check"] && json["prognosis-check"] === '1' ? '1' : '',
      Alternatif_Resiko_Check: json["alternatif-resiko-check"] && json["alternatif-resiko-check"] === '1' ? '1' : '',
      Hal_Lain_Check: json["hal-lain-check"] && json["hal-lain-check"] === '1' ? '1' : '',
      Nama_Tanda_Tangan_Petugas: '',
    }
  }
}

export interface IPersetujuanTindakanDokter {
  Kota: string
  Waktu: string
  ID_Saksi: string
  ID_Petugas: string
  Nama_Saksi: string
  Updated_At: string
  Updated_By: string
  Pasien_Kota: string
  Nama_Petugas: string
  Tanda_Tangan: string
  Pernyataan_Id: string
  Pasien_Tanggal: string
  Tanda_Tangan_JK: string
  Tanda_Tangan_Nama: string
  Tanda_Tangan_Telp: string
  Tanda_Tangan_Saksi: string
  Nama_Saksi_Keluarga: string
  Tanda_Tangan_Alamat: string
  Tanda_Tangan_Pasien: string
  Tanda_Tangan_Saksi_2: string
  Nama_Dokter_Pelaksana: string
  Tanda_Tangan_Hubungan: string
  Tanda_Tangan_TglLahir: string
}

export class PersetujuanTindakanDokter {
  Kota: string
  Waktu: string
  ID_Saksi: string
  ID_Petugas: string
  Nama_Saksi: string
  Updated_At: string
  Updated_By: string
  Pasien_Kota: string
  Nama_Petugas: string
  Tanda_Tangan: string
  Pernyataan_Id: string
  Pasien_Tanggal: string
  Tanda_Tangan_JK: string
  Tanda_Tangan_Nama: string
  Tanda_Tangan_Telp: string
  Tanda_Tangan_Saksi: string
  Nama_Saksi_Keluarga: string
  Tanda_Tangan_Alamat: string
  Tanda_Tangan_Pasien: string
  Tanda_Tangan_Saksi_2: string
  Nama_Dokter_Pelaksana: string
  Tanda_Tangan_Hubungan: string
  Tanda_Tangan_TglLahir: string

  constructor(req: IPersetujuanTindakanDokter) {
    this.Kota = req.Kota;
    this.Waktu = req.Waktu;
    this.ID_Saksi = req.ID_Saksi;
    this.ID_Petugas = req.ID_Petugas;
    this.Nama_Saksi = req.Nama_Saksi;
    this.Updated_At = req.Updated_At;
    this.Updated_By = req.Updated_By;
    this.Pasien_Kota = req.Pasien_Kota;
    this.Nama_Petugas = req.Nama_Petugas;
    this.Tanda_Tangan = req.Tanda_Tangan;
    this.Pernyataan_Id = req.Pernyataan_Id;
    this.Pasien_Tanggal = req.Pasien_Tanggal;
    this.Tanda_Tangan_JK = req.Tanda_Tangan_JK;
    this.Tanda_Tangan_Nama = req.Tanda_Tangan_Nama;
    this.Tanda_Tangan_Telp = req.Tanda_Tangan_Telp;
    this.Tanda_Tangan_Saksi = req.Tanda_Tangan_Saksi;
    this.Nama_Saksi_Keluarga = req.Nama_Saksi_Keluarga;
    this.Tanda_Tangan_Alamat = req.Tanda_Tangan_Alamat;
    this.Tanda_Tangan_Pasien = req.Tanda_Tangan_Pasien;
    this.Tanda_Tangan_Saksi_2 = req.Tanda_Tangan_Saksi_2;
    this.Nama_Dokter_Pelaksana = req.Nama_Dokter_Pelaksana;
    this.Tanda_Tangan_Hubungan = req.Tanda_Tangan_Hubungan;
    this.Tanda_Tangan_TglLahir = req.Tanda_Tangan_TglLahir;
  }

  static createFromJson(json: IUpdatePersetujuanTindakanDokter) {
    return {
      Tindakan_Operasi: json["pasien-tindakanOperasi"] ?? '',
      Dokter_Pelaksana: json.dokter_pelaksana ?? '',
      Kota: '',
      Pernyataan_Id: json.pernyataan ?? '',
      Tanda_Tangan_Nama: json["tandaTangan-nama"] ?? '',
      Tanda_Tangan_JK: json["tandaTangan-jk"] ?? '',
      Tanda_Tangan_Telp: json["tandaTangan-telp"] ?? '',
      Tanda_Tangan_Alamat: json["tandaTangan-alamat"] ?? '',
      Tanda_Tangan_Hubungan: json["tandaTangan-hubungan"] ?? '',
      Tanda_Tangan_TglLahir: json["tandaTangan-tglLahir"] ?? '',
      Tanda_Tangan: json["tandaTangan-radio"] && json["tandaTangan-radio"] === '1' ? 'Pasien' : 'Wali',
      Tanda_Tangan_Pasien: json["tanda-tangan-pasien"] && json["tanda-tangan-pasien"] !== '' && isValidFile(json["tanda-tangan-pasien"]) ? global.storage.cleanUrl(json["tanda-tangan-pasien"]) : '',
      Tanda_Tangan_Saksi: json["tanda-tangan-saksi"] && json["tanda-tangan-saksi"] !== '' && isValidFile(json["tanda-tangan-saksi"]) ? global.storage.cleanUrl(json["tanda-tangan-saksi"]) : '',
      Tanda_Tangan_Saksi_2: json["tanda-tangan-saksi-2"] && json["tanda-tangan-saksi-2"] !== '' && isValidFile(json["tanda-tangan-saksi-2"]) ? global.storage.cleanUrl(json["tanda-tangan-saksi-2"]) : '',
      ID_Saksi: json["id-saksi"] ?? '',
      Pasien_Kota: json["pasien-kota"] ?? '',
      Pasien_Tanggal: json["pasien-tanggal"] ?? '',
      Tanggal_TTD: json.tanggal_ttd ?? '',
    }
  }
}
export interface IDetails {
  Jumlah: number;
  Kode_Obat: string;
  Aturan_Pakai: string;
}

export class Details {
  Jumlah: number;
  Kode_Obat: string;
  Aturan_Pakai: string;

  constructor(req: IDetails) {
    this.Jumlah = req.Jumlah;
    this.Kode_Obat = req.Kode_Obat;
    this.Aturan_Pakai = req.Aturan_Pakai;
  }
}

export interface IMedsPackage {
  Kode_Cabang: string;
  Tipe_Pelayanan: string;
  ID_Paket: string;
  Nama_Paket: string;
  Status_Aktif: string;
  Keterangan: string;
  Detil: Array<IDetails>;
}

export class MedsPackage {
  Kode_Cabang: string;
  Tipe_Pelayanan: string;
  ID_Paket: string;
  Nama_Paket: string;
  Status_Aktif: string;
  Keterangan: string;
  Detil: Array<IDetails>;

  constructor(req: IMedsPackage) {
    this.Kode_Cabang = req.Kode_Cabang;
    this.Tipe_Pelayanan = req.Tipe_Pelayanan;
    this.ID_Paket = req.ID_Paket;
    this.Nama_Paket = req.Nama_Paket;
    this.Status_Aktif = req.Status_Aktif;
    this.Keterangan = req.Keterangan;
    this.Detil = req.Detil;
  }
}

export class RajalCatatanKeperawatanPra {
  static createFromJson(json: IUpdateRajalCatatanKeperawatanPra) {
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
      Penjelasan_Singkat: json.penjelasan_singkat && json.penjelasan_singkat === '1' ? 1 : json.penjelasan_singkat && json.penjelasan_singkat === '0' ? 0 : null,
      Penjelasan_Singkat_Keterangan: json.penjelasan_singkat_keterangan ?? '',
      Site_Marking: json.site_marking && json.site_marking === '1' ? 1 : json.site_marking && json.site_marking === '0' ? 0 : null,
      Site_Marking_Keterangan: json.site_marking_keterangan ?? '',
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
      Kgd: json.kgd ?? '',
      Nadi: json.nadi ?? '',
      Rr: json.rr ?? '',
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

export class ChecklistPraOperasiForm {
  static createFromJson(json: IUpdateChecklistPraOperasi) {
    return {
      Inform_Consent_Bedah: json.inform_consent_bedah ?? '',
      Inform_Consent: json.inform_consent ?? '',
      Hamil: json.hamil ?? '',
      Dokter_Anestesi_Id: json.dokter_id,
      Izin_Sterilisasi: json.izin_sterilisasi ?? '',
      Gelang_Pengenal: json.gelang_pengenal ?? '',
      Gelang_Alergi: json.gelang_alergi ?? '',
      Implant: json.implant ?? '',
      Ekg: json.ekg ?? '',
      Foto_Fundus: json.foto_fundus ?? '',
      Usg_Mata: json.usg_mata ?? '',
      Biometri: json.biometri ?? '',
      Makula: json.makula ?? '',
      Laboratorium: json.laboratorium ?? '',
      Radiologi: json.radiologi ?? '',
      Resiko_Jatuh: json.resiko_jatuh ?? '',
      Jenis_Pasien: json.jenis_pasien ?? '',
      Puasa: json.puasa ?? '',
      Puasa_Keterangan: json.puasa_keterangan ?? '',
      Anestesi: json.anestesi ?? '',
      Alergi: json.alergi ?? '',
      Alergi_Keterangan: json.alergi_keterangan ?? '',
      Pre_Medikasi: json.pre_medikasi ?? '',
      Gigi_Palsu: json.gigi_palsu ?? '',
      Lensa: json.lensa ?? '',
      Perhiasan: json.perhiasan ?? '',
      Rambut: json.rambut ?? '',
      Kosmetik: json.kosmetik ?? '',
      Kandung_Kemih: json.kandung_kemih ?? '',
      Gliserin: json.gliserin ?? '',
      Pembedahan: json.pembedahan ?? '',
      Persiapan_Darah: json.persiapan_darah ?? '',
      Persiapan_Darah_Keterangan: json.persiapan_darah_keterangan ?? '',
      Golongan_Darah: json.golongan_darah ?? '',
      Rhesus_Fektor: json.rhesus_fektor ?? '',
      Kondisi_Kulit_Id: json.kondisi_kulit_id ?? '',
      Jenis_Cairan: json.jenis_cairan ?? '',
      Cairan_Masuk: json.cairan_masuk ?? '',
      Jam_Mulai: json.jam_mulai ?? '',
      Needle_No: json.needle_no ?? '',
      Lokasi: json.lokasi ?? '',
      Infus_Dipasang: json.infus_dipasang ?? '',
      Pemeriksaan_Lainnya: json.pemeriksaan_lainnya ?? '',
      Catatan_Perawat: json.catatan_perawat ?? '',
      Tanggal: json.tanggal ?? '',
      Bb: json.bb ?? '',
      Tb: json.tb ?? '',
      Td: json.td ?? '',
      Nadi: json.nadi ?? '',
      Rr: json.rr ?? '',
      T: json.t ?? '',
      Sat: json.sat ?? '',
      Tanda_Tangan_Perawat_Pengantar: json["tanda-tangan-perawat-pengantar"] && json["tanda-tangan-perawat-pengantar"] !== '' && isValidFile(json["tanda-tangan-perawat-pengantar"]) ? global.storage.cleanUrl(json["tanda-tangan-perawat-pengantar"]) : '',
      ID_Tanda_Tangan_Perawat_Pengantar: json["id-tanda-tangan-perawat-pengantar"] ?? '',
      Tanda_Tangan_Perawat_Penerima: json["tanda-tangan-perawat-penerima"] && json["tanda-tangan-perawat-penerima"] !== '' && isValidFile(json["tanda-tangan-perawat-penerima"]) ? global.storage.cleanUrl(json["tanda-tangan-perawat-penerima"]) : '',
      ID_Tanda_Tangan_Perawat_Penerima: json["id-tanda-tangan-perawat-penerima"] ?? '',
      Tanda_Tangan_Kepala_Bedah: json["tanda-tangan-kepala-bedah"] && json["tanda-tangan-kepala-bedah"] !== '' && isValidFile(json["tanda-tangan-kepala-bedah"]) ? global.storage.cleanUrl(json["tanda-tangan-kepala-bedah"]) : '',
      ID_Tanda_Tangan_Kepala_Bedah: json["id-tanda-tangan-kepala-bedah"] ?? '',
    }
  }
}

export class PenandaanAreaPembedahan {
  static createFromJson(json: IUpdatePenandaanAreaPembedahan) {
    return {
      ID_Perawat: json["id-perawat"] ?? '',
      Dokter_Operasi_Id: json.dokter_operasi ?? '',
      Gambar_Body: json.gambar_body && json.gambar_body !== '' && isValidFile(json.gambar_body) ? global.storage.cleanUrl(json.gambar_body) : '',
      Gambar_Head: json.gambar_head && json.gambar_head !== '' && isValidFile(json.gambar_head) ? global.storage.cleanUrl(json.gambar_head) : '',
      Tanggal_Operasi: json.tanggal_operasi ?? '',
      Dokter_Pelaksana: json.dokter_pelaksana ?? '',
      TTD_Dokter_Pelaksana: json["ttd-dokter-pelaksana"] && json["ttd-dokter-pelaksana"] !== '' && isValidFile(json["ttd-dokter-pelaksana"]) ? global.storage.cleanUrl(json["ttd-dokter-pelaksana"]) : '',
      Tanda_Tangan_Pasien: json["tanda-tangan-pasien"] && json["tanda-tangan-pasien"] !== '' && isValidFile(json["tanda-tangan-pasien"]) ? global.storage.cleanUrl(json["tanda-tangan-pasien"]) : '',
      Tanda_Tangan_Perawat: json["tanda-tangan-perawat"] && json["tanda-tangan-perawat"] !== '' && isValidFile(json["tanda-tangan-perawat"]) ? global.storage.cleanUrl(json["tanda-tangan-perawat"]) : '',
      Prosedur_Operasi: json.prosedur_operasi ?? '',
    }
  }
}

export class SerahTerimaPasien {
  static createFromJson(json: IUpdateSerahTerimaPasien) {
    return {
      N: json.n ?? '',
      T: json.t ?? '',
      Pa: json.pa ?? '',
      Rr: json.rr ?? '',
      Td: json.td ?? '',
      Mual: json.mual ?? '',
      Infus: json.infus ?? '',
      Minum: json.minum ?? '',
      Anestesi: json.anestesi ?? '',
      Kesadaran: json.kesadaran ?? '',
      Kesakitan: json.kesakitan ?? '',
      Lain_lain: json.lain_lain ?? '',
      Luka_Lain: json.luka_lain ?? '',
      Obat_Lain: json.obat_lain ?? '',
      Antibiotik: json.antibiotik ?? '',
      Tetes_Mata: json.tetes_mata ?? '',
      Luka_Operasi: json.luka_operasi ?? '',
      Steward_Score: json.steward_score ?? '',
      Alderette_Score: json.alderette_score ?? '',
      Penanggungjawab: json.penanggungjawab ?? '',
      Steward_Motorik: json.steward_motorik ?? '',
      Waktu_Verifikasi: json.waktu_verifikasi ?? '',
      Monitoring_Selama: json.monitoring_selama ?? '',
      Monitoring_Setiap: json.monitoring_setiap ?? '',
      Steward_Kesadaran: json.steward_kesadaran ?? '',
      Steward_Pernafasan: json.steward_pernafasan ?? '',
      Alderette_Aktivitas: json.alderette_aktivitas ?? '',
      Alderette_Kesadaran: json.alderette_kesadaran ?? '',
      Alderette_Sirkulasi: json.alderette_sirkulasi ?? '',
      Alderette_Pernafasan: json.alderette_pernafasan ?? '',
      Penanggungjawab_Lain: json.penanggungjawab_lain ?? '',
      Alderette_Warna_Kulit: json.alderette_warna_kulit ?? '',
      ID_Perawat_Kamar_Bedah: json.id_perawat_kamar_bedah ?? '',
      ID_Perawat_Ranap_Rajal: json.id_perawat_ranap_rajal ?? '',
      TTD_Perawat_Kamar_Bedah: json.ttd_perawat_kamar_bedah && json.ttd_perawat_kamar_bedah !== '' && isValidFile(json.ttd_perawat_kamar_bedah) ? global.storage.cleanUrl(json.ttd_perawat_kamar_bedah) : '',
      TTD_Perawat_Ranap_Rajal: json.ttd_perawat_ranap_rajal && json.ttd_perawat_ranap_rajal !== '' && isValidFile(json.ttd_perawat_ranap_rajal) ? global.storage.cleanUrl(json.ttd_perawat_ranap_rajal) : '',
      // Nama_Perawat_Kamar_Bedah
      // Nama_Perawat_Ranap_Rajal
      Steward_Motorik_Keterangan: json.steward_motorik_keterangan ?? '',
      Steward_Kesadaran_Keterangan: json.steward_kesadaran_keterangan ?? '',
      Steward_Pernafasan_Keterangan: json.steward_pernafasan_keterangan ?? '',
      Alderette_Aktivitas_Keterangan: json.alderette_aktivitas_keterangan ?? '',
      Alderette_Kesadaran_Keterangan: json.alderette_kesadaran_keterangan ?? '',
      Alderette_Pernafasan_Keterangan: json.alderette_pernafasan_keterangan ?? '',
      Alderette_Sirkulasi_Keterangan: json.alderette_sirkulasi_keterangan ?? '',
      Alderette_Warna_Kulit_Keterangan: json.alderette_warna_kulit_keterangan ?? '',
    }
  }
}

export class Konsultasi {
  static createFromJson(json: IUpdateKonsultasi) {
    return {
      Tab: json.tab ?? '1',
      Rumah_Sakit_Tujuan: json.rumah_sakit_tujuan ?? '',
      Dokter_Konsul_Nama_Eksternal: json.rumah_sakit_tujuan && json.rumah_sakit_tujuan === 'eksternal' && json.dokter_konsul_eksternal ? json.dokter_konsul_eksternal : '',
      Tanggal_Konsul: json.tanggal_konsul ? moment(`${json.tanggal_konsul}:00`).unix() : undefined,
      Diagnosa: json.diagnosa ?? '',
      Terapi: json.terapi ?? '',
      Yth_Dokter_Konsul_Id: json.yth_dokter_konsul_id ? json.yth_dokter_konsul_id.split("-").join("_") : '',
      Status_Konsultasi: json.status_konsultasi ?? '',
      TTD_Dokter_Konsultasi: json.ttd_dokter_konsultasi && json.ttd_dokter_konsultasi !== '' && isValidFile(json.ttd_dokter_konsultasi) ? global.storage.cleanUrl(json.ttd_dokter_konsultasi) : '',
      ID_Dokter_Konsultasi: json.id_dokter_konsultasi ? json.id_dokter_konsultasi.split("-").join("_") : '',
      Tanggal_Balas: json.tanggal_balas ? moment(`${json.tanggal_balas}:00`).unix() : undefined,
      Anjuran: json.anjuran ?? '',
      Yth_Dokter_Balas_Id: json.yth_dokter_balas_id ? json.yth_dokter_balas_id.split("-").join("_") : '',
      TTD_Dokter_Balas_Konsultasi: json.ttd_dokter_balas_konsultasi && json.ttd_dokter_balas_konsultasi !== '' && isValidFile(json.ttd_dokter_balas_konsultasi) ? global.storage.cleanUrl(json.ttd_dokter_balas_konsultasi) : '',
      ID_Dokter_Balas_Konsultasi: json.id_dokter_balas_konsultasi ? json.id_dokter_balas_konsultasi.split("-").join("_") : '',
    }
  }
}
