package com.alphawallet.app.entity;

public interface RiskCallback {

    default void onRiskConfirm() {
    }

    default void onRiskCancel() {
    }
}
