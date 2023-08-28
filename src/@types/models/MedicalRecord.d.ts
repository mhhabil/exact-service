interface ISearchMedicalRecordOptions {
	Kode_Cabang:string
	Jenis_Pelayanan:string
	No_MR: string
	Tipe_Pasien?:string
	ID_Pelayanan?: string
	Tanggal_Masuk?:number
	Tanggal_Keluar?: number
	Nama_Pasien?:string
	Options?:SearchOptions
}

interface IPatient {
	Nama: string // Nama
	No_MR: string // No_MR
	No_KTP?: string
	No_BPJS?: string // No_BPJS
	No_HP: string // No_HP
	No_Telepon?: string // No_Telepon
	Tempat_Lahir?: string // Tempat_Lahir
	Tgl_Lahir: string // Tgl_Lahir
	Umur?: string // Umur
	Jenis_Kelamin: string // Jenis_Kelamin
	Pendidikan?: string // Pendidikan
	Pekerjaan?: string // Pekerjaan
	Agama: string // Islam
	Suku?: string // Suku
	Alamat?: string // Alamat
	Provinsi?: string // Provinsi
	Kabupaten?: string // Kabupaten
	Kecamatan?: string
	Kelurahan?: string
	Tgl_Daftar: string // Tgl_Daftar
	Status_Nikah?: string // Status_Nikah
  NIK?: string
}

interface IConfig {
	timezone: string;
	institution_name: string;
	ip: string;
	simrs_port: string;
	dpad: boolean;
	word_templates: any;
	folder_templates: string;
}

interface IRefraksiOptisi_KMB {
	VA: string
	Add: string
	Cyl: string
	Sph: string
	Axis: string
	False: string
	Jagger: string
	Select: string
	Pd_Jauh: string
	Pd_Dekat: string
}

interface IRefraksiOptisi_KML {
	VA: string
	Add: string
	Cyl: string
	Sph: string
	Axis: string
	False: string
	Jagger: string
	Select: string
	Pd_Jauh: string
	Pd_Dekat: string
}

interface IRefraksiOptisi_RPL {
	VA: string
	Add: string
	Cyl: string
	Sph: string
	Axis: string
	False: string
	Jagger: string
	Select: string
	Pd_Jauh: string
	Pd_Dekat: string
	Adaptasi: string
}

interface IRefraksiOptisi_Koreksi_1 {
	VA: string
	Add: string
	Cyl: string
	Sph: string
	Axis: string
	False: string
	Jagger: string
	Select: string
	Pd_Jauh: string
	Pd_Dekat: string
	Adaptasi: string
}

interface IRefraksiOptisi_Koreksi_2 {
	VA: string
	Add: string
	Cyl: string
	Sph: string
	Axis: string
	False: string
	Jagger: string
	Select: string
	Pd_Jauh: string
	Pd_Dekat: string
	Adaptasi: string
}

interface IStation {
	CompanyCode: string;
	QueueStationId: string;
	QueueStationName: string;
	IsActive: number;
	CallType: number;
	Urut: number;
}

interface IPlace {
	CompanyCode: string;
	QueueStationId: string;
	QueuePlaceId: string;
	QueuePlaceName: string;
	OrderBy: number;
}

interface IPlacesAvail {
	CompanyCode: string;
	QueueStationId: string;
	QueueStationNext: string;
	QueueStationName: string;
	Urut: number;
}

interface IQueue {
	company_code: string;
	stations: Array<IStation>;
	places: Array<IPlace>;
	places_avail: Array<IPlacesAvail>;
}

interface IRefraksiOptisi_RPL_Streak {
	VA: string
	Add: string
	Cyl: string
	Sph: string
	Axis: string
	False: string
	Jagger: string
	Select: string
	Pd_Jauh: string
	Pd_Dekat: string
}

interface IRefraksiOptisi {
	Pengkajian_Awal?: IRefraksiOptisi_PengkajianAwal
}

interface IRefraksiOptisi_Data {
	PH: string
	VA: string
	Add: string
	False: string
	Jagger: string
	Schiotz: string
	Non_Contact: string
	Tanam_Lensa: string
	KMB?: IRefraksiOptisi_KMB
	KML?: IRefraksiOptisi_KML
	RPL?: IRefraksiOptisi_RPL
	Koreksi_1?: IRefraksiOptisi_Koreksi_1
	Koreksi_2?: IRefraksiOptisi_Koreksi_2
	RPL_Streak?: IRefraksiOptisi_RPL_Streak
}


interface IRefraksiOptisi_PengkajianAwal {
	OD?: IRefraksiOptisi_Data
	OS?: IRefraksiOptisi_Data
	Waktu: string
	ID_Petugas: string
	Nama_Petugas: string
	ID_Petugas_RO: string
	TTD_Petugas_RO: string
	Nama_Petugas_RO: string
	Catatan_Lain: string
	ID_Keluhan?: string
	Keluhan?: string
	Keluhan_Lain?: string
	Diagnosa?: string
	Terapi?: string
	Anjuran?: string
	TTD_Pasien: string
	Updated_At: string
	Updated_By: string
	Updated_By_Name: string
}

interface IPatientGuardian {
	Hubungan?: string
	Nama?: string
	Alamat?: string
	No_Telepon?: string
	Suku?: string
}
interface IDataUtilities {
  Kruk: number;
  Tripot: number;
  Kursi_Roda: number;
  Orang_Lain: number;
}

interface IFallRiskForm {
  Waktu: string;
  Berjalan_Tidak_Seimbang: number | undefined;
  Berjalan_Alat_Bantu: number | undefined;
  Berjalan_Alat_Bantu_Data: IDataUtilities;
  Menopang: number | undefined;
  Hasil_Angka: number | undefined;
  Hasil_Teks: string;
  Keterangan_Hasil: string;
  Tindakan_Tidak_Ada_Berisiko: number | undefined;
  Tindakan_Rendah_Edukasi: number | undefined;
  Tindakan_Tinggi_Pasang_Stiker: number | undefined;
  Tindakan_Tinggi_Kuning: number | undefined;
  Tindakan_Tinggi_Edukasi: number | undefined;
  Tanda_Tangan: string;
  Tanggal_Pengkaji: string;
  Tanggal_Hasil: string;
  Tanggal_Tindakan: string;
  ID_Tanda_Tangan: string;
  Nama_Tanda_Tangan: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;
}

interface IToolInspectionReport {
	Pemeriksaan_Biometri?: { [key: string]: { [key: string]: string } }
}

interface IJenisPenyakit {
  Dm: number;
  Hati: number;
  Paru: number;
  Ginjal: number;
  Kanker: number;
  Stroke: number;
  Jantung: number;
  Lain_lain: number;
  Penurunan_Imunitas_Geriatri: number;
}

interface IKetergantunganTerhadap {
  Rokok: number;
  Alkohol: number;
  Lain_lain: number;
  Obat_obatan: number;
}

interface IPengkajianAwalKeperawatanForm {
  P: string;
  Bb: string;
  Tb: string;
  Td: string;
  Nadi: string;
  Suhu: string;
  Nyeri: string;
  Bicara: string;
  Agama_Id: string;
  Kesadaran: string;
  Tabel_Tio: number;
  ID_Petugas: string;
  Komplikasi: string;
  Total_Skor: string;
  Updated_At: string;
  Updated_By: string;
  Bicara_Text: string;
  Skala_Nyeri: string;
  Tabel_Jatuh: number;
  Tabel_Nyeri: number;
  Asupan_Makan: string;
  Durasi_Nyeri: string;
  Lokasi_Nyeri: string;
  Nama_Petugas: string;
  Nyeri_Hilang: string;
  Skor_Nutrisi: string;
  Status_Nyeri: string;
  Cara_Berjalan: string;
  Status_Mental: string;
  Status_Sosial: string;
  Tabel_Infeksi: number;
  Tabel_Lainnya: number;
  Tabel_Wajah: string;
  Tabel_Kaki: string;
  Tabel_Aktifitas: string;
  Tabel_Menangis: string;
  Tabel_Kenyamanan: string;
  Waktu_Operasi: string;
  Bahasa_Isyarat: string;
  Jenis_Penyakit: IJenisPenyakit;
  Riwayat_Alergi: string;
  Skrining_Nyeri: string;
  Status_Ekonomi: string;
  Tabel_Gangguan: number;
  Diagnosa_Khusus: string;
  Frekwensi_Nyeri: string;
  Hambatan_Belajar: string;
  Hasil_Total_Skor: string;
  Nutrisi_Turun_Bb: string;
  Penanggung_Jawab: string;
  Perlu_Penerjemah: string;
  Status_Psikologi: string;
  Memegang_Penopang: string;
  Skor_Risiko_Jatuh: string;
  Status_Fungsional: string;
  Status_Mental_Text: string;
  Status_Ekonomi_Text: string;
  Tingkatan_Pendidikan: string;
  Hambatan_Belajar_Text: string;
  Jenis_Operasi_Dialami: string;
  Penanggung_Jawab_Nama: string;
  Perlu_Penerjemah_Text: string;
  Status_Psikologi_Text: string;
  Tabel_Masalah_Lainnya: string;
  Tabel_Rencana_Lainnya: string;
  Nyeri_Hilang_Lain_Text: string;
  Keterangan_Risiko_Jatuh: string;
  Ketergantungan_Terhadap: IKetergantunganTerhadap;
  Penanggung_Jawab_Alamat: string;
  Hubungan_Pasien_Keluarga: string;
  Mempunyai_Ketergantungan: string;
  Tabel_Kurang_Pengetahuan: number;
  Penanggung_Jawab_Hubungan: string;
  Riwayat_Alergi_Keterangan: string;
  Riwayat_Penyakit_Keluarga: string;
  Tingkatan_Pendidikan_Text: string;
  ID_Perawat_Pengkajian_Masuk: string;
  Status_Fungsional_Keterangan: string;
  TTD_Perawat_Pengkajian_Masuk: string;
  Beritahu_Dokter_Risiko_Cedera: string;
  Nama_Perawat_Pengkajian_Masuk: string;
  Jenis_Penyakit_Lain_Keterangan: string;
  Nama_Perawat_Pengkajian_Keluar: string;
  Beritahu_Dokter_Pemeriksaan_Fisik: string;
  Ketergantungan_Terhadap_Keterangan: string;
  Ketergantungan_Terhadap_Penjelasan: string;
  Status_Fungsional_Diberitahukan_Pukul: string;
  Beritahu_Dokter_Pemeriksaan_Fisik_Pukul: string;
  TTD_Perawat_Pengkajian_Keluar: string;
  ID_Perawat_Pengkajian_Keluar: string;
}

interface IChecklistPraOperasi {
  Dokter_Anestesi_Nama: string;
  T: string
  Bb: string
  Rr: string
  Tb: string
  Td: string
  Ekg: string
  Sat: string
  Nadi: string
  Hamil: string
  Lensa: string
  Puasa: string
  Alergi: string
  Lokasi: string
  Makula: string
  Rambut: string
  Implant: string
  Tanggal: string
  Anestesi: string
  Biometri: string
  Gliserin: string
  Kosmetik: string
  Usg_Mata: string
  Jam_Mulai: string
  Needle_No: string
  Perhiasan: string
  Radiologi: string
  Gigi_Palsu: string
  ID_Petugas: string
  Pembedahan: string
  Updated_At: string
  Updated_By: string
  Foto_Fundus: string
  Cairan_Masuk: string
  Jenis_Cairan: string
  Jenis_Pasien: string
  Laboratorium: string
  Nama_Petugas: string
  Pre_Medikasi: string
  Resiko_Jatuh: string
  Gelang_Alergi: string
  Kandung_Kemih: string
  Rhesus_Fektor: string
  Golongan_Darah: string
  Inform_Consent: string
  Infus_Dipasang: string
  Catatan_Perawat: string
  Gelang_Pengenal: string
  Persiapan_Darah: string
  Izin_Sterilisasi: string
  Kondisi_Kulit_Id: string
  Puasa_Keterangan: string
  Alergi_Keterangan: string
  Nama_Kepala_Bedah: string
  Pemeriksaan_Lainnya: string
  Inform_Consent_Bedah: string
  Nama_Perawat_Penerima: string
  Nama_Perawat_Pengantar: string
  Tanda_Tangan_Kepala_Bedah: string
  Persiapan_Darah_Keterangan: string
  ID_Tanda_Tangan_Kepala_Bedah: string
  Tanda_Tangan_Perawat_Penerima: string
  Tanda_Tangan_Perawat_Pengantar: string
  ID_Tanda_Tangan_Perawat_Penerima: string
  ID_Tanda_Tangan_Perawat_Pengantar: string
}

interface ISelect {
  Select: string | null;
}

interface IODOSDetail {
  KMB: ISelect;
  KML: ISelect;
  RPL: ISelect;
  Koreksi_1: ISelect;
  Koreksi_2: ISelect;
  RPL_Streak: ISelect;
}

interface IBPRJ {
	OD: IODOSDetail;
  OS: IODOSDetail;
  TD: string;
  KGD: string;
  Waktu: string;
  ID_Dokter: string;
  TTD_Dokter: string;
  Updated_At: string;
  Updated_By: string;
  Nama_Dokter: string;
  Sip_Dokter: string
  Tanggal_TTD: string;
  Tanda_Tangan_Wali: string;
  Tanda_Tangan_Radio: string;
  Tanda_Tangan_Pasien: string;
}

interface IPemberianInformasi {
  Nama_Template: string;
  Risiko: string
  Tujuan: string
  Hal_Lain: string
  Diagnosis: string
  Prognosis: string
  Tata_Cara: string
  ID_Petugas: string
  Komplikasi: string
  TTD_Pasien: string
  Updated_At: string
  Updated_By: string
  Nama_Petugas: string
  Risiko_Check: string
  Tujuan_Check: string
  Hal_Lain_Check: string
  Dasar_Diagnosis: string
  Diagnosis_Check: string
  Prognosis_Check: string
  Tata_Cara_Check: string
  Diagnosis_Custom: string
  Dokter_Pelaksana: string
  Komplikasi_Check: string
  Alternatif_Risiko: string
  Indikasi_Tindakan: string
  Penerima_Informasi: string
  Hal_Lain_Konsultasi: number
  ID_Dokter_Pelaksana: string
  Tindakan_Kedokteran: string
  ID_Pemberi_Informasi: string
  TTD_Dokter_Pelaksana: string
  Dasar_Diagnosis_Check: string
  Nama_Dokter_Pelaksana: string
  Tata_Cara_Tipe_Sedasi: number
  Nama_Pemberi_Informasi: string
  Alternatif_Resiko_Check: string
  Indikasi_Tindakan_Check: string
  Tata_Cara_Uraian_Singkat: number
  Nama_Tanda_Tangan_Petugas: string
  Tindakan_Kedokteran_Check: string
  Hal_Lain_Perluasan_Tindakan: number
  Alternatif_Risiko_Pilihan_Pengobatan: number
  Nama_Dokter_Pelaksana_Informasi: string;
}

interface IPersetujuanTindakanDokter {
  Dokter_Pelaksana: string
  Kota: string
  Waktu: string
  ID_Saksi: string
  ID_Petugas: string
  Nama_Saksi: string
  Updated_At: string
  Updated_By: string
  Pasien_Kota: string
  Nama_Petugas: string
  Tanda_Tangan: string
  Tindakan_Operasi: string
  Pernyataan_Id: string
  Pasien_Tanggal: string
  Tanda_Tangan_JK: string
  Tanda_Tangan_Nama: string
  Tanda_Tangan_Telp: string
  Tanda_Tangan_Saksi: string
  Nama_Saksi_Keluarga: string
  Tanda_Tangan_Alamat: string
  Tanda_Tangan_Pasien: string
  Tanda_Tangan_Saksi_2: string
  Nama_Dokter_Pelaksana: string
  Tanda_Tangan_Hubungan: string
  Tanda_Tangan_TglLahir: string
  Tanggal_TTD: string;
}

interface IRajalCatatanKeperawatanPraOp {
  Bb: string;
  Rr: string;
  Tb: string;
  Td: string;
  Kgd: string;
  Nadi: string;
  Suhu: string;
  Alergi: string;
  Tanggal: string;
  Alat_Bantu: string;
  ID_Petugas: string;
  Updated_At: string;
  Updated_By: string;
  Skala_Nyeri: string;
  Nama_Petugas: string;
  Status_Mental: IStatusMental;
  Persiapan_Kulit: number;
  Persiapan_Puasa: number;
  Riwayat_Penyakit: IRiwayatPenyakit;
  Alergi_Keterangan: string;
  Lain_Site_Marking: number;
  ID_Perawat_Ruangan: string;
  Operasi_Sebelumnya: string;
  ID_Perawat_Penerima: string;
  Pengobatan_Saat_Ini: string;
  TTD_Perawat_Ruangan: string;
  Nama_Perawat_Ruangan: string;
  Persiapan_Alat_Bantu: number;
  TTD_Perawat_Penerima: string;
  Alat_Bantu_Keterangan: string;
  Nama_Perawat_Penerima: string;
  Operasi_Sebelumnya_Di: string;
  Pemeriksaan_Penunjang: IPemeriksaanPenunjang;
  Penjelasan_Singkat: number;
  Penjelasan_Singkat_Keterangan: string;
  Site_Marking: number;
  Site_Marking_Keterangan: string;
  Lain_Penjelasan_Singkat: number;
  Persiapan_Prothese_Luar: number;
  Persiapan_Prothese_Dalam: number;
  Persiapan_Vaskuler_Akses: number;
  Persiapan_Obat_Disertakan: number;
  Persiapan_Penjepit_Rambut: number;
  Verifikasi_Periksa_Gelang: number;
  Operasi_Sebelumnya_Tanggal: string;
  Persiapan_Kulit_Keterangan: string;
  Persiapan_Puasa_Keterangan: string;
  Riwayat_Penyakit_Keterangan: string;
  Verifikasi_Kelengkapan_X_Ray: number;
  Verifikasi_Periksa_Identitas: number;
  Operasi_Sebelumnya_Keterangan: string;
  Verifikasi_Surat_Izin_Operasi: number;
  Pengobatan_Saat_Ini_Keterangan: string;
  Persiapan_Alat_Bantu_Keterangan: string;
  Verifikasi_Jenis_Lokasi_Operasi: number;
  Verifikasi_Persetujuan_Anestesi: number;
  Pemeriksaan_Penunjang_Keterangan: string;
  Persiapan_Obat_Terakhir_Diberikan: number;
  Persiapan_Prothese_Luar_Keterangan: string;
  Verifikasi_Surat_Pengantar_Operasi: number;
  Persiapan_Prothese_Dalam_Keterangan: string;
  Persiapan_Vaskuler_Akses_Keterangan: string;
  Verifikasi_Kelengkapan_Resume_Medis: number;
  Persiapan_Obat_Disertakan_Keterangan: string;
  Persiapan_Penjepit_Rambut_Keterangan: string;
  Verifikasi_Masalah_Bahasa_Komunikasi: number;
  Verifikasi_Periksa_Gelang_Keterangan: string;
  Verifikasi_Kelengkapan_X_Ray_Keterangan: string;
  Verifikasi_Periksa_Identitas_Keterangan: string;
  Verifikasi_Surat_Izin_Operasi_Keterangan: string;
  Verifikasi_Jenis_Lokasi_Operasi_Keterangan: string;
  Verifikasi_Persetujuan_Anestesi_Keterangan: string;
  Persiapan_Obat_Terakhir_Diberikan_Keterangan: string;
  Verifikasi_Surat_Pengantar_Operasi_Keterangan: string;
  Verifikasi_Kelengkapan_Resume_Medis_Keterangan: string;
  Verifikasi_Masalah_Bahasa_Komunikasi_Keterangan: string;
}

