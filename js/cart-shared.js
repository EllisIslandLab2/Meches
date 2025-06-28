// Shared cart functionality across all pages
let cart = [];

// Initialize cart on any page load
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromStorage();
    updateCartDisplay();
    setupCartEventListeners();
});

function loadCartFromStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart && storedCart !== 'null' && storedCart !== 'undefined') {
        try {
            const parsedCart = JSON.parse(storedCart);
            // Ensure it's a valid array
            if (Array.isArray(parsedCart)) {
                cart = parsedCart;
            } else {
                console.warn('Invalid cart data in localStorage, starting fresh');
                cart = [];
                localStorage.removeItem('cart');
            }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            cart = [];
            localStorage.removeItem('cart'); // Clear corrupted data
        }
    } else {
        // New visitor or no cart data
        cart = [];
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function setupCartEventListeners() {
    // Cart modal elements
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeBtn = cartModal ? cartModal.querySelector('.close') : null;
    const continueShoppingBtn = document.getElementById('continue-shopping');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Add event listeners if elements exist
    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (closeBtn) closeBtn.addEventListener('click', closeCart);
    if (continueShoppingBtn) continueShoppingBtn.addEventListener('click', closeCart);
    if (checkoutBtn) checkoutBtn.addEventListener('click', goToCheckout);
    
    // Close modal when clicking outside
    if (cartModal) {
        window.addEventListener('click', function(event) {
            if (event.target === cartModal) {
                closeCart();
            }
        });
    }
}

function openCart() {
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartModal || !cartItemsContainer || !cartTotal) {
        console.error('Cart modal elements not found');
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
    } else {
        let total = 0;
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/images/product-placeholder.jpg'">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.variantType || 'Style'}: ${item.variant || item.color}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });
        cartTotal.textContent = total.toFixed(2);
    }
    
    cartModal.style.display = 'block';
}

function closeCart() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.style.display = 'none';
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    
    // Refresh cart display without reopening modal
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItemsContainer || !cartTotal) return;
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
    } else {
        let total = 0;
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/images/product-placeholder.jpg'">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.variantType || 'Style'}: ${item.variant || item.color}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });
        cartTotal.textContent = total.toFixed(2);
    }
}

function goToCheckout() {
    if (cart.length === 0) {
        showMessage('Your cart is empty!');
        return;
    }
    
    // Store cart in localStorage for checkout page
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'checkout.html';
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