from django.contrib.auth import login

from rest_framework import permissions
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

class LoginView(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    @swagger_auto_schema(request_body=openapi.Schema(type=openapi.TYPE_OBJECT,
    required=[
        "username", 
        "password"
    ],
    properties={
        "username": openapi.Schema(type=openapi.TYPE_STRING),
        "password": openapi.Schema(type=openapi.TYPE_STRING)
    }), operation_summary='登录')
    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super(LoginView, self).post(request, format=None)