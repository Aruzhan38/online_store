document.addEventListener('DOMContentLoaded', fetchCart);

async function fetchCart() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/auth.html';
        return;
    }

    try {
        const res = await fetch('/api/orders/cart', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const cart = await res.json();
        renderCart(cart);
    } catch (err) {
        console.error('Error:', err);
    }
}

function renderCart(cart) {
    const container = document.getElementById('cartContainer');
    const checkoutBtn = document.getElementById('checkoutBtn');
    let total = 0;

    if (!cart.items || cart.items.length === 0) {
        container.innerHTML = '<div class="text-center py-4">Your cart is empty.</div>';
        checkoutBtn.disabled = true;
        return;
    }

    container.innerHTML = cart.items.map(item => {
        const itemTotal = item.priceSnapshot * item.qty;
        total += itemTotal;
        return `
            <div class="d-flex align-items-center border-bottom py-3">
                <div class="flex-grow-1">
                    <h6 class="mb-0">${item.productId.name}</h6>
                    <small class="text-muted">Size/Color: ${item.sku}</small><br>
                    <small>Qty: ${item.qty} x ${item.priceSnapshot} KZT</small>
                </div>
                <div class="text-end">
                    <div class="fw-bold mb-2">${itemTotal} KZT</div>
                    <button class="btn btn-sm btn-outline-danger" onclick="removeItem('${item._id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('subtotal').innerText = `${total} KZT`;
    document.getElementById('total').innerText = `${total} KZT`;
    checkoutBtn.disabled = false;
    
    checkoutBtn.onclick = () => placeOrder(cart.items, total);
}

async function removeItem(itemId) {
    const token = localStorage.getItem('token');
    await fetch(`/api/orders/cart/item/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchCart(); 
}

async function placeOrder(items, totalAmount) {
    const token = localStorage.getItem('token');
    const shippingAddress = { city: "Oskemen", street: "Dostyk 10", zip: "070000" }; // Default from your Atlas data

    const res = await fetch('/api/orders/orders', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items, totalAmount, shippingAddress })
    });

    if (res.ok) {
        alert('Order placed successfully! Stock has been updated.');
        window.location.href = '/profile.html';
    } else {
        alert('Order failed. Check console for details.');
    }
}