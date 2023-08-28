import moment from "moment";
import { Router, Request, Response, NextFunction } from "express";
import RBAC from "../../../services/rbac";
import { AggregateSteps, AggregateGroupByReducers } from "redis";
import { ElasticLoggerService, SimrsService } from "./services";
import { IRequestMRRequest, RequestMRRequest } from "./interfaces/request-mr/request-mr.request";
import { RequestMRModel } from "./interfaces/request-mr/request-mr.model";
import { getEmployeeName } from "./helpers/app.helper";
const RM = Router();

RM.route('/request-mr/approval-history')
  .post(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const dataToPost = req.body;
      const limit = dataToPost.limit ?? 10,
        offset = dataToPost.offset ?? 0
      const branchCode = dataToPost.branch_code;
      const result = await global.medicalRecord.findRequestMr(`@Branch_Code:${branchCode} @Approval_Status:2`, {
        LIMIT: { from: offset, size: limit },
      });
      if (result && result !== null && result.documents && Array.isArray(result.documents)) {
        const total = result.total;
        const totalFiltered = result.documents.length;
        const newList = result.documents.map((item: any) => {
          return {
            id: item.id,
            ...item.value,
          }
        });
        for (let i = 0; i < newList.length; i += 1) {
          if (newList[i].Requested_At && newList[i].Requested_At !== '') {
            newList[i].Requested_At = moment.unix(newList[i].Requested_At).format("DD MMMM YYYY");
          }
          if (newList[i].Expired_At && newList[i].Expired_At !== '') {
            newList[i].Expired_At = moment.unix(newList[i].Expired_At).format("DD MMMM YYYY");
          }
          if (newList[i].Approved_At && newList[i].Approved_At !== '') {
            newList[i].Approved_At = moment.unix(newList[i].Approved_At).format("DD MMMM YYYY");
          }
        }
        const data = {
          total,
          totalFiltered,
          records: newList,
        };
        if (!res.writableEnded) {
          res.status(200).json({
            message: 'OK',
            data,
          })
        }
      } else {
        if (!res.writableEnded) {
          res.status(404).json({
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

RM.route('/request-mr/pending-request')
  .get(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const branchCode = req.query.branch_code;
      const result = await global.medicalRecord.findRequestMr(`@Branch_Code:${branchCode} @Approval_Status:1`);
      if (result && result !== null && result.documents && Array.isArray(result.documents)) {
        const total = result.total;
        const totalFiltered = result.documents.length;
        const newList = result.documents.map((item: any) => {
          return {
            id: item.id,
            ...item.value,
          }
        });
        for (let i = 0; i < newList.length; i += 1) {
          if (newList[i].Requested_At && newList[i].Requested_At !== '') {
            newList[i].Requested_At = moment.unix(newList[i].Requested_At).format("DD MMMM YYYY");
          }
          if (newList[i].Expired_At && newList[i].Expired_At !== '') {
            newList[i].Expired_At = moment.unix(newList[i].Expired_At).format("DD MMMM YYYY");
          }
          if (newList[i].Approved_At && newList[i].Approved_At !== '') {
            newList[i].Approved_At = moment.unix(newList[i].Approved_At).format("DD MMMM YYYY");
          }
        }
        const data = {
          total,
          totalFiltered,
          records: newList,
        };
        if (!res.writableEnded) {
          res.status(200).json({
            message: 'OK',
            data,
          })
        }
      } else {
        if (!res.writableEnded) {
          res.status(404).json({
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

RM.route('/request-mr/request-history')
  .post(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const dataToPost = req.body;
      const limit = dataToPost.limit ?? 10,
        offset = dataToPost.offset ?? 0
      const branchCode = dataToPost.branch_code;

      const result = await global.medicalRecord.findRequestMr(`@Branch_Code:${branchCode} @Requested_By:${req.userId.split('-').join('_')}`, {
        LIMIT: { from: offset, size: limit },
      });
      if (result && result !== null && result.documents && Array.isArray(result.documents)) {
        const total = result.total;
        const totalFiltered = result.documents.length;
        const newList = result.documents.map((item: any) => {
          return {
            id: item.id,
            ...item.value,
          }
        });
        for (let i = 0; i < newList.length; i += 1) {
          if (newList[i].Requested_At && newList[i].Requested_At !== '') {
            newList[i].Requested_At = moment.unix(newList[i].Requested_At).format("YYYY-MM-DD HH:mm:ss");
          }
          if (newList[i].Expired_At && newList[i].Expired_At !== '') {
            newList[i].Expired_At = moment.unix(newList[i].Expired_At).format("YYYY-MM-DD HH:mm:ss");
          }
          if (newList[i].Approved_At && newList[i].Approved_At !== '') {
            newList[i].Approved_At = moment.unix(newList[i].Approved_At).format("YYYY-MM-DD HH:mm:ss");
          }
        }
        const data = {
          total,
          totalFiltered,
          records: newList,
        };
        if (!res.writableEnded) {
          res.status(200).json({
            message: 'OK',
            data,
          });
        }
      } else {
        if (!res.writableEnded) {
          res.status(404).json({
            message: 'No Data',
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
  });

RM.route('/request-mr/request')
  .post(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const dataToPost: IRequestMRRequest = RequestMRRequest.createFromJson(req.body);
      const result = await global.medicalRecord.findRequestMr(`@Branch_Code:${dataToPost.branch_code}`);
      const redisJsonData: IRequestMR = await RequestMRModel.createRequestModel(dataToPost, req, result.total);
      const id = await global.medicalRecord.newRequestMr(dataToPost.branch_code, redisJsonData);
      const mrs = await global.medicalRecord.get(`MedicalRecordUsers:{${dataToPost.branch_code}}`, '.');
      const requesterName = req.userProfile.nama ?? ''
      if (mrs && mrs !== null && Array.isArray(mrs) && mrs.length > 0) {
        const ids = mrs.map((c) => c.ID_Karyawan);
        const stringMr = dataToPost.mr_list.map((item, key) => {
          return `${key + 1}. ${item}\n`
        })
        const header = '<b>[Butuh Persetujuan Rekam Medis]</b>'
        const body = `User <b>${requesterName}</b> melakukan permintaan akses rekam medis dengan tujuan <b>${dataToPost.purpose}</b> dan tanggal expired akses hingga <b>${dataToPost.expired_at}</b>.\nNomor rekam medis yang diminta adalah sebagai berikut:\n<b>${stringMr.join('')}</b>\nSilahkan melakukan persetujuan akses rekam medis melalui ${(process?.env?.ENV === 'production') ? 'https://emr.gic-indonesia.com/account/request-mr' : 'https://dev-emr.gic-indonesia.com/account/request-mr'}\n\nTerima Kasih.`
        const message = `${header}\n\n${body}`;
        await global.medicalRecord.postRequestMRNotifications(ids, message);
      }
      if (!res.writableEnded) {
        ElasticLoggerService().createLog(req, '/request-mr/request', 'OK');
        res.status(200).json({
          message: 'OK',
          id,
        })
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/request-mr/request', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        })
      }
    }
  });

RM.route('/request-mr/grant-access')
  .post(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const dataToPost: IRequestMRRequest = RequestMRRequest.createFromJson(req.body);
      const result = await global.medicalRecord.findRequestMr(`@Branch_Code:${dataToPost.branch_code}`);
      const redisJsonData: IRequestMR = await RequestMRModel.createGrantAccessModel(dataToPost, req, result.total);
      const id = await global.medicalRecord.newRequestMr(dataToPost.branch_code, redisJsonData);
      if (!res.writableEnded) {
        ElasticLoggerService().createLog(req, '/request-mr/grant-access', 'OK')
        res.status(200).json({
          message: 'OK',
          id,
        })
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/request-mr/grant-access', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        })
      }
    }
  });

RM.route('/request-mr/approve')
  .post(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const dataToPost: IRequestMRRequest = RequestMRRequest.createFromJson(req.body);
      const data = await global.medicalRecord.get(dataToPost.id, '.');
      const redisJsonData: IRequestMR = await RequestMRModel.createActionModel(dataToPost, req, data);
      await global.medicalRecord.update(dataToPost.id, '$', redisJsonData);
      if (!res.writableEnded) {
        ElasticLoggerService().createLog(req, '/request-mr/approve', 'OK')
        res.status(200).json({
          message: 'OK',
          data: redisJsonData,
        })
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/request-mr/request', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        })
      }
    }
  });

RM.route('/request-mr/patient-list')
  .post(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      // Get All User ID Request
      const dataToPost = req.body;
      const limit = dataToPost.limit ?? 10,
        offset = dataToPost.offset ?? 0
      const d = new Date();
      const normalDatetime = `${d.getFullYear().toString().padStart(4, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} 23:59:00`
      const nowDate = moment.utc(normalDatetime).unix();

      const searchQuery = `@Branch_Code:${dataToPost.branch_code} @Expired_At:[(${nowDate} +inf] @Requested_By:${req.userId.split('-').join('_')} @Approval_Status:2`
      const result = await global.medicalRecord.findRequestMr(searchQuery, {
        LIMIT: { from: 0, size: 10000 },
      });
      const mrList: any = [];
      if (result.documents && Array.isArray(result.documents)) {
        for (let i = 0; i < result.documents.length; i += 1) {
          const value: IRequestMR = result.documents[i].value;
          for (let j = 0; j < value.MR_List.length; j += 1) {
            if (!mrList.includes(value.MR_List[j])) {
              mrList.push(value.MR_List[j])
            }
          }
        }
      }

      // Get All MR
      const search = req.body.search ?? '';
      let searchParam = '';
      if (search !== '') {
        searchParam = `(@Nama_Pasien:*${search}*)`;
      }
      const searchQueryPatient = `\'${searchParam} @Kode_Cabang:${dataToPost.branch_code} @No_MR:${mrList.join('|')}\'`
      const resultPatient = await global.medicalRecord.aggregate(searchQueryPatient, {
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
      const total = resultPatient.total;
      const totalFiltered = resultPatient.results.length;
      for (let i = 0; i < totalFiltered; i += 1) {
        rows.push({
          Kode_Cabang: resultPatient.results[i]["Kode_Cabang"],
          No_MR: resultPatient.results[i]["No_MR"],
          Tgl_Berobat: moment.unix(parseInt(resultPatient.results[i]["Tanggal_Masuk"])).format("YYYY-MM-DD"),
          Jam_Kunjungan: resultPatient.results[i]["Jam_Masuk"],
          Pasien: JSON.parse(resultPatient.results[i]["Pasien"]),
          Tipe_Pasien: resultPatient.results[i]["Tipe_Pasien"],
          Penanganan: global.medicalRecord.getHandling(resultPatient.results[i]["Rawat_Jalan.Penanganan"]),
          Created_Date: resultPatient.results[i]["Created_Date"],
        })
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

export { RM };
