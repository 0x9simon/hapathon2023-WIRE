package com.trustalabs.riskengine.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OSSConfig {
    @Value("${risk_api.oss.endpoint}")
    public String endpoint;

    @Value("${risk_api.oss.accessKeyId}")
    public String accessKeyId;

    @Value("${risk_api.oss.accessKeySecret}")
    public String accessKeySecret;

    @Value("${risk_api.oss.bucketName}")
    public String bucketName;

    @Value("${risk_api.oss.scriptPath}")
    public String scriptPath;

    @Value("${risk_api.risk_script_path}")
    public String RISK_SCRIPT_PATH;
}
