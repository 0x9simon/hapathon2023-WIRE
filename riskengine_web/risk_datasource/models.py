from trusta_common.base_model import BaseModel
from django.db import models

class RdsSource(BaseModel):
    source_name = models.CharField(max_length=256)
    source_type = models.IntegerField()
    rds_host = models.CharField(max_length=64)
    rds_port = models.CharField(max_length=8)
    rds_db = models.CharField(max_length=32)
    rds_username = models.CharField(max_length=64)
    rds_password = models.CharField(max_length=64)

    class Meta:
        db_table = "rds_source"
        


class ApiSource(BaseModel):
    source_name = models.CharField(max_length=256)
    source_type = models.IntegerField()
    endpoint = models.CharField(max_length=128)
    method = models.CharField(max_length=16)
    auth_type = models.CharField(max_length=16)
    auth_params = models.TextField()
    input_param = models.TextField()
    output_param = models.TextField()

    class Meta:
        db_table = "api_source"
    
    