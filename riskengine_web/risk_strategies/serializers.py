from risk_strategies.models import Strategy, StrategyApiMapping, StrategyDist, StrategyRdsMapping
from trusta_common.base_serializer import BaseSerializer

class StrategySerializer(BaseSerializer):
    class Meta:
        model = Strategy
        fields = '__all__'


class StrategyApiMappingSerializer(BaseSerializer):
    class Meta:
        model = StrategyApiMapping
        fields = '__all__'


class StrategyDistSerializer(BaseSerializer):
    class Meta:
        model = StrategyDist
        fields = '__all__'


class StrategyRdsMappingSerializer(BaseSerializer):
    class Meta:
        model = StrategyRdsMapping
        fields = '__all__'
        