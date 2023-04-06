import typing
from trusta_common.base_model import BaseModel
from risk_strategies.models import StrategyDist
from django.db import models
from rest_framework_api_key.models import AbstractAPIKey, BaseAPIKeyManager

import random
import string
from django.conf import settings

import logging

logger = logging.getLogger("general")

def generate_api_endpoint():
    _n = settings.API_ENDPOINT_LENGTH
    return ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(_n))


class Account(BaseModel):
    account_type = models.IntegerField()
    account_name = models.CharField(max_length=64)

    class Meta:
        db_table = "account"
    

class Project(BaseModel):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    project_name = models.CharField(max_length=64)
    project_type = models.IntegerField()

    class Meta:
        db_table = "project"

class ProjectApiKey(AbstractAPIKey):
    project = models.ForeignKey(Project, 
                                on_delete=models.CASCADE,
                                related_name="api_keys")
    
    def is_valid(self, key: str) -> bool:
        logger.info("verify key")
        return type(self).objects.key_generator.verify(key, self.hashed_key)
    
    class Meta:
        db_table = "project_api_key"
        ordering = ("-created",)
        verbose_name = "project API key"
        verbose_name_plural = "project API keys"
    

class Scene(BaseModel):
    account_project = models.ForeignKey(Project, on_delete=models.CASCADE)
    scene_name = models.CharField(max_length=128)
    api_endpoint = models.CharField(max_length=128, default=generate_api_endpoint)
    is_activate = models.BooleanField()

    class Meta:
        db_table = "project_scene"


class SceneStrategy(BaseModel):
    project_scene = models.ForeignKey(Scene, on_delete=models.DO_NOTHING)
    strategy_dist = models.ForeignKey(StrategyDist, on_delete=models.DO_NOTHING)
    ratio = models.FloatField()
    is_activate = models.BooleanField()

    class Meta:
        db_table = "scene_strategy"
