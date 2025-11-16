// API endpoints
const API_BASE = '/api';
const FARMS_API = `${API_BASE}/farms/`;
const CROPS_API = `${API_BASE}/crops/`;

// CSRF Token
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

// Load farms for filter
async function loadFarms() {
    try {
        const farms = await apiRequest(FARMS_API);
        const farmFilter = document.getElementById('farmFilter');
        const cropFarm = document.getElementById('cropFarm');
        
        farmFilter.innerHTML = '<option value="">All Farms</option>';
        cropFarm.innerHTML = '<option value="">Select Farm</option>';
        
        farms.forEach(farm => {
            const option1 = document.createElement('option');
            option1.value = farm.id;
            option1.textContent = farm.name;
            farmFilter.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = farm.id;
            option2.textContent = farm.name;
            cropFarm.appendChild(option2);
        });
    } catch (error) {
        console.error('Error loading farms:', error);
    }
}

// Load crops
async function loadCrops(farmId = '') {
    try {
        let url = CROPS_API;
        if (farmId) {
            url += `?farm=${farmId}`;
        }
        
        const crops = await apiRequest(url);
        displayCrops(crops);
    } catch (error) {
        console.error('Error loading crops:', error);
    }
}

// Display crops in table
function displayCrops(crops) {
    const cropsTable = document.getElementById('cropsTable');
    
    if (crops.length === 0) {
        cropsTable.innerHTML = '<p style="padding: 2rem; text-align: center;">No crops found. Add your first crop!</p>';
        return;
    }
    
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Farm</th>
                    <th>Variety</th>
                    <th>Planting Date</th>
                    <th>Expected Harvest</th>
                    <th>Area (ha)</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    crops.forEach(crop => {
        tableHTML += `
            <tr>
                <td>${crop.name}</td>
                <td>${crop.farm_name || 'N/A'}</td>
                <td>${crop.variety || '-'}</td>
                <td>${crop.planting_date}</td>
                <td>${crop.expected_harvest_date}</td>
                <td>${crop.area_hectares}</td>
                <td><span class="status-badge status-${crop.status}">${crop.status}</span></td>
                <td>
                    <button class="btn btn-sm" onclick="editCrop(${crop.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCrop(${crop.id})">Delete</button>
                </td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    cropsTable.innerHTML = tableHTML;
}

// Modal functions
function showAddCropModal() {
    document.getElementById('addCropModal').style.display = 'block';
}

function closeAddCropModal() {
    document.getElementById('addCropModal').style.display = 'none';
    document.getElementById('addCropForm').reset();
}

// Form submission
document.getElementById('addCropForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        farm: document.getElementById('cropFarm').value,
        name: document.getElementById('cropName').value,
        variety: document.getElementById('cropVariety').value,
        planting_date: document.getElementById('plantingDate').value,
        expected_harvest_date: document.getElementById('harvestDate').value,
        area_hectares: document.getElementById('cropArea').value,
        quantity_planted: document.getElementById('quantityPlanted').value,
        status: document.getElementById('cropStatus').value,
        notes: document.getElementById('cropNotes').value
    };
    
    try {
        await apiRequest(CROPS_API, 'POST', formData);
        closeAddCropModal();
        loadCrops();
    } catch (error) {
        console.error('Error adding crop:', error);
        alert('Error adding crop. Please try again.');
    }
});

// Filter crops by farm
document.getElementById('farmFilter').addEventListener('change', (e) => {
    loadCrops(e.target.value);
});

// Delete crop
async function deleteCrop(cropId) {
    if (confirm('Are you sure you want to delete this crop?')) {
        try {
            await apiRequest(`${CROPS_API}${cropId}/`, 'DELETE');
            loadCrops();
        } catch (error) {
            console.error('Error deleting crop:', error);
            alert('Error deleting crop. Please try again.');
        }
    }
}

// Edit crop (placeholder)
function editCrop(cropId) {
    alert('Edit functionality coming soon!');
}

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadFarms();
    loadCrops();
});
