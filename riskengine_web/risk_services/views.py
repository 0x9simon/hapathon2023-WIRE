from trusta_common.permissions import HasProjectApiKeyAPIKey
from trusta_common.custom_exception import RiskErrorCode, RiskScoreException

from rest_framework.decorators import action
from rest_framework.response import Response

from rest_framework import viewsets

from django.shortcuts import get_object_or_404

from accounts.models import Scene
from accounts.serializers import SceneSerializer

import json
import requests
import pymysql
import datetime

from django.conf import settings

import logging
# Get an instance of a logger
logger = logging.getLogger("general")

class RiskApiViewSet(viewsets.GenericViewSet):
    
    permission_classes = [HasProjectApiKeyAPIKey]
    queryset = Scene.objects.all().order_by("id")
    serializer_class = SceneSerializer
    
    conn_mapping = {}

    model_type = {
            1: "qlexpress",
            2: "pythonscript",
            3: "pmml",
        }

    def make_rds_conn(self, rds_source):
        _conn = pymysql.connect(host=rds_source.rds_host,
                                user=rds_source.rds_username,
                                password=rds_source.rds_password,
                                database=rds_source.rds_db,
                                port=int(rds_source.rds_port),
                                cursorclass=pymysql.cursors.DictCursor)
        return _conn


    def fetch_rds(self, source, mapping, context):

        if not self.conn_mapping.get(source.id):
            try:
                self.conn_mapping[source.id] = self.make_rds_conn(source)
            except Exception as e:
                raise RiskScoreException(RiskErrorCode.RDS_CONNECT_ERROR)
        
        _cur = self.conn_mapping[source.id].cursor()
        
        sql_str = mapping.sql_pattern
        params = json.loads(mapping.sql_params)

        for ks in params:
            if params[ks] in context:
                sql_str = sql_str.replace("{%s}" % ks, str(context[params[ks]]))
            else:
                print(params[ks])
                print(context)
                raise RiskScoreException(RiskErrorCode.RDS_INPUT_PARAM_MISMATCH)

        try:
            _cur.execute(sql_str)
            r = _cur.fetchall()[0]
        except Exception as e:
            raise RiskScoreException(RiskErrorCode.RDS_SQL_EXEC_FAILED)

        if len(r) > 0:
            output = json.loads(mapping.sql_output)
            for ks in output:
                out_key = output[ks]
                if ks in r:
                    context[out_key] = r[ks]
                else:
                    print(out_key)
                    print(r)
                    raise RiskScoreException(RiskErrorCode.RDS_OUTPUT_PARAM_MISMATCH)
        
        return


    def fetch_api(self, source, mapping, context):
        url = source.endpoint
        data = {}
        params = json.loads(source.input_param)
        for ks in params:
            data[ks] = context[params[ks]]
        
        if source.method == "POST":
            r = requests.post(url, data=json.dumps(data))
        else:
            r = requests.get(url, data=json.dumps(data))

        t = json.loads(r.text)
        output = json.loads(source.output_param)
        for ks in output:
            context[output[ks]] = t[ks]


    def fetch_riskscore(self, strategy_dist, context):

        risk_strategy = strategy_dist.risk_strategy
        
        url = "{endpoint}/{type}".format(
                endpoint=settings.RISK_CALCULATE_ENDPOINT, 
                type=self.model_type[risk_strategy.strategy_type]
            )
        try:
            inputs = {
                k:context[k] for k in json.loads(risk_strategy.input)
            }
        except Exception as e:
            print(e)
            raise RiskScoreException(RiskErrorCode.STRATEGY_INPUT_MISMATCH)

        data = {
            "inputs": inputs,
            "outputs": json.loads(risk_strategy.output),
            "target": strategy_dist.dist_file 
        }
        
        resp = requests.post(url, data=json.dumps(data))
        print(resp.text)
        return json.loads(resp.text)
    

    @action(methods="post", detail=True)
    def risk_score(self, request, scene_endpoint):
        logger.info("request risk_score")
        try:
            context = json.loads(request.body)
        except Exception as e:
            raise RiskScoreException(RiskErrorCode.PARAM_LOAD_FAILED)

        try:
            scene = get_object_or_404(Scene, api_endpoint=scene_endpoint)
            scene_strategy = scene.scenestrategy_set.all()[0]
            
            strategy_dist = scene_strategy.strategy_dist
            strategy = strategy_dist.risk_strategy
        except Exception as e:
            raise RiskScoreException(RiskErrorCode.STRATEGY_LOAD_FAILED)

        # load rds mapping
        for strategy_rds_mapping in strategy.strategyrdsmapping_set.all():
            rds_source = strategy_rds_mapping.rds_source
            self.fetch_rds(rds_source, strategy_rds_mapping, context)

        # load api mapping
        for strategy_api_mapping in strategy.strategyapimapping_set.all():
            api_source = strategy_api_mapping.api_source
            self.fetch_api(api_source, strategy_api_mapping, context)

        
        # fetch score
        resp = self.fetch_riskscore(strategy_dist, context)
        
        logger.info("request end")

        if resp.get("code") == 0:
            return Response(resp["data"])
        else:
            raise RiskScoreException(RiskErrorCode.STRATEGY_EXEC_FAILED)
        
