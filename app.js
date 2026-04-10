// ========== APP.JS ==========
// Mock data for furniture shops & items details
const shopFurnitureData = [
    { shop: "Urban Nest", category: "Sofas", product: "Velvet Chesterfield", unitsSold: 124, revenue: 24800, stock: "High" },
    { shop: "Rustic Roots", category: "Tables", product: "Live Edge Oak Table", unitsSold: 68, revenue: 27200, stock: "Medium" },
    { shop: "Modern Loft", category: "Chairs", product: "Ergonomic Mesh Chair", unitsSold: 210, revenue: 31500, stock: "High" },
    { shop: "Cozy Home", category: "Bedroom", product: "Upholstered Platform Bed", unitsSold: 45, revenue: 29250, stock: "Low" },
    { shop: "Vintage Charm", category: "Cabinets", product: "Rustic Wood Sideboard", unitsSold: 33, revenue: 11550, stock: "Medium" },
    { shop: "Urban Nest", category: "Lighting", product: "Arc Floor Lamp", unitsSold: 89, revenue: 6230, stock: "High" },
    { shop: "Modern Loft", category: "Desks", product: "Standing Desk", unitsSold: 72, revenue: 17280, stock: "Medium" },
    { shop: "Rustic Roots", category: "Sofas", product: "Leather Recliner", unitsSold: 57, revenue: 19950, stock: "High" },
    { shop: "Cozy Home", category: "Chairs", product: "Accent Armchair", unitsSold: 93, revenue: 13950, stock: "Medium" },
    { shop: "Vintage Charm", category: "Tables", product: "Pedestal Dining Table", unitsSold: 28, revenue: 11200, stock: "Low" }
];

// aggregate category wise sales for bar chart (furniture categories)
function getCategorySales() {
    const catMap = new Map();
    shopFurnitureData.forEach(item => {
        const cat = item.category;
        const sold = item.unitsSold;
        catMap.set(cat, (catMap.get(cat) || 0) + sold);
    });
    // sort categories for consistent chart
    return Array.from(catMap.entries()).sort((a,b) => a[0].localeCompare(b[0]));
}

// chart instance
let barChart = null;

// render dashboard: update stats, table, and bar chart
function renderDashboard() {
    // update stats cards
    const uniqueShops = new Set(shopFurnitureData.map(d => d.shop));
    const totalShopsElem = document.getElementById('totalShops');
    const totalItemsElem = document.getElementById('totalItems');
    const avgSalesElem = document.getElementById('avgSales');
    
    if (totalShopsElem) totalShopsElem.innerText = uniqueShops.size;
    if (totalItemsElem) {
        const totalUnits = shopFurnitureData.reduce((sum, curr) => sum + curr.unitsSold, 0);
        totalItemsElem.innerText = totalUnits.toLocaleString();
    }
    if (avgSalesElem) {
        const totalRevenue = shopFurnitureData.reduce((sum, curr) => sum + curr.revenue, 0);
        const avgRevenue = totalRevenue / uniqueShops.size;
        avgSalesElem.innerText = `$${(avgRevenue / 1000).toFixed(1)}K`;
    }

    // populate furniture details table
    const tbody = document.getElementById('tableBody');
    if (tbody) {
        tbody.innerHTML = '';
        shopFurnitureData.forEach(item => {
            const row = document.createElement('tr');
            // stock badge class
            let stockClass = 'stock-high';
            if (item.stock === 'Medium') stockClass = 'stock-medium';
            if (item.stock === 'Low') stockClass = 'stock-low';
            
            row.innerHTML = `
                <td>${item.shop}</td>
                <td>${item.category}</td>
                <td>${item.product}</td>
                <td>${item.unitsSold}</td>
                <td>$${item.revenue.toLocaleString()}</td>
                <td><span class="stock-badge ${stockClass}">${item.stock}</span></td>
            `;
            tbody.appendChild(row);
        });
    }

    // === BAR CHART: analytics bar chart for furniture categories (units sold)
    const categorySales = getCategorySales();
    const labels = categorySales.map(item => item[0]);   // category names
    const salesData = categorySales.map(item => item[1]); // units sold
    
    const ctx = document.getElementById('furnitureBarChart').getContext('2d');
    if (barChart) {
        barChart.destroy();
    }
    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Units Sold (Month to Date)',
                data: salesData,
                backgroundColor: 'rgba(184, 115, 51, 0.75)',
                borderColor: '#b87333',
                borderWidth: 1.5,
                borderRadius: 8,
                barPercentage: 0.65,
                categoryPercentage: 0.8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { font: { size: 12, weight: 'bold' }, color: '#3b4a3a' }
                },
                tooltip: {
                    backgroundColor: '#2c2c2a',
                    titleColor: '#f0e7db',
                    bodyColor: '#f0e7db',
                    callbacks: {
                        label: function(context) {
                            return `📊 Units Sold: ${context.raw.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#e9ecef' },
                    title: {
                        display: true,
                        text: 'Total Units Sold',
                        color: '#6c5a47',
                        font: { weight: 'bold' }
                    }
                },
                x: {
                    grid: { display: false },
                    title: {
                        display: true,
                        text: 'Furniture Categories',
                        color: '#6c5a47',
                        font: { weight: 'bold' }
                    },
                    ticks: { font: { size: 11 } }
                }
            }
        }
    });
}

// Login logic
function handleLogin(email, password) {
    // demo validation: any non-empty email + password "123456" OR email includes 'admin'
    // For simplicity demo: email contains '@' and password === "123456"
    if (email && password === "123456") {
        // store login state in sessionStorage
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', email);
        showDashboard();
        return true;
    } else {
        alert('❌ Invalid credentials. Use any email and password: 123456 (demo)');
        return false;
    }
}

function showDashboard() {
    const loginView = document.getElementById('loginView');
    const dashboardView = document.getElementById('dashboardView');
    if (loginView) loginView.classList.add('hidden');
    if (dashboardView) dashboardView.classList.remove('hidden');
    
    // set user email in dashboard
    const userEmail = sessionStorage.getItem('userEmail') || 'admin@demo.com';
    const userSpan = document.getElementById('userDisplayEmail');
    if (userSpan) userSpan.innerText = userEmail;
    
    // render all dashboard content (chart + table)
    renderDashboard();
}

function showLogin() {
    const loginView = document.getElementById('loginView');
    const dashboardView = document.getElementById('dashboardView');
    if (loginView) loginView.classList.remove('hidden');
    if (dashboardView) dashboardView.classList.add('hidden');
    // clear any sensitive leftovers (just view)
}

function logout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userEmail');
    showLogin();
    // reset login fields to demo defaults (optional)
    const emailField = document.getElementById('loginEmail');
    const pwdField = document.getElementById('loginPassword');
    if (emailField) emailField.value = 'admin@demo.com';
    if (pwdField) pwdField.value = '123456';
}

// Check existing session on page load
function checkSession() {
    const isLogged = sessionStorage.getItem('isLoggedIn');
    if (isLogged === 'true') {
        showDashboard();
    } else {
        showLogin();
    }
}

// attach event listeners after DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // login button event
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            handleLogin(email, password);
        });
    }
    
    // logout button event
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    
    // allow Enter key on login fields
    const pwdInput = document.getElementById('loginPassword');
    if (pwdInput) {
        pwdInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value.trim();
                const password = document.getElementById('loginPassword').value;
                handleLogin(email, password);
            }
        });
    }
    
    // initial session check
    checkSession();
});