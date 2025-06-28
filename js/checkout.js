// Checkout functionality
let cart = [];
let appliedPromo = null;

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
                <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/images/product-placeholder.jpg'">
            </div>
            <div class="checkout-item-details">
                <h4>${item.name}</h4>
                <p>${item.variantType || 'Style'}: ${item.variant || item.color}</p>
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
}

function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 5.00 : 0;
    const taxRate = 0.08; // 8% tax
    
    // Calculate discount
    let discount = 0;
    if (appliedPromo && appliedPromo.type === 'teacher') {
        discount = subtotal * 0.10; // 10% discount
    }
    
    const discountedSubtotal = subtotal - discount;
    const tax = discountedSubtotal * taxRate;
    const total = discountedSubtotal + shipping + tax;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    
    // Show/hide discount line
    const discountLine = document.getElementById('discount-line');
    if (discount > 0) {
        document.getElementById('discount').textContent = `-$${discount.toFixed(2)}`;
        discountLine.style.display = 'block';
    } else {
        discountLine.style.display = 'none';
    }
    
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function setupEventListeners() {
    const updateCartBtn = document.getElementById('update-cart-btn');
    const proceedPaymentBtn = document.getElementById('proceed-payment-btn');
    const applyPromoBtn = document.getElementById('apply-promo-btn');
    const promoCodeInput = document.getElementById('promo-code');
    
//    updateCartBtn.addEventListener('click', function() {
//        updateCart();
//        showMessage('Cart updated successfully!');
//    });
    
    // Promo code functionality
    applyPromoBtn.addEventListener('click', applyPromoCode);
    promoCodeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyPromoCode();
        }
    });
    
    proceedPaymentBtn.addEventListener('click', function() {
        // Store final cart and totals for payment page
        const orderData = {
            cart: cart,
            subtotal: parseFloat(document.getElementById('subtotal').textContent.replace('$', '')),
            shipping: parseFloat(document.getElementById('shipping').textContent.replace('$', '')),
            tax: parseFloat(document.getElementById('tax').textContent.replace('$', '')),
            total: parseFloat(document.getElementById('total').textContent.replace('$', '')),
            appliedPromo: appliedPromo
        };
        
        localStorage.setItem('orderData', JSON.stringify(orderData));
        window.location.href = 'payment.html';
    });
}

function applyPromoCode() {
    const promoCodeInput = document.getElementById('promo-code');
    const promoMessage = document.getElementById('promo-message');
    const promoCode = promoCodeInput.value.trim().toUpperCase();
    
    // Clear previous messages
    promoMessage.textContent = '';
    promoMessage.className = 'promo-message';
    
    if (!promoCode) {
        showPromoMessage('Please enter a promo code.', 'error');
        return;
    }
    
    // Valid teacher promo codes
    const validTeacherCodes = ['TEACHER10', 'EDUCATOR10', 'TEACHER'];
    
    if (validTeacherCodes.includes(promoCode)) {
        if (appliedPromo && appliedPromo.code === promoCode) {
            showPromoMessage('This promo code is already applied.', 'info');
            return;
        }
        
        appliedPromo = {
            code: promoCode,
            type: 'teacher',
            discount: 0.10,
            description: 'Teacher Discount (10%)'
        };
        
        calculateTotals();
        showPromoMessage('Teacher discount applied! 10% off your order.', 'success');
        promoCodeInput.disabled = true;
        document.getElementById('apply-promo-btn').textContent = 'Applied';
        document.getElementById('apply-promo-btn').disabled = true;
    } else {
        showPromoMessage('Invalid promo code. Please check and try again.', 'error');
    }
}

function showPromoMessage(message, type) {
    const promoMessage = document.getElementById('promo-message');
    promoMessage.textContent = message;
    promoMessage.className = `promo-message ${type}`;
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