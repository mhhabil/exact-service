/* eslint-disable no-tabs */
import { Router, Request, Response, NextFunction } from "express";
const SIMRS = Router();
const axios = require("axios");
const timeout = require("connect-timeout");
import moment from "moment";
import * as jsonpatch from "fast-json-patch";
const debugEMR = require("debug")("emr");
import { ElasticLoggerService } from "./services";
import RBAC from "../../../services/rbac";
import qs from "qs";
import { UpdateTebusObatRanap } from "./interfaces/simrs/simrs.request";
const { CloudTasksClient } = require("@google-cloud/tasks");
const client = new CloudTasksClient();

SIMRS.route("/simrs/populate_data").get(RBAC.getInstance().isUserAuthenticated, async (req: Request, res: Response): Promise<void> => {
  await global.medicalRecord.populateData(req.token);
  if (!res.writableEnded) res.status(200).json({ message: "OK" });
});

SIMRS.route("/simrs/new").post(timeout("5s"), RBAC.getInstance().isUserAuthenticated, async (req: Request, res: Response): Promise<void> => {
  debugEMR(`requestBody: ${JSON.stringify(req.body)}`);
  let emrID: string = "";
  let responseMessage: string = "";

  console.log("req.body", req.body);
  const patientData = JSON.parse(req.body.pasien || "{}");
  const outPatient = JSON.parse(req.body.rawat_jalan || "{}");
  const inPatient = JSON.parse(req.body.rawat_inap || "{}");

  const branchCode = req.body.kode_cabang;
  const patientType = req.body.tipe_pasien;
  const serviceType = req.body.jenis_pelayanan;
  const medicalRecordNumber = req.body.nomor_mr;
  const serviceId = outPatient.No_Berobat || inPatient.ID_RawatInap;

  const noSep = outPatient.No_SEP || inPatient.No_SEP || "";

  let outPatientData: IRawatJalan = {};
  let inPatientData: IRawatInap = {};
  const informationData: IInformation = {};

  let checkInDate: string = "";
  let checkOutDate: string = "";
  let checkInTime: string = "";
  let checkOutTime: string = "";

  const searchMedicalRecord: ISearchMedicalRecordOptions = {
    Kode_Cabang: branchCode,
    Jenis_Pelayanan: serviceType,
    No_MR: medicalRecordNumber,
    Tipe_Pasien: patientType,
    ID_Pelayanan: serviceId,
    Options: {
      RETURN: ["$.ID_Pelayanan"],
    },
  };

  const visits = inPatient && inPatient.Visit && Array.isArray(inPatient.Visit) ? inPatient.Visit : [];
  const restructuredVisits = visits.map((item: any) => {
    return {
      ...item,
      ID_Dokter: item.ID_Dokter ? item.ID_Dokter.split('-').join('_') : '',
    }
  });

  if (outPatient.No_Berobat !== undefined) {
    outPatientData = {
      No_Berobat: outPatient.No_Berobat,
      Tgl_Berobat: outPatient.Tgl_Berobat,
      Jam_Kunjungan: outPatient.Jam_Kunjungan,
      ID_Dokter: outPatient.ID_Dokter.replace(/-/g, "_"),
      Nama_Dokter: outPatient.Nama_Dokter,
      No_Rujukan: outPatient.No_Rujukan,
      Asal_Rujukan: outPatient.Asal_Rujukan,
      Dokter_Merujuk: outPatient.Dokter_Merujuk,
      Penanganan: outPatient.Penanganan,
      Kasus: outPatient.Kasus,
      Gawat_Darurat: outPatient.GawatDarurat,
      Keterangan: outPatient.Keterangan,
      Nama_Paket_Operasi: outPatient.Nama_PaketOperasi,
      ID_Paket_Operasi: outPatient.ID_PaketOperasi,
      Jenis_Operasi: outPatient.Jenis_Operasi,
      ID_Tipe_Tagihan: outPatient.ID_TipeTag,
      Nama_Tipe_Tagihan: outPatient.Tipe_Tagihan,
      Batal_Berobat: outPatient.Batal_Berobat,
      Status_Bayar: outPatient.Status_Bayar,
      Tagihan_Pemeriksaan: outPatient.Tagihan_Pemeriksaan,
      Invoice_No: outPatient.Invoice_No || "",
      Cara_Masuk: outPatient.Cara_Masuk_String || "",
      Cara_Keluar: outPatient.Cara_Keluar_String || "",
      Sebab_Penyakit: outPatient.Sebab_Penyakit_String || "",
    };
    checkInDate = outPatient.Tgl_Berobat;
    checkInTime = outPatient.Jam_Kunjungan;
    checkOutDate = outPatient.Tgl_Berobat;
  }

  if (inPatient.ID_RawatInap !== undefined) {
    inPatientData = {
      ID_Rawat_Inap: inPatient.ID_RawatInap,
      Tipe_Pelayanan: inPatient.Tipe_Pelayanan,
      No_RawatInap: inPatient.No_RawatInap,
      Jam_Kunjungan: inPatient.Jam_Masuk,
      ID_Tipe_Tagihan: inPatient.ID_TipeTag,
      Nama_Tipe_Tagihan: inPatient.Nama_TipeTag,
      ID_Dokter: inPatient.ID_Dokter.replace(/-/g, "_"),
      Nama_Dokter: inPatient.Nama_Dokter,

      ID_Kelas_Kamar: inPatient.ID_KelasKamar,
      Nama_Kelas_Kamar: inPatient.Nama_KelasKamar,
      Tarif_Kamar: inPatient.Tarif,
      ID_Kamar: inPatient.ID_Kamar,
      Nama_Kamar: inPatient.Nama_Kamar,
      ID_Tempat_Tidur: inPatient.ID_TempatTidur,
      Nama_Tempat_Tidur: inPatient.Nama_TempatTidur,
      Tgl_Masuk: inPatient.Tgl_Masuk,
      Jam_Masuk: inPatient.Jam_Masuk,
      Tgl_Keluar: inPatient.Tgl_Keluar,
      Jam_Keluar: inPatient.Jam_Keluar,
      Batal_Rawat_Inap: inPatient.Batal_RawatInap,
      Bayar_Rawat_Inap: inPatient.Bayar_RawatInap,
      Diet: inPatient.Diet,
      Allergic: inPatient.Allergic,
      Diagnosa: inPatient.Diagnosa,
      Gawat_Darurat: inPatient.Gawat_Darurat ? 1 : 0,

      Cara_Masuk: inPatient.Cara_Masuk_String,
      Cara_Keluar: inPatient.Cara_Keluar_String,
      Sebab_Penyakit: inPatient.Sebab_Penyakit_String,

      Nama_Paket_Operasi: inPatient.Paket_Operasi,
      ID_Paket_Operasi: "",
      Jenis_Operasi: "",
      Daftar_Visit_Dokter: restructuredVisits ?? [],
    };
    checkInDate = inPatient.Tgl_Masuk;
    checkInTime = inPatient.Jam_Masuk;
    checkOutDate = inPatient.Tgl_Keluar;
    checkOutTime = inPatient.Jam_Keluar;
  }

  const patient: IPatient = {
    Nama: patientData.Nama.trim(),
    No_MR: medicalRecordNumber,
    No_BPJS: patientData.No_BPJS,
    No_HP: patientData.No_Hp.trim(),
    No_Telepon: patientData.No_Telp && patientData.No_Telp !== "" ? patientData.No_Telp.trim() : patientData.No_Hp ? patientData.No_Hp.trim() : "",
    Tempat_Lahir: patientData.Tempat_Lahir,
    Tgl_Lahir: patientData.Tgl_Lahir,
    Umur: global.medicalRecord.getAge(new Date(patientData.Tgl_Lahir)),
    Jenis_Kelamin: global.medicalRecord.getGenderName(patientData.J_Kelamin),
    Agama: global.medicalRecord.getReligionName(patientData.Agama),
    Status_Nikah: global.medicalRecord.getMaritalStatus(patientData.Status_Nikah),
    Pendidikan: global.medicalRecord.getEducationName(patientData.Pendidikan),
    Pekerjaan: patientData.Jabatan,
    Alamat: patientData.Alamat.trim(),
    Provinsi: await global.medicalRecord.getProvinceName(patientData.Kode_Propinsi),
    Kabupaten: await global.medicalRecord.getCityName(patientData.Kode_Propinsi, patientData.Kode_Kabupaten),
    Kecamatan: await global.medicalRecord.getDistrictName(patientData.Kode_Propinsi, patientData.Kode_Kabupaten, patientData.Kode_Kecamatan),
    Suku: patientData.Hubungan_Suku,
    Tgl_Daftar: patientData.Tgl_Daftar,
    NIK: patientData.NIK ?? '',
  };

  const patientGuardian: IPatientGuardian = {
    Hubungan: patientData.Hubungan_Status,
    Nama: patientData.Hubungan_Nama.trim(),
    Alamat: patientData.Hubungan_Alamat.trim(),
    No_Telepon: patientData.Hubungan_Telpon.trim(),
    Suku: patientData.Hubungan_Suku.trim(),
  };

  const medicalRecordData: IMedicalRecord = {
    Kode_Cabang: branchCode,
    Jenis_Pelayanan: serviceType,
    No_MR: medicalRecordNumber,
    Tipe_Pasien: patientType,
    ID_Pelayanan: serviceId.replace(/-/g, "_"),
    No_SEP: noSep,
    Tanggal_Masuk: moment.utc(`${checkInDate} ${checkInTime}:00`).unix(),
    Jam_Masuk: checkInTime,
    Tanggal_Keluar: checkOutDate !== "" ? moment.utc(`${checkOutDate} ${checkOutTime}:00`).unix() : 0,
    Jam_Keluar: checkOutTime,
    Pasien: patient,
    Wali: patientGuardian,
    Rawat_Jalan: outPatientData,
    Rawat_Inap: inPatientData,
    Informasi: informationData,
    Common: {
      CPPT: [],
    },
    Created_By: req.userId,
    Created_Date: moment()
      .utcOffset(await global.medicalRecord.getConfigValue(branchCode, "timezone"))
      .format("YYYY-MM-DD HH:mm:ss"),
  };

  try {
    const searchQuery = `\'@Kode_Cabang:${branchCode} @Jenis_Pelayanan:${serviceType} @No_MR:${medicalRecordNumber} @Tipe_Pasien:${patientType} @ID_Pelayanan:${serviceId.replace(/-/g, "_")}\'`;
    const medicalRecordExist = await global.medicalRecord.find(searchQuery, ["$"]);
    if (medicalRecordExist.total === 0) {
      try {
        responseMessage = "Data berhasil disimpan";
        emrID = await global.medicalRecord.new(branchCode, medicalRecordData);
        debugEMR(`Create EMR [Content]: ${JSON.stringify(medicalRecordData)}`);
        debugEMR(`Create EMR [ID]: ${emrID}`);
      } catch (err) {
        console.error(err);
        if (!res.writableEnded) res.status(500).json({
          message: "Internal server error",
        });
      }
    } else {
      emrID = medicalRecordExist.documents[0].id;
      const document = medicalRecordExist.documents[0].value;
      const diff = jsonpatch.compare(document, medicalRecordData);
      debugEMR(`Create EMR [ID]: ${diff}`);
      if (diff.length > 0) {
        var patch = [];
        for (var k = 0; k < diff.length; k++) {
          if (diff[k].op == "add" || diff[k].op == "replace") {
            patch.push(diff[k]);
          }
        }

        if (patch.length > 0) {
          const updateDocument = jsonpatch.applyPatch(document, patch);
          await global.medicalRecord.update(emrID, "$", updateDocument.newDocument);
        }
      }
      responseMessage = "Data berhasil diubah";
    }

    ElasticLoggerService().createLog(req, "/simrs/new", responseMessage);
    if (!res.writableEnded) res.status(200).json({
      message: responseMessage,
      emrID,
    });
  } catch (err) {
    ElasticLoggerService().createErrorLog(req, "/simrs/new", err);
    console.error(err);
  }

  //await global.medicalRecord.saveAll(medicalRecordData);
  //const result = await global.medicalRecord.loadAll('01FXAGGCFH0VEHJMG85PK0BNSM')
  /*
		const update = await global.medicalRecord.saveByPath("MedicalRecord:60A4A50DA2C144768776D69AA1D19702", "$.Pasien.Nama", "Syahfitri Kartika Lidya")
		//console.log(update)

		const refraksiOptisiData: IRefraksiOptisi = {
			PH: "",
			VA: "20/40",
			Add: "",
			False: "",
			Jagger: "",
			Schiotz: "",
			Non_Contact: "",
			Tanam_Lensa: ""
		}
		const updatePath = await global.medicalRecord.saveByPath("MedicalRecord:60A4A50DA2C144768776D69AA1D19702", ".RO.OS", refraksiOptisiData)
		console.log(updatePath)

		const getPath = await global.medicalRecord.getByPath("MedicalRecord:60A4A50DA2C144768776D69AA1D19702", ".RO.OS")
		console.log(getPath)

		const result = await global.medicalRecord.findAll({
			Kode_Cabang: medicalRecordData.Kode_Cabang,
			Jenis_Pelayanan: medicalRecordData.Jenis_Pelayanan,
			No_MR: medicalRecordData.No_MR,
			Options: {
				RETURN: req.body.path
			}
		})

		//Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 15*1000);
		//const response = await axios.get(req.body.url)
		/*axios.get(req.body.url)
		  .then(function (response:any) {
			console.log(response);
		  })
		  .catch(function (error:any) {
			console.log(error);
		  });*/
});

