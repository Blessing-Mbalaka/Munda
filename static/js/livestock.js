// API endpoints
const API_BASE = '/api';
const FARMS_API = `${API_BASE}/farms/`;
const LIVESTOCK_API = `${API_BASE}/livestock/`;

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
        const livestockFarm = document.getElementById('livestockFarm');
        
        farmFilter.innerHTML = '<option value="">All Farms</option>';
        livestockFarm.innerHTML = '<option value="">Select Farm</option>';
        
        farms.forEach(farm => {
            const option1 = document.createElement('option');
            option1.value = farm.id;
            option1.textContent = farm.name;
            farmFilter.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = farm.id;
            option2.textContent = farm.name;
            livestockFarm.appendChild(option2);
        });
    } catch (error) {
        console.error('Error loading farms:', error);
    }
}

// Load livestock
async function loadLivestock(farmId = '') {
    try {
        let url = LIVESTOCK_API;
        if (farmId) {
            url += `?farm=${farmId}`;
        }
        
        const livestock = await apiRequest(url);
        displayLivestock(livestock);
    } catch (error) {
        console.error('Error loading livestock:', error);
    }
}

// Display livestock in table
function displayLivestock(livestock) {
    const livestockTable = document.getElementById('livestockTable');
    
    if (livestock.length === 0) {
        livestockTable.innerHTML = '<p style="padding: 2rem; text-align: center;">No livestock found. Add your first animal!</p>';
        return;
    }
    
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Tag Number</th>
                    <th>Animal Type</th>
                    <th>Breed</th>
                    <th>Farm</th>
                    <th>Gender</th>
                    <th>Weight (kg)</th>
                    <th>Health Status</th>
                    <th>Purpose</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    livestock.forEach(animal => {
        tableHTML += `
            <tr>
                <td>${animal.tag_number}</td>
                <td>${animal.animal_type}</td>
                <td>${animal.breed || '-'}</td>
                <td>${animal.farm_name || 'N/A'}</td>
                <td>${animal.gender}</td>
                <td>${animal.weight_kg || '-'}</td>
                <td><span class="status-badge status-${animal.health_status}">${animal.health_status}</span></td>
                <td>${animal.purpose || '-'}</td>
                <td>
                    <button class="btn btn-sm" onclick="editLivestock(${animal.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteLivestock(${animal.id})">Delete</button>
                </td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    livestockTable.innerHTML = tableHTML;
}

// Modal functions
function showAddLivestockModal() {
    document.getElementById('addLivestockModal').style.display = 'block';
}

function closeAddLivestockModal() {
    document.getElementById('addLivestockModal').style.display = 'none';
    document.getElementById('addLivestockForm').reset();
}

// Form submission
document.getElementById('addLivestockForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        farm: document.getElementById('livestockFarm').value,
        animal_type: document.getElementById('animalType').value,
        breed: document.getElementById('breed').value,
        tag_number: document.getElementById('tagNumber').value,
        birth_date: document.getElementById('birthDate').value || null,
        gender: document.getElementById('gender').value,
        weight_kg: document.getElementById('weight').value || null,
        health_status: document.getElementById('healthStatus').value,
        purpose: document.getElementById('purpose').value,
        notes: document.getElementById('livestockNotes').value
    };
    
    try {
        await apiRequest(LIVESTOCK_API, 'POST', formData);
        closeAddLivestockModal();
        loadLivestock();
    } catch (error) {
        console.error('Error adding livestock:', error);
        alert('Error adding livestock. Please try again.');
    }
});

// Filter livestock by farm
document.getElementById('farmFilter').addEventListener('change', (e) => {
    loadLivestock(e.target.value);
});

// Delete livestock
async function deleteLivestock(livestockId) {
    if (confirm('Are you sure you want to delete this livestock?')) {
        try {
            await apiRequest(`${LIVESTOCK_API}${livestockId}/`, 'DELETE');
            loadLivestock();
        } catch (error) {
            console.error('Error deleting livestock:', error);
            alert('Error deleting livestock. Please try again.');
        }
    }
}

// Edit livestock (placeholder)
function editLivestock(livestockId) {
    alert('Edit functionality coming soon!');
}

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadFarms();
    loadLivestock();
});