interface IPenandaanAreaPembedahan {
  ID_Perawat: string
  ID_Petugas: string
  Updated_At: string
  Updated_By: string
  Gambar_Body: string
  Gambar_Head: string
  Nama_Perawat: string
  Nama_Petugas: string
  Tanggal_Operasi: string
  Dokter_Pelaksana: string
  Prosedur_Operasi: string
  Dokter_Operasi_Id: string
  Dokter_Operasi_Nama: string
  Tanda_Tangan_Pasien: string
  TTD_Dokter_Pelaksana: string
  Tanda_Tangan_Perawat: string
  Nama_Dokter_Pelaksana: string
}

interface ISerahTerimaPasien {
  N: string
  T: string
  Pa: string
  Rr: string
  Td: string
  Mual: string
  Infus: string
  Minum: string
  Anestesi: string
  Kesadaran: string
  Kesakitan: string
  Lain_lain: string
  Luka_Lain: string
  Obat_Lain: string
  Antibiotik: string
  ID_Petugas: string
  Tetes_Mata: string
  Updated_At: string
  Updated_By: string
  Luka_Operasi: string
  Nama_Petugas: string
  Steward_Score: string
  Alderette_Score: string
  Penanggungjawab: string
  Steward_Motorik: string
  Waktu_Verifikasi: string
  Monitoring_Selama: string
  Monitoring_Setiap: string
  Steward_Kesadaran: string
  Steward_Pernafasan: string
  Alderette_Aktivitas: string
  Alderette_Kesadaran: string
  Alderette_Sirkulasi: string
  Alderette_Pernafasan: string
  Penanggungjawab_Lain: string
  Alderette_Warna_Kulit: string
  ID_Perawat_Kamar_Bedah: string
  ID_Perawat_Ranap_Rajal: string
  TTD_Perawat_Kamar_Bedah: string
  TTD_Perawat_Ranap_Rajal: string
  Nama_Perawat_Kamar_Bedah: string
  Nama_Perawat_Ranap_Rajal: string
  Steward_Motorik_Keterangan: string
  Steward_Kesadaran_Keterangan: string
  Steward_Pernafasan_Keterangan: string
  Alderette_Aktivitas_Keterangan: string
  Alderette_Kesadaran_Keterangan: string
  Alderette_Sirkulasi_Keterangan: string
  Alderette_Pernafasan_Keterangan: string
  Alderette_Warna_Kulit_Keterangan: string
}

interface IKonsultasi {
  ID: string;
  Tab: string;
  Rumah_Sakit_Tujuan: string;
  Dokter_Konsul_Nama_Eksternal: string;
  Tanggal_Konsul?: any;
  CPPT_ID?: string;
  Diagnosa: string;
  Terapi: string;
  Yth_Dokter_Konsul_Nama: string;
  Yth_Dokter_Konsul_Id: string;
  Status_Konsultasi: string;
  Balas_Resep: any;
  TTD_Dokter_Konsultasi: string;
  ID_Dokter_Konsultasi: string;
  Nama_TTD_Dokter_Konsultasi: string;
  Tanggal_Balas?: any;
  Anjuran: string;
  Yth_Dokter_Balas_Nama: string;
  Yth_Dokter_Balas_Id: string;
  TTD_Dokter_Balas_Konsultasi: string;
  ID_Dokter_Balas_Konsultasi: string;
  Nama_TTD_Dokter_Balas_Konsultasi: string;
  Deleted: number;
  ID_Petugas: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;
}

interface IRawatJalan {
	No_Berobat?: string
	Tgl_Berobat?: string
	Jam_Kunjungan?: string
	ID_Dokter?: string
  ID_Dokter_OK?: string;
  Nama_Dokter_OK?: string;
	Nama_Dokter?: string
	No_Rujukan?: string
	Asal_Rujukan?: string
	Dokter_Merujuk?: string
	Penanganan?: string
	Kasus?: string
	Gawat_Darurat?: number
  Status_Konsultasi?: string;
	Keterangan?: string
	ID_Paket_Operasi?: string
	Nama_Paket_Operasi?: string
	Jenis_Operasi?: string
	ID_Tipe_Tagihan?: string
	Nama_Tipe_Tagihan?: string
	Batal_Berobat?: number
	Status_Bayar?: string
	Tagihan_Pemeriksaan?: string
	Invoice_No?: string
	Cara_Masuk?: string
	Cara_Keluar?: string
	Sebab_Penyakit?: string
  Pemberian_Informasi?: IPemberianInformasi
	Pengkajian_Awal?: IFormPengkajianAwalDokter
	Pengkajian_Awal_Keperawatan?: IPengkajianAwalKeperawatanForm
  Persetujuan_Tindakan_Dokter?: IPersetujuanTindakanDokter
	Risiko_Jatuh?: IFallRiskForm;
	Laporan_Hasil_Alat_Pemeriksaan?: IToolInspectionReport;
	Bukti_Pelayanan?: IBPRJ;
  Catatan_Keperawatan_Pra_Operasi?: IRajalCatatanKeperawatanPraOp;
  Checklist_Pra_Operasi?: IChecklistPraOperasi;
  Penandaan_Area_Pembedahan?: IPenandaanAreaPembedahan;
  Serah_Terima_Pasien?: ISerahTerimaPasien;
  Konsultasi?: Array<IKonsultasi>;
}

interface Penyakit {
  Dm: number
  Hati: number
  Lain: number
  Paru: number
  Ginjal: number
  Kanker: number
  Stroke: number
  Jantung: number
  Geriatri: number
}

interface NyeriHilang {
  Istirahat: number
  Minum_Obat: number
  Posisi_Tidur: number
  Mendengar_Musik: number
  Lainnya: number
}

interface JenisHambatan {
  Lain: number
  Agama: number
  Emosi: number
  Fisik: number
  Bahasa: number
  Budaya: number
  Kognitif: number
  Pendengaran: number
  Penglihatan: number
}

interface PemeriksaanFisik {
  Nadi: string
  Suhu: string
  Pernafasan: string
  Berat_Badan: string
  Tinggi_Badan: string
  Tekanan_Darah: string
}

interface TopikPembelajaran {
  Lain: number
  Obat: number
  Keperawatan: number
  Diet_Nutrisi: number
  Rehabilitasi: number
  Manajemen_Nyeri: number
  Diagnosis_Manajemen_Penyakit: number
}

interface IBarthex {
  Makan: string;
  Mandi: string;
  Perawatan_Diri: string;
  Berpakaian: string;
  BAK: string;
  BAB: string;
  Penggunaan_Toilet: string;
  Transfer: string;
  Mobilitas: string;
  Naik_Turun_Tangga: string;
}

interface IRanapPengkajianAwalKeperawatanDewasa {
  RPO: string
  RPT: string
  Agama: string
  Agama_Id: string
  Diagnosa: string
  Hambatan: string
  Penyakit: Penyakit
  Skrining_Nyeri: string;
  Provocating: string;
  Quality: string;
  Region: string;
  Severity: string;
  Time: string;
  ID_Petugas: string
  Updated_At: string
  Updated_By: string
  Jenis_Nyeri: string
  Nutrisionis: string
  Skala_Nyeri: string
  Asupan_Makan: string
  Kerabat_Nama: string
  Nama_Petugas: string
  Nyeri_Hilang: NyeriHilang
  Risiko_Jatuh: string
  Keluhan_Utama: string
  Status_Mental: string
  Gambar_Mata_OD: string
  Gambar_Mata_OS: string
  Jenis_Hambatan: JenisHambatan
  Nilai_Nilai: string
  Keyakinan: string;
  Pernah_Dirawat: string
  Tempat_Tinggal: string
  Diagnosa_Khusus: string
  Lokasi_Nyeri_Id: string
  Kerabat_Hubungan: string
  Nutrisi_Turun_Bb: string
  Implant_Terpasang: string
  Pemeriksaan_Fisik: PemeriksaanFisik
  Status_Fungsional: string
  Status_Psikologis: string
  Kegiatan_Spiritual: string
  Kerabat_No_Telepon: string
  Topik_Pembelajaran: TopikPembelajaran
  Waktu_Penilaian_Id: string
  Alat_Bantu_Jalan_Id: string
  Nutrisionis_Tanggal: string
  Riwayat_Alergi_Tidak_Check: string
  Riwayat_Alergi_Obat_Check: string;
  Riwayat_Alergi_Makanan_Check: string;
  Riwayat_Alergi_Lainnya_Check: string;
  Riwayat_Alergi_Klip_Tanda_Check: string;
  Riwayat_Alergi_Tidak_Diketahui_Check: string;
  Intensitas_Aktivitas_Id: string
  Intensitas_Istirahat_Id: string
  Hubungan_Pasien_Keluarga: string
  Penyakit_Lain_Keterangan: string
  Tanggal_Masuk_Rawat_Inap: string
  Pernah_Dirawat_Keterangan: string
  Tempat_Tinggal_Keterangan: string
  Riwayat_Alergi_Obat_Reaksi: string
  ID_Perawat_Pengkajian_Masuk: string
  ID_Perawat_Pengkajian_Keluar: string
  Implant_Terpasang_Keterangan: string
  Status_Fungsional_Keterangan: string
  Status_Psikologis_Keterangan: string
  TTD_Perawat_Pengkajian_Masuk: string
  Nama_Perawat_Pengkajian_Masuk: string
  Riwayat_Alergi_Lainnya_Reaksi: string
  Riwayat_Alergi_Makanan_Reaksi: string
  Riwayat_Pengobatan_Sebelumnya: string
  Status_Mental_Lain_Keterangan: string
  Keperawatan_1_Check: string;
  Keperawatan_2_Check: string;
  Keperawatan_3_Check: string;
  Keperawatan_4_Check: string;
  Keperawatan_5_Check: string;
  Keperawatan_6_Check: string;
  Keperawatan_7_Check: string;
  Keperawatan_8_Check: string;
  Keperawatan_9_Check: string;
  Masalah_Keperawatan_Lainnya_Text: string;
  Rencana_Keperawatan_Lainnya_Text: string;
  TTD_Perawat_Pengkajian_Keluar: string
  Jenis_Hambatan_Lain_Keterangan: string
  Nama_Perawat_Pengkajian_Keluar: string
  Riwayat_Alergi_Obat_Keterangan: string
  Riwayat_Alergi_Lainnya_Keterangan: string
  Riwayat_Alergi_Makanan_Keterangan: string
  Status_Mental_Kekerasan_Keterangan: string
  Topik_Pembelajaran_Lain_Keterangan: string
  Sebelum_Sakit: IBarthex;
  Saat_Masuk_RS: IBarthex;
  Minggu_2_RS: IBarthex;
  Minggu_3_RS: IBarthex;
  Minggu_4_RS: IBarthex;
  Saat_Pulang: IBarthex;
  Sebelum_Sakit_Total: string;
  Saat_Masuk_Total: string;
  Minggu_2_Total: string;
  Minggu_3_Total: string;
  Minggu_4_Total: string;
  Saat_Pulang_Total: string;
}

interface IRanapPengkajianAwalKeperawatanAnak {
  Tanggal: string;
  Jam: string;
  Pengkajian_Diperoleh: string | null;
  Keluhan_Utama: string;
  Riwayat_Penyakit_Sekarang: string;
  Riwayat_Penyakit_Dahulu: string;
  Riwayat_Pengobatan: string;
  Riwayat_Operasi_Radio: string | null;
  Riwayat_Operasi_Ya_Teks: string;
  Riwayat_Penyakit_Hipertensi: string;
  Riwayat_Penyakit_Asma: string;
  Riwayat_Penyakit_Diabetes: string;
  Riwayat_Penyakit_Hepatitis: string;
  Riwayat_Penyakit_Glaukoma: string;
  Riwayat_Penyakit_Stroke: string;
  Riwayat_Penyakit_Lainnya: string;
  Riwayat_Penyakit_Lainnya_Teks: string;
  Lama_Kehamilan: string;
  Komplikasi_Radio: string | null;
  Komplikasi_Radio_Ket: string;
  Neonatus_Radio: string | null;
  Neonatus_Radio_Ket: string;
  Maternal_Radio: string | null;
  Maternal_Radio_Ket: string;
  Imunisasi_BCG: string;
  Imunisasi_Polio_1: string;
  Imunisasi_Polio_2: string;
  Imunisasi_Polio_3: string;
  Imunisasi_Hepatitis_1: string;
  Imunisasi_Hepatitis_2: string;
  Imunisasi_Hepatitis_3: string;
  Imunisasi_Varicela: string;
  Imunisasi_DPT_1: string;
  Imunisasi_DPT_2: string;
  Imunisasi_DPT_3: string;
  Imunisasi_Typhus: string;
  Imunisasi_Campak: string;
  Imunisasi_MMR: string;
  Imunisasi_Lainnya_2: string;
  Imunisasi_Lainnya_2_Teks: string;
  Imunisasi_Influenza: string;
  Imunisasi_Lainnya_1: string;
  Imunisasi_Lainnya_1_Teks: string;
  BB_Lahir: string;
  PB_Lahir: string;
  ASI_Umur: string;
  Makan_Tambahan_Umur: string;
  Berjalan_Umur: string;
  Tengkurap_Umur: string;
  Duduk_Umur: string;
  Merangkak_Umur: string;
  Berdiri_Umur: string;
  Asesmen_Remaja_1: string | null;
  Asesmen_Remaja_2: string | null;
  Asesmen_Remaja_3: string | null;
  Asesmen_Remaja_4: string | null;
  Asesmen_Remaja_5: string | null;
  Asesmen_Remaja_6: string | null;
  Asesmen_Remaja_7: string | null;
  Asesmen_Remaja_8: string | null;
  Asesmen_Remaja_9: string | null;
  Asesmen_Remaja_10: string | null;
  Asesmen_Remaja_11: string | null;
  Asesmen_Remaja_12: string | null;
  PF_TD: string;
  PF_Nadi: string;
  PF_Suhu: string;
  PF_BB: string;
  PF_P: string;
  PF_TB: string;
  Kesadaran_Radio: string | null;
  Alergi_Reaksi_Radio: string | null;
  Nyeri_Radio: string | null;
  Pengkajian_Nyeri: string | null;
  Wajah_Radio: string | null;
  Kaki_Radio: string | null;
  Aktivitas_Radio: string | null;
  Menangis_Radio: string | null;
  Kenyamanan_Radio: string | null;
  Penyebab_Nyeri: string;
  Kualitas_Nyeri: string;
  Lokasi_Nyeri: string;
  Skala_Nyeri: string;
  Durasi_Nyeri: string;
  Total_Skor: string;
  Kategori_Nyeri: string;
  Skala_Nyeri_Radio: string | null;
  Skrining_Gizi_1: string | null;
  Skrining_Gizi_2: string | null;
  Skrining_Gizi_3: string | null;
  Skrining_Gizi_4: string | null;
  Skrining_Gizi_Total: string;
  Kategori_Nilai_Gizi: string;
  Keterbatasan_Gerak_Radio: string | null;
  Nyeri_Otot: string;
  Kelemahan: string;
  Kaku_Otot: string;
  Amputasi: string;
  Lemah_Otot: string;
  Deformitas: string;
  Nyeri_Sendi: string;
  Parese: string;
  Parese_Dibagian: string;
  Bengkak_Sendi: string;
  Inkoordinasi: string;
  Tidur_Malam: string;
  Tidur_Siang: string;
  Kesulitan_Tidur_Radio: string | null;
  Sebelum_Sakit: IBarthex;
  Saat_Masuk_RS: IBarthex;
  Minggu_2_RS: IBarthex;
  Minggu_3_RS: IBarthex;
  Minggu_4_RS: IBarthex;
  Saat_Pulang: IBarthex;
  Sebelum_Sakit_Total: string;
  Saat_Masuk_Total: string;
  Minggu_2_Total: string;
  Minggu_3_Total: string;
  Minggu_4_Total: string;
  Saat_Pulang_Total: string;
  Resiko_Jatuh_Radio: string | null;
  Bicara_Radio: string | null;
  Perlu_Penerjemah_Radio: string | null;
  Hambatan_Belajar_Radio: string | null;
  Tingkat_Pendidikan_Radio: string | null;
  Tingkat_Pendidikan_Lain_Teks: string;
  Status_Ekonomi_Radio: string | null;
  Status_Psikologi_Tidak_Terganggu: string;
  Status_Psikologi_Cemas: string;
  Status_Psikologi_Takut: string;
  Status_Psikologi_Marah: string;
  Status_Psikologi_Panik: string;
  Status_Mental_Radio: string | null;
  Sosial_Radio: string | null;
  Agama: string;
  Keyakinan: string;
  Nilai_Nilai: string;
  Spiritual: string;
  Selama_Keperawatan: string;
  Keperawatan_Persepsi_Sensori: string;
  Keperawatan_Penurunan_Kesadaran: string;
  Keperawatan_Nyeri: string;
  Keperawatan_Resiko_Infeksi: string;
  Keperawatan_Intake_Output: string;
  Keperawatan_Resiko_Jatuh: string;
  Keperawatan_Hiperthermia: string;
  Keperawatan_Tekanan_Intra: string;
  Keperawatan_Kurang_Pengetahuan: string;
  Keperawatan_Lainnya: string;
  Keperawatan_Lainnya_Masalah: string;
  Keperawatan_Lainnya_Rencana: string;
  ID_Perawat_Pengkaji: string;
  Nama_Perawat_Pengkaji: string;
  TTD_Perawat_Pengkaji: string
  ID_Petugas: string;
  Updated_At: string;
  Updated_By: string;
  Nama_Petugas: string;
}

interface IEarlyWarningScoring {
  ID: string;
  Waktu_Pengkajian: string;
  Rr: string;
  Rr_Skor: string;
  Tipe_Ews: string;
  Nadi: string;
  Nadi_Skor: string;
  Perilaku: string;
  Perilaku_Skor: string;
  Kardiovaskular: string;
  Kardiovaskular_Skor: string;
  Td: string;
  Td_Skor: string;
  Suhu_Tubuh: string;
  Suhu_Tubuh_Skor: string;
  Tingkat_Kesadaran: string;
  Tingkat_Kesadaran_Skor: string;
  Tingkat_Kesadaran_Teks: string;
  Total_Skor: string;
  Keterangan: string;
  Pengkaji_Id: string;
  Pengkaji: string;
  Unit_Pengkaji: 'Rawat Inap';
  Updated_At: string;
  Updated_By: string;
}

interface IBantuan {
  Diet: number
  Makan: number
  Mandi: number
  Minum: number
  Edukasi: number
  Berpakaian: number
  Transportasi: number
  Menyiapkan_Makanan: number
}