SIMRS.route('/simrs/replace-medical-record')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const branchCode = req.body.kode_cabang;
      const medicalRecordNumber = req.body.nomor_mr_lama;
      const newMedicalRecordNumber = req.body.nomor_mr_baru;
      const searchQuery = `\'@Kode_Cabang:${branchCode} @No_MR:${medicalRecordNumber}\'`;
      const medicalRecordExist = await global.medicalRecord.find(searchQuery, ["$"]);
      if (medicalRecordExist && medicalRecordExist.documents && Array.isArray(medicalRecordExist.documents) && medicalRecordExist.documents.length > 0) {
        for (let i = 0; i < medicalRecordExist.documents.length; i += 1) {
          const emrId = medicalRecordExist.documents[i].id;
          await global.medicalRecord.update(
            emrId,
            '$.No_MR',
            newMedicalRecordNumber,
          );
        }
        ElasticLoggerService().createLog(req, '/simrs/replace-medical-record', 'OK');
        if (!res.writableEnded) {
          res.status(200).json({
            message: 'Nomor MR berhasil diubah',
          })
        }
      } else {
        ElasticLoggerService().createLog(req, '/simrs/replace-medical-record', 'Pasien tidak ada')
        if (!res.writableEnded) {
          res.status(200).json({
            message: 'Pasien tidak ada',
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/simrs/replace-medical-record', err)
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        })
      }
    }
  });

