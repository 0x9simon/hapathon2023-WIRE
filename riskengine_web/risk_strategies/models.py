from trusta_common.base_model import BaseModel
from django.db import models
from risk_datasource.models import RdsSource, ApiSource


class Strategy(BaseModel):
    strategy_type = models.IntegerField()
    strategy_name = models.CharField(max_length=64)
    input = models.TextField()
    output = models.TextField()

    class Meta:
        db_table = "strategy"


class StrategyDist(BaseModel):
    risk_strategy = models.ForeignKey(Strategy, on_delete=models.DO_NOTHING)
    dist_version = models.CharField(max_length=32)
    dist_tag = models.CharField(max_length=64)
    dist_file = models.CharField(max_length=256)

    class Meta:
        db_table = "strategy_dist"


class StrategyRdsMapping(BaseModel):
    risk_strategy = models.ForeignKey(Strategy, on_delete=models.DO_NOTHING)
    rds_source = models.ForeignKey(RdsSource, on_delete=models.DO_NOTHING)
    sql_pattern = models.TextField()
    sql_params = models.TextField()
    sql_output = models.TextField()

    class Meta:
        db_table = "strategy_rds_mapping"


class StrategyApiMapping(BaseModel):
    risk_strategy = models.ForeignKey(Strategy, on_delete=models.DO_NOTHING)
    api_source = models.ForeignKey(ApiSource, on_delete=models.DO_NOTHING)
    
    class Meta:
        db_table = "strategy_api_mapping"
        