interface IRencanaPemulanganPasien {
  Bantuan: IBantuan
  Edukasi_Kesehatan: string;
  Edukasi_Kesehatan_Keterangan: string;
  Keterampilan_Khusus: string;
  Keterampilan_Khusus_Keterangan: string;
  Jadwal_Kontrol: string;
  Jadwal_Kontrol_Keterangan: string;
  Obat_Pulang_Check: string;
  Obat_Pulang_Waktu: string;
  Obat_Pulang_Keterangan: string;
  Surat_Kontrol_Check: string;
  Surat_Kontrol_Waktu: string;
  Surat_Kontrol_Keterangan: string;
  ID_Perawat_Pengkaji: string;
  Tanda_Tangan_Perawat_Pengkaji: string;
  Nama_Perawat_Pengkaji: string;
  Tanda_Tangan_Pasien: string;
  ID_Petugas: string
  Updated_At: string
  Updated_By: string
  Pasien_Dpjp: string
  Nama_Petugas: string
  Nyeri_Kronis: string
  Pasien_Alasan: string
  Bantuan_Khusus: string
  Pasien_Perawat: string
  Pasien_Tanggal: string
  Bantuan_Pribadi: string
  Tinggal_Sendiri: string
  Waktu_Discharge: string
  Antisipasi_Pulang: string
  Pengaruh_Keluarga: string
  Pengaruh_Keuangan: string
  Peralatan_Sendiri: string
  Alat_Bantu_Sendiri: string
  Membantu_Keperluan: string
  Pengaruh_Pekerjaan: string
  Pasien_Perawat_Nama: string
  Pasien_Diagnosa_Medis: string
  Nyeri_Kronis_Keterangan: string
  Bantuan_Khusus_Keterangan: string
  Bantuan_Pribadi_Keterangan: string
  Estimasi_Pemulangan_Pasien: string
  Tinggal_Sendiri_Keterangan: string
  Antisipasi_Pulang_Keterangan: string
  Peralatan_Sendiri_Keterangan: string
  Alat_Bantu_Sendiri_Keterangan: string
  Membantu_Keperluan_Keterangan: string
  Nama_Dokter_DPJP: string;
}

interface IPengkajianResikoJatuhAnak {
  ID: string;
  Waktu_Pengkajian: string;
  Usia: string;
  Jenis_Kelamin: string;
  Diagnosa: string;
  Gangguan_Kognitif: string;
  Faktor_Lingkungan: string;
  Respon_Operasi: string;
  Penggunaan_Obat: string;
  Keterangan_Waktu_Pengkajian_Id: string;
  Pengkaji_Id: string;
  Pengkaji: string;
  Unit_Pengimplementasi: string;
  Total_Skor: string;
  Resiko_Jatuh: string;
  Resiko_Jatuh_Keterangan: string;
  Usia_Radio: string;
  Jenis_Kelamin_Radio: string;
  Diagnosa_Radio: string;
  Gangguan_Kognitif_Radio: string;
  Faktor_Lingkungan_Radio: string;
  Respon_Operasi_Radio: string;
  Penggunaan_Obat_Radio: string;
  Unit_Pengkaji: string;
  Ruangan: string;
  Lembar: string;
  TTD_Petugas: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;
}

interface IPengkajianResikoJatuhDewasa {
  ID: string
  Waktu_Pengkajian: string
  Riwayat_Jatuh: string
  Diagnosa_Sekunder: string
  Alat_Bantu_Jalan: string
  Pasien_Diinfus: string
  Cara_Berjalan: string
  Kondisi_Mental: string
  Keterangan_Waktu_Pengkajian_Id: string
  Total_Skor: string
  Resiko_Jatuh: string
  Resiko_Jatuh_Keterangan: string
  Pengkaji_Id: string
  Pengkaji: string
  Unit_Pengkaji: string
  TTD_Petugas: string
  ID_Petugas: string
  Nama_Petugas: string
  Updated_At: string
  Updated_By: string
}

interface ICatatanMedisAwal {
  CPPT_ID?: string
  Submit_Retina: string;
  No_Berobat: string;
  Riwayat_Pekerjaan: string;
  Pekerjaan_Zat_Berbahaya: string;
  Pekerjaan_Zat_Berbahaya_Keterangan: string;
  Riwayat_Alergi: string;
  Kesadaran: string;
  Pernafasan: string;
  Tekanan_Darah: string;
  Skala_Nyeri: string;
  Nadi: string;
  Berat_Badan: string;
  Cyanosis: string;
  Suhu: string;
  Tinggi_Badan: string;
  Oedem: string
  Ikterus: string
  Tanggal: string
  Anamnesa: string
  Diagnosa: string
  ID_Dokter: string
  ID_Petugas: string
  TTD_Dokter: string
  Updated_At: string
  Updated_By: string
  Nama_Dokter: string
  Keadaan_Gizi: string
  Keadaan_Umum: string
  Nama_Petugas: string
  Keluhan_Utama: string
  Pengkajian_Coa: string
  Pengkajian_Tht: string
  Riwayat_Alergi: string
  Pengkajian_Dada: string
  Pengkajian_Iris: string
  Pengkajian_Mata: string
  Pengkajian_Paru: string
  Pengkajian_Leher: string
  Pengkajian_Lensa: string
  Pengkajian_Mulut: string
  Pengkajian_Oedem: string
  Pengkajian_Perut: string
  Pengkajian_Pupil: string
  Pengkajian_Cornea: string
  Pengkajian_Kepala: string
  Pengkajian_Retina: string
  Pengkajian_Jantung: string
  Rencana_Pengobatan: string
  Pengkajian_Vitreous: string
  Pemeriksaan_Penunjang: string
  Pengkajian_Conj_Bulbi: string
  Pengkajian_Urogenital: string
  Riwayat_Pemakaian_Obat: string
  Pekerjaan_Zat_Berbahaya: string
  Pengkajian_Anggota_Gerak: string
  Pengkajian_Coa_Keterangan: string
  Pengkajian_Tht_Keterangan: string
  Riwayat_Penyakit_Keluarga: string
  Pengkajian_Dada_Keterangan: string
  Pengkajian_Iris_Keterangan: string
  Pengkajian_Mata_Keterangan: string
  Pengkajian_Paru_Keterangan: string
  Riwayat_Penyakit_Terdahulu: string
  Pengkajian_Leher_Keterangan: string
  Pengkajian_Lensa_Keterangan: string
  Pengkajian_Mulut_Keterangan: string
  Pengkajian_Muskulos_Keletal: string
  Pengkajian_Oedem_Keterangan: string
  Pengkajian_Perut_Keterangan: string
  Pengkajian_Pupil_Keterangan: string
  Pengkajian_Cornea_Keterangan: string
  Pengkajian_Kepala_Keterangan: string
  Pengkajian_Posisi: string;
  Pengkajian_Posisi_Keterangan: string;
  Pengkajian_Pergerakan: string;
  Pengkajian_Pergerakan_Keterangan: string;
  Pengkajian_Funduscopy: string;
  Pengkajian_Funduscopy_Keterangan: string;
  Pengkajian_Canthal_Medial: string;
  Pengkajian_Canthal_Medial_Keterangan: string;
  Pengkajian_Canthal_Lateral: string;
  Pengkajian_Canthal_Lateral_Keterangan: string;
  Pengkajian_Sclera: string;
  Pengkajian_Sclera_Keterangan: string;
  Data_Objektif_Lain: string;
  Pengkajian_Palpebra_Inferior: string
  Pengkajian_Palpebra_Superior: string
  Pengkajian_Retina_Keterangan: string
  Pengkajian_Status_Neurologis: string
  Pengkajian_Jantung_Keterangan: string
  Pengkajian_Vitreous_Keterangan: string
  Pengkajian_Conj_Tarsal_Inferior: string
  Pengkajian_Conj_Tarsal_Superior: string
  Pengkajian_Conj_Bulbi_Keterangan: string
  Pengkajian_Urogenital_Keterangan: string
  Pekerjaan_Zat_Berbahaya_Keterangan: string
  Pengkajian_Anggota_Gerak_Keterangan: string
  Pengkajian_Muskulos_Keletal_Keterangan: string
  Pengkajian_Palpebra_Inferior_Keterangan: string
  Pengkajian_Palpebra_Superior_Keterangan: string
  Pengkajian_Status_Neurologis_Keterangan: string
  Pengkajian_Conj_Tarsal_Inferior_Keterangan: string
  Pengkajian_Conj_Tarsal_Superior_Keterangan: string
  Gambar_Mata_OD: string;
  Gambar_Mata_OS: string;
  Gambar_Retina_OD: string;
  Gambar_Retina_OS: string;
  Pediatrik: any;
  Submit_Pediatrik: string;
  Image_1: any;
  Image_2: any;
  Resep: any
}

interface IImplementasiPasienResikoJatuh {
  ID: string;
  Waktu_Implementasi: string;
  Pengkajian_Awal_Check: string;
  Rem_Tempat_Tidur_Check: string;
  Dalam_Jangkauan_Check: string;
  Tidak_Menghalangi_Check: string;
  Palang_Tempat_Tidur_Check: string;
  Penanda_Resiko_Jatuh_Check: string;
  Libatkan_Keluarga_Check: string;
  Cepat_Menanggapi_Check: string;
  Memantau_Respon_Check: string;
  Lakukan_Pengkajian_Ulang_Check: string;
  TTD_Perawat: string;
  ID_Perawat: string;
  Nama_Perawat: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Unit_Pengimplementasi: string;
  Updated_At: string;
  Updated_By: string;
}

interface IAsesmenUlangTandaVital {
  ID: string;
  Waktu_Asesmen: string;
  Suhu: string;
  Nadi: string;
  Pernafasan: string;
  Tekanan_Darah: string;
  Oxygen_Saturation: string;
  Th: string;
  Skala_Nyeri: string;
  Lokasi_Id: string;
  Kualitas_Id: string;
  Frekuensi_Id: string;
  Tindakan_Id: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Unit: string;
  Updated_At: string;
  Updated_By: string;
}

interface IInfeksiDaerahOperasi {
  Hari: string;
  ID: string;
  Waktu: string;
  Keterangan: string;
  ID_Pegawai: string;
  Nama_Pegawai: string;
  Updated_At: string;
  Updated_By: string;
  TTD_Pegawai: string;
  KRS: number;
  Kontrol: number;
  Pelindung_Kasa: number;
  Pelindung_Eyeshield: number;
  Antibiotik_Topikal: number;
  Antibiotik_Oral: number;
  Mata_Air: number;
  Mata_Asap: number;
  Mata_Debu: number;
  GDA: number;
  IDO_Kabur: number;
  IDO_Merah: number;
  IDO_Nyeri: number;
  IDO_TIO: number;
  IDO_Odem_Kornea: number;
  IDO_Flare: number;
  IDO_Hiporpion: number;
  IDO_Membran: number;
  IDO_Pupil: number;
  IDO_Kekeruhan: number;
  IDO_Kultur: number;
  IDO_Dx: number;
}

interface IDpjp {
  ID_Petugas: string
  Updated_At: string
  Updated_By: string
  Nama_Petugas: string
  Dokter_Ppds_Id: string
  Peralihan_Dpjp: string
  TTD_Dokter_Ppds: string
  SIP: string
  Tanggal_Rawat_1: string
  Tanggal_Rawat_2: string
  Tanggal_Rawat_3: string
  Tanggal_Rawat_4: string
  Alasan_Peralihan: string
  Dokter_Dpjp_1_Id: string
  Dokter_Dpjp_2_Id: string
  Dokter_Dpjp_3_Id: string
  Dokter_Dpjp_4_Id: string
  Dokter_Ppds_Nama: string
  TTD_Dokter_Utama: string
  Dokter_Ruangan_Id: string
  TTD_Dokter_Dpjp_1: string
  TTD_Dokter_Dpjp_2: string
  TTD_Dokter_Dpjp_3: string
  TTD_Dokter_Dpjp_4: string
  Tanggal_Peralihan: string
  Dokter_Dpjp_1_Nama: string
  Dokter_Dpjp_2_Nama: string
  Dokter_Dpjp_3_Nama: string
  Dokter_Dpjp_4_Nama: string
  TTD_Dokter_Ruangan: string
  Dokter_Ruangan_Nama: string
  Dokter_Dpjp_Utama_Id: string
  TTD_Dokter_Peralihan: string
  Dokter_Dpjp_Utama_Nama: string
  Dokter_Dpjp_Peralihan_Id: string
  Dokter_Dpjp_Peralihan_Nama: string
  Pasien_Diagnosis: string
  Pasien_Kategori: string
}

interface IResumePasienPulang {
  Anjuran: string
  Obat_Rs: string
  Ruang_Rawat: string;
  Tanggal: string
  Anamnesa: string
  Tindakan: string
  ID_Petugas: string
  Pasien_Dirawat: string;
  Komorbiditas_1: string;
  Komorbiditas_2: string;
  Komorbiditas_3: string;
  Komorbiditas_4: string;
  Komorbiditas_5: string;
  Mata: string;
  Posisi_Khusus: string;
  Obat_Rumah: string
  Updated_At: string
  Updated_By: string
  Nama_Petugas: string
  Tanggal_Masuk: string
  Diagnosa_Masuk: string
  Diagnosa_Utama: string
  Kondisi_Pulang: string
  ID_TTD_Petugas: string
  Tanggal_Keluar: string
  Nama_TTD_Petugas: string
  Diagnosa_Sekunder_1: string
  Diagnosa_Sekunder_2: string
  Diagnosa_Sekunder_3: string
  Diagnosa_Sekunder_4: string
  Diagnosa_Sekunder_5: string;
  Pemeriksaan_Fisik: string
  Tanda_Tangan_Pasien: string
  Tanda_Tangan_Petugas: string
  Pemeriksaan_Penunjang: string
}

interface IFormulirPraAnestesi {
  Nama_TTD_Dokter: string;
  Nadi: string
  Suhu: string
  ASA_1: number | null
  ASA_2: number | null
  ASA_3: number | null
  ASA_4: number | null
  Waktu: string
  Kopi_Teks: string
  ID_Petugas: string
  Kopi_Radio: number | null
  Obat_Bebas: string
  Obat_Resep: string
  Updated_At: string
  Updated_By: string
  Alergi_Obat: string
  Berat_Badan: string
  Pasien_Teks: string
  Sistem_Teks: string
  Alkohol_Teks: string
  Aspirin_Teks: string
  Merokok_Teks: string
  Nama_Petugas: string
  Tinggi_Badan: string
  Alkohol_Radio: number | null
  Anestesi_Umum: string
  Aspirin_Radio: number | null
  Keluarga_Teks: string
  Merokok_Radio: number | null
  Olahraga_Teks: string
  Tekanan_Darah: string
  Alergi_Makanan: string
  Anestesi_Lokal: string
  Olahraga_Radio: number | null
  Anti_Sakit_Teks: string
  Diagnosis_ICD_X: string
  Laboratorium_Pt: string
  Pasien_Kacamata: number | null
  Riwayat_Operasi: string
  Anti_Sakit_Radio: number | null
  Kajian_Teks_Paru: string
  Laboratorium_EKG: string
  Pasien_Transfusi: number | null
  Anestesi_Regional: string
  Laboratorium_Teks: string
  Pasien_Gigi_Palsu: number | null
  Pasien_Maag_Radio: number | null
  Sistem_Dada_Radio: number | null
  Sistem_Gigi_Radio: number | null
  Sistem_ISPA_Radio: number | null
  Laboratorium_Hb_Ht: string
  Laboratorium_Na_Cl: string
  Laboratorium_Ureum: string
  Penyulit_Lain_Teks: string
  Sistem_Batuk_Radio: number | null
  Sistem_Hamil_Radio: number | null
  Kajian_Teks_Abdomen: string
  Kajian_Teks_Jantung: string
  Laboratorium_Kalium: string
  Pasien_Anemia_Radio: number | null
  Pasien_Asthma_Radio: number | null
  Pasien_Bawaan_Radio: number | null
  Pasien_Kejang_Radio: number | null
  Pasien_Lensa_Kontak: number | null
  Penyulit_Lain_Radio: number | null
  Sistem_Kejang_Radio: number | null
  Sistem_Muntah_Radio: number | null
  Sistem_Stroke_Radio: number | null
  Keluarga_Demam_Radio: number | null
  Laboratorium_Glukosa: string
  Laboratorium_Rontgen: string
  Pasien_Diagnosis_HIV: number | null
  Pasien_Jantung_Radio: number | null
  Pasien_Lainnya_Radio: number | null
  Pasien_Pakai_Lainnya: number | null
  Pasien_Pingsan_Radio: number | null
  Sistem_Pingsan_Radio: number | null
  Catatan_Tindak_Lanjut: string
  Kajian_Teks_Neurologi: string
  Laboratorium_Leukosit: string
  Pasien_Diabetes_Radio: number | null
  Pasien_Mengorok_Radio: number | null
  Pasien_Transfusi_Teks: string
  Sistem_Obesitas_Radio: number | null
  Kajian_Teks_Gigi_Palsu: string
  Kajian_Teks_Keterangan: string
  Kajian_Teks_Mallampati: string
  Keluarga_Jantung_Radio: number | null
  Keluarga_Lainnya_Radio: number | null
  Laboratorium_Kehamilan: string
  Laboratorium_Kreatinin: string
  Laboratorium_Trombosit: string
  Pasien_Hepatitis_Radio: number | null
  Perencanaan_Khusus_TCI: number | null
  Kajian_Teks_Ekstremitas: string
  Keluarga_Diabetes_Radio: number | null
  Pasien_Hipertensi_Radio: number | null
  Pasien_Pendarahan_Radio: number | null
  Perencanaan_Anestesi_GA: number | null
  Keluarga_Pembiusan_Radio: number | null
  Pasien_Alat_Bantu_Dengar: number | null
  Sistem_Sesak_Napas_Radio: number | null
  Keluarga_Hipertensi_Radio: number | null
  Keluarga_Pendarahan_Radio: number | null
  Pasien_Diagnosis_HIV_Teks: string
  Pasien_Pakai_Lainnya_Teks: string
  Sistem_Leher_Pendek_Radio: number | null
  Pasien_Diagnosis_HIV_Hasil: string
  Perencanaan_Khusus_Lainnya: number | null
  Perencanaan_Monitoring_BIS: number | null
  Perencanaan_Monitoring_CVP: number | null
  Kajian_Teks_Tulang_Belakang: string
  Keluarga_Tuberkulosis_Radio: number | null
  Perencanaan_Alat_Khusus_USG: number | null
  Perencanaan_Anestesi_Sedasi: number | null
  Perencanaan_Monitoring_NIBP: number | null
  Perencanaan_Monitoring_SPO2: number | null
  Perencanaan_Monitoring_Temp: number | null
  Perencanaan_Persiapan_Puasa: number | null
  Sistem_Denyut_Jantung_Radio: number | null
  Keluarga_Irama_Jantung_Radio: number | null
  Pasien_Pembekuan_Darah_Radio: number | null
  Perencanaan_Anestesi_GA_Teks: string
  Perencanaan_Anestesi_Lainnya: number | null
  Perencanaan_Khusus_Hipotensi: number | null
  Perencanaan_Khusus_Tidak_Ada: number | null
  Perencanaan_Khusus_Ventilasi: number | null
  Sistem_Tulang_Belakang_Radio: number | null
  Perencanaan_Monitoring_ET_CO2: number | null
  Perencanaan_Perawatan_Lainnya: number | null
  Sistem_Mobilisasi_Leher_Radio: number | null
  Keluarga_Pembekuan_Darah_Radio: number | null
  Perencanaan_Monitoring_Lainnya: number | null
  Perencanaan_Alat_Khusus_Lainnya: number | null
  Perencanaan_Khusus_Lainnya_Teks: string
  Perencanaan_Monitoring_CVP_Teks: string
  Perencanaan_Monitoring_EKG_Lead: number | null
  Perencanaan_Anestesi_Sedasi_Teks: string
  Perencanaan_Perawatan_Rawat_Inap: number | null
  Perencanaan_Anestesi_Lainnya_Teks: string
  Perencanaan_Perawatan_Rawat_Jalan: number | null
  Perencanaan_Persiapan_Puasa_Waktu: string
  Perencanaan_Alat_Khusus_Glidescope: number | null
  Perencanaan_Monitoring_Arteri_Line: number | null
  Perencanaan_Perawatan_Lainnya_Teks: string
  Perencanaan_Persiapan_Pre_Medikasi: number | null
  Perencanaan_Monitoring_Lainnya_Teks: string
  Perencanaan_Alat_Khusus_Bronchoscopy: number | null
  Perencanaan_Alat_Khusus_Lainnya_Teks: string
  Perencanaan_Monitoring_EKG_Lead_Teks: string
  Perencanaan_Persiapan_Rencana_Operasi: number | null
  Perencanaan_Monitoring_Arteri_Line_Teks: string
  Perencanaan_Persiapan_Pre_Medikasi_Waktu: string
  Perencanaan_Persiapan_Rencana_Operasi_Waktu: string
  Perencanaan_Persiapan_Transportasi_Kamar_Bedah: number | null
  Perencanaan_Persiapan_Transportasi_Kamar_Bedah_Waktu: string
  Tanda_Tangan_Pasien: string;
  Tanda_Tangan_Dokter: string;
  ID_TTD_Dokter: string;
  Tidak_Ada: number | null;
  Catatan_Persiapan_Text: string;
}

