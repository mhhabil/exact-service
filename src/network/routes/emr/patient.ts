/* eslint-disable eqeqeq */
import { Router, Request, Response, NextFunction } from "express";
import { AggregateSteps, AggregateGroupByReducers } from "redis";
import { IListDaftarBerobatRequest } from "./interfaces/patient.model";
const jp = require("jsonpath");
const { JSONPath } = require("jsonpath-plus");
import RBAC from "../../../services/rbac";
import { getHandling } from "./helpers/app.helper";
const moment = require("moment");
const Patient = Router();

Patient.route("/pasien/list-pasien").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const isDocter = req.body.isDokter || 0;
  const isRM = req.body.isRM || 0;
  const isOther = req.body.isOther || 0;
  const limit = req.body.limit || 10;
  const offset = req.body.offset || 0;
  const startDate = (req.body.tgl_mulai && (isRM || isOther) ? req.body.tgl_mulai : req.body.tgl_mulai) + " 00:00:00";
  const endDate = (req.body.tgl_selesai && isRM ? req.body.tgl_selesai : req.body.tgl_selesai) + " 23:59:00";
  const search = req.body.search || "";
  const docterId = isDocter ? req.userId.split("-").join("_") : null;
  let searchParam = "";
  if (search !== "") searchParam = `(@No_MR:*${search}*)|(@Nama_Pasien:*${search}*)`;
  if (req.emrParams.Tipe_Pasien != "") searchParam += ` @Tipe_Pasien:${req.emrParams.Tipe_Pasien}`;

  if (isDocter && !isRM && !isOther) {
    searchParam += ` (@Rawat_Jalan_ID_Dokter:${docterId})|(@Rawat_Inap_ID_Dokter:${docterId})|(@Rawat_Jalan_ID_Dokter_OK:${docterId})|(@ID_Dokter_Visit:${docterId})`;
  }
  const searchQuery = `\'${searchParam} @Kode_Cabang:${req.emrParams.Kode_Cabang} (@Tanggal_Masuk:[${moment.utc(startDate).unix()} ${moment.utc(endDate).unix()}]|@Tanggal_Keluar:[-2208988800, -2208988800])\'`;
  const result = await global.medicalRecord.aggregate(searchQuery, {
    STEPS: [
      {
        type: AggregateSteps.GROUPBY,
        properties: ["@Kode_Cabang", "@No_MR"],
        REDUCE: [
          {
            type: AggregateGroupByReducers.FIRST_VALUE,
            property: "$.Tipe_Pasien",
            BY: {
              property: "$.Tanggal_Masuk",
              direction: "DESC",
            },
            AS: "Tipe_Pasien",
          },
          {
            type: AggregateGroupByReducers.FIRST_VALUE,
            property: "$.Jam_Masuk",
            BY: {
              property: "$.Tanggal_Masuk",
              direction: "DESC",
            },
            AS: "Jam_Masuk",
          },
          {
            type: AggregateGroupByReducers.FIRST_VALUE,
            property: "$.Tanggal_Masuk",
            BY: {
              property: "$.Tanggal_Masuk",
              direction: "DESC",
            },
            AS: "Tanggal_Masuk",
          },
          {
            type: AggregateGroupByReducers.FIRST_VALUE,
            property: "$.Pasien",
            BY: {
              property: "$.Tanggal_Masuk",
              direction: "DESC",
            },
            AS: "Pasien",
          },
          {
            type: AggregateGroupByReducers.FIRST_VALUE,
            property: "$.Rawat_Jalan.Penanganan",
            BY: {
              property: "$.Tanggal_Masuk",
              direction: "DESC",
            },
            AS: "Rawat_Jalan.Penanganan",
          },
          {
            type: AggregateGroupByReducers.FIRST_VALUE,
            property: "$.Created_Date",
            BY: {
              property: "$.Tanggal_Masuk",
              direction: "DESC",
            },
            AS: "Created_Date",
          },
          {
            type: AggregateGroupByReducers.FIRST_VALUE,
            property: `$.Common.CPPT[?(@.Unit=="RawatJalan"&&@.Is_Form_Dokter==1&&@.Deleted==0)].ID`,
            BY: {
              property: "$.Tanggal_Masuk",
              direction: "DESC",
            },
            AS: "CPPT.ID",
          },
        ],
      },
      {
        type: AggregateSteps.SORTBY,
        BY: {
          BY: "@Tanggal_Masuk",
          DIRECTION: "DESC",
        },
      },
      {
        type: AggregateSteps.LIMIT,
        from: offset,
        size: limit,
      },
    ],
  });

  const rows: any = [];
  const total = result.total;
  const totalFiltered = result.results.length;
  let isCpptDokter: boolean = false;
  for (let i = 0; i < totalFiltered; i++) {
    if (result.results[i] != null) {
      isCpptDokter = false;
      if (moment.unix(parseInt(result.results[i]["Tanggal_Masuk"])).format("YYYY-MM-DD") == moment().format("YYYY-MM-DD")) {
        if (result.results[i]["CPPT.ID"] != null) {
          isCpptDokter = true;
        }
      }

      rows.push({
        Kode_Cabang: result.results[i]["Kode_Cabang"],
        No_MR: result.results[i]["No_MR"],
        Tgl_Berobat: moment.unix(parseInt(result.results[i]["Tanggal_Masuk"])).format("YYYY-MM-DD"),
        Jam_Kunjungan: result.results[i]["Jam_Masuk"],
        Pasien: JSON.parse(result.results[i]["Pasien"]),
        Tipe_Pasien: result.results[i]["Tipe_Pasien"],
        Penanganan: global.medicalRecord.getHandling(result.results[i]["Rawat_Jalan.Penanganan"]),
        Created_Date: result.results[i]["Created_Date"],
        isCpptDokter,
      });

    }
  }

  const output = {
    total,
    totalFiltered,
    records: rows,
  };
  if (!res.writableEnded) {
    res.status(200).json({
      message: "OK",
      data: output,
    })
  }
});

