import { Router, Request, Response, NextFunction } from "express";
import RBAC from "../../../services/rbac";
import moment from "moment";
const jp = require("jsonpath");
import * as jsonpatch from "fast-json-patch";
import { ElasticLoggerService } from "./services";
import { isValidFile } from "./helpers/app.helper";
import { IUpdatePernyataanBPJS, IUpdatePernyataanUMUM, IUpdateResumeMedis } from "./interfaces/information/information.request";
import { IResumeMedisForm, PernyataanBPJS, PernyataanUMUM, ResumeMedisForm } from "./interfaces/information/information.model";
const Information = Router();

Information.route("/informasi/general-consent-form").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const emrKeys = ["ID_Pelayanan", "Jenis_Pelayanan", "Pasien", "Wali", "No_MR"];
  const checkObject = await global.medicalRecord.keys(req.emrID, ".Informasi");
  if (checkObject !== null && checkObject.includes("General_Consent")) {
    emrKeys.push("Informasi.General_Consent");
  }

  let docterIdKey = "";
  let billingTypeKey = "";
  const checkObjectInPatient = await global.medicalRecord.keys(req.emrID, ".Rawat_Inap");
  if (checkObjectInPatient !== null && checkObjectInPatient.includes("ID_Dokter") && checkObjectInPatient.includes("Nama_Tipe_Tagihan")) {
    emrKeys.push("Rawat_Inap.ID_Dokter");
    emrKeys.push("Rawat_Inap.Nama_Tipe_Tagihan");
    docterIdKey = "Rawat_Inap.ID_Dokter";
    billingTypeKey = "Rawat_Inap.Nama_Tipe_Tagihan";
  }

  const checkObjectOutPatient = await global.medicalRecord.keys(req.emrID, ".Rawat_Jalan");
  if (checkObjectOutPatient !== null && checkObjectOutPatient.includes("ID_Dokter") && checkObjectOutPatient.includes("Nama_Tipe_Tagihan")) {
    emrKeys.push("Rawat_Jalan.ID_Dokter");
    emrKeys.push("Rawat_Jalan.Nama_Tipe_Tagihan");
    docterIdKey = "Rawat_Jalan.ID_Dokter";
    billingTypeKey = "Rawat_Jalan.Nama_Tipe_Tagihan";
  }

  const result = await global.medicalRecord.get(req.emrID, emrKeys);
  const fields = await global.medicalRecord.getFields(req.emrID, req.body.fields || []);

  const form = result["Informasi.General_Consent"] ? result["Informasi.General_Consent"] : {};

  form.TTD_Saksi = form.TTD_Saksi && form.TTD_Saksi !== "" && isValidFile(form.TTD_Saksi) ? await global.storage.signUrl(form.TTD_Saksi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : "";

  form.TTD_Pasien = form.TTD_Pasien && form.TTD_Pasien !== "" && isValidFile(form.TTD_Pasien) ? await global.storage.signUrl(form.TTD_Pasien, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : "";

  if (!res.writableEnded) {
    res.status(200).json({
      message: "OK",
      data: {
        EMR_ID: req.emrID,
        nomor_mr: result.No_MR,
        id_pelayanan: result.ID_Pelayanan,
        jenis_pelayanan: result.Jenis_Pelayanan,
        pasien: result.Pasien,
        wali: result.Wali,
        id_dokter: result[docterIdKey],
        tagihan: result[billingTypeKey],
        form: result["Informasi.General_Consent"] || {},
        fields,
      },
    });
  }
});

