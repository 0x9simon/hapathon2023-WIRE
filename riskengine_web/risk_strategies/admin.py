from django.contrib import admin
from .models import Strategy, StrategyDist, StrategyRdsMapping, StrategyApiMapping

admin.site.register(Strategy)
admin.site.register(StrategyDist)
admin.site.register(StrategyRdsMapping)
admin.site.register(StrategyApiMapping)