Patient.route('/pasien/list-mr')
  .get(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const limit = req.query.limit ?? 25;
      const offset = req.query.offset ?? 0;
      const branchCode = req.query.branch_code;
      const search = req.query.search ?? "";
      let searchParam = "";
      if (search !== "") searchParam = `(@No_MR:*${search}*)|(@Nama_Pasien:*${search}*)`;
      const searchQuery = `\'${searchParam} @Kode_Cabang:${branchCode}\'`;
      const result = await global.medicalRecord.aggregate(searchQuery, {
        STEPS: [
          {
            type: AggregateSteps.GROUPBY,
            properties: ["@Kode_Cabang", "@No_MR"],
            REDUCE: [
              {
                type: AggregateGroupByReducers.FIRST_VALUE,
                property: "$.Tipe_Pasien",
                BY: {
                  property: "$.Tanggal_Masuk",
                  direction: "DESC",
                },
                AS: "Tipe_Pasien",
              },
              {
                type: AggregateGroupByReducers.FIRST_VALUE,
                property: "$.Jam_Masuk",
                BY: {
                  property: "$.Tanggal_Masuk",
                  direction: "DESC",
                },
                AS: "Jam_Masuk",
              },
              {
                type: AggregateGroupByReducers.FIRST_VALUE,
                property: "$.Tanggal_Masuk",
                BY: {
                  property: "$.Tanggal_Masuk",
                  direction: "DESC",
                },
                AS: "Tanggal_Masuk",
              },
              {
                type: AggregateGroupByReducers.FIRST_VALUE,
                property: "$.Pasien",
                BY: {
                  property: "$.Tanggal_Masuk",
                  direction: "DESC",
                },
                AS: "Pasien",
              },
              {
                type: AggregateGroupByReducers.FIRST_VALUE,
                property: "$.Rawat_Jalan.Penanganan",
                BY: {
                  property: "$.Tanggal_Masuk",
                  direction: "DESC",
                },
                AS: "Rawat_Jalan.Penanganan",
              },
              {
                type: AggregateGroupByReducers.FIRST_VALUE,
                property: "$.Created_Date",
                BY: {
                  property: "$.Tanggal_Masuk",
                  direction: "DESC",
                },
                AS: "Created_Date",
              },
            ],
          },
          {
            type: AggregateSteps.SORTBY,
            BY: {
              BY: "@Tanggal_Masuk",
              DIRECTION: "DESC",
            },
          },
          {
            type: AggregateSteps.LIMIT,
            from: offset,
            size: limit,
          },
        ],
      });

      const rows: any = [];
      const total = result.total;
      const totalFiltered = result.results.length;
      for (let i = 0; i < totalFiltered; i++) {
        if (result.results[i] != null) {
          rows.push({
            No_MR: result.results[i]["No_MR"],
            Pasien: JSON.parse(result.results[i]["Pasien"]),
          });
        }
      }

      const output = {
        total,
        totalFiltered,
        records: rows,
      };
      if (!res.writableEnded) {
        res.status(200).json({
          message: "OK",
          data: output,
        })
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        })
      }
    }
  });

