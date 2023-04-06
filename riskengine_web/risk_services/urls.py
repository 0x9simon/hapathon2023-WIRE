from django.urls import path
from .views import RiskApiViewSet

risk_score = RiskApiViewSet.as_view({
    'post': 'risk_score'
})

urlpatterns = [
    path('risk_score/<str:scene_endpoint>', risk_score, name='risk_score'),
]