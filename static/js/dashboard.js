// API endpoints
const API_BASE = '/api';
const FARMS_API = `${API_BASE}/farms/`;
const CROPS_API = `${API_BASE}/crops/`;
const LIVESTOCK_API = `${API_BASE}/livestock/`;
const PROJECTS_API = `${API_BASE}/projects/`;
const POPULATION_API = `${API_BASE}/population-stats/`;

// CSRF Token handling
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

// Fetch wrapper with CSRF token
async function apiRequest(url, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        }
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

// Charts
let cropsChart, livestockChart, projectsChart, populationChart;

// Load dashboard data
async function loadDashboardData() {
    try {
        // Load farms
        const farms = await apiRequest(FARMS_API);
        document.getElementById('totalFarms').textContent = farms.length;
        displayFarms(farms);
        
        // Load crops
        const crops = await apiRequest(CROPS_API);
        document.getElementById('totalCrops').textContent = crops.length;
        updateCropsChart(crops);
        
        // Load livestock
        const livestock = await apiRequest(LIVESTOCK_API);
        document.getElementById('totalLivestock').textContent = livestock.length;
        updateLivestockChart(livestock);
        
        // Load projects
        const projects = await apiRequest(PROJECTS_API);
        const activeProjects = projects.filter(p => p.status !== 'done');
        document.getElementById('activeProjects').textContent = activeProjects.length;
        updateProjectsChart(projects);
        
        // Load population stats
        const populationStats = await apiRequest(POPULATION_API);
        updatePopulationChart(populationStats);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Display farms
function displayFarms(farms) {
    const farmsList = document.getElementById('farmsList');
    farmsList.innerHTML = '';
    
    farms.forEach(farm => {
        const farmCard = document.createElement('div');
        farmCard.className = 'farm-card';
        farmCard.innerHTML = `
            <h3>${farm.name}</h3>
            <p><strong>Location:</strong> ${farm.location}</p>
            <p><strong>Size:</strong> ${farm.size_hectares} hectares</p>
            <p><strong>Category:</strong> ${farm.category}</p>
        `;
        farmsList.appendChild(farmCard);
    });
}

// Update crops chart
function updateCropsChart(crops) {
    const statusCounts = crops.reduce((acc, crop) => {
        acc[crop.status] = (acc[crop.status] || 0) + 1;
        return acc;
    }, {});
    
    const ctx = document.getElementById('cropsChart');
    if (cropsChart) {
        cropsChart.destroy();
    }
    
    cropsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: ['#3498db', '#2ecc71', '#f39c12', '#e74c3c']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

// Update livestock chart
function updateLivestockChart(livestock) {
    const typeCounts = livestock.reduce((acc, animal) => {
        acc[animal.animal_type] = (acc[animal.animal_type] || 0) + 1;
        return acc;
    }, {});
    
    const ctx = document.getElementById('livestockChart');
    if (livestockChart) {
        livestockChart.destroy();
    }
    
    livestockChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(typeCounts),
            datasets: [{
                label: 'Count',
                data: Object.values(typeCounts),
                backgroundColor: '#3498db'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Update projects chart
function updateProjectsChart(projects) {
    const statusCounts = projects.reduce((acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
    }, {});
    
    const ctx = document.getElementById('projectsChart');
    if (projectsChart) {
        projectsChart.destroy();
    }
    
    projectsChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: ['#f39c12', '#3498db', '#2ecc71']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

// Update population chart
function updatePopulationChart(stats) {
    // Group by animal type and sort by date
    const groupedData = stats.reduce((acc, stat) => {
        if (!acc[stat.animal_type]) {
            acc[stat.animal_type] = [];
        }
        acc[stat.animal_type].push({
            date: stat.date_recorded,
            count: stat.count
        });
        return acc;
    }, {});
    
    const datasets = Object.keys(groupedData).map((animalType, index) => {
        const colors = ['#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6'];
        return {
            label: animalType,
            data: groupedData[animalType].sort((a, b) => new Date(a.date) - new Date(b.date)).map(d => ({
                x: d.date,
                y: d.count
            })),
            borderColor: colors[index % colors.length],
            backgroundColor: 'transparent',
            tension: 0.4
        };
    });
    
    const ctx = document.getElementById('populationChart');
    if (populationChart) {
        populationChart.destroy();
    }
    
    populationChart = new Chart(ctx, {
        type: 'line',
        data: { datasets },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Modal functions
function showAddFarmModal() {
    document.getElementById('addFarmModal').style.display = 'block';
}

function closeAddFarmModal() {
    document.getElementById('addFarmModal').style.display = 'none';
    document.getElementById('addFarmForm').reset();
}

// Form submission
document.getElementById('addFarmForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('farmName').value,
        location: document.getElementById('farmLocation').value,
        size_hectares: document.getElementById('farmSize').value,
        category: document.getElementById('farmCategory').value,
        owner: 1 // Default user ID - in production, this should be the logged-in user
    };
    
    try {
        await apiRequest(FARMS_API, 'POST', formData);
        closeAddFarmModal();
        loadDashboardData();
    } catch (error) {
        console.error('Error adding farm:', error);
        alert('Error adding farm. Please try again.');
    }
});

// Load data on page load
document.addEventListener('DOMContentLoaded', loadDashboardData);
