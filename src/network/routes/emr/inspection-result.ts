import moment from "moment";
import { Router, Request, Response, NextFunction } from "express";
import RBAC from "../../../services/rbac";
const jp = require("jsonpath");
import * as jsonpatch from "fast-json-patch";
import { v4 as uuid } from "uuid";
const debugEMR = require("debug")("emr");
import { ElasticLoggerService, SimrsService } from "./services";
import { getModalityCode, isValidFile } from "./helpers/app.helper";
import { HasilSchirmerTest, PemeriksaanFotoFundusModel, PemeriksaanLapangPandangModel, PemeriksaanOCTCornea, PemeriksaanOCTGlaukomaModel, PemeriksaanOCTRetinaModel, PemeriksaanUSGModel, TindakanLaserRetina, TindakanYAGLaser } from "./interfaces/inspection-result/inspection-result.model";
const IR = Router();

IR.route('/hasil-pemeriksaan/process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const localDebug = debugEMR.extend(req.path);
    localDebug(`Request Begin`);
    let responseMessage: string = '';
    try {
      const emrKeys = ["Kode_Cabang", "No_MR", "Pasien", "Tipe_Pasien", 'ID_Pelayanan'];
      const id = req.body["ID"];
      const fields = await global.medicalRecord.getFields(req.emrID, req.body.fields || []);
      const emrData = await global.medicalRecord.get(req.emrID, emrKeys);
      localDebug(`Get Data ${req.emrID}`);
      if (emrData && emrData !== null) {
        const dataToPost: any = req.body;
        const inspectDoctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${dataToPost['dokter_pemeriksa']}')]`)

        const inspectNurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${dataToPost['perawat_pemeriksa']}')]`)

        const inspectDoctorA = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${dataToPost['id-dokter-pemeriksa']}')]`)

        const nurseName = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${dataToPost['id-perawat']}')]`)
        let fixedData: any = {};
        if (dataToPost.unit && dataToPost.unit === 'Pemeriksaan_Biometri') {
          fixedData = {
            Nama: dataToPost.unit ? dataToPost.unit : 'Pemeriksaan_Biometri',
            Od_K1: dataToPost['od_k1'] ? dataToPost['od_k1'] : '',
            Od_K2: dataToPost['od_k2'] ? dataToPost['od_k2'] : '',
            Od_Acd: dataToPost['od_acd'] ? dataToPost['od_acd'] : '',
            Os_K1: dataToPost['os_k1'] ? dataToPost['os_k1'] : '',
            Os_K2: dataToPost['os_k2'] ? dataToPost['os_k2'] : '',
            Os_Acd: dataToPost['os_acd'] ? dataToPost['os_acd'] : '',
            OD_Mata_Dioperasi: dataToPost.od_mata_dioperasi && dataToPost.od_mata_dioperasi === '1' ? '1' : '0',
            OS_Mata_Dioperasi: dataToPost.os_mata_dioperasi && dataToPost.os_mata_dioperasi === '1' ? '1' : '0',
            Perawat_Pemeriksa_Nama: (inspectNurse && Array.isArray(inspectNurse) && inspectNurse.length > 0 && inspectNurse[0].Nama) ? inspectNurse[0].Nama : '',
            Perawat_Pemeriksa_Id: dataToPost.perawat_pemeriksa ?? '',
            Dokter_Pemeriksa_Nama: (inspectDoctor && Array.isArray(inspectDoctor) && inspectDoctor.length > 0 && inspectDoctor[0].Nama) ? inspectDoctor[0].Nama : '',
            Dokter_Pemeriksa_Id: dataToPost.dokter_pemeriksa ? dataToPost.dokter_pemeriksa : '',
            Catatan: dataToPost['catatan'] ? dataToPost['catatan'] : '',
            TTD_Tanggal: dataToPost['ttd-tanggal'] ? dataToPost['ttd-tanggal'] : '',
            TTD_Dokter_Pemeriksa: (dataToPost['ttd-dokter-pemeriksa'] && dataToPost['ttd-dokter-pemeriksa'] !== '' && isValidFile(dataToPost['ttd-dokter-pemeriksa'])) ? global.storage.cleanUrl(dataToPost['ttd-dokter-pemeriksa']) : '',
            TTD_Perawat: dataToPost['ttd-perawat'] && dataToPost['ttd-perawat'] !== '' && isValidFile(dataToPost['ttd-perawat']) ? global.storage.cleanUrl(dataToPost['ttd-perawat']) : '',
            ID_Dokter_Pemeriksa: dataToPost['id-dokter-pemeriksa'],
            ID_Perawat: dataToPost['id-perawat'],
            Nama_Perawat: nurseName && Array.isArray(nurseName) && nurseName.length > 0 && nurseName[0].Nama ? nurseName[0].Nama : '',
            Nama_Dokter_Pemeriksa: (inspectDoctorA && Array.isArray(inspectDoctorA) && inspectDoctorA.length > 0 && inspectDoctorA[0].Nama) ? inspectDoctorA[0].Nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
            Tanggal_Berobat: dataToPost.tanggal_berobat ? dataToPost.tanggal_berobat : '',
            ID_Pelayanan: emrData.ID_Pelayanan ? emrData.ID_Pelayanan : '',
          }

          const calculations = [
            'Axl',
            'Fold_Asp',
            'Fold_Sp',
            'Ca',
            'Cl',
            'T_Ple',
            'Sys_M',
            'Sys_T',
            'Asqelio',
            'Re_01',
            'Rp_11',
            'Rp_12',
            'Ra_25',
            'Soft_HD_PLUS',
            'Soft_HD',
            'I_Pure',
            'Lenstec_Sbl',
            'Ct_Asphina_409mp',
            'Nano',
            'Oc_Ls_30',
            'Oc_Ls_15',
            'Oc_Ls',
            'Lentis_L313_Monofocal',
            'Nano_fold',
            'B_Lomb_Ao',
            'B_Lomb_Ao_M160',
            'Innova_Aspheric',
            'C_Flex',
            'Lentis_Mplus_Comfort',
            'Lentis_Mplus_Comfort_Toric',
            'At_Lisa',
            'Lentis_T_Plus',
            'At_Lisa_Tri_839mp',
            'Revive',
            'Lucidis',
            'RF_31_PL',
            'RF_22_L',
          ]

          const items = [
            'Iol_Master',
            'Imersion',
            'Contact',
          ]

          for (const calculation of calculations) {
            const name = calculation.toLowerCase();
            for (const item of items) {
              const itemName = item.toLowerCase();
              fixedData[`Od_${calculation}_${item}`] = dataToPost[`od_${name}_${itemName}`];
              fixedData[`Os_${calculation}_${item}`] = dataToPost[`os_${name}_${itemName}`];

              fixedData[`Check_Od_${calculation}`] = dataToPost[`check_od_${name}`] ?? '0'
              fixedData[`Check_Os_${calculation}`] = dataToPost[`check_os_${name}`] ?? '0'
            }
          }
        }
        if (dataToPost.unit && dataToPost.unit === 'Pemeriksaan_Oct_Retina') {
          const octRetinaData = PemeriksaanOCTRetinaModel.createFromJson(dataToPost);
          fixedData = {
            ...octRetinaData,
            Dokter_Pemeriksa_Nama: (inspectDoctor && Array.isArray(inspectDoctor) && inspectDoctor.length > 0 && inspectDoctor[0].Nama) ? inspectDoctor[0].Nama : '',
            Perawat_Pemeriksa_Nama: (inspectNurse && Array.isArray(inspectNurse) && inspectNurse.length > 0 && inspectNurse[0].Nama) ? inspectNurse[0].Nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }
        }
        if (dataToPost.unit && dataToPost.unit === 'Pemeriksaan_Oct_Glaukoma') {
          const octGlaukomaData = PemeriksaanOCTGlaukomaModel.createFromJson(dataToPost);
          fixedData = {
            ...octGlaukomaData,
            Dokter_Pemeriksa_Nama: (inspectDoctor && Array.isArray(inspectDoctor) && inspectDoctor.length > 0 && inspectDoctor[0].Nama) ? inspectDoctor[0].Nama : '',
            Perawat_Pemeriksa_Nama: (inspectNurse && Array.isArray(inspectNurse) && inspectNurse.length > 0 && inspectNurse[0].Nama) ? inspectNurse[0].Nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }
        }
        if (dataToPost.unit && dataToPost.unit === 'Pemeriksaan_Lapangan_Pandang') {
          const lapangPandangData = PemeriksaanLapangPandangModel.createFromJson(dataToPost);
          fixedData = {
            ...lapangPandangData,
            Dokter_Pemeriksa_Nama: (inspectDoctor && Array.isArray(inspectDoctor) && inspectDoctor.length > 0 && inspectDoctor[0].Nama) ? inspectDoctor[0].Nama : '',
            Perawat_Pemeriksa_Nama: (inspectNurse && Array.isArray(inspectNurse) && inspectNurse.length > 0 && inspectNurse[0].Nama) ? inspectNurse[0].Nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }
        }
        if (dataToPost.unit && dataToPost.unit === 'Pemeriksaan_Foto_Fundus') {
          const fotoFundusData = PemeriksaanFotoFundusModel.createFromJson(dataToPost);
          fixedData = {
            ...fotoFundusData,
            Dokter_Pemeriksa_Nama: (inspectDoctor && Array.isArray(inspectDoctor) && inspectDoctor.length > 0 && inspectDoctor[0].Nama) ? inspectDoctor[0].Nama : '',
            Perawat_Pemeriksa_Nama: (inspectNurse && Array.isArray(inspectNurse) && inspectNurse.length > 0 && inspectNurse[0].Nama) ? inspectNurse[0].Nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }
        }
        if (dataToPost.unit && dataToPost.unit === 'Pemeriksaan_Usg') {
          const inpatientNurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${dataToPost['perawat_pemeriksa']}')]`)
          const pemeriksaanUsg = PemeriksaanUSGModel.createFromJson(dataToPost);
          fixedData = {
            ...pemeriksaanUsg,
            Dokter_Pemeriksa_Nama: (inspectDoctor && Array.isArray(inspectDoctor) && inspectDoctor.length > 0 && inspectDoctor[0].Nama) ? inspectDoctor[0].Nama : '',
            Perawat_Pemeriksa_Nama: (inpatientNurse && Array.isArray(inpatientNurse) && inpatientNurse.length > 0 && inpatientNurse[0].Nama) ? inpatientNurse[0].Nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }
        }
        if (dataToPost.unit && dataToPost.unit === 'Tindakan_Yag_Laser') {
          const doctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${dataToPost['dokter']}')]`);
          const operatorDoctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${dataToPost['dokter_operator']}')]`);
          const outpatientNurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${dataToPost['perawat_rawat_jalan']}')]`);
          const yagLaser = TindakanYAGLaser.createFromJson(dataToPost);
          fixedData = {
            ...yagLaser,
            Dokter_Nama: (doctor && Array.isArray(doctor) && doctor.length > 0 && doctor[0].Nama) ? doctor[0].Nama : '',
            Nama_TTD_Dokter_Operator: (operatorDoctor && Array.isArray(operatorDoctor) && operatorDoctor.length > 0 && operatorDoctor[0].Nama) ? operatorDoctor[0].Nama : '',
            Nama_TTD_Perawat_Rawat_Jalan: (outpatientNurse && Array.isArray(outpatientNurse) && outpatientNurse.length > 0 && outpatientNurse[0].Nama) ? outpatientNurse[0].Nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }
        }
        if (dataToPost.unit && dataToPost.unit === 'Tindakan_Laser_Retina') {
          const doctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${dataToPost['dokter']}')]`);
          const operatorDoctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${dataToPost['dokter_operator']}')]`);
          const outpatientNurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${dataToPost['perawat_rawat_jalan']}')]`);
          const laserRetina = TindakanLaserRetina.createFromJson(dataToPost);
          fixedData = {
            ...laserRetina,
            Dokter_Operator_Nama: (doctor && Array.isArray(doctor) && doctor.length > 0 && doctor[0].Nama) ? doctor[0].Nama : '',
            Nama_TTD_Dokter_Operator: (operatorDoctor && Array.isArray(operatorDoctor) && operatorDoctor.length > 0 && operatorDoctor[0].Nama) ? operatorDoctor[0].Nama : '',
            Nama_TTD_Perawat_Rawat_Jalan: (outpatientNurse && Array.isArray(outpatientNurse) && outpatientNurse.length > 0 && outpatientNurse[0].Nama) ? outpatientNurse[0].Nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }
        }
        if (dataToPost.unit && dataToPost.unit === 'Pemeriksaan_Oct_Cornea') {
          const nurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${dataToPost.id_perawat}')]`);
          const doctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${dataToPost.id_dokter_pemeriksaan}')]`);
          const octCornea = PemeriksaanOCTCornea.createFromJson(dataToPost);
          fixedData = {
            ...octCornea,
            Nama_Dokter_Pemeriksaan: doctor && Array.isArray(doctor) && doctor.length > 0 && doctor[0] ? doctor[0].Nama : '',
            Nama_Perawat: nurse && Array.isArray(nurse) && nurse.length > 0 && nurse[0] ? nurse[0].Nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }
        }
        if (dataToPost.unit && dataToPost.unit === 'Laporan_Hasil_Schirmer_Test') {
          const nurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${dataToPost.id_perawat}')]`);
          const doctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${dataToPost.id_dokter_pemeriksa}')]`);
          const schirmerTest = HasilSchirmerTest.createFromJson(dataToPost);
          fixedData = {
            ...schirmerTest,
            Nama_Dokter_Pemeriksa: doctor && Array.isArray(doctor) && doctor.length > 0 && doctor[0] ? doctor[0].Nama : '',
            Nama_Perawat: nurse && Array.isArray(nurse) && nurse.length > 0 && nurse[0] ? nurse[0].Nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }
        }
        let itemId = '';
        if (!id || id === '') {
          const redisJsonData: any = {
            ...fixedData,
            ID: uuid().replace(/-/g, "").toUpperCase(),
            ID_Petugas: req.userId ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            SIP: dataToPost.sip ?? '',
          }
          await global.medicalRecord.addHasilPemeriksaan(req.emrID, redisJsonData);
          responseMessage = 'Data berhasil ditambah';
          itemId = redisJsonData.ID;
        } else {
          const searchQuery = `\'@Kode_Cabang:${emrData.Kode_Cabang} @No_MR:${emrData.No_MR} "${id}"\'`;
          const result = await global.medicalRecord.findHasilPemeriksaan(searchQuery, {
            RETURN: ["$.Kode_Cabang", "$.No_MR", `$.Rawat_Jalan.Laporan_Hasil_Alat_Pemeriksaan[?(@.ID=="${id}")]`],
          });
          localDebug(`Search ${searchQuery}`);

          let data: any;
          if (result.documents.length > 0) {
            data = JSON.parse(result.documents[0].value[`$.Rawat_Jalan.Laporan_Hasil_Alat_Pemeriksaan[?(@.ID=="${id}")]`]);
            if (data["Deleted"] && data["Deleted"] === 1) {
              data = {};
            } else {
              const redisJsonData: any = {
                ...fixedData,
                ID: id ? id : '',
                ID_Petugas: data.ID_Petugas ? data.ID_Petugas : '',
                Nama_Petugas: data.Nama_Petugas ? data.Nama_Petugas : '',
                SIP: dataToPost.sip ?? '',
              }
              const diff = jsonpatch.compare(data, redisJsonData);
              const patch = [];
              for (let i = 0; i < diff.length; i++) {
                if (diff[i].op === "add" || diff[i].op === "replace") patch.push(diff[i]);
              }
              localDebug(`Compare Data ${patch}`);

              const updateDocument = jsonpatch.applyPatch(data, patch);
              localDebug(`Prepare Data ${patch}`);
              await global.medicalRecord.update(req.emrID, `$.Rawat_Jalan.Laporan_Hasil_Alat_Pemeriksaan[?(@.ID=="${id}")]`, updateDocument.newDocument);
              localDebug(`Update Data ${patch}`);
              responseMessage = "Data berhasil diubah";
              itemId = redisJsonData.ID;
            }
          } else {
            throw new Error("No Data");
          }
        }
        ElasticLoggerService().createHTTPResponse(req, res, 200, {
          message: responseMessage,
          data: {
            EMR_ID: req.emrID,
            item_id: itemId,
          },
        });
      }
      if (!emrData || (emrData && emrData === null)) {
        ElasticLoggerService().createHTTPResponse(req, res, 404, {
          message: "EMR Data Not Found",
        });
      }
    } catch (err) {
      localDebug(`Error ${err}`);
      ElasticLoggerService().createHTTPResponse(req, res, 500, {
        message: "Internal Server Error",
        error: err,
      });
    }
  });