SIMRS.route('/simrs/set-tanggal-keluar')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const outDate = req.body.tanggal_keluar;
      const outTime = req.body.waktu_keluar;
      const medicalRecordExist = await global.medicalRecord.findAll(req.emrParams);
      if (medicalRecordExist && medicalRecordExist !== null && medicalRecordExist.documents && Array.isArray(medicalRecordExist.documents) && medicalRecordExist.documents[0] && medicalRecordExist.documents[0].id) {
        const emrId = medicalRecordExist.documents[0].id;
        await global.medicalRecord.update(
          emrId,
          '$.Tanggal_Keluar',
          moment.utc(`${outDate} ${outTime}:00`).unix(),
        );
        await global.medicalRecord.update(
          emrId,
          '$.Jam_Keluar',
          outTime,
        );
        await global.medicalRecord.update(
          emrId,
          '$.Rawat_Inap.Tgl_Keluar',
          outDate,
        )
        await global.medicalRecord.update(
          emrId,
          '$.Rawat_Inap.Jam_Keluar',
          outTime,
        )
        if (!res.writableEnded) {
          res.status(200).json({
            message: 'OK',
          })
        }
      } else {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'No Data',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        })
      }
    }
  });

SIMRS.route('/simrs/transform-data')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const dataToPost = req.body;
    try {
      const searchQuery = `\'@Kode_Cabang:${dataToPost.company_code} @Tanggal_Masuk:[-inf +inf]\'`;
      const medicalRecordExist = await global.medicalRecord.find(searchQuery, {
        LIMIT: { from: 0, size: 10 },
        RETURN: ["$"],
      });

      const ttt = [];
      for (let i = 0; i < medicalRecordExist.documents.length; i += 1) {
        const serviceType = medicalRecordExist.documents[i].value.Jenis_Pelayanan;
        const uy = {
          emr_id: medicalRecordExist.documents[i].id,
          // data: medicalRecordExist.documents[i].value,
          tgl_berobat: serviceType === 'RawatJalan' ? medicalRecordExist.documents[i].value.Rawat_Jalan.Tgl_Berobat : medicalRecordExist.documents[i].value.Rawat_Inap.Tgl_Masuk,
        }
        ttt.push(uy);
      }
      res.status(200).json({
        message: 'OK',
        data: ttt,
      })
    } catch (err) {
      res.status(500).json({
        message: err,
      })
    }
  })

