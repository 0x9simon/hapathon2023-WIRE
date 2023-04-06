from django.shortcuts import render
from rest_framework import viewsets
from django.contrib.auth.models import User

class OwnerViewSet(viewsets.ModelViewSet):
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)