Information.route("/informasi/general-consent-process").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    //Check body & emrID
    if (req.body && req.emrID) {
      const emrData = await global.medicalRecord.get(req.emrID, ".");
      //Check EMR Data
      if (emrData && emrData !== null) {
        const employees = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, ".");
        const doctorTreating = jp.query(employees, `$[?(@.ID_Karyawan=='${req.body["dokter-rawat"]}' && @.Status_Dokter==1 && @.Status_Perawat==0 && @.Status_Aktif==1)]`);
        const doctorOnDuty = jp.query(employees, `$[?(@.ID_Karyawan=='${req.body["dokter-jaga"]}' && @.Status_Dokter==1 && @.Status_Perawat==0 && @.Status_Aktif==1)]`);
        const selectedOfficer = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${req.body['id-saksi']}')]`)
        const listNama = [];
        for (const nama of req.body['namaTidakIzin'] || []) {
          if (nama.trim() !== '') {
            listNama.push(nama.trim());
          }
        }
        const formGeneralConsent:IFormGeneralConsent = {
          Tanggal_TTD: req.body['tanggal-ttd'] ? req.body['tanggal-ttd'] : '',
          ID_Saksi: req.body['id-saksi'] ? req.body['id-saksi'] : '',
          Nama_Saksi: selectedOfficer && Array.isArray(selectedOfficer) && selectedOfficer.length > 0 && selectedOfficer[0].Nama ? selectedOfficer[0].Nama : '',
          TTD_Saksi: (req.body['ttd-saksi'] && req.body['ttd-saksi'] !== '' && isValidFile(req.body['ttd-saksi'])) ? global.storage.cleanUrl(req.body['ttd-saksi']) : '',
          Tanda_Tangan: (req.body['tandaTangan-radio'] === '1' ? 'Pasien' : 'Wali'),
          Tanda_Tangan_Nama: req.body['tandaTangan-nama'] ? req.body['tandaTangan-nama'] : '',
          Tanda_Tangan_Telepon: req.body['tandaTangan-telp'] ? req.body['tandaTangan-telp'] : '',
          Tanda_Tangan_Alamat: req.body['tandaTangan-alamat'] ? req.body['tandaTangan-alamat'] : '',
          Tipe_Pembayaran: (emrData.Jenis_Pelayanan && emrData.Jenis_Pelayanan === 'RawatInap' ? emrData.Rawat_Inap.Nama_Tipe_Tagihan : emrData.Rawat_Jalan.Nama_Tipe_Tagihan),
          Nama_Wali: req.body['pelepasan-wali'] ? req.body['pelepasan-wali'] : '',
          Pelepasan_Lain: req.body['pelepasan-lain'] ? req.body['pelepasan-lain'] : '',
          Nama_Dokter_Rawat: doctorTreating && Array.isArray(doctorTreating) && doctorTreating[0] && doctorTreating[0].Nama ? doctorTreating[0].Nama : '',
          ID_Dokter_Rawat: doctorTreating && Array.isArray(doctorTreating) && doctorTreating[0] && doctorTreating[0].ID_Karyawan ? doctorTreating[0].ID_Karyawan : '',
          Nama_Dokter_Jaga: doctorOnDuty && Array.isArray(doctorOnDuty) && doctorOnDuty[0] && doctorOnDuty[0].Nama ? doctorOnDuty[0].Nama : '',
          ID_Dokter_Jaga: doctorOnDuty && Array.isArray(doctorOnDuty) && doctorOnDuty[0] && doctorOnDuty[0].ID_Karyawan ? doctorOnDuty[0].ID_Karyawan : '',
          Bersedia_Dikunjung: (req.body['kunjungan-radio'] && req.body['kunjungan-radio'] === '1' ? 1 : 0),
          Nama_Tidak_Diizinkan: listNama,
          TTD_Pasien: (req.body['ttd-pasien'] && req.body['ttd-pasien'] !== '' && isValidFile(req.body['ttd-pasien'])) ? global.storage.cleanUrl(req.body['ttd-pasien']) : '',
          ID_Petugas: req.userId ? req.userId : '',
          Nama_Petugas: req.userProfile && req.userProfile.nama ? req.userProfile.nama : '',
          Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
          Updated_By: req.userId ? req.userId : '',
          Updated_By_Name: req.userProfile && req.userProfile.nama ? req.userProfile.nama : '',
        }

        const newEMR: IMedicalRecord = JSON.parse(JSON.stringify(emrData));
        if (newEMR.Informasi && newEMR.Informasi !== null) {
          newEMR.Informasi.General_Consent = formGeneralConsent;
          const diff = jsonpatch.compare(emrData, newEMR);
          const updateDocument = jsonpatch.applyPatch(emrData, diff);
          await global.medicalRecord.update(req.emrID, "$.Informasi.General_Consent", updateDocument.newDocument.Informasi.General_Consent);

          ElasticLoggerService().createLog(req, "/informasi/general-consent", "OK");
          if (!res.writableEnded) {
            res.status(200).json({
              message: "OK",
            });
          }
        } else {
          const information: IInformation = {
            General_Consent: formGeneralConsent,
          };
          newEMR.Informasi = information;
          const diff = jsonpatch.compare(emrData, newEMR);
          const updateDocument = jsonpatch.applyPatch(emrData, diff);
          await global.medicalRecord.update(req.emrID, "$.Informasi", updateDocument.newDocument.Informasi);
          ElasticLoggerService().createLog(req, "/informasi/general-consent", "OK");
          if (!res.writableEnded) {
            res.status(200).json({
              message: "OK",
            });
          }
        }
      }
      if (!emrData || (emrData && emrData === null)) {
        const errorMessage = "Patient data not found";
        ElasticLoggerService().createErrorLog(req, "/informasi/general-consent", errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          });
        }
      }
    }
    if (!req.emrID || (req.emrID && req.emrID === "")) {
      const errorMessage = "EMR_ID not found";
      ElasticLoggerService().createErrorLog(req, "/informasi/general-consent", errorMessage);
      if (!res.writableEnded) {
        res.status(500).json({
          message: errorMessage,
        });
      }
    }
  } catch (err) {
    ElasticLoggerService().createErrorLog(req, "/informasi/general-consent", `${err}`);
    if (!res.writableEnded) {
      res.status(500).json({
        message: `${err}`,
      });
    }
  }
});