SIMRS.route("/simrs/set-batal").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const branchCode = req.body.kode_cabang;
    const patientType = req.body.tipe_pasien;
    const serviceType = req.body.jenis_pelayanan;
    const medicalRecordNumber = req.body.nomor_mr;
    const serviceId = req.body.id_pelayanan
    const searchQuery = `\'@Kode_Cabang:${branchCode} @Jenis_Pelayanan:${serviceType} @No_MR:${medicalRecordNumber} @Tipe_Pasien:${patientType} @ID_Pelayanan:${serviceId.replace(/-/g, "_")}\'`;
    const medicalRecordExist = await global.medicalRecord.find(searchQuery, ["$"]);
    if (medicalRecordExist && medicalRecordExist.total !== 0) {
      const emrId = medicalRecordExist.documents[0].id;
      await global.medicalRecord.delete(emrId, ".");

      ElasticLoggerService().createLog(req, "/simrs/set-batal", "OK");
      if (!res.writableEnded) {
        res.status(200).json({ message: "OK" });
      }
    } else {
      ElasticLoggerService().createLog(req, "/simrs/set-batal", "OK");
      if (!res.writableEnded) {
        res.status(200).json({ message: "No Data" });
      }
    }
  } catch (err) {
    ElasticLoggerService().createErrorLog(req, "/simrs/set-batal", err);
    if (!res.writableEnded) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
});

