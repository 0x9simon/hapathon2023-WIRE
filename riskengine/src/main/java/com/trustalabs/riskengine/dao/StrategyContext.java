package com.trustalabs.riskengine.dao;

import com.google.gson.reflect.TypeToken;
import com.ql.util.express.DefaultContext;
import lombok.Data;

import java.lang.reflect.Type;
import java.util.Map;

@Data
public class StrategyContext {
    public static Type contextType = new TypeToken<StrategyContext>() {}.getType();

    private DefaultContext<String, Object> inputs;
    private Map<String, Object> outputs;
    private String target;
}
