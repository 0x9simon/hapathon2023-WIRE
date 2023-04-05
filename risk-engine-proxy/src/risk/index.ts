import { Router } from "express";
import { ApiResults } from "../utils";
import { TxSignObj, flattenTxSignObj } from "./commons";

import dotenv from "dotenv";
import path from "path";
import axios, { HttpStatusCode } from "axios";
import { RiskEngineResponse } from "./constants";

dotenv.config({path: path.join(__dirname, "../../.env")});


const api_key = process.env.ENGINE_API_KEY || ""
const engine_url = process.env.ENGINE_URL || "127.0.0.1";

let router = Router();

router.get('/tx_sign', async (req, res) => {
    try {
        const tx = req.body as TxSignObj;
        const {data, config} = flattenTxSignObj(tx);

        const url = `${engine_url}/risk_api/risk_score/${config.endpoint}`
        const engineResp = await axios.post(url, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Api-Key ${api_key}`
            }
        });

        if (engineResp.status != HttpStatusCode.Ok) { res.send("Risk Engine Error: " + engineResp.status); }
        else {
            let result = engineResp.data as RiskEngineResponse;
            if (result.code == 200) {
                res.send(ApiResults.OK(result.data!));
            } else {
                res.send(ApiResults.UNKNOWN_ERROR(result.error_message?.detail));
            }
        }

    } catch (e) {
        res.send(ApiResults.UNKNOWN_ERROR(`${e}`));
    }
});

router.get('/msg_sign', async (req, res) => {
    try {
        // TODO: offline sign
    } catch (e) {
        res.send(ApiResults.UNKNOWN_ERROR(`${e}`));
    }
});

export {
    router
}