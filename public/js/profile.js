document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/auth.html';
        return;
    }

    const userData = JSON.parse(localStorage.getItem('user'));
    document.getElementById('userName').innerText = userData.fullName;
    document.getElementById('userEmail').innerText = userData.email;

    fetchOrders(token);
});

async function fetchOrders(token) {
    try {
        const response = await fetch('/api/orders/my', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const orders = await response.json();
        renderOrders(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
    }
}

function renderOrders(orders) {
    const container = document.getElementById('orderList');
    if (orders.length === 0) {
        container.innerHTML = '<p class="text-center">You haven\'t placed any orders yet.</p>';
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="list-group-item py-3">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>Order #${order._id.slice(-6).toUpperCase()}</strong>
                    <div class="text-muted small">${new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <span class="badge bg-success">${order.status}</span>
                <span class="fw-bold">${order.totalAmount} KZT</span>
            </div>
        </div>
    `).join('');
}

function logout() {
    localStorage.clear();
    window.location.href = '/auth.html';
}