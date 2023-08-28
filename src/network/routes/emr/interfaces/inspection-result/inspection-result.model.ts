import { isValidFile } from "../../helpers/app.helper";

export interface IPemeriksaanOCTRetinaModel {
  Nama: string;
  Od_Vitreoretinal: string;
  Od_Foveal: string;
  Od_Intraretinal: string;
  Od_Intraretinal_Text: string;
  Od_Rpe: string;
  Od_Choroid: string;
  Od_Central_Macular: string;
  Od_Lain_Lain: string;
  Os_Vitreoretinal: string;
  Os_Foveal: string;
  Os_Intraretinal: string;
  Os_Intraretinal_Text: string;
  Os_Rpe: string;
  Os_Choroid: string;
  Os_Central_Macular: string;
  Os_Lain_Lain: string;
  Dokter_Pemeriksa_Nama: string;
  Dokter_Pemeriksa_Id: string;
  TTD_Dokter_Pemeriksa: string;
  Perawat_Pemeriksa_Nama: string;
  Perawat_Pemeriksa_Id: string;
  TTD_Perawat_Pemeriksa: string;
  Kesimpulan_Opt: string;
  Kesimpulan: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  TTD_Tanggal: string;
  Updated_At: string;
  Updated_By: string;
}

export class PemeriksaanOCTRetinaModel {
  Nama: string;
  Od_Vitreoretinal: string;
  Od_Foveal: string;
  Od_Intraretinal: string;
  Od_Intraretinal_Text: string;
  Od_Rpe: string;
  Od_Choroid: string;
  Od_Central_Macular: string;
  Od_Lain_Lain: string;
  Os_Vitreoretinal: string;
  Os_Foveal: string;
  Os_Intraretinal: string;
  Os_Intraretinal_Text: string;
  Os_Rpe: string;
  Os_Choroid: string;
  Os_Central_Macular: string;
  Os_Lain_Lain: string;
  Dokter_Pemeriksa_Nama: string;
  Dokter_Pemeriksa_Id: string;
  TTD_Dokter_Pemeriksa: string;
  Perawat_Pemeriksa_Nama: string;
  Perawat_Pemeriksa_Id: string;
  TTD_Perawat_Pemeriksa: string;
  Kesimpulan_Opt: string;
  Kesimpulan: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  TTD_Tanggal: string;
  Updated_At: string;
  Updated_By: string;

  constructor(req: IPemeriksaanOCTRetinaModel) {
    this.Nama = req.Nama;
    this.Od_Vitreoretinal = req.Od_Vitreoretinal;
    this.Od_Foveal = req.Od_Foveal;
    this.Od_Intraretinal = req.Od_Intraretinal;
    this.Od_Intraretinal_Text = req.Od_Intraretinal_Text;
    this.Od_Rpe = req.Od_Rpe;
    this.Od_Choroid = req.Od_Choroid;
    this.Od_Central_Macular = req.Od_Central_Macular;
    this.Od_Lain_Lain = req.Od_Lain_Lain;
    this.Os_Vitreoretinal = req.Os_Vitreoretinal;
    this.Os_Foveal = req.Os_Foveal;
    this.Os_Intraretinal = req.Os_Intraretinal;
    this.Os_Intraretinal_Text = req.Os_Intraretinal_Text;
    this.Os_Rpe = req.Os_Rpe;
    this.Os_Choroid = req.Os_Choroid;
    this.Os_Central_Macular = req.Os_Central_Macular;
    this.Os_Lain_Lain = req.Os_Lain_Lain;
    this.Dokter_Pemeriksa_Nama = req.Dokter_Pemeriksa_Nama;
    this.Dokter_Pemeriksa_Id = req.Dokter_Pemeriksa_Id;
    this.TTD_Dokter_Pemeriksa = req.TTD_Dokter_Pemeriksa;
    this.Perawat_Pemeriksa_Nama = req.Perawat_Pemeriksa_Nama;
    this.Perawat_Pemeriksa_Id = req.Perawat_Pemeriksa_Id;
    this.TTD_Perawat_Pemeriksa = req.TTD_Perawat_Pemeriksa;
    this.Kesimpulan_Opt = req.Kesimpulan_Opt;
    this.Kesimpulan = req.Kesimpulan;
    this.ID_Petugas = req.ID_Petugas;
    this.Nama_Petugas = req.Nama_Petugas;
    this.TTD_Tanggal = req.TTD_Tanggal;
    this.Updated_At = req.Updated_At;
    this.Updated_By = req.Updated_By;
  }

  static createFromJson(val: any) {
    return {
      Nama: 'Pemeriksaan_Oct_Retina',
      Od_Vitreoretinal: val['od_vitreoretinal'] ? val['od_vitreoretinal'] : '',
      Od_Foveal: val['od_foveal'] ? val['od_foveal'] : '',
      Od_Intraretinal: val['od_intraretinal'] ? val['od_intraretinal'] : '',
      Od_Intraretinal_Text: val['od_intraretinal_text'] ? val['od_intraretinal_text'] : '',
      Od_Rpe: val['od_rpe'] ? val['od_rpe'] : '',
      Od_Choroid: val['od_choroid'] ? val['od_choroid'] : '',
      Od_Central_Macular: val['od_central_macular'] ? val['od_central_macular'] : '',
      Od_Lain_Lain: val['od_lain_lain'] ? val['od_lain_lain'] : '',
      Os_Vitreoretinal: val['os_vitreoretinal'] ? val['os_vitreoretinal'] : '',
      Os_Foveal: val['os_foveal'] ? val['os_foveal'] : '',
      Os_Intraretinal: val['os_intraretinal'] ? val['os_intraretinal'] : '',
      Os_Intraretinal_Text: val['os_intraretinal_text'] ? val['os_intraretinal_text'] : '',
      Os_Rpe: val['os_rpe'] ? val['os_rpe'] : '',
      Os_Choroid: val['os_choroid'] ? val['os_choroid'] : '',
      Os_Central_Macular: val['os_central_macular'] ? val['os_central_macular'] : '',
      Os_Lain_Lain: val['os_lain_lain'] ? val['os_lain_lain'] : '',
      Dokter_Pemeriksa_Id: val.dokter_pemeriksa ? val.dokter_pemeriksa : '',
      TTD_Dokter_Pemeriksa: val['ttd-dokter-pemeriksa'] && val['ttd-dokter-pemeriksa'] !== '' && isValidFile(val['ttd-dokter-pemeriksa']) ? global.storage.cleanUrl(val['ttd-dokter-pemeriksa']) : '',
      Perawat_Pemeriksa_Id: val.perawat_pemeriksa ? val.perawat_pemeriksa : '',
      TTD_Perawat_Pemeriksa: val['ttd-perawat-pemeriksa'] && val['ttd-perawat-pemeriksa'] !== '' && isValidFile(val['ttd-perawat-pemeriksa']) ? global.storage.cleanUrl(val['ttd-perawat-pemeriksa']) : '',
      Kesimpulan_Opt: val.kesimpulan_opt ?? '',
      Kesimpulan: val.kesimpulan ?? '',
      TTD_Tanggal: val['ttd-tanggal'] ?? '',
    }
  }
}

