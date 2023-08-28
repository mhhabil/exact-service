export interface IListDaftarBerobatRequest {
  limit: number;
  offset: number;
  company_code: string;
  start_date: string;
  end_date: string;
  doctor_id: string;
  search: string;
  search_regex: string;
}

