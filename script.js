// Product data
const products = [
    {
        id: 1,
        name: "Handmade Earrings - Floral with Ribbon",
        price: 18.00,
        image: "meche-site/floral-earing.jpg",
        category: "earrings",
        colors: ["Red"],
        description: "Beautiful handcrafted floral earrings"
    },
    {
        id: 2,
        name: "Handmade Earrings - Floral",
        price: 15.00,
        image: "meche-site/floral-earing.jpg",
        category: "necklaces",
        colors: ["White"],
        description: "Vibrant sunset-inspired beaded necklace"
    },
    {
        id: 3,
        name: "Sandal Earings - USA Style",
        price: 15.00,
        image: "keychain-initial.jpg",
        category: "keychains",
        colors: ["Black", "Blue", "Red", "Green"],
        description: "Personalized initial keychain"
    },
];

// Cart functionality
let cart = [];

// Load products on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
    updateCartDisplay();
});

function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='product-placeholder.jpg'">
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <div class="product-options">
                <div class="color-selector">
                    <label>Color:</label>
                    <select id="color-${product.id}">
                        ${product.colors.map(color => `<option value="${color}">${color}</option>`).join('')}
                    </select>
                </div>
                <div class="quantity-selector">
                    <button class="qty-btn" onclick="changeQuantity(${product.id}, -1)">-</button>
                    <span id="qty-${product.id}" class="quantity">1</span>
                    <button class="qty-btn" onclick="changeQuantity(${product.id}, 1)">+</button>
                </div>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `;
    
    return card;
}

function changeQuantity(productId, change) {
    const qtyElement = document.getElementById(`qty-${productId}`);
    let currentQty = parseInt(qtyElement.textContent);
    currentQty = Math.max(1, currentQty + change);
    qtyElement.textContent = currentQty;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const colorSelect = document.getElementById(`color-${productId}`);
    const qtyElement = document.getElementById(`qty-${productId}`);
    
    const selectedColor = colorSelect.value;
    const quantity = parseInt(qtyElement.textContent);
    
    const cartItem = {
        id: Date.now(), // Unique cart item ID
        productId: productId,
        name: product.name,
        price: product.price,
        color: selectedColor,
        quantity: quantity,
        image: product.image
    };
    
    cart.push(cartItem);
    updateCartDisplay();
    
    // Reset quantity to 1
    qtyElement.textContent = '1';
    
    // Show success message
    showMessage('Item added to cart!');
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function setupEventListeners() {
    // Cart modal
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeBtn = document.querySelector('.close');
    const continueShoppingBtn = document.getElementById('continue-shopping');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    cartBtn.addEventListener('click', openCart);
    closeBtn.addEventListener('click', closeCart);
    continueShoppingBtn.addEventListener('click', closeCart);
    checkoutBtn.addEventListener('click', goToCheckout);
    
    window.addEventListener('click', function(event) {
        if (event.target === cartModal) {
            closeCart();
        }
    });
}

function openCart() {
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
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
                <img src="${item.image}" alt="${item.name}" onerror="this.src='product-placeholder.jpg'">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Color: ${item.color}</p>
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
    cartModal.style.display = 'none';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    openCart(); // Refresh cart display
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