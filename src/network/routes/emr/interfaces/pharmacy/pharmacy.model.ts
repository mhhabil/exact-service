import { isValidFile } from "../../helpers/app.helper";
import { IUpdateBeriObat, IUpdateEfekSampingObat, IUpdateRekonsiliasiObat } from "./pharmacy.request";

export class RekonsiliasiObat {
  static createFromJson(json: IUpdateRekonsiliasiObat) {
    const medsAllergy: Array<IMedsAllergy> = json.alergi_obat && json.alergi_obat.map((item) => {
      return {
        Nama_Obat_Alergi: item.nama_obat_alergi,
        Reaksi_Alergi: item.reaksi_alergi,
        Tingkat: item.tingkat,
      }
    });

    const inMeds: Array<IObatSaatMasukRS> = json.obat_saat_masuk_rs && json.obat_saat_masuk_rs.map((item) => {
      return {
        Nama_Obat: item.nama_obat,
        Jumlah: item.jumlah,
        Rute: item.rute,
        Aturan_Pakai: item.aturan_pakai,
        Tindak_Lanjut: item.tindak_lanjut,
        Perubahan_Aturan_Pakai: item.perubahan_aturan_pakai,
        Obat_Milik_Pasien: item.obat_milik_pasien,
      }
    });

    const firstRoomMeds: Array<IObatRuangan> = json.obat_ruangan_1 && json.obat_ruangan_1.map((item) => {
      return {
        Nama_Obat: item.nama_obat,
        Jumlah: item.jumlah,
        Rute: item.rute,
        Aturan_Pakai: item.aturan_pakai,
        Tindak_Lanjut: item.tindak_lanjut,
        Perubahan_Aturan_Pakai: item.perubahan_aturan_pakai,
      }
    });

    const secondRoomMeds: Array<IObatRuangan> = json.obat_ruangan_2 && json.obat_ruangan_2.map((item) => {
      return {
        Nama_Obat: item.nama_obat,
        Jumlah: item.jumlah,
        Rute: item.rute,
        Aturan_Pakai: item.aturan_pakai,
        Tindak_Lanjut: item.tindak_lanjut,
        Perubahan_Aturan_Pakai: item.perubahan_aturan_pakai,
      }
    });

    const outMeds: Array<IObatKeluar> = json.obat_keluar && json.obat_keluar.map((item) => {
      return {
        Nama_Obat: item.nama_obat,
        Jumlah: item.jumlah,
        Rute: item.rute,
        Aturan_Pakai: item.aturan_pakai,
        Tindak_Lanjut: item.tindak_lanjut,
        Perubahan_Aturan_Pakai: item.perubahan_aturan_pakai,
        Kategori: item.kategori,
      }
    });

    return {
      Riwayat_Pemakaian_Obat: json.riwayat_pemakaian_obat && Array.isArray(json.riwayat_pemakaian_obat) ? json.riwayat_pemakaian_obat : [],
      Alergi_Obat_Radio: json.alergi_obat_radio ?? '',
      Alergi_Obat: medsAllergy ?? [],
      Unit_Masuk_RS: json.unit_masuk_rs ?? '',
      ID_Ka_Unit_Masuk_RS: json.id_ka_unit_masuk_rs ?? '',
      Waktu_Masuk_RS: json.waktu_masuk_rs ?? '',
      Obat_Saat_Masuk_RS: inMeds ?? [],
      ID_Perawat_Masuk_RS: json.id_perawat_masuk_rs ?? '',
      TTD_Perawat_Masuk_RS: json.ttd_perawat_masuk_rs && json.ttd_perawat_masuk_rs !== '' && isValidFile(json.ttd_perawat_masuk_rs) ? global.storage.cleanUrl(json.ttd_perawat_masuk_rs) : '',
      TTD_Pasien_Masuk_RS: json.ttd_pasien_masuk_rs && json.ttd_pasien_masuk_rs !== '' && isValidFile(json.ttd_pasien_masuk_rs) ? global.storage.cleanUrl(json.ttd_pasien_masuk_rs) : '',
      ID_Dokter_Masuk_RS: json.id_dokter_masuk_rs ?? '',
      TTD_Dokter_Masuk_RS: json.ttd_dokter_masuk_rs && json.ttd_dokter_masuk_rs !== '' && isValidFile(json.ttd_dokter_masuk_rs) ? global.storage.cleanUrl(json.ttd_dokter_masuk_rs) : '',
      ID_Apoteker_Masuk_RS: json.id_apoteker_masuk_rs ?? '',
      TTD_Apoteker_Masuk_RS: json.ttd_apoteker_masuk_rs && json.ttd_apoteker_masuk_rs !== '' && isValidFile(json.ttd_apoteker_masuk_rs) ? global.storage.cleanUrl(json.ttd_apoteker_masuk_rs) : '',
      Unit_Ruangan_1: json.unit_ruangan_1 ?? '',
      ID_Ka_Unit_Ruangan_1: json.id_ka_unit_ruangan_1 ?? '',
      Waktu_Ruangan_1: json.waktu_ruangan_1 ?? '',
      Obat_Ruangan_1: firstRoomMeds ?? [],
      ID_Perawat_Ruangan_1: json.id_perawat_ruangan_1 ?? '',
      TTD_Perawat_Ruangan_1: json.ttd_perawat_ruangan_1 && json.ttd_perawat_ruangan_1 !== '' && isValidFile(json.ttd_perawat_ruangan_1) ? global.storage.cleanUrl(json.ttd_perawat_ruangan_1) : '',
      TTD_Pasien_Ruangan_1: json.ttd_pasien_ruangan_1 && json.ttd_pasien_ruangan_1 !== '' && isValidFile(json.ttd_pasien_ruangan_1) ? global.storage.cleanUrl(json.ttd_pasien_ruangan_1) : '',
      ID_Dokter_Ruangan_1: json.id_dokter_ruangan_1 ?? '',
      TTD_Dokter_Ruangan_1: json.ttd_dokter_ruangan_1 && json.ttd_dokter_ruangan_1 !== '' && isValidFile(json.ttd_dokter_ruangan_1) ? global.storage.cleanUrl(json.ttd_dokter_ruangan_1) : '',
      ID_Apoteker_Ruangan_1: json.id_apoteker_ruangan_1 ?? '',
      TTD_Apoteker_Ruangan_1: json.ttd_apoteker_ruangan_1 && json.ttd_apoteker_ruangan_1 !== '' && isValidFile(json.ttd_apoteker_ruangan_1) ? global.storage.cleanUrl(json.ttd_apoteker_ruangan_1) : '',
      Unit_Ruangan_2: json.unit_ruangan_2 ?? '',
      ID_Ka_Unit_Ruangan_2: json.id_ka_unit_ruangan_2 ?? '',
      Waktu_Ruangan_2: json.waktu_ruangan_2 ?? '',
      Obat_Ruangan_2: secondRoomMeds ?? [],
      ID_Perawat_Ruangan_2: json.id_perawat_ruangan_2 ?? '',
      TTD_Perawat_Ruangan_2: json.ttd_perawat_ruangan_2 && json.ttd_perawat_ruangan_2 !== '' && isValidFile(json.ttd_perawat_ruangan_2) ? global.storage.cleanUrl(json.ttd_perawat_ruangan_2) : '',
      TTD_Pasien_Ruangan_2: json.ttd_pasien_ruangan_2 && json.ttd_pasien_ruangan_2 !== '' && isValidFile(json.ttd_pasien_ruangan_2) ? global.storage.cleanUrl(json.ttd_pasien_ruangan_2) : '',
      ID_Dokter_Ruangan_2: json.id_dokter_ruangan_2 ?? '',
      TTD_Dokter_Ruangan_2: json.ttd_dokter_ruangan_2 && json.ttd_dokter_ruangan_2 !== '' && isValidFile(json.ttd_dokter_ruangan_2) ? global.storage.cleanUrl(json.ttd_dokter_ruangan_2) : '',
      ID_Apoteker_Ruangan_2: json.id_apoteker_ruangan_2 ?? '',
      TTD_Apoteker_Ruangan_2: json.ttd_apoteker_ruangan_2 && json.ttd_apoteker_ruangan_2 !== '' && isValidFile(json.ttd_apoteker_ruangan_2) ? global.storage.cleanUrl(json.ttd_apoteker_ruangan_2) : '',
      Unit_Keluar: json.unit_keluar ?? '',
      ID_Ka_Unit_Keluar: json.id_ka_unit_keluar ?? '',
      Waktu_Keluar: json.waktu_keluar ?? '',
      Obat_Keluar: outMeds ?? [],
      ID_Perawat_Keluar: json.id_perawat_keluar ?? '',
      TTD_Perawat_Keluar: json.ttd_perawat_keluar && json.ttd_perawat_keluar !== '' && isValidFile(json.ttd_perawat_keluar) ? global.storage.cleanUrl(json.ttd_perawat_keluar) : '',
      TTD_Pasien_Keluar: json.ttd_pasien_keluar && json.ttd_pasien_keluar !== '' && isValidFile(json.ttd_pasien_keluar) ? global.storage.cleanUrl(json.ttd_pasien_keluar) : '',
      ID_Dokter_Keluar: json.id_dokter_keluar ?? '',
      TTD_Dokter_Keluar: json.ttd_dokter_keluar && json.ttd_dokter_keluar !== '' && isValidFile(json.ttd_dokter_keluar) ? global.storage.cleanUrl(json.ttd_dokter_keluar) : '',
      ID_Apoteker_Keluar: json.id_apoteker_keluar ?? '',
      TTD_Apoteker_Keluar: json.ttd_apoteker_keluar && json.ttd_apoteker_keluar !== '' && isValidFile(json.ttd_apoteker_keluar) ? global.storage.cleanUrl(json.ttd_apoteker_keluar) : '',
    }
  }
}

