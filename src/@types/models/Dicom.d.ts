interface IValueUI {}

interface IValueLO {}

interface IValuePN {}

interface IValueDA {}

interface IValueCS {}

interface IValueTM {}

interface IValueSH {}

interface IDicomInstance {
  metadata: IDicomInstanceMetadata;
  url: string;
}

interface IDicomInstanceMetadata {
  StudyInstanceUID: string; // 0020000D "vr": "UI"
  SeriesInstanceUID: string; // 0020000E "vr": "UI"
  SOPInstanceUID: string; // 00080018 "vr": "UI"
  Columns: number; // 00280011
  Rows: number; // 00280010
  InstanceNumber: number; // default 1
  SOPClassUID: string; // 00080016
  PhotometricInterpretation?: string; // 00280004 "vr": "CS"
  SamplesPerPixel?: number; // 00280002
  PlanarConfiguration: number; // 00280006
  NumberOfFrames: number; // 00280008
  BitsAllocated: number; // 00280100
  BitsStored: number; // 00280101
  HighBit: number; // 00280102
  PixelRepresentation: number; // 00280103
  Modality: string; // 00080060 "vr": "CS"
  WindowCenter?: number;
  WindowWidth?: number;
  SeriesDate: string;
  ImageType?: array<string>;
}

interface IDicomMetadata {
  StudyInstanceUID?: string; // 0020000D "vr": "UI"
  SeriesInstanceUID?: string; // 0020000E "vr": "UI"
  SOPInstanceUID?: string; // 00080018 "vr": "UI"
  SOPClassUID?: string; // 00080016 "vr": "UI"
  PatientID?: string; // 00100020 "vr": "LO"
  PatientName?: string; // 00100010 "vr": "PN"
  PatientBirthDate?: string; // 00100030  "vr": "DA"
  PatientSex?: string; // 00100040 "vr": "CS"
  AccessionNumber?: string; // 00080050 "vr": "SH"
  IssuerOfPatientID?: string; // 00100021 "vr": "LO" -- Kode_Cabang
  InstitutionName?: string; // 00080080 "vr": "LO" -- Nama Cabang
  StudyDate?: string; // 00080020 "vr": "DA" 19941013-- Tanggal
  StudyTime?: string; // 00080030 "vr": "TM" 141917 -- Waktu
  StudyInstanceUID?: string; // 0020000D "vr": "UI" -- ID_RawatInap | No_Berobat
  StudyID?: string; // 00200010 "vr": "SH" -- No_Berobat
  SeriesDate?: string; // 00080021 "vr": "DA"
  SeriesTime?: string; // 00080031 "vr": "TM"
  SeriesDescription?: string; // 0008103E "vr": "LO"
  ModalityID?: string;
  ModalityName?: string;
  Modality?: string; // 00080060 "vr": "CS"
  OperatorsName?: string; // 00081070 "vr": "PN" -- Nama Perawat Alat
  ReferringPhysicianName?: string; // 00080090 "vr": "PN" -- Nama Dokter
  SeriesNumber?: number; //
  SliceThickness?: number; //
  NumInstances?: number;
  Modalities?: string;
  series?: array<IDicomMetadata>;
  instances?: array<IDicomMetadata>;
  metadata?: ID;
  Thumbnail?: string;
  Original?: string;
  Created_At?: string;
  Created_By?: string;
  Created_By_Name?: string;
}
