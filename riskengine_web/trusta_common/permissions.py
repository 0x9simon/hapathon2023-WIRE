import typing
from rest_framework import permissions
from django.core.cache import cache

import typing
from django.conf import settings
from django.http import HttpRequest
from rest_framework import permissions
from rest_framework_api_key.permissions import BaseHasAPIKey, HasAPIKey, KeyParser
from accounts.models import ProjectApiKey

import logging

logger = logging.getLogger("general")


class IsOwner(permissions.BasePermission):
   
    def has_object_permission(self, request, view, obj):
        
        # Instance must have an attribute named `owner`.
        logger.info("check owner")
        print(request.user.username)
        return obj.owner == request.user.username

class IsHeaderAuth(permissions.BasePermission):
   
    def has_permission(self, request, view):
        
        # Instance must have an attribute named `owner`.
        AUTH_HEADER_KEY = getattr(settings, "AUTH_HEADER_KEY", None)
        AUTH_TOKEN_PREFIX = getattr(settings, "AUTH_TOKEN_PREFIX", None)
        
        logger.info(AUTH_HEADER_KEY)
        logger.info(AUTH_TOKEN_PREFIX)

        if AUTH_HEADER_KEY is None:
            return False

        token = request.META.get(u"HTTP_%s" % AUTH_HEADER_KEY.upper())
        logger.info(token)
        print(token)
        if token is None or not token.startswith(AUTH_TOKEN_PREFIX):
            return False
        print(cache.get(token))
        token_auth = cache.get(token)

        return token_auth is not None


class IsAdminOrIsOwner(permissions.BasePermission):


    def has_object_permission(self, request, view):
        logger.info("-=====-")
        logger.info(request.user.username)
        return bool(request.user and request.user.is_staff)

    
    def has_object_permission(self, request, view, obj):
        
        # Instance must have an attribute named `owner`.
        logger.info(obj.owner)
        logger.info(request.user.username)
        return (obj.owner is not None and obj.owner == request.user.username) or bool(request.user and request.user.is_staff)


class ParamKeyParser(KeyParser):
    keyword = "apiKey"

    def get(self, request: HttpRequest) -> typing.Optional[str]:
        custom_parameter = getattr(settings, "API_KEY_CUSTOM_PARAMETER", None)

        if custom_parameter is not None:
            return self.get_from_parameter(request, custom_parameter)

        return self.get_from_parameter(request, self.keyword)

    def get_from_parameter(self, request: HttpRequest, name: str) -> typing.Optional[str]:
        if request.method == "GET":
            return request.GET.get(name) or None
        elif request.method == "POST":
            return request.POST.get(name) or None
        else:
            return request.GET.get(name) or None


class HasAPIKeyInParameter(HasAPIKey):
    key_parser = ParamKeyParser()



class HasProjectApiKeyAPIKey(BaseHasAPIKey):
    model = ProjectApiKey

    def has_permission(self, request: HttpRequest, view: typing.Any) -> bool:
        logger.info("check permission")
        assert self.model is not None, (
            "%s must define `.model` with the API key model to use"
            % self.__class__.__name__
        )
        key = self.get_key(request)
        if not key:
            return False
        
        if cache.get(key) is not None:
            logger.info("find cache %s, %s", key, cache.get(key) )
            return cache.get(key)
        else:
            _v =  self.model.objects.is_valid(key)
            cache.set(key, _v, getattr(settings, "API_KEY_CACHE_TIMEOUT", 3600))
            logger.info("new key cache %s, %s", key, _v)
            return _v