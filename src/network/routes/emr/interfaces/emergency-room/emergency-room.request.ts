import { isValidFile } from "../../helpers/app.helper"

export interface IAssesmen {
  "triase-radio": string
  "kesadaran-radio": string
  "pernafasan-radio": string
  "sirkulasi-radio": string
  "pertolongan-pertama": string
  "tindakan-resusitasi": string
  "jalanNafas-radio": string
  "bantuanNafas-radio": string
  "sirkulasiResusitasi-radio": string
  "gcs-e": string
  "gcs-e-text": string
  "gcs-m": string
  "gcs-m-text": string
  "gcs-v": string
  "gcs-v-text": string
  "gcs-score": string
  "vital-respiratory-rate": string
  "vital-denyut-nadi": string
  "vital-tekanan-darah": string
  "vital-kesadaran": string
  "vital-suhu": string
  "skala-nyeri": string
  "alergi-makanan": string
  "alergi-obat": string
  "alergi-lainnya": string
  "kedatangan-pasien": string
  "asal-informasi-radio": string
  "asal-informasi-hubungan": string
  "penyakit-terdahulu": string
  "pengobatan-terdahulu": string
  "pengkajian-fungsi-radio": string
  "penilaian-risiko-jatuh-radio": string
  "risiko-jatuh-ibu-hamil": string
  "risiko-jatuh-lanjut-usia": string
  "risiko-jatuh-alat-bantu": string
  "status-kehamilan-radio": string
  "status-kehamilan-gravida": string
  "status-kehamilan-para": string
  "status-kehamilan-abortus": string
  "status-kehamilan-hpht": string
  "nutrisi-tinggi": string
  "nutrisi-berat": string
  "penurunan-berat-badan-radio": string
  "penurunan-berat-badan-nilai-radio": string
  "penurunan-nafsu-makan-radio": string
  "nutrisi-diagnosa-khusus": string
  "nutrisi-diagnosa-khusus-keterangan": string
  "nutrisi-total-skor": string
  "nutrisi-lebih-lanjut": string
  "psikologis-cemas": string
  "psikologis-takut": string
  "psikologis-marah": string
  "psikologis-sedih": string
  "psikologis-kecenderungan-bunuh-diri": string
  "psikologis-lain-lain": string
  "psikologis-lain-lain-keterangan": string
  "mental-sadar": string
  "mental-perilaku": string
  "mental-perilaku-keterangan": string
  "mental-kekerasan": string
  "mental-kekerasan-keterangan": string
  "kerabat-nama": string
  "kerabat-hubungan": string
  "kerabat-telepon": string
  "spiritual-agama": string
  "keperawatan-diagnosa-0": string
  "keperawatan-rencana-0": string
  "keperawatan-diagnosa-1": string
  "keperawatan-rencana-1": string
  "keperawatan-diagnosa-2": string
  "keperawatan-rencana-2": string
  "keperawatan-diagnosa-3": string
  "keperawatan-rencana-3": string
  "keperawatan-diagnosa-4": string
  "keperawatan-rencana-4": string
  "keperawatan-diagnosa-5": string
  "keperawatan-rencana-5": string
  "keperawatan-diagnosa-6": string
  "keperawatan-rencana-6": string
  "keperawatan-diagnosa-7": string
  "keperawatan-rencana-7": string
  "keperawatan-diagnosa-lainnya": string
  "keperawatan-rencana-lainnya": string
  "pengkajian-subjektif": string
  "pengkajian-kepala": string
  "pengkajian-mata": string
  "pengkajian-od-va": string
  "pengkajian-os-va": string
  "pengkajian-od-tonometri": string
  "pengkajian-os-tonometri": string
  "pengkajian-telinga": string
  "pengkajian-hidung": string
  "pengkajian-gigi": string
  "pengkajian-tenggorokan": string
  "pengkajian-leher": string
  "pengkajian-dada": string
  "pengkajian-jantung": string
  "pengkajian-paru": string
  "pengkajian-abdomen": string
  "pengkajian-genitalia": string
  "pengkajian-kandungan": string
  "pengkajian-eks-atas": string
  "pengkajian-eks-bawah": string
  "pengkajian-pemeriksaan-penunjang": string
  "pengkajian-assesmen": string
  "pengkajian-terapi-penatalaksaan": string
  "pengkajian-anjuran": string
  "ttd-dokter-pengkaji": string
  "pengkajian-dokter": string
  "gambar-mata-od": string
  "gambar-mata-os": string
  "dokter-mata-posisi-od": string
  "dokter-mata-posisi-os": string
  "dokter-mata-pergerakan-od": string
  "dokter-mata-pergerakan-os": string
  "dokter-mata-palpebra-superior-od": string
  "dokter-mata-palpebra-superior-os": string
  "dokter-mata-conj-tarsal-superior-od": string
  "dokter-mata-conj-tarsal-superior-os": string
  "dokter-mata-conj-tarsal-inferior-od": string
  "dokter-mata-conj-tarsal-inferior-os": string
  "dokter-mata-conj-bulbi-od": string
  "dokter-mata-conj-bulbi-os": string
  "dokter-mata-cornea-od": string
  "dokter-mata-cornea-os": string
  "dokter-mata-coa-od": string
  "dokter-mata-coa-os": string
  "dokter-mata-pupil-od": string
  "dokter-mata-pupil-os": string
  "dokter-mata-iris-od": string
  "dokter-mata-iris-os": string
  "dokter-mata-lensa-od": string
  "dokter-mata-lensa-os": string
  "dokter-mata-vitreous-od": string
  "dokter-mata-vitreous-os": string
  "dokter-mata-funduscopy-od": string
  "dokter-mata-funduscopy-os": string
  "dokter-mata-diagnosa": string
  "dokter-mata-terapi": string
  "dokter-mata-rencana-pengobatan": string
  "dokter-mata-anjuran": string
  "ttd-dokter-mata": string
  "dokter-mata-dokter": string
  'nama-obat': Array<string>
  'jumlah': Array<string>
  'catatan': Array<string>
  'aturan-pakai': Array<string>
};

