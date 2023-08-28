import axios from "axios";
import 'dotenv/config'
import { IUpdateToSimrs } from "../interfaces/simrs/simrs.request";

const secureEnv = require('secure-env');
global.env = secureEnv({});

export class SimrsService {
  host = process.env.HOST;

  async requestToSimrs(body: IUpdateToSimrs, token: string) {
    try {
      if (token && token !== '') {
        const response = await axios.post(`${this.host}/simrs/httpRequest`, body, {
          headers: {
            'x-token': token,
          },
        })
        return response.data.data;
      }
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  getMedsFromSimrs(company_code: string, patient_type: 'UMUM' | 'BPJS') {
    let location: string = '';

    if (patient_type === 'BPJS') {
      location = 'b93d61b9-5e5b-5175-ba11-1e9899202a84';
    }
    if (patient_type === 'UMUM') {
      location = 'cc9e98be-eed1-5cbc-afee-8166b0b8768d';
    }

    return {
      company_code,
      id_lokasi: location,
      status: '1',
      reset_redis: '1',
    }
  }
}
