import { AppRequest, IAppRequest } from "../app/app.request";

export interface IGetMedsRequest {
  company_code: string;
  id_lokasi: string;
  status?: string;
  reset_redis?: string;
}

export class GetMedsRequest {
  company_code: string;
  id_lokasi: string;
  status: string;
  reset_redis: string;

  constructor(req: IGetMedsRequest) {
    this.company_code = req.company_code;
    this.id_lokasi = req.id_lokasi;
    this.status = req.status ?? '1';
    this.reset_redis = req.reset_redis ?? '1';
  }

  static createFromJson(json: IGetMedsRequest) {
    return new GetMedsRequest(json);
  }
}

export interface IGetHtuRequest {
  company_code: string;
  tipe_pelayanan?: string;
  offset?: number;
  keyword?: string;
  limit?: number;
}

export class GetHtuRequest {
  company_code: string;
  tipe_pelayanan: string;
  offset: number;
  keyword: string;
  limit: number;

  constructor(req: IGetHtuRequest) {
    this.company_code = req.company_code;
    this.tipe_pelayanan = req.tipe_pelayanan ?? '';
    this.offset = req.offset ?? 0;
    this.keyword = req.keyword ?? '';
    this.limit = req.limit ?? 10000
  }

  static createFromJson(json: IGetHtuRequest) {
    return new GetHtuRequest(json);
  }
}

export interface IPostDaftarObat {
  kode_inventory: string;
  id_satuan: string;
  jumlah_resep: string;
  aturan_pakai: string;
  catatan: string;
}

export class PostDaftarObat {
  kode_inventory: string;
  id_satuan: string;
  jumlah_resep: string;
  aturan_pakai: string;
  catatan: string;

  constructor(req: IPostDaftarObat) {
    this.kode_inventory = req.kode_inventory;
    this.id_satuan = req.id_satuan;
    this.jumlah_resep = req.jumlah_resep;
    this.aturan_pakai = req.aturan_pakai;
    this.catatan = req.catatan;
  }

  static createFromPrescription(presc: IPrescription) {
    return {
      kode_inventory: presc.ID_Obat,
      id_satuan: presc.ID_Satuan,
      jumlah_resep: presc.Jumlah,
      aturan_pakai: presc.Kode_AturanPakai,
      catatan: presc.Catatan,
    }
  }
}

export interface IPostMedsToSimrs {
  company_code: string;
  tipe_pelayanan: string;
  no_berobat: any;
  tgl_resep: string;
  id_dokter: string;
  keterangan?: string;
  no_resep?: string;
  emr?: string;
  berat_badan?: number;
  alergi?: string;
  daftar_obat: IPostDaftarObat;
}

export class PostMedsToSimrs {
  company_code: string;
  tipe_pelayanan: string;
  no_berobat: any;
  tgl_resep: string;
  id_dokter: string;
  keterangan?: string;
  no_resep?: string;
  emr?: string;
  berat_badan?: number;
  alergi?: string;
  daftar_obat: IPostDaftarObat;

  constructor(req: IPostMedsToSimrs) {
    this.company_code = req.company_code;
    this.tipe_pelayanan = req.tipe_pelayanan;
    this.no_berobat = req.no_berobat;
    this.tgl_resep = req.tgl_resep;
    this.id_dokter = req.id_dokter;
    this.keterangan = req.keterangan ?? '';
    this.no_resep = req.no_resep ?? '';
    this.emr = req.emr ?? '1';
    this.berat_badan = req.berat_badan ?? 0;
    this.alergi = req.alergi ?? 'To Be Defined';
    this.daftar_obat = req.daftar_obat;
  }
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
  Ptosis_OD_FIP: string;
  Ptosis_OS_FIP: string;
  Ptosis_OD_MRD: string;
  Ptosis_OS_MRD: string;
  Ptosis_OD_LA: string;
  Ptosis_OS_LA: string;
}

export interface IImage {
  Url_Image: string;
  Name_Image: string;
  Size_Image: string;
  Type_Image: string;
}

