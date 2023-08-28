export interface ISEPFileNameRequest {
  src_url: string;
  form_name: string;
  emr_id: string;
}

export class SEPFileNameRequest {
  src_url: string;
  form_name: string;
  emr_id: string;

  constructor(req: ISEPFileNameRequest) {
    this.src_url = req.src_url;
    this.form_name = req.form_name;
    this.emr_id = req.emr_id;
  }
}