interface IPersetujuanTindakanAnestesi {
  ID_Petugas: string;
  Nama_Petugas: string;
  ID_Dokter_Pelaksana: string;
  Nama_Dokter_Pelaksana: string;
  ID_Pemberi_Informasi: string;
  Nama_Pemberi_Informasi: string;
  Penerima_Informasi: string;
  Diagnosis_Check: string;
  Dasar_Diagnosis_Check: string;
  Dasar_Klinis: string;
  Dasar_Radiologi: string;
  Dasar_EKG: string;
  Dasar_Laboratorium: string;
  Tindakan_Kedokteran_Check: string;
  Anestesi_Umum_Intubasi_Check: string;
  Anestesi_Umum_LMA_Check: string;
  Anestesi_Umum_FM_Check: string;
  Anestesi_Umum_TIVA_Check: string;
  Anestesi_Regional_Spinal_Check: string;
  Anestesi_Regional_Epidural_Check: string;
  Anestesi_Regional_Perifer_Check: string;
  Indikasi_Tindakan_Tujuan_Check: string;
  Tata_Cara_Tindakan_Check: string;
  Tata_Cara_Tindakan: string;
  Risiko_Check: string;
  Shock_Check: string;
  Henti_Jantung_Check: string;
  Meninggal_Check: string;
  Tujuan_Check: string;
  Tujuan: string;
  Komplikasi_Check: string;
  Komplikasi_Umum_1: string;
  Komplikasi_Umum_2: string;
  Komplikasi_Umum_3: string;
  Komplikasi_Umum_4: string;
  Komplikasi_Umum_5: string;
  Komplikasi_Umum_6: string;
  Komplikasi_Umum_7: string;
  Komplikasi_Umum_8: string;
  Komplikasi_Umum_9: string;
  Komplikasi_Umum_10: string;
  Komplikasi_Regional_1: string;
  Komplikasi_Regional_2: string;
  Komplikasi_Regional_3: string;
  Komplikasi_Regional_4: string;
  Komplikasi_Regional_5: string;
  Komplikasi_Regional_6: string;
  Komplikasi_Regional_7: string;
  Komplikasi_Regional_8: string;
  Komplikasi_Regional_9: string;
  Komplikasi_Regional_10: string;
  Komplikasi_Regional_11: string;
  Komplikasi_Regional_12: string;
  Prognosis_Check: string;
  Prognosis: string;
  Alternatif_Tindakan_Check: string;
  Alternatif_Tindakan: string;
  Lain_Lain_Check: string;
  Lain_Lain: string;
  ID_Dokter_Pelaksana_TTD: string;
  TTD_Dokter_Pelaksana: string;
  Nama_Dokter_Pelaksana_TTD: string;
  TTD_Penerima_Informasi: string;
  Waktu: string;
  Kota: string;
  Pernyataan_Id: string;
  Tanda_Tangan: string;
  Tanda_Tangan_Pasien: string;
  Tanda_Tangan_Saksi: string;
  ID_Saksi: string;
  Nama_Saksi: string;
  Pasien_Kota: string;
  Pasien_Tanggal: string;
  Tindakan_Operasi: string;
  Tanda_Tangan_JK: string;
  Tanda_Tangan_Nama: string;
  Tanda_Tangan_Telp: string;
  Nama_Saksi_Keluarga: string;
  Tanda_Tangan_Alamat: string;
  Tanda_Tangan_Saksi_2: string;
  Tanda_Tangan_Hubungan: string;
  Tanda_Tangan_Tgl_Lahir: string;
  Updated_At: string;
  Updated_By: string;
  Updated_By_Name: string;
}

interface IRencanaAsuhanKeperawatan {
  Diagnosa_Medis: string;
  Kamar_Id: string;
  Perawat_Id: string;
  Nama_Perawat: string;
  // Sistem Imunitas
  Tanggal_Si: string;
  Diagnosa1_Si_Check: string;
  Diagnosa1_Si_1_Check: string;
  Diagnosa1_Si_2_Check: string;
  Diagnosa1_Si_3_Check: string;
  Diagnosa2_Si_Check: string;
  Diagnosa2_Si_1_Check: string;
  Diagnosa2_Si_2_Check: string;
  Diagnosa2_Si_3_Check: string;
  Diagnosa3_Si_Check: string;
  Diagnosa3_Si_1_Check: string;
  Diagnosa3_Si_2_Check: string;
  Tujuan1_Si_Check: string;
  Tujuan1_Si_Jam_1: string;
  Tujuan1_Si_Jam_2: string;
  Tujuan1_Si_1_Check: string;
  Tujuan1_Si_2_Check: string;
  Tujuan1_Si_3_Check: string;
  Tujuan1_Si_3_Text: string;
  Tujuan2_Si_Check: string;
  Tujuan2_Si_Jam_1: string;
  Tujuan2_Si_Jam_2: string;
  Tujuan2_Si_1_Check: string;
  Tujuan2_Si_2_Check: string;
  Tujuan2_Si_3_Check: string;
  Tujuan2_Si_4_Check: string;
  Tujuan3_Si_Check: string;
  Rencana1_Si_1_Check: string;
  Rencana1_Si_2_Check: string;
  Rencana1_Si_3_Check: string;
  Rencana1_Si_4_Check: string;
  Rencana1_Si_5_Check: string;
  Rencana1_Si_6_Check: string;
  Rencana1_Si_7_Check: string;
  Rencana1_Si_8_Check: string;
  Rencana2_Si_1_Check: string;
  Rencana2_Si_1_Text: string;
  Rencana2_Si_2_Check: string;
  Rencana2_Si_2_Text: string;
  Rencana2_Si_3_Check: string;
  Rencana2_Si_3_Text: string;
  //Persepsi - Sensori
  Tanggal_Ps: string;
  Diagnosa1_Ps_Check: string;
  Diagnosa1_Ps_1_Check: string;
  Diagnosa1_Ps_1_Text: string;
  Diagnosa1_Ps_2_Check: string;
  Diagnosa1_Ps_2_Text: string;
  Diagnosa1_Ps_3_Check: string;
  Diagnosa1_Ps_3_Text: string;
  Diagnosa1_Ps_4_Check: string;
  Diagnosa1_Ps_5_Check: string;
  Diagnosa1_Ps_6_Check: string;
  Tujuan1_Ps_Check: string;
  Tujuan1_Ps_Jam_1: string;
  Tujuan1_Ps_Jam_2: string;
  Tujuan1_Ps_1_Check: string;
  Tujuan1_Ps_2_Check: string;
  Tujuan1_Ps_3_Check: string;
  Tujuan1_Ps_4_Check: string;
  Rencana1_Ps_1_Check: string;
  Rencana1_Ps_2_Check: string;
  Rencana1_Ps_3_Check: string;
  Rencana1_Ps_4_Check: string;
  Rencana1_Ps_5_Check: string;
  Rencana1_Ps_6_Check: string;
  Rencana1_Ps_7_Check: string;
  Rencana2_Ps_1_Check: string;
  Rencana2_Ps_1_Text: string;
  Rencana2_Ps_2_Check: string;
  Rencana2_Ps_2_Text: string;
  Rencana2_Ps_3_Check: string;
  Rencana2_Ps_3_Text: string;
  // Nutrisi Cairan dan Eliminasi
  Tanggal_Nc: string;
  Diagnosa1_Nc_Check: string;
  Diagnosa1_Nc_1_Check: string;
  Diagnosa1_Nc_2_Check: string;
  Diagnosa1_Nc_3_Check: string;
  Diagnosa2_Nc_Check: string;
  Diagnosa2_Nc_1_Check: string;
  Diagnosa3_Nc_Check: string;
  Diagnosa3_Nc_1_Check: string;
  Diagnosa3_Nc_2_Check: string;
  Diagnosa3_Nc_3_Check: string;
  Diagnosa3_Nc_4_Check: string;
  Diagnosa3_Nc_5_Check: string;
  Diagnosa3_Nc_5_Text: string;
  Diagnosa4_Nc_Check: string;
  Diagnosa4_Nc_1_Check: string;
  Diagnosa5_Nc_Check: string;
  Diagnosa5_Nc_1_Check: string;
  Diagnosa5_Nc_2_Check: string;
  Tujuan1_Nc_Check: string;
  Tujuan1_Nc_Jam_1: string;
  Tujuan1_Nc_Jam_2: string;
  Tujuan1_Nc_1_Check: string;
  Tujuan1_Nc_2_Check: string;
  Tujuan1_Nc_3_Check: string;
  Tujuan1_Nc_4_Check: string;
  Tujuan1_Nc_5_Check: string;
  Tujuan1_Nc_6_Check: string;
  Tujuan1_Nc_6_Text: string;
  Tujuan2_Nc_Check: string;
  Tujuan2_Nc_Jam_1: string;
  Tujuan2_Nc_Jam_2: string;
  Tujuan2_Nc_1_Check: string;
  Tujuan2_Nc_2_Check: string;
  Tujuan2_Nc_3_Check: string;
  Tujuan2_Nc_4_Check: string;
  Tujuan3_Nc_Check: string;
  Tujuan3_Nc_Jam_1: string;
  Tujuan3_Nc_Jam_2: string;
  Tujuan3_Nc_1_Check: string;
  Tujuan3_Nc_2_Check: string;
  Tujuan3_Nc_3_Check: string;
  Tujuan4_Nc_Check: string;
  Rencana1_Nc_1_Check: string;
  Rencana1_Nc_2_Check: string;
  Rencana1_Nc_3_Check: string;
  Rencana1_Nc_4_Check: string;
  Rencana1_Nc_5_Check: string;
  Rencana1_Nc_6_Check: string;
  Rencana1_Nc_7_Check: string;
  Rencana1_Nc_8_Check: string;
  Rencana1_Nc_9_Check: string;
  Rencana1_Nc_10_Check: string;
  Rencana1_Nc_11_Check: string;
  Rencana1_Nc_12_Check: string;
  Rencana1_Nc_12_Text: string;
  Rencana2_Nc_1_Check: string;
  Rencana2_Nc_2_Check: string;
  Rencana2_Nc_3_Check: string;
  Rencana2_Nc_3_Text: string;
  //Kebersihan diri dan aktivitas
  Tanggal_Kd: string;
  Diagnosa1_Kd_Check: string;
  Diagnosa1_Kd_1_Check: string;
  Diagnosa1_Kd_2_Check: string;
  Diagnosa1_Kd_3_Check: string;
  Diagnosa1_Kd_4_Check: string;
  Diagnosa2_Kd_Check: string;
  Diagnosa2_Kd_Text: string;
  Tujuan1_Kd_Check: string;
  Tujuan1_Kd_Jam_1: string;
  Tujuan1_Kd_Jam_2: string;
  Tujuan1_Kd_1_Check: string;
  Tujuan1_Kd_2_Check: string;
  Tujuan2_Kd_Check: string;
  Tujuan2_Kd_Jam_1: string;
  Tujuan2_Kd_Jam_2: string;
  Tujuan2_Kd_1_Check: string;
  Tujuan2_Kd_1_Text: string;
  Rencana1_Kd_1_Check: string;
  Rencana1_Kd_2_Check: string;
  Rencana1_Kd_3_Check: string;
  Rencana1_Kd_4_Check: string;
  Rencana1_Kd_5_Check: string;
  Rencana1_Kd_6_Check: string;
  Rencana1_Kd_7_Check: string;
  Rencana1_Kd_7_Text: string;
  Rencana2_Kd_1_Check: string;
  Rencana2_Kd_1_Text: string;
  // Istirahat dan tidur
  Tanggal_It: string;
  Diagnosa1_It_Check: string;
  Diagnosa1_It_1_Check: string;
  Diagnosa1_It_2_Check: string;
  Diagnosa2_It_Check: string;
  Diagnosa2_It_1_Check: string;
  Diagnosa2_It_2_Check: string;
  Diagnosa2_It_3_Check: string;
  Diagnosa3_It_Check: string;
  Diagnosa3_It_Text: string;
  Tujuan1_It_Check: string;
  Tujuan1_It_Jam_1: string;
  Tujuan1_It_Jam_2: string;
  Tujuan1_It_1_Check: string;
  Tujuan1_It_2_Check: string;
  Tujuan1_It_3_Check: string;
  Tujuan1_It_4_Check: string;
  Tujuan2_It_Check: string;
  Tujuan2_It_Jam_1: string;
  Tujuan2_It_Jam_2: string;
  Tujuan2_It_1_Check: string;
  Tujuan2_It_2_Check: string;
  Tujuan2_It_2_Text: string;
  Rencana1_It_1_Check: string;
  Rencana1_It_2_Check: string;
  Rencana1_It_3_Check: string;
  Rencana1_It_4_Check: string;
  Rencana1_It_5_Check: string;
  Rencana1_It_6_Check: string;
  Rencana1_It_7_Check: string;
  Rencana1_It_8_Check: string;
  Rencana1_It_9_Check: string;
  Rencana1_It_10_Check: string;
  Rencana1_It_10_Text: string;
  Rencana2_It_1_Check: string;
  Rencana2_It_1_Text: string;
  Rencana2_It_2_Check: string;
  Rencana2_It_2_Text: string;
  // Psikososial dan spiritual
  Tanggal_Psi: string;
  Diagnosa1_Psi_Check: string;
  Diagnosa1_Psi_1_Check: string;
  Diagnosa1_Psi_2_Check: string;
  Diagnosa1_Psi_3_Check: string;
  Diagnosa1_Psi_4_Check: string;
  Diagnosa1_Psi_5_Check: string;
  Diagnosa2_Psi_Check: string;
  Diagnosa2_Psi_1_Check: string;
  Diagnosa2_Psi_2_Check: string;
  Diagnosa2_Psi_3_Check: string;
  Diagnosa3_Psi_Check: string;
  Diagnosa3_Psi_1_Check: string;
  Diagnosa3_Psi_2_Check: string;
  Diagnosa3_Psi_3_Check: string;
  Tujuan1_Psi_Check: string;
  Tujuan1_Psi_Jam_1: string;
  Tujuan1_Psi_Jam_2: string;
  Tujuan1_Psi_1_Check: string;
  Tujuan1_Psi_2_Check: string;
  Tujuan1_Psi_3_Check: string;
  Tujuan1_Psi_4_Check: string;
  Tujuan2_Psi_Check: string;
  Tujuan2_Psi_Jam_1: string;
  Tujuan2_Psi_Jam_2: string;
  Tujuan2_Psi_1_Check: string;
  Tujuan2_Psi_2_Check: string;
  Tujuan3_Psi_Check: string;
  Tujuan3_Psi_Jam_1: string;
  Tujuan3_Psi_Jam_2: string;
  Tujuan3_Psi_1_Check: string;
  Tujuan3_Psi_2_Check: string;
  Tujuan3_Psi_3_Check: string;
  Rencana1_Psi_1_Check: string;
  Rencana1_Psi_2_Check: string;
  Rencana1_Psi_3_Check: string;
  Rencana1_Psi_4_Check: string;
  Rencana1_Psi_5_Check: string;
  Rencana1_Psi_6_Check: string;
  Rencana1_Psi_7_Check: string;
  Rencana1_Psi_8_Check: string;
  Rencana1_Psi_9_Check: string;
  Rencana1_Psi_10_Check: string;
  Rencana1_Psi_11_Check: string;
  Rencana2_Psi_1_Check: string;
  Rencana2_Psi_2_Check: string;
  Rencana2_Psi_2_Text: string;
  Rencana2_Psi_3_Check: string;
  Rencana2_Psi_3_Text: string;
  // Persepsi - sensori penglihatan
  Tanggal_Ps1: string;
  Diagnosa1_Ps1_Check: string;
  Diagnosa1_Ps1_1_Check: string;
  Diagnosa1_Ps1_1_Text: string;
  Diagnosa1_Ps1_2_Check: string;
  Diagnosa1_Ps1_2_Text: string;
  Diagnosa1_Ps1_3_Check: string;
  Diagnosa1_Ps1_3_Text: string;
  Diagnosa1_Ps1_4_Check: string;
  Diagnosa1_Ps1_5_Check: string;
  Tujuan1_Ps1_Check: string;
  Tujuan1_Ps1_1_Check: string;
  Tujuan1_Ps1_2_Check: string;
  Rencana1_Ps1_1_Check: string;
  Rencana1_Ps1_2_Check: string;
  Rencana1_Ps1_3_Check: string;
  Rencana1_Ps1_4_Check: string;
  Rencana1_Ps1_5_Check: string;
  Rencana2_Ps1_1_Check: string;
  Rencana2_Ps1_2_Check: string;
  Rencana2_Ps1_2_Text: string;
  // Sistem Imunitas
  Tanggal_Si1: string;
  Diagnosa1_Si1_Check: string;
  Diagnosa1_Si1_1_Check: string;
  Diagnosa1_Si1_2_Check: string;
  Diagnosa1_Si1_3_Check: string;
  Diagnosa1_Si1_4_Check: string;
  Diagnosa1_Si1_5_Check: string;
  Tujuan1_Si1_Check: string;
  Tujuan1_Si1_Jam_1: string;
  Tujuan1_Si1_Jam_2: string;
  Tujuan1_Si1_1_Check: string;
  Tujuan1_Si1_2_Check: string;
  Tujuan1_Si1_3_Check: string;
  Rencana1_Si1_1_Check: string;
  Rencana1_Si1_2_Check: string;
  Rencana1_Si1_3_Check: string;
  Rencana1_Si1_4_Check: string;
  Rencana1_Si1_5_Check: string;
  Rencana1_Si1_6_Check: string;
  Rencana1_Si1_7_Check: string;
  Rencana1_Si1_8_Check: string;
  Rencana2_Si1_1_Check: string;
  Rencana2_Si1_1_Text: string;
  Rencana2_Si1_2_Check: string;
  Rencana2_Si1_2_Text: string;
  Rencana2_Si1_3_Check: string;
  Rencana2_Si1_3_Text: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;
}

