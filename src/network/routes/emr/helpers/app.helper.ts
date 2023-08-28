import moment from "moment";
import { IFormLaporanPembedahan } from "../interfaces/ok/ok.model";

export const isValidFile = (image: string) => {
  return (!!image.toString().includes('dev-files') || !!image.toString().includes('files'));
}

export const getCpptDoctorData = async (emrId: any, unit: string) => {
  try {
    const emrKeys: Array<string> = [];
    const checkObject = await global.medicalRecord.keys(emrId, '.Common')
    if (checkObject && checkObject !== null && checkObject.includes('CPPT')) {
      emrKeys.push('Common.CPPT');
    }
    const result = await global.medicalRecord.get(emrId, emrKeys);

    if (result && Array.isArray(result) && result.length > 0) {
      const undeleted = result.filter((val: any) => !val.Deleted || (val.Deleted && val.Deleted !== 1))
      const selectedUnit = undeleted.filter((val: any) => val.Unit === unit);
      const doctorCppt = selectedUnit.filter((val: any) => val.Is_Form_Dokter === 1);
      if (doctorCppt && doctorCppt.length > 0) {
        doctorCppt.sort((a: any, b: any) => {
          return moment(b.Waktu).unix() - moment(a.Waktu).unix();
        });
        return doctorCppt[0];
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  } catch (err) {
    return undefined;
  }
}

export const getInpatientCpptNurse = async (emrId: any) => {
  try {
    const emrKeys: Array<string> = [];
    const checkObject = await global.medicalRecord.keys(emrId, '.Common')
    if (checkObject && checkObject !== null && checkObject.includes('CPPT')) {
      emrKeys.push('Common.CPPT');
    }
    const result = await global.medicalRecord.get(emrId, emrKeys);
    if (result && Array.isArray(result) && result.length > 0) {
      const undeleted = result.filter((val: any) => !val.Deleted || (val.Deleted && val.Deleted !== 1))
      const selectedUnit = undeleted.filter((val: any) => val.Unit === 'RawatInap');
      const nurseCppt = selectedUnit.filter((val: any) => val.Is_Form_Dokter === 0);
      if (nurseCppt && nurseCppt.length > 0) {
        nurseCppt.sort((a: any, b: any) => {
          return moment(a.Waktu).unix() - moment(b.Waktu).unix();
        });
        return nurseCppt[0];
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  } catch (err) {
    return undefined
  }
}

export const getInpatientCpptDoctor = async (emrId: any) => {
  try {
    const emrKeys: Array<string> = [];
    const checkObject = await global.medicalRecord.keys(emrId, '.Common')
    if (checkObject && checkObject !== null && checkObject.includes('CPPT')) {
      emrKeys.push('Common.CPPT');
    }
    const result = await global.medicalRecord.get(emrId, emrKeys);
    if (result && Array.isArray(result) && result.length > 0) {
      const undeleted = result.filter((val: any) => !val.Deleted || (val.Deleted && val.Deleted !== 1))
      const selectedUnit = undeleted.filter((val: any) => val.Unit === 'RawatInap');
      const nurseCppt = selectedUnit.filter((val: any) => val.Is_Form_Dokter === 1);
      if (nurseCppt && nurseCppt.length > 0) {
        nurseCppt.sort((a: any, b: any) => {
          return moment(a.Waktu).unix() - moment(b.Waktu).unix();
        });
        return nurseCppt[0];
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  } catch (err) {
    return undefined
  }
}

export const getFirstEws = async (emrId: any) => {
  try {
    const emrKeys: Array<string> = [];
    const checkObject = await global.medicalRecord.keys(emrId, '.Rawat_Inap')
    if (checkObject && checkObject !== null && checkObject.includes('Pengkajian_Early_Warning_Scoring_System')) {
      emrKeys.push('Rawat_Inap.Pengkajian_Early_Warning_Scoring_System');
    }
    const result = await global.medicalRecord.get(emrId, emrKeys);
    if (result && Array.isArray(result) && result.length > 0 && result[0] && result[0].Tipe_Ews === '1') {
      return result[0];
    } else {
      return undefined;
    }
  } catch (err) {
    return undefined;
  }
}

export const getLastCpptDoctorData = async (companyCode: any, mr: any) => {
  try {
    const searchQuery = `\'@Kode_Cabang:${companyCode} @No_MR:${mr}\'`;
    const result = await global.medicalRecord.find(searchQuery, {
      LIMIT: { from: 0, size: 10000 },
      RETURN: ["$.Kode_Cabang", "$.No_MR", "$.Common.CPPT"],
    });
    let records: any = [];
    // Merge CPPT from multiple visits
    for (let i = 0; i < result.documents.length; i++) {
      if (result.documents[i].value["$.Common.CPPT"] !== undefined) {
        const objCPPT = JSON.parse(result.documents[i].value["$.Common.CPPT"]);
        for (let j = 0; j < objCPPT.length; j++) {
          objCPPT[j]["EMR_ID"] = result.documents[i].id;
        }
        records = records.concat(objCPPT);
      }
    }

    if (records && Array.isArray(records) && records.length > 0) {
      const undeleted = records.filter((val: any) => !val.Deleted || (val.Deleted && val.Deleted !== 1))
      const doctorCppt = undeleted.filter((val: any) => val.Is_Form_Dokter === 1);
      if (doctorCppt && doctorCppt.length > 0) {
        doctorCppt.sort((a: any, b: any) => {
          return moment(b.Waktu).unix() - moment(a.Waktu).unix();
        });
        return doctorCppt[0];
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  } catch (err) {
    return undefined;
  }
}

export const getCpptNurseData = async (emrId: any, unit: string) => {
  try {
    const emrKeys: Array<string> = [];
    const checkObject = await global.medicalRecord.keys(emrId, '.Common')
    if (checkObject && checkObject !== null && checkObject.includes('CPPT')) {
      emrKeys.push('Common.CPPT');
    }
    const result = await global.medicalRecord.get(emrId, emrKeys);

    if (result && Array.isArray(result) && result.length > 0) {
      const undeleted = result.filter((val: any) => !val.Deleted || (val.Deleted && val.Deleted !== 1))
      const selectedUnit = undeleted.filter((val: any) => val.Unit === unit);
      const nurseCppt = selectedUnit.filter((val: any) => !val.Is_Form_Dokter);
      if (nurseCppt && nurseCppt.length > 0) {
        nurseCppt.sort((a: any, b: any) => {
          return moment(a.Waktu).unix() - moment(b.Waktu).unix();
        });
        return nurseCppt[0];
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  } catch (err) {
    return undefined;
  }
}

export const getFirstEarlyWarningScoreType = async (emrId: any) => {
  try {
    const emrKeys: Array<string> = [];
    const checkObject = await global.medicalRecord.keys(emrId, '.Rawat_Inap')
    if (checkObject && checkObject !== null && checkObject.includes('Pengkajian_Early_Warning_Scoring_System')) {
      emrKeys.push('Rawat_Inap.Pengkajian_Early_Warning_Scoring_System');
    }
    const result: Array<IEarlyWarningScoring> = await global.medicalRecord.get(emrId, emrKeys);

    if (result && Array.isArray(result) && result.length > 0) {
      result.sort((a: any, b: any) => {
        return moment(a.Waktu_Pengkajian).unix() - moment(b.Waktu_Pengkajian).unix();
      });
      return result[0].Tipe_Ews;
    } else {
      return undefined;
    }
  } catch (err) {
    return undefined;
  }
}

export const getLocalInjectionType = (form: IFormLaporanPembedahan) => {
  if (form.Lokal_Injeksi_Intravitreal_Tipe_1 && form.Lokal_Injeksi_Intravitreal_Tipe_1 === '1') {
    return 'Avastin';
  }
  if (form.Lokal_Injeksi_Intravitreal_Tipe_2 && form.Lokal_Injeksi_Intravitreal_Tipe_2 === '1') {
    return 'Patizra';
  }
  if (form.Lokal_Injeksi_Intravitreal_Tipe_3 && form.Lokal_Injeksi_Intravitreal_Tipe_3 === '1') {
    return 'Ceftacidime';
  }
  if (form.Lokal_Injeksi_Intravitreal_Tipe_4 && form.Lokal_Injeksi_Intravitreal_Tipe_4 === '1') {
    return 'Vancomycin';
  }
  if (form.Lokal_Injeksi_Intravitreal_Tipe_5 && form.Lokal_Injeksi_Intravitreal_Tipe_5 === '1') {
    return 'Pagenax';
  }
  if (form.Lokal_Injeksi_Intravitreal_Tipe_6 && form.Lokal_Injeksi_Intravitreal_Tipe_6 === '1') {
    return 'Anti VEGF';
  }
  if (form.Lokal_Injeksi_Intravitreal_Tipe_7 && form.Lokal_Injeksi_Intravitreal_Tipe_7 === '1') {
    return 'Eylea';
  }
  return undefined;
}

export const getHandling = (id: string) => {
  const handlings = [
    {
      id: '1.',
      name: 'Operasi',
    },
    {
      id: '2.',
      name: 'Periksa',
    },
    {
      id: '3.',
      name: 'Fisiotherapy',
    },
    {
      id: '4.',
      name: 'Biometri',
    },
    {
      id: '5.',
      name: 'Ganti Obat',
    },
    {
      id: '6.',
      name: 'Post Op 1 Minggu',
    },
    {
      id: '7.',
      name: 'Post Op 2 Minggu',
    },
    {
      id: '8.',
      name: 'Post Op 1 Bulan',
    },
    {
      id: '9.',
      name: 'Post Op 2 Bulan',
    },
    {
      id: '10.',
      name: 'Post Op 6 Bulan',
    },
    {
      id: '11.',
      name: 'Post Op 11 Bulan',
    },
    {
      id: '12.',
      name: 'Cek Lengkap',
    },
  ]

  const selectedHandling = handlings.find((val: any) => val.id === id);
  if (selectedHandling) {
    return selectedHandling.name;
  } else {
    return '';
  }
};

export const getRoom = async (roomId: string, companyCode: string) => {
  const roomList = await global.medicalRecord.get(`Rooms:{${companyCode}}`, "$");
  if (roomList && roomList !== null) {
    const selectedRoom = roomList.find((item: any) => item.ID_Kamar === roomId);
    if (selectedRoom) {
      return selectedRoom;
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

export const getModalityCode = (name: string) => {
  const mappings = [
    {
      name: 'Pemeriksaan_Biometri',
      code: 'BI',
    },
    {
      name: 'Pemeriksaan_Oct_Retina',
      code: 'OCT',
    },
    {
      name: 'Pemeriksaan_Oct_Glaukoma',
      code: 'OCT',
    },
    {
      name: 'Pemeriksaan_Lapangan_Pandang',
      code: 'OPV',
    },
    {
      name: 'Pemeriksaan_Foto_Fundus',
      code: 'FS',
    },
    {
      name: 'Pemeriksaan_Usg',
      code: 'US',
    },
    {
      name: 'Tindakan_Yag_Laser',
      code: 'OT',
    },
    {
      name: 'Tindakan_Laser_Retina',
      code: undefined,
    },
    {
      name: 'Pemeriksaan_Oct_Cornea',
      code: 'OCT',
    },
    {
      name: 'Laporan_Hasil_Schirmer_Test',
      code: undefined,
    },
  ]

  const selectedModality = mappings.find((item) => item.name === name);
  if (selectedModality) {
    return selectedModality.code;
  } else {
    return undefined
  }
}

export const getEmployeeName = async(req: any, employeeId: string) => {
  const employee = await global.medicalRecord.get(`Employee:{${req.kode_cabang}}:${req.tipe_pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${employeeId}')]`);
  if (employee && Array.isArray(employee) && employee.length > 0 && employee[0]) {
    return employee[0].Nama;
  } else {
    return undefined;
  }
}

export const getOriginalDicom = async(objDicom: IDicomMetadata, emrDataId: any) => {
  const dicomMetadata: IDicomMetadata = {
    StudyInstanceUID: objDicom.StudyInstanceUID,
    SeriesInstanceUID: objDicom.SeriesInstanceUID,
    SOPInstanceUID: objDicom.SOPInstanceUID,
  }
  const fileBytes = await global.dicom.imageRendered(emrDataId.Kode_Cabang, dicomMetadata);
  const destination = `images/${emrDataId.Kode_Cabang}/${emrDataId.Jenis_Pelayanan}/${moment.unix(emrDataId.Tanggal_Masuk).format("YYYY")}/${moment.unix(emrDataId.Tanggal_Masuk).format("MM")}/${emrDataId.Tipe_Pasien}/${emrDataId.No_MR}/${emrDataId.ID_Pelayanan}/${objDicom.SOPInstanceUID}_original.jpg`;
  if (!(await global.storage.existsGCSUrl(destination))) {
    const resultOriginal = await global.storage.uploadFromMemory(destination, fileBytes);
    const url = encodeURI(`https://${resultOriginal.bucket}/${resultOriginal.name}?generation=${resultOriginal.generation}`);
    return url ?? undefined;
  } else {
    const resultOriginal = await global.storage.getMetadata(destination);
    const url = encodeURI(`https://${resultOriginal.bucket}/${resultOriginal.name}?generation=${resultOriginal.generation}`);
    return url ?? undefined;
  }
}