export interface IUpdatePengkajianAwal {
  'catatan-note': string;
  anjuran: string;
  "aturan-pakai": Array<string>;
  catatan: Array<string>;
  kesimpulan_pemeriksaan: string;
  "coa-od": string;
  "coa-os": string;
  "conj-bulbi-od": string;
  "conj-bulbi-os": string;
  "conj-tarsal-inferior-od": string;
  "conj-tarsal-inferior-os": string;
  "conj-tarsal-superior-od": string;
  "conj-tarsal-superior-os": string;
  'canthal-medial-od': string;
  'canthal-medial-os': string;
  'canthal-lateral-od': string;
  'canthal-lateral-os': string;
  'sclera-od': string;
  'sclera-os': string;
  'data-objektif-lain': string;
  "cornea-od": string;
  "cornea-os": string;
  diagnosa: string;
  'diagnosa-keseragaman': string;
  "funduscopy-od": string;
  "funduscopy-os": string;
  "gambar-mata-od": string;
  "gambar-mata-os": string;
  "gambar-retina-od": string;
  "gambar-retina-os": string;
  "id-dokter-pengkaji": string;
  "iris-od": string;
  "iris-os": string;
  jumlah: Array<string>;
  keluhan: string;
  "lensa-od": string;
  "lensa-os": string;
  "nama-obat": Array<string>;
  "palpebra-inferior-od": string;
  "palpebra-inferior-os": string;
  "palpebra-superior-od": string;
  "palpebra-superior-os": string;
  pediatrik: IPediatric;
  "pergerakan-od": string;
  "pergerakan-os": string;
  "posisi-od": string;
  "posisi-os": string;
  "pupil-od": string;
  "pupil-os": string;
  "submit-pediatrik": string;
  "submit-retina": string;
  tanggal: string;
  terapi: string;
  "ttd-dokter-pengkaji": string;
  "vitreous-od": string;
  "vitreous-os": string;
  waktu: string;
  emr_id: string;
  nomor_mr: string;
  id_pelayanan: string;
  kode_cabang: string;
  tipe_pasien: string;
  jenis_pelayanan: string;
  id_dokter: string;
  no_sep: string;
  cppt_id: string;
  'image-1': IImage,
  'image-2': IImage,
}

export interface IUpdateRisikoJatuh {
  "tanggal-pengkaji": string;
  "tidakSeimbang-radio": string;
  "tidakBerisiko-radio": string;
  "alatBantu-radio": string;
  "alatBantu-value": string;
  "menopang-radio": string;
  "tanggal-hasil": string;
  "hasil-value": string;
  "hasil-teks": string;
  "hasil-keterangan": string;
  "tanggal-tindakan": string;
  "tinggi-stiker-radio": string;
  "tinggi-kuning-radio": string;
  "tinggi-edukasi-radio": string;
  "rendah-edukasi-radio": string;
  "tanda-tangan": string;
  "id-tanda-tangan": string;
  nomor_mr: string;
  id_pelayanan: string;
  kode_cabang: string;
  tipe_pasien: string;
  jenis_pelayanan: string;
  id_dokter: string;
  no_sep: string;
}

export interface IUpdatePengkajianAwalKeperawatan {
  "penanggung-jawab": string;
  "penanggung-jawab-nama": string;
  "penanggung-jawab-umur": string;
  "penanggung-jawab-jenisKelamin": string;
  "penanggung-jawab-alamat": string;
  "penanggung-jawab-hubungan": string;
  tanggal_waktu: string;
  keluhan_utama: string;
  td: string;
  bb: string
  p: string;
  nadi: string;
  tb: string;
  suhu: string;
  kesadaran: string;
  nyeri: string;
  status_nyeri: string;
  skala_nyeri: string;
  skrining_nyeri: string;
  lokasi_nyeri: string;
  durasi_nyeri: string;
  frekwensi_nyeri: string;
  nyeri_hilang: string;
  nyeri_hilang_lain_text: string;
  beritahu_dokter_pemeriksaan_fisik: string;
  beritahu_dokter_pemeriksaan_fisik_pukul: string;
  total_skor: string;
  hasil_total_skor: string;
  cara_berjalan: string;
  memegang_penopang: string;
  "hasil-value": string;
  "hasil-teks": string;
  beritahu_dokter_risiko_cedera: string;
  beritahu_dokter_risiko_cedera_pukul: string;
  jenis_operasi_dialami: string;
  waktu_operasi: string;
  komplikasi: string;
  riwayat_penyakit_keluarga: string;
  mempunyai_ketergantungan: string;
  ketergantungan_terhadap: string[];
  ketergantungan_terhadap_keterangan: string;
  ketergantungan_terhadap_penjelasan: string;
  riwayat_alergi: string;
  riwayat_alergi_keterangan: string;
  nutrisi_turun_bb: string;
  asupan_makan: string;
  diagnosa_khusus: string;
  jenis_penyakit: string[];
  jenis_penyakit_keterangan: string;
  skor_nutrisi: string;
  status_fungsional: string;
  status_fungsional_keterangan: string;
  status_fungsional_diberitahukan_pukul: string;
  bicara: string;
  bicara_text: string;
  perlu_penerjemah: string;
  perlu_penerjemah_text: string;
  bahasa_isyarat: string;
  hambatan_belajar: string;
  hambatan_belajar_text: string;
  tingkat_pendidikan: string;
  tingkat_pendidikan_text: string;
  status_ekonomi: string;
  status_ekonomi_text: string;
  status_sosial: string;
  status_psikologi: string;
  status_psikologi_text: string;
  status_mental: string;
  status_mental_text: string;
  hubungan_pasien_keluarga: string;
  agama: string;
  tabel_gangguan: string;
  tabel_nyeri: string;
  tabel_aktivitas: string;
  tabel_menangis: string;
  tabel_kenyamanan: string;
  tabel_infeksi: string;
  tabel_jatuh: string;
  tabel_tio: string;
  tabel_kurang_pengetahuan: string;
  tabel_wajah: string;
  tabel_kaki: string;
  tabel_lainnya: string;
  tabel_masalah_lainnya: string;
  tabel_rencana_lainnya: string;
  "ttd-perawat-pengkajian-masuk": string;
  "id-perawat-pengkajian-masuk": string;
  "ttd-perawat-pengkajian-keluar": string;
  "id-perawat-pengkajian-keluar": string;
  emr_id: string;
  nomor_mr: string;
  id_pelayanan: string;
  kode_cabang: string;
  tipe_pasien: string;
}