interface ISuratPerintahRawatInap {
  ID_Dokter_Rawat_Inap: string;
  Nama_Dokter_Rawat_Inap: string;
  Tanggal_Tanda_Tangan: string;
  Indikasi_Opname: string;
  Anjuran_Opname: string;
  Preventif_Check: string;
  Paliatif_Check: string;
  Kuratif_Check: string;
  Rehabilitatif_Check: string;
  Diagnosa: string;
  Lama_Opname: string;
  Lama_Satuan: string;
  TTD_Dokter: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;
}

interface IPengkajianAwalGiziRanap {
  Tanggal: string;
  Diagnosa_Masuk: string;
  Diet_Awal: string;
  Bb_Anak: string;
  Tb_Anak: string;
  Bb_0_12_Anak: string;
  Bb_1_13_Anak: string;
  Bb_Ideal_Anak: string;
  Z_Score: string;
  Bb_Dewasa: string;
  Tb_Dewasa: string;
  Bb_Ideal_Dewasa: string;
  Status_Gizi: string;
  Gangguan_Gastro: string;
  Gangguan_Gastro_Ada: string;
  Perubahan_Asupan: string;
  Perubahan_Asupan_Ada: string;
  Faktor_Resiko: string;
  Resiko_Diabetes: string;
  Resiko_Hipertensi: string;
  Resiko_Luka_Bakar: string;
  Resiko_Kanker: string;
  Resiko_Dislipidemia: string;
  Resiko_Gangguan_Ginjal: string;
  Resiko_Gangguan_Lain: string;
  Resiko_Gangguan_Lain_Teks: string;
  Resiko_Gangguan_Jantung: string;
  Resiko_Stroke: string;
  Resiko_Gastritis: string;
  Resiko_Thyphoid: string;
  Resiko_Lainnya: string;
  Resiko_Lainnya_Teks: string;
  Diagnosa_Gizi: string;
  Intervensi: string;
  Monitoring: string;
  Evaluasi: string;
  IMT: string;
  Keterangan_Gizi: string;
  Nama_Petugas_Gizi: string;
  ID_Petugas_Gizi: string;
  TTD_Petugas_Gizi: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;
}

interface IMonitoringSkalaNyeri {
  ID: string;
  Waktu_Monitor: string;
  Tekanan_Darah: string;
  Nadi: string;
  RR: string;
  Tindakan: string;
  Lokasi_Nyeri: string;
  ID_Perawat: string;
  TTD_Perawat: string;
  Nama_Perawat: string;
  Temperatur: string;
  Total_Skor: string;
  Skala_Nyeri: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Unit: string;
  Updated_At: string;
  Updated_By: string;
}

interface IPemberianInformasiResikoPasienJatuh {
  ID_Pemberi_Informasi: string;
  Nama_Pemberi_Informasi: string;
  Penerima_Informasi: string;
  Nama_Wali: string;
  Faktor_Usia_Check: string;
  Faktor_Riwayat_Jatuh_Check: string;
  Faktor_Penyakit_Check: string;
  Faktor_Penggunaan_Alat_Check: string;
  Faktor_Terpasang_Infus_Check: string;
  Faktor_Kondisi_Mental_Check: string;
  Faktor_Mobilisasi_Check: string;
  Faktor_Mobilisasi_Text: string;
  Faktor_Post_Operasi_Check: string;
  Faktor_Post_Operasi_Text: string;
  Faktor_Respon_Obat_Check : string;
  Respon_Obat_Sedatif: string;
  Respon_Obat_Hipnotik: string;
  Respon_Obat_Antidepresan: string;
  Respon_Obat_Laxatives: string;
  Respon_Obat_Diuretika: string;
  Respon_Obat_Narkotika: string;
  Faktor_Riwayat_Check: string;
  Riwayat_Kejang: string;
  Riwayat_Vertigo: string;
  Riwayat_Depresi: string;
  Riwayat_Pingsan: string;
  Riwayat_Pusing: string;
  Riwayat_Delirium: string;
  Riwayat_Disorientasi: string;
  Faktor_Lain_Check: string;
  Faktor_Lain_Text: string;
  Tingkatan_Check: string;
  Tingkatan_Rendah: string;
  Tingkatan_Sedang: string;
  Tingkatan_Tinggi: string;
  Tindakan_Rem_Tempat_Tidur_Check: string;
  Tindakan_Kebutuhan_Pasien_Check: string;
  Tindakan_Tempatkan_Meja_Check: string;
  Tindakan_Pasang_Palang_Check: string;
  Tindakan_Pasang_Penanda_Check: string;
  Tindakan_Libatkan_Keluarga_Check: string;
  Tindakan_Cepat_Menanggapi_Check: string;
  Tujuan_Pasien_Aman_Check: string;
  Akibat_Timbulnya_Cedera_Check: string;
  Lainnya_Check: string;
  Lainnya_Text: string;
  ID_TTD_Pemberi_Informasi: string;
  TTD_Pemberi_Informasi: string;
  Nama_TTD_Pemberi_Informasi: string;
  ID_TTD_Penerima_Informasi: string;
  TTD_Penerima_Informasi: string;
  Nama_TTD_Penerima_Informasi: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;
}

interface IDaftarVisitDokter {
  ID_Berobat: string;
  Waktu_Visit: string;
  ID_Dokter: string;
  Dokter_Nama: string;
  Penanganan: string;
  ID: string;
}

interface ISurveilansInfeksiHaisRanap {
  Ruangan_Hais: string;
  Tanggal_Berobat: string;
  Diagnosa_Masuk: string;
  Asal_Masuk: string;
  Vena_Sentral_Check: string;
  Vena_Perifer_Check: string;
  Lokasi_VS: string;
  Mulai_VS: string;
  Selesai_VS: string;
  Total_Hari_VS: string;
  Tanggal_Infeksi_VS: string;
  Catatan_VS: string;
  Lokasi_VP: string;
  Mulai_VP: string;
  Selesai_VP: string;
  Total_Hari_VP: string;
  Tanggal_Infeksi_VP: string;
  Catatan_VP: string;
  Tindakan_Alkes_Lain: string;
  Lokasi_Lain: string;
  Mulai_Lain: string;
  Selesai_Lain: string;
  Total_Hari_Lain: string;
  Tanggal_Infeksi_Lain: string;
  Catatan_Lain: string;
  HBS_Ag: string;
  Anti_HCV: string;
  Anti_HIV: string;
  Faktor_Penyakit_Lain: string;
  Lab_Leukocyt: string;
  Lab_LED: string;
  Lab_Lain: string;
  Hasil_Radiologi: string;
  Merokok: string;
  Steroid_Jangka_Panjang: string;
  Mandi_Sebelum_Operasi: string;
  Operasi_Karena_Trauma: string;
  Obat_Pengencer_Darah: string;
  Memakai_Make_Up: string;
  Gula_Darah: string
  Suhu_Pasien: string;
  Infeksi_Mata_Check: string;
  Infeksi_THT_Check: string;
  Infeksi_Mulut_Check: string;
  Infeksi_Paru_Check: string;
  Infeksi_Kulit_Check: string;
  Infeksi_GI_Check: string;
  Infeksi_Lainnya_Check: string;
  Infeksi_Lainnya_Text: string;
  Penyakit_DM_Check: string;
  Penyakit_Hipertensi_Check: string;
  Penyakit_GGK_Check: string;
  Penyakit_Sepsis_Check: string;
  Riwayat_Pasien_Sekarang: string;
  Jenis_Operasi: string;
  ASA_Score: string;
  Jenis_Anestesi: string;
  Operator_Anestesi: string;
  Kelembapan_Udara: string;
  Suhu_Ruangan: string;
  Komplikasi_Saat_Operasi: string;
  Profilaksis: string;
  Obat_Profilaksis: string;
  Antibiotik_Tambahan: string;
  Obat_Antibiotik: string;
  Dosis_Antibiotik: string;
  Jam_Diberikan_Antibiotik: string;
  Probe_Laser: string;
  Tubing_Vitrectomy: string;
  Chlorhexidine_Check: string;
  Povidone_Iodine_Check: string;
  Alkohol_70_Check: string;
  Jahitan: string;
  Indikator_Instrumen: string;
  Sterilisasi_CSSD: string;
  Inisial_Dr: string;
  Asisten_Op: string;
  Urutan_Op: string;
  Implant: string;
  Lama_Op: string;
  Ruang_Operasi: string;
  Klasifikasi_Luka: string;
  Prosedur_Op: string;
  Kualifikasi_Dokter_Bedah: string;
  Jumlah_Staf: string;
  Diagnosa_Akhir: string;
  Tanggal_Pasien_Keluar: string;
  Cara_Pasien_Keluar: string;
  Nama_Pindah_Faskes: string;
  ID_Perawat: string;
  TTD_Perawat: string;
  Nama_Perawat: string;
  ID_Perawat_IPCN: string;
  TTD_Perawat_IPCN: string;
  Nama_Perawat_IPCN: string;
  Updated_At: string;
  Updated_By: string;
  ID_Petugas: string;
  Nama_Petugas: string;
}

interface IRawatInap {
	ID_Rawat_Inap?: string
	Tipe_Pelayanan?: string
	No_RawatInap?: string
	Jam_Kunjungan?: string
	ID_Tipe_Tagihan?: string
	Nama_Tipe_Tagihan?: string
	ID_Dokter?: string
	Nama_Dokter?: string
	ID_Kelas_Kamar?: string
	Nama_Kelas_Kamar?: string
	Tarif_Kamar?: string
	ID_Kamar?: string
	Nama_Kamar?: string
	ID_Tempat_Tidur?: string
	Nama_Tempat_Tidur?: string
	Tgl_Masuk?: string
	Jam_Masuk?: string
	Tgl_Keluar?: string
	Jam_Keluar?: string
	Batal_Rawat_Inap?: string
	Bayar_Rawat_Inap?: string
	Diet?: string
	Allergic?: string
	Diagnosa?: string
	Gawat_Darurat?: number
	Cara_Masuk?: string
	Cara_Keluar?: string
	Sebab_Penyakit?: string
	Nama_Paket_Operasi?: string
	ID_Paket_Operasi?: string
	Jenis_Operasi?: string
	Daftar_Visit_Dokter?: IDaftarVisitDokter[];
  Daftar_Resep_Visit_Dokter?: ITebusObatRanap[]
  Pengkajian_Awal_Keperawatan_Dewasa?: IRanapPengkajianAwalKeperawatanDewasa;
  Pengkajian_Awal_Keperawatan_Anak?: IRanapPengkajianAwalKeperawatanAnak;
  Pengkajian_Early_Warning_Scoring_System?: Array<IEarlyWarningScoring>;
  Rencana_Pemulangan_Pasien?: IRencanaPemulanganPasien;
  Pengkajian_Resiko_Jatuh_Anak?: Array<IPengkajianResikoJatuhAnak>
  Catatan_Medis_Awal?: ICatatanMedisAwal
  Pengkajian_Resiko_Jatuh_Dewasa?: Array<IPengkajianResikoJatuhDewasa>
  Implementasi_Pasien_Resiko_Jatuh?: Array<IImplementasiPasienResikoJatuh>
  Asesmen_Ulang_Tanda_Vital?: Array<IAsesmenUlangTandaVital>
  Infeksi_Daerah_Operasi?: Array<IInfeksiDaerahOperasi>
  Pemberian_Informasi?: IPemberianInformasi;
  Persetujuan_Tindakan_Dokter?: IPersetujuanTindakanDokter;
  Dpjp?: IDpjp;
  Resume_Pasien_Pulang?: IResumePasienPulang;
  Formulir_Pra_Anestesi?: IFormulirPraAnestesi;
  Persetujuan_Tindakan_Anestesi?: IPersetujuanTindakanAnestesi;
  Rencana_Asuhan_Keperawatan?: IRencanaAsuhanKeperawatan;
  Surat_Perintah_Rawat_Inap?: ISuratPerintahRawatInap;
  Pengkajian_Awal_Gizi?: IPengkajianAwalGiziRanap;
  Pemberian_Informasi_Resiko_Pasien_Jatuh?: IPemberianInformasiResikoPasienJatuh;
  Surveilans_Infeksi_Hais?: ISurveilansInfeksiHaisRanap;
  Catatan_Keperawatan_Pra_Operasi?: IRajalCatatanKeperawatanPraOp;
  Checklist_Pra_Operasi?: IChecklistPraOperasi;
  Serah_Terima_Pasien?: ISerahTerimaPasien;
  Penandaan_Area_Pembedahan?: IPenandaanAreaPembedahan;
}

interface IResepObat {
	Kode_Obat: string
	Nama_Obat: string
	ID_Satuan: string
	Nama_Satuan: string
	ID_AturanPakai: string
	Nama_AturanPakai: string
	Kode_AturanPakai: String
	Jumlah: string
	Catatan: string
}

interface ITebusObat {
	Waktu_Tebus: string
	Daftar_Tebus: Array<IResepObat>
	Keterangan: string
	Status_Tebus: string
}

interface ITebusObatRanap {
  ID: string;
  ID_Berobat: string;
  Waktu_Tebus: string;
  Daftar_Tebus: any;
  Keterangan: string;
  Status_Tebus: string;
  Updated_At: string;
}

interface IBeriObat {
  Kode: string;
  Nama: string;
  Satuan: string;
  Aturan_Pakai: string;
  Jumlah: string;
}

interface IPemberianObat {
  ID: string;
  Waktu_Pemberian: string;
  Waktu: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Tanda_Tangan_Pasien: string;
  Tanda_Tangan_Perawat: string;
  ID_Perawat: string;
  Nama_Perawat: string;
  Tanda_Tangan_Dokter: string;
  ID_Dokter: string;
  Nama_Dokter: string;
  Updated_At: string;
  Updated_By: string;
  Obat: Array<IBeriObat>;
}

interface IMedsAllergy {
  Nama_Obat_Alergi: string;
  Tingkat: string;
  Reaksi_Alergi: string;
}

interface IObatSaatMasukRS {
  Nama_Obat: string;
  Jumlah: string;
  Rute: string;
  Aturan_Pakai: string;
  Tindak_Lanjut: string;
  Perubahan_Aturan_Pakai: string;
  Obat_Milik_Pasien: string;
}

interface IObatRuangan {
  Nama_Obat: string;
  Jumlah: string;
  Rute: string;
  Aturan_Pakai: string;
  Tindak_Lanjut: string;
  Perubahan_Aturan_Pakai: string;
}

interface IObatKeluar {
  Nama_Obat: string;
  Jumlah: string;
  Rute: string;
  Aturan_Pakai: string;
  Tindak_Lanjut: string;
  Perubahan_Aturan_Pakai: string;
  Kategori: string;
}


interface IRekonsiliasiObat {
  Riwayat_Pemakaian_Obat: Array<string>;
  Alergi_Obat_Radio: string;
  Alergi_Obat: Array<IMedsAllergy>;
  Unit_Masuk_RS: string;
  Nama_Ka_Unit_Masuk_RS: string;
  ID_Ka_Unit_Masuk_RS: string;
  Waktu_Masuk_RS: string;
  Obat_Saat_Masuk_RS: Array<IObatSaatMasukRS>;
  ID_Perawat_Masuk_RS: string;
  TTD_Perawat_Masuk_RS: string;
  Nama_Perawat_Masuk_RS: string;
  TTD_Pasien_Masuk_RS: string;
  ID_Dokter_Masuk_RS: string;
  TTD_Dokter_Masuk_RS: string;
  Nama_Dokter_Masuk_RS: string;
  ID_Apoteker_Masuk_RS: string;
  TTD_Apoteker_Masuk_RS: string;
  Nama_Apoteker_Masuk_RS: string;
  Unit_Ruangan_1: string;
  Nama_Ka_Unit_Ruangan_1: string;
  ID_Ka_Unit_Ruangan_1: string;
  Waktu_Ruangan_1: string;
  Obat_Ruangan_1: Array<IObatRuangan>;
  ID_Perawat_Ruangan_1: string;
  TTD_Perawat_Ruangan_1: string;
  Nama_Perawat_Ruangan_1: string;
  ID_Dokter_Ruangan_1: string;
  TTD_Dokter_Ruangan_1: string;
  Nama_Dokter_Ruangan_1: string;
  TTD_Pasien_Ruangan_1: string;
  ID_Apoteker_Ruangan_1: string;
  TTD_Apoteker_Ruangan_1: string;
  Nama_Apoteker_Ruangan_1: string;
  Unit_Ruangan_2: string;
  Nama_Ka_Unit_Ruangan_2: string;
  ID_Ka_Unit_Ruangan_2: string;
  Waktu_Ruangan_2: string;
  Obat_Ruangan_2: Array<IObatRuangan>;
  ID_Perawat_Ruangan_2: string;
  TTD_Perawat_Ruangan_2: string;
  Nama_Perawat_Ruangan_2: string;
  ID_Dokter_Ruangan_2: string;
  TTD_Dokter_Ruangan_2: string;
  Nama_Dokter_Ruangan_2: string;
  TTD_Pasien_Ruangan_2: string;
  ID_Apoteker_Ruangan_2: string;
  TTD_Apoteker_Ruangan_2: string;
  Nama_Apoteker_Ruangan_2: string;
  Unit_Keluar: string;
  Nama_Ka_Unit_Keluar: string;
  ID_Ka_Unit_Keluar: string;
  Waktu_Keluar: string;
  Obat_Keluar: Array<IObatKeluar>;
  ID_Perawat_Keluar: string;
  TTD_Perawat_Keluar: string;
  Nama_Perawat_Keluar: string;
  ID_Dokter_Keluar: string;
  TTD_Dokter_Keluar: string;
  Nama_Dokter_Keluar: string;
  TTD_Pasien_Keluar: string;
  ID_Apoteker_Keluar: string;
  TTD_Apoteker_Keluar: string;
  Nama_Apoteker_Keluar: string;
  Updated_At: string;
  Updated_By: string;
  ID_Petugas: string;
  Nama_Petugas: string;
}

interface IObatDiterima {
  Nama_Obat: string;
  Satuan: string;
  No_Bets: string;
  Aturan_Pakai: string;
  Tanggal_Mulai: string;
  Tanggal_Selesai: string;
  Obat_Dicurigai_Check: string;
}

