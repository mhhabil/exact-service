export interface IAppRequest {
  emr_id: string;
  nomor_mr: string;
  id_pelayanan: string;
  kode_cabang: string;
  tipe_pasien: string;
  jenis_pelayanan: string;
  id_dokter: string;
  no_sep?: string;
}

export class AppRequest {
  emr_id: string;
  nomor_mr: string;
  id_pelayanan: string;
  kode_cabang: string;
  tipe_pasien: string;
  jenis_pelayanan: string;
  id_dokter: string;
  no_sep?: string;

  constructor(request: IAppRequest) {
    this.emr_id = request.emr_id;
    this.nomor_mr = request.nomor_mr;
    this.id_pelayanan = request.id_pelayanan;
    this.kode_cabang = request.kode_cabang;
    this.tipe_pasien = request.tipe_pasien;
    this.jenis_pelayanan = request.jenis_pelayanan;
    this.id_dokter = request.id_dokter;
    this.no_sep = request.no_sep;
  }
}
