package com.trustalabs.riskengine.advice;

import lombok.Getter;

public enum ResultCode {
    /**操作成功**/
    RC000(0,"执行成功"),
    /**操作失败**/
    RC999(999,"操作失败"),
    /**缺少参数**/
    RC200(200,"缺少参数"),
    /**找不到目标策略**/
    RC201(201,"找不到目标策略"),
    /**参数无法解析**/
    RC202(202,"参数无法解析"),
    /**策略执行异常**/
    RC203(203,"策略执行异常"),

    /**服务异常**/
    RC500(500,"系统异常，请稍后重试");

    @Getter
    private final int code;

    @Getter
    private final String message;

    ResultCode(int code, String message) {

        this.code = code;

        this.message = message;
    }
}

