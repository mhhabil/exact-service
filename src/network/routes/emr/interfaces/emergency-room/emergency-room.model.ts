import { isValidFile } from "../../helpers/app.helper";
import { IUpdateBPRJUGD } from "./emergency-room.request";

export class BPRJModel {
  static createFromJson(json: IUpdateBPRJUGD) {
    return {
      OD: {
        Eye_Image: json.od_eye_image && json.od_eye_image !== '' && isValidFile(json.od_eye_image) ? global.storage.cleanUrl(json.od_eye_image) : '',
        VA: json.od_va ?? '',
        False: json.od_false ?? '',
        PH: json.od_ph ?? '',
        Add: json.od_add ?? '',
        Jagger: json.od_jagger ?? '',
        Non_Contact: json.od_non_contact ?? '',
        Schiotz: json.od_schiotz ?? '',
        Tanam_Lensa: json.od_tanam_lensa ?? '',
        Keterangan_Tono: json.od_keterangan_tono ?? '',
      },
      OS: {
        Eye_Image: json.os_eye_image && json.os_eye_image !== '' && isValidFile(json.os_eye_image) ? global.storage.cleanUrl(json.os_eye_image) : '',
        VA: json.os_va ?? '',
        False: json.os_false ?? '',
        PH: json.os_ph ?? '',
        Add: json.os_add ?? '',
        Jagger: json.os_jagger ?? '',
        Non_Contact: json.os_non_contact ?? '',
        Schiotz: json.os_schiotz ?? '',
        Tanam_Lensa: json.os_tanam_lensa ?? '',
        Keterangan_Tono: json.os_keterangan_tono ?? '',
      },
      Keluhan: json.keluhan ?? '',
      KGD: json.kgd ?? '',
      TD: json.td ?? '',
      Diagnosa: json.diagnosa ?? '',
      Terapi: json.terapi ?? '',
      Anjuran: json.anjuran ?? '',
      Tanggal_TTD: json.tanggal_ttd ?? '',
      Tanda_Tangan_Radio: json.tanda_tangan_radio ?? '',
      Tanda_Tangan_Pasien: json.tanda_tangan_pasien && json.tanda_tangan_pasien !== '' && isValidFile(json.tanda_tangan_pasien) ? global.storage.cleanUrl(json.tanda_tangan_pasien) : '',
      Tanda_Tangan_Wali: json.tanda_tangan_wali && json.tanda_tangan_wali !== '' && isValidFile(json.tanda_tangan_wali) ? global.storage.cleanUrl(json.tanda_tangan_wali) : '',
      TTD_Dokter: json.ttd_dokter && json.ttd_dokter !== '' && isValidFile(json.ttd_dokter) ? global.storage.cleanUrl(json.ttd_dokter) : '',
      ID_Dokter: json.doctor_id ?? '',
      SIP_Dokter: json.doctor_sip ?? '',
    }
  }
}
