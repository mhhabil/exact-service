export interface IRefraksiOptisiKMB {
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

export interface IRefraksiOptisiKML {
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

export interface IRefraksiOptisiRPL {
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
	Va_Aquity: string;
	PH: string;
}

export interface IRefraksiOptisiKoreksi1 {
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

export interface IRefraksiOptisiKoreksi2 {
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

export interface IRefraksiOptisiRPLStreak {
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
	Va_Aquity: string;
	PH: string;
}

export interface IRefraksiOptisi {
	Pengkajian_Awal?: IRefraksiOptisiPengkajianAwal
}

export interface IRefraksiOptisiData {
	PH: string
	VA: string
	Add: string
	False: string
	Jagger: string
	Schiotz: string
	Non_Contact: string
	Tanam_Lensa: string
	Keterangan_Tono: string;
	KMB?: IRefraksiOptisiKMB
	KML?: IRefraksiOptisiKML
	RPL?: IRefraksiOptisiRPL
	RPL_2?: IRefraksiOptisiRPL
	Koreksi_1?: IRefraksiOptisiKoreksi1
	Koreksi_2?: IRefraksiOptisiKoreksi2
	RPL_Streak?: IRefraksiOptisiRPLStreak
	RPL_Streak_2?: IRefraksiOptisiRPLStreak
}


export interface IRefraksiOptisiPengkajianAwal {
	OD?: IRefraksiOptisiData
	OS?: IRefraksiOptisiData
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
