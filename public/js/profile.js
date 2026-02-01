document.addEventListener('DOMContentLoaded', loadProfileData);

async function loadProfileData() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/auth.html';
        return;
    }

    try {
        const userRes = await fetch('/api/auth/me', { 
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (userRes.ok) {
            const userData = await userRes.json();
            document.getElementById('userName').innerText = userData.fullName || 'User'; 
            document.getElementById('userEmail').innerText = userData.email;
        }

        const res = await fetch('/api/orders/my-orders', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Failed to fetch orders');

        const orders = await res.json();
        renderOrderHistory(orders);
        
    } catch (err) {
        console.error("Profile Error:", err);
        document.getElementById('orderList').innerHTML = 
            '<p class="text-danger text-center py-4">Failed to load order history.</p>';
    }
}

function renderOrderHistory(orders) {
    const container = document.getElementById('orderList'); 
    
    if (!orders || orders.length === 0) {
        container.innerHTML = '<p class="text-muted text-center py-4">You have no orders yet.</p>';
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="list-group-item border-0 border-bottom py-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div>
                    <span class="fw-bold">Order №${order._id.slice(-6).toUpperCase()}</span>
                    <div class="text-muted small">${new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <span class="badge bg-success">${order.status}</span>
            </div>
            <div class="small text-secondary mb-2">
                ${order.items.map(item => `${item.sku} (x${item.qty})`).join(', ')}
            </div>
            <div class="d-flex justify-content-between align-items-center mt-2">
                <span class="text-muted small"><i class="bi bi-truck"></i> ${order.shippingAddress?.street || 'Address not specified'}</span>
                <span class="fw-bold text-primary">${order.totalAmount.toLocaleString()} KZT</span>
            </div>
        </div>
    `).join('');
}

function logout() {
    localStorage.clear();
    window.location.href = '/auth.html';
}