export interface IBaseModel {
  EMR_ID: string | String;
  id_pelayanan: string;
  jenis_pelayanan: string;
  kode_cabang: string;
  nomor_mr: string;
  tipe_pasien: string;
  pasien?: IPatient;
  wali?: IPatientGuardian;
}

export class BaseModel {
  EMR_ID: string | String;
  id_pelayanan: string;
  jenis_pelayanan: string;
  kode_cabang: string;
  nomor_mr: string;
  tipe_pasien: string;
  pasien?: IPatient;
  wali?: IPatientGuardian;

  constructor(req: IBaseModel) {
    this.EMR_ID = req.EMR_ID;
    this.id_pelayanan = req.id_pelayanan;
    this.jenis_pelayanan = req.jenis_pelayanan;
    this.kode_cabang = req.kode_cabang;
    this.nomor_mr = req.nomor_mr;
    this.tipe_pasien = req.tipe_pasien;
    this.pasien = req.pasien;
    this.wali = req.wali;
  }
}
