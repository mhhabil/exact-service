import moment from "moment";
import { IRequestMRRequest } from "./request-mr.request";

export class RequestMRModel {
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

  constructor(req: IRequestMR) {
    this.MR_List = req.MR_List;
    this.Purpose = req.Purpose;
    this.Created_At = req.Created_At;
    this.Created_By = req.Created_By;
    this.Request_ID = req.Request_ID;
    this.Requested_By = req.Requested_By;
    this.Updated_At = req.Updated_At;
    this.Updated_By = req.Updated_By;
    this.Approved_At = req.Approved_At;
    this.Approved_By = req.Approved_By;
    this.Branch_Code = req.Branch_Code;
    this.Created_By_Name = req.Created_By_Name;
    this.Requested_By_Name = req.Requested_By_Name;
    this.Updated_By_Name = req.Updated_By_Name;
    this.Approved_By_Name = req.Approved_By_Name;
    this.Approval_Status = req.Approval_Status;
    this.Expired_At = req.Expired_At;
    this.Requested_At = req.Requested_At;
  }

  static async createGrantAccessModel(request: IRequestMRRequest, req: any, length: number) {
    const number = `000${length + 1}`.slice(-4);
    const dateTime = moment().utcOffset(await global.medicalRecord.getConfigValue(request.branch_code, "timezone")).format("YYYY-MM-DD HH:mm:ss");
    const date = moment().utcOffset(await global.medicalRecord.getConfigValue(request.branch_code, "timezone")).format("YYYY-MM-DD");
    const requestId = `${request.branch_code}-${date.split('-').join('')}-${number}`
    const d = new Date();
    const normalDatetime = `${d.getFullYear().toString().padStart(4, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
    return new RequestMRModel({
      MR_List: request.mr_list && Array.isArray(request.mr_list) ? request.mr_list : [],
      Purpose: request.purpose ?? '',
      Created_At: dateTime,
      Created_By: req.userId ?? '',
      Request_ID: requestId,
      Requested_By: request.requested_by ? request.requested_by.split('-').join('_') : '',
      Updated_At: dateTime,
      Updated_By: req.userId ?? '',
      Approved_At: dateTime ? moment(`${dateTime}`).unix() : undefined,
      Approved_By: req.userId ?? '',
      Branch_Code: request.branch_code ?? '',
      Created_By_Name: req.userProfile && req.userProfile.nama ? req.userProfile.nama : '',
      Requested_By_Name: request.requested_by_name ?? '',
      Updated_By_Name: req.userProfile && req.userProfile.nama ? req.userProfile.nama : '',
      Approved_By_Name: req.userProfile && req.userProfile.nama ? req.userProfile.nama : '',
      Approval_Status: '2',
      Expired_At: request.expired_at ? moment(`${request.expired_at}:00`).unix() : undefined,
      Requested_At: dateTime ? moment(`${dateTime}`).unix() : undefined,
    })
  }

  static async createRequestModel(request: IRequestMRRequest, req: any, length: number) {
    const number = `000${length + 1}`.slice(-4);
    const dateTime = moment().utcOffset(await global.medicalRecord.getConfigValue(request.branch_code, "timezone")).format("YYYY-MM-DD HH:mm:ss");
    const date = moment().utcOffset(await global.medicalRecord.getConfigValue(request.branch_code, "timezone")).format("YYYY-MM-DD");
    const requestId = `${request.branch_code}-${date.split('-').join('')}-${number}`
    const d = new Date();
    const normalDatetime = `${d.getFullYear().toString().padStart(4, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
    return new RequestMRModel({
      MR_List: request.mr_list && Array.isArray(request.mr_list) ? request.mr_list : [],
      Purpose: request.purpose ?? '',
      Created_At: dateTime,
      Created_By: req.userId ?? '',
      Request_ID: requestId,
      Requested_By: req.userId ? req.userId.split('-').join('_') : '',
      Updated_At: dateTime,
      Updated_By: req.userId ?? '',
      Approved_At: undefined,
      Approved_By: undefined,
      Branch_Code: request.branch_code ?? '',
      Created_By_Name: req.userProfile && req.userProfile.nama ? req.userProfile.nama : '',
      Requested_By_Name: req.userProfile && req.userProfile.nama ? req.userProfile.nama : '',
      Updated_By_Name: req.userProfile && req.userProfile.nama ? req.userProfile.nama : '',
      Approved_By_Name: undefined,
      Approval_Status: '1',
      Expired_At: request.expired_at ? moment(`${request.expired_at}:00`).unix() : undefined,
      Requested_At: dateTime ? moment(`${dateTime}`).unix() : undefined,
    })
  }

  static async createActionModel(request: IRequestMRRequest, req: any, data: IRequestMR) {
    const dateTime = moment().utcOffset(await global.medicalRecord.getConfigValue(request.branch_code, "timezone")).format("YYYY-MM-DD HH:mm:ss");
    const d = new Date();
    const normalDatetime = `${d.getFullYear().toString().padStart(4, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
    return new RequestMRModel({
      MR_List: data.MR_List,
      Purpose: data.Purpose,
      Created_At: data.Created_At,
      Created_By: data.Created_By,
      Request_ID: data.Request_ID,
      Requested_By: data.Requested_By,
      Updated_At: dateTime,
      Updated_By: req.userId ?? '',
      Approved_At: dateTime ? moment(`${dateTime}`).unix() : undefined,
      Approved_By: req.userId ? req.userId.split('-').join('_') : '',
      Branch_Code: data.Branch_Code,
      Created_By_Name: data.Created_By_Name,
      Requested_By_Name: data.Requested_By_Name,
      Updated_By_Name: req.userProfile && req.userProfile.nama ? req.userProfile.nama : '',
      Approved_By_Name: req.userProfile && req.userProfile.nama ? req.userProfile.nama : '',
      Approval_Status: request.action === '1' ? '2' : '0',
      Expired_At: data.Expired_At,
      Requested_At: data.Requested_At,
    })
  }
}