interface IEfekSampingObat {
  Terjadi_Efek_Samping_Obat: string;
  Waktu: string;
  Jenis_Kelamin: string;
  Status_Hamil: string;
  Suku_Check: string;
  Nama_Suku: string;
  Berat_Badan_Check: string;
  Berat_Badan: string;
  Diagnosa_Utama: string;
  Kesudahan_Penyakit_Utama: string;
  Riwayat_Hati_Check: string;
  Riwayat_Ginjal_Check: string;
  Riwayat_Lain_Check: string;
  Riwayat_Lain_Text: string;
  Bentuk_Manifestasi_ESO: string;
  Tanggal_Mula_Terjadi: string;
  Tanggal_Kesudahan: string;
  Kesudahan_ESO: string;
  Riwayat_ESO_Sebelum: string;
  Obat_Diterima: Array<IObatDiterima>;
  Keterangan_Tambahan: string;
  Algoritma_Naranjo_1: string;
  Algoritma_Naranjo_2: string;
  Algoritma_Naranjo_3: string;
  Algoritma_Naranjo_4: string;
  Algoritma_Naranjo_5: string;
  Algoritma_Naranjo_6: string;
  Algoritma_Naranjo_7: string;
  Algoritma_Naranjo_8: string;
  Algoritma_Naranjo_9: string;
  Algoritma_Naranjo_10: string;
  Total_Skor: string;
  ID_Pelapor: string;
  Nama_Pelapor: string;
  TTD_Pelapor: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;
}

interface IPharmacy {
	Tebus_Obat?: ITebusObat
  Obat_Diberikan?: any[];
  Pemberian_Obat?: Array<IPemberianObat>
  Rekonsiliasi_Obat?: IRekonsiliasiObat;
  Efek_Samping_Obat?: IEfekSampingObat;
}

interface IFormPatientIdentity {
	Tanda_Tangan_Radio: string;
	Tanda_Tangan_Pasien: string;
	Tanda_Tangan_Wali: string;
	Tanda_Tangan_Petugas: string
	ID_Petugas: string
	Nama_Petugas: string
	Updated_At: string
	Updated_By: string
	Updated_By_Name: string
}

interface IFormResumeMedis {
	Tindakan: string;
  Usg_Mata?: number;
  ID_Dokter:string;
  TTD_Dokter: string;
  Updated_At: string;
  Updated_By: string;
  Foto_Fundus?: number;
  Nama_Dokter: string;
  Alasan_Kontrol: string;
  Tanggal_Kontrol: string;
  Updated_By_Name: string;
  Alasan_Belum_Dapat:string;
  Pemeriksaan_Oct_Papil?: number;
  Rencana_Tindak_Lanjut: string;
  Laboratorium_Radiologi?: number;
  Pemeriksaan_Oct_Retina?: number;
  Pemeriksaan_Lapang_Pandang?: number;
}

interface IFormGeneralConsent {
	Tanggal_TTD: string
	ID_Saksi: string
	Nama_Saksi: string
	TTD_Saksi: string
	Tanda_Tangan: string
	Tanda_Tangan_Nama: string
	Tanda_Tangan_Telepon: string
	Tanda_Tangan_Alamat: string
	Tipe_Pembayaran: string
	Nama_Wali: string
	Pelepasan_Lain: string
	Nama_Dokter_Rawat: string
	ID_Dokter_Rawat: string
	Nama_Dokter_Jaga: string
	ID_Dokter_Jaga: string
	Bersedia_Dikunjung: number
	Nama_Tidak_Diizinkan: Array<string>
	TTD_Pasien: string
	ID_Petugas: string
	Nama_Petugas: string
	Updated_At: string
	Updated_By: string
	Updated_By_Name: string
}

interface IReactSelect {
  label: string;
  value: string;
}

interface IPengkajianKeperawatan {
  Alergi: string;
  Alergi_Select: Array<IReactSelect>;
  Alergi_Radio: string;
  Alergi_Lain: string;
  Alergi_Lain_Teks: string;
  RPT: string;
  RPT_Select: Array<IReactSelect>;
  RPT_Radio: string;
  RPT_Lain: string;
  RPT_Lain_Teks: string;
  RPO: string;
  RPO_Select: Array<IReactSelect>;
  RPO_Radio: string;
  RPO_Lain: string;
  RPO_Lain_Teks: string;
  KLL_Radio: string;
}

interface IInformationAllergy {
  Alergi: string;
  Pengkajian_Keperawatan: IPengkajianKeperawatan;
  ID_Petugas: string;
  Updated_At: string;
  Updated_By: string;
  Nama_Petugas: string;
  Updated_By_Name: string;
}

interface IPernyataanBPJS {
  Tanggal_TTD: string;
  ID_TTD_Petugas: string;
  Nama_TTD_Petugas: string;
  ID_TTD_Saksi: string;
  Nama_TTD_Saksi: string;
  TTD_Pasien: string;
  TTD_Wali: string;
  TTD_Petugas: string;
  TTD_Saksi: string;
  Penanggung_Jawab: string;
  Umur_Wali: string;
  Jenis_Kelamin_Wali: string;
  Nama_Wali: string;
  Alamat_Wali: string;
  Hubungan_Wali: string;
  ID_Petugas?: string;
  Nama_Petugas?: string;
  Updated_At?: string;
  Updated_By?: string;
  Updated_By_Name?: string;
}

interface IPernyataanUMUM {
  Tanggal_TTD: string;
  ID_TTD_Petugas: string;
  Nama_TTD_Petugas: string;
  ID_TTD_Saksi: string;
  Nama_TTD_Saksi: string;
  NIK: string;
  TTD_Pasien: string;
  TTD_Wali: string;
  TTD_Petugas: string;
  TTD_Saksi: string;
  ID_Petugas?: string;
  Nama_Petugas?: string;
  Updated_At?: string;
  Updated_By?: string;
  Updated_By_Name?: string;
}
interface IInformation {
	Identitas_Pasien?: IFormPatientIdentity
	General_Consent?: IFormGeneralConsent
	Informasi?: IInformationAllergy
	Resume_Medis?: IFormResumeMedis
  Pernyataan_BPJS?: IPernyataanBPJS;
  Pernyataan_UMUM?: IPernyataanUMUM;
}

interface IField {
	Name: string
	Value: string
}

interface IGlassesPrescriptionDetail {
  Reading: string;
  Distance: string;
}

interface IGlassesPrescriptionEyes {
  Ax?: IGlassesPrescriptionDetail;
  Va?: IGlassesPrescriptionDetail;
  Cyl?: IGlassesPrescriptionDetail;
  Sph?: IGlassesPrescriptionDetail;
}

interface IPrescriptionDetail {
  No_Faktur: number;
  ID_Resep_H: number;
}

interface IFormResepKacamata {
  Pengkajian_Awal_Od: string;
  Pengkajian_Awal_Os: string;
  PD?: IGlassesPrescriptionDetail;
  Left?: IGlassesPrescriptionEyes;
  Right?: IGlassesPrescriptionEyes;
  ID_Resep?: IPrescriptionDetail;
  Dokter_Id: string;
  ID_Petugas: string;
  TTD_Dokter: string;
  Updated_At: string;
  Updated_By: string;
  Dokter_Nama: string;
  Catatan_Lain: string;
  Nama_Petugas: string;
  Tanggal_Resep: string;
}

interface IOptic {
	Resep_Kacamata: IFormResepKacamata;
}

interface IFormFormulirTriase {
  TTD_Perawat: string;
  ID_Perawat: string;
  Nama_Perawat: string;
	ID_Petugas: string;
	Updated_At: string;
	Updated_By: string;
	Cara_Datang: string;
	Respon_Time: string;
	Nama_Petugas: string;
	Warna_Triase: string;
	Jenis_Emergency: string;
	Waktu_Kedatangan: string;
	Kesadaran_1_GCS_9: number;
	Kesadaran_3_Bebas: number;
	Kesadaran_6_GCS_0: number;
	Sirkulasi_2_Pucat: number;
	Jenis_Kasus_Trauma: string;
	Kesadaran_1_Kejang: number;
	Kesadaran_3_Apatis: number;
	Kesadaran_4_GCS_15: number;
	Kesadaran_5_GCS_15: number;
	Kesadaran_Kategori: string;
	Pernafasan_2_Mengi: number;
	Pernafasan_3_Mengi: number;
	Pernafasan_3_Sesak: number;
	Pernafasan_6_Minus: number;
	Sirkulasi_Kategori: string;
	Jalan_Nafas_2_Bebas: number;
	Jalan_Nafas_3_Bebas: number;
	Jalan_Nafas_4_Bebas: number;
	Jalan_Nafas_5_Bebas: number;
	Kesadaran_2_Gelisah: number;
	Pernafasan_3_Normal: number;
	Pernafasan_4_Normal: number;
	Pernafasan_5_Normal: number;
	Pernafasan_Kategori: string;
	Sirkulasi_3_TDD_100: number;
	Sirkulasi_3_TDS_160: number;
	Tanda_Lain_Kategori: string;
	Jalan_Nafas_Kategori: string;
	Kesadaran_2_GCS_9_12: number;
	Kesadaran_3_Samnolen: number;
	Jalan_Nafas_2_Ancaman: number;
	Kesadaran_3_GCS_12_15: number;
	Pernafasan_1_Sianosis: number;
	Pernafasan_2_Takipnoe: number;
	Sirkulasi_2_Takikardi: number;
	Sirkulasi_3_Nadi_Kuat: number;
	Sirkulasi_4_Nadi_Kuat: number;
	Sirkulasi_4_TDD_70_90: number;
	Sirkulasi_5_Nadi_Kuat: number;
	Sirkulasi_5_TDD_70_90: number;
	Sirkulasi_6_TDS_Minus: number;
	Jalan_Nafas_1_Sumbatan: number;
	Jenis_Kasus_Kecelakaan: string;
	Kesadaran_2_Nyeri_Dada: number;
	Pernafasan_1_Bradipnoe: number;
	Sirkulasi_2_Bradikardi: number;
	Sirkulasi_3_Takikardia: number;
	Sirkulasi_6_Nadi_Minus: number;
	Jalan_Nafas_6_Tidak_Ada: number;
	Kesadaran_2_Hemiparesis: number;
	Sirkulasi_2_CRT_2_Detik: number;
	Sirkulasi_4_Nadi_Normal: number;
	Sirkulasi_4_TDS_100_120: number;
	Sirkulasi_5_Nadi_Normal: number;
	Sirkulasi_5_TDS_100_120: number;
	Tanda_Lain_4_Nyeri_Mata: number;
	Sirkulasi_1_Akral_Dingin: number;
	Sirkulasi_2_Akral_Dingin: number;
	Tanda_Lain_1_Threatening: number;
	Tanda_Lain_6_Visus_Minus: number;
	Sirkulasi_1_Henti_Jantung: number;
	Tanda_Lain_2_Trauma_Kimia: number;
	Tanda_Lain_3_Nyeri_Sedang: number;
	Tanda_Lain_4_Visus_Normal: number;
	Tanda_Lain_5_Visus_Normal: number;
	Pernafasan_1_Hipoventilasi: number;
	Tanda_Lain_2_Trauma_Tembus: number;
	Kesadaran_6_Tanda_Kehidupan: number;
	Tanda_Lain_2_Nyeri_Mendadak: number;
	Tanda_Lain_3_Visus_Abnormal: number;
	Kesadaran_1_Tidak_Ada_Respon: number;
	Tanda_Lain_2_Penurunan_Visus: number;
	Tanda_Lain_5_Tidak_Ada_Nyeri: number;
	Sirkulasi_1_Nadi_Tidak_Teraba: number;
	Sirkulasi_2_Nadi_Teraba_Lemah: number;
	Sirkulasi_6_Frekuensi_Nadi_Minus: number;
}

interface IFormAssesmenUGD {
	GCS_E: string
  GCS_M: string
  GCS_V: string
  Resep: any[]
  GCS_Score: string
  GCS_E_Teks: string
  GCS_M_Teks: string
  GCS_V_Teks: string
  ID_Petugas: string
  Updated_At: string
  Updated_By: string
  Vital_Suhu: string
  Alergi_Obat: string
  Skala_Nyeri: string
  Kerabat_Nama: string
  Mental_Sadar?: number
  Nama_Petugas: string
  Nutrisi_Berat: string
  Alergi_Lainnya: string
  Alergi_Makanan: string
  Asal_Informasi: string
  Gambar_Mata_OD: string
  Gambar_Mata_OS: string
  Kesadaran_Teks: string
  Nutrisi_Tinggi: string
  Sirkulasi_Teks: string
  Kerabat_Telepon: string
  Kesadaran_Value: string
  Mental_Perilaku?: number
  Pengkajian_Dada: string
  Pengkajian_Gigi: string
  Pengkajian_Mata: string
  Pengkajian_Paru: string
  Pernafasan_Teks: string
  Sirkulasi_Value: string
  Spiritual_Agama: string
  TTD_Perawat: string;
  ID_Perawat: string;
  Nama_Perawat: string;
  TTD_Dokter_Mata: string
  Triase_Sekunder: string
  Vital_Kesadaran: string
  Jalan_Nafas_Teks: string
  Kerabat_Hubungan: string
  Mental_Kekerasan?: number
  Pengkajian_Leher: string
  Pengkajian_OD_VA: string
  Pengkajian_OS_VA: string
  Pernafasan_Value: string
  Psikologis_Cemas?: number
  Psikologis_Marah?: number
  Psikologis_Sedih?: number
  Psikologis_Takut?: number
  Status_Kehamilan?: number
  Jalan_Nafas_Value: string
  Kedatangan_Pasien: string
  Pengkajian_Fungsi: string
  Pengkajian_Hidung: string
  Pengkajian_Kepala: string
  Vital_Denyut_Nadi: string
  Bantuan_Nafas_Teks: string
  Dokter_Mata_COA_OD: string
  Dokter_Mata_COA_OS: string
  Dokter_Mata_Terapi: string
  Nutrisi_Total_Skor: string
  Pengkajian_Abdomen: string
  Pengkajian_Anjuran: string
  Pengkajian_Jantung: string
  Pengkajian_Telinga: string
  Penyakit_Terdahulu: string
  Asal_Informasi_Teks: string
  Bantuan_Nafas_Value: string
  Dokter_Mata_Anjuran: string
  Dokter_Mata_Iris_OD: string
  Dokter_Mata_Iris_OS: string
  Pengkajian_Assesmen: string
  Pengkajian_Eks_Atas: string
  Pertolongan_Pertama: string
  TTD_Dokter_Pengkaji: string
  Tindakan_Resusitasi: string
  Vital_Tekanan_Darah: string
  Dokter_Mata_Diagnosa: string
  Dokter_Mata_Lensa_OD: string
  Dokter_Mata_Lensa_OS: string
  Dokter_Mata_Pupil_OD: string
  Dokter_Mata_Pupil_OS: string
  Nutrisi_Lebih_Lanjut: string
  Pengkajian_Eks_Bawah: string
  Pengkajian_Genitalia: string
  Pengkajian_Kandungan: string
  Pengkajian_Subjektif: string
  Pengobatan_Terdahulu: string
  Psikologis_Lain_Lain?: number
  Dokter_Mata_Cornea_OD: string
  Dokter_Mata_Cornea_OS: string
  Dokter_Mata_Posisi_OD: string
  Dokter_Mata_Posisi_OS: string
  Keperawatan_Rencana_0?: number
  Keperawatan_Rencana_1?: number
  Keperawatan_Rencana_2?: number
  Keperawatan_Rencana_3?: number
  Keperawatan_Rencana_4?: number
  Keperawatan_Rencana_5?: number
  Keperawatan_Rencana_6?: number
  Keperawatan_Rencana_7?: number
  Penurunan_Berat_Badan?: number
  Penurunan_Nafsu_Makan?: number
  Status_Kehamilan_HPHT: string
  Status_Kehamilan_Para: string
  Keperawatan_Diagnosa_0?: number
  Keperawatan_Diagnosa_1?: number
  Keperawatan_Diagnosa_2?: number
  Keperawatan_Diagnosa_3?: number
  Keperawatan_Diagnosa_4?: number
  Keperawatan_Diagnosa_5?: number
  Keperawatan_Diagnosa_6?: number
  Keperawatan_Diagnosa_7?: number
  Pengkajian_Fungsi_Teks: string
  Pengkajian_Tenggorokan: string
  Penilaian_Risiko_Jatuh?: number
  Risiko_Jatuh_Ibu_Hamil?: number
  Vital_Respiratory_Rate: string
  Asal_Informasi_Hubungan: string
  Dokter_Mata_Vitreous_OD: string
  Dokter_Mata_Vitreous_OS: string
  Nutrisi_Diagnosa_Khusus: string
  Pengkajian_OD_Tonometri: string
  Pengkajian_OS_Tonometri: string
  Risiko_Jatuh_Alat_Bantu?: number
  Risiko_Jatuh_Lanjut_Usia?: number
  Status_Kehamilan_Abortus: string
  Status_Kehamilan_Gravida: string
  Dokter_Mata_Conj_Bulbi_OD: string
  Dokter_Mata_Conj_Bulbi_OS: string
  Dokter_Mata_Funduscopy_OD: string
  Dokter_Mata_Funduscopy_OS: string
  Dokter_Mata_Pergerakan_OD: string
  Dokter_Mata_Pergerakan_OS: string
  Sirkulasi_Resusitasi_Teks: string
  Mental_Perilaku_Keterangan: string
  Sirkulasi_Resusitasi_Value: string
  Keperawatan_Rencana_Lainnya: string
  Mental_Kekerasan_Keterangan: string
  Penurunan_Berat_Badan_Nilai?: number
  Keperawatan_Diagnosa_Lainnya: string
  Dokter_Mata_Rencana_Pengobatan: string
  Pengkajian_Terapi_Penatalaksaan: string
  Psikologis_Lain_Lain_Keterangan: string
  Dokter_Mata_Palpebra_Superior_OD: string
  Dokter_Mata_Palpebra_Superior_OS: string
  Pengkajian_Pemeriksaan_Penunjang: string
  Nutrisi_Diagnosa_Khusus_Keterangan: string
  Dokter_Mata_Conj_Tarsal_Inferior_OD: string
  Dokter_Mata_Conj_Tarsal_Inferior_OS: string
  Dokter_Mata_Conj_Tarsal_Superior_OD: string
  Dokter_Mata_Conj_Tarsal_Superior_OS: string
  Psikologis_Kecenderungan_Bunuh_Diri?: number
	ID_Pengkajian_Dokter: string;
	ID_Dokter_Mata_Dokter: string;
}

interface ITemplateODS {
  Eye_Image: string;
  VA: string;
  False: string;
  PH: string;
  Add: string;
  Jagger: string;
  Non_Contact: string;
  Schiotz: string;
}

interface IBPRJUGD {
  OD: ITemplateODS;
  OS: ITemplateODS;
  KGD: string;
  TD: string;
  Diagnosa: string;
  Terapi: string;
  Anjuran: string;
  Resep: any[];
  Tanggal_TTD: string;
  Tanda_Tangan_Radio: string;
  Tanda_Tangan_Pasien: string;
  Tanda_Tangan_Wali: string;
  TTD_Dokter: string;
  ID_Dokter: string;
  Nama_Dokter: string;
  SIP_Dokter: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;
}

interface IEmergencyRoom {
	Formulir_Triase?: IFormFormulirTriase;
	Assesmen?: IFormAssesmenUGD;
  Bukti_Pelayanan?: IBPRJUGD;
}

