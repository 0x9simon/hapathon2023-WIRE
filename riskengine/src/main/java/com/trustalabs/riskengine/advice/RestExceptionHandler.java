package com.trustalabs.riskengine.advice;

import com.ql.util.express.exception.QLCompileException;
import com.trustalabs.riskengine.controller.RiskScoreApi;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class RestExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(RiskScoreApi.class);


    @ExceptionHandler(RiskException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Result<String> riskException(RiskException e) {
        ResultCode r = e.getErrorCode();
        logger.info("{}", e);
        return Result.failure(r.getCode(), r.getMessage());
    }

    @ExceptionHandler(ClassCastException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Result<String> castException(ClassCastException e) {
        ResultCode r = ResultCode.RC500;
        logger.info("{}", e);
        return Result.failure(r.getCode(), e.getMessage());
    }

    @ExceptionHandler(QLCompileException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Result<String> QLRunnerException(ClassCastException e) {
        ResultCode r = ResultCode.RC500;
        logger.info("{}", e);
        return Result.failure(r.getCode(), e.getMessage());
    }

}
