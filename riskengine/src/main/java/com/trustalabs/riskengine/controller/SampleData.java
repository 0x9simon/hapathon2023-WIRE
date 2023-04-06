package com.trustalabs.riskengine.controller;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;



@Controller
@RequestMapping(path="/sample")
public class SampleData {

    private static final Logger logger = LoggerFactory.getLogger(RiskScoreApi.class);

    @PostMapping(path="/{target}")
    public @ResponseBody String postSample(@PathVariable("target") String target,
                                           @RequestBody String json_data) throws Exception {

        logger.info("{}", json_data);
        Double r = 0.13;
        return r.toString();
    }

    @GetMapping(path="/{target}")
    public @ResponseBody String getSample(@PathVariable("target") String target,
                                          @RequestBody String json_data) throws Exception {

        logger.info("{}", json_data);
        Double r = 0.03;
        return r.toString();
    }


}