Information.route("/informasi/identitas-pasien").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const emrKeys = ["Pasien", "Wali", "No_MR"];
  const checkObject = await global.medicalRecord.keys(req.emrID, ".Informasi");
  if (checkObject !== null && checkObject.includes("Identitas_Pasien")) {
    emrKeys.push("Informasi.Identitas_Pasien");
  }
  const result = await global.medicalRecord.get(req.emrID, emrKeys);
  const formPatientIdentity: IFormPatientIdentity = result["Informasi.Identitas_Pasien"] || {};
  if (JSON.stringify(formPatientIdentity) !== "{}") {
    formPatientIdentity.Tanda_Tangan_Wali = formPatientIdentity.Tanda_Tangan_Wali && formPatientIdentity.Tanda_Tangan_Wali !== "" && isValidFile(formPatientIdentity.Tanda_Tangan_Wali) ? await global.storage.signUrl(formPatientIdentity.Tanda_Tangan_Wali, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : "";

    formPatientIdentity.Tanda_Tangan_Pasien = formPatientIdentity.Tanda_Tangan_Pasien && formPatientIdentity.Tanda_Tangan_Pasien !== "" && isValidFile(formPatientIdentity.Tanda_Tangan_Pasien) ? await global.storage.signUrl(formPatientIdentity.Tanda_Tangan_Pasien, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : "";

    formPatientIdentity.Tanda_Tangan_Petugas = formPatientIdentity.Tanda_Tangan_Petugas && formPatientIdentity.Tanda_Tangan_Petugas !== "" && isValidFile(formPatientIdentity.Tanda_Tangan_Petugas) ? await global.storage.signUrl(formPatientIdentity.Tanda_Tangan_Petugas, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : "";
  }
  const fields = await global.medicalRecord.getFields(req.emrID, req.body.fields || []);
  if (!res.writableEnded) {
    res.status(200).json({
      message: "OK",
      data: {
        EMR_ID: req.emrID,
        nomor_mr: result.No_MR,
        pasien: result.Pasien,
        wali: result.Wali,
        form: formPatientIdentity,
        fields,
      },
    });
  }
});

Information.route("/informasi/identitas-pasien-process").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.body && req.emrID) {
      let employeeProfile: any = '';
      if (req.body['id-petugas'] && req.body['id-petugas'] !== '') {
        employeeProfile = await RBAC.getInstance().getUserProfile(req.token, req.body['id-petugas'])
      }
      const formPatientIdentity: IFormPatientIdentity = {
        Tanda_Tangan_Radio: req.body['tandaTangan-radio'] ? req.body['tandaTangan-radio'] : '',
        Tanda_Tangan_Wali: (req.body['tanda-tangan-wali'] && req.body['tanda-tangan-wali'] !== '' && isValidFile(req.body['tanda-tangan-wali'])) ? global.storage.cleanUrl(req.body['tanda-tangan-wali']) : '',
        Tanda_Tangan_Pasien: (req.body['tanda-tangan-pasien'] && req.body['tanda-tangan-pasien'] !== '' && isValidFile(req.body['tanda-tangan-pasien'])) ? global.storage.cleanUrl(req.body['tanda-tangan-pasien']) : '',
        Tanda_Tangan_Petugas: (req.body['tanda-tangan-petugas'] && req.body['tanda-tangan-petugas'] !== '' && isValidFile(req.body['tanda-tangan-petugas'])) ? global.storage.cleanUrl(req.body['tanda-tangan-petugas']) : '',
        ID_Petugas: req.body['id-petugas'] ? req.body['id-petugas'] : '',
        Nama_Petugas: (employeeProfile && employeeProfile !== '' && employeeProfile.nama) ? employeeProfile.nama : '',
        Updated_At:  moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
        Updated_By: req.userId ? req.userId : '',
        Updated_By_Name: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
      }
      const information:IInformation = {
        Identitas_Pasien: formPatientIdentity,
      }
      const emrData = await global.medicalRecord.get(req.emrID, '.')
      if (emrData && emrData !== null) {
        const newEMR: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
        if (newEMR.Informasi && newEMR.Informasi !== null) {
          newEMR.Informasi.Identitas_Pasien = formPatientIdentity
          const diff = jsonpatch.compare(emrData, newEMR);
          const updateDocument = jsonpatch.applyPatch(emrData, diff)
          await global.medicalRecord.update(req.emrID, '$.Informasi.Identitas_Pasien', updateDocument.newDocument.Informasi.Identitas_Pasien)

          ElasticLoggerService().createLog(req, "/informasi/identitas-pasien", "OK");
          if (!res.writableEnded) {
            res.status(200).json({
              message: "OK",
            });
          }
        } else {
          newEMR.Informasi = information;
          const diff = jsonpatch.compare(emrData, newEMR);
          const updateDocument = jsonpatch.applyPatch(emrData, diff);
          await global.medicalRecord.update(req.emrID, "$.Informasi", updateDocument.newDocument.Informasi);

          ElasticLoggerService().createLog(req, "/informasi/identitas-pasien", "OK");
          if (!res.writableEnded) {
            res.status(200).json({
              message: "OK",
            });
          }
        }
      }
      if (!emrData || (emrData && emrData === null)) {
        const errorMessage = "Patient data not found";

        ElasticLoggerService().createErrorLog(req, "/informasi/identitas-pasien", errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          });
        }
      }
    }
    if (!req.emrID || (req.emrID && req.emrID === "")) {
      const errorMessage = "EMR_ID not found";

      ElasticLoggerService().createErrorLog(req, "/informasi/identitas-pasien", errorMessage);
      if (!res.writableEnded) {
        res.status(500).json({
          message: errorMessage,
        });
      }
    }
  } catch (err) {
    ElasticLoggerService().createErrorLog(req, "/informasi/identitas-pasien", `${err}`);
    if (!res.writableEnded) {
      res.status(500).json({
        message: `${err}`,
      });
    }
  }
});

