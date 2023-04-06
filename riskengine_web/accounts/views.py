from django.shortcuts import render
from rest_framework import viewsets
from trusta_common.permissions import IsAdminOrIsOwner
from trusta_common.base_view import OwnerViewSet

from accounts.models import Account, Project, ProjectApiKey, Scene, SceneStrategy
from accounts.serializers import AccountSerializer, ProjectSerializer, ProjectApiKeySerializer, SceneSerializer, SceneStrategySerializer


class AccountViewSet(OwnerViewSet):
    permission_classes = [IsAdminOrIsOwner]

    queryset = Account.objects.all().order_by("id")
    serializer_class = AccountSerializer


class ProjectViewSet(OwnerViewSet):
    permission_classes = [IsAdminOrIsOwner]

    queryset = Project.objects.all().order_by("id")
    serializer_class = ProjectSerializer


class ProjectApiKeyViewSet(OwnerViewSet):
    permission_classes = [IsAdminOrIsOwner]

    queryset = ProjectApiKey.objects.all().order_by("id")
    serializer_class = ProjectApiKeySerializer


class SceneViewSet(OwnerViewSet):
    permission_classes = [IsAdminOrIsOwner]

    queryset = Scene.objects.all().order_by("id")
    serializer_class = SceneSerializer


class SceneStrategyViewSet(OwnerViewSet):
    permission_classes = [IsAdminOrIsOwner]

    queryset = SceneStrategy.objects.all().order_by("id")
    serializer_class = SceneStrategySerializer
