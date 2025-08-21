// Sample immunisation data
const immunisationData = [
    {
        dueDate: '24/02/2025',
        outcomeDate: '',
        age: '',
        vaccine: 'RV1',
        indication: '6 weeks',
        dose: '1',
        status: 'Overdue',
        category: 'due-overdue'
    },
    {
        dueDate: '24/02/2025',
        outcomeDate: '',
        age: '',
        vaccine: 'PCV13',
        indication: '6 weeks',
        dose: '1',
        status: 'Overdue',
        category: 'due-overdue'
    },
    {
        dueDate: '24/02/2025',
        outcomeDate: '28/02/2025',
        age: '6w',
        vaccine: 'DTaP-IPV-HepB/Hib Infanrix-hexa',
        indication: '6 weeks',
        dose: '1',
        status: 'Vaccination given',
        category: 'given-not-done'
    },
    {
        dueDate: '09/05/2025',
        outcomeDate: '',
        age: '',
        vaccine: 'RV1',
        indication: '3 months',
        dose: '2',
        status: 'Due',
        category: 'due-overdue'
    },
    {
        dueDate: '09/05/2025',
        outcomeDate: '',
        age: '',
        vaccine: 'PCV13',
        indication: 'Funded, if not otherwise specified',
        dose: '2',
        status: 'Due',
        category: 'due-overdue'
    },
    {
        dueDate: '13/05/2025',
        outcomeDate: '15/05/2025',
        age: '3m',
        vaccine: 'MenB Bexsero',
        indication: 'Funded, if not otherwise specified',
        dose: '1',
        status: 'Declined by parent/guardian',
        category: 'given-not-done'
    },
    {
        dueDate: '13/05/2025',
        outcomeDate: '15/05/2025',
        age: '3m',
        vaccine: 'DTaP-IPV-HepB/Hib Infanrix-hexa',
        indication: '3 months',
        dose: '2',
        status: 'Declined by parent/guardian',
        category: 'given-not-done'
    },
    {
        dueDate: '01/11/2025',
        outcomeDate: '',
        age: '',
        vaccine: 'DTaP-IPV-HepB/Hib Infanrix-hexa',
        indication: '5 months',
        dose: '3',
        status: 'Planned',
        category: 'planned'
    },
    {
        dueDate: '01/11/2025',
        outcomeDate: '',
        age: '',
        vaccine: 'PCV13',
        indication: '5 months',
        dose: '2',
        status: 'Planned',
        category: 'planned'
    },
    {
        dueDate: '01/11/2025',
        outcomeDate: '',
        age: '',
        vaccine: 'MenB',
        indication: 'Funded, if not otherwise specified',
        dose: '2',
        status: 'Planned',
        category: 'planned'
    },
    {
        dueDate: '01/06/2026',
        outcomeDate: '',
        age: '',
        vaccine: 'PCV13',
        indication: '12 months',
        dose: '1',
        status: 'Planned',
        category: 'planned'
    },
    {
        dueDate: '01/06/2026',
        outcomeDate: '',
        age: '',
        vaccine: 'MMR',
        indication: '12 months',
        dose: '1',
        status: 'Planned',
        category: 'planned'
    },
    {
        dueDate: '01/06/2026',
        outcomeDate: '',
        age: '',
        vaccine: 'MenB',
        indication: '12 months',
        dose: '3',
        status: 'Planned',
        category: 'planned'
    }
];

// DOM elements
const filterButtons = document.querySelectorAll('.filter-btn');
const sortButton = document.getElementById('sortButton');
const sortOptions = document.getElementById('sortOptions');
const sortDropdown = document.querySelector('.sort-dropdown');
const tableContainer = document.getElementById('tableContainer');
const tableBody = document.getElementById('tableBody');
const noFilterMessage = document.getElementById('noFilterMessage');

// State
let activeFilters = new Set(['given-not-done', 'due-overdue']); // Default active filters
let currentSort = 'due-oldest';

// Initialize the application
function init() {
    setupEventListeners();
    updateFilterButtons();
    renderTable();
}

// Setup event listeners
function setupEventListeners() {
    // Filter button listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilterClick);
    });

    // Sort dropdown listeners
    sortButton.addEventListener('click', toggleSortDropdown);
    
    // Sort option listeners
    document.querySelectorAll('.sort-option').forEach(option => {
        option.addEventListener('click', handleSortClick);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!sortDropdown.contains(e.target)) {
            closeSortDropdown();
        }
    });
}

// Handle filter button clicks
function handleFilterClick(e) {
    const filter = e.target.dataset.filter;
    
    if (filter === 'display-all') {
        // If "Display all" is clicked, activate all filters
        if (activeFilters.has('display-all')) {
            activeFilters.clear();
        } else {
            activeFilters = new Set(['display-all', 'given-not-done', 'due-overdue', 'planned']);
        }
    } else {
        // Handle other filters
        if (activeFilters.has(filter)) {
            activeFilters.delete(filter);
        } else {
            activeFilters.add(filter);
        }
        
        // Remove "Display all" if not all filters are selected
        if (activeFilters.size < 3 || !activeFilters.has('given-not-done') || 
            !activeFilters.has('due-overdue') || !activeFilters.has('planned')) {
            activeFilters.delete('display-all');
        }
        
        // Add "Display all" if all other filters are selected
        if (activeFilters.has('given-not-done') && activeFilters.has('due-overdue') && activeFilters.has('planned')) {
            activeFilters.add('display-all');
        }
    }
    
    updateFilterButtons();
    renderTable();
}