export class Assesmen {
  "triase-radio": string
  "kesadaran-radio": string
  "pernafasan-radio": string
  "sirkulasi-radio": string
  "pertolongan-pertama": string
  "tindakan-resusitasi": string
  "jalanNafas-radio": string
  "bantuanNafas-radio": string
  "sirkulasiResusitasi-radio": string
  "gcs-e": string
  "gcs-e-text": string
  "gcs-m": string
  "gcs-m-text": string
  "gcs-v": string
  "gcs-v-text": string
  "gcs-score": string
  "vital-respiratory-rate": string
  "vital-denyut-nadi": string
  "vital-tekanan-darah": string
  "vital-kesadaran": string
  "vital-suhu": string
  "skala-nyeri": string
  "alergi-makanan": string
  "alergi-obat": string
  "alergi-lainnya": string
  "kedatangan-pasien": string
  "asal-informasi-radio": string
  "asal-informasi-hubungan": string
  "penyakit-terdahulu": string
  "pengobatan-terdahulu": string
  "pengkajian-fungsi-radio": string
  "penilaian-risiko-jatuh-radio": string
  "risiko-jatuh-ibu-hamil": string
  "risiko-jatuh-lanjut-usia": string
  "risiko-jatuh-alat-bantu": string
  "status-kehamilan-radio": string
  "status-kehamilan-gravida": string
  "status-kehamilan-para": string
  "status-kehamilan-abortus": string
  "status-kehamilan-hpht": string
  "nutrisi-tinggi": string
  "nutrisi-berat": string
  "penurunan-berat-badan-radio": string
  "penurunan-berat-badan-nilai-radio": string
  "penurunan-nafsu-makan-radio": string
  "nutrisi-diagnosa-khusus": string
  "nutrisi-diagnosa-khusus-keterangan": string
  "nutrisi-total-skor": string
  "nutrisi-lebih-lanjut": string
  "psikologis-cemas": string
  "psikologis-takut": string
  "psikologis-marah": string
  "psikologis-sedih": string
  "psikologis-kecenderungan-bunuh-diri": string
  "psikologis-lain-lain": string
  "psikologis-lain-lain-keterangan": string
  "mental-sadar": string
  "mental-perilaku": string
  "mental-perilaku-keterangan": string
  "mental-kekerasan": string
  "mental-kekerasan-keterangan": string
  "kerabat-nama": string
  "kerabat-hubungan": string
  "kerabat-telepon": string
  "spiritual-agama": string
  "keperawatan-diagnosa-0": string
  "keperawatan-rencana-0": string
  "keperawatan-diagnosa-1": string
  "keperawatan-rencana-1": string
  "keperawatan-diagnosa-2": string
  "keperawatan-rencana-2": string
  "keperawatan-diagnosa-3": string
  "keperawatan-rencana-3": string
  "keperawatan-diagnosa-4": string
  "keperawatan-rencana-4": string
  "keperawatan-diagnosa-5": string
  "keperawatan-rencana-5": string
  "keperawatan-diagnosa-6": string
  "keperawatan-rencana-6": string
  "keperawatan-diagnosa-7": string
  "keperawatan-rencana-7": string
  "keperawatan-diagnosa-lainnya": string
  "keperawatan-rencana-lainnya": string
  "pengkajian-subjektif": string
  "pengkajian-kepala": string
  "pengkajian-mata": string
  "pengkajian-od-va": string
  "pengkajian-os-va": string
  "pengkajian-od-tonometri": string
  "pengkajian-os-tonometri": string
  "pengkajian-telinga": string
  "pengkajian-hidung": string
  "pengkajian-gigi": string
  "pengkajian-tenggorokan": string
  "pengkajian-leher": string
  "pengkajian-dada": string
  "pengkajian-jantung": string
  "pengkajian-paru": string
  "pengkajian-abdomen": string
  "pengkajian-genitalia": string
  "pengkajian-kandungan": string
  "pengkajian-eks-atas": string
  "pengkajian-eks-bawah": string
  "pengkajian-pemeriksaan-penunjang": string
  "pengkajian-assesmen": string
  "pengkajian-terapi-penatalaksaan": string
  "pengkajian-anjuran": string
  "ttd-dokter-pengkaji": string
  "pengkajian-dokter": string
  "gambar-mata-od": string
  "gambar-mata-os": string
  "dokter-mata-posisi-od": string
  "dokter-mata-posisi-os": string
  "dokter-mata-pergerakan-od": string
  "dokter-mata-pergerakan-os": string
  "dokter-mata-palpebra-superior-od": string
  "dokter-mata-palpebra-superior-os": string
  "dokter-mata-conj-tarsal-superior-od": string
  "dokter-mata-conj-tarsal-superior-os": string
  "dokter-mata-conj-tarsal-inferior-od": string
  "dokter-mata-conj-tarsal-inferior-os": string
  "dokter-mata-conj-bulbi-od": string
  "dokter-mata-conj-bulbi-os": string
  "dokter-mata-cornea-od": string
  "dokter-mata-cornea-os": string
  "dokter-mata-coa-od": string
  "dokter-mata-coa-os": string
  "dokter-mata-pupil-od": string
  "dokter-mata-pupil-os": string
  "dokter-mata-iris-od": string
  "dokter-mata-iris-os": string
  "dokter-mata-lensa-od": string
  "dokter-mata-lensa-os": string
  "dokter-mata-vitreous-od": string
  "dokter-mata-vitreous-os": string
  "dokter-mata-funduscopy-od": string
  "dokter-mata-funduscopy-os": string
  "dokter-mata-diagnosa": string
  "dokter-mata-terapi": string
  "dokter-mata-rencana-pengobatan": string
  "dokter-mata-anjuran": string
  "ttd-dokter-mata": string
  "dokter-mata-dokter": string
  'nama-obat': Array<string>
  'jumlah': Array<string>
  'catatan': Array<string>
  'aturan-pakai': Array<string>