SIMRS.route("/simrs/tebus-obat")
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const waktu_tebus = req.body.waktu_tebus;
    const keterangan = req.body.keterangan || "";
    const daftar_obat = req.body.daftar_obat;
    const statusTebus = req.body.status_tebus ? req.body.status_tebus : "1";

    const daftarTebus = [];
    for (const obat of daftar_obat) {
      const resepObat: IResepObat = {
        Kode_Obat: obat.kode_obat,
        Nama_Obat: obat.nama_obat,
        ID_Satuan: obat.id_satuan,
        Nama_Satuan: obat.nama_satuan,
        ID_AturanPakai: obat.id_aturanpakai,
        Nama_AturanPakai: obat.nama_aturanpakai,
        Kode_AturanPakai: obat.kode_aturanpakai,
        Jumlah: obat.jumlah,
        Catatan: obat.catatan || "",
      };
      daftarTebus.push(resepObat);
    }

    const tebusObat: ITebusObat = {
      Waktu_Tebus: waktu_tebus,
      Daftar_Tebus: daftarTebus,
      Keterangan: keterangan,
      Status_Tebus: statusTebus,
    };
    const farmasi: IPharmacy = {
      Tebus_Obat: tebusObat,
    };

    try {
      const medicalRecordExist = await global.medicalRecord.findAll(req.emrParams);
      if (medicalRecordExist && medicalRecordExist !== null && medicalRecordExist.documents && Array.isArray(medicalRecordExist.documents) && medicalRecordExist.documents[0] && medicalRecordExist.documents[0].id) {
        const emrId = medicalRecordExist.documents[0].id;
        const emrData = await global.medicalRecord.get(emrId, '.')
        if (emrData && emrData !== null) {
          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData));
          if (newEmrData.Farmasi && newEmrData.Farmasi !== null) {
            newEmrData.Farmasi.Tebus_Obat = tebusObat;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              emrId,
              '$.Farmasi.Tebus_Obat',
              updateDocument.newDocument.Farmasi.Tebus_Obat,
            );
            if (!res.writableEnded) {
              ElasticLoggerService().createLog(req, '/simrs/tebus-obat', 'OK')
              res.status(200).json({ message: "OK" });
            }
          } else {
            newEmrData.Farmasi = farmasi;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(emrId, '$.Farmasi', updateDocument.newDocument.Farmasi);
            if (!res.writableEnded) {
              ElasticLoggerService().createLog(req, '/simrs/tebus-obat', 'OK')
              res.status(200).json({ message: "OK" });
            }
          }
          const payload = {
            emr_id: emrId,
          }
          global.messagingService.emit(`SOCKET-${emrData.Kode_Cabang}`, 'tebus-obat', payload)
        } else {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/simrs/tebus-obat', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      } else {
        if (!res.writableEnded) {
          ElasticLoggerService().createErrorLog(req, '/simrs/tebus-obat', 'EMR ID Tidak Ada')
          res.status(500).json({ message: "Daftar berobat ini tidak terdaftar di EMR" });
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        ElasticLoggerService().createErrorLog(req, '/simrs/tebus-obat', err);
        res.status(500).json({
          message: "Internal server error",
        });
      }
    }
  });

SIMRS.route('/simrs/tebus-obat-ranap')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const dataToPost = new UpdateTebusObatRanap(req.body);
      let responseMessage;
      const daftarTebus = [];
      for (const obat of dataToPost.daftar_obat) {
        const resepObat: IResepObat = {
          Kode_Obat: obat.kode_obat,
          Nama_Obat: obat.nama_obat,
          ID_Satuan: obat.id_satuan,
          Nama_Satuan: obat.nama_satuan,
          ID_AturanPakai: obat.id_aturanpakai,
          Nama_AturanPakai: obat.nama_aturanpakai,
          Kode_AturanPakai: obat.kode_aturanpakai,
          Jumlah: obat.jumlah,
          Catatan: obat.catatan || "",
        };
        daftarTebus.push(resepObat);
      }
      const tebusObat: ITebusObatRanap = {
        ID: dataToPost.no_berobat,
        ID_Berobat: dataToPost.no_berobat,
        Waktu_Tebus: dataToPost.waktu_tebus,
        Daftar_Tebus: daftarTebus,
        Keterangan: dataToPost.keterangan,
        Status_Tebus: dataToPost.status_tebus,
        Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
      };
      const medicalRecordExist = await global.medicalRecord.findAll(req.emrParams);
      if (medicalRecordExist && medicalRecordExist !== null && medicalRecordExist.documents && Array.isArray(medicalRecordExist.documents) && medicalRecordExist.documents[0] && medicalRecordExist.documents[0].id) {
        const emrId = medicalRecordExist.documents[0].id;
        const result = await global.medicalRecord.get(emrId, '.');
        if (result && result !== null) {
          const prescriptionList = result.Rawat_Inap.Daftar_Resep_Visit_Dokter ?? [];
          const existing = prescriptionList.find((item: any) => item.ID === dataToPost.no_berobat)
          const id = existing ? existing.ID : undefined;

          if (!id || id === '') {
            const redisJsonData = {
              ...tebusObat,
            }
            await global.medicalRecord.addTebusObatRanap(emrId, redisJsonData);
            responseMessage = 'Data berhasil ditambah';
          } else {
            const redisJsonData = {
              ...tebusObat,
            }
            const diff = jsonpatch.compare(existing, redisJsonData);
            const patch = [];
            for (let i = 0; i < diff.length; i++) {
              if (diff[i].op === "add" || diff[i].op === "replace") patch.push(diff[i]);
            }
            const updateDocument = jsonpatch.applyPatch(existing, patch);
            await global.medicalRecord.update(emrId, `$.Rawat_Inap.Daftar_Resep_Visit_Dokter[?(@.ID=="${id}")]`, updateDocument.newDocument);
            responseMessage = "Data berhasil diubah";
          }
          ElasticLoggerService().createHTTPResponse(req, res, 200, {
            message: responseMessage,
          });
          const payload = {
            emr_id: emrId,
          }
          global.messagingService.emit(`SOCKET-${result.Kode_Cabang}`, 'tebus-obat', payload)
        } else {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/simrs/tebus-obat-ranap', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      } else {
        if (!res.writableEnded) {
          ElasticLoggerService().createErrorLog(req, '/simrs/tebus-obat', 'EMR ID Tidak Ada')
          res.status(500).json({ message: "Daftar berobat ini tidak terdaftar di EMR" });
        }
      }
    } catch (err) {
      res.status(500).json({
        message: err,
      })
    }
  });

