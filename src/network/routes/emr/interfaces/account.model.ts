import moment from "moment";
import { isValidFile } from "../helpers/app.helper";

export interface IVerifyPin {
  PIN: string;
  Last_Updated: string;
  Signature: string;
  ID_Karyawan: string;
}

export interface IUpdatePDFHeaderRequest {
  company_code: string;
  logo_url: string;
  logo_name: string;
  logo_size: string;
  logo_type: string;
  text_1: string;
  text_2: string;
  text_3: string;
}

export class UpdatePDFHeaderRequest {
  company_code: string;
  logo_url: string;
  logo_name: string;
  logo_size: string;
  logo_type: string;
  text_1: string;
  text_2: string;
  text_3: string;

  constructor(req: IUpdatePDFHeaderRequest) {
    this.company_code = req.company_code;
    this.logo_url = req.logo_url;
    this.logo_name = req.logo_name;
    this.logo_size = req.logo_size;
    this.logo_type = req.logo_type;
    this.text_1 = req.text_1;
    this.text_2 = req.text_2;
    this.text_3 = req.text_3;
  }

  static createFromJson(json: IUpdatePDFHeaderRequest) {
    return new UpdatePDFHeaderRequest(json);
  }

  static async createPdfHeaderModel(json: IUpdatePDFHeaderRequest) {
    return {
      teksBaris1: json.text_1,
      teksBaris2: json.text_2,
      teksBaris3: json.text_3,
      logo: json.logo_url && json.logo_url !== '' && isValidFile(json.logo_url) ? await global.storage.signUrl(json.logo_url, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '',
    }
  }
}
