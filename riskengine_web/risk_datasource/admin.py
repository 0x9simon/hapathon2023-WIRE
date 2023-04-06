from django.contrib import admin
from .models import RdsSource, ApiSource

admin.site.register(RdsSource)
admin.site.register(ApiSource)