Information.route("/informasi/update-informasi-process").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.body && req.emrID) {
      const employeeProfile: any = await RBAC.getInstance().getUserProfile(req.token, req.body["id-petugas"]);
      if (employeeProfile) {
        const informationAllergy: IInformationAllergy = {
          Alergi: req.body.alergi ? req.body.alergi : "",
          Pengkajian_Keperawatan: {
            Alergi: req.body.alergi ?? '',
            Alergi_Select: req.body.alergi_select ?? [],
            Alergi_Radio: req.body.alergi_radio ?? '',
            Alergi_Lain: req.body.alergi_lain && req.body.alergi_lain === '1' ? '1' : '0',
            Alergi_Lain_Teks: req.body.alergi_lain_teks ?? '',
            RPT: req.body.rpt ?? '',
            RPT_Select: req.body.rpt_select ?? [],
            RPT_Radio: req.body.rpt_radio ?? '',
            RPT_Lain: req.body.rpt_lain && req.body.rpt_lain === '1' ? '1' : '0',
            RPT_Lain_Teks: req.body.rpt_lain_teks ?? '',
            RPO: req.body.rpo ?? '',
            RPO_Select: req.body.rpo_select ?? [],
            RPO_Radio: req.body.rpo_radio ?? '',
            RPO_Lain: req.body.rpo_lain && req.body.rpo_lain === '1' ? '1' : '0',
            RPO_Lain_Teks: req.body.rpo_lain_teks ?? '',
            KLL_Radio: req.body.kll_radio ?? '',
          },
          ID_Petugas: req.body["id-petugas"] ? req.body["id-petugas"] : "",
          Updated_At: moment().format("YYYY-MM-DD HH:mm:ss"),
          Updated_By: req.body["id-petugas"] ? req.body["id-petugas"] : "",
          Updated_By_Name: employeeProfile.nama ? employeeProfile.nama : "",
          Nama_Petugas: employeeProfile.nama ? employeeProfile.nama : "",
        };
        const emrData = await global.medicalRecord.get(req.emrID, ".");
        if (emrData && emrData !== null) {
          const information: IInformation = {
            Informasi: informationAllergy,
          };
          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData));
          if (newEmrData.Informasi && newEmrData !== null) {
            newEmrData.Informasi.Informasi = informationAllergy;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(req.emrID, "$.Informasi.Informasi", updateDocument.newDocument.Informasi.Informasi);
            ElasticLoggerService().createLog(req, "/informasi/informasi", "OK");
            if (!res.writableEnded) {
              res.status(200).json({
                message: "OK",
              });
            }
          } else {
            newEmrData.Informasi = information;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(req.emrID, "$.Informasi", updateDocument.newDocument.Informasi);
            ElasticLoggerService().createLog(req, "/informasi/informasi", "OK");
            if (!res.writableEnded) {
              res.status(200).json({
                message: "OK",
              });
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = "Patient data not found";
          ElasticLoggerService().createErrorLog(req, "/informasi/informasi", errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            });
          }
        }
      }
      if (!employeeProfile) {
        const errorMessage = "Employee data not found";
        ElasticLoggerService().createErrorLog(req, "/informasi/informasi", errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          });
        }
      }
    }
    if (!req.emrID || (req.emrID && req.emrID === "")) {
      const errorMessage = "EMR_ID not found";
      ElasticLoggerService().createErrorLog(req, "/informasi/informasi", errorMessage);
      if (!res.writableEnded) {
        res.status(500).json({
          message: errorMessage,
        });
      }
    }
  } catch (err) {
    ElasticLoggerService().createErrorLog(req, "/informasi/informasi", `${err}`);
    if (!res.writableEnded) {
      res.status(500).json({
        message: `${err}`,
      });
    }
  }
});

