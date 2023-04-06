package com.trustalabs.riskengine.utils;

import com.aliyun.oss.ClientException;
import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.OSSException;
import com.aliyun.oss.model.GetObjectRequest;
import com.trustalabs.riskengine.config.OSSConfig;
import com.trustalabs.riskengine.controller.RiskScoreApi;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class OSSUtils {

    private static final Logger logger = LoggerFactory.getLogger(RiskScoreApi.class);

    private static OSSConfig ossConfig;

    @Autowired
    public OSSUtils(OSSConfig ossConfig) {
        OSSUtils.ossConfig = ossConfig;
    }

    public static void syncOSSFile(String filePath){

        Path objectName = Paths.get(ossConfig.scriptPath, filePath);
        Path localName = Paths.get(ossConfig.RISK_SCRIPT_PATH, filePath);
        // 创建OSSClient实例。
        OSS ossClient = new OSSClientBuilder().build(ossConfig.endpoint, ossConfig.accessKeyId, ossConfig.accessKeySecret);

        try {
            logger.info("try find {}", objectName.toString());
            boolean found = ossClient.doesObjectExist(ossConfig.bucketName, objectName.toString());
            if (found){
                ossClient.getObject(new GetObjectRequest(ossConfig.bucketName, objectName.toString()), localName.toFile());
                logger.info("download {} to {}", objectName.toString(), localName.toFile());
            }
        } catch (OSSException oe) {
            logger.info("Caught an OSSException, which means your request made it to OSS, "
                    + "but was rejected with an error response for some reason.");
            logger.info("Error Message:" + oe.getErrorMessage());
            logger.info("Error Code:" + oe.getErrorCode());
            logger.info("Request ID:" + oe.getRequestId());
            logger.info("Host ID:" + oe.getHostId());
        } catch (ClientException ce) {
            logger.info("Caught an ClientException, which means the client encountered "
                    + "a serious internal problem while trying to communicate with OSS, "
                    + "such as not being able to access the network.");
            logger.info("Error Message:" + ce.getMessage());
        } finally {
            if (ossClient != null) {
                ossClient.shutdown();
            }
        }
    }
}
