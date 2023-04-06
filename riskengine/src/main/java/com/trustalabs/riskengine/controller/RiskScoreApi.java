package com.trustalabs.riskengine.controller;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.ql.util.express.DefaultContext;
import com.ql.util.express.ExpressRunner;
import com.trustalabs.riskengine.advice.ResultCode;
import com.trustalabs.riskengine.advice.RiskException;
import com.trustalabs.riskengine.dao.StrategyContext;
import com.trustalabs.riskengine.utils.OSSUtils;
import org.jpmml.evaluator.*;
import org.python.core.*;
import org.python.util.PythonInterpreter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;


@Controller
@RequestMapping(path="/openapi")
public class RiskScoreApi {

    private static final Logger logger = LoggerFactory.getLogger(RiskScoreApi.class);

    @Value("${risk_api.risk_script_path}")
    private String RISK_SCRIPT_PATH;

    private String fetchExpression(String script_type, String target_script) throws RiskException {
        Path targetScriptPath = Paths.get(RISK_SCRIPT_PATH, script_type, target_script);
        if (!targetScriptPath.toFile().exists()){
            logger.info("fetch from oss: ", targetScriptPath);

            OSSUtils.syncOSSFile(Paths.get(script_type, target_script).toString());
        }
        byte[] bytes = new byte[0];
        try {
            bytes = Files.readAllBytes(targetScriptPath);
        } catch (IOException e) {
            throw new RiskException(ResultCode.RC201);
        }
        String express = new String(bytes, StandardCharsets.UTF_8);
        return express;
    }

    @PostMapping(path="/qlexpress")
    public @ResponseBody HashMap<String, Object> executeQLExpressStrategy(@RequestBody String json_data) throws Exception {

        logger.info("start");
        // load context
        Gson gson = new Gson();
        StrategyContext context = gson.fromJson(json_data, StrategyContext.contextType);

        // load qlexpress script
        String express = fetchExpression("qlexpress", context.getTarget());

        // This returns a JSON or XML with the users
        ExpressRunner runner = new ExpressRunner();
        HashMap<String, Object> resp = new HashMap<>(8);

        Object r = runner.execute(express, context.getInputs(), null, true, false);
        for (String ks : context.getOutputs().keySet()){
            resp.put(ks, context.getInputs().get(ks));
        }

        logger.info(json_data);
        logger.info("{}", r);
        logger.info("{}", resp);

        return resp;
    }

    @PostMapping(path="/pythonscript")
    public @ResponseBody HashMap<String, Object> executePythonStrategy(@RequestBody String json_data) throws RiskException {
        logger.info("python start");
        // load context
        Gson gson = new Gson();
        StrategyContext context = gson.fromJson(json_data, StrategyContext.contextType);

        // load python script
        String express = fetchExpression("pythonscript", context.getTarget());


        // This returns a JSON or XML with the users
        PythonInterpreter interp = new PythonInterpreter();
        DefaultContext<String, Object> inputs = context.getInputs();
        for(String key:inputs.keySet()){
            Object v = inputs.get(key);
            if (v.getClass() == Integer.class){
                interp.set(key, new PyInteger(((Integer) v).intValue()));
            }else if (v.getClass() == String.class){
                interp.set(key, new PyString((String)v));
            }else if (v.getClass() == Double.class){
                interp.set(key, new PyFloat(((Double) v).doubleValue()));
            }else if (v.getClass() == Boolean.class){
                interp.set(key, new PyBoolean(((Boolean) v).booleanValue()));
            }
        }
        interp.exec(express);

        // fetch output values
        HashMap<String, Object> resp = new HashMap<>(8);
        for (String ks : context.getOutputs().keySet()){
            resp.put(ks, interp.get(ks).toString());
        }

        logger.info("{}", json_data);
        logger.info("{}", resp);

        return resp;
    }



}