export interface IPemeriksaanOCTGlaukomaModel {
  Nama: string;
  Od_Rnfl: string;
  Od_Rnfl_Normal_Text: string;
  Od_Rnfl_Menipis_Text: string;
  Od_Rnfl_Menebal_Text: string;
  Od_Cd_Vertical: string;
  Od_Cd_Vertical_Normal_Text: string;
  Od_Cd_Vertical_Upnormal_Text: string;
  Os_Rnfl: string;
  Os_Rnfl_Normal_Text: string;
  Os_Rnfl_Menipis_Text: string;
  Os_Rnfl_Menebal_Text: string;
  Os_Cd_Vertical: string;
  Os_Cd_Vertical_Normal_Text: string;
  Os_Cd_Vertical_Upnormal_Text: string;
  Kesimpulan_Opt: string;
  Kesimpulan: string;
  Dokter_Pemeriksa_Nama: string;
  Dokter_Pemeriksa_Id: string;
  TTD_Dokter_Pemeriksa: string;
  TTD_Tanggal: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;
}

export class PemeriksaanOCTGlaukomaModel {
  Nama: string;
  Od_Rnfl: string;
  Od_Rnfl_Normal_Text: string;
  Od_Rnfl_Menipis_Text: string;
  Od_Rnfl_Menebal_Text: string;
  Od_Cd_Vertical: string;
  Od_Cd_Vertical_Normal_Text: string;
  Od_Cd_Vertical_Upnormal_Text: string;
  Os_Rnfl: string;
  Os_Rnfl_Normal_Text: string;
  Os_Rnfl_Menipis_Text: string;
  Os_Rnfl_Menebal_Text: string;
  Os_Cd_Vertical: string;
  Os_Cd_Vertical_Normal_Text: string;
  Os_Cd_Vertical_Upnormal_Text: string;
  Kesimpulan_Opt: string;
  Kesimpulan: string;
  Dokter_Pemeriksa_Nama: string;
  Dokter_Pemeriksa_Id: string;
  TTD_Dokter_Pemeriksa: string;
  TTD_Tanggal: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;

  constructor(req: IPemeriksaanOCTGlaukomaModel) {
    this.Nama = req.Nama;
    this.Od_Rnfl = req.Od_Rnfl;
    this.Od_Rnfl_Normal_Text = req.Od_Rnfl_Normal_Text;
    this.Od_Rnfl_Menipis_Text = req.Od_Rnfl_Menipis_Text;
    this.Od_Rnfl_Menebal_Text = req.Od_Rnfl_Menebal_Text;
    this.Od_Cd_Vertical = req.Od_Cd_Vertical;
    this.Od_Cd_Vertical_Normal_Text = req.Od_Cd_Vertical_Normal_Text;
    this.Od_Cd_Vertical_Upnormal_Text = req.Od_Cd_Vertical_Upnormal_Text;
    this.Os_Rnfl = req.Os_Rnfl;
    this.Os_Rnfl_Normal_Text = req.Os_Rnfl_Normal_Text;
    this.Os_Rnfl_Menipis_Text = req.Os_Rnfl_Menipis_Text;
    this.Os_Rnfl_Menebal_Text = req.Os_Rnfl_Menebal_Text;
    this.Os_Cd_Vertical = req.Os_Cd_Vertical;
    this.Os_Cd_Vertical_Normal_Text = req.Os_Cd_Vertical_Normal_Text;
    this.Os_Cd_Vertical_Upnormal_Text = req.Os_Cd_Vertical_Upnormal_Text;
    this.Kesimpulan_Opt = req.Kesimpulan_Opt;
    this.Kesimpulan = req.Kesimpulan;
    this.Dokter_Pemeriksa_Nama = req.Dokter_Pemeriksa_Nama;
    this.Dokter_Pemeriksa_Id = req.Dokter_Pemeriksa_Id;
    this.TTD_Dokter_Pemeriksa = req.TTD_Dokter_Pemeriksa;
    this.TTD_Tanggal = req.TTD_Tanggal;
    this.ID_Petugas = req.ID_Petugas;
    this.Nama_Petugas = req.Nama_Petugas;
    this.Updated_At = req.Updated_At;
    this.Updated_By = req.Updated_By;
  }

  static createFromJson(val: any) {
    return {
      Nama: 'Pemeriksaan_Oct_Glaukoma',
      Od_Rnfl: val.od_rnfl ? val.od_rnfl : '',
      Od_Rnfl_Normal_Text: val.od_rnfl_normal_text ? val.od_rnfl_normal_text : '',
      Od_Rnfl_Menipis_Text: val['od_rnfl_menipis_text'] ? val['od_rnfl_menipis_text'] : '',
      Od_Rnfl_Menebal_Text: val['od_rnfl_menebal_text'] ? val['od_rnfl_menebal_text'] : '',
      Od_Cd_Vertical: val['od_cd_vertical'] ? val['od_cd_vertical'] : '',
      Od_Cd_Vertical_Normal_Text: val['od_cd_vertical_normal_text'] ? val['od_cd_vertical_normal_text'] : '',
      Od_Cd_Vertical_Upnormal_Text: val['od_cd_vertical_upnormal_text'] ? val['od_cd_vertical_upnormal_text'] : '',
      Os_Rnfl: val['os_rnfl'] ? val['os_rnfl'] : '',
      Os_Rnfl_Normal_Text: val['os_rnfl_normal_text'] ? val['os_rnfl_normal_text'] : '',
      Os_Rnfl_Menipis_Text: val['os_rnfl_menipis_text'] ? val['os_rnfl_menipis_text'] : '',
      Os_Rnfl_Menebal_Text: val['os_rnfl_menebal_text'] ? val['os_rnfl_menebal_text'] : '',
      Os_Cd_Vertical: val['os_cd_vertical'] ? val['os_cd_vertical'] : '',
      Os_Cd_Vertical_Normal_Text: val['os_cd_vertical_normal_text'] ? val['os_cd_vertical_normal_text'] : '',
      Os_Cd_Vertical_Upnormal_Text: val['os_cd_vertical_upnormal_text'] ? val['os_cd_vertical_upnormal_text'] : '',
      Kesimpulan_Opt: val.kesimpulan_opt ?? '',
      Kesimpulan: val['kesimpulan'] ? val['kesimpulan'] : '',
      Dokter_Pemeriksa_Id: val.dokter_pemeriksa ? val.dokter_pemeriksa : '',
      Perawat_Pemeriksa_Id: val.perawat_pemeriksa ?? '',
      TTD_Perawat_Pemeriksa: val['ttd-perawat-pemeriksa'] && val['ttd-perawat-pemeriksa'] !== '' && isValidFile(val['ttd-perawat-pemeriksa']) ? global.storage.cleanUrl(val['ttd-perawat-pemeriksa']) : '',
      TTD_Tanggal: val['ttd-tanggal'] ?? '',
      TTD_Dokter_Pemeriksa: val['ttd-dokter-pemeriksa'] && val['ttd-dokter-pemeriksa'] !== '' && isValidFile(val['ttd-dokter-pemeriksa']) ? global.storage.cleanUrl(val['ttd-dokter-pemeriksa']) : '',
    }
  }
}

