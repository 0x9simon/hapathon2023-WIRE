package com.alphawallet.app.entity;

public class RiskInfo {
    public Float riskScore;
    public Integer riskLevel;
    public Integer[] riskLevelList;
    public String[] riskMsgList;

    public boolean isRiskHigh() {
        return riskLevel == 1;
    }
}
