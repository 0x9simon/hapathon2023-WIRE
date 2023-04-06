from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now

class BaseModel(models.Model):
    id = models.BigAutoField(primary_key=True)
    owner = models.ForeignKey(User, default="", on_delete=models.DO_NOTHING)
    created_at = models.DateTimeField(default=now)
    modified_at = models.DateTimeField(default=now)

    class Meta:
        abstract = True
        
