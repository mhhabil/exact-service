import moment from 'moment'

interface IBodyToSimrs {
  company_code: string;
  tipe_pelayanan: string;
  no_berobat: string;
  tgl_resep: string;
  id_dokter: string;
  keterangan: string;
  no_mr: string;
  nama_pembeli: string;

  dsphereod: string;
  dcylod:  string;
  daxod: string;
  dvaod: string;

  asphereod: string;
  acylod: string;
  aaxod: string;
  avaod: string;

  dsphereos: string;
  dcylos: string;
  daxos: string;
  dvaos: string;
  asphereos: string;
  acylos: string;
  aaxos: string;
  avaos: string;
  apd: string;
  dpd: string;
  tgl_jual: string;
  status_bayar: string;
  no_hp: string;
  daftar_obat: any[];
  id_resep_h: string;
  id_jual_h: any;
  no_faktur: string;
}

class BodyToSimrs {
  company_code: string;
  tipe_pelayanan: string;
  no_berobat: string;
  tgl_resep: string;
  id_dokter: string;
  keterangan: string;
  no_mr: string;
  nama_pembeli: string;

  dsphereod: string;
  dcylod:  string;
  daxod: string;
  dvaod: string;

  asphereod: string;
  acylod: string;
  aaxod: string;
  avaod: string;

  dsphereos: string;
  dcylos: string;
  daxos: string;
  dvaos: string;
  asphereos: string;
  acylos: string;
  aaxos: string;
  avaos: string;
  apd: string;
  dpd: string;
  tgl_jual: string;
  status_bayar: string;
  no_hp: string;
  daftar_obat: any[];
  id_resep_h: string;
  id_jual_h: any;
  no_faktur: string;

  constructor(req: IBodyToSimrs) {
    this.company_code = req.company_code;
    this.tipe_pelayanan = req.tipe_pelayanan;
    this.no_berobat = req.no_berobat;
    this.tgl_resep = req.tgl_resep;
    this.id_dokter = req.id_dokter;
    this.keterangan = req.keterangan;
    this.no_mr = req.no_mr;
    this.nama_pembeli = req.nama_pembeli;
    this.dsphereod = req.dsphereod;
    this.dcylod = req.dcylod;
    this.daxod = req.daxod;
    this.dvaod = req.dvaod;
    this.asphereod = req.asphereod;
    this.acylod = req.acylod;
    this.aaxod = req.aaxod;
    this.avaod = req.avaod;
    this.dsphereos = req.dsphereos;
    this.dcylos = req.dcylos;
    this.daxos = req.daxos;
    this.dvaos = req.dvaos;
    this.asphereos = req.asphereos;
    this.acylos = req.acylos;
    this.aaxos = req.aaxos;
    this.avaos = req.avaos;
    this.apd = req.apd;
    this.dpd = req.dpd;
    this.tgl_jual = req.tgl_jual;
    this.status_bayar = req.status_bayar;
    this.no_hp = req.no_hp;
    this.daftar_obat = req.daftar_obat;
    this.id_resep_h = req.id_resep_h;
    this.id_jual_h = req.id_jual_h;
    this.no_faktur = req.no_faktur;
  }

  static createFromJson(json: IUpdateResepKacamata) {
    return {
      company_code: (json.kode_cabang) ? json.kode_cabang : '',
      tipe_pelayanan: (json.tipe_pasien) ? json.tipe_pasien : '',
      no_berobat: (json.id_pelayanan) ? json.id_pelayanan : '',
      tgl_resep: moment().format("YYYY-MM-DD HH:mm:ss"),
      id_dokter: (json.id_dokter) ? json.id_dokter : '',
      keterangan: '',
      no_mr: (json.nomor_mr) ? json.nomor_mr : '',
      nama_pembeli: (json.nama_pasien) ? json.nama_pasien : '',
      dsphereod: (json.sph_right_distance) ? json.sph_right_distance : '',
      dcylod: (json.cyl_right_distance) ? json.cyl_right_distance : '',
      daxod: (json.ax_right_distance) ? json.ax_right_distance : '',
      dvaod: (json.va_right_distance) ? json.va_right_distance : '',
      asphereod: (json.sph_right_reading) ? json.sph_right_reading : '',
      acylod: (json.cyl_right_reading) ? json.cyl_right_reading : '',
      aaxod: (json.ax_right_reading) ? json.ax_right_reading : '',
      avaod: (json.va_right_reading) ? json.va_right_reading : '',
      dsphereos: (json.sph_left_distance) ? json.sph_left_distance : '',
      dcylos: (json.cyl_left_distance) ? json.cyl_left_distance : '',
      daxos: (json.ax_left_distance) ? json.ax_left_distance : '',
      dvaos: (json.va_left_distance) ? json.va_left_distance : '',
      asphereos: (json.sph_left_reading) ? json.sph_left_reading : '',
      acylos: (json.cyl_left_reading) ? json.cyl_left_reading : '',
      aaxos: (json.ax_left_reading) ? json.ax_left_reading : '',
      avaos: (json.va_left_reading) ? json.va_left_reading : '',
      apd: (json.pd_reading) ? json.pd_reading : '',
      dpd: (json.pd_distance) ? json.pd_distance : '',
      tgl_jual: moment().format("YYYY-MM-DD HH:mm:ss"),
      status_bayar: '',
      no_hp: (json.no_hp) ? json.no_hp : '',
      daftar_obat: [],
      id_resep_h: (json.resep_h) ? json.resep_h : '',
      id_jual_h: null,
      no_faktur: (json.resep_h) ? json.resep_h : '',
    }
  }
}

interface IUpdateResepKacamata {
  "pengkajian-awal-od": string;
  "pengkajian-awal-os": string;
  no_hp: string;
  nama_pasien: string;
  flag_params: string;
  no_faktur: string;
  resep_h: string;
  sph_right_distance: string;
  cyl_right_distance: string;
  ax_right_distance: string;
  va_right_distance: string;
  sph_left_distance: string;
  cyl_left_distance: string;
  ax_left_distance: string;
  va_left_distance: string;
  pd_distance: string;
  sph_right_reading: string;
  cyl_right_reading: string;
  ax_right_reading: string;
  va_right_reading: string;
  sph_left_reading: string;
  cyl_left_reading: string;
  ax_left_reading: string;
  va_left_reading: string;
  pd_reading: string;
  "catatan-lain": string;
  "tanggal-resep": string;
  "ttd-dokter": string;
  dokter: string;
  nomor_mr: string;
  id_pelayanan: string;
  kode_cabang: string;
  tipe_pasien: string;
  jenis_pelayanan: string;
  id_dokter: string;
  no_sep: string;
}

export { BodyToSimrs }
export type { IUpdateResepKacamata, IBodyToSimrs }
