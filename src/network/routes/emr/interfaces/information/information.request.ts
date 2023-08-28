export interface IUpdateResumeMedis {
  tindakan: string;
  'pemeriksaan-lapang-pandang': string;
  'pemeriksaan-oct-papil': string;
  'pemeriksaan-oct-retina': string;
  'foto-fundus': string;
  'usg-mata': string;
  'laboratorium-radiologi': string;
  'tanggal-kontrol': string;
  'alasan-kontrol': string;
  'rencana-tindak-lanjut': string;
  'alasan-belum-dapat': string;
  'ttd-dokter': string;
  'id-dokter': string;
  nomor_mr: string;
  id_pelayanan: string;
  kode_cabang: string;
  tipe_pasien: string;
  jenis_pelayanan: string;
  id_dokter: string;
  no_sep: string;
}

export interface IUpdatePernyataanBPJS {
  tanggal_ttd: string;
  id_ttd_petugas: string;
  id_ttd_saksi: string;
  ttd_pasien: string;
  ttd_wali: string;
  ttd_petugas: string;
  ttd_saksi: string;
  penanggung_jawab: string;
  umur_wali: string;
  jenis_kelamin_wali: string;
  nama_wali: string;
  alamat_wali: string;
  hubungan_wali: string;
}

export interface IUpdatePernyataanUMUM {
  tanggal_ttd: string;
  id_ttd_petugas: string;
  id_ttd_saksi: string;
  ttd_pasien: string;
  ttd_wali: string;
  ttd_petugas: string;
  ttd_saksi: string;
  penanggung_jawab: string;
  nik: string;
}

