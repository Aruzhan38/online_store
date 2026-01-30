document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || user.role !== 'admin') {
        alert('Access Denied: Admins Only');
        window.location.href = '/';
        return;
    }

    fetchStats();
    fetchAdminProducts();
});

async function fetchStats() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch('/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const stats = await res.json();
        
        const tbody = document.getElementById('statsTableBody');
        tbody.innerHTML = stats.map(item => `
            <tr>
                <td>${item.categoryInfo[0]?.name || 'Unknown'}</td>
                <td>${item.totalUnitsSold}</td>
                <td class="fw-bold">${item.totalRevenue.toLocaleString()} KZT</td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Stats error:', err);
    }
}

async function fetchAdminProducts() {
    const res = await fetch('/api/products');
    const products = await res.json();
    const container = document.getElementById('adminProductList');
    
    container.innerHTML = products.map(p => `
        <div class="col-md-4 mb-3">
            <div class="card p-2">
                <h6>${p.name}</h6>
                <small>Price: ${p.price} KZT</small>
                <button class="btn btn-sm btn-danger mt-2" onclick="deleteProduct('${p._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

async function deleteProduct(id) {
    if(!confirm('Are you sure?')) return;
    const token = localStorage.getItem('token');
    await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchAdminProducts();
}