Patient.route("/pasien/list-berobat").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const searchQuery = `\'@Kode_Cabang:${req.emrParams.Kode_Cabang} @No_MR:${req.emrParams.No_MR}\'`;
  const result = await global.medicalRecord.find(searchQuery, {
    SORTBY: { BY: "SORTBY_Tanggal_Masuk", DIRECTION: "DESC" },
    LIMIT: { from: 0, size: 10000 },
    RETURN: ["$.Kode_Cabang", "$.No_MR", "$.No_SEP", "$.Tanggal_Masuk", "$.Jam_Masuk", "$.Tipe_Pasien", "$.Jenis_Pelayanan", "$.ID_Pelayanan", "$.Created_Date", "$.Pasien", "$.Is_Batal", "$.Rawat_Jalan.ID_Dokter", "$.Rawat_Jalan.Penanganan", "$.Rawat_Jalan.Nama_Dokter", "$.Rawat_Jalan.Asal_Rujukan", "$.Rawat_Inap.ID_Dokter", "$.Rawat_Jalan.Nama_Tipe_Tagihan", "$.Rawat_Inap.Nama_Tipe_Tagihan", "$.Rawat_Inap.Nama_Dokter", "$.Wali", `$.Common.CPPT[?(@.Unit=="RawatJalan"&&@.Is_Form_Dokter==1&&@.Deleted==0)].ID`],
  });

  const rows: Array<any> = [];
  let isCpptDokter: boolean = false;
  for (let i = 0; i < result.total; i++) {
    isCpptDokter = false;
    if (moment.unix(parseInt(result.documents[i].value["$.Tanggal_Masuk"])).format("YYYY-MM-DD") == moment().format("YYYY-MM-DD")) {
      if (result.documents[i].value[`$.Common.CPPT[?(@.Unit=="RawatJalan"&&@.Is_Form_Dokter==1&&@.Deleted==0)].ID`] != null) {
        isCpptDokter = true;
      }
    }
    const patient = JSON.parse(result.documents[i].value["$.Pasien"]);
    const birthDate = patient.Tgl_Lahir;
    rows.push({
      EMR_ID: result.documents[i].id,
      Kode_Cabang: result.documents[i].value["$.Kode_Cabang"],
      No_MR: result.documents[i].value["$.No_MR"],
      No_SEP: result.documents[i].value["$.No_SEP"],
      ID_Pelayanan: result.documents[i].value["$.ID_Pelayanan"].replace(/_/g, "-"),
      Tipe_Pasien: result.documents[i].value["$.Tipe_Pasien"],
      Jenis_Pelayanan: result.documents[i].value["$.Jenis_Pelayanan"],
      Tgl_Berobat: moment.unix(parseInt(result.documents[i].value["$.Tanggal_Masuk"])).format("YYYY-MM-DD"),
      Jam_Kunjungan: result.documents[i].value["$.Jam_Masuk"],
      Tgl_Jam_Berobat: `${moment.unix(parseInt(result.documents[i].value["$.Tanggal_Masuk"])).format("YYYY-MM-DD")} ${result.documents[i].value["$.Jam_Masuk"]}`,
      Pasien: {
        ...JSON.parse(result.documents[i].value["$.Pasien"]),
        Umur_Lengkap: global.medicalRecord.getFullAge(new Date(birthDate)),
      },
      Is_Batal: result.documents[i].value["$.Is_Batal"],
      ID_Dokter: (result.documents[i].value["$.Jenis_Pelayanan"] == "RawatJalan" ? result.documents[i].value["$.Rawat_Jalan.ID_Dokter"] : result.documents[i].value["$.Rawat_Inap.ID_Dokter"]).replace(/_/g, "-"),
      Nama_Dokter: result.documents[i].value["$.Jenis_Pelayanan"] == "RawatJalan" ? result.documents[i].value["$.Rawat_Jalan.Nama_Dokter"] : result.documents[i].value["$.Rawat_Inap.Nama_Dokter"],
      Created_Date: result.documents[i].value["$.Created_Date"],
      Wali: result.documents && result.documents[i] && result.documents[i].value["$.Wali"] ? JSON.parse(result.documents[i].value["$.Wali"]) : {},
      isCpptDokter,
      Penanganan: (result.documents[i].value['$.Jenis_Pelayanan'] === 'RawatJalan') ? getHandling(result.documents[i].value['$.Rawat_Jalan.Penanganan']) : '-',
      Asal_Rujukan: (result.documents[i].value["$.Jenis_Pelayanan"] == "RawatJalan") ? result.documents[i].value["$.Rawat_Jalan.Asal_Rujukan"] : '',
      Nama_Tipe_Tagihan: (result.documents[i].value["$.Jenis_Pelayanan"] == "RawatJalan") ? result.documents[i].value["$.Rawat_Jalan.Nama_Tipe_Tagihan"] : (result.documents[i].value["$.Jenis_Pelayanan"] == "RawatInap") ? result.documents[i].value["$.Rawat_Inap.Nama_Tipe_Tagihan"] : '',
    });
  }
  if (!res.writableEnded) {
    res.status(200).json({ message: "OK", data: rows });
  }
});