export interface IPemeriksaanLapangPandangModel {
  Nama: string;
  Od_Parameter: string;
  Od_Reliabilitas: string;
  Od_Defek: string;
  Od_Tendensi_Defek: string;
  Od_Severitas_Defek: string;
  Os_Parameter: string;
  Os_Reliabilitas: string;
  Os_Defek: string;
  Os_Tendensi_Defek: string;
  Os_Severitas_Defek: string;
  Kesimpulan: string;
  Anjuran: string;
  Pemeriksaan_Rutin: string;
  Dokter_Pemeriksa_Nama: string;
  Dokter_Pemeriksa_Id: string;
  TTD_Dokter_Pemeriksa: string;
  TTD_Tanggal: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;
}

export class PemeriksaanLapangPandangModel {
  Nama: string;
  Od_Parameter: string;
  Od_Reliabilitas: string;
  Od_Defek: string;
  Od_Tendensi_Defek: string;
  Od_Severitas_Defek: string;
  Os_Parameter: string;
  Os_Reliabilitas: string;
  Os_Defek: string;
  Os_Tendensi_Defek: string;
  Os_Severitas_Defek: string;
  Kesimpulan: string;
  Anjuran: string;
  Pemeriksaan_Rutin: string;
  Dokter_Pemeriksa_Nama: string;
  Dokter_Pemeriksa_Id: string;
  TTD_Tanggal: string;
  TTD_Dokter_Pemeriksa: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;

  constructor(req: IPemeriksaanLapangPandangModel) {
    this.Nama = req.Nama;
    this.Od_Parameter = req.Od_Parameter;
    this.Od_Defek = req.Od_Defek;
    this.Od_Reliabilitas = req.Od_Reliabilitas;
    this.Od_Tendensi_Defek = req.Od_Tendensi_Defek;
    this.Od_Severitas_Defek = req.Od_Severitas_Defek;
    this.Os_Parameter = req.Os_Parameter;
    this.Os_Defek = req.Os_Defek;
    this.Os_Reliabilitas = req.Os_Reliabilitas;
    this.Os_Tendensi_Defek = req.Os_Tendensi_Defek;
    this.Os_Severitas_Defek = req.Os_Severitas_Defek;
    this.Kesimpulan = req.Kesimpulan;
    this.Anjuran = req.Anjuran;
    this.Pemeriksaan_Rutin = req.Pemeriksaan_Rutin;
    this.Dokter_Pemeriksa_Nama = req.Dokter_Pemeriksa_Nama;
    this.Dokter_Pemeriksa_Id = req.Dokter_Pemeriksa_Id;
    this.TTD_Tanggal = req.TTD_Tanggal;
    this.TTD_Dokter_Pemeriksa = req.TTD_Dokter_Pemeriksa;
    this.ID_Petugas = req.ID_Petugas;
    this.Nama_Petugas = req.Nama_Petugas;
    this.Updated_At = req.Updated_At;
    this.Updated_By = req.Updated_By;
  }

  static createFromJson(val: any) {
    return {
      Nama: 'Pemeriksaan_Lapangan_Pandang',
      Od_Parameter: val['od_parameter'] ? val['od_parameter'] : '',
      Od_Reliabilitas: val['od_reliabilitas'] ?? '',
      Od_Defek: val['od_defek'] ?? '',
      Od_Tendensi_Defek: val['od_tendensi_defek'] ?? '',
      Od_Severitas_Defek: val['od_severitas_defek'] ?? '',
      Os_Parameter: val['os_parameter'] ?? '',
      Os_Reliabilitas: val['os_reliabilitas'] ?? '',
      Os_Defek: val['os_defek'] ?? '',
      Os_Tendensi_Defek: val['os_tendensi_defek'] ?? '',
      Os_Severitas_Defek: val['os_severitas_defek'] ?? '',
      Kesimpulan: val['kesimpulan'] ?? '',
      Anjuran: val['anjuran'] ?? '',
      Pemeriksaan_Rutin: val['pemeriksaan_rutin'] ?? '',
      Dokter_Pemeriksa_Id: val['dokter_pemeriksa'] ?? '',
      TTD_Tanggal: val['ttd-tanggal'] ?? '',
      TTD_Dokter_Pemeriksa: val['ttd-dokter-pemeriksa'] && val['ttd-dokter-pemeriksa'] !== '' && isValidFile(val['ttd-dokter-pemeriksa']) ? global.storage.cleanUrl(val['ttd-dokter-pemeriksa']) : '',
      Perawat_Pemeriksa_Id: val.perawat_pemeriksa ?? '',
      TTD_Perawat_Pemeriksa: val['ttd-perawat-pemeriksa'] && val['ttd-perawat-pemeriksa'] !== '' && isValidFile(val['ttd-perawat-pemeriksa']) ? global.storage.cleanUrl(val['ttd-perawat-pemeriksa']) : '',
    }
  }
}

export interface IPemeriksaanFotoFundusModel {
  Nama: string;
  Od_Batas: string;
  Od_Warna: string;
  Od_Cupping: string;
  Od_Retina: string;
  Od_Break: string;
  Od_Pendarahan: string;
  Od_Av_Crossing: string;
  Od_Tortovsity: string;
  Od_Obstruksi: string;
  Od_Vitreous: string;
  Od_Vitreous_Pendarahan: string;
  Od_Pvd: string;
  Os_Batas: string;
  Os_Warna: string;
  Os_Cupping: string;
  Os_Retina: string;
  Os_Break: string;
  Os_Pendarahan: string;
  Os_Av_Crossing: string;
  Os_Tortovsity: string;
  Os_Obstruksi: string;
  Os_Vitreous: string;
  Os_Vitreous_Pendarahan: string;
  Os_Pvd: string;
  Kesimpulan_Opt: string;
  Kesimpulan: string;
  Dokter_Pemeriksa_Nama: string;
  Dokter_Pemeriksa_Id: string;
  TTD_Dokter_Pemeriksa: string;
  Perawat_Pemeriksa_Nama: string;
  Perawat_Pemeriksa_Id: string;
  TTD_Perawat_Pemeriksa: string;
  TTD_Tanggal: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;
}

export class PemeriksaanFotoFundusModel {
  Nama: string;
  Od_Batas: string;
  Od_Warna: string;
  Od_Cupping: string;
  Od_Retina: string;
  Od_Break: string;
  Od_Pendarahan: string;
  Od_Av_Crossing: string;
  Od_Tortovsity: string;
  Od_Obstruksi: string;
  Od_Vitreous: string;
  Od_Vitreous_Pendarahan: string;
  Od_Pvd: string;
  Os_Batas: string;
  Os_Warna: string;
  Os_Cupping: string;
  Os_Retina: string;
  Os_Break: string;
  Os_Pendarahan: string;
  Os_Av_Crossing: string;
  Os_Tortovsity: string;
  Os_Obstruksi: string;
  Os_Vitreous: string;
  Os_Vitreous_Pendarahan: string;
  Os_Pvd: string;
  Kesimpulan_Opt: string;
  Kesimpulan: string;
  Dokter_Pemeriksa_Nama: string;
  Dokter_Pemeriksa_Id: string;
  TTD_Dokter_Pemeriksa: string;
  Perawat_Pemeriksa_Nama: string;
  Perawat_Pemeriksa_Id: string;
  TTD_Perawat_Pemeriksa: string;
  TTD_Tanggal: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;

