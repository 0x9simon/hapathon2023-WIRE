from rest_framework import viewsets
from trusta_common.permissions import IsAdminOrIsOwner
from trusta_common.base_view import OwnerViewSet

from risk_strategies.models import Strategy, StrategyDist, StrategyApiMapping, StrategyRdsMapping
from risk_strategies.serializers import StrategySerializer, StrategyDistSerializer, StrategyApiMappingSerializer, StrategyRdsMappingSerializer


class StrategyViewSet(OwnerViewSet):
    permission_classes = [IsAdminOrIsOwner]

    queryset = Strategy.objects.all().order_by("id")
    serializer_class = StrategySerializer


class StrategyDistViewSet(OwnerViewSet):
    permission_classes = [IsAdminOrIsOwner]

    queryset = StrategyDist.objects.all().order_by("id")
    serializer_class = StrategyDistSerializer


class StrategyApiMappingViewSet(OwnerViewSet):
    permission_classes = [IsAdminOrIsOwner]

    queryset = StrategyApiMapping.objects.all().order_by("id")
    serializer_class = StrategyApiMappingSerializer


class StrategyRdsMappingViewSet(OwnerViewSet):
    permission_classes = [IsAdminOrIsOwner]

    queryset = StrategyRdsMapping.objects.all().order_by("id")
    serializer_class = StrategyRdsMappingSerializer
    