export interface IBiometricExamRequest {
  'list-no-berobat': string;
  od_k1: string;
  od_k2: string;
  od_acd: string;
  check_od_axl: string;
  od_axl_iol_master: string;
  od_axl_imersion: string;
  od_axl_contact: string;
  check_od_ca: string;
  od_ca_iol_master: string;
  od_ca_imersion: string;
  od_ca_contact: string;
  check_od_cl: string;
  od_cl_iol_master: string;
  od_cl_imersion: string;
  od_cl_contact: string;
  check_od_oc_ls_15: string;
  od_oc_ls_15_iol_master: string;
  od_oc_ls_15_imersion: string;
  od_oc_ls_15_contact: string;
  check_od_oc_ls_30: string;
  od_oc_ls_30_iol_master: string;
  od_oc_ls_30_imersion: string;
  od_oc_ls_30_contact: string;
  check_od_oc_ls: string;
  od_oc_ls_iol_master: string;
  od_oc_ls_imersion: string;
  od_oc_ls_contact: string;
  check_od_lucidis: string;
  od_lucidis_iol_master: string;
  od_lucidis_imersion: string;
  od_lucidis_contact: string;
  check_od_nano: string;
  od_nano_iol_master: string;
  od_nano_imersion: string;
  od_nano_contact: string;
  check_od_lenstec_sbl: string;
  od_lenstec_sbl_iol_master: string;
  od_lenstec_sbl_imersion: string;
  od_lenstec_sbl_contact: string;
  check_od_ct_asphina_409mp: string;
  od_ct_asphina_409mp_iol_master: string;
  od_ct_asphina_409mp_imersion: string;
  od_ct_asphina_409mp_contact: string;
  check_od_at_lisa_tri_839mp: string;
  od_at_lisa_tri_839mp_iol_master: string;
  od_at_lisa_tri_839mp_imersion: string;
  od_at_lisa_tri_839mp_contact: string;
  check_od_fold_asp: string;
  od_fold_asp_iol_master: string;
  od_fold_asp_imersion: string;
  od_fold_asp_contact: string;
  check_od_fold_sp: string;
  od_fold_sp_iol_master: string;
  od_fold_sp_imersion: string;
  od_fold_sp_contact: string;
  check_od_ra_25: string;
  od_ra_25_iol_master: string;
  od_ra_25_imersion: string;
  od_ra_25_contact: string;
  check_od_re_01: string;
  od_re_01_iol_master: string;
  od_re_01_imersion: string;
  od_re_01_contact: string;
  check_od_rf_31_pl: string;
  od_rf_31_pl_iol_master: string;
  od_rf_31_pl_imersion: string;
  od_rf_31_pl_contact: string;
  check_od_rf_22_l: string;
  od_rf_22_l_iol_master: string;
  od_rf_22_l_imersion: string;
  od_rf_22_l_contact: string;
  check_od_asqelio: string;
  od_asqelio_iol_master: string;
  od_asqelio_imersion: string;
  od_asqelio_contact: string;
  check_od_t_ple: string;
  od_t_ple_iol_master: string;
  od_t_ple_imersion: string;
  od_t_ple_contact: string;
  check_od_sys_m: string;
  od_sys_m_iol_master: string;
  od_sys_m_imersion: string;
  od_sys_m_contact: string;
  check_od_sys_t: string;
  od_sys_t_iol_master: string;
  od_sys_t_imersion: string;
  od_sys_t_contact: string;
  check_od_rp_11: string;
  od_rp_11_iol_master: string;
  od_rp_11_imersion: string;
  od_rp_11_contact: string;
  check_od_soft_hd_plus: string;
  od_soft_hd_plus_iol_master: string;
  od_soft_hd_plus_imersion: string;
  od_soft_hd_plus_contact: string;
  check_od_soft_hd: string;
  od_soft_hd_iol_master: string;
  od_soft_hd_imersion: string;
  od_soft_hd_contact: string;
  check_od_i_pure: string;
  od_i_pure_iol_master: string;
  od_i_pure_imersion: string;
  od_i_pure_contact: string;
  od_lentis_l313_monofocal_iol_master: string;
  od_lentis_l313_monofocal_imersion: string;
  od_lentis_l313_monofocal_contact: string;
  check_od_nano_fold: string;
  od_nano_fold_iol_master: string;
  od_nano_fold_imersion: string;
  od_nano_fold_contact: string;
  check_od_b_lomb_ao: string;
  od_b_lomb_ao_iol_master: string;
  od_b_lomb_ao_imersion: string;
  od_b_lomb_ao_contact: string;
  check_od_b_lomb_ao_m160: string;
  od_b_lomb_ao_m160_iol_master: string;
  od_b_lomb_ao_m160_imersion: string;
  od_b_lomb_ao_m160_contact: string;
  check_od_innova_aspheric: string;
  od_innova_aspheric_iol_master: string;
  od_innova_aspheric_imersion: string;
  od_innova_aspheric_contact: string;
  check_od_c_flex: string;
  od_c_flex_iol_master: string;
  od_c_flex_imersion: string;
  od_c_flex_contact: string;
  check_od_lentis_mplus_comfort: string;
  od_lentis_mplus_comfort_iol_master: string;
  od_lentis_mplus_comfort_imersion: string;
  od_lentis_mplus_comfort_contact: string;
  check_od_lentis_mplus_comfort_toric: string;
  od_lentis_mplus_comfort_toric_iol_master: string;
  od_lentis_mplus_comfort_toric_imersion: string;
  od_lentis_mplus_comfort_toric_contact: string;
  check_od_lentis_t_plus: string;
  od_lentis_t_plus_iol_master: string;
  od_lentis_t_plus_imersion: string;
  od_lentis_t_plus_contact: string;
  check_od_revive: string;
  od_revive_iol_master: string;
  od_revive_imersion: string;
  od_revive_contact: string;
  os_k1: string;
  os_k2: string;
  os_acd: string;
  check_os_axl: string;
  os_axl_iol_master: string;
  os_axl_imersion: string;
  os_axl_contact: string;
  check_os_ca: string;
  os_ca_iol_master: string;
  os_ca_imersion: string;
  os_ca_contact: string;
  check_os_cl: string;
  os_cl_iol_master: string;
  os_cl_imersion: string;
  os_cl_contact: string;
  check_os_oc_ls_15: string;
  os_oc_ls_15_iol_master: string;
  os_oc_ls_15_imersion: string;
  os_oc_ls_15_contact: string;
  check_os_oc_ls_30: string;
  os_oc_ls_30_iol_master: string;
  os_oc_ls_30_imersion: string;
  os_oc_ls_30_contact: string;
  check_os_oc_ls: string;
  os_oc_ls_iol_master: string;
  os_oc_ls_imersion: string;
  os_oc_ls_contact: string;
  check_os_lucidis: string;
  os_lucidis_iol_master: string;
  os_lucidis_imersion: string;
  os_lucidis_contact: string;
  check_os_nano: string;
  os_nano_iol_master: string;
  os_nano_imersion: string;
  os_nano_contact: string;
  check_os_lenstec_sbl: string;
  os_lenstec_sbl_iol_master: string;
  os_lenstec_sbl_imersion: string;
  os_lenstec_sbl_contact: string;
  check_os_ct_asphina_409mp: string;
  os_ct_asphina_409mp_iol_master: string;
  os_ct_asphina_409mp_imersion: string;
  os_ct_asphina_409mp_contact: string;
  check_os_at_lisa_tri_839mp: string;
  os_at_lisa_tri_839mp_iol_master: string;
  os_at_lisa_tri_839mp_imersion: string;
  os_at_lisa_tri_839mp_contact: string;
  check_os_fold_asp: string;
  os_fold_asp_iol_master: string;
  os_fold_asp_imersion: string;
  os_fold_asp_contact: string;
  check_os_fold_sp: string;
  os_fold_sp_iol_master: string;
  os_fold_sp_imersion: string;
  os_fold_sp_contact: string;
  check_os_ra_25: string;
  os_ra_25_iol_master: string;
  os_ra_25_imersion: string;
  os_ra_25_contact: string;
  check_os_re_01: string;
  os_re_01_iol_master: string;
  os_re_01_imersion: string;
  os_re_01_contact: string;
  check_os_rf_31_pl: string;
  os_rf_31_pl_iol_master: string;
  os_rf_31_pl_imersion: string;
  os_rf_31_pl_contact: string;
  check_os_rf_22_l: string;
  os_rf_22_l_iol_master: string;
  os_rf_22_l_imersion: string;
  os_rf_22_l_contact: string;
  check_os_asqelio: string;
  os_asqelio_iol_master: string;
  os_asqelio_imersion: string;
  os_asqelio_contact: string;
  check_os_t_ple: string;
  os_t_ple_iol_master: string;
  os_t_ple_imersion: string;
  os_t_ple_contact: string;
  check_os_sys_m: string;
  os_sys_m_iol_master: string;
  os_sys_m_imersion: string;
  os_sys_m_contact: string;
  check_os_sys_t: string;
  os_sys_t_iol_master: string;
  os_sys_t_imersion: string;
  os_sys_t_contact: string;
  check_os_rp_11: string;
  os_rp_11_iol_master: string;
  os_rp_11_imersion: string;
  os_rp_11_contact: string;
  check_os_soft_hd_plus: string;
  os_soft_hd_plus_iol_master: string;
  os_soft_hd_plus_imersion: string;
  os_soft_hd_plus_contact: string;
  check_os_soft_hd: string;
  os_soft_hd_iol_master: string;
  os_soft_hd_imersion: string;
  os_soft_hd_contact: string;
  check_os_i_pure: string;
  os_i_pure_iol_master: string;
  os_i_pure_imersion: string;
  os_i_pure_contact: string;
  os_lentis_l313_monofocal_iol_master: string;
  os_lentis_l313_monofocal_imersion: string;
  os_lentis_l313_monofocal_contact: string;
  check_os_nano_fold: string;
  os_nano_fold_iol_master: string;
  os_nano_fold_imersion: string;
  os_nano_fold_contact: string;
  check_os_b_lomb_ao: string;
  os_b_lomb_ao_iol_master: string;
  os_b_lomb_ao_imersion: string;
  os_b_lomb_ao_contact: string;
  check_os_b_lomb_ao_m160: string;
  os_b_lomb_ao_m160_iol_master: string;
  os_b_lomb_ao_m160_imersion: string;
  os_b_lomb_ao_m160_contact: string;
  check_os_innova_aspheric: string;
  os_innova_aspheric_iol_master: string;
  os_innova_aspheric_imersion: string;
  os_innova_aspheric_contact: string;
  check_os_c_flex: string;
  os_c_flex_iol_master: string;
  os_c_flex_imersion: string;
  os_c_flex_contact: string;
  check_os_lentis_mplus_comfort: string;
  os_lentis_mplus_comfort_iol_master: string;
  os_lentis_mplus_comfort_imersion: string;
  os_lentis_mplus_comfort_contact: string;
  check_os_lentis_mplus_comfort_toric: string;
  os_lentis_mplus_comfort_toric_iol_master: string;
  os_lentis_mplus_comfort_toric_imersion: string;
  os_lentis_mplus_comfort_toric_contact: string;
  check_os_lentis_t_plus: string;
  os_lentis_t_plus_iol_master: string;
  os_lentis_t_plus_imersion: string;
  os_lentis_t_plus_contact: string;
  check_os_revive: string;
  os_revive_iol_master: string;
  os_revive_imersion: string;
  os_revive_contact: string;
  dokter_pemeriksa: string;
  catatan: string;
  'ttd-tanggal': string;
  'ttd-dokter-pemeriksa': string;
  'id-dokter-pemeriksa': string;
  nomor_mr: string;
  id_pelayanan: string;
  kode_cabang: string;
  tipe_pasien: string;
  jenis_pelayanan: string;
  id_dokter: string;
  no_sep: string;
}

