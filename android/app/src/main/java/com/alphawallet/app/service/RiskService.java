package com.alphawallet.app.service;

import com.alphawallet.app.C;
import com.alphawallet.app.entity.RiskInfo;
import com.alphawallet.app.entity.RiskResponse;
import com.alphawallet.app.entity.SignTypedDataRiskRequest;
import com.alphawallet.app.entity.TxRiskRequest;
import com.alphawallet.app.repository.EthereumNetworkBase;
import com.alphawallet.app.web3.entity.Web3Transaction;
import com.alphawallet.token.entity.Signable;
import com.google.gson.Gson;

import org.json.JSONObject;
import org.web3j.protocol.http.HttpService;

import java.util.concurrent.TimeUnit;

import io.reactivex.Single;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import timber.log.Timber;

public class RiskService {

    private final OkHttpClient client;

    // TODO: replace it
    private static final String RISK_QUERY_URL = "https://xxx";

    public RiskService(OkHttpClient okHttpClient) {
        this.client = okHttpClient;
    }

    public RiskService() {
        client = new OkHttpClient.Builder()
                .connectTimeout(C.CONNECT_TIMEOUT, TimeUnit.SECONDS)
                .connectTimeout(C.READ_TIMEOUT, TimeUnit.SECONDS)
                .writeTimeout(C.WRITE_TIMEOUT, TimeUnit.SECONDS)
                .retryOnConnectionFailure(true)
                .build();
    }

    private static TxRiskRequest txToRiskRequest(Web3Transaction tx,
                                                 int chainId,
                                                 String chainName,
                                                 String local) {
        final TxRiskRequest request = new TxRiskRequest();
        request.chainId = chainId;
        request.chainName = chainName;
        request.contract = tx.contract.toString();
        request.gasLimit = tx.gasLimit.toString();
        request.gasLimit = tx.gasLimit.toString();
        request.locale = local;
        request.maxFeePerGas = tx.maxFeePerGas.toString();
        request.maxPriorityFeePerGas = tx.maxPriorityFeePerGas.toString();
        request.nonce = tx.nonce;
        request.payload = tx.payload;
        request.receipt = tx.recipient.toString();
        request.sender = tx.sender.toString();
        request.value = tx.value.toString();
        return request;
    }

    public Single<RiskResponse> getRiskTx(Web3Transaction tx,
                                          int chainId,
                                          String local) {
        final String chainName = EthereumNetworkBase.getShortChainName(chainId);
        final TxRiskRequest request = txToRiskRequest(tx, chainId, chainName, local);
        final String requestJson = new Gson().toJson(request);
        final RequestBody requestBody = RequestBody.create(requestJson, HttpService.JSON_MEDIA_TYPE);
        final Request.Builder rqBuilder = new Request.Builder()
                .url(RISK_QUERY_URL)
                .post(requestBody);
        return Single.fromCallable(() -> {
            final Request rq = rqBuilder.build();
            try (Response response = client.newCall(rq).execute()) {
                if (response.code() / 200 == 1) {
                    final String jsonStr = response.body().string();
                    return new Gson().fromJson(jsonStr, RiskResponse.class);
                }
            } catch (Exception e) {
                Timber.e("getTxRisk, error:");
            }
            return new RiskResponse();
        });
    }

    public Single<RiskResponse> getRiskSignTypedData(Signable signable,
                                                     String local) {
        final SignTypedDataRiskRequest request = new SignTypedDataRiskRequest();
        final long chainId = signable.getChainId();
        final String chainName = EthereumNetworkBase.getShortChainName(chainId);
        request.requester = signable.getOrigin();
        request.msg = signable.getUserMessage().toString();
        request.msgType = signable.getMessageType().toString();
        return getRiskSignTypedData(request, (int) signable.getChainId(), chainName, local);
    }

    private Single<RiskResponse> getRiskSignTypedData(SignTypedDataRiskRequest request,
                                                      int chainId,
                                                      String chainName,
                                                      String local) {
        final String requestJson = new Gson().toJson(request);
        final RequestBody requestBody = RequestBody.create(requestJson, HttpService.JSON_MEDIA_TYPE);
        final Request.Builder rqBuilder = new Request.Builder()
                .url(RISK_QUERY_URL)
                .post(requestBody);
        return Single.fromCallable(() -> {
            final Request rq = rqBuilder.build();
            try (Response response = client.newCall(rq).execute()) {
                if (response.code() / 200 == 1) {
                    final String jsonStr = response.body().string();
                    return new Gson().fromJson(jsonStr, RiskResponse.class);
                }
            } catch (Exception e) {
                Timber.e("getTxRisk, error:");
            }
            return new RiskResponse();
        });
    }

}