Information.route('/informasi/resume-medis')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien']
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Informasi');
      if (checkObject !== null && checkObject.includes('Resume_Medis')) {
        emrKeys.push('Informasi.Resume_Medis');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form: IFormResumeMedis = result['Informasi.Resume_Medis'] ? result['Informasi.Resume_Medis'] : {}

        form.TTD_Dokter = (form.TTD_Dokter && form.TTD_Dokter !== '' && isValidFile(form.TTD_Dokter)) ? await global.storage.signUrl(form.TTD_Dokter, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';

        const data = {
          EMR_ID: req.emrID ? req.emrID : '',
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          form,
        }
        if (!res.writableEnded) {
          res.status(200).json({
            message: 'OK',
            data,
          })
        }
      }
      if (!result || (result && result === null)) {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'Patient Data Not Found',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

Information.route('/informasi/resume-medis-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdateResumeMedis = req.body;
          const doctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost['id-dokter']}')]`)

          const jsonData = ResumeMedisForm.createFromJson(dataToPost);
          const redisJsonData: IResumeMedisForm = {
            ...jsonData,
            Nama_Dokter: doctor && Array.isArray(doctor) && doctor.length > 0 && doctor[0].Nama ? doctor[0].Nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
            Updated_By_Name: req.userProfile.nama ?? '',
          }

          const information: IInformation = {
            Resume_Medis: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Informasi && newEmrData.Informasi !== null) {
            newEmrData.Informasi.Resume_Medis = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Informasi.Resume_Medis',
              updateDocument.newDocument.Informasi.Resume_Medis,
            );
            ElasticLoggerService().createLog(req, '/informasi/resume-medis', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.Informasi = information;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Informasi', updateDocument.newDocument.Informasi);
            ElasticLoggerService().createLog(req, '/informasi/resume-medis', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/informasi/resume-medis', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/informasi/resume-medis', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/informasi/resume-medis', `${err}`);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

Information.route('/informasi/surat-pernyataan-bpjs-index')
  .get(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien']
    try {
      const checkObject = await global.medicalRecord.keys(req.query.emr_id, '.Informasi');
      if (checkObject !== null && checkObject.includes('Pernyataan_BPJS')) {
        emrKeys.push('Informasi.Pernyataan_BPJS');
      }
      const result = await global.medicalRecord.get(req.query.emr_id, emrKeys);
      if (result && result !== null) {
        const form: IPernyataanBPJS = result['Informasi.Pernyataan_BPJS'] ? result['Informasi.Pernyataan_BPJS'] : {}

        if (form.TTD_Pasien && form.TTD_Pasien !== '' && isValidFile(form.TTD_Pasien)) {
          form.TTD_Pasien = await global.storage.signUrl(form.TTD_Pasien, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Petugas && form.TTD_Petugas !== '' && isValidFile(form.TTD_Petugas)) {
          form.TTD_Petugas = await global.storage.signUrl(form.TTD_Petugas, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Saksi && form.TTD_Saksi !== '' && isValidFile(form.TTD_Saksi)) {
          form.TTD_Saksi = await global.storage.signUrl(form.TTD_Saksi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Wali && form.TTD_Wali !== '' && isValidFile(form.TTD_Wali)) {
          form.TTD_Wali = await global.storage.signUrl(form.TTD_Wali, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }

        const data = {
          EMR_ID: req.query.emr_id ? req.query.emr_id : '',
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          form,
        }
        if (!res.writableEnded) {
          res.status(200).json({
            message: 'OK',
            data,
          })
        }
      }
      if (!result || (result && result === null)) {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'Patient Data Not Found',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

Information.route('/informasi/surat-pernyataan-bpjs-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdatePernyataanBPJS = req.body;

          const jsonData = await PernyataanBPJS.createFromJson(dataToPost);
          const redisJsonData: IPernyataanBPJS = {
            ...jsonData,
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: req.userProfile.nama ?? '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
            Updated_By_Name: req.userProfile.nama ?? '',
          }

          const information: IInformation = {
            Pernyataan_BPJS: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Informasi && newEmrData.Informasi !== null) {
            newEmrData.Informasi.Pernyataan_BPJS = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Informasi.Pernyataan_BPJS',
              updateDocument.newDocument.Informasi.Pernyataan_BPJS,
            );
            ElasticLoggerService().createLog(req, '/informasi/surat-pernyataan-bpjs', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.Informasi = information;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Informasi', updateDocument.newDocument.Informasi);
            ElasticLoggerService().createLog(req, '/informasi/surat-pernyataan-bpjs', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/informasi/surat-pernyataan-bpjs', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/informasi/surat-pernyataan-bpjs', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/informasi/surat-pernyataan-bpjs', `${err}`);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

Information.route('/informasi/surat-pernyataan-umum-index')
  .get(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien']
    try {
      const checkObject = await global.medicalRecord.keys(req.query.emr_id, '.Informasi');
      if (checkObject !== null && checkObject.includes('Pernyataan_UMUM')) {
        emrKeys.push('Informasi.Pernyataan_UMUM');
      }
      const result = await global.medicalRecord.get(req.query.emr_id, emrKeys);
      if (result && result !== null) {
        const form: IPernyataanUMUM = result['Informasi.Pernyataan_UMUM'] ? result['Informasi.Pernyataan_UMUM'] : {}

        if (form.TTD_Pasien && form.TTD_Pasien !== '' && isValidFile(form.TTD_Pasien)) {
          form.TTD_Pasien = await global.storage.signUrl(form.TTD_Pasien, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Petugas && form.TTD_Petugas !== '' && isValidFile(form.TTD_Petugas)) {
          form.TTD_Petugas = await global.storage.signUrl(form.TTD_Petugas, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Saksi && form.TTD_Saksi !== '' && isValidFile(form.TTD_Saksi)) {
          form.TTD_Saksi = await global.storage.signUrl(form.TTD_Saksi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Wali && form.TTD_Wali !== '' && isValidFile(form.TTD_Wali)) {
          form.TTD_Wali = await global.storage.signUrl(form.TTD_Wali, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }

        const data = {
          EMR_ID: req.query.emr_id ? req.query.emr_id : '',
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          form,
        }
        if (!res.writableEnded) {
          res.status(200).json({
            message: 'OK',
            data,
          })
        }
      }
      if (!result || (result && result === null)) {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'Patient Data Not Found',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

Information.route('/informasi/surat-pernyataan-umum-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdatePernyataanUMUM = req.body;

          const jsonData = await PernyataanUMUM.createFromJson(dataToPost);
          const redisJsonData: IPernyataanUMUM = {
            ...jsonData,
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: req.userProfile.nama ?? '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
            Updated_By_Name: req.userProfile.nama ?? '',
          }

          console.log('22')

          const information: IInformation = {
            Pernyataan_UMUM: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Informasi && newEmrData.Informasi !== null) {
            console.log('44')
            newEmrData.Informasi.Pernyataan_UMUM = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Informasi.Pernyataan_UMUM',
              updateDocument.newDocument.Informasi.Pernyataan_UMUM,
            );
            ElasticLoggerService().createLog(req, '/informasi/surat-pernyataan-umum', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          } else {
            newEmrData.Informasi = information;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Informasi', updateDocument.newDocument.Informasi);
            ElasticLoggerService().createLog(req, '/informasi/surat-pernyataan-umum', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/informasi/surat-pernyataan-umum', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/informasi/surat-pernyataan-umum', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/informasi/surat-pernyataan-umum', `${err}`);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

export { Information };
