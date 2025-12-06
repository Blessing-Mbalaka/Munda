from django.db import models
from django.contrib.auth.models import User

# Category choices for different types of farming
FARMING_CATEGORIES = [
    ('crops', 'Crops'),
    ('livestock', 'Livestock'),
    ('poultry', 'Poultry'),
    ('aquaculture', 'Aquaculture'),
    ('horticulture', 'Horticulture'),
    ('mixed', 'Mixed Farming'),
]

PROJECT_STATUS = [
    ('todo', 'To Do'),
    ('in_progress', 'In Progress'),
    ('done', 'Done'),
]


class Farm(models.Model):
    """Model representing a farm"""
    name = models.CharField(max_length=200)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='farms')
    location = models.CharField(max_length=300)
    size_hectares = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=FARMING_CATEGORIES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.owner.username}"

    class Meta:
        ordering = ['-created_at']


class Crop(models.Model):
    """Model for managing crops"""
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='crops')
    name = models.CharField(max_length=100)
    variety = models.CharField(max_length=100, blank=True)
    planting_date = models.DateField()
    expected_harvest_date = models.DateField()
    actual_harvest_date = models.DateField(null=True, blank=True)
    area_hectares = models.DecimalField(max_digits=8, decimal_places=2)
    quantity_planted = models.DecimalField(max_digits=10, decimal_places=2, help_text="In kg or units")
    quantity_harvested = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=[
        ('planted', 'Planted'),
        ('growing', 'Growing'),
        ('harvested', 'Harvested'),
        ('failed', 'Failed'),
    ], default='planted')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.farm.name}"

    class Meta:
        ordering = ['-planting_date']


class Livestock(models.Model):
    """Model for managing livestock/cattle"""
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='livestock')
    animal_type = models.CharField(max_length=100, help_text="e.g., Goats, Cattle, Sheep, Pigs")
    breed = models.CharField(max_length=100, blank=True)
    tag_number = models.CharField(max_length=50, unique=True, help_text="Unique identifier")
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[
        ('male', 'Male'),
        ('female', 'Female'),
    ])
    weight_kg = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    health_status = models.CharField(max_length=20, choices=[
        ('healthy', 'Healthy'),
        ('sick', 'Sick'),
        ('quarantine', 'Quarantine'),
        ('deceased', 'Deceased'),
    ], default='healthy')
    purpose = models.CharField(max_length=50, choices=[
        ('meat', 'Meat Production'),
        ('dairy', 'Dairy Production'),
        ('breeding', 'Breeding'),
        ('sale', 'For Sale'),
    ], blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.animal_type} - {self.tag_number}"

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Livestock'


class FarmProject(models.Model):
    """Model for managing farm projects with Kanban board"""
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='projects')
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=FARMING_CATEGORIES)
    status = models.CharField(max_length=20, choices=PROJECT_STATUS, default='todo')
    priority = models.CharField(max_length=10, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ], default='medium')
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_projects')
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.farm.name}"

    class Meta:
        ordering = ['-created_at']


class PopulationStatistic(models.Model):
    """Model for tracking livestock population over time"""
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='population_stats')
    animal_type = models.CharField(max_length=100)
    count = models.IntegerField()
    date_recorded = models.DateField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.animal_type} - {self.count} on {self.date_recorded}"

    class Meta:
        ordering = ['-date_recorded']