SIMRS.route('/simrs/set-dokter-ok')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const doctorId = req.body.id_dokter_ok.split('-').join('_');
    const result = await global.medicalRecord.get(`Employee:{${req.emrParams.Kode_Cabang}}:${req.emrParams.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${req.body.id_dokter_ok}')]`);
    const doctorName = result && Array.isArray(result) && result.length > 0 && result[0] ? result[0].Nama : '';
    const outpatient: IRawatJalan = {
      ID_Dokter_OK: doctorId,
      Nama_Dokter_OK: doctorName,
    }
    try {
      const medicalRecordExist = await global.medicalRecord.findAll(req.emrParams);
      if (medicalRecordExist && medicalRecordExist !== null && medicalRecordExist.documents && Array.isArray(medicalRecordExist.documents) && medicalRecordExist.documents[0] && medicalRecordExist.documents[0].id) {
        const emrId = medicalRecordExist.documents[0].id;
        const emrData = await global.medicalRecord.get(emrId, '.')
        if (emrData && emrData !== null) {
          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData));
          if (newEmrData.Rawat_Jalan && newEmrData.Rawat_Jalan !== null) {
            newEmrData.Rawat_Jalan.ID_Dokter_OK = doctorId;
            newEmrData.Rawat_Jalan.Nama_Dokter_OK = doctorName;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              emrId,
              '$.Rawat_Jalan.ID_Dokter_OK',
              updateDocument.newDocument.Rawat_Jalan.ID_Dokter_OK,
            );
            await global.medicalRecord.update(
              emrId,
              '$.Rawat_Jalan.Nama_Dokter_OK',
              updateDocument.newDocument.Rawat_Jalan.Nama_Dokter_OK,
            );
            if (!res.writableEnded) {
              ElasticLoggerService().createLog(req, '/simrs/set-dokter-ok', 'OK')
              res.status(200).json({ message: "OK" });
            }
          } else {
            newEmrData.Rawat_Jalan = outpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(emrId, '$.Rawat_Jalan', updateDocument.newDocument.Rawat_Jalan);
            if (!res.writableEnded) {
              ElasticLoggerService().createLog(req, '/simrs/set-dokter-ok', 'OK')
              res.status(200).json({ message: "OK" });
            }
          }
        } else {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/simrs/set-dokter-ok', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      } else {
        if (!res.writableEnded) {
          ElasticLoggerService().createErrorLog(req, '/simrs/set-dokter-ok', 'EMR ID Tidak Ada')
          res.status(500).json({ message: "Daftar berobat ini tidak terdaftar di EMR" });
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        ElasticLoggerService().createErrorLog(req, '/simrs/set-dokter-ok', err);
        res.status(500).json({
          message: "Internal server error",
        });
      }
    }
  })

SIMRS.route("/simrs/tebus-obat-ranap").post(RBAC.getInstance().isUserAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const waktu_tebus = req.body.waktu_tebus;
  const keterangan = req.body.keterangan;
  const daftar_obat = req.body.daftar_obat;
  if (!res.writableEnded) res.status(200).json({ message: "OK" });
});

SIMRS.route("/simrs/setImplant").post(RBAC.getInstance().isUserAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!res.writableEnded) res.status(200).json({ message: "OK" });
});

SIMRS.route("/simrs/anamnesa").post(RBAC.getInstance().isUserAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const dataToPost = req.body;
  try {
    if (dataToPost && dataToPost.company_code) {
      const result = await global.medicalRecord.get(`Anamnesa:{${dataToPost.company_code}}`);
      if (result && result !== null) {
        await global.medicalRecord.update(`Anamnesa:{${dataToPost.company_code}}`, "$", dataToPost.data);
        if (!res.writableEnded) res.status(200).json({
          message: `Berhasil update data master ${dataToPost.company_code}`,
          id: `Anamnesa:{${dataToPost.company_code}}`,
        });
      }
      if (!result || (result && result === null)) {
        const id = await global.medicalRecord.newAnamnesa(dataToPost.company_code, dataToPost.data);
        if (!res.writableEnded) res.status(200).json({
          message: `Berhasil tambah data master ${dataToPost.company_code}`,
          id,
        });
      }
    }
    if (!dataToPost || (dataToPost && !dataToPost.company_code)) {
      if (!res.writableEnded) res.status(500).json({
        message: "Request company_code tidak ada",
      });
    }
  } catch (err) {
    if (!res.writableEnded) res.status(500).json({
      message: err,
    });
  }
});

