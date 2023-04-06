from accounts.models import Account, Project, ProjectApiKey, Scene, SceneStrategy
from rest_framework import serializers
from trusta_common.base_serializer import BaseSerializer

from django.contrib.auth.models import User


class AccountSerializer(BaseSerializer):
    class Meta:
        model = Account
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ['id', 'username']


class ProjectSerializer(BaseSerializer):
    class Meta:
        model = Project
        fields = '__all__'


class ProjectApiKeySerializer(BaseSerializer):
    class Meta:
        model = ProjectApiKey
        fields = '__all__'


class SceneSerializer(BaseSerializer):
    class Meta:
        model = Scene
        fields = '__all__'


class SceneStrategySerializer(BaseSerializer):
    class Meta:
        model = SceneStrategy
        fields = '__all__'
