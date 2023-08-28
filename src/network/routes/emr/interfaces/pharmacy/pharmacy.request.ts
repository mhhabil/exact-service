export interface IMedsAllergyReq {
  nama_obat_alergi: string;
  tingkat: string;
  reaksi_alergi: string;
}

export interface IObatMasukRSReq {
  nama_obat: string;
  jumlah: string;
  rute: string;
  aturan_pakai: string;
  tindak_lanjut: string;
  perubahan_aturan_pakai: string;
  obat_milik_pasien: string
}

export interface IObatRuanganReq {
  nama_obat: string;
  jumlah: string;
  rute: string;
  aturan_pakai: string;
  tindak_lanjut: string;
  perubahan_aturan_pakai: string;
}

export interface IObatKeluarReq {
  nama_obat: string;
  jumlah: string;
  rute: string;
  aturan_pakai: string;
  tindak_lanjut: string;
  perubahan_aturan_pakai: string;
  kategori: string;
}

export interface IUpdateRekonsiliasiObat {
  riwayat_pemakaian_obat: Array<string>;
  alergi_obat_radio: string;
  alergi_obat: Array<IMedsAllergyReq>;
  unit_masuk_rs: string;
  id_ka_unit_masuk_rs: string;
  waktu_masuk_rs: string;
  obat_saat_masuk_rs: Array<IObatMasukRSReq>;
  id_perawat_masuk_rs: string;
  ttd_perawat_masuk_rs: string;
  ttd_pasien_masuk_rs: string;
  id_dokter_masuk_rs: string;
  ttd_dokter_masuk_rs: string;
  id_apoteker_masuk_rs: string;
  ttd_apoteker_masuk_rs: string;
  unit_ruangan_1: string;
  id_ka_unit_ruangan_1: string;
  waktu_ruangan_1: string;
  obat_ruangan_1: Array<IObatRuanganReq>;
  id_perawat_ruangan_1: string;
  ttd_perawat_ruangan_1: string;
  id_dokter_ruangan_1: string;
  ttd_dokter_ruangan_1: string;
  ttd_pasien_ruangan_1: string;
  id_apoteker_ruangan_1: string;
  ttd_apoteker_ruangan_1: string;
  unit_ruangan_2: string;
  id_ka_unit_ruangan_2: string;
  waktu_ruangan_2: string;
  obat_ruangan_2: Array<IObatRuanganReq>;
  id_perawat_ruangan_2: string;
  ttd_perawat_ruangan_2: string;
  id_dokter_ruangan_2: string;
  ttd_dokter_ruangan_2: string;
  ttd_pasien_ruangan_2: string;
  id_apoteker_ruangan_2: string;
  ttd_apoteker_ruangan_2: string;
  unit_keluar: string;
  id_ka_unit_keluar: string;
  waktu_keluar: string;
  obat_keluar: Array<IObatKeluarReq>;
  id_perawat_keluar: string;
  ttd_perawat_keluar: string;
  id_dokter_keluar: string;
  ttd_dokter_keluar: string;
  ttd_pasien_keluar: string;
  id_apoteker_keluar: string;
  ttd_apoteker_keluar: string;
}

export interface IObatDiterimaReq {
  nama_obat: string;
  satuan: string;
  no_bets: string;
  aturan_pakai: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  obat_dicurigai_check: string;
}

export interface IUpdateEfekSampingObat {
  terjadi_efek_samping_obat: string;
  waktu: string;
  jenis_kelamin: string;
  status_hamil: string;
  suku_check: string;
  nama_suku: string;
  berat_badan_check: string;
  berat_badan: string;
  diagnosa_utama: string;
  kesudahan_penyakit_utama: string;
  riwayat_hati_check: string;
  riwayat_ginjal_check: string;
  riwayat_lain_check: string;
  riwayat_lain_text: string;
  bentuk_manifestasi_eso: string;
  tanggal_mula_terjadi: string;
  tanggal_kesudahan: string;
  kesudahan_eso: string;
  riwayat_eso_sebelum: string;
  obat_diterima: Array<IObatDiterimaReq>;
  keterangan_tambahan: string;
  algoritma_naranjo_1: string;
  algoritma_naranjo_2: string;
  algoritma_naranjo_3: string;
  algoritma_naranjo_4: string;
  algoritma_naranjo_5: string;
  algoritma_naranjo_6: string;
  algoritma_naranjo_7: string;
  algoritma_naranjo_8: string;
  algoritma_naranjo_9: string;
  algoritma_naranjo_10: string;
  total_skor: string;
  id_pelapor: string;
  ttd_pelapor: string;
}