  constructor(req: IPemeriksaanFotoFundusModel) {
    this.Nama = req.Nama;
    this.Od_Batas = req.Od_Batas;
    this.Od_Warna = req.Od_Warna;
    this.Od_Cupping = req.Od_Cupping;
    this.Od_Retina = req.Od_Retina;
    this.Od_Break = req.Od_Break;
    this.Od_Pendarahan = req.Od_Pendarahan;
    this.Od_Av_Crossing = req.Od_Av_Crossing;
    this.Od_Tortovsity = req.Od_Tortovsity;
    this.Od_Obstruksi = req.Od_Obstruksi;
    this.Od_Vitreous = req.Od_Vitreous;
    this.Od_Vitreous_Pendarahan = req.Od_Vitreous_Pendarahan;
    this.Od_Pvd = req.Od_Pvd;
    this.Os_Batas = req.Os_Batas;
    this.Os_Warna = req.Os_Warna;
    this.Os_Cupping = req.Os_Cupping;
    this.Os_Retina = req.Os_Retina;
    this.Os_Break = req.Os_Break;
    this.Os_Pendarahan = req.Os_Pendarahan;
    this.Os_Av_Crossing = req.Os_Av_Crossing;
    this.Os_Tortovsity = req.Os_Tortovsity;
    this.Os_Obstruksi = req.Os_Obstruksi;
    this.Os_Vitreous = req.Os_Vitreous;
    this.Os_Vitreous_Pendarahan = req.Os_Vitreous_Pendarahan;
    this.Os_Pvd = req.Os_Pvd;
    this.Dokter_Pemeriksa_Nama = req.Dokter_Pemeriksa_Nama;
    this.Dokter_Pemeriksa_Id = req.Dokter_Pemeriksa_Id;
    this.TTD_Dokter_Pemeriksa = req.TTD_Dokter_Pemeriksa;
    this.Perawat_Pemeriksa_Nama = req.Perawat_Pemeriksa_Nama;
    this.Perawat_Pemeriksa_Id = req.Perawat_Pemeriksa_Id;
    this.TTD_Perawat_Pemeriksa = req.TTD_Perawat_Pemeriksa;
    this.Kesimpulan_Opt = req.Kesimpulan_Opt;
    this.Kesimpulan = req.Kesimpulan;
    this.ID_Petugas = req.ID_Petugas;
    this.TTD_Tanggal = req.TTD_Tanggal;
    this.Nama_Petugas = req.Nama_Petugas;
    this.Updated_At = req.Updated_At;
    this.Updated_By = req.Updated_By;
  }

  static createFromJson(val: any) {
    return {
      Nama: 'Pemeriksaan_Foto_Fundus',
      Od_Batas: val['od_batas'] ?? '',
      Od_Warna: val['od_warna'] ?? '',
      Od_Cupping: val['od_cupping'] ?? '',
      Od_Retina: val['od_retina'] ?? '',
      Od_Break: val['od_break'] ?? '',
      Od_Pendarahan: val['od_pendarahan'] ?? '',
      Od_Av_Crossing: val['od_av_crossing'] ?? '',
      Od_Tortovsity: val['od_tortovsity'] ?? '',
      Od_Obstruksi: val['od_obstruksi'] ?? '',
      Od_Vitreous: val['od_vitreous'] ?? '',
      Od_Vitreous_Pendarahan: val['od_vitreous_pendarahan'] ?? '',
      Od_Pvd: val['od_pvd'] ?? '',
      Os_Batas: val['os_batas'] ?? '',
      Os_Warna: val['os_warna'] ?? '',
      Os_Cupping: val['os_cupping'] ?? '',
      Os_Retina: val['os_retina'] ?? '',
      Os_Break: val['os_break'] ?? '',
      Os_Pendarahan: val['os_pendarahan'] ?? '',
      Os_Av_Crossing: val['os_av_crossing'] ?? '',
      Os_Tortovsity: val['os_tortovsity'] ?? '',
      Os_Obstruksi: val['os_obstruksi'] ?? '',
      Os_Vitreous: val['os_vitreous'] ?? '',
      Os_Vitreous_Pendarahan: val['os_vitreous_pendarahan'] ?? '',
      Os_Pvd: val['os_pvd'] ?? '',
      Kesimpulan_Opt: val.kesimpulan_opt ?? '',
      Kesimpulan: val['kesimpulan'] ?? '',
      Dokter_Pemeriksa_Id: val.dokter_pemeriksa ? val.dokter_pemeriksa : '',
      TTD_Tanggal: val['ttd-tanggal'] ?? '',
      TTD_Dokter_Pemeriksa: val['ttd-dokter-pemeriksa'] && val['ttd-dokter-pemeriksa'] !== '' && isValidFile(val['ttd-dokter-pemeriksa']) ? global.storage.cleanUrl(val['ttd-dokter-pemeriksa']) : '',
      Perawat_Pemeriksa_Id: val.perawat_pemeriksa ? val.perawat_pemeriksa : '',
      TTD_Perawat_Pemeriksa: val['ttd-perawat-pemeriksa'] && val['ttd-perawat-pemeriksa'] !== '' && isValidFile(val['ttd-perawat-pemeriksa']) ? global.storage.cleanUrl(val['ttd-perawat-pemeriksa']) : '',
    }
  }
}

export interface IPemeriksaanUSGModel {
  Nama: string;
  Od_Gain: string;
  Od_Axl: string;
  Od_Struktur_Bola_Mata: string;
  Od_Bentuk_Kelainan: string;
  Od_Lokasi: string;
  Od_Perlekatan: string;
  Od_After_Movement: string;
  Od_Spike: string;
  Od_Lain_Lain: string;
  Os_Gain: string;
  Os_Axl: string;
  Os_Struktur_Bola_Mata: string;
  Os_Bentuk_Kelainan: string;
  Os_Lokasi: string;
  Os_Perlekatan: string;
  Os_After_Movement: string;
  Os_Spike: string;
  Os_Lain_Lain: string;
  Kesimpulan_Opt: string;
  Kesimpulan: string;
  Dokter_Pemeriksa_Nama: string;
  Dokter_Pemeriksa_Id: string;
  TTD_Dokter_Pemeriksa: string;
  Perawat_Rawat_Inap_Nama: string;
  Perawat_Rawat_Inap_Id: string;
  TTD_Perawat_Rawat_Inap: string;
  ID_Petugas: string;
  TTD_Tanggal: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;
}

export class PemeriksaanUSGModel {
  Nama: string;
  Od_Gain: string;
  Od_Axl: string;
  Od_Struktur_Bola_Mata: string;
  Od_Bentuk_Kelainan: string;
  Od_Lokasi: string;
  Od_Perlekatan: string;
  Od_After_Movement: string;
  Od_Spike: string;
  Od_Lain_Lain: string;
  Os_Gain: string;
  Os_Axl: string;
  Os_Struktur_Bola_Mata: string;
  Os_Bentuk_Kelainan: string;
  Os_Lokasi: string;
  Os_Perlekatan: string;
  Os_After_Movement: string;
  Os_Spike: string;
  Os_Lain_Lain: string;
  Kesimpulan_Opt: string;
  Kesimpulan: string;
  Dokter_Pemeriksa_Nama: string;
  Dokter_Pemeriksa_Id: string;
  TTD_Dokter_Pemeriksa: string;
  Perawat_Rawat_Inap_Nama: string;
  Perawat_Rawat_Inap_Id: string;
  TTD_Perawat_Rawat_Inap: string;
  TTD_Tanggal: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;

