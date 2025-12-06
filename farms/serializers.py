from rest_framework import serializers
from .models import Farm, Crop, Livestock, FarmProject, PopulationStatistic


class FarmSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    
    class Meta:
        model = Farm
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class CropSerializer(serializers.ModelSerializer):
    farm_name = serializers.ReadOnlyField(source='farm.name')
    
    class Meta:
        model = Crop
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class LivestockSerializer(serializers.ModelSerializer):
    farm_name = serializers.ReadOnlyField(source='farm.name')
    
    class Meta:
        model = Livestock
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class FarmProjectSerializer(serializers.ModelSerializer):
    farm_name = serializers.ReadOnlyField(source='farm.name')
    assigned_to_username = serializers.ReadOnlyField(source='assigned_to.username')
    
    class Meta:
        model = FarmProject
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class PopulationStatisticSerializer(serializers.ModelSerializer):
    farm_name = serializers.ReadOnlyField(source='farm.name')
    
    class Meta:
        model = PopulationStatistic
        fields = '__all__'
        read_only_fields = ['created_at']
