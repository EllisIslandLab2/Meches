// Success page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadOrderConfirmation();
});

function loadOrderConfirmation() {
    const orderConfirmation = localStorage.getItem('orderConfirmation');
    
    if (!orderConfirmation) {
        // If no order confirmation, redirect to home
        window.location.href = 'index.html';
        return;
    }
    
    const order = JSON.parse(orderConfirmation);
    displayOrderDetails(order);
}

function displayOrderDetails(order) {
    const orderDetailsContainer = document.getElementById('order-details');
    
    const orderHTML = `
        <div class="confirmation-card">
            <h3>Order Summary</h3>
            <div class="order-info">
                <div class="info-row">
                    <span class="label">Order Number:</span>
                    <span class="value">${order.orderId}</span>
                </div>
                <div class="info-row">
                    <span class="label">Order Date:</span>
                    <span class="value">${new Date(order.timestamp).toLocaleDateString()}</span>
                </div>
                <div class="info-row">
                    <span class="label">Customer:</span>
                    <span class="value">${order.customerInfo.firstName} ${order.customerInfo.lastName}</span>
                </div>
                <div class="info-row">
                    <span class="label">Email:</span>
                    <span class="value">${order.customerInfo.email}</span>
                </div>
            </div>
            
            <div class="order-items">
                <h4>Items Ordered:</h4>
                ${order.orderData.cart.map(item => `
                    <div class="success-item">
                        <span class="item-name">${item.name} (${item.color})</span>
                        <span class="item-quantity">Qty: ${item.quantity}</span>
                        <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-totals">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>$${order.orderData.subtotal.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>Shipping:</span>
                    <span>$${order.orderData.shipping.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>Tax:</span>
                    <span>$${order.orderData.tax.toFixed(2)}</span>
                </div>
                <div class="total-row final-total">
                    <span>Total:</span>
                    <span>$${order.orderData.total.toFixed(2)}</span>
                </div>
            </div>
            
            <div class="shipping-info">
                <h4>Shipping Address:</h4>
                <div class="address">
                    ${order.customerInfo.firstName} ${order.customerInfo.lastName}<br>
                    ${order.customerInfo.address}<br>
                    ${order.customerInfo.city}, ${order.customerInfo.state} ${order.customerInfo.zipCode}
                </div>
            </div>
        </div>
    `;
    
    orderDetailsContainer.innerHTML = orderHTML;
}