export interface IUpdateBPRJ {
  keluhan: string;
  'od-kml-select': string;
  'od-koreksi-1-select': string;
  'od-koreksi-2-select': string;
  'od-kmb-select': string;
  'od-rpl-select': string;
  'od-rpl-streak-select': string;
  'od-rpl-2-select': string;
  'od-rpl-streak-2-select': string;
  'os-kml-select': string;
  'os-koreksi-1-select': string;
  'os-koreksi-2-select': string;
  'os-kmb-select': string;
  'os-rpl-select': string;
  'os-rpl-streak-select': string;
  'os-rpl-2-select': string;
  'os-rpl-streak-2-select': string;
  kgd: string;
  td: string;
  diagnosa: string;
  terapi: string;
  anjuran: string;
  'tanggal-ttd': string;
  'tanda-tangan-radio': string;
  'tanda-tangan-pasien': string;
  'tanda-tangan-wali': string;
  'ttd-dokter': string;
  'id-dokter': string;
  'sip-dokter': string;
  nomor_mr: string;
  id_pelayanan: string;
  kode_cabang: string;
  tipe_pasien: string;
  jenis_pelayanan: string;
  id_dokter: string;
  no_sep: string;
}

export interface IUpdatePemberianInformasi {
  nama_template: string;
  "dokter-pelaksana": string
  "pemberi-informasi": string
  "penerima-informasi": string
  diagnosis: string
  "diagnosis-custom": string
  "diagnosis-check": string
  "dasar-diagnosis": string
  "dasar-diagnosis-check": string
  "tindakan-kedokteran": string
  "tindakan-kedokteran-check": string
  "indikasi-tindakan": string
  "indikasi-tindakan-check": string
  "tata-cara-tipe-sedasi": string
  "tata-cara-uraian-singkat": string
  "tata-cara": string
  "tata-cara-check": string
  tujuan: string
  "tujuan-check": string
  risiko: string
  "risiko-check": string
  komplikasi: string
  "komplikasi-check": string
  prognosis: string
  "prognosis-check": string
  "alternatif-risiko-pilihan-pengobatan": string
  "alternatif-risiko": string
  "alternatif-resiko-check": string
  "hal-lain-perluasan-tindakan": string
  "hal-lain-konsultasi": string
  "hal-lain": string
  "hal-lain-check": string
  "ttd-pasien": string
  "ttd-dokter-pelaksana": string
  dokter_pelaksana_informasi: string
  nama_wali: string;
}