  constructor(req: IPemeriksaanUSGModel) {
    this.Nama = req.Nama;
    this.Od_Gain = req.Od_Gain;
    this.Od_Axl = req.Od_Axl;
    this.Od_Struktur_Bola_Mata = req.Od_Struktur_Bola_Mata;
    this.Od_Bentuk_Kelainan = req.Od_Bentuk_Kelainan;
    this.Od_Lokasi = req.Od_Lokasi;
    this.Od_Perlekatan = req.Od_Perlekatan;
    this.Od_After_Movement = req.Od_After_Movement;
    this.Od_Spike = req.Od_Spike;
    this.Od_Lain_Lain = req.Od_Lain_Lain;
    this.Os_Gain = req.Os_Gain;
    this.Os_Axl = req.Os_Axl;
    this.Os_Struktur_Bola_Mata = req.Os_Struktur_Bola_Mata;
    this.Os_Bentuk_Kelainan = req.Os_Bentuk_Kelainan;
    this.Os_Lokasi = req.Os_Lokasi;
    this.Os_Perlekatan = req.Os_Perlekatan;
    this.Os_After_Movement = req.Os_After_Movement;
    this.Os_Spike = req.Os_Spike;
    this.Os_Lain_Lain = req.Os_Lain_Lain;
    this.Kesimpulan_Opt = req.Kesimpulan_Opt;
    this.Kesimpulan = req.Kesimpulan;
    this.Dokter_Pemeriksa_Nama = req.Dokter_Pemeriksa_Nama;
    this.Dokter_Pemeriksa_Id = req.Dokter_Pemeriksa_Id;
    this.TTD_Dokter_Pemeriksa = req.TTD_Dokter_Pemeriksa;
    this.Perawat_Rawat_Inap_Nama = req.Perawat_Rawat_Inap_Nama;
    this.Perawat_Rawat_Inap_Id = req.Perawat_Rawat_Inap_Id;
    this.TTD_Perawat_Rawat_Inap = req.TTD_Perawat_Rawat_Inap;
    this.TTD_Tanggal = req.TTD_Tanggal;
    this.ID_Petugas = req.ID_Petugas;
    this.Nama_Petugas = req.Nama_Petugas;
    this.Updated_At = req.Updated_At;
    this.Updated_By = req.Updated_By;
  }

  static createFromJson(val: any) {
    return {
      Nama: 'Pemeriksaan_Usg',
      Od_Gain: val['od_gain'] ?? '',
      Od_Axl: val['od_axl'] ?? '',
      Od_Struktur_Bola_Mata: val['od_struktur_bola_mata'] ?? '',
      Od_Bentuk_Kelainan: val['od_bentuk_kelainan'] ?? '',
      Od_Lokasi: val['od_lokasi'] ?? '',
      Od_Perlekatan: val['od_perlekatan'] ?? '',
      Od_After_Movement: val['od_after_movement'] ?? '',
      Od_Spike: val['od_spike'] ?? '',
      Od_Lain_Lain: val['od_lain_lain'] ?? '',
      Os_Gain: val['os_gain'] ?? '',
      Os_Axl: val['os_axl'] ?? '',
      Os_Struktur_Bola_Mata: val['os_struktur_bola_mata'] ?? '',
      Os_Bentuk_Kelainan: val['os_bentuk_kelainan'] ?? '',
      Os_Lokasi: val['os_lokasi'] ?? '',
      Os_Perlekatan: val['os_perlekatan'] ?? '',
      Os_After_Movement: val['os_after_movement'] ?? '',
      Os_Spike: val['os_spike'] ?? '',
      Os_Lain_Lain: val['os_lain_lain'] ?? '',
      Kesimpulan_Opt: val.kesimpulan_opt ?? '',
      Kesimpulan: val['kesimpulan'] ?? '',
      TTD_Tanggal: val['ttd-tanggal'] ?? '',
      Dokter_Pemeriksa_Id: val.dokter_pemeriksa ? val.dokter_pemeriksa : '',
      TTD_Dokter_Pemeriksa: val['ttd-dokter-pemeriksa'] && val['ttd-dokter-pemeriksa'] !== '' && isValidFile(val['ttd-dokter-pemeriksa']) ? global.storage.cleanUrl(val['ttd-dokter-pemeriksa']) : '',
      Perawat_Pemeriksa_Id: val.perawat_pemeriksa ?? '',
      TTD_Perawat_Pemeriksa: val['ttd-perawat-pemeriksa'] && val['ttd-perawat-pemeriksa'] !== '' && isValidFile(val['ttd-perawat-pemeriksa']) ? global.storage.cleanUrl(val['ttd-perawat-pemeriksa']) : '',
    }
  }
}

export interface IMata {
  Kanan: number;
  Kiri: number;
}

export interface IMataPasienDitetes {
  Pantocain: number;
  Mydriatil: number;
}

export interface IPasienDitetes {
  Lfx: number;
  Floxa: number;
  Noncort_Eye_Drop: number;
  Timol: number;
  Tonor: number;
}

export interface ITindakanYAGLaser {
  Nama: string;
  Dokter_Nama: string;
  Dokter_Id: string;
  Tanggal_Tindakan: string;
  Lama_Tindakan: string;
  Mata: IMata;
  Mata_Pasien_Ditetes: IMataPasienDitetes;
  Pasien_Ditetes: IPasienDitetes;
  Gambar_Mata_OD: string;
  Gambar_Mata_OS: string;
  Tanggal_Fakoemulsifikasi: string;
  Power_Laser: string;
  Jumlah_Laser: string;
  Lain_Lain: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;
}

export class TindakanYAGLaser {
  Nama: string;
  Dokter_Nama: string;
  Dokter_Id: string;
  Tanggal_Tindakan: string;
  Lama_Tindakan: string;
  Mata: IMata;
  Mata_Pasien_Ditetes: IMataPasienDitetes;
  Pasien_Ditetes: IPasienDitetes;
  Gambar_Mata_OD: string;
  Gambar_Mata_OS: string;
  Tanggal_Fakoemulsifikasi: string;
  Power_Laser: string;
  Jumlah_Laser: string;
  Lain_Lain: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;

  constructor(req: ITindakanYAGLaser) {
    this.Nama = req.Nama;
    this.Dokter_Nama = req.Dokter_Nama;
    this.Dokter_Id = req.Dokter_Id;
    this.Tanggal_Tindakan = req.Tanggal_Tindakan;
    this.Lama_Tindakan = req.Lama_Tindakan;
    this.Mata = req.Mata;
    this.Mata_Pasien_Ditetes = req.Mata_Pasien_Ditetes;
    this.Pasien_Ditetes = req.Pasien_Ditetes;
    this.Gambar_Mata_OD = req.Gambar_Mata_OD;
    this.Gambar_Mata_OS = req.Gambar_Mata_OS;
    this.Tanggal_Fakoemulsifikasi = req.Tanggal_Fakoemulsifikasi;
    this.Power_Laser = req.Power_Laser;
    this.Jumlah_Laser = req.Jumlah_Laser;
    this.Lain_Lain = req.Lain_Lain;
    this.ID_Petugas = req.ID_Petugas;
    this.Nama_Petugas = req.Nama_Petugas;
    this.Updated_At = req.Updated_At;
    this.Updated_By = req.Updated_By;
  }

