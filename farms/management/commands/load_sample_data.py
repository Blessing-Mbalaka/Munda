from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from farms.models import Farm, Crop, Livestock, FarmProject, PopulationStatistic
from datetime import date, timedelta


class Command(BaseCommand):
    help = 'Load sample data for the farm management system'

    def handle(self, *args, **kwargs):
        self.stdout.write('Loading sample data...')

        # Create a sample user if it doesn't exist
        user, created = User.objects.get_or_create(
            username='farmer',
            defaults={'email': 'farmer@example.com'}
        )
        if created:
            user.set_password('farmer123')
            user.save()
            self.stdout.write(self.style.SUCCESS('Created user: farmer (password: farmer123)'))

        # Create sample farms
        farm1, _ = Farm.objects.get_or_create(
            name='Green Valley Farm',
            defaults={
                'owner': user,
                'location': 'Northern Region',
                'size_hectares': 50.5,
                'category': 'mixed'
            }
        )

        farm2, _ = Farm.objects.get_or_create(
            name='Sunrise Livestock Ranch',
            defaults={
                'owner': user,
                'location': 'Eastern Province',
                'size_hectares': 100.0,
                'category': 'livestock'
            }
        )

        self.stdout.write(self.style.SUCCESS(f'Created farms: {farm1.name}, {farm2.name}'))

        # Create sample crops
        crops_data = [
            {
                'farm': farm1,
                'name': 'Maize',
                'variety': 'Hybrid 614',
                'planting_date': date.today() - timedelta(days=60),
                'expected_harvest_date': date.today() + timedelta(days=60),
                'area_hectares': 20.0,
                'quantity_planted': 500.0,
                'status': 'growing'
            },
            {
                'farm': farm1,
                'name': 'Wheat',
                'variety': 'Spring Wheat',
                'planting_date': date.today() - timedelta(days=90),
                'expected_harvest_date': date.today() + timedelta(days=30),
                'area_hectares': 15.5,
                'quantity_planted': 400.0,
                'status': 'growing'
            },
            {
                'farm': farm1,
                'name': 'Tomatoes',
                'variety': 'Roma',
                'planting_date': date.today() - timedelta(days=120),
                'expected_harvest_date': date.today() - timedelta(days=10),
                'area_hectares': 5.0,
                'quantity_planted': 200.0,
                'quantity_harvested': 1500.0,
                'status': 'harvested',
                'actual_harvest_date': date.today() - timedelta(days=10)
            }
        ]

        for crop_data in crops_data:
            Crop.objects.get_or_create(
                farm=crop_data['farm'],
                name=crop_data['name'],
                defaults=crop_data
            )

        self.stdout.write(self.style.SUCCESS('Created sample crops'))

        # Create sample livestock
        livestock_data = [
            {
                'farm': farm2,
                'animal_type': 'Goats',
                'breed': 'Boer',
                'tag_number': 'GT001',
                'gender': 'female',
                'weight_kg': 45.5,
                'health_status': 'healthy',
                'purpose': 'breeding'
            },
            {
                'farm': farm2,
                'animal_type': 'Goats',
                'breed': 'Boer',
                'tag_number': 'GT002',
                'gender': 'male',
                'weight_kg': 55.0,
                'health_status': 'healthy',
                'purpose': 'breeding'
            },
            {
                'farm': farm2,
                'animal_type': 'Cattle',
                'breed': 'Angus',
                'tag_number': 'CT001',
                'gender': 'female',
                'weight_kg': 450.0,
                'health_status': 'healthy',
                'purpose': 'dairy'
            },
            {
                'farm': farm1,
                'animal_type': 'Sheep',
                'breed': 'Merino',
                'tag_number': 'SP001',
                'gender': 'female',
                'weight_kg': 60.0,
                'health_status': 'healthy',
                'purpose': 'meat'
            }
        ]

        for livestock_item in livestock_data:
            Livestock.objects.get_or_create(
                tag_number=livestock_item['tag_number'],
                defaults=livestock_item
            )

        self.stdout.write(self.style.SUCCESS('Created sample livestock'))

        # Create sample projects
        projects_data = [
            {
                'farm': farm1,
                'title': 'Install Irrigation System',
                'description': 'Install drip irrigation for the vegetable section',
                'category': 'crops',
                'status': 'in_progress',
                'priority': 'high',
                'start_date': date.today() - timedelta(days=10),
                'budget': 15000.00
            },
            {
                'farm': farm2,
                'title': 'Expand Goat Housing',
                'description': 'Build additional shelter for growing goat herd',
                'category': 'livestock',
                'status': 'todo',
                'priority': 'medium',
                'start_date': date.today() + timedelta(days=7),
                'budget': 8000.00
            },
            {
                'farm': farm1,
                'title': 'Soil Testing',
                'description': 'Conduct comprehensive soil testing across all fields',
                'category': 'crops',
                'status': 'done',
                'priority': 'high',
                'start_date': date.today() - timedelta(days=30),
                'end_date': date.today() - timedelta(days=15),
                'budget': 2000.00
            }
        ]

        for project_data in projects_data:
            FarmProject.objects.get_or_create(
                farm=project_data['farm'],
                title=project_data['title'],
                defaults=project_data
            )

        self.stdout.write(self.style.SUCCESS('Created sample projects'))

        # Create sample population statistics
        stats_data = [
            {
                'farm': farm2,
                'animal_type': 'Goats',
                'count': 25,
                'date_recorded': date.today() - timedelta(days=90)
            },
            {
                'farm': farm2,
                'animal_type': 'Goats',
                'count': 28,
                'date_recorded': date.today() - timedelta(days=60)
            },
            {
                'farm': farm2,
                'animal_type': 'Goats',
                'count': 32,
                'date_recorded': date.today() - timedelta(days=30)
            },
            {
                'farm': farm2,
                'animal_type': 'Goats',
                'count': 35,
                'date_recorded': date.today()
            },
            {
                'farm': farm2,
                'animal_type': 'Cattle',
                'count': 10,
                'date_recorded': date.today() - timedelta(days=90)
            },
            {
                'farm': farm2,
                'animal_type': 'Cattle',
                'count': 12,
                'date_recorded': date.today() - timedelta(days=60)
            },
            {
                'farm': farm2,
                'animal_type': 'Cattle',
                'count': 12,
                'date_recorded': date.today()
            }
        ]

        for stat_data in stats_data:
            PopulationStatistic.objects.get_or_create(
                farm=stat_data['farm'],
                animal_type=stat_data['animal_type'],
                date_recorded=stat_data['date_recorded'],
                defaults=stat_data
            )

        self.stdout.write(self.style.SUCCESS('Created sample population statistics'))
        self.stdout.write(self.style.SUCCESS('Sample data loaded successfully!'))