export interface IUpdatePersetujuanTindakanDokter {
  "pasien-kota": string;
  "pasien-nomorMR": string
  "pasien-nama": string
  "pasien-tglLahir": string
  "pasien-jk": string
  "pasien-tindakanOperasi": string
  pernyataan: string
  "tandaTangan-radio": string
  "tandaTangan-nama": string
  "tandaTangan-tglLahir": string
  "tandaTangan-jk": string
  "tandaTangan-telp": string
  "tandaTangan-alamat": string
  "tandaTangan-hubungan": string
  "pasien-tanggal": string
  "nama-saksi-keluarga": string
  "tanda-tangan-pasien": string
  "tanda-tangan-saksi-2": string
  "tanda-tangan-saksi": string
  "id-saksi": string
  tanggal_ttd: string;
  dokter_pelaksana: string;
  undefined: string
  nomor_mr: string
  id_pelayanan: string
  kode_cabang: string
  tipe_pasien: string
  jenis_pelayanan: string
  id_dokter: string
  no_sep: string
}

export interface IUpdateRajalCatatanKeperawatanPra {
  suhu: string;
  nadi: string;
  rr: string;
  td: string;
  kgd: string;
  tb: string;
  bb: string;
  skala_nyeri: string;
  status_mental: string[];
  riwayat_penyakit: string[];
  riwayat_penyakit_keterangan: string;
  pengobatan_saat_ini: string;
  pengobatan_saat_ini_keterangan: string;
  alat_bantu:  string
  alat_bantu_keterangan: string;
  operasi_sebelumnya: string;
  operasi_sebelumnya_keterangan: string;
  operasi_sebelumnya_tanggal: string;
  operasi_sebelumnya_di: string;
  alergi: string;
  alergi_keterangan: string;
  site_marking: string;
  site_marking_keterangan: string;
  penjelasan_singkat: string;
  penjelasan_singkat_keterangan: string;
  pemeriksaan_penunjang: string[];
  pemeriksaan_penunjang_keterangan: string;
  verifikasi_periksa_identitas: string;
  verifikasi_periksa_identitas_keterangan: string;
  verifikasi_periksa_identitas_rajal_keterangan: string;
  verifikasi_periksa_gelang: string;
  verifikasi_periksa_gelang_keterangan: string;
  verifikasi_periksa_gelang_rajal_keterangan: string;
  verifikasi_surat_pengantar_operasi: string;
  verifikasi_surat_pengantar_operasi_keterangan: string;
  verifikasi_surat_pengantar_operasi_rajal_keterangan: string;
  verifikasi_jenis_lokasi_operasi: string;
  verifikasi_jenis_lokasi_operasi_keterangan: string;
  verifikasi_jenis_lokasi_operasi_rajal_keterangan: string;
  verifikasi_masalah_bahasa_komunikasi: string;
  verifikasi_masalah_bahasa_komunikasi_keterangan: string;
  verifikasi_masalah_bahasa_komunikasi_rajal_keterangan: string;
  verifikasi_surat_izin_operasi: string;
  verifikasi_surat_izin_operasi_keterangan: string;
  verifikasi_surat_izin_operasi_rajal_keterangan: string;
  verifikasi_persetujuan_anestesi: string;
  verifikasi_persetujuan_anestesi_keterangan: string;
  verifikasi_persetujuan_anestesi_rajal_keterangan: string;
  verifikasi_kelengkapan_resume_medis: string;
  verifikasi_kelengkapan_resume_medis_keterangan: string;
  verifikasi_kelengkapan_resume_medis_rajal_keterangan: string;
  verifikasi_kelengkapan_x_ray: string;
  verifikasi_kelengkapan_x_ray_keterangan: string;
  verifikasi_kelengkapan_x_ray_rajal_keterangan: string;
  persiapan_puasa: string;
  persiapan_puasa_keterangan: string;
  persiapan_puasa_rajal_keterangan: string;
  persiapan_prothese_luar: string;
  persiapan_prothese_luar_keterangan: string;
  persiapan_prothese_luar_rajal_keterangan: string;
  persiapan_prothese_dalam: string;
  persiapan_prothese_dalam_keterangan: string;
  persiapan_prothese_dalam_rajal_keterangan: string;
  persiapan_penjepit_rambut: string;
  persiapan_penjepit_rambut_keterangan: string;
  persiapan_penjepit_rambut_rajal_keterangan: string;
  persiapan_kulit: string;
  persiapan_kulit_keterangan: string;
  persiapan_kulit_rajal_keterangan: string;
  persiapan_alat_bantu: string;
  persiapan_alat_bantu_keterangan: string;
  persiapan_alat_bantu_rajal_keterangan: string;
  persiapan_obat_disertakan: string;
  persiapan_obat_disertakan_keterangan: string;
  persiapan_obat_disertakan_rajal_keterangan: string;
  persiapan_obat_terakhir_diberikan: string;
  persiapan_obat_terakhir_diberikan_keterangan: string;
  persiapan_obat_terakhir_diberikan_rajal_keterangan: string;
  persiapan_vaskuler_akses: string;
  persiapan_vaskuler_akses_keterangan: string;
  persiapan_vaskuler_akses_rajal_keterangan: string;
  lain_site_marking: string;
  lain_penjelasan_singkat: string;
  tanggal: string;
  "ttd-perawat-ruangan": string;
  "id-perawat-ruangan": string;
  "ttd-perawat-penerima": string;
  "id-perawat-penerima":  string;
}