SIMRS.route("/simrs/aturan-pakai").post(RBAC.getInstance().isUserAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const dataToPost = req.body;
  try {
    if (dataToPost && dataToPost.company_code) {
      const result = await global.medicalRecord.get(`AturanPakai:{${dataToPost.company_code}}`);
      if (result && result !== null) {
        await global.medicalRecord.update(`AturanPakai:{${dataToPost.company_code}}`, "$", dataToPost.data);
        if (!res.writableEnded) res.status(200).json({
          message: `Berhasil update data master ${dataToPost.company_code}`,
          id: `AturanPakai:{${dataToPost.company_code}}`,
        });
      }
      if (!result || (result && result === null)) {
        const id = await global.medicalRecord.newAturanPakai(dataToPost.company_code, dataToPost.data);
        if (!res.writableEnded) res.status(200).json({
          message: `Berhasil tambah data master ${dataToPost.company_code}`,
          id,
        });
      }
    }
    if (!dataToPost || (dataToPost && dataToPost.company_code === null)) {
      if (!res.writableEnded) res.status(500).json({
        message: "Request company_code tidak ada",
      });
    }
  } catch (err) {
    if (!res.writableEnded) res.status(500).json({
      message: err,
    });
  }
});

SIMRS.route("/simrs/obat").post(RBAC.getInstance().isUserAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const dataToPost = req.body;
  try {
    debugEMR(`Create Employee [ID]: ${dataToPost}`);
    if (dataToPost && dataToPost.company_code) {
      const result = await global.medicalRecord.get(`Obat:{${dataToPost.company_code}}:${dataToPost.jenis_pelayanan}`);
      if (result && result !== null) {
        await global.medicalRecord.update(`Obat:{${dataToPost.company_code}}:${dataToPost.jenis_pelayanan}`, "$", dataToPost.data);
        if (!res.writableEnded) res.status(200).json({
          message: `Berhasil update data master ${dataToPost.company_code}`,
          id: `Obat:{${dataToPost.company_code}}:${dataToPost.jenis_pelayanan}`,
        });
      }
      if (!result || (result && result === null)) {
        const id = await global.medicalRecord.newObat(dataToPost.company_code, dataToPost.jenis_pelayanan, dataToPost.data);
        if (!res.writableEnded) res.status(200).json({
          message: `Berhasil tambah data master ${dataToPost.company_code}:${dataToPost.jenis_pelayanan}`,
          id,
        });
      }
    }
    if (!dataToPost || (dataToPost && dataToPost.company_code === null)) {
      if (!res.writableEnded) res.status(500).json({
        message: "Request company_code tidak ada",
      });
    }
  } catch (err) {
    if (!res.writableEnded) res.status(500).json({
      message: err,
    });
  }
});

SIMRS.route("/simrs/daftar-karyawan").post(RBAC.getInstance().isUserAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const dataToPost = req.body;
  try {
    if (dataToPost && dataToPost.company_code) {
      const result = await global.medicalRecord.get(`Employee:{${dataToPost.company_code}}:${dataToPost.jenis_pelayanan}`);
      if (result && result !== null) {
        const iii = await global.medicalRecord.update(`Employee:{${dataToPost.company_code}}:${dataToPost.jenis_pelayanan}`, "$", dataToPost.data);
        if (!res.writableEnded) res.status(200).json({
          message: `Berhasil update data master ${dataToPost.company_code}`,
          id: `Employee:{${dataToPost.company_code}}:${dataToPost.jenis_pelayanan}`,
        });
      }
      if (!result || (result && result === null)) {
        const id = await global.medicalRecord.newListKaryawan(dataToPost.company_code, dataToPost.jenis_pelayanan, dataToPost.data);
        if (!res.writableEnded) res.status(200).json({
          message: `Berhasil tambah data master ${dataToPost.company_code}:${dataToPost.jenis_pelayanan}`,
          id,
        });
      }
    }
    if (!dataToPost || (dataToPost && dataToPost.company_code === null)) {
      if (!res.writableEnded) res.status(500).json({
        message: "Request company_code tidak ada",
      });
    }
  } catch (err) {
    if (!res.writableEnded) res.status(500).json({
      message: err,
    });
  }
});

