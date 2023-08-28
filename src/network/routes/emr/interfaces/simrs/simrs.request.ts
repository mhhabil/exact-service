interface IUpdateToSimrs {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  content_type: string;
  body: any;
  realtime: string;
}

interface IUpdateTebusObatRanap {
  nomor_mr: string;
  id_pelayanan: string;
  no_berobat: string;
  kode_cabang: string;
  tipe_pasien: string;
  jenis_pelayanan: string;
  waktu_tebus: string;
  status_tebus: string;
  keterangan: string;
  daftar_obat: any;
}

class UpdateTebusObatRanap {
  nomor_mr: string;
  id_pelayanan: string;
  no_berobat: string;
  kode_cabang: string;
  tipe_pasien: string;
  jenis_pelayanan: string;
  waktu_tebus: string;
  status_tebus: string;
  keterangan: string;
  daftar_obat: any;

  constructor(req: IUpdateTebusObatRanap) {
    this.nomor_mr = req.nomor_mr;
    this.id_pelayanan = req.id_pelayanan;
    this.no_berobat = req.no_berobat;
    this.kode_cabang = req.kode_cabang;
    this.tipe_pasien = req.tipe_pasien;
    this.jenis_pelayanan = req.jenis_pelayanan;
    this.waktu_tebus = req.waktu_tebus;
    this.status_tebus = req.status_tebus;
    this.keterangan = req.keterangan;
    this.daftar_obat = req.daftar_obat;
  }
}

class UpdateToSimrs {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  content_type: string;
  body: any;
  realtime: string;

  constructor(request: IUpdateToSimrs) {
    this.url = request.url;
    this.method = request.method;
    this.content_type = request.content_type;
    this.body = request.body;
    this.realtime = request.realtime;
  }

  static createFromJson(json: IUpdateToSimrs) {
    return new UpdateToSimrs(json);
  }
}

export type { IUpdateToSimrs, IUpdateTebusObatRanap };
export { UpdateToSimrs, UpdateTebusObatRanap };