export interface IUpdateChecklistPraOperasi {
  bb: string
  tb: string
  td: string
  nadi: string
  rr: string
  t: string
  sat: string
  inform_consent_bedah: string
  inform_consent: string
  hamil: string
  izin_sterilisasi: string
  gelang_pengenal: string
  gelang_alergi: string
  implant: string
  ekg: string
  foto_fundus: string
  usg_mata: string
  biometri: string
  makula: string
  laboratorium: string
  radiologi: string
  resiko_jatuh: string
  jenis_pasien: string
  puasa: string
  puasa_keterangan: string
  anestesi: string
  dokter_id: string
  alergi: string
  alergi_keterangan: string
  pre_medikasi: string
  gigi_palsu: string
  lensa: string
  perhiasan: string
  rambut: string
  kosmetik: string
  kandung_kemih: string
  gliserin: string
  pembedahan: string
  persiapan_darah: string
  persiapan_darah_keterangan: string
  golongan_darah: string
  rhesus_fektor: string
  kondisi_kulit_id: string
  jenis_cairan: string
  cairan_masuk: string
  jam_mulai: string
  needle_no: string
  lokasi: string
  infus_dipasang: string
  pemeriksaan_lainnya: string
  catatan_perawat: string
  tanggal: string
  "tanda-tangan-perawat-pengantar": string
  "id-tanda-tangan-perawat-pengantar": string
  "tanda-tangan-perawat-penerima": string
  "id-tanda-tangan-perawat-penerima": string
  "tanda-tangan-kepala-bedah": string
  "id-tanda-tangan-kepala-bedah": string
}

