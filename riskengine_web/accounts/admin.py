from django.contrib import admin
from .models import Account, Project, ProjectApiKey, Scene, SceneStrategy
from rest_framework_api_key.admin import APIKeyModelAdmin

admin.site.register(Account)
admin.site.register(Project)
admin.site.register(Scene)
admin.site.register(SceneStrategy)

@admin.register(ProjectApiKey)
class ProjectApiKeyModelAdmin(APIKeyModelAdmin):
    pass