  static createFromJson(val: any) {
    const dataMata = {
      1: (val.mata && val.mata.includes('1')) ? 1 : 0,
      2: (val.mata && val.mata.includes('2')) ? 1 : 0,
    }

    const mataDitetes = {
      1: (val.mata_pasien_laser_ditetes && val.mata_pasien_laser_ditetes.includes('1')) ? 1 : 0,
      2: (val.mata_pasien_laser_ditetes && val.mata_pasien_laser_ditetes.includes('2')) ? 1 : 0,
    }

    const pasienDitetes = {
      1: (val.pasien_ditetes && val.pasien_ditetes.includes('1')) ? 1 : 0,
      2: (val.pasien_ditetes && val.pasien_ditetes.includes('2')) ? 1 : 0,
      3: (val.pasien_ditetes && val.pasien_ditetes.includes('3')) ? 1 : 0,
      4: (val.pasien_ditetes && val.pasien_ditetes.includes('4')) ? 1 : 0,
      5: (val.pasien_ditetes && val.pasien_ditetes.includes('5')) ? 1 : 0,
    }
    return {
      Nama: 'Tindakan_Yag_Laser',
      Dokter_Id: val.dokter ?? '',
      Tanggal_Tindakan: val.tanggal_tindakan ?? '',
      Lama_Tindakan: val.lama_tindakan ?? '',
      Diagnosa_Pra_Tindakan: val.diagnosa_pra_tindakan ?? '',
      Mata: {
        Kanan: dataMata[1],
        Kiri: dataMata[2],
      },
      Mata_Pasien_Ditetes: {
        Pantocain: mataDitetes[1],
        Mydriatil: mataDitetes[2],
      },
      Pasien_Ditetes: {
        Lfx: pasienDitetes[1],
        Floxa: pasienDitetes[2],
        Noncort_Eye_Drop: pasienDitetes[3],
        Timol: pasienDitetes[4],
        Tonor: pasienDitetes[5],
      },
      Gambar_Mata_OD: val['gambar-mata-od'] && val['gambar-mata-od'] !== '' && isValidFile(val['gambar-mata-od']) ? global.storage.cleanUrl(val['gambar-mata-od']) : '',
      Gambar_Mata_OS: val['gambar-mata-os'] && val['gambar-mata-os'] !== '' && isValidFile(val['gambar-mata-os']) ? global.storage.cleanUrl(val['gambar-mata-os']) : '',
      Tanggal_Fakoemulsifikasi: val.tanggal_fakoemulsifikasi ?? '',
      Power_Laser: val.power_laser ?? '',
      Jumlah_Laser: val.jumlah_laser ?? '',
      Lain_Lain: val.lain_lain ?? '',
      TTD_Dokter_Operator: val['ttd-dokter-operator'] && val['ttd-dokter-operator'] !== '' && isValidFile(val['ttd-dokter-operator']) ? global.storage.cleanUrl(val['ttd-dokter-operator']) : '',
      Dokter_Operator_Id: val.dokter_operator ?? '',
      TTD_Perawat_Rawat_Jalan: val['ttd-perawat-rawat-jalan'] && val['ttd-perawat-rawat-jalan'] !== '' && isValidFile(val['ttd-perawat-rawat-jalan']) ? global.storage.cleanUrl(val['ttd-perawat-rawat-jalan']) : '',
      Perawat_Rawat_Jalan_Id: val.perawat_rawat_jalan ?? '',
      Keterangan: val.keterangan ?? '',
    }
  }
}

export interface ILaser {
  Laser: number;
  Laser_1: number;
  Laser_2: number;
  Laser_3: number;
  Grid: number;
  Focal: number;
  Barrage: number;
  Lattice: number;
}

export interface ITindakanLaserRetina {
  Nama: string;
  Jenis_Id: string;
  Obat_Id: string;
  Informasi: string;
  Mata: IMata;
  Mata_Pasien_Ditetes: IMataPasienDitetes;
  Tindakan_Laser: ILaser;
  Spot_Size: string;
  Durasi: string;
  Power: string;
  Jumlah_Tembakan: string;
  Komplikasi: string;
  Diagnosa_Tindakan: string;
  Noncort_Eye_Drop: string;
  Gambar_Retina_OD: string;
  Gambar_Retina_OS: string;
  Dokter_Operator_Nama: string;
  Dokter_Operator_Id: string;
  TTD_Dokter_Operator: string;
  Nama_TTD_Dokter_Operator: string;
  TTD_Perawat_Rawat_Jalan: string;
  Perawat_Rawat_Jalan_Id: string;
  Nama_TTD_Perawat_Rawat_Jalan: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  TTD_Tanggal: string;
  Updated_At: string;
  Updated_By: string;
}

export class TindakanLaserRetina {
  Nama: string;
  Jenis_Id: string;
  Obat_Id: string;
  Informasi: string;
  Mata: IMata;
  Mata_Pasien_Ditetes: IMataPasienDitetes;
  Tindakan_Laser: ILaser;
  Spot_Size: string;
  Durasi: string;
  Power: string;
  Jumlah_Tembakan: string;
  Komplikasi: string;
  Diagnosa_Tindakan: string;
  Noncort_Eye_Drop: string;
  Gambar_Retina_OD: string;
  Gambar_Retina_OS: string;
  Dokter_Operator_Nama: string;
  Dokter_Operator_Id: string;
  TTD_Dokter_Operator: string;
  Nama_TTD_Dokter_Operator: string;
  TTD_Perawat_Rawat_Jalan: string;
  Perawat_Rawat_Jalan_Id: string;
  Nama_TTD_Perawat_Rawat_Jalan: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  TTD_Tanggal: string;
  Updated_At: string;
  Updated_By: string;

  constructor(req: ITindakanLaserRetina) {
    this.Nama = req.Nama;
    this.Jenis_Id = req.Jenis_Id;
    this.Obat_Id = req.Obat_Id;
    this.Informasi = req.Informasi;
    this.Mata = req.Mata;
    this.Mata_Pasien_Ditetes = req.Mata_Pasien_Ditetes;
    this.Tindakan_Laser = req.Tindakan_Laser;
    this.Spot_Size = req.Spot_Size;
    this.Durasi = req.Durasi;
    this.Power = req.Power;
    this.Jumlah_Tembakan = req.Jumlah_Tembakan;
    this.Komplikasi = req.Komplikasi;
    this.Diagnosa_Tindakan = req.Diagnosa_Tindakan;
    this.Noncort_Eye_Drop = req.Noncort_Eye_Drop;
    this.Gambar_Retina_OD = req.Gambar_Retina_OD;
    this.Gambar_Retina_OS = req.Gambar_Retina_OS;
    this.Dokter_Operator_Nama = req.Dokter_Operator_Nama;
    this.Dokter_Operator_Id = req.Dokter_Operator_Id;
    this.TTD_Dokter_Operator = req.TTD_Dokter_Operator;
    this.Nama_TTD_Dokter_Operator = req.Nama_TTD_Dokter_Operator;
    this.TTD_Perawat_Rawat_Jalan = req.TTD_Perawat_Rawat_Jalan;
    this.Perawat_Rawat_Jalan_Id = req.Perawat_Rawat_Jalan_Id;
    this.Nama_TTD_Perawat_Rawat_Jalan = req.Nama_TTD_Perawat_Rawat_Jalan;
    this.ID_Petugas = req.ID_Petugas;
    this.Nama_Petugas = req.Nama_Petugas;
    this.TTD_Tanggal = req.TTD_Tanggal;
    this.Updated_At = req.Updated_At;
    this.Updated_By = req.Updated_By;
  }

