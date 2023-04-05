
export const RiskEngineErrors: {
  [key: number]: string;
} = {
  1001: "PARAM_LOAD_FAILED",
  1002: "STRATEGY_LOAD_FAILED",
  1003: "STRATEGY_EXEC_FAILED",
  1004: "RDS_CONNECT_ERROR",
  1005: "RDS_SQL_EXEC_FAILED",
  1006: "RDS_INPUT_PARAM_MISMATCH",
  1007: "RDS_OUTPUT_PARAM_MISMATCH",
  1008: "STRATEGY_INPUT_MISMATCH",
  1009: "API_CONNECT_ERROR",
}

// response from Risk Engine
export interface RiskEngineResponse {
  code: number,
  msg: string,
  data?: {
    risk_level: string,
    risk_score: number,
    nodes?: string[]
  },
  error_message?: {
    detail: string,
    error_code: number
  }
}
