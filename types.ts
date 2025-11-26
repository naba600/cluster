export interface TransactionRow {
  id: string;
  slNo: number;
  doseNo: string;
  voucherNo: string;
  principal: number;
  interest: number;
  monthlySavings: number;
  overdue: number;
  fileName: string;
  filePreview?: string;
}

export interface FormData {
  id: string;
  voName: string;
  vcdcName: string;
  fundSource: string;
  mobileNumber: string;
  repaymentDate: string;
  transactions: TransactionRow[];
  submissionDate: string;
}

export const VO_OPTIONS = [
  "AKASH VO",
"AKOTA VO",
"ASHA VO",
"BALY VO",
"BRIGHT VO",
"CHANDRAMA VO",
"DAIMOND VO",
"JON VO",
"JONALI VO",
"JONONI VO",
"JOTI VO",
"KIRON VO",
"LATA VO",
"LOTUS VO",
"MAA GANGA VO",
"MAA JANANI VO",
"MAA SARASWATI VO",
"MAA TARA VO",
"MAHAK VO",
"MILIJULI VO",
"MOON LIGHT VO",
"MOSUMI VO",
"NAYANMANI VO",
"PARIJAT VO",
"PRAGATI VO",
"RAINBAW VO",
"RAINBOW VO",
"SAN VO",
"SANKAR AZAN VO",
"SANTI VO",
"SARBOJONIN VO",
"SATHI VO",
"SATTHI VO",
"SMART VO",
"STAR VO",
"SUBOSRI VO",
"SUN FLOWER VO",
"SUN VO",
"SURJO VO",
];

export const FUND_SOURCES = [
  "AGEY CIF Loan",
"(CEF) Loan",
"(CIF) Loan",
"PMFME Loan",
"E-Book keeper Loan",
"Working Capital for CHC Loan",
"Working Capital for PE Loan",
"Working Capital for PG Loan",
];

export const VCDC_OPTIONS = [
 "Chithila",
"Fakiragram",
"Jagdai",
"Kaljhar",
"Koraitary",
"Pochagarh",
"Pratapkhata",
];