export interface IUpdatePenandaanAreaPembedahan {
  tanggal_operasi: string
  prosedur_operasi: string
  dokter_operasi: string
  "tanda-tangan-pasien": string
  "ttd-dokter-pelaksana": string
  dokter_pelaksana: string
  "tanda-tangan-perawat": string
  "id-perawat": string
  gambar_head: string
  gambar_body: string
}

export interface IUpdateSerahTerimaPasien {
  penanggungjawab: string
  penanggungjawab_lain: string
  kesadaran: string
  luka_operasi: string
  luka_lain: string
  td: string
  rr: string
  n: string
  t: string
  anestesi: string
  alderette_aktivitas: string
  alderette_aktivitas_keterangan: string
  alderette_sirkulasi: string
  alderette_sirkulasi_keterangan: string
  alderette_pernafasan: string
  alderette_pernafasan_keterangan: string
  alderette_kesadaran: string
  alderette_kesadaran_keterangan: string
  alderette_warna_kulit: string
  alderette_warna_kulit_keterangan: string
  alderette_score: string
  steward_kesadaran: string
  steward_kesadaran_keterangan: string
  steward_pernafasan: string
  steward_pernafasan_keterangan: string
  steward_motorik: string
  steward_motorik_keterangan: string
  steward_score: string
  kesakitan: string
  mual: string
  antibiotik: string
  tetes_mata: string
  obat_lain: string
  infus: string
  minum: string
  lain_lain: string
  monitoring_setiap: string
  monitoring_selama: string
  pa: string
  waktu_verifikasi: string
  ttd_perawat_ranap_rajal: string
  id_perawat_ranap_rajal: string
  ttd_perawat_kamar_bedah: string
  id_perawat_kamar_bedah: string
  nomor_mr: string
  id_pelayanan: string
  kode_cabang: string
  tipe_pasien: string
  jenis_pelayanan: string
  id_dokter: string
  no_sep: string
}

export interface IUpdateKonsultasi {
  id: string;
  tab: string;
  rumah_sakit_tujuan: string;
  dokter_konsul_eksternal: string;
  dokter_konsul_nama_eksternal: string;
  tanggal_konsul: string;
  diagnosa: string;
  terapi: string;
  yth_dokter_konsul_nama: string;
  yth_dokter_konsul_id: string;
  status_konsultasi: string;
  "aturan-pakai": Array<string>;
  catatan: Array<string>;
  jumlah: Array<string>;
  'nama-obat': Array<string>;
  ttd_dokter_konsultasi: string;
  id_dokter_konsultasi: string;
  nama_ttd_dokter_konsultasi: string;
  tanggal_balas: string;
  anjuran: string;
  yth_dokter_balas_nama: string;
  yth_dokter_balas_id: string;
  ttd_dokter_balas_konsultasi: string;
  id_dokter_balas_konsultasi: string;
  nama_ttd_dokter_balas_konsultasi: string;
  cppt_id: string;
}
export interface IUp {
  date: string;
  dokter_rawat: string;
  nama_tindakan: string;
}

export class Up {
  date: string;
  dokter_rawat: string;
  nama_tindakan: string;

  constructor(req: IUp) {
    this.date = req.date;
    this.dokter_rawat = req.dokter_rawat;
    this.nama_tindakan = req.nama_tindakan;
  }
}

export interface IDown {
  tgl: string;
  nama_dokter: string;
  diagnosa: string;
  terapi: string;
  keterangan: string;
}

export class Down {
  tgl: string;
  nama_dokter: string;
  diagnosa: string;
  terapi: string;
  keterangan: string;

  constructor(req: IDown) {
    this.tgl = req.tgl;
    this.nama_dokter = req.nama_dokter;
    this.diagnosa = req.diagnosa;
    this.terapi = req.terapi;
    this.keterangan = req.keterangan;
  }
}

export interface IUpdateResumeMedisPdf extends IAppRequest {
  'pasien.Nama': string;
  'pasien.Tgl_Lahir': string;
  'pasien.Umur': string;
  'pasien.Jenis_Kelamin': string;
  up: Array<IUp>;
  down: Array<IDown>;
  nik: string;
}

export class UpdateResumeMedisPdf extends AppRequest {
  'pasien.Nama': string;
  'pasien.Tgl_Lahir': string;
  'pasien.Umur': string;
  'pasien.Jenis_Kelamin': string;
  up: Array<IUp>;
  down: Array<IDown>;
  nik: string;

  constructor(req: IUpdateResumeMedisPdf) {
    super(req);
    this["pasien.Jenis_Kelamin"] = req["pasien.Jenis_Kelamin"];
    this["pasien.Nama"] = req["pasien.Nama"];
    this["pasien.Tgl_Lahir"] = req["pasien.Tgl_Lahir"];
    this["pasien.Umur"] = req["pasien.Umur"];
    this.up = req.up && Array.isArray(req.up) ? req.up.map(c => new Up(c)) : [];
    this.down = req.down && Array.isArray(req.down) ? req.down.map(c => new Down(c)) : [];
    this.nik = req.nik;
  }

  static createFromJson(json: IUpdateResumeMedisPdf) {
    return new UpdateResumeMedisPdf(json);
  }
}