Patient.route("/pasien/last-treatment").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.body) {
      const searchQuery = `\'@Kode_Cabang:${req.emrParams.Kode_Cabang} @No_MR:${req.emrParams.No_MR}\'`;
      const result = await global.medicalRecord.find(searchQuery, {
        SORTBY: { BY: "SORTBY_Tanggal_Masuk", DIRECTION: "DESC" },
        LIMIT: { from: 0, size: 1 },
        RETURN: ["$.Kode_Cabang", "$.No_MR", "$.No_SEP", "$.Tanggal_Masuk", "$.Jam_Masuk", "$.Tipe_Pasien", "$.Jenis_Pelayanan", "$.ID_Pelayanan", "$.Created_Date", "$.Pasien", "$.Is_Batal", "$.Rawat_Jalan.ID_Dokter", "$.Rawat_Jalan.Penanganan", "$.Rawat_Jalan.Nama_Dokter", "$.Rawat_Jalan.Asal_Rujukan", "$.Rawat_Jalan.Nama_Tipe_Tagihan", "$.Rawat_Inap.Nama_Tipe_Tagihan", "$.Rawat_Inap.ID_Dokter", "$.Rawat_Inap.Nama_Dokter", "$.Wali"],
      });
      const patient = JSON.parse(result.documents[0].value["$.Pasien"]);
      const birthDate = patient.Tgl_Lahir;
      const lastTreatment = {
        EMR_ID: result.documents[0].id,
        Kode_Cabang: result.documents[0].value["$.Kode_Cabang"],
        No_MR: result.documents[0].value["$.No_MR"],
        No_SEP: result.documents[0].value["$.No_SEP"],
        ID_Pelayanan: result.documents[0].value["$.ID_Pelayanan"].replace(/_/g, "-"),
        Tipe_Pasien: result.documents[0].value["$.Tipe_Pasien"],
        Jenis_Pelayanan: result.documents[0].value["$.Jenis_Pelayanan"],
        Tgl_Berobat: moment.unix(parseInt(result.documents[0].value["$.Tanggal_Masuk"])).format("YYYY-MM-DD"),
        Jam_Kunjungan: result.documents[0].value["$.Jam_Masuk"],
        Tgl_Jam_Berobat: `${moment.unix(parseInt(result.documents[0].value["$.Tanggal_Masuk"])).format("YYYY-MM-DD")} ${result.documents[0].value["$.Jam_Masuk"]}`,
        Pasien: {
          ...JSON.parse(result.documents[0].value["$.Pasien"]),
          Umur_Lengkap: global.medicalRecord.getFullAge(new Date(birthDate)),
        },
        Is_Batal: result.documents[0].value["$.Is_Batal"],
        ID_Dokter: (result.documents[0].value["$.Jenis_Pelayanan"] == "RawatJalan" ? result.documents[0].value["$.Rawat_Jalan.ID_Dokter"] : result.documents[0].value["$.Rawat_Inap.ID_Dokter"]).replace(/_/g, "-"),
        Nama_Dokter: result.documents[0].value["$.Jenis_Pelayanan"] == "RawatJalan" ? result.documents[0].value["$.Rawat_Jalan.Nama_Dokter"] : result.documents[0].value["$.Rawat_Inap.Nama_Dokter"],
        Created_Date: result.documents[0].value["$.Created_Date"],
        Wali: result.documents && result.documents[0] && result.documents[0].value["$.Wali"] ? JSON.parse(result.documents[0].value["$.Wali"]) : {},
        Penanganan: (result.documents[0].value['$.Jenis_Pelayanan'] === 'RawatJalan') ? getHandling(result.documents[0].value['$.Rawat_Jalan.Penanganan']) : '-',
        Asal_Rujukan: (result.documents[0].value["$.Jenis_Pelayanan"] == "RawatJalan") ? result.documents[0].value["$.Rawat_Jalan.Asal_Rujukan"] : '',
        Nama_Tipe_Tagihan: (result.documents[0].value["$.Jenis_Pelayanan"] == "RawatJalan") ? result.documents[0].value["$.Rawat_Jalan.Nama_Tipe_Tagihan"] : (result.documents[0].value["$.Jenis_Pelayanan"] == "RawatInap") ? result.documents[0].value["$.Rawat_Inap.Nama_Tipe_Tagihan"] : '',
      };

      if (!res.writableEnded) {
        res.status(200).json({
          message: "OK",
          data: lastTreatment,
        });
      }
    }
  } catch (err) {
    console.error(err)
    if (!res.writableEnded) {
      res.status(500).json({
        error: err,
      });
    }
  }
});

