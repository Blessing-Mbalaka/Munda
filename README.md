# Farm Management System (Munda)

A comprehensive Django-based farm management application with a modern web interface built using HTML, CSS, and JavaScript. This system helps farmers monitor crops, livestock, and farm projects through an intuitive dashboard with data visualizations using Chart.js and a Kanban board for project management.

## Features

### 1. Dashboard
- Real-time statistics for farms, crops, livestock, and projects
- Interactive charts powered by Chart.js:
  - Crops by status (doughnut chart)
  - Livestock by type (bar chart)
  - Projects by status (pie chart)
  - Population trends over time (line chart)
- Farm overview cards

### 2. Crops Management
- Add, view, edit, and delete crop records
- Track planting and harvest dates
- Monitor crop status (planted, growing, harvested, failed)
- Filter crops by farm
- Record area, quantity planted, and harvested amounts

### 3. Livestock Management
- Manage all types of livestock (goats, cattle, sheep, pigs, etc.)
- Track individual animals with unique tag numbers
- Monitor health status and weight
- Record breeding, purpose, and gender
- Filter livestock by farm

### 4. Farm Projects - Kanban Board
- Drag-and-drop Kanban board for project management
- Three columns: To Do, In Progress, Done
- Categorize projects by farming type
- Set priority levels (low, medium, high)
- Track budgets and dates
- Filter projects by farm

### 5. Population Statistics
- Track livestock population trends over time
- Visual representation of population changes
- Support for multiple animal types

### 6. Category Classifications
Supports all major farming categories:
- Crops
- Livestock
- Poultry
- Aquaculture
- Horticulture
- Mixed Farming

## Technology Stack

### Backend
- **Django 5.x** - Web framework
- **Django REST Framework** - API endpoints
- **SQLite** - Database (can be easily switched to PostgreSQL/MySQL)

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with modern responsive design
- **JavaScript (Vanilla)** - Frontend logic
- **Chart.js** - Data visualizations

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Blessing-Mbalaka/Munda.git
   cd Munda
   ```

2. **Create a virtual environment (recommended)**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**
   ```bash
   python manage.py migrate
   ```

5. **Create a superuser**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the development server**
   ```bash
   python manage.py runserver
   ```

7. **Access the application**
   - Main application: http://localhost:8000/
   - Admin panel: http://localhost:8000/admin/

## API Endpoints

The application provides RESTful API endpoints for all resources:

### Farms
- `GET /api/farms/` - List all farms
- `POST /api/farms/` - Create a new farm
- `GET /api/farms/{id}/` - Get farm details
- `PUT /api/farms/{id}/` - Update farm
- `DELETE /api/farms/{id}/` - Delete farm
- `GET /api/farms/{id}/statistics/` - Get farm statistics

### Crops
- `GET /api/crops/` - List all crops
- `POST /api/crops/` - Create a new crop
- `GET /api/crops/{id}/` - Get crop details
- `PUT /api/crops/{id}/` - Update crop
- `DELETE /api/crops/{id}/` - Delete crop
- Query parameter: `?farm={farm_id}` to filter by farm

### Livestock
- `GET /api/livestock/` - List all livestock
- `POST /api/livestock/` - Create new livestock
- `GET /api/livestock/{id}/` - Get livestock details
- `PUT /api/livestock/{id}/` - Update livestock
- `DELETE /api/livestock/{id}/` - Delete livestock
- Query parameter: `?farm={farm_id}` to filter by farm

### Projects
- `GET /api/projects/` - List all projects
- `POST /api/projects/` - Create a new project
- `GET /api/projects/{id}/` - Get project details
- `PUT /api/projects/{id}/` - Update project
- `DELETE /api/projects/{id}/` - Delete project
- `GET /api/projects/kanban/` - Get projects organized by status
- Query parameters: `?farm={farm_id}`, `?status={status}`

### Population Statistics
- `GET /api/population-stats/` - List all population statistics
- `POST /api/population-stats/` - Create new statistic
- `GET /api/population-stats/trends/` - Get population trends
- Query parameters: `?farm={farm_id}`, `?animal_type={type}`

## Usage

### Adding a Farm
1. Navigate to the Dashboard
2. Click "Add New Farm"
3. Fill in farm details (name, location, size, category)
4. Submit the form

### Managing Crops
1. Go to the Crops page
2. Click "Add New Crop"
3. Select the farm and fill in crop details
4. Track planting and harvest dates
5. Update status as crops progress

### Managing Livestock
1. Go to the Livestock page
2. Click "Add New Livestock"
3. Enter animal details with unique tag number
4. Track health status and weight
5. Update records as needed

### Using the Kanban Board
1. Go to the Projects page
2. Create new projects with "Add New Project"
3. Drag and drop cards between columns (To Do, In Progress, Done)
4. Projects automatically update when moved

## Project Structure

```
Munda/
├── farm_management/        # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── farms/                  # Main application
│   ├── models.py          # Data models
│   ├── serializers.py     # API serializers
│   ├── views.py           # Views and API endpoints
│   ├── admin.py           # Admin configuration
│   ├── urls.py            # URL routing
│   └── templates/farms/   # HTML templates
│       ├── base.html
│       ├── dashboard.html
│       ├── crops.html
│       ├── livestock.html
│       └── projects.html
├── static/                 # Static files
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── dashboard.js
│       ├── crops.js
│       ├── livestock.js
│       └── projects.js
├── manage.py
└── requirements.txt
```

## Data Models

### Farm
- Name, owner, location, size, category
- Related to crops, livestock, projects, and statistics

### Crop
- Name, variety, planting/harvest dates
- Area, quantity, status, notes
- Belongs to a farm

### Livestock
- Animal type, breed, tag number
- Birth date, gender, weight
- Health status, purpose, notes
- Belongs to a farm

### FarmProject
- Title, description, category
- Status (todo, in_progress, done)
- Priority, dates, budget
- Belongs to a farm

### PopulationStatistic
- Animal type, count, date
- Tracks population changes over time
- Belongs to a farm

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For support, please open an issue in the GitHub repository.
