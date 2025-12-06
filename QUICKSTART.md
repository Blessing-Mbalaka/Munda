# Quick Start Guide

## Farm Management System (Munda)

This guide will help you get started with the Farm Management System.

## Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Blessing-Mbalaka/Munda.git
   cd Munda
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up the database**
   ```bash
   python manage.py migrate
   ```

4. **Load sample data (optional but recommended for testing)**
   ```bash
   python manage.py load_sample_data
   ```
   This creates:
   - Sample user: `farmer` / password: `farmer123`
   - 2 sample farms
   - 3 sample crops
   - 4 sample livestock
   - 3 sample projects
   - Population statistics

5. **Create your own admin user**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start the development server**
   ```bash
   python manage.py runserver
   ```

7. **Access the application**
   - Main app: http://localhost:8000/
   - Admin panel: http://localhost:8000/admin/

## Using the Application

### Dashboard (http://localhost:8000/)
- View statistics for all your farms
- See charts showing crop status, livestock distribution, and project progress
- Add new farms using the "Add New Farm" button

### Crops Management (http://localhost:8000/crops/)
- Add new crops with planting and harvest dates
- Track crop status (planted, growing, harvested, failed)
- Filter crops by farm
- Edit or delete existing crops

### Livestock Management (http://localhost:8000/livestock/)
- Add livestock with unique tag numbers
- Track animal type, breed, weight, and health status
- Monitor purpose (breeding, meat, dairy, sale)
- Filter livestock by farm
- Edit or delete livestock records

### Projects - Kanban Board (http://localhost:8000/projects/)
- Create farm projects with categories
- Drag and drop projects between "To Do", "In Progress", and "Done"
- Set priority levels and budgets
- Filter projects by farm

## API Usage

All data is accessible via RESTful APIs at `/api/` endpoints:

### List all farms
```bash
curl http://localhost:8000/api/farms/
```

### Get farm statistics
```bash
curl http://localhost:8000/api/farms/1/statistics/
```

### List crops (optionally filtered by farm)
```bash
curl http://localhost:8000/api/crops/
curl http://localhost:8000/api/crops/?farm=1
```

### Get Kanban board data
```bash
curl http://localhost:8000/api/projects/kanban/
```

### Add a new crop
```bash
curl -X POST http://localhost:8000/api/crops/ \
  -H "Content-Type: application/json" \
  -d '{
    "farm": 1,
    "name": "Corn",
    "variety": "Sweet Corn",
    "planting_date": "2024-01-15",
    "expected_harvest_date": "2024-05-15",
    "area_hectares": 10.5,
    "quantity_planted": 300,
    "status": "planted"
  }'
```

## Features Overview

### Supported Farming Categories
- Crops
- Livestock
- Poultry
- Aquaculture
- Horticulture
- Mixed Farming

### Data Visualizations (Chart.js)
- Crops by Status (Doughnut Chart)
- Livestock by Type (Bar Chart)
- Projects by Status (Pie Chart)
- Population Trends (Line Chart)

### Project Management
- Kanban board with drag-and-drop
- Priority levels (Low, Medium, High)
- Budget tracking
- Date management

## Admin Panel

Access the Django admin panel at http://localhost:8000/admin/ to:
- Manage users and permissions
- Bulk edit data
- View detailed records
- Generate reports

## Customization

### Adding New Fields
1. Edit `farms/models.py` to add fields to models
2. Create and apply migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
3. Update serializers in `farms/serializers.py`
4. Update frontend templates and JavaScript as needed

### Changing the Database
To use PostgreSQL or MySQL instead of SQLite, update `DATABASES` in `farm_management/settings.py`.

## Troubleshooting

### Static files not loading
```bash
python manage.py collectstatic
```

### Charts not displaying
Ensure you have internet connection (Chart.js is loaded from CDN)

### API errors
Check that you're including CSRF tokens in POST requests

## Support

For issues or questions, please open an issue on GitHub.
