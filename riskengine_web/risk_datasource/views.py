from django.shortcuts import render
from rest_framework import viewsets
from trusta_common.permissions import IsAdminOrIsOwner
from trusta_common.base_view import OwnerViewSet

from risk_datasource.models import RdsSource, ApiSource
from risk_datasource.serializers import RdsSourceSerializer, ApiSourceSerializer


class RdsSourceViewSet(OwnerViewSet):
    permission_classes = [IsAdminOrIsOwner]

    queryset = RdsSource.objects.all().order_by("id")
    serializer_class = RdsSourceSerializer


class ApiSourceViewSet(OwnerViewSet):
    permission_classes = [IsAdminOrIsOwner]

    queryset = ApiSource.objects.all().order_by("id")
    serializer_class = ApiSourceSerializer
