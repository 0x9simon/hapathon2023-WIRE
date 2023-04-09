package com.alphawallet.app.entity;

import java.util.Objects;

public class RiskResponse {
    public Integer code;
    public Integer msg;
    public RiskInfo data;

    public boolean isSuccess() {
        return Objects.nonNull(code) && code == 0;
    }
}
