export interface IDailyEducationRequest {
  waktu: string;
  'pendengar-radio': string;
  nama: string;
  telepon: string;
  alamat: string;
  uraian: string;
  'tanda-tangan': string;
  'ttd-pemberi-edukasi': string;
  'id-pemberi-edukasi': string;
  ID: string;
  nomor_mr: string;
  id_pelayanan: string;
  kode_cabang: string;
  tipe_pasien: string;
  jenis_pelayanan: string;
  id_dokter: string;
  no_sep: string;
  unit: 'RO' | 'Informasi & Edukasi' | 'Rawat Jalan' | 'Farmasi';
}
