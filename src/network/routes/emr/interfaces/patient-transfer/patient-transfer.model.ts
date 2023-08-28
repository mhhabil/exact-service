import { isValidFile } from "../../helpers/app.helper";
import { IUpdateTransferPasien } from "./patient-transfer.request";

export class PatientTransfer {
  static createFromJson(json: IUpdateTransferPasien) {
    return {
      ID_Pelayanan: json.id_pelayanan ?? '',
      ID_Dokter_Dpjp: json.id_dokter_dpjp ?? '',
      // Nama_Dokter_Dpjp
      ID_Dokter_Operator: json.id_dokter_operator ?? '',
      // Nama_Dokter_Operator
      Tanggal_Transfer: json.tanggal_transfer ?? '',
      Indikasi_Transfer: json.indikasi_transfer ?? '',
      Pengantar: json.pengantar ?? '',
      Penerima: json.penerima ?? '',
      Tanggal_Masuk_Rs: json.tanggal_masuk_rs ?? '',
      Diagnosa: json.diagnosa ?? '',
      Kesadaran: json.kesadaran ?? '',
      Vital_TD: json.vital_td ?? '',
      Vital_N: json.vital_n ?? '',
      Vital_P: json.vital_p ?? '',
      Vital_T: json.vital_t ?? '',
      Vital_Sat_O2: json.vital_sat_o2 ?? '',
      Visus_OD: json.visus_od ?? '',
      Visus_OS: json.visus_os ?? '',
      Tonometer_OD: json.tonometer_od ?? '',
      Tonometer_OS: json.tonometer_os ?? '',
      Skala_Nyeri: json.skala_nyeri ?? '',
      Puasa: json.puasa ?? '',
      Waktu_Puasa: json.waktu_puasa ?? '',
      Keluhan: json.keluhan ?? '',
      Alderette: json.alderette ?? '',
      Alderette_Aktivitas: json.alderette_aktivitas ?? '',
      Alderette_Sirkulasi: json.alderette_sirkulasi ?? '',
      Alderette_Pernafasan: json.alderette_pernafasan ?? '',
      Alderette_Kesadaran: json.alderette_kesadaran ?? '',
      Alderette_Warna_Kulit: json.alderette_warna_kulit ?? '',
      Alderette_Score: json.alderette_score ?? '',
      Steward: json.steward ?? '',
      Steward_Kesadaran: json.steward_kesadaran ?? '',
      Steward_Pernafasan: json.steward_pernafasan ?? '',
      Steward_Motorik: json.steward_motorik ?? '',
      Steward_Score: json.steward_score ?? '',
      Pemeriksaan_Alat_Ekg: json.pemeriksaan_alat_ekg ?? '',
      Pemeriksaan_Alat_Laboratorium: json.pemeriksaan_alat_laboratorium ?? '',
      Pemeriksaan_Alat_Usg: json.pemeriksaan_alat_usg ?? '',
      Pemeriksaan_Alat_Biometri: json.pemeriksaan_alat_biometri ?? '',
      Pemeriksaan_Alat_Oct_Macula: json.pemeriksaan_alat_oct_macula ?? '',
      Pemeriksaan_Alat_Thorax_Foto: json.pemeriksaan_alat_thorax_foto ?? '',
      Pemeriksaan_Alat_Ct_Scan: json.pemeriksaan_alat_ct_scan ?? '',
      Pemeriksaan_Alat_Foto_Fundus: json.pemeriksaan_alat_foto_fundus ?? '',
      Pemeriksaan_Alat_Oct_Papil: json.pemeriksaan_alat_oct_papil ?? '',
      Pemeriksaan_Alat_Lain_Lain: json.pemeriksaan_alat_lain_lain ?? '',
      Pemeriksaan_Alat_Laboratorium_Text: json.pemeriksaan_alat_laboratorium_text ?? '',
      Pemeriksaan_Alat_Lain_Text: json.pemeriksaan_alat_lain_text ?? '',
      Terapi: json.terapi ?? '',
      Diet: json.diet ?? '',
      Rencana: json.rencana ?? '',
      Tanda_Tangan_Perawat_Penerima: json.tanda_tangan_perawat_penerima && json.tanda_tangan_perawat_penerima !== '' && isValidFile(json.tanda_tangan_perawat_penerima) ? global.storage.cleanUrl(json.tanda_tangan_perawat_penerima) : '',
      Id_Tanda_Tangan_Perawat_Penerima: json.id_tanda_tangan_perawat_penerima ?? '',
      // Nama_Perawat_Penerima
      Tanda_Tangan_Perawat_Pengantar: json.tanda_tangan_perawat_pengantar && json.tanda_tangan_perawat_pengantar !== '' && isValidFile(json.tanda_tangan_perawat_pengantar) ? global.storage.cleanUrl(json.tanda_tangan_perawat_pengantar) : '',
      Id_Tanda_Tangan_Perawat_Pengantar: json.id_tanda_tangan_perawat_pengantar ?? '',
      // Nama_Perawat_Pengantar
      Waktu: json.tanggal_transfer ?? '',
      Unit: json.unit ?? '',
    }
  }
}