Patient.route("/pasien/list-daftar-berobat").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const params: IListDaftarBerobatRequest = {
    limit: req.body && req.body.limit ? req.body.limit : 10,
    offset: req.body && req.body.offset ? req.body.offset : 0,
    company_code: req.body && req.body.company_code ? req.body.company_code : "",
    start_date: req.body && req.body.tgl_awal ? req.body.tgl_awal : "",
    end_date: req.body && req.body.tgl_akhir ? req.body.tgl_akhir : "",
    doctor_id: req.body && req.body.id_dokter ? req.body.id_dokter : "",
    search: req.body && req.body.search ? req.body.search : "",
    search_regex: req.body && req.body.search_regex ? req.body.search_regex : "",
  };

  let searchParam = "";
  if (params.search_regex !== "") searchParam = `(@No_MR:${params.search_regex}*)|(@Nama_Pasien:${params.search_regex}*)`;

  if (req.emrParams.Tipe_Pasien !== "") searchParam += ` @Tipe_Pasien:${req.emrParams.Tipe_Pasien}`;
});

Patient.route("/pasien/alergi")
  .get(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const emrKeys: string[] = ["Kode_Cabang", 'No_MR'];
      const checkObject = await global.medicalRecord.keys(req.query.emr_id, ".Informasi");
      if (checkObject !== null && checkObject.includes("Informasi")) {
        emrKeys.push("Informasi.Informasi");
      }
      const result = await global.medicalRecord.get(req.query.emr_id, emrKeys);
      if (result && result !== null && ((result.Alergi && result.Alergi !== "") || (result.Pengkajian_Keperawatan))) {
        if (!res.writableEnded) {
          res.status(200).json({
            message: "OK",
            data: result ? result : {},
          });
        }
      }
      if (result && result !== null && ((!result.Alergi || result.Alergi === "") || (!result.Pengkajian_Keperawatan))) {
        const searchQuery = `\'@Kode_Cabang:${result.Kode_Cabang} @No_MR:${result.No_MR}\'`;
        const queryResult = await global.medicalRecord.find(searchQuery, {
          SORTBY: { BY: "SORTBY_Tanggal_Masuk", DIRECTION: "DESC" },
          LIMIT: { from: 0, size: 100 },
          RETURN: ["$.Kode_Cabang", "$.No_MR", "$.No_SEP", "$.Tanggal_Masuk", "$.Jam_Masuk", "$.Tipe_Pasien", "$.Jenis_Pelayanan", "$.ID_Pelayanan", "$.Created_Date", "$.Pasien", "$.Is_Batal", "$.Informasi.Informasi"],
        });
        const treatments = queryResult.documents;
        const isInformasi = treatments.find((val: any) => Object.keys(val.value).includes("$.Informasi.Informasi"));
        const allergy = isInformasi ? JSON.parse(isInformasi.value["$.Informasi.Informasi"]) : {};
        if (!res.writableEnded) {
          res.status(200).json({
            message: "OK",
            data: allergy,
          });
        }
      }
      if (!result || (result && result === null)) {
        if (!res.writableEnded) {
          res.status(500).json({
            message: "Patient data not found",
          });
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        });
      }
    }
});