interface IPrescription {
  key?: string;
  Jumlah?: string;
  Catatan?: string;
  ID_Obat: string;
  ID_Satuan?: string;
  Nama_Obat?: string;
  Nama_Satuan: string;
  ID_AturanPakai?: number;
  Kode_AturanPakai: string;
  Nama_AturanPakai?: string;
}

interface IPediatric {
  Hes_OD_Hes: string;
  Hes_OS_Hes: string;
  Okn_OD_Okn: string;
  Okn_OS_Okn: string;
  Raf_OD_Raf: string;
  Raf_OS_Raf: string;
  Tac_OD_At_38: string;
  Tac_OD_At_55: string;
  Tac_OD_At_84: string;
  Tac_OS_At_38: string;
  Tac_OS_At_55: string;
  Tac_OS_At_84: string;
  Cover_OD_Cover_1: string;
  Cover_OD_Cover_2: string;
  Cover_OD_Cover_3: string;
  Cover_OD_Cover_4: string;
  Cover_OD_Cover_5: string;
  Cover_OD_Cover_6: string;
  Cover_OS_Cover_1: string;
  Cover_OS_Cover_2: string;
  Cover_OS_Cover_3: string;
  Cover_OS_Cover_4: string;
  Cover_OS_Cover_5: string;
  Cover_OS_Cover_6: string;
  Prisma_OD_Prisma: string;
  Prisma_OS_Prisma: string;
  Randot_OD_Animal: string;
  Randot_OS_Animal: string;
  Rpl_Streak_OD_Va: string;
  Rpl_Streak_OS_Va: string;
  Submit_Pediatrik: string;
  Randot_OD_Circles: string;
  Randot_OS_Circles: string;
  Rpl_Streak_OD_False: string;
  Rpl_Streak_OS_False: string;
  Randot_OD_Randot_Form: string;
  Randot_OS_Randot_Form: string;
  Rpl_Streak_OD_Pd_Jauh: string;
  Rpl_Streak_OS_Pd_Jauh: string;
  Rpl_Streak_OD_Adaptasi: string;
  Rpl_Streak_OS_Adaptasi: string;
  Goniometer_OD_Goniometer: string;
  Goniometer_OS_Goniometer: string;
  Nearvision_OD_Select: string;
  Nearvision_OS_Select: string;
  Nearvision_OD_Nearvision: string;
  Nearvision_OS_Nearvision: string;
  Rpl_Streak_OD_Streak_Cyl: string;
  Rpl_Streak_OD_Streak_Sph: string;
  Rpl_Streak_OS_Streak_Cyl: string;
  Rpl_Streak_OS_Streak_Sph: string;
  Cardif_OD_Test_Distance_1: string;
  Cardif_OS_Test_Distance_1: string;
  Rpl_Streak_OD_Streak_Axis: string;
  Rpl_Streak_OS_Streak_Axis: string;
  Cardif_OD_Test_Distance_50: string;
  Cardif_OS_Test_Distance_50: string;
}

interface IFormPengkajianAwalDokter {
	CPPT_ID?: string;
	Resep: Array<IPrescription>;
  COA_OD: string;
  COA_OS: string;
  Terapi: string;
  Anjuran: string;
  Iris_OD: string;
  Iris_OS: string;
  Keluhan: string;
  Diagnosa: string;
  Lensa_OD: string;
  Lensa_OS: string;
  Pupil_OD: string;
  Pupil_OS: string;
  Cornea_OD: string;
  Cornea_OS: string;
  Pediatrik: any;
  Posisi_OD: string;
  Posisi_OS: string;
  ID_Petugas: string;
  Updated_At: string;
  Updated_By: string;
  Vitreous_OD: string;
  Vitreous_OS: string;
  Nama_Petugas: string;
  Conj_Bulbi_OD: string;
  Conj_Bulbi_OS: string;
  Funduscopy_OD: string;
  Funduscopy_OS: string;
  Pergerakan_OD: string;
  Pergerakan_OS: string;
  Submit_Retina: string;
  Gambar_Mata_OD: string;
  Gambar_Mata_OS: string;
  Gambar_Retina_OD: string;
  Gambar_Retina_OS: string;
  Submit_Pediatrik: string;
  ID_Dokter_Pengkaji: string;
  Tanggal_Pengkajian: string;
  TTD_Dokter_Pengkaji: string;
  Nama_Dokter_Pengkaji: string;
  Palpebra_Inferior_OD: string;
  Palpebra_Inferior_OS: string;
  Palpebra_Superior_OD: string;
  Palpebra_Superior_OS: string;
  Conj_Tarsal_Inferior_OD: string;
  Conj_Tarsal_Inferior_OS: string;
  Conj_Tarsal_Superior_OD: string;
  Conj_Tarsal_Superior_OS: string;
}

interface IStatusMental {
  Koma: number;
  Agitasi:number;
  Bingung: number;
  Mengantuk: number;
  Sadar_Penuh: number;
}

interface IRiwayatPenyakit {
  Diabetes: number;
  Hepatitis: number;
  Lain_lain: number;
  Tidak_Ada: number;
  Hipertensi: number;
}

interface IPemeriksaanPenunjang {
  Koma: number;
  Rongent: number;
  Biometri: number;
  USG_Mata: number;
  Lain_lain: number;
  Tidak_Ada: number;
  Foto_Fundus: number;
  Laboratorium: number;
}

interface IOKCatatanKeperawatanPraOp {
  Bb: string;
  Rr: string;
  Tb: string;
  Td: string;
  T: string;
  Sat: string;
  Nadi: string;
  Suhu: string;
  Alergi: string;
  Tanggal: string;
  Alat_Bantu: string;
  ID_Petugas: string;
  Updated_At: string;
  Updated_By: string;
  Skala_Nyeri: string;
  Nama_Petugas: string;
  Status_Mental: IStatusMental;
  Persiapan_Kulit: number;
  Persiapan_Puasa: number;
  Riwayat_Penyakit: IRiwayatPenyakit;
  Alergi_Keterangan: string;
  Lain_Site_Marking: number;
  ID_Perawat_Ruangan: string;
  Operasi_Sebelumnya: string;
  ID_Perawat_Penerima: string;
  Pengobatan_Saat_Ini: string;
  TTD_Perawat_Ruangan: string;
  Nama_Perawat_Ruangan: string;
  Persiapan_Alat_Bantu: number;
  TTD_Perawat_Penerima: string;
  Alat_Bantu_Keterangan: string;
  Nama_Perawat_Penerima: string;
  Operasi_Sebelumnya_Di: string;
  Pemeriksaan_Penunjang: IPemeriksaanPenunjang;
  Lain_Penjelasan_Singkat: number;
  Persiapan_Prothese_Luar: number;
  Persiapan_Prothese_Dalam: number;
  Persiapan_Vaskuler_Akses: number;
  Persiapan_Obat_Disertakan: number;
  Persiapan_Penjepit_Rambut: number;
  Verifikasi_Periksa_Gelang: number;
  Operasi_Sebelumnya_Tanggal: string;
  Persiapan_Kulit_Keterangan: string;
  Persiapan_Puasa_Keterangan: string;
  Riwayat_Penyakit_Keterangan: string;
  Verifikasi_Kelengkapan_X_Ray: number;
  Verifikasi_Periksa_Identitas: number;
  Operasi_Sebelumnya_Keterangan: string;
  Verifikasi_Surat_Izin_Operasi: number;
  Pengobatan_Saat_Ini_Keterangan: string;
  Persiapan_Alat_Bantu_Keterangan: string;
  Verifikasi_Jenis_Lokasi_Operasi: number;
  Verifikasi_Persetujuan_Anestesi: number;
  Pemeriksaan_Penunjang_Keterangan: string;
  Persiapan_Obat_Terakhir_Diberikan: number;
  Persiapan_Prothese_Luar_Keterangan: string;
  Verifikasi_Surat_Pengantar_Operasi: number;
  Persiapan_Prothese_Dalam_Keterangan: string;
  Persiapan_Vaskuler_Akses_Keterangan: string;
  Verifikasi_Kelengkapan_Resume_Medis: number;
  Persiapan_Obat_Disertakan_Keterangan: string;
  Persiapan_Penjepit_Rambut_Keterangan: string;
  Verifikasi_Masalah_Bahasa_Komunikasi: number;
  Verifikasi_Periksa_Gelang_Keterangan: string;
  Verifikasi_Kelengkapan_X_Ray_Keterangan: string;
  Verifikasi_Periksa_Identitas_Keterangan: string;
  Verifikasi_Surat_Izin_Operasi_Keterangan: string;
  Verifikasi_Jenis_Lokasi_Operasi_Keterangan: string;
  Verifikasi_Persetujuan_Anestesi_Keterangan: string;
  Persiapan_Obat_Terakhir_Diberikan_Keterangan: string;
  Verifikasi_Surat_Pengantar_Operasi_Keterangan: string;
  Verifikasi_Kelengkapan_Resume_Medis_Keterangan: string;
  Verifikasi_Masalah_Bahasa_Komunikasi_Keterangan: string;
}

interface IInstruksiPascaBedahRajal {
  Waktu: string
  ID_DPJP: string
  TTD_DPJP: string
  Lain_Lain: string
  Nama_DPJP: string
  ID_Petugas: string
  Mobilisasi: string
  TTD_Pasien: string
  Updated_At: string
  Updated_By: string
  Anjuran_Lain: number
  Anjuran_Obat: number
  Nama_Petugas: string
  Keluhan_Rumah: string
  Terjadi_Rumah: string
  Jadwal_Kontrol: string
  Anjuran_Alkohol: number
  Anjuran_Terkena: number
  Nomor_Dihubungi: string
  Pendamping_Lain: number
  Pendamping_Medis: number
  Anjuran_Kendaraan: number
  Anjuran_Lain_Teks: string
  Anjuran_Tidur_Dll: number
  Anjuran_Alat_Berat: number
  Anjuran_Ekstremitas: number
  Pendamping_Keluarga: number
  Pendamping_Lain_Teks: string
  Anjuran_Tidur_Lain_Teks: string
  Anjuran_Tidur_Telentang: number
  Anjuran_Tidur_Telungkup: number
  Anjuran_Tidur_Membungkuk: number
  Pendamping_Keluarga_Teks: string
}

interface ISurveilansInfeksiHais {
  Ruangan_Hais: string;
  Tanggal_Berobat: string;
  Diagnosa_Masuk: string;
  Asal_Masuk: string;
  Vena_Sentral_Check: string;
  Vena_Perifer_Check: string;
  Lokasi_VS: string;
  Mulai_VS: string;
  Selesai_VS: string;
  Total_Hari_VS: string;
  Tanggal_Infeksi_VS: string;
  Catatan_VS: string;
  Lokasi_VP: string;
  Mulai_VP: string;
  Selesai_VP: string;
  Total_Hari_VP: string;
  Tanggal_Infeksi_VP: string;
  Catatan_VP: string;
  Tindakan_Alkes_Lain: string;
  Lokasi_Lain: string;
  Mulai_Lain: string;
  Selesai_Lain: string;
  Total_Hari_Lain: string;
  Tanggal_Infeksi_Lain: string;
  Catatan_Lain: string;
  HBS_Ag: string;
  Anti_HCV: string;
  Anti_HIV: string;
  Faktor_Penyakit_Lain: string;
  Lab_Leukocyt: string;
  Lab_LED: string;
  Lab_Lain: string;
  Hasil_Radiologi: string;
  Merokok: string;
  Steroid_Jangka_Panjang: string;
  Mandi_Sebelum_Operasi: string;
  Operasi_Karena_Trauma: string;
  Obat_Pengencer_Darah: string;
  Memakai_Make_Up: string;
  Gula_Darah: string
  Suhu_Pasien: string;
  Infeksi_Mata_Check: string;
  Infeksi_THT_Check: string;
  Infeksi_Mulut_Check: string;
  Infeksi_Paru_Check: string;
  Infeksi_Kulit_Check: string;
  Infeksi_GI_Check: string;
  Infeksi_Lainnya_Check: string;
  Infeksi_Lainnya_Text: string;
  Penyakit_DM_Check: string;
  Penyakit_Hipertensi_Check: string;
  Penyakit_GGK_Check: string;
  Penyakit_Sepsis_Check: string;
  Riwayat_Pasien_Sekarang: string;
  Jenis_Operasi: string;
  ASA_Score: string;
  Jenis_Anestesi: string;
  Operator_Anestesi: string;
  Kelembapan_Udara: string;
  Suhu_Ruangan: string;
  Komplikasi_Saat_Operasi: string;
  Profilaksis: string;
  Obat_Profilaksis: string;
  Antibiotik_Tambahan: string;
  Obat_Antibiotik: string;
  Dosis_Antibiotik: string;
  Jam_Diberikan_Antibiotik: string;
  Probe_Laser: string;
  Tubing_Vitrectomy: string;
  Chlorhexidine_Check: string;
  Povidone_Iodine_Check: string;
  Alkohol_70_Check: string;
  Jahitan: string;
  Indikator_Instrumen: string;
  Sterilisasi_CSSD: string;
  Inisial_Dr: string;
  Asisten_Op: string;
  Urutan_Op: string;
  Implant: string;
  Lama_Op: string;
  Ruang_Operasi: string;
  Klasifikasi_Luka: string;
  Prosedur_Op: string;
  Kualifikasi_Dokter_Bedah: string;
  Jumlah_Staf: string;
  Diagnosa_Akhir: string;
  Tanggal_Pasien_Keluar: string;
  Cara_Pasien_Keluar: string;
  Nama_Pindah_Faskes: string;
  ID_Perawat: string;
  TTD_Perawat: string;
  Nama_Perawat: string;
  ID_Perawat_IPCN: string;
  TTD_Perawat_IPCN: string;
  Nama_Perawat_IPCN: string;
  Updated_At: string;
  Updated_By: string;
  ID_Petugas: string;
  Nama_Petugas: string;
}

interface IPenyakitPeserta {
  Hepar: number
  Ginjal: number
  Jantung: number
  Koroner: number
  Lain_lain: number
  Hipertensi: number
  Dekompensasi: number
  Pembekuan_Darah: number
  Diabetes_Melitus: number
}

interface IPengobatanSaatIni {
  Obat_Dm: number
  Sedatine: number
  Lain_lain: number
  Tidak_Ada: number
  Corticosteroid: number
  Obat_Hipertensi: number
}

interface IAsesmenPraOperasi {
  Rr: string
  Td: string
  Dll: string
  Nadi: string
  Suhu: string
  Alergi: string
  Tanggal: string
  Anestesi: string
  Biometri: string
  Diagnosa: string
  Usg_Mata: string
  ID_Dokter: string
  Tonometri: string
  Ahli_Bedah: string
  ID_Petugas: string
  Oct_Makula: string
  TTD_Dokter: string
  Updated_At: string
  Updated_By: string
  Foto_Fundus: string
  Jenis_Kasus: string
  Nama_Dokter: string
  Persetujuan: string
  Skala_Nyeri: string
  Nama_Petugas: string
  Rencana_Operasi: string
  Tanggal_Operasi: string
  Hasil_Konsultasi: string
  Penyakit_Peserta: string
  Persediaan_Darah: string
  Alergi_Keterangan: string
  Pengobatan_Saat_Ini: string
  Pengobatan_Saat_Ini_Lain: string
  Penyakit_Peserta_Keterangan: string
}

interface IStatusAnestesi {
  ID_DPJP_Anestesi: string;
  Nama_DPJP_Anestesi: string;
  ID_Asisten_Anestesi: string;
  Nama_Asisten_Anestesi: string;
  ID_DPJP_Bedah: string;
  Nama_DPJP_Bedah: string;
  Diagnosa_Pra_Bedah: string;
  Jenis_Pembedahan: string;
  Diagnosis_Pasca_Bedah: string;
  Teknik_Anestesi: string;
  Teknik_Anestesi_Lainnya: string;
  Teknik_Khusus_Hipotensi: string;
  Teknik_Khusus_Bronkoskopi: string;
  Teknik_Khusus_TCI: string;
  Teknik_Khusus_Glidescope: string;
  Teknik_Khusus_CPB: string;
  Teknik_Khusus_USG: string;
  Teknik_Khusus_Ventilasi: string;
  Teknik_Khusus_Stimulator: string;
  Teknik_Khusus_Lainnya: string;
  Teknik_Khusus_Lainnya_Teks: string;
  Monitoring_EKG: string;
  Monitoring_EKG_Teks: string;
  Monitoring_NIBP: string;
  Monitoring_Cath: string;
  Monitoring_Arteri: string;
  Monitoring_Arteri_Teks: string;
  Monitoring_NGT: string;
  Monitoring_SpO2: string;
  Monitoring_EtCO2: string;
  Monitoring_BIS: string;
  Monitoring_Katerer: string;
  Monitoring_Stetoskop: string;
  Monitoring_CVP: string;
  Monitoring_CVP_Teks: string;
  Monitoring_Temp: string;
  Monitoring_Lainnya: string;
  Monitoring_Lainnya_Teks: string;
  ASA: string;
  Alergi: string;
  Alergi_Keterangan: string;
  Penyulit_Pra_Anestesi: string;
  Checklist_Inform_Consent: string;
  Checklist_Monitoring: string;
  Checklist_Obat_Anestesi: string;
  Checklist_Obat_Emergensi: string;
  Checklist_Tatalaksana: string;
  Checklist_Suction: string;
  Checklist_Mesin: string;
  Jam_Pra_Induksi: string;
  Pra_Induksi_Kesadaran: string;
  Pra_Induksi_Tekanan_Darah: string;
  Pra_Induksi_Denyut_Nadi: string;
  Pra_Induksi_RR: string;
  Pra_Induksi_Suhu: string;
  Pra_Induksi_Saturasi: string;
  Pra_Induksi_Lainnya: string;
  Catatan: string;
  Infus_Perifer_1: string;
  Infus_Perifer_2: string;
  Infus_Perifer_3: string;
  Posisi: string;
  Posisi_Lainnya: string;
  Premedikasi_Oral: string;
  Premedikasi_IM: string;
  Premedikasi_IV: string;
  Induksi_Intravena: string;
  Induksi_Inhalasi: string;
  Face_Mask_No: string;
  Oro_No: string;
  ETT_No: string;
  ETT_Jenis: string;
  ETT_Fiksasi: string;
  LMA_No: string;
  LMA_Jenis: string;
  Trakhesotomi: string;
  Bronkoskopi_Fiber: string;
  Glidescope: string;
  Tata_Laksana_Lainnya: string;
  Intubasi_Sesudah_Tidur: string;
  Intubasi_Blind: string;
  Intubasi_Oral: string;
  Intubasi_Nasal: string;
  Intubasi_Kanan: string;
  Intubasi_Kiri: string;
  Intubasi_Trakheostomi: string;
  Intubasi_Sulit_Ventilasi: string;
  Intubasi_Sulit_Ventilasi_Teks: string;
  Intubasi_Sulit_Intubasi: string;
  Intubasi_Sulit_Intubasi_Teks: string;
  Intubasi_Dengan_Stilet: string;
  Intubasi_Dengan_Stilet_Teks: string;
  Intubasi_Cuff: string;
  Intubasi_Level_ETT: string;
  Intubasi_Pack: string;
  Ventilasi_Spontan: string;
  Ventilasi_Kendali: string;
  Ventilasi_Ventilator: string;
  Ventilasi_Ventilator_TV: string;
  Ventilasi_Ventilator_RR: string;
  Ventilasi_Ventilator_PEEP: string;
  Ventilasi_Lainnya: string;
  Ventilasi_Lainnya_Teks: string;
  CKP_Jam_Masuk: string;
  CKP_Tekanan_Darah: string;
  CKP_Denyut_Nadi: string;
  CKP_RR: string;
  CKP_Suhu: string;
  CKP_Kesadaran: string;
  CKP_Pernafasan: string;
  CKP_Penyulit_Intra_Operatif: string;
  CKP_Instruksi_Khusus: string;
  Json_Image_Chart: string;
  Url_Image_Chart: string;
  Name_Image_Chart: string;
  Size_Image_Chart: string;
  Type_Image_Chart: string;
  VAS: string;
  VAS_Pulih: string;
  Jam_Keluar_Pulih: string;
  Aldrette_Aktivitas: string;
  Aldrette_Sirkulasi: string;
  Aldrette_Pernafasan: string;
  Aldrette_Kesadaran: string;
  Aldrette_Warna_Kulit: string;
  Aldrette_Total: string;
  Aldrette_Skor_VAS: string;
  Steward_Pernafasan: string;
  Steward_Kesadaran: string;
  Steward_Motorik: string;
  Steward_Total: string;
  Steward_Skor_VAS: string;
  Pindah_Ke: string;
  Pindah_Ke_Lainnya: string;
  Catatan_Khusus_Ruang_Pemulihan: string;
  Image_1: string;
  Image_2: string;
  Image_3: string;
  IPA_Pengelolaan_Nyeri: string;
  IPA_Penanganan_Mual: string;
  IPA_Antibiotik: string;
  IPA_Obat: string;
  IPA_Infus: string;
  IPA_Diet: string;
  IPA_Tensi_Setiap: string;
  IPA_Tensi_Selama: string;
  IPA_Lainnya: string;
  TTD_Penata_Anestesi: string;
  ID_Penata_Anestesi: string;
  Nama_Penata_Anestesi: string;
  TTD_Dokter_Anestesi: string;
  ID_Dokter_Anestesi: string;
  Nama_Dokter_Anestesi: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;
}

