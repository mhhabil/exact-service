export interface IRequestMRRequest {
  id: string;
  mr_list: string[];
  purpose: string;
  request_id: string;
  requested_by: string;
  requested_by_name: string;
  approved_at: string;
  approved_by: string;
  branch_code: string;
  action: '1' | '0';
  expired_at: string;
  requested_at: string;
}

export class RequestMRRequest {
  id: string;
  mr_list: string[];
  purpose: string;
  request_id: string;
  requested_by: string;
  requested_by_name: string;
  approved_at: string;
  approved_by: string;
  branch_code: string;
  action: '1' | '0';
  expired_at: string;
  requested_at: string;

  constructor(req: IRequestMRRequest) {
    this.id = req.id;
    this.mr_list = req.mr_list && Array.isArray(req.mr_list) ? req.mr_list : [];
    this.purpose = req.purpose;
    this.request_id = req.request_id;
    this.requested_by = req.requested_by;
    this.requested_by_name = req.requested_by_name;
    this.approved_at = req.approved_at;
    this.approved_by = req.approved_by;
    this.branch_code = req.branch_code;
    this.action = req.action;
    this.expired_at = req.expired_at;
    this.requested_at = req.requested_at;
  }

  static createFromJson(json: IRequestMRRequest) {
    return new RequestMRRequest(json);
  }
}