  static createFromJson(val: any) {
    const dataMata = {
      1: (val.mata && val.mata.includes('1')) ? 1 : 0,
      2: (val.mata && val.mata.includes('2')) ? 1 : 0,
    }

    const mataDitetes = {
      1: (val.mata_pasien_ditetes && val.mata_pasien_ditetes.includes('1')) ? 1 : 0,
      2: (val.mata_pasien_ditetes && val.mata_pasien_ditetes.includes('2')) ? 1 : 0,
    }

    const laser = {
      1: (val.tindakan_laser && val.tindakan_laser.includes('1')) ? 1 : 0,
      2: (val.tindakan_laser && val.tindakan_laser.includes('2')) ? 1 : 0,
      3: (val.tindakan_laser && val.tindakan_laser.includes('3')) ? 1 : 0,
      4: (val.tindakan_laser && val.tindakan_laser.includes('4')) ? 1 : 0,
      5: (val.tindakan_laser && val.tindakan_laser.includes('5')) ? 1 : 0,
      6: (val.tindakan_laser && val.tindakan_laser.includes('6')) ? 1 : 0,
      7: (val.tindakan_laser && val.tindakan_laser.includes('7')) ? 1 : 0,
      8: (val.tindakan_laser && val.tindakan_laser.includes('8')) ? 1 : 0,
    }
    return {
      Nama: 'Tindakan_Laser_Retina',
      Jenis_Id: val.jenis ?? '',
      Obat_Id: val.obat ?? '',
      Informasi: val.informasi ?? '',
      Mata: {
        Kanan: dataMata[1],
        Kiri: dataMata[2],
      },
      Mata_Pasien_Ditetes: {
        Pantocain: mataDitetes[1],
        Mydriatil: mataDitetes[2],
      },
      Tindakan_Laser: {
        Laser: laser[1],
        Laser_1: laser[2],
        Laser_2: laser[3],
        Laser_3: laser[4],
        Grid: laser[5],
        Focal: laser[6],
        Barrage: laser[7],
        Lattice: laser[8],
      },
      Spot_Size: val.spot_size ?? '',
      Durasi: val.durasi ?? '',
      Power: val.power ?? '',
      Jumlah_Tembakan: val.jumlah_tembakan ?? '',
      Komplikasi: val.komplikasi ?? '',
      Diagnosa_Tindakan: val.diagnosa_tindakan ?? '',
      Noncort_Eye_Drop: val.noncort_eye_drop ?? '',
      Gambar_Retina_OD: val['gambar-retina-od'] && val['gambar-retina-od'] !== '' && isValidFile(val['gambar-retina-od']) ? global.storage.cleanUrl(val['gambar-retina-od']) : '',
      Gambar_Retina_OS: val['gambar-retina-os'] && val['gambar-retina-os'] !== '' && isValidFile(val['gambar-retina-os']) ? global.storage.cleanUrl(val['gambar-retina-os']) : '',
      Dokter_Operator_Id: val.dokter_operator ?? '',
      TTD_Dokter_Operator: val['ttd-dokter-operator'] && val['ttd-dokter-operator'] !== '' && isValidFile(val['ttd-dokter-operator']) ? global.storage.cleanUrl(val['ttd-dokter-operator']) : '',
      TTD_Perawat_Rawat_Jalan: val['ttd-perawat-rawat-jalan'] && val['ttd-perawat-rawat-jalan'] !== '' && isValidFile(val['ttd-perawat-rawat-jalan']) ? global.storage.cleanUrl(val['ttd-perawat-rawat-jalan']) : '',
      Perawat_Rawat_Jalan_Id: val.perawat_rawat_jalan ?? '',
      TTD_Tanggal: val['ttd-tanggal'] ?? '',
    }
  }
}

export interface IPemeriksaanOCTCornea {
  Nama: string;
  Tanggal: string;
  Kornea: string;
  Ketebalan: string;
  OD_Epitel_Detach_Check: string;
  OD_Erosi_Check: string;
  OD_Irregular_Epitel_Check: string;
  OD_Epitel_Thinning_Check: string;
  OD_Epitel_Downgrowth_Check: string;
  OD_Epitel_Lainnya_Check: string;
  OS_Epitel_Detach_Check: string;
  OS_Erosi_Check: string;
  OS_Irregular_Epitel_Check: string;
  OS_Epitel_Thinning_Check: string;
  OS_Epitel_Downgrowth_Check: string;
  OS_Epitel_Lainnya_Check: string;
  OD_Irreguler_Stroma_Check: string;
  OD_Stromal_Thinning_Check: string;
  OD_Stromal_Melting_Check: string;
  OD_Stromal_Lainnya_Check: string;
  OS_Irreguler_Stroma_Check: string;
  OS_Stromal_Thinning_Check: string;
  OS_Stromal_Melting_Check: string;
  OS_Stromal_Lainnya_Check: string;
  OD_Irreguler_Endotel_Check: string;
  OD_Endotelial_Detachment_Check: string;
  OD_Endotel_Lainnya_Check: string;
  OS_Irreguler_Endotel_Check: string;
  OS_Endotelial_Detachment_Check: string;
  OS_Endotel_Lainnya_Check: string;
  OD_Anterior_Chamber_Check: string;
  OD_Anterior_Chamber_Depth: string;
  OD_BMD_Mass_Check: string;
  OD_BMD_Particle_Check: string;
  OD_BMD_Lainnya_Check: string;
  OS_Anterior_Chamber_Check: string;
  OS_Anterior_Chamber_Depth: string;
  OS_BMD_Mass_Check: string;
  OS_BMD_Particle_Check: string;
  OS_BMD_Lainnya_Check: string;
  OD_Scleral_Spur_Check: string;
  OD_Scleral_Spur_Angle: string;
  OD_Sudut_Dangkal_Check: string;
  OD_Sudut_Dalam_Check: string;
  OS_Scleral_Spur_Check: string;
  OS_Scleral_Spur_Angle: string;
  OS_Sudut_Dangkal_Check: string;
  OS_Sudut_Dalam_Check: string;
  OD_Blok_Pupil_Check: string;
  OD_Plateau_Check: string;
  OD_Tumor_Kista_Check: string;
  OS_Blok_Pupil_Check: string;
  OS_Plateau_Check: string;
  OS_Tumor_Kista_Check: string;
  OD_Lens_Vault_Check: string;
  OD_Lens_Vault: string;
  OD_Lens_Thickness_Check: string;
  OD_Lens_Thickness: string;
  OS_Lens_Vault_Check: string;
  OS_Lens_Vault: string;
  OS_Lens_Thickness_Check: string;
  OS_Lens_Thickness: string;
  Kesimpulan: string;
  TTD_Perawat: string;
  ID_Perawat: string;
  Nama_Perawat: string;
  TTD_Dokter_Pemeriksaan: string;
  ID_Dokter_Pemeriksaan: string;
  Nama_Dokter_Pemeriksaan: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;
}

