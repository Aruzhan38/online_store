document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || user.role !== 'admin') {
        alert('Access Denied: Admins Only');
        window.location.href = '/';
        return;
    }
    fetchStats();
    fetchAdminProducts();
    fetchAdminOrders();
});

document.getElementById('addProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const newProduct = {
        name: document.getElementById('name').value,
        price: Number(document.getElementById('price').value),
        brand: document.getElementById('brand').value,
        description: document.getElementById('desc').value,
        categoryId: document.getElementById('categoryId').value, 
        currency: "KZT",
        isActive: true,
        images: [document.getElementById('imageUrl').value || "https://via.placeholder.com/150"],
        variants: []
    };

    try {
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(newProduct)
        });

        if (res.ok) {
            alert('Product added!');
            location.reload();
        } else {
            const errorData = await res.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (err) {
        console.error('Add product error:', err);
    }
});

async function fetchStats() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch('/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const stats = await res.json();
        
        const tbody = document.getElementById('statsTableBody');
        if (!tbody) return;

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
    try {
        const res = await fetch('/api/products');
        const products = await res.json();
        const container = document.getElementById('adminProductList');
        
        if (!Array.isArray(products)) return;

        container.innerHTML = products.map(p => `
            <div class="col-md-4 mb-3">
                <div class="card p-2 shadow-sm border-0">
                    <h6 class="fw-bold">${p.name}</h6>
                    <small class="text-muted">Price: ${p.price.toLocaleString()} KZT</small>
                    <button class="btn btn-sm btn-outline-danger mt-2 border-0" onclick="deleteProduct('${p._id}')">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Fetch products error:', err);
    }
}

async function fetchAdminOrders() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch('/api/admin/orders', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error('Failed to fetch orders');
        
        const orders = await res.json();
        const tbody = document.getElementById('adminOrderTableBody');
        
        if (!tbody) {
            console.error("Элемент adminOrderTableBody не найден в HTML!");
            return;
        }

        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">No orders found</td></tr>';
            return;
        }

        tbody.innerHTML = orders.map(order => `
            <tr>
                <td class="fw-bold">#${order._id.slice(-6).toUpperCase()}</td>
                <td>
                    <div class="fw-bold">${order.userId?.fullName || 'User'}</div>
                    <div class="small text-muted">${order.userId?.email || 'No email'}</div>
                </td>
                <td>${order.totalAmount.toLocaleString()} KZT</td>
                <td>
                    <select class="form-select form-select-sm" onchange="updateOrderStatus('${order._id}', this.value)">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Order fetch error:', err);
    }
}

async function updateOrderStatus(orderId, newStatus) {
    const token = localStorage.getItem('token');
    try {
        await fetch(`/api/admin/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ status: newStatus })
        });
        alert('Status updated!');
    } catch (err) {
        console.error('Update status error:', err);
    }
}

async function deleteProduct(id) {
    if(!confirm('Are you sure?')) return;
    const token = localStorage.getItem('token');
    try {
        await fetch(`/api/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchAdminProducts();
    } catch (err) {
        console.error('Delete product error:', err);
    }
}