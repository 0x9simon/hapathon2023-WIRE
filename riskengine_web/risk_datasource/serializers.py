from risk_datasource.models import RdsSource, ApiSource
from trusta_common.base_serializer import BaseSerializer

class RdsSourceSerializer(BaseSerializer):
    class Meta:
        model = RdsSource
        fields = '__all__'


class ApiSourceSerializer(BaseSerializer):
    class Meta:
        model = ApiSource
        fields = '__all__'
