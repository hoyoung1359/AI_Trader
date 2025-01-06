export interface StockResponse {
  output: Stock;
  rt_cd: string;
  msg_cd: string;
  msg1: string;
}

export interface Stock {
  stck_bsop_date: string;
  stck_clpr: string;
  stck_oprc: string;
  stck_hgpr: string;
  stck_lwpr: string;
  prdy_vrss: string;
  prdy_ctrt: string;
  prdy_vol: string;
  acml_vol: string;
  hts_kor_isnm: string;
  stck_prpr: string;
  stck_shrn_iscd: string;
} 