// Update filter button states
function updateFilterButtons() {
    filterButtons.forEach(button => {
        const filter = button.dataset.filter;
        if (activeFilters.has(filter)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Toggle sort dropdown
function toggleSortDropdown() {
    sortDropdown.classList.toggle('open');
}

// Close sort dropdown
function closeSortDropdown() {
    sortDropdown.classList.remove('open');
}

// Handle sort option clicks
function handleSortClick(e) {
    const sortType = e.target.dataset.sort;
    currentSort = sortType;
    
    // Update button text
    sortButton.childNodes[0].textContent = e.target.textContent;
    
    closeSortDropdown();
    renderTable();
}

// Sort data based on current sort option
function sortData(data) {
    const sortedData = [...data];
    
    switch (currentSort) {
        case 'due-oldest':
            return sortedData.sort((a, b) => new Date(a.dueDate.split('/').reverse().join('-')) - new Date(b.dueDate.split('/').reverse().join('-')));
        case 'due-newest':
            return sortedData.sort((a, b) => new Date(b.dueDate.split('/').reverse().join('-')) - new Date(a.dueDate.split('/').reverse().join('-')));
        case 'outcome-oldest':
            return sortedData.sort((a, b) => {
                if (!a.outcomeDate && !b.outcomeDate) return 0;
                if (!a.outcomeDate) return 1;
                if (!b.outcomeDate) return -1;
                return new Date(a.outcomeDate.split('/').reverse().join('-')) - new Date(b.outcomeDate.split('/').reverse().join('-'));
            });
        case 'outcome-newest':
            return sortedData.sort((a, b) => {
                if (!a.outcomeDate && !b.outcomeDate) return 0;
                if (!a.outcomeDate) return 1;
                if (!b.outcomeDate) return -1;
                return new Date(b.outcomeDate.split('/').reverse().join('-')) - new Date(a.outcomeDate.split('/').reverse().join('-'));
            });
        case 'vaccine-az':
            return sortedData.sort((a, b) => a.vaccine.localeCompare(b.vaccine));
        default:
            return sortedData;
    }
}

// Filter data based on active filters
function filterData() {
    if (activeFilters.size === 0) {
        return [];
    }
    
    if (activeFilters.has('display-all')) {
        return immunisationData;
    }
    
    return immunisationData.filter(item => activeFilters.has(item.category));
}

// Get status CSS class
function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case 'overdue':
            return 'status-overdue';
        case 'due':
            return 'status-due';
        case 'vaccination given':
            return 'status-given';
        case 'declined by parent/guardian':
            return 'status-declined';
        case 'planned':
            return 'status-planned';
        default:
            return '';
    }
}

// Render the table
function renderTable() {
    const filteredData = filterData();
    
    if (filteredData.length === 0) {
        tableContainer.style.display = 'none';
        noFilterMessage.style.display = 'block';
        return;
    }
    
    tableContainer.style.display = 'block';
    noFilterMessage.style.display = 'none';
    
    const sortedData = sortData(filteredData);
    
    tableBody.innerHTML = sortedData.map(item => `
        <tr>
            <td>${item.dueDate}</td>
            <td>${item.outcomeDate}</td>
            <td>${item.age}</td>
            <td>${item.vaccine}</td>
            <td>${item.indication}</td>
            <td>${item.dose}</td>
            <td><span class="${getStatusClass(item.status)}">${item.status}</span></td>
            <td>
                ${item.status === 'Vaccination given' || item.status === 'Declined by parent/guardian' 
                    ? '<a href="#" class="action-link">View details</a>' 
                    : '<button class="action-button">Record</button>'
                }
            </td>
        </tr>
    `).join('');
}

// Visitor counter functionality
function initVisitorCounter() {
    const visitorCountElement = document.getElementById('visitorCount');
    const storageKey = 'rosie-ux-unique-visitors';
    const sessionKey = 'rosie-ux-session-visited';
    
    // Check if this is a unique visit (not visited in this session)
    if (!sessionStorage.getItem(sessionKey)) {
        // Get current count from localStorage
        let visitorCount = parseInt(localStorage.getItem(storageKey)) || 0;
        
        // Increment count for new unique visitor
        visitorCount++;
        
        // Store updated count
        localStorage.setItem(storageKey, visitorCount.toString());
        
        // Mark this session as visited
        sessionStorage.setItem(sessionKey, 'true');
    }
    
    // Display current count
    const currentCount = parseInt(localStorage.getItem(storageKey)) || 0;
    visitorCountElement.textContent = currentCount;
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    initVisitorCounter();
});