export class EfekSampingObat {
  static createFromJson(json: IUpdateEfekSampingObat) {
    const receivedMeds: Array<IObatDiterima> = json.obat_diterima && json.obat_diterima.map((item) => {
      return {
        Nama_Obat: item.nama_obat,
        Satuan: item.satuan,
        No_Bets: item.no_bets,
        Aturan_Pakai: item.aturan_pakai,
        Tanggal_Mulai: item.tanggal_mulai,
        Tanggal_Selesai: item.tanggal_selesai,
        Obat_Dicurigai_Check: item.obat_dicurigai_check && item.obat_dicurigai_check === '1' ? '1' : '0',
      }
    })
    return {
      Terjadi_Efek_Samping_Obat: json.terjadi_efek_samping_obat ?? '',
      Waktu: json.waktu ?? '',
      Jenis_Kelamin: json.jenis_kelamin ?? '',
      Status_Hamil: json.status_hamil ?? '',
      Suku_Check: json.suku_check && json.suku_check === '1' ? '1' : '0',
      Nama_Suku: json.nama_suku ?? '',
      Berat_Badan_Check: json.berat_badan_check && json.berat_badan_check === '1' ? '1' : '0',
      Berat_Badan: json.berat_badan ?? '',
      Diagnosa_Utama: json.diagnosa_utama ?? '',
      Kesudahan_Penyakit_Utama: json.kesudahan_penyakit_utama ?? '',
      Riwayat_Hati_Check: json.riwayat_hati_check && json.riwayat_hati_check === '1' ? '1' : '0',
      Riwayat_Ginjal_Check: json.riwayat_ginjal_check && json.riwayat_ginjal_check === '1' ? '1' : '0',
      Riwayat_Lain_Check: json.riwayat_lain_check && json.riwayat_lain_check === '1' ? '1' : '0',
      Riwayat_Lain_Text: json.riwayat_lain_text ?? '',
      Bentuk_Manifestasi_ESO: json.bentuk_manifestasi_eso ?? '',
      Tanggal_Mula_Terjadi: json.tanggal_mula_terjadi ?? '',
      Tanggal_Kesudahan: json.tanggal_kesudahan ?? '',
      Kesudahan_ESO: json.kesudahan_eso ?? '',
      Riwayat_ESO_Sebelum: json.riwayat_eso_sebelum ?? '',
      Obat_Diterima: receivedMeds ?? [],
      Keterangan_Tambahan: json.keterangan_tambahan ?? '',
      Algoritma_Naranjo_1: json.algoritma_naranjo_1 ?? '',
      Algoritma_Naranjo_2: json.algoritma_naranjo_2 ?? '',
      Algoritma_Naranjo_3: json.algoritma_naranjo_3 ?? '',
      Algoritma_Naranjo_4: json.algoritma_naranjo_4 ?? '',
      Algoritma_Naranjo_5: json.algoritma_naranjo_5 ?? '',
      Algoritma_Naranjo_6: json.algoritma_naranjo_6 ?? '',
      Algoritma_Naranjo_7: json.algoritma_naranjo_7 ?? '',
      Algoritma_Naranjo_8: json.algoritma_naranjo_8 ?? '',
      Algoritma_Naranjo_9: json.algoritma_naranjo_9 ?? '',
      Algoritma_Naranjo_10: json.algoritma_naranjo_10 ?? '',
      Total_Skor: json.total_skor ?? '',
      ID_Pelapor: json.id_pelapor ?? '',
      TTD_Pelapor: json.ttd_pelapor && json.ttd_pelapor !== '' && isValidFile(json.ttd_pelapor) ? global.storage.cleanUrl(json.ttd_pelapor) : '',
    }
  }
}

export class PemberianObat {
  static createFromJson(json: IUpdateBeriObat) {
    const d = new Date(json.waktu);
    const date = `${d.getFullYear().toString().padStart(4, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
    const time = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
    return {
      Waktu_Pemberian: json.waktu ?? '',
      Tanggal: date ?? '',
      Waktu: time ?? '',
      Tanda_Tangan_Pasien: json.ttd_pasien && json.ttd_pasien !== '' && isValidFile(json.ttd_pasien) ? global.storage.cleanUrl(json.ttd_pasien) : '',
      Tanda_Tangan_Perawat: json.ttd_perawat && json.ttd_perawat !== '' && isValidFile(json.ttd_perawat) ? global.storage.cleanUrl(json.ttd_perawat) : '',
      ID_Perawat: json.id_perawat ?? '',
    }
  }
}