export class PemeriksaanOCTCornea {
  static createFromJson(json: any) {
    return {
      Nama: 'Pemeriksaan_Oct_Cornea',
      Tanggal: json.tanggal ?? '',
      Kornea: json.kornea ?? '',
      Ketebalan_OD: json.ketebalan_od ?? '',
      Ketebalan_OS: json.ketebalan_os ?? '',
      OD_Epitel_Detach_Check: json.od_epitel_detach_check ?? '',
      OD_Erosi_Check: json.od_erosi_check ?? '',
      OD_Irregular_Epitel_Check: json.od_irregular_epitel_check ?? '',
      OD_Epitel_Thinning_Check: json.od_epitel_thinning_check ?? '',
      OD_Epitel_Downgrowth_Check: json.od_epitel_downgrowth_check ?? '',
      OD_Epitel_Lainnya_Check: json.od_epitel_lainnya_check ?? '',
      OS_Epitel_Detach_Check: json.os_epitel_detach_check ?? '',
      OS_Erosi_Check: json.os_erosi_check ?? '',
      OS_Irregular_Epitel_Check: json.os_irregular_epitel_check ?? '',
      OS_Epitel_Thinning_Check: json.os_epitel_thinning_check ?? '',
      OS_Epitel_Downgrowth_Check: json.os_epitel_downgrowth_check ?? '',
      OS_Epitel_Lainnya_Check: json.os_epitel_lainnya_check ?? '',
      OD_Irreguler_Stroma_Check: json.od_irreguler_stroma_check ?? '',
      OD_Stromal_Thinning_Check: json.od_stromal_thinning_check ?? '',
      OD_Stromal_Melting_Check: json.od_stromal_melting_check ?? '',
      OD_Stromal_Lainnya_Check: json.od_stromal_lainnya_check ?? '',
      OS_Irreguler_Stroma_Check: json.os_irreguler_stroma_check ?? '',
      OS_Stromal_Thinning_Check: json.os_stromal_thinning_check ?? '',
      OS_Stromal_Melting_Check: json.os_stromal_melting_check ?? '',
      OS_Stromal_Lainnya_Check: json.os_stromal_lainnya_check ?? '',
      OD_Irreguler_Endotel_Check: json.od_irreguler_endotel_check ?? '',
      OD_Endotelial_Detachment_Check: json.od_endotelial_detachment_check ?? '',
      OD_Endotel_Lainnya_Check: json.od_endotel_lainnya_check ?? '',
      OS_Irreguler_Endotel_Check: json.os_irreguler_endotel_check ?? '',
      OS_Endotelial_Detachment_Check: json.os_endotelial_detachment_check ?? '',
      OS_Endotel_Lainnya_Check: json.os_endotel_lainnya_check ?? '',
      OD_Anterior_Chamber_Check: json.od_anterior_chamber_check ?? '',
      OD_Anterior_Chamber_Depth: json.od_anterior_chamber_depth ?? '',
      OD_BMD_Mass_Check: json.od_bmd_mass_check ?? '',
      OD_BMD_Particle_Check: json.od_bmd_particle_check ?? '',
      OD_BMD_Lainnya_Check: json.od_bmd_lainnya_check ?? '',
      OS_Anterior_Chamber_Check: json.os_anterior_chamber_check ?? '',
      OS_Anterior_Chamber_Depth: json.os_anterior_chamber_depth ?? '',
      OS_BMD_Mass_Check: json.os_bmd_mass_check ?? '',
      OS_BMD_Particle_Check: json.os_bmd_particle_check ?? '',
      OS_BMD_Lainnya_Check: json.os_bmd_lainnya_check ?? '',
      OD_Scleral_Spur_Check: json.od_scleral_spur_check ?? '',
      OD_Scleral_Spur_Angle: json.od_scleral_spur_angle ?? '',
      OD_Sudut_Dangkal_Check: json.od_sudut_dangkal_check ?? '',
      OD_Sudut_Dalam_Check: json.od_sudut_dalam_check ?? '',
      OS_Scleral_Spur_Check: json.os_scleral_spur_check ?? '',
      OS_Scleral_Spur_Angle: json.os_scleral_spur_angle ?? '',
      OS_Sudut_Dangkal_Check: json.os_sudut_dangkal_check ?? '',
      OS_Sudut_Dalam_Check: json.os_sudut_dalam_check ?? '',
      OD_Blok_Pupil_Check: json.od_blok_pupil_check ?? '',
      OD_Plateau_Check: json.od_plateau_check ?? '',
      OD_Tumor_Kista_Check: json.od_tumor_kista_check ?? '',
      OS_Blok_Pupil_Check: json.os_blok_pupil_check ?? '',
      OS_Plateau_Check: json.os_plateau_check ?? '',
      OS_Tumor_Kista_Check: json.os_tumor_kista_check ?? '',
      OD_Lens_Vault_Check: json.od_lens_vault_check ?? '',
      OD_Lens_Vault: json.od_lens_vault ?? '',
      OD_Lens_Thickness_Check: json.od_lens_thickness_check ?? '',
      OD_Lens_Thickness: json.od_lens_thickness ?? '',
      OS_Lens_Vault_Check: json.os_lens_vault_check ?? '',
      OS_Lens_Vault: json.os_lens_vault ?? '',
      OS_Lens_Thickness_Check: json.os_lens_thickness_check ?? '',
      OS_Lens_Thickness: json.os_lens_thickness ?? '',
      Kesimpulan: json.kesimpulan ?? '',
      TTD_Perawat: json.ttd_perawat && json.ttd_perawat !== '' && isValidFile(json.ttd_perawat) ? global.storage.cleanUrl(json.ttd_perawat) : '',
      ID_Perawat: json.id_perawat ?? '',
      TTD_Dokter_Pemeriksaan: json.ttd_dokter_pemeriksaan && json.ttd_dokter_pemeriksaan !== '' && isValidFile(json.ttd_dokter_pemeriksaan) ? global.storage.cleanUrl(json.ttd_dokter_pemeriksaan) : '',
      ID_Dokter_Pemeriksaan: json.id_dokter_pemeriksaan ?? '',
    }
  }
}

export interface IHasilSchirmerTest {
  Nama: string;
  Tanggal: string;
  OD: string;
  OS: string;
  Kesimpulan: string;
  ID_Perawat: string;
  ID_Dokter_Pemeriksa: string;
  TTD_Perawat: string;
  TTD_Dokter_Pemeriksa: string;
  Nama_Perawat: string;
  Nama_Dokter_Pemeriksa: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;
}
export class HasilSchirmerTest {
  static createFromJson(json: any) {
    return {
      Nama: 'Laporan_Hasil_Schirmer_Test',
      Tanggal: json.tanggal ?? '',
      OD: json.od ?? '',
      OS: json.os ?? '',
      Kesimpulan: json.kesimpulan ?? '',
      ID_Perawat: json.id_perawat ?? '',
      ID_Dokter_Pemeriksa: json.id_dokter_pemeriksa ?? '',
      TTD_Perawat: json.ttd_perawat && json.ttd_perawat !== '' && isValidFile(json.ttd_perawat) ? global.storage.cleanUrl(json.ttd_perawat) : '',
      TTD_Dokter_Pemeriksa: json.ttd_dokter_pemeriksa && json.ttd_dokter_pemeriksa !== '' && isValidFile(json.ttd_dokter_pemeriksa) ? global.storage.cleanUrl(json.ttd_dokter_pemeriksa) : '',
    }
  }
}
