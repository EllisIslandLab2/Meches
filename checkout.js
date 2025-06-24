// Checkout functionality
let cart = [];

document.addEventListener('DOMContentLoaded', function() {
    loadCartFromStorage();
    displayCheckoutItems();
    calculateTotals();
    setupEventListeners();
});

function loadCartFromStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
    
    if (cart.length === 0) {
        // Redirect to main page if cart is empty
        window.location.href = 'index.html';
    }
}

function displayCheckoutItems() {
    const cartItemsContainer = document.getElementById('checkout-cart-items');
    cartItemsContainer.innerHTML = '';
    
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'checkout-item';
        itemElement.innerHTML = `
            <div class="checkout-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='product-placeholder.jpg'">
            </div>
            <div class="checkout-item-details">
                <h4>${item.name}</h4>
                <p>Color: ${item.color}</p>
                <p>Price: $${item.price.toFixed(2)}</p>
            </div>
            <div class="checkout-item-quantity">
                <label>Quantity:</label>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <input type="number" value="${item.quantity}" min="1" max="99" id="qty-${index}" onchange="updateQuantityInput(${index})">
                    <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <div class="checkout-item-total">
                <span class="item-total">$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });
}

function updateQuantity(index, change) {
    const newQuantity = cart[index].quantity + change;
    if (newQuantity >= 1 && newQuantity <= 99) {
        cart[index].quantity = newQuantity;
        document.getElementById(`qty-${index}`).value = newQuantity;
        updateCart();
    }
}

function updateQuantityInput(index) {
    const input = document.getElementById(`qty-${index}`);
    const newQuantity = parseInt(input.value);
    
    if (newQuantity >= 1 && newQuantity <= 99) {
        cart[index].quantity = newQuantity;
        updateCart();
    } else {
        // Reset to previous value
        input.value = cart[index].quantity;
    }
}

function removeItem(index) {
    cart.splice(index, 1);
    
    if (cart.length === 0) {
        window.location.href = 'index.html';
        return;
    }
    
    updateCart();
    displayCheckoutItems();
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    calculateTotals();
    displayCheckoutItems();
}

function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 5.00 : 0;
    const taxRate = 0.08; // 8% tax
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function setupEventListeners() {
    const updateCartBtn = document.getElementById('update-cart-btn');
    const proceedPaymentBtn = document.getElementById('proceed-payment-btn');
    
    updateCartBtn.addEventListener('click', function() {
        updateCart();
        showMessage('Cart updated successfully!');
    });
    
    proceedPaymentBtn.addEventListener('click', function() {
        // Store final cart and totals for payment page
        const orderData = {
            cart: cart,
            subtotal: parseFloat(document.getElementById('subtotal').textContent.replace('$', '')),
            shipping: parseFloat(document.getElementById('shipping').textContent.replace('$', '')),
            tax: parseFloat(document.getElementById('tax').textContent.replace('$', '')),
            total: parseFloat(document.getElementById('total').textContent.replace('$', ''))
        };
        
        localStorage.setItem('orderData', JSON.stringify(orderData));
        window.location.href = 'payment.html';
    });
}

function showMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}