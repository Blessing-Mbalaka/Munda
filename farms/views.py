from django.shortcuts import render
from django.db.models import Count, Sum
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Farm, Crop, Livestock, FarmProject, PopulationStatistic
from .serializers import (
    FarmSerializer, CropSerializer, LivestockSerializer,
    FarmProjectSerializer, PopulationStatisticSerializer
)


# Template views
def dashboard(request):
    """Main dashboard view"""
    return render(request, 'farms/dashboard.html')


def crops_view(request):
    """Crops management view"""
    return render(request, 'farms/crops.html')


def livestock_view(request):
    """Livestock management view"""
    return render(request, 'farms/livestock.html')


def projects_view(request):
    """Projects kanban board view"""
    return render(request, 'farms/projects.html')


# API ViewSets
class FarmViewSet(viewsets.ModelViewSet):
    """API endpoint for farms"""
    queryset = Farm.objects.all()
    serializer_class = FarmSerializer

    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        """Get statistics for a specific farm"""
        farm = self.get_object()
        stats = {
            'total_crops': farm.crops.count(),
            'total_livestock': farm.livestock.count(),
            'total_projects': farm.projects.count(),
            'crops_by_status': dict(farm.crops.values('status').annotate(count=Count('id')).values_list('status', 'count')),
            'livestock_by_type': dict(farm.livestock.values('animal_type').annotate(count=Count('id')).values_list('animal_type', 'count')),
            'projects_by_status': dict(farm.projects.values('status').annotate(count=Count('id')).values_list('status', 'count')),
        }
        return Response(stats)


class CropViewSet(viewsets.ModelViewSet):
    """API endpoint for crops"""
    queryset = Crop.objects.all()
    serializer_class = CropSerializer

    def get_queryset(self):
        queryset = Crop.objects.all()
        farm_id = self.request.query_params.get('farm', None)
        if farm_id:
            queryset = queryset.filter(farm_id=farm_id)
        return queryset


class LivestockViewSet(viewsets.ModelViewSet):
    """API endpoint for livestock"""
    queryset = Livestock.objects.all()
    serializer_class = LivestockSerializer

    def get_queryset(self):
        queryset = Livestock.objects.all()
        farm_id = self.request.query_params.get('farm', None)
        if farm_id:
            queryset = queryset.filter(farm_id=farm_id)
        return queryset


class FarmProjectViewSet(viewsets.ModelViewSet):
    """API endpoint for farm projects"""
    queryset = FarmProject.objects.all()
    serializer_class = FarmProjectSerializer

    def get_queryset(self):
        queryset = FarmProject.objects.all()
        farm_id = self.request.query_params.get('farm', None)
        if farm_id:
            queryset = queryset.filter(farm_id=farm_id)
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        return queryset

    @action(detail=False, methods=['get'])
    def kanban(self, request):
        """Get projects organized by status for kanban board"""
        farm_id = request.query_params.get('farm', None)
        queryset = self.get_queryset()
        if farm_id:
            queryset = queryset.filter(farm_id=farm_id)
        
        kanban_data = {
            'todo': self.serializer_class(queryset.filter(status='todo'), many=True).data,
            'in_progress': self.serializer_class(queryset.filter(status='in_progress'), many=True).data,
            'done': self.serializer_class(queryset.filter(status='done'), many=True).data,
        }
        return Response(kanban_data)


class PopulationStatisticViewSet(viewsets.ModelViewSet):
    """API endpoint for population statistics"""
    queryset = PopulationStatistic.objects.all()
    serializer_class = PopulationStatisticSerializer

    def get_queryset(self):
        queryset = PopulationStatistic.objects.all()
        farm_id = self.request.query_params.get('farm', None)
        if farm_id:
            queryset = queryset.filter(farm_id=farm_id)
        return queryset

    @action(detail=False, methods=['get'])
    def trends(self, request):
        """Get population trends over time"""
        farm_id = request.query_params.get('farm', None)
        animal_type = request.query_params.get('animal_type', None)
        
        queryset = self.get_queryset()
        if farm_id:
            queryset = queryset.filter(farm_id=farm_id)
        if animal_type:
            queryset = queryset.filter(animal_type=animal_type)
        
        data = self.serializer_class(queryset.order_by('date_recorded'), many=True).data
        return Response(data)