interface IPersiapanPeralatan {
  Unit: string;
  Tanggal_Tindakan: string;
  Jenis_Operasi: string;
  Teknik_Anestesi: string;
  Listrik_1: string;
  Listrik_2: string;
  Listrik_3: string;
  Gas_1: string;
  Gas_2: string;
  Gas_3: string;
  Gas_4: string;
  Gas_5: string;
  Gas_6: string;
  Mesin_Anestesi_1: string;
  Mesin_Anestesi_2: string;
  Mesin_Anestesi_3: string;
  Mesin_Anestesi_4: string;
  Mesin_Anestesi_5: string;
  Manajemen_Nafas_1: string;
  Manajemen_Nafas_2: string;
  Manajemen_Nafas_3: string;
  Manajemen_Nafas_4: string;
  Manajemen_Nafas_5: string;
  Manajemen_Nafas_6: string;
  Manajemen_Nafas_7: string;
  Manajemen_Nafas_8: string;
  Manajemen_Nafas_9: string;
  Pemantauan_1: string;
  Pemantauan_2: string;
  Pemantauan_3: string;
  Pemantauan_4: string;
  Pemantauan_5: string;
  Pemantauan_6: string;
  Lainnya_1: string;
  Lainnya_2: string;
  Lainnya_3: string;
  Lainnya_4: string;
  Lainnya_5: string;
  Lainnya_6: string;
  Lainnya_7: string;
  Obat_1: string;
  Obat_2: string;
  Obat_3: string;
  Obat_4: string;
  Obat_5: string;
  Obat_6: string;
  Obat_7: string;
  Obat_7_Teks: string;
  TTD_Penata_Anestesi: string;
  ID_Penata_Anestesi: string;
  Nama_Penata_Anestesi: string;
  TTD_Dokter_Anestesi: string;
  ID_Dokter_Anestesi: string;
  Nama_Dokter_Anestesi: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;
}

interface IOperatieKamer {
	Laporan_Pembedahan_Anestesi?: any;
	Checklist_Keselamatan?: any
	Catatan_Keperawatan_Intra_Operasi?: any;
  Catatan_Keperawatan_Pra_Operasi?: IOKCatatanKeperawatanPraOp;
  Intra_Operatif?: any;
  Catatan_Keperawatan_Pasca_Operasi?: any;
  Pasca_Operatif?: any;
  Instruksi_Pasca_Bedah_Rajal?: IInstruksiPascaBedahRajal;
  Surveilans_Infeksi_Hais?: ISurveilansInfeksiHaisRanap;
  Asesmen_Pra_Operasi?: IAsesmenPraOperasi;
  Status_Anestesi?: IStatusAnestesi;
  Persiapan_Peralatan?: IPersiapanPeralatan;
}

interface IEdukasiHarian {
	Alamat: string
	ID: string
	ID_Pemberi_Edukasi: string
	ID_Petugas: string
	Nama: string
	Nama_Pemberi_Edukasi: string
	Nama_Petugas: string
	Pendengar: string
	Tanda_Tangan: string;
	TTD_Pemberi_Edukasi: string
	Telepon: string
	Unit: string
	Updated_At: string
	Updated_By: string
	Uraian: string
	Waktu: string
}

interface ITransferPasien {
  ID: string;
  ID_Pelayanan: string;
  ID_Dokter_Dpjp: string;
  Nama_Dokter_Dpjp: string;
  ID_Dokter_Operator: string;
  Nama_Dokter_Operator: string;
  Tanggal_Transfer: string;
  Indikasi_Transfer: string;
  Pengantar: string;
  Penerima: string;
  Tanggal_Masuk_Rs: string;
  Diagnosa: string;
  Kesadaran: string;
  Vital_TD: string;
  Vital_N: string;
  Vital_P: string;
  Vital_T: string;
  Vital_Sat_O2: string;
  Visus_OD: string;
  Visus_OS: string;
  Tonometer_OD: string;
  Tonometer_OS: string;
  Skala_Nyeri: string;
  Puasa: string;
  Waktu_Puasa: string;
  Keluhan: string;
  Alderette: string;
  Alderette_Aktivitas: string;
  Alderette_Sirkulasi: string;
  Alderette_Pernafasan: string;
  Alderette_Kesadaran: string;
  Alderette_Warna_Kulit: string;
  Alderette_Score : string;
  Steward: string;
  Steward_Kesadaran: string;
  Steward_Pernafasan: string;
  Steward_Motorik: string;
  Steward_Score : string;
  Pemeriksaan_Alat: string;
  Pemeriksaan_Alat_Ekg: string;
  Pemeriksaan_Alat_Laboratorium: string;
  Pemeriksaan_Alat_Usg: string;
  Pemeriksaan_Alat_Biometri: string;
  Pemeriksaan_Alat_Oct_Macula: string;
  Pemeriksaan_Alat_Thorax_Foto: string;
  Pemeriksaan_Alat_Ct_Scan: string;
  Pemeriksaan_Alat_Foto_Fundus: string;
  Pemeriksaan_Alat_Oct_Papil: string;
  Pemeriksaan_Alat_Lain_Lain: string;
  Pemeriksaan_Alat_Laboratorium_Text: string;
  Pemeriksaan_Alat_Lain_Text: string;
  Terapi: string;
  Diet: string;
  Rencana: string;
  Tanda_Tangan_Perawat_Pengantar: string;
  Id_Tanda_Tangan_Perawat_Pengantar: string;
  Nama_Perawat_Pengantar: string;
  Tanda_Tangan_Perawat_Penerima: string;
  Id_Tanda_Tangan_Perawat_Penerima: string;
  Nama_Perawat_Penerima: string;
  Unit: string;
  Waktu: string;
  PDF: string;
  ID_Petugas: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;
}

interface IMetodePembelajaran {
  Diskusi: number;
  Demonstrasi: number;
  Ceramah: number;
  Solusi: number;
  Observatori: number;
  Lain: number;
  Lain_Teks: string;
}

interface IEvaluasiPasien {
  Mampu_Mengerti: number;
  Mampu_Memahami: number;
  Lain: number;
  Lain_Teks: string;
}

interface IPenerimaEdukasi {
  Pasien: number;
  Pasangan: number;
  Orang_Tua: number;
  Saudara_Kandung: number;
  Lain: number;
  Lain_Teks: string;
}

interface IEdukasiTerintegrasi {
  TTD_Penerima_Edukasi_DPJP: string;
  TTD_Penerima_Edukasi_Gizi: string;
  TTD_Penerima_Edukasi_Manajemen_Nyeri: string;
  TTD_Penerima_Edukasi_Post_Operasi: string;
  TTD_Penerima_Edukasi_Keperawatan: string;
  TTD_Penerima_Edukasi_Farmasi: string;
  TTD_Penerima_Edukasi_Dokter: string;
  TTD_Penerima_Edukasi_Rohaniawan: string;
  TTD_Penerima_Edukasi_Mencuci_Tangan: string;
  TTD_Penerima_Edukasi_Penggunaan_Peralatan: string;
  TTD_Penerima_Edukasi_Hak_Kewajiban: string;
  TTD_Penerima_Edukasi_Informasi_Lain: string;

  TTD_Edukator_DPJP: string;
  ID_Edukator_DPJP: string;
  Nama_Edukator_DPJP: string;

  TTD_Edukator_Gizi: string;
  ID_Edukator_Gizi: string;
  Nama_Edukator_Gizi: string;

  TTD_Edukator_Manajemen_Nyeri: string;
  ID_Edukator_Manajemen_Nyeri: string;
  Nama_Edukator_Manajemen_Nyeri: string;

  TTD_Edukator_Post_Operasi: string;
  ID_Edukator_Post_Operasi: string;
  Nama_Edukator_Post_Operasi: string;

  TTD_Edukator_Keperawatan: string;
  ID_Edukator_Keperawatan: string;
  Nama_Edukator_Keperawatan: string;

  TTD_Edukator_Farmasi: string;
  ID_Edukator_Farmasi: string;
  Nama_Edukator_Farmasi: string;

  TTD_Edukator_Dokter: string;
  ID_Edukator_Dokter: string;
  Nama_Edukator_Dokter: string;

  TTD_Edukator_Rohaniawan: string;
  ID_Edukator_Rohaniawan: string;
  Nama_Edukator_Rohaniawan: string;

  TTD_Edukator_Mencuci_Tangan: string;
  ID_Edukator_Mencuci_Tangan: string;
  Nama_Edukator_Mencuci_Tangan: string;

  TTD_Edukator_Penggunaan_Peralatan: string;
  ID_Edukator_Penggunaan_Peralatan: string;
  Nama_Edukator_Penggunaan_Peralatan: string;

  TTD_Edukator_Hak_Kewajiban: string;
  ID_Edukator_Hak_Kewajiban: string;
  Nama_Edukator_Hak_Kewajiban: string;

  TTD_Edukator_Informasi_Lain: string;
  ID_Edukator_Informasi_Lain: string;
  Nama_Edukator_Informasi_Lain: string;
  Asesmen: {
    Tidak_Ada: number;
    Penglihatan_Terganggu: number;
    Pendengaran_Kurang: number;
    Tidak_Berbahasa_Indonesia: number;
    Keyakinan: number;
    Agama: number;
    Kongnisi_Terbatas: number;
    Hambatan_Emosi: number;
    Pertimbangan_Budaya: number;
    Tingkat_Pendidikan: number;
    Nilai_Nilai: number;
  },
  Materi_Edukasi_Id: string;
  Informasi_Lain_Pasien: Array<string>;
  Materi_Edukasi_Penjelasan: {
    DPJP: {
      Kondisi_Pasien: number;
      Hasil_Pemeriksaan: number;
      Pengobatan: number;
      Manfaat: number;
      Alternatif: number;
      Keberhasilan: number;
      Pemulihan: number;
      Diagnosa: number;
      Hasil_Asuhan: number;
      Hasil_Asuhan_Teks: string;
      Hasil_Asuhan_Teks_2: string;
      Diagnosa_Teks: string;
      Diagnosa_Teks_1: string;
      Diagnosa_Teks_2: string;
    },
    Gizi: {
      Diluar_RS: number;
      Lain_Lain: number;
      Status_Gizi: number;
      Untuk_Dirumah: number;
      Lain_Lain_Teks: string;
      Selama_Perawatan: number;
    },
    Manajemen_Nyeri: {
      Farmakologi: number;
      Non_Farmakologi: number;
    },
    Post_Operasi: {
      Merunduk: number;
      Setengah_Duduk: number;
      Tidak_Ada: number;
    },
    Keperawatan: {
      Mobilisasi: number;
      Perawatan_Luka: number;
      Perawatan_Peralatan_Medis: number;
      Pemberian_Makan: number;
      Membuang_Urine: number;
      Lain_Lain: number;
      Lain_Lain_Teks: string;
    },
    Farmasi: {
      Lain_Lain: number;
      Efek_Samping: number;
      Lain_Lain_Teks: string;
      Penggunaan_Obat: number;
      Mencegah_Interaksi: number;
    },
    Dokter: {
      Kondisi_Pasien: number;
      Hasil_Pemeriksaan: number;
      Teknik_Anestesi: number;
      Manfaat: number;
      Nyeri_Pasca: number;
      Analgesi_Pasca: number;
    },
    Rohaniawan: {
      Bimbingan: number;
      Konseling: number;
    },
    Mencuci_Tangan: {
      Handwash_4060: number;
      Handrub_2030: number;
    },
    Penggunaan_Peralatan: {
      Infus: number;
      Oksigen: number;
      Nebulizer: number;
      Lain_Lain: number;
      Lain_Lain_Teks: string;
    },
    Hak_Kewajiban: {
      Hak_Pasien: number;
      Kewajiban_Pasien: number;
    },
  },
  DPJP: {
    ID_DPJP: string;
    Metode_Pembelajaran: IMetodePembelajaran;
    Evaluasi_Pasien: IEvaluasiPasien;
    Waktu_Edukasi: string;
    Durasi: string;
    Penerima_Edukasi: IPenerimaEdukasi;
  },
  Gizi: {
    Durasi: string;
    Waktu_Edukasi: string;
    Evaluasi_Pasien: IEvaluasiPasien;
    Penerima_Edukasi: IPenerimaEdukasi;
    Metode_Pembelajaran: IMetodePembelajaran;
  },
  Manajemen_Nyeri: {
    Metode_Pembelajaran: IMetodePembelajaran;
    Evaluasi_Pasien: IEvaluasiPasien;
    Waktu_Edukasi: string;
    Durasi: string;
    Penerima_Edukasi: IPenerimaEdukasi;
  },
  Post_Operasi: {
    Durasi: string;
    Waktu_Edukasi: string;
    Evaluasi_Pasien: IEvaluasiPasien;
    Penerima_Edukasi: IPenerimaEdukasi;
    Metode_Pembelajaran: IMetodePembelajaran;
  },
  Keperawatan: {
    Metode_Pembelajaran: IMetodePembelajaran;
    Evaluasi_Pasien: IEvaluasiPasien;
    Waktu_Edukasi: string;
    Durasi: string;
    Penerima_Edukasi: IPenerimaEdukasi;
  },
  Farmasi: {
    Durasi: string;
    Waktu_Edukasi: string;
    Evaluasi_Pasien: IEvaluasiPasien;
    Penerima_Edukasi: IPenerimaEdukasi;
    Metode_Pembelajaran: IMetodePembelajaran;
  },
  Dokter: {
    Durasi: string;
    Waktu_Edukasi: string;
    Evaluasi_Pasien: IEvaluasiPasien;
    Penerima_Edukasi: IPenerimaEdukasi;
    Metode_Pembelajaran: IMetodePembelajaran;
  },
  Rohaniawan: {
    Metode_Pembelajaran: IMetodePembelajaran;
    Evaluasi_Pasien: IEvaluasiPasien;
    Waktu_Edukasi: string;
    Durasi: string;
    Penerima_Edukasi: IPenerimaEdukasi;
  },
  Mencuci_Tangan: {
    Durasi: string;
    Waktu_Edukasi: string;
    Evaluasi_Pasien: IEvaluasiPasien;
    Penerima_Edukasi: IPenerimaEdukasi;
    Metode_Pembelajaran: IMetodePembelajaran;
  },
  Penggunaan_Peralatan: {
    Durasi: string;
    Waktu_Edukasi: string;
    Evaluasi_Pasien: IEvaluasiPasien;
    Penerima_Edukasi: IPenerimaEdukasi;
    Metode_Pembelajaran: IMetodePembelajaran;
  },
  Hak_Kewajiban: {
    Durasi: string;
    Waktu_Edukasi: string;
    Evaluasi_Pasien: IEvaluasiPasien;
    Penerima_Edukasi: IPenerimaEdukasi;
    Metode_Pembelajaran: IMetodePembelajaran;
  },
  Informasi_Lain: {
    Metode_Pembelajaran: IMetodePembelajaran;
    Evaluasi_Pasien: IEvaluasiPasien;
    Waktu_Edukasi: string;
    Durasi: string;
    Penerima_Edukasi: IPenerimaEdukasi;
  }
  ID_Petugas: string;
  Nama_Petugas: string;
  Updated_At: string;
  Updated_By: string;
}


interface ICommon {
	CPPT?: any
	Edukasi_Harian?: IEdukasiHarian
  Transfer_Pasien?: Array<ITransferPasien>
  Edukasi_Integrasi?: IEdukasiTerintegrasi;
}

interface IGizi {
  Pengkajian_Awal?: IPengkajianAwalGiziRanap;
}

interface IMedicalRecord {
  Optik?: IOptic
	Kode_Cabang: string
	Jenis_Pelayanan: string
	Tipe_Pasien: string
	ID_Pelayanan: string
	No_MR: string
	No_SEP?: string
	Pasien?: IPatient
	Wali?:IPatientGuardian
	Informasi?:IInformation
	Common?: ICommon
	UGD?: IEmergencyRoom
	OK?: IOperatieKamer
	RO?: IRefraksiOptisi
	Rawat_Jalan?: IRawatJalan
	Rawat_Inap?: IRawatInap
  Gizi?: IGizi
	Farmasi?: IPharmacy
	Tanggal_Masuk?: number // Tgl_Berobat
	Jam_Masuk?: string // Jam_Kunjungan
	Tanggal_Keluar?: number
	Jam_Keluar?: string
	Created_By: string
	Created_Date: string // Created_At
	Fields?: Array<IField>
	PDFs?: Array<IPDF>
}

interface IRequestMR {
  MR_List: Array<string>;
  Purpose: string;
  Created_At: string;
  Created_By: string;
  Request_ID: string;
  Requested_By?: string;
  Updated_At: string;
  Updated_By: string;
  Approved_At?: number;
  Approved_By?: string;
  Branch_Code: string;
  Created_By_Name: string;
  Requested_By_Name?: string;
  Updated_By_Name: string;
  Approved_By_Name?: string;
  Approval_Status: string;
  Expired_At?: number;
  Requested_At?: number;
}