SIMRS.route("/simrs/obat-iol").post(RBAC.getInstance().isUserAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const dataToPost = req.body;
  try {
    if (dataToPost && dataToPost.company_code) {
      const result = await global.medicalRecord.get(`ObatIOL:{${dataToPost.company_code}}:${dataToPost.jenis_pelayanan}`);
      if (result && result !== null) {
        const iii = await global.medicalRecord.update(`ObatIOL:{${dataToPost.company_code}}:${dataToPost.jenis_pelayanan}`, "$", dataToPost.data);

        if (!res.writableEnded) res.status(200).json({
          message: `Berhasil update data master ${dataToPost.company_code}`,
          id: `ObatIOL:{${dataToPost.company_code}}:${dataToPost.jenis_pelayanan}`,
        });
      }
      if (!result || (result && result === null)) {
        const id = await global.medicalRecord.newObatIol(dataToPost.company_code, dataToPost.jenis_pelayanan, dataToPost.data);
        if (!res.writableEnded) res.status(200).json({
          message: `Berhasil tambah data master ${dataToPost.company_code}:${dataToPost.jenis_pelayanan}`,
          id,
        });
      }
    }
    if (!dataToPost || (dataToPost && dataToPost.company_code === null)) {
      if (!res.writableEnded) res.status(500).json({
        message: "Request company_code tidak ada",
      });
    }
  } catch (err) {
    if (!res.writableEnded) res.status(500).json({
      message: err,
    });
  }
});

SIMRS.route('/simrs/meds-package')
  .post(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const dataToPost = req.body;
    try {
      if (dataToPost && dataToPost.company_code) {
        const result = await global.medicalRecord.get(`PaketObat:{${dataToPost.company_code}}`);
        if (result && result !== null) {
          const iii = await global.medicalRecord.update(`PaketObat:{${dataToPost.company_code}}`, "$", dataToPost.data);

          if (!res.writableEnded) res.status(200).json({
            message: `Berhasil update data master ${dataToPost.company_code}`,
            id: `PaketObat:{${dataToPost.company_code}}`,
          });
        }
        if (!result || (result && result === null)) {
          const id = await global.medicalRecord.newPaketObat(dataToPost.company_code, dataToPost.data);
          if (!res.writableEnded) res.status(200).json({
            message: `Berhasil tambah data master ${dataToPost.company_code}`,
            id,
          });
        }
      }
      if (!dataToPost || (dataToPost && dataToPost.company_code === null)) {
        if (!res.writableEnded) res.status(500).json({
          message: "Request company_code tidak ada",
        });
      }
    } catch (err) {
      if (!res.writableEnded) res.status(500).json({
        message: err,
      });
    }
  })

SIMRS.route("/simrs/stations").post(RBAC.getInstance().isUserAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const dataToPost: IQueue = req.body;
  try {
    if (dataToPost && dataToPost.company_code) {
      const result = await global.medicalRecord.get(`Queue:{${dataToPost.company_code}}`);
      if (result && result !== null) {
        await global.medicalRecord.update(`Queue:{${dataToPost.company_code}}`, "$", dataToPost);
        if (!res.writableEnded) res.status(200).json({
          message: `Berhasil update data master ${dataToPost.company_code}`,
          id: `Queue:{${dataToPost.company_code}}`,
        });
      }
      if (!result || (result && result === null)) {
        const id = await global.medicalRecord.newQueue(dataToPost.company_code, dataToPost);
        if (!res.writableEnded) res.status(200).json({
          message: `Berhasil tambah data master ${dataToPost.company_code}`,
          id,
        });
      }
    }
    if (!dataToPost || (dataToPost && !dataToPost.company_code)) {
      if (!res.writableEnded) res.status(500).json({
        message: "Request company_code tidak ada",
      });
    }
  } catch (err) {
    if (!res.writableEnded) res.status(500).json({
      message: err,
    });
  }
});

SIMRS.route('/simrs/rooms')
  .post(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
        interface IRequest {
            company_code: string;
            data: any;
        }
        const dataToPost: IRequest = req.body;
        try {
          if (dataToPost && dataToPost.company_code) {
            const result = await global.medicalRecord.get(`Rooms:{${dataToPost.company_code}}`);
            if (result && result !== null) {
              await global.medicalRecord.update(`Rooms:{${dataToPost.company_code}}`, "$", dataToPost.data);
              if (!res.writableEnded) {
                res.status(200).json({
                  message: `Berhasil update data master ${dataToPost.company_code}`,
                  id: `Rooms:{${dataToPost.company_code}}`,
                });
              }
            }
            if (!result || (result && result === null)) {
              const id = await global.medicalRecord.newRooms(dataToPost.company_code, dataToPost.data);
              if (!res.writableEnded) {
                res.status(200).json({
                  message: `Berhasil tambah data master ${dataToPost.company_code}`,
                  id,
                })
              }
            }
          }
          if (!dataToPost || (dataToPost && !dataToPost.company_code)) {
            if (!res.writableEnded) {
              res.status(500).json({
                message: 'Request company_code tidak ada',
              });
            }
          }
        } catch (err) {
          if (!res.writableEnded) {
            res.status(500).json({
              message: err,
            })
          }
        }
  })

SIMRS.route('/simrs/i-care-company')
  .get(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const dataToPost = req.query;
      const companyCode = dataToPost.company_code;
      const companies = await global.medicalRecord.get('ICare')
      if (companies && companies !== null) {
        const company = companies.find((item: string) => item === companyCode);
        if (!res.writableEnded) {
          res.status(200).json({
            isICare: !!(company),
          })
        }
      } else {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'No Data',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        })
      }
    }
  });

export { SIMRS };
