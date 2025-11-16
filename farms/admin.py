from django.contrib import admin
from .models import Farm, Crop, Livestock, FarmProject, PopulationStatistic


@admin.register(Farm)
class FarmAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'category', 'size_hectares', 'location', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['name', 'owner__username', 'location']


@admin.register(Crop)
class CropAdmin(admin.ModelAdmin):
    list_display = ['name', 'farm', 'variety', 'planting_date', 'status', 'area_hectares']
    list_filter = ['status', 'planting_date']
    search_fields = ['name', 'variety', 'farm__name']


@admin.register(Livestock)
class LivestockAdmin(admin.ModelAdmin):
    list_display = ['tag_number', 'animal_type', 'breed', 'farm', 'gender', 'health_status']
    list_filter = ['animal_type', 'health_status', 'gender']
    search_fields = ['tag_number', 'animal_type', 'breed', 'farm__name']


@admin.register(FarmProject)
class FarmProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'farm', 'category', 'status', 'priority', 'start_date']
    list_filter = ['status', 'priority', 'category']
    search_fields = ['title', 'description', 'farm__name']


@admin.register(PopulationStatistic)
class PopulationStatisticAdmin(admin.ModelAdmin):
    list_display = ['farm', 'animal_type', 'count', 'date_recorded']
    list_filter = ['animal_type', 'date_recorded']
    search_fields = ['farm__name', 'animal_type']