  static createFromJson(json: IAssesmen) {
    return {
      Kesadaran_Value: json["kesadaran-radio"] ?? '',
      Pernafasan_Value: json["pernafasan-radio"] ?? '',
      Sirkulasi_Value: json["sirkulasi-radio"] ?? '',
      Pertolongan_Pertama: json["pertolongan-pertama"] ?? '',
      Tindakan_Resusitasi: json["tindakan-resusitasi"] ?? '',
      Jalan_Nafas_Value: json["jalanNafas-radio"] ?? '',
      Bantuan_Nafas_Value: json["bantuanNafas-radio"] ?? '',
      Sirkulasi_Resusitasi_Value: json["sirkulasiResusitasi-radio"] ?? '',
      GCS_E: json["gcs-e"] ?? '',
      GCS_E_Teks: json["gcs-e-text"] ?? '',
      GCS_M: json["gcs-m"] ?? '',
      GCS_M_Teks: json["gcs-m-text"] ?? '',
      GCS_V: json["gcs-v"] ?? '',
      GCS_V_Teks: json["gcs-v-text"] ?? '',
      GCS_Score: json["gcs-score"] ?? '',
      Vital_Respiratory_Rate: json["vital-respiratory-rate"] ?? '',
      Vital_Denyut_Nadi: json["vital-denyut-nadi"] ?? '',
      Vital_Tekanan_Darah: json["vital-tekanan-darah"] ?? '',
      Vital_Kesadaran: json["vital-kesadaran"] ?? '',
      Vital_Suhu: json["vital-suhu"] ?? '',
      Skala_Nyeri: json["skala-nyeri"] ?? '',
      Alergi_Makanan: json["alergi-makanan"] ?? '',
      Alergi_Obat: json["alergi-obat"] ?? '',
      Alergi_Lainnya: json["alergi-lainnya"] ?? '',
      Kedatangan_Pasien: json["kedatangan-pasien"] ?? '',
      Asal_Informasi: json["asal-informasi-radio"] ?? '',
      Asal_Informasi_Hubungan: json["asal-informasi-hubungan"] ?? '',
      Penyakit_Terdahulu: json["penyakit-terdahulu"] ?? '',
      Pengobatan_Terdahulu: json["pengobatan-terdahulu"] ?? '',
      Pengkajian_Fungsi: json["pengkajian-fungsi-radio"] ?? '',
      Penilaian_Risiko_Jatuh: json["penilaian-risiko-jatuh-radio"] ? parseInt(json["penilaian-risiko-jatuh-radio"]) : undefined,
      Risiko_Jatuh_Ibu_Hamil: json["risiko-jatuh-ibu-hamil"] && json["risiko-jatuh-ibu-hamil"] === '1' ? 1 : 0,
      Risiko_Jatuh_Lanjut_Usia: json["risiko-jatuh-lanjut-usia"] && json["risiko-jatuh-lanjut-usia"] === '1' ? 1 : 0,
      Risiko_Jatuh_Alat_Bantu: json["risiko-jatuh-alat-bantu"] && json["risiko-jatuh-alat-bantu"] === '1' ? 1 : 0,
      Status_Kehamilan: json["status-kehamilan-radio"] ? parseInt(json["status-kehamilan-radio"]) : undefined,
      Status_Kehamilan_Gravida: json["status-kehamilan-gravida"] ?? '',
      Status_Kehamilan_Para: json["status-kehamilan-para"] ?? '',
      Status_Kehamilan_Abortus: json["status-kehamilan-abortus"] ?? '',
      Status_Kehamilan_HPHT: json["status-kehamilan-hpht"] ?? '',
      Nutrisi_Tinggi: json["nutrisi-tinggi"] ?? '',
      Nutrisi_Berat: json["nutrisi-berat"] ?? '',
      Penurunan_Berat_Badan: json["penurunan-berat-badan-radio"] ? parseInt(json["penurunan-berat-badan-radio"]) : undefined,
      Penurunan_Berat_Badan_Nilai: json["penurunan-berat-badan-nilai-radio"] ? parseInt(json["penurunan-berat-badan-nilai-radio"]) : undefined,
      Penurunan_Nafsu_Makan: json["penurunan-nafsu-makan-radio"] ? parseInt(json["penurunan-nafsu-makan-radio"]) : undefined,
      Nutrisi_Diagnosa_Khusus: json["nutrisi-diagnosa-khusus"] ?? '',
      Nutrisi_Diagnosa_Khusus_Keterangan: json["nutrisi-diagnosa-khusus-keterangan"] ?? '',
      Nutrisi_Total_Skor: json["nutrisi-total-skor"] ?? '',
      Nutrisi_Lebih_Lanjut: json["nutrisi-lebih-lanjut"] ?? '',
      Psikologis_Cemas: json["psikologis-cemas"] && json["psikologis-cemas"] === '1' ? 1 : 0,
      Psikologis_Takut: json["psikologis-takut"] && json["psikologis-takut"] === '1' ? 1 : 0,
      Psikologis_Marah: json["psikologis-marah"] && json["psikologis-marah"] === '1' ? 1 : 0,
      Psikologis_Sedih: json["psikologis-sedih"] && json["psikologis-sedih"] === '1' ? 1 : 0,
      Psikologis_Kecenderungan_Bunuh_Diri: json["psikologis-kecenderungan-bunuh-diri"] && json["psikologis-kecenderungan-bunuh-diri"] === '1' ? 1 : 0,
      Psikologis_Lain_Lain: json["psikologis-lain-lain"] && json["psikologis-lain-lain"] === '1' ? 1 : 0,
      Psikologis_Lain_Lain_Keterangan: json["psikologis-lain-lain-keterangan"] ?? '',
      Mental_Sadar: json["mental-sadar"] && json["mental-sadar"] === '1' ? 1 : 0,
      Mental_Perilaku: json["mental-perilaku"] && json["mental-perilaku"] === '1' ? 1 : 0,
      Mental_Perilaku_Keterangan: json["mental-perilaku-keterangan"] ?? '',
      Mental_Kekerasan: json["mental-kekerasan"] && json["mental-kekerasan"] === '1' ? 1 : 0,
      Mental_Kekerasan_Keterangan: json["mental-kekerasan-keterangan"] ?? '',
      Kerabat_Nama: json["kerabat-nama"] ?? '',
      Kerabat_Hubungan: json["kerabat-hubungan"] ?? '',
      Kerabat_Telepon: json["kerabat-telepon"] ?? '',
      Spiritual_Agama: json["spiritual-agama"] ?? '',
      Keperawatan_Diagnosa_Lainnya: json["keperawatan-diagnosa-lainnya"] ?? '',
      Keperawatan_Rencana_Lainnya: json["keperawatan-rencana-lainnya"] ?? '',
      Pengkajian_Subjektif: json["pengkajian-subjektif"] ?? '',
      Pengkajian_OD_VA: json["pengkajian-od-va"] ?? '',
      Pengkajian_OS_VA: json["pengkajian-os-va"] ?? '',
      Pengkajian_OD_Tonometri: json["pengkajian-od-tonometri"] ?? '',
      Pengkajian_OS_Tonometri: json["pengkajian-os-tonometri"] ?? '',
      ID_Pengkajian_Dokter: json["pengkajian-dokter"] ?? '',
      ID_Dokter_Mata_Dokter: json["dokter-mata-dokter"] ?? '',
      Gambar_Mata_OD: json["gambar-mata-od"] && json["gambar-mata-od"] !== '' && isValidFile(json["gambar-mata-od"]) ? global.storage.cleanUrl(json["gambar-mata-od"]) : '',
      Gambar_Mata_OS: json["gambar-mata-os"] && json["gambar-mata-os"] !== '' && isValidFile(json["gambar-mata-os"]) ? global.storage.cleanUrl(json["gambar-mata-os"]) : '',
      TTD_Dokter_Pengkaji: json["ttd-dokter-pengkaji"] && json["ttd-dokter-pengkaji"] !== '' && isValidFile(json["ttd-dokter-pengkaji"]) ? global.storage.cleanUrl(json["ttd-dokter-pengkaji"]) : '',
      TTD_Dokter_Mata: json["ttd-dokter-mata"] && json["ttd-dokter-mata"] !== '' && isValidFile(json["ttd-dokter-mata"]) ? global.storage.cleanUrl(json["ttd-dokter-mata"]) : '',
    }
  }
}

export interface IUpdateBPRJUGD {
  keluhan: string;
  od_eye_image: string;
  od_va: string;
  od_false: string;
  od_ph: string;
  od_add: string;
  od_jagger: string;
  od_non_contact: string;
  od_schiotz: string;
  od_tanam_lensa: string;
  od_keterangan_tono: string;
  os_eye_image: string;
  os_va: string;
  os_false: string;
  os_ph: string;
  os_add: string;
  os_jagger: string;
  os_non_contact: string;
  os_schiotz: string;
  os_tanam_lensa: string;
  os_keterangan_tono: string;
  kgd: string;
  td: string;
  diagnosa: string;
  terapi: string;
  anjuran: string;
  'nama-obat': Array<any>;
  jumlah: Array<any>;
  catatan: Array<string>;
  'aturan-pakai': Array<any>;
  tanggal_ttd: string;
  tanda_tangan_radio: string;
  tanda_tangan_pasien: string;
  tanda_tangan_wali: string;
  ttd_dokter: string;
  doctor_id: string;
  doctor_sip: string;
}
