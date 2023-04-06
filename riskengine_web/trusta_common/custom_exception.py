from rest_framework.views import exception_handler
from rest_framework.exceptions import APIException

from enum import Enum

import logging

logger = logging.getLogger("general")

class RiskErrorCode(Enum):
    
    PARAM_LOAD_FAILED=(1001, "PARAM_LOAD_FAILED")
    STRATEGY_LOAD_FAILED=(1002, "STRATEGY_LOAD_FAILED")
    STRATEGY_EXEC_FAILED=(1003, "STRATEGY_EXEC_FAILED")
    RDS_CONNECT_ERROR=(1004, "RDS_CONNECT_ERROR")
    RDS_SQL_EXEC_FAILED=(1005, "RDS_SQL_EXEC_FAILED")
    RDS_INPUT_PARAM_MISMATCH=(1006, "RDS_INPUT_PARAM_MISMATCH")
    RDS_OUTPUT_PARAM_MISMATCH=(1007, "RDS_OUTPUT_PARAM_MISMATCH")
    STRATEGY_INPUT_MISMATCH=(1008, "STRATEGY_INPUT_MISMATCH")
    API_CONNECT_ERROR=(1009, "API_CONNECT_ERROR")



class RiskScoreException(APIException):
    status_code = 503
    default_detail = 'Service temporarily unavailable, try again later.'
    default_code = 'service_unavailable'

    def __init__(self, risk_code):
        self.risk_code = risk_code
        if isinstance(risk_code, RiskErrorCode):
            self.code, self.detail = risk_code.value


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        response.data['error_code'] = getattr(exc, "code", response.status_code) 

    return response