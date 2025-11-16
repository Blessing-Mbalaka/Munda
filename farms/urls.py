from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# API router
router = DefaultRouter()
router.register(r'farms', views.FarmViewSet)
router.register(r'crops', views.CropViewSet)
router.register(r'livestock', views.LivestockViewSet)
router.register(r'projects', views.FarmProjectViewSet)
router.register(r'population-stats', views.PopulationStatisticViewSet)

app_name = 'farms'

urlpatterns = [
    # Template views
    path('', views.dashboard, name='dashboard'),
    path('crops/', views.crops_view, name='crops'),
    path('livestock/', views.livestock_view, name='livestock'),
    path('projects/', views.projects_view, name='projects'),
    
    # API endpoints
    path('api/', include(router.urls)),
]
