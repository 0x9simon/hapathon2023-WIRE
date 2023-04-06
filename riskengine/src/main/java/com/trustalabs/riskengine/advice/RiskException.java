package com.trustalabs.riskengine.advice;


public class RiskException extends Exception {
    protected ResultCode errorCode;

    public RiskException(){

    }
    public RiskException(ResultCode errorCode) {
        this.errorCode = errorCode;
    }

    public ResultCode getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(ResultCode errorCode) {
        this.errorCode = errorCode;
    }

}
