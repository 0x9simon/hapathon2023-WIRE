"""trusta_services URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path, re_path

from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from rest_framework import routers

# swagger
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# knox
from knox import views as knox_views
from trusta_common.views import LoginView

import risk_services.urls

# Routers provide an easy way of automatically determining the URL conf.
from accounts.views import AccountViewSet, ProjectViewSet, ProjectApiKeyViewSet, SceneViewSet, SceneStrategyViewSet
from risk_datasource.views import RdsSourceViewSet, ApiSourceViewSet
from risk_strategies.views import StrategyViewSet, StrategyDistViewSet, StrategyApiMappingViewSet, StrategyRdsMappingViewSet

router = routers.DefaultRouter()
router.register(r'account', AccountViewSet, basename="account")
router.register(r'project', ProjectViewSet, basename="project")
router.register(r'project_api_key', ProjectApiKeyViewSet, basename="project_api_key")
router.register(r'scene', SceneViewSet, basename="scene")
router.register(r'scene_strategy', SceneStrategyViewSet, basename="scene_strategy")

router.register(r'rds_source', RdsSourceViewSet, basename="rds_source")
router.register(r'api_source', ApiSourceViewSet, basename="api_source")

router.register(r'strategy', StrategyViewSet, basename="strategy")
router.register(r'strategy_dist', StrategyDistViewSet, basename="strategy_dist")
router.register(r'api_mapping', StrategyApiMappingViewSet, basename="api_mapping")
router.register(r'rds_mapping', StrategyRdsMappingViewSet, basename="rds_mapping")


# swagger views
schema_view = get_schema_view(
   openapi.Info(
      title="Snippets API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    # swagger path
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    

    # knox login
    path(r'login/', LoginView.as_view(), name='knox_login'),
    path(r'logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
    path(r'logoutall/', knox_views.LogoutAllView.as_view(), name='knox_logoutall'),

    # api service
    path(r'risk_api/', include(risk_services.urls)),
]

urlpatterns += staticfiles_urlpatterns()