IR.route('/hasil-pemeriksaan/view')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const localDebug = debugEMR.extend(req.path);
    localDebug(`Request Begin`);
    const emrKeys = ["Kode_Cabang", "No_MR", "Pasien"];
    const id = req.body["item-id"];

    const emrData = await global.medicalRecord.get(req.emrID, emrKeys);
    if (emrData === null) {
      ElasticLoggerService().createHTTPResponse(req, res, 404, {
        message: "EMR Data Not Found",
      });
    } else {
      try {
        const searchQuery = `\'@Kode_Cabang:${emrData.Kode_Cabang} @No_MR:${emrData.No_MR} "${id}"\'`;
        const result = await global.medicalRecord.findHasilPemeriksaan(searchQuery, {
          RETURN: ["$.Pasien", "$.Kode_Cabang", "$.No_MR", `$.Rawat_Jalan.Laporan_Hasil_Alat_Pemeriksaan[?(@.ID=="${id}")]`],
        });
        localDebug(`Search ${searchQuery}`);

        if (result.documents.length > 0) {
          const data = JSON.parse(result.documents[0].value[`$.Rawat_Jalan.Laporan_Hasil_Alat_Pemeriksaan[?(@.ID=="${id}")]`]);
          const pasien = JSON.parse(result.documents[0].value["$.Pasien"]);

          if (data && data !== null && (!data.Deleted || (data.Deleted && data.Deleted !== 1))) {
            data.EMR_ID = result.documents[0].id ? result.documents[0].id : '';
            const dicoms = [];
            const dicom = await global.medicalRecord.get(data.EMR_ID, ['Dicoms']);
            const modalityCode = getModalityCode(data.Nama);
            if (dicom && Array.isArray(dicom) && dicom.length > 0 && modalityCode) {
              const filtered = dicom.filter((item: any) => item.Modality === modalityCode)
              for (let i = 0; i < filtered.length; i += 1) {
                dicoms.push({
                  ...filtered[i],
                  Viewer: `${global.dicom.getUrl(emrData.Kode_Cabang, filtered[i].StudyInstanceUID)}&Token=${req.token}`,
                  Thumbnail: filtered[i].Thumbnail && filtered[i].Thumbnail !== '' && isValidFile(filtered[i].Thumbnail) ? await global.storage.signUrl(filtered[i].Thumbnail, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '',
                })
              }
            }

            if (data.PDF && data.PDF !== '' && isValidFile(data.PDF)) {
              data.PDF = await global.storage.signUrl(data.PDF, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
            }

            data.TTD_Dokter_Pemeriksa = (data.TTD_Dokter_Pemeriksa && data.TTD_Dokter_Pemeriksa !== '' && isValidFile(data.TTD_Dokter_Pemeriksa)) ? await global.storage.signUrl(data.TTD_Dokter_Pemeriksa, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

            res.status(200).json({
              message: "OK",
              data: {
                form: data,
                dicoms,
                pasien,
              },
            });
          }

          if (data && data.Deleted && data.Deleted === 1) {
            ElasticLoggerService().createHTTPResponse(req, res, 200, {
              message: "Data has been deleted",
            });
          }

        }
      } catch (err) {
        localDebug(`Error ${err}`);
        ElasticLoggerService().createHTTPResponse(req, res, 500, {
          message: "Internal Server Error",
          error: err,
        });
      }
      localDebug(`Request End`);
    }
  });

IR.route('/hasil-pemeriksaan/item')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const localDebug = debugEMR.extend(req.path);
    localDebug(`Request Begin`);

    const limit = req.body.limit || 100;
    const offset: number = req.body.offset || 0;
    const sortDir = req.body.sort || "ASC";
    const emrKeys = ["Kode_Cabang", "No_MR", "Pasien"];
    const emrData = await global.medicalRecord.get(req.emrID, emrKeys);
    if (emrData === null) {
      ElasticLoggerService().createHTTPResponse(req, res, 404, {
        message: "EMR Data Not Found",
      });
    } else {
      localDebug(`Get EMR Data ${JSON.stringify(emrData)}`);
      const fields = await global.medicalRecord.getFields(req.emrID, req.body.fields || []);
      localDebug(`Get Fields ${JSON.stringify(req.body.fields)}`);
      const dicoms = [];
      const dicom = await global.medicalRecord.get(req.emrID, ['Dicoms']);
      if (dicom && Array.isArray(dicom) && dicom.length > 0) {
        for (let i = 0; i < dicom.length; i += 1) {
          dicoms.push({
            ...dicom[i],
            Original: dicom[i].Original && dicom[i].Original !== '' && isValidFile(dicom[i].Original) ? await global.storage.signUrl(dicom[i].Original, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '',
            Viewer: `${global.dicom.getUrl(emrData.Kode_Cabang, dicom[i].StudyInstanceUID)}&Token=${req.token}`,
            Thumbnail: dicom[i].Thumbnail && dicom[i].Thumbnail !== '' && isValidFile(dicom[i].Thumbnail) ? await global.storage.signUrl(dicom[i].Thumbnail, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '',
          })
        }
      }

      const searchQuery = `\'@Kode_Cabang:${emrData.Kode_Cabang} @No_MR:${emrData.No_MR}\'`;
      const result = await global.medicalRecord.find(searchQuery, {
        RETURN: ["$.Kode_Cabang", "$.No_MR", "$.Rawat_Jalan.Laporan_Hasil_Alat_Pemeriksaan"],
        LIMIT: { from: 0, size: 10000 },
      });
      localDebug(`Search ${searchQuery}`);
      localDebug(result);
      let records: any = [];
      // Merge EdukasiHarian from multiple visits
      for (let i = 0; i < result.documents.length; i++) {
        if (result.documents[i].value["$.Rawat_Jalan.Laporan_Hasil_Alat_Pemeriksaan"] !== undefined) {
          const objInspection = JSON.parse(result.documents[i].value["$.Rawat_Jalan.Laporan_Hasil_Alat_Pemeriksaan"]);
          const newObjInspection = objInspection.filter((item: any) => !!(item.Nama !== 'Tindakan_Yag_Laser' && item.Nama !== 'Tindakan_Laser_Retina'))
          for (let j = 0; j < newObjInspection.length; j++) {
            const dicomsPerId = [];
            const dicomPerId = await global.medicalRecord.get(result.documents[i].id, ['Dicoms']);
            const modalityCodePerId = getModalityCode(newObjInspection[j]['Nama']);
            if (dicomPerId && Array.isArray(dicomPerId) && dicomPerId.length > 0 && modalityCodePerId) {
              const filtered = dicomPerId.filter((item: any) => item.Modality === modalityCodePerId)
              for (let k = 0; k < filtered.length; k += 1) {
                dicomsPerId.push({
                  ...filtered[k],
                  Original: filtered[k].Original && filtered[k].Original !== '' && isValidFile(filtered[k].Original) ? await global.storage.signUrl(filtered[k].Original, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '',
                  Viewer: `${global.dicom.getUrl(emrData.Kode_Cabang, filtered[k].StudyInstanceUID)}&Token=${req.token}`,
                  Thumbnail: filtered[k].Thumbnail && filtered[k].Thumbnail !== '' && isValidFile(filtered[k].Thumbnail) ? await global.storage.signUrl(filtered[k].Thumbnail, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '',
                })
              }
            }
            newObjInspection[j]['dicoms'] = dicomsPerId;
            newObjInspection[j]["EMR_ID"] = result.documents[i].id;
          }
          records = records.concat(newObjInspection);
        }
      }
      localDebug(`Merge Data`);

      const total = records.length;
      // Sort EdukasiHarian based on param direction
      records.sort((a: any, b: any) => {
        if (sortDir === "ASC") {
          return moment(a.Waktu).unix() - moment(b.Waktu).unix();
        } else if (sortDir === "DESC") {
          return moment(b.Waktu).unix() - moment(a.Waktu).unix();
        }
      });
      localDebug(`Sort Data`);

      // Show based on param offset and param limit
      records = records.slice(offset, offset + limit > records.length ? records.length : offset + limit);
      localDebug(`Slice Data`);

      records = records.filter((val: any) => !val.Deleted || (val.Deleted && val.Deleted !== 1))

      // Show just used fields
      for (let i = 0; i < records.length; i++) {
        if (records[i].PDF && records[i].PDF !== '' && isValidFile(records[i].PDF)) {
          records[i].PDF = await global.storage.signUrl(records[i].PDF, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (records[i].TTD_Perawat_Pemeriksa && records[i].TTD_Perawat_Pemeriksa !== '' && isValidFile(records[i].TTD_Perawat_Pemeriksa)) {
          records[i].TTD_Perawat_Pemeriksa = await global.storage.signUrl(records[i].TTD_Perawat_Pemeriksa, new Date(`${moment().format('YYYY-MM-DD')} 23:59:59`));
        }
        if (records[i].TTD_Dokter_Pemeriksa && records[i].TTD_Dokter_Pemeriksa !== '' && isValidFile(records[i].TTD_Dokter_Pemeriksa)) {
          records[i].TTD_Dokter_Pemeriksa = await global.storage.signUrl(records[i].TTD_Dokter_Pemeriksa, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (records[i].TTD_Perawat_Rawat_Inap && records[i].TTD_Perawat_Rawat_Inap !== '' && isValidFile(records[i].TTD_Perawat_Rawat_Inap)) {
          records[i].TTD_Perawat_Rawat_Inap = await global.storage.signUrl(records[i].TTD_Perawat_Rawat_Inap, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (records[i].TTD_Dokter_Operator && records[i].TTD_Dokter_Operator !== '' && isValidFile(records[i].TTD_Dokter_Operator)) {
          records[i].TTD_Dokter_Operator = await global.storage.signUrl(records[i].TTD_Dokter_Operator, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (records[i].TTD_Perawat_Rawat_Jalan && records[i].TTD_Perawat_Rawat_Jalan !== '' && isValidFile(records[i].TTD_Perawat_Rawat_Jalan)) {
          records[i].TTD_Perawat_Rawat_Jalan = await global.storage.signUrl(records[i].TTD_Perawat_Rawat_Jalan, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (records[i].TTD_Perawat && records[i].TTD_Perawat !== '' && isValidFile(records[i].TTD_Perawat)) {
          records[i].TTD_Perawat = await global.storage.signUrl(records[i].TTD_Perawat, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (records[i].TTD_Dokter_Pemeriksaan && records[i].TTD_Dokter_Pemeriksaan !== '' && isValidFile(records[i].TTD_Dokter_Pemeriksaan)) {
          records[i].TTD_Dokter_Pemeriksaan = await global.storage.signUrl(records[i].TTD_Dokter_Pemeriksaan, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (records[i].Gambar_Mata_OD && records[i].Gambar_Mata_OD !== '' && isValidFile(records[i].Gambar_Mata_OD)) {
          records[i].Gambar_Mata_OD = await global.storage.signUrl(records[i].Gambar_Mata_OD, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (records[i].Gambar_Mata_OS && records[i].Gambar_Mata_OS !== '' && isValidFile(records[i].Gambar_Mata_OS)) {
          records[i].Gambar_Mata_OS = await global.storage.signUrl(records[i].Gambar_Mata_OS, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (records[i].Gambar_Retina_OD && records[i].Gambar_Retina_OD !== '' && isValidFile(records[i].Gambar_Retina_OD)) {
          records[i].Gambar_Retina_OD = await global.storage.signUrl(records[i].Gambar_Retina_OD, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (records[i].Gambar_Retina_OS && records[i].Gambar_Retina_OS !== '' && isValidFile(records[i].Gambar_Retina_OS)) {
          records[i].Gambar_Retina_OS = await global.storage.signUrl(records[i].Gambar_Retina_OS, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
      }
      localDebug(`Create Custom Data`);

      if (!res.writableEnded) {
        res.status(200).json({
          message: "OK",
          data: {
            total,
            totalFiltered: records.length,
            EMR_ID: req.emrID,
            pasien: emrData.Pasien,
            records,
            dicoms,
            fields,
          },
        });
      }
    }
    localDebug(`Request End`);
  });

IR.route('/hasil-pemeriksaan/item-laser')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const localDebug = debugEMR.extend(req.path);
    localDebug(`Request Begin`);

    const limit = req.body.limit || 100;
    const offset: number = req.body.offset || 0;
    const sortDir = req.body.sort || "ASC";
    const emrKeys = ["Kode_Cabang", "No_MR", "Pasien"];
    const emrData = await global.medicalRecord.get(req.emrID, emrKeys);
    if (emrData === null) {
      ElasticLoggerService().createHTTPResponse(req, res, 404, {
        message: "EMR Data Not Found",
      });
    } else {
      localDebug(`Get EMR Data ${JSON.stringify(emrData)}`);
      const fields = await global.medicalRecord.getFields(req.emrID, req.body.fields || []);
      localDebug(`Get Fields ${JSON.stringify(req.body.fields)}`);
      const dicoms = [];
      const dicom = await global.medicalRecord.get(req.emrID, ['Dicoms']);
      if (dicom && Array.isArray(dicom) && dicom.length > 0) {
        for (let i = 0; i < dicom.length; i += 1) {
          dicoms.push({
            ...dicom[i],
            Original: dicom[i].Original && dicom[i].Original !== '' && isValidFile(dicom[i].Original) ? await global.storage.signUrl(dicom[i].Original, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '',
            Viewer: `${global.dicom.getUrl(emrData.Kode_Cabang, dicom[i].StudyInstanceUID)}&Token=${req.token}`,
            Thumbnail: dicom[i].Thumbnail && dicom[i].Thumbnail !== '' && isValidFile(dicom[i].Thumbnail) ? await global.storage.signUrl(dicom[i].Thumbnail, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '',
          })
        }
      }

      const searchQuery = `\'@Kode_Cabang:${emrData.Kode_Cabang} @No_MR:${emrData.No_MR}\'`;
      const result = await global.medicalRecord.findHasilPemeriksaan(searchQuery, {
        RETURN: ["$.Kode_Cabang", "$.No_MR", "$.Rawat_Jalan.Laporan_Hasil_Alat_Pemeriksaan"],
        LIMIT: { from: 0, size: 10000 },
      });
      let records: any = [];
      // Merge EdukasiHarian from multiple visits
      for (let i = 0; i < result.documents.length; i++) {
        if (result.documents[i].value["$.Rawat_Jalan.Laporan_Hasil_Alat_Pemeriksaan"] !== undefined) {
          const objInspection = JSON.parse(result.documents[i].value["$.Rawat_Jalan.Laporan_Hasil_Alat_Pemeriksaan"]);
          const newObjInspection = objInspection.filter((item: any) => !!(item.Nama === 'Tindakan_Yag_Laser' || item.Nama === 'Tindakan_Laser_Retina'))
          for (let j = 0; j < newObjInspection.length; j++) {
            const dicomsPerId = [];
            const dicomPerId = await global.medicalRecord.get(result.documents[i].id, ['Dicoms']);
            const modalityCodePerId = getModalityCode(newObjInspection[j]['Nama']);
            if (dicomPerId && Array.isArray(dicomPerId) && dicomPerId.length > 0 && modalityCodePerId) {
              const filtered = dicomPerId.filter((item: any) => item.Modality === modalityCodePerId)
              for (let k = 0; k < filtered.length; k += 1) {
                dicomsPerId.push({
                  ...filtered[k],
                  Original: filtered[k].Original && filtered[k].Original !== '' && isValidFile(filtered[k].Original) ? await global.storage.signUrl(filtered[k].Original, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '',
                  Viewer: `${global.dicom.getUrl(emrData.Kode_Cabang, filtered[k].StudyInstanceUID)}&Token=${req.token}`,
                  Thumbnail: filtered[k].Thumbnail && filtered[k].Thumbnail !== '' && isValidFile(filtered[k].Thumbnail) ? await global.storage.signUrl(filtered[k].Thumbnail, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '',
                })
              }
            }
            newObjInspection[j]['dicoms'] = dicomsPerId;
            newObjInspection[j]["EMR_ID"] = result.documents[i].id;
          }
          records = records.concat(newObjInspection);
        }
      }
      localDebug(`Merge Data`);

      const total = records.length;
      // Sort EdukasiHarian based on param direction
      records.sort((a: any, b: any) => {
        if (sortDir === "ASC") {
          return moment(a.Waktu).unix() - moment(b.Waktu).unix();
        } else if (sortDir === "DESC") {
          return moment(b.Waktu).unix() - moment(a.Waktu).unix();
        }
      });
      localDebug(`Sort Data`);

      // Show based on param offset and param limit
      records = records.slice(offset, offset + limit > records.length ? records.length : offset + limit);
      localDebug(`Slice Data`);

      records = records.filter((val: any) => !val.Deleted || (val.Deleted && val.Deleted !== 1))

      // Show just used fields
      for (let i = 0; i < records.length; i++) {
        if (records[i].PDF && records[i].PDF !== '' && isValidFile(records[i].PDF)) {
          records[i].PDF = await global.storage.signUrl(records[i].PDF, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (records[i].TTD_Perawat_Pemeriksa && records[i].TTD_Perawat_Pemeriksa !== '' && isValidFile(records[i].TTD_Perawat_Pemeriksa)) {
          records[i].TTD_Perawat_Pemeriksa = await global.storage.signUrl(records[i].TTD_Perawat_Pemeriksa, new Date(`${moment().format('YYYY-MM-DD')} 23:59:59`));
        }
        if (records[i].TTD_Dokter_Pemeriksa && records[i].TTD_Dokter_Pemeriksa !== '' && isValidFile(records[i].TTD_Dokter_Pemeriksa)) {
          records[i].TTD_Dokter_Pemeriksa = await global.storage.signUrl(records[i].TTD_Dokter_Pemeriksa, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (records[i].TTD_Perawat_Rawat_Inap && records[i].TTD_Perawat_Rawat_Inap !== '' && isValidFile(records[i].TTD_Perawat_Rawat_Inap)) {
          records[i].TTD_Perawat_Rawat_Inap = await global.storage.signUrl(records[i].TTD_Perawat_Rawat_Inap, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (records[i].TTD_Dokter_Operator && records[i].TTD_Dokter_Operator !== '' && isValidFile(records[i].TTD_Dokter_Operator)) {
          records[i].TTD_Dokter_Operator = await global.storage.signUrl(records[i].TTD_Dokter_Operator, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (records[i].TTD_Perawat_Rawat_Jalan && records[i].TTD_Perawat_Rawat_Jalan !== '' && isValidFile(records[i].TTD_Perawat_Rawat_Jalan)) {
          records[i].TTD_Perawat_Rawat_Jalan = await global.storage.signUrl(records[i].TTD_Perawat_Rawat_Jalan, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (records[i].TTD_Perawat && records[i].TTD_Perawat !== '' && isValidFile(records[i].TTD_Perawat)) {
          records[i].TTD_Perawat = await global.storage.signUrl(records[i].TTD_Perawat, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (records[i].TTD_Dokter_Pemeriksaan && records[i].TTD_Dokter_Pemeriksaan !== '' && isValidFile(records[i].TTD_Dokter_Pemeriksaan)) {
          records[i].TTD_Dokter_Pemeriksaan = await global.storage.signUrl(records[i].TTD_Dokter_Pemeriksaan, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (records[i].Gambar_Mata_OD && records[i].Gambar_Mata_OD !== '' && isValidFile(records[i].Gambar_Mata_OD)) {
          records[i].Gambar_Mata_OD = await global.storage.signUrl(records[i].Gambar_Mata_OD, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (records[i].Gambar_Mata_OS && records[i].Gambar_Mata_OS !== '' && isValidFile(records[i].Gambar_Mata_OS)) {
          records[i].Gambar_Mata_OS = await global.storage.signUrl(records[i].Gambar_Mata_OS, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (records[i].Gambar_Retina_OD && records[i].Gambar_Retina_OD !== '' && isValidFile(records[i].Gambar_Retina_OD)) {
          records[i].Gambar_Retina_OD = await global.storage.signUrl(records[i].Gambar_Retina_OD, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (records[i].Gambar_Retina_OS && records[i].Gambar_Retina_OS !== '' && isValidFile(records[i].Gambar_Retina_OS)) {
          records[i].Gambar_Retina_OS = await global.storage.signUrl(records[i].Gambar_Retina_OS, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
      }
      localDebug(`Create Custom Data`);

      if (!res.writableEnded) {
        res.status(200).json({
          message: "OK",
          data: {
            total,
            totalFiltered: records.length,
            EMR_ID: req.emrID,
            pasien: emrData.Pasien,
            records,
            dicoms,
            fields,
          },
        });
      }
    }
    localDebug(`Request End`);
  })

IR.route('/hasil-pemeriksaan/delete')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const emrKeys = ["Kode_Cabang", "No_MR", "Pasien"];
      const id = req.body['item-id'];
      const emrData = await global.medicalRecord.get(req.emrID, emrKeys);

      if (emrData && emrData !== null) {
        if (id && id !== null) {
          const searchQuery = `\'@Kode_Cabang:${emrData.Kode_Cabang} @No_MR:${emrData.No_MR} "${id}"\'`;
          const result = await global.medicalRecord.findHasilPemeriksaan(searchQuery, {
            RETURN: ["$.Kode_Cabang", "$.No_MR", `$.Rawat_Jalan.Laporan_Hasil_Alat_Pemeriksaan[?(@.ID=="${id}")]`],
          });

          if (result.documents.length > 0) {
            const oldData = JSON.parse(result.documents[0].value[`$.Rawat_Jalan.Laporan_Hasil_Alat_Pemeriksaan[?(@.ID=="${id}")]`]);

            let data = JSON.parse(result.documents[0].value[`$.Rawat_Jalan.Laporan_Hasil_Alat_Pemeriksaan[?(@.ID=="${id}")]`]);

            if (data["Deleted"] && data["Deleted"] === 1) {
              data = {};
              ElasticLoggerService().createHTTPResponse(req, res, 404, {
                message: "File Has Been Deleted",
              });
            } else {
              // update Edukasi_Harian
              data.Deleted = 1;
              data.Deleted_At = moment().format("YYYY-MM-DD HH:mm:ss");
              data.Deleted_By = req.userId;
              data.Deleted_By_Nama = req.userProfile.nama;

              const diff = jsonpatch.compare(oldData, data);
              const patch = [];
              for (let i = 0; i < diff.length; i++) {
                if (diff[i].op === "add" || diff[i].op === "replace") patch.push(diff[i]);
              }
              const updateDocument = jsonpatch.applyPatch(oldData, patch);
              await global.medicalRecord.update(req.emrID, `$.Rawat_Jalan.Laporan_Hasil_Alat_Pemeriksaan[?(@.ID=="${id}")]`, updateDocument.newDocument);
              ElasticLoggerService().createHTTPResponse(req, res, 200, {
                message: "OK",
              });
            }
          } else {
            ElasticLoggerService().createHTTPResponse(req, res, 500, {
              message: "Data Not Found",
            });
            throw new Error("No Data");
          }
        }
        if (!id || (id && id === null)) {
          ElasticLoggerService().createHTTPResponse(req, res, 500, {
            message: "No Hasil Pemeriksaan ID",
          });
        }
      }
      if (!emrData || (emrData && emrData === null)) {
        ElasticLoggerService().createHTTPResponse(req, res, 500, {
          message: "EMR Data Not Found",
        });
      }
    } catch (err) {
      ElasticLoggerService().createHTTPResponse(req, res, 500, {
        message: `${err}`,
      });
    }
  });

IR.route('/hasil-pemeriksaan/add-pdf')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const dataToPost = req.body;
    const id = dataToPost.item_id;
    try {
      if (dataToPost && req.emrID) {
        const result = await global.medicalRecord.get(req.emrID, `$.Rawat_Jalan.Laporan_Hasil_Alat_Pemeriksaan.[?(@.ID=="${id}")]`)
        if (result && result !== null && Array.isArray(result) && result.length > 0) {
          const oldData = result[0]
          const data = {
            ...result[0],
            PDF: dataToPost.pdf_url,
          };
          const diff = jsonpatch.compare(oldData, data);
          const updateDocument = jsonpatch.applyPatch(oldData, diff);
          await global.medicalRecord.update(req.emrID, `$.Rawat_Jalan.Laporan_Hasil_Alat_Pemeriksaan[?(@.ID=="${id}")]`, updateDocument.newDocument);
          ElasticLoggerService().createLog(req, '/hasil-pemeriksaan/add-pdf', 'OK');
          if (!res.writableEnded) {
            res.status(200).json({
              message: 'OK',
            })
          }
        } else {
          ElasticLoggerService().createErrorLog(req, '/hasil-pemeriksaan/add-pdf', 'Data not found');
          if (!res.writableEnded) {
            res.status(500).json({
              message: 'Data Not Found',
            })
          }
        }
      } else {
        if (!res.writableEnded) {
          ElasticLoggerService().createErrorLog(req, '/hasil-pemeriksaan/add-pdf', 'EMR_ID not provided');
          res.status(500).json({
            message: 'EMR_ID not provided',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        ElasticLoggerService().createErrorLog(req, '/hasil-pemeriksaan/add-pdf', err);
        res.status(500).json({
          message: err,
        })
      }
    }
  });

export { IR }