export interface IUpdateObat {
  kode_obat: any;
  nama_obat: any;
  nama_satuan: any;
  kode_aturanpakai: any;
  rute: any;
}

export class UpdateObat {
  kode_obat: any;
  nama_obat: any;
  nama_satuan: any;
  kode_aturanpakai: any;
  rute: any;

  constructor(req: IUpdateObat) {
    this.kode_obat = req.kode_obat;
    this.nama_obat = req.nama_obat;
    this.nama_satuan = req.nama_satuan;
    this.kode_aturanpakai = req.kode_aturanpakai;
    this.rute = req.rute;
  }
}

export interface IUpdateBeriObat {
  id?: string;
  waktu: string;
  ttd_pasien: string;
  ttd_perawat: string;
  id_perawat: string;
  obat: Array<IUpdateObat>;
}

export class UpdateBeriObat {
  id?: string;
  waktu: string;
  ttd_pasien: string;
  ttd_perawat: string;
  id_perawat: string;
  obat: Array<IUpdateObat>;

  constructor(req: IUpdateBeriObat) {
    this.id = req.id;
    this.waktu = req.waktu;
    this.ttd_pasien = req.ttd_pasien;
    this.ttd_perawat = req.ttd_perawat;
    this.id_perawat = req.id_perawat;
    this.obat = req.obat && Array.isArray(req.obat) ? req.obat.map(c => new UpdateObat(c)) : [];
  }

  static createFromJson(json: IUpdateBeriObat) {
    return new UpdateBeriObat(json);
  }
}

export interface IUpdateObatDiberikan {
  id: string;
  rute: string;
  catatan: string;
  id_obat: string;
  id_aturanpakai: string;
  ttd_dokter: string;
  id_dokter_obat: string;
}

export class UpdateObatDiberikan {
  id: string;
  rute: string;
  catatan: string;
  id_obat: string;
  id_aturanpakai: string;
  ttd_dokter: string;
  id_dokter_obat: string;

  constructor(req: IUpdateObatDiberikan) {
    this.id = req.id;
    this.rute = req.rute;
    this.catatan = req.catatan;
    this.id_obat = req.id_obat;
    this.id_aturanpakai = req.id_aturanpakai;
    this.ttd_dokter = req.ttd_dokter;
    this.id_dokter_obat = req.id_dokter_obat;
  }

  static createFromJson(json: IUpdateObatDiberikan) {
    return new UpdateObatDiberikan(json);
  }
}

export interface IUpdateCPOTWPdf {
  alergi: string;
  rpo: string;
  rpt: string;
  emr_id: string;
  nomor_mr: string;
  id_pelayanan: string;
  kode_cabang: string;
  tipe_pasien: string;
  jenis_pelayanan: string;
  id_dokter: string;
}

export class UpdateCPOTWPdf  {
  alergi: string;
  rpo: string;
  rpt: string;
  emr_id: string;
  nomor_mr: string;
  id_pelayanan: string;
  kode_cabang: string;
  tipe_pasien: string;
  jenis_pelayanan: string;
  id_dokter: string;

  constructor(req: IUpdateCPOTWPdf) {
    this.alergi = req.alergi;
    this.rpo = req.rpo;
    this.rpt = req.rpt;
    this.emr_id = req.emr_id;
    this.nomor_mr = req.nomor_mr;
    this.id_pelayanan = req.id_pelayanan;
    this.kode_cabang = req.kode_cabang;
    this.tipe_pasien = req.tipe_pasien;
    this.jenis_pelayanan = req.jenis_pelayanan;
    this.id_dokter = req.id_dokter;
  }

  static createFromJson(json: IUpdateCPOTWPdf) {
    return new UpdateCPOTWPdf(json);
  }
}