Patient.route("/pasien/detail").post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const emrKeys = ["ID_Pelayanan", "Jenis_Pelayanan", "Pasien", "Wali", "No_MR", "Rawat_Inap", "Rawat_Jalan", "Tanggal_Masuk", "Jam_Masuk"];
    if (req && req.emrID) {
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const data = {
          emr_id: req.emrID,
          nomor_mr: result.No_MR,
          id_pelayanan: result.ID_Pelayanan,
          jenis_pelayanan: result.Jenis_Pelayanan,
          tipe_pasien: result.Tipe_Pasien,
          kode_cabang: result.Kode_Cabang,
          no_sep: result.No_SEP,
          tanggal_masuk: result.Tanggal_Masuk,
          jam_masuk: result.Jam_Masuk,
          tanggal_keluar: result.Tanggal_Keluar,
          jam_keluar: result.Jam_Keluar,
          pasien: result.Pasien,
          wali: result.Wali,
          rawat_jalan: result.Rawat_Jalan,
          rawat_inap: result.Rawat_Inap,
          created_at: result.Created_At,
          created_by: result.Created_By,
        };
        if (!res.writableEnded) {
          res.status(200).json({
            message: "OK",
            data,
          });
        }
      }
    }
  } catch (err) {}
});

Patient.route('/pasien/list-pasien-konsul')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const limit = req.body.limit ?? 10;
    const offset = req.body.offset ?? 0;
    const search = req.body.search || "";
    let searchParam = "";
    const noRM = search;
    let searchNoRM = "";
    if (noRM.length < 10) {
      searchNoRM += `(${  String(noRM).padStart(10, '0')  }|`;
      for (let i = 0, n = 10 - noRM.length; i < n; i++) {
        searchNoRM +=  `${String(noRM).padStart(10 - i - 1, '0')  }*|`;
      }
      searchNoRM = searchNoRM.substring(0, searchNoRM.length - 1)
      searchNoRM += ")"
    } else {
      searchNoRM = noRM;
    }
    if (search !== "") {
      searchParam = `(@No_MR:${searchNoRM})|(@Nama_Pasien:${search}*)`;
    }
    if (req.emrParams.Tipe_Pasien != "") {
      searchParam += ` @Tipe_Pasien:${req.emrParams.Tipe_Pasien}`;
    }
    const d = new Date();
    const normalDatetime = `${d.getFullYear().toString().padStart(4, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} 23:59:00`
    const endDate = moment.utc(normalDatetime).unix();
    let startDate = moment.unix(endDate).subtract(3, 'days').utc();
    startDate = moment.utc(startDate).unix();
    // const searchQuery = `\'${searchParam} @Kode_Cabang:${req.emrParams.Kode_Cabang} @Status_Konsultasi:1 (@Tanggal_Konsul1:[${startDate} ${endDate}]|@Tanggal_Konsul2:[${startDate} ${endDate}]|@Tanggal_Konsul3:[${startDate} ${endDate}]) ((@Yth_Dokter_Konsul_Id1:${req.userId.split('-').join('_')}|@Yth_Dokter_Konsul_Id2:${req.userId.split('-').join('_')}|@Yth_Dokter_Konsul_Id3:${req.userId.split('-').join('_')})|(@ID_Dokter_Konsultasi1:${req.userId.split('-').join('_')}|@ID_Dokter_Konsultasi2:${req.userId.split('-').join('_')}|@ID_Dokter_Konsultasi3:${req.userId.split('-').join('_')}))\'`;
    const searchQuery = `\'${searchParam} @Kode_Cabang:${req.emrParams.Kode_Cabang} @Status_Konsultasi:1 (@Tanggal_Konsul:[${startDate} ${endDate}]) ((@Yth_Dokter_Konsul_Id:${req.userId.split('-').join('_')})|(@ID_Dokter_Konsultasi:${req.userId.split('-').join('_')}))\'`;
    const result = await global.medicalRecord.consultationAggregate(searchQuery, {
      STEPS: [
        {
          type: AggregateSteps.GROUPBY,
          properties: ["@Kode_Cabang", "@No_MR"],
          REDUCE: [
            {
              type: AggregateGroupByReducers.FIRST_VALUE,
              property: "$.Tipe_Pasien",
              BY: {
                property: "$.Tanggal_Masuk",
                direction: "DESC",
              },
              AS: "Tipe_Pasien",
            },
            {
              type: AggregateGroupByReducers.FIRST_VALUE,
              property: "$.Jam_Masuk",
              BY: {
                property: "$.Tanggal_Masuk",
                direction: "DESC",
              },
              AS: "Jam_Masuk",
            },
            {
              type: AggregateGroupByReducers.FIRST_VALUE,
              property: "$.Tanggal_Masuk",
              BY: {
                property: "$.Tanggal_Masuk",
                direction: "DESC",
              },
              AS: "Tanggal_Masuk",
            },
            {
              type: AggregateGroupByReducers.FIRST_VALUE,
              property: "$.Pasien",
              BY: {
                property: "$.Tanggal_Masuk",
                direction: "DESC",
              },
              AS: "Pasien",
            },
            {
              type: AggregateGroupByReducers.FIRST_VALUE,
              property: "$.Rawat_Jalan.Penanganan",
              BY: {
                property: "$.Tanggal_Masuk",
                direction: "DESC",
              },
              AS: "Rawat_Jalan.Penanganan",
            },
            {
              type: AggregateGroupByReducers.FIRST_VALUE,
              property: "$.Created_Date",
              BY: {
                property: "$.Tanggal_Masuk",
                direction: "DESC",
              },
              AS: "Created_Date",
            },
            {
              type: AggregateGroupByReducers.FIRST_VALUE,
              property: `$.Konsultasi.Status_Konsultasi`,
              BY: {
                property: "$.Tanggal_Masuk",
                direction: "DESC",
              },
              AS: "Status_Konsultasi",
            },
            {
              type: AggregateGroupByReducers.FIRST_VALUE,
              property: `$.Konsultasi.Lembar_Konsultasi`,
              BY: {
                property: "$.Tanggal_Masuk",
                direction: "DESC",
              },
              AS: "Lembar_Konsultasi",
            },
          ],
        },
        {
          type: AggregateSteps.SORTBY,
          BY: {
            BY: "@Tanggal_Masuk",
            DIRECTION: "DESC",
          },
        },
        {
          type: AggregateSteps.LIMIT,
          from: offset,
          size: limit,
        },
      ],
    });

    const rows: any = [];
    const totalFiltered = result.results.length;
    for (let i = 0; i < totalFiltered; i++) {
      if (result.results[i] !== null) {
        let isKonsultasi = false;
        if (result.results[i].Status_Konsultasi && result.results[i].Status_Konsultasi === '1') {
          const consultArray = result.results[i].Lembar_Konsultasi ? JSON.parse(result.results[i].Lembar_Konsultasi) : [];
          for (let j = 0; j < consultArray.length; j += 1) {
            let isThisDoctor = false;
            if (consultArray[j].Tanggal_Balas) {
              isThisDoctor = !!(consultArray[j].Yth_Dokter_Konsul_Id.split('_').join('-') === req.userId || consultArray[j].Yth_Dokter_Balas_Id.split('_').join('-') === req.userId);
              const tanggalBalas = moment.unix(consultArray[j].Tanggal_Balas).add(1, 'days').unix();
              if (endDate > tanggalBalas) {
                isThisDoctor = false;
              }
            } else {
              isThisDoctor = !!(consultArray[j].Yth_Dokter_Konsul_Id.split('_').join('-') === req.userId)
            }
            if (isThisDoctor) {
              isKonsultasi = true;
            }
          }
        }
        if (isKonsultasi) {
          rows.push({
            Kode_Cabang: result.results[i]["Kode_Cabang"],
            No_MR: result.results[i]["No_MR"],
            Tgl_Berobat: moment.unix(parseInt(result.results[i]["Tanggal_Masuk"])).format("YYYY-MM-DD"),
            Jam_Kunjungan: result.results[i]["Jam_Masuk"],
            Pasien: JSON.parse(result.results[i]["Pasien"]),
            Tipe_Pasien: result.results[i]["Tipe_Pasien"],
            Penanganan: global.medicalRecord.getHandling(result.results[i]["Rawat_Jalan.Penanganan"]),
            Created_Date: result.results[i]["Created_Date"],
          });
        }
      }
    }
    const total = rows.length;
    const output = {
      total,
      totalFiltered,
      records: rows,
    };
    if (!res.writableEnded) {
      res.status(200).json({ message: "OK", data: output });
    }

  })

export { Patient };
