// API endpoints
const API_BASE = '/api';
const FARMS_API = `${API_BASE}/farms/`;
const PROJECTS_API = `${API_BASE}/projects/`;

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
        const projectFarm = document.getElementById('projectFarm');
        
        farmFilter.innerHTML = '<option value="">All Farms</option>';
        projectFarm.innerHTML = '<option value="">Select Farm</option>';
        
        farms.forEach(farm => {
            const option1 = document.createElement('option');
            option1.value = farm.id;
            option1.textContent = farm.name;
            farmFilter.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = farm.id;
            option2.textContent = farm.name;
            projectFarm.appendChild(option2);
        });
    } catch (error) {
        console.error('Error loading farms:', error);
    }
}

// Load projects
async function loadProjects(farmId = '') {
    try {
        let url = `${PROJECTS_API}kanban/`;
        if (farmId) {
            url += `?farm=${farmId}`;
        }
        
        const kanbanData = await apiRequest(url);
        displayKanban(kanbanData);
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Display projects in kanban board
function displayKanban(kanbanData) {
    displayColumn('todo', kanbanData.todo);
    displayColumn('in_progress', kanbanData.in_progress);
    displayColumn('done', kanbanData.done);
}

function displayColumn(status, projects) {
    const statusMap = {
        'todo': 'todoTasks',
        'in_progress': 'inProgressTasks',
        'done': 'doneTasks'
    };
    
    const countMap = {
        'todo': 'todoCount',
        'in_progress': 'inProgressCount',
        'done': 'doneCount'
    };
    
    const container = document.getElementById(statusMap[status]);
    const countElement = document.getElementById(countMap[status]);
    
    container.innerHTML = '';
    countElement.textContent = projects.length;
    
    projects.forEach(project => {
        const card = createKanbanCard(project);
        container.appendChild(card);
    });
}

function createKanbanCard(project) {
    const card = document.createElement('div');
    card.className = 'kanban-card';
    card.draggable = true;
    card.dataset.projectId = project.id;
    
    card.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <p><strong>Category:</strong> ${project.category}</p>
        <p><strong>Farm:</strong> ${project.farm_name || 'N/A'}</p>
        <p><strong>Start Date:</strong> ${project.start_date}</p>
        <span class="priority-badge priority-${project.priority}">${project.priority.toUpperCase()}</span>
        <div style="margin-top: 0.5rem;">
            <button class="btn btn-sm btn-danger" onclick="deleteProject(${project.id})">Delete</button>
        </div>
    `;
    
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
    
    return card;
}

// Drag and drop functionality
let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
    this.style.opacity = '1';
}

function allowDrop(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

async function drop(e) {
    e.preventDefault();
    
    if (draggedElement) {
        const targetColumn = e.target.closest('.kanban-tasks');
        if (targetColumn && targetColumn !== draggedElement.parentNode) {
            const newStatus = targetColumn.id.replace('Tasks', '').replace(/([A-Z])/g, '_$1').toLowerCase().substring(1);
            const projectId = draggedElement.dataset.projectId;
            
            try {
                // Get the project data
                const project = await apiRequest(`${PROJECTS_API}${projectId}/`);
                
                // Update the status
                project.status = newStatus;
                await apiRequest(`${PROJECTS_API}${projectId}/`, 'PUT', project);
                
                // Reload the kanban board
                const farmId = document.getElementById('farmFilter').value;
                loadProjects(farmId);
            } catch (error) {
                console.error('Error updating project status:', error);
                alert('Error updating project status. Please try again.');
            }
        }
    }
}

// Modal functions
function showAddProjectModal() {
    document.getElementById('addProjectModal').style.display = 'block';
}

function closeAddProjectModal() {
    document.getElementById('addProjectModal').style.display = 'none';
    document.getElementById('addProjectForm').reset();
}

// Form submission
document.getElementById('addProjectForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        farm: document.getElementById('projectFarm').value,
        title: document.getElementById('projectTitle').value,
        description: document.getElementById('projectDescription').value,
        category: document.getElementById('projectCategory').value,
        priority: document.getElementById('projectPriority').value,
        start_date: document.getElementById('startDate').value,
        budget: document.getElementById('budget').value || null,
        status: 'todo',
        assigned_to: null
    };
    
    try {
        await apiRequest(PROJECTS_API, 'POST', formData);
        closeAddProjectModal();
        loadProjects();
    } catch (error) {
        console.error('Error adding project:', error);
        alert('Error adding project. Please try again.');
    }
});

// Filter projects by farm
document.getElementById('farmFilter').addEventListener('change', (e) => {
    loadProjects(e.target.value);
});

// Delete project
async function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
        try {
            await apiRequest(`${PROJECTS_API}${projectId}/`, 'DELETE');
            loadProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Error deleting project. Please try again.');
        }
    }
}

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadFarms();
    loadProjects();
});
