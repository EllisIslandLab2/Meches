// Product data
const products = [
    {
        id: 1,
        name: "Handmade Earrings - Cowgirl Style",
        price: 8.99,
        category: "earrings",
        description: "Beautiful handcrafted cowgirl and star earrings",
        variants: {
            "cowgirl": {
                image: "assets/images/earrings-cowgirl-rbw.JPG",
                name: "Cowgirl"
            },
            "star": {
                image: "assets/images/earrings-star-usa.JPG",
                name: "Star"
            }
        },
        defaultVariant: "cowgirl",
        selectorType: "type",
        selectorLabel: "Type"
    },
    {
        id: 2,
        name: "Handmade Earrings - Drip Style",
        price: 9.99,
        category: "earrings",
        description: "Beautiful drip-style earrings in multiple colors",
        variants: {
            "brown": {
                image: "assets/images/earrings-drip-usabrn.JPG",
                name: "Brown"
            },
            "teal": {
                image: "assets/images/earrings-drip-usateal.JPG",
                name: "Teal"
            }
        },
        defaultVariant: "brown",
        selectorType: "color",
        selectorLabel: "Color"
    },
    {
        id: 3,
        name: "Handmade Earrings - Floral Style",
        price: 13.99,
        category: "earrings",
        description: "Elegant floral earrings in vibrant colors",
        variants: {
            "red": {
                image: "assets/images/earrings-floral-red.JPG",
                name: "Red"
            },
            "blue": {
                image: "assets/images/earrings-floral-blue.JPG",
                name: "Blue"
            }
        },
        defaultVariant: "red",
        selectorType: "color",
        selectorLabel: "Color"
    },
    {
        id: 4,
        name: "Handmade Earrings - Decorative Style",
        price: 15.99,
        category: "earrings",
        description: "Beautiful decorative earrings with bow and flower designs",
        variants: {
            "bow": {
                image: "assets/images/earrings-floral-bow-wp.JPG",
                name: "Bow"
            },
            "flower": {
                image: "assets/images/earrings-floral-flower-blue.JPG",
                name: "Flower"
            }
        },
        defaultVariant: "bow",
        selectorType: "type",
        selectorLabel: "Type"
    },
];

// Load products on page load (cart functionality is in cart-shared.js)
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupProductEventListeners();
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
    
    const variantKeys = Object.keys(product.variants);
    const defaultImage = product.variants[product.defaultVariant].image;
    
    card.innerHTML = `
        <div class="product-image">
            <img id="img-${product.id}" src="${defaultImage}" alt="${product.name}" onerror="this.src='assets/images/product-placeholder.jpg'">
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <div class="product-options">
                <div class="variant-selector">
                    <label>${product.selectorLabel}:</label>
                    <select id="variant-${product.id}" onchange="changeProductImage(${product.id})">
                        ${variantKeys.map(key => 
                            `<option value="${key}" ${key === product.defaultVariant ? 'selected' : ''}>${product.variants[key].name}</option>`
                        ).join('')}
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
    const variantSelect = document.getElementById(`variant-${productId}`);
    const qtyElement = document.getElementById(`qty-${productId}`);
    
    const selectedVariant = variantSelect.value;
    const selectedVariantData = product.variants[selectedVariant];
    const quantity = parseInt(qtyElement.textContent);
    
    const cartItem = {
        id: Date.now(), // Unique cart item ID
        productId: productId,
        name: product.name,
        price: product.price,
        variant: selectedVariantData.name,
        variantType: product.selectorLabel,
        quantity: quantity,
        image: selectedVariantData.image
    };
    
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart)); // Save to localStorage
    updateCartDisplay();
    
    // Reset quantity to 1
    qtyElement.textContent = '1';
    
    // Show success message
    showMessage('Item added to cart!');
}

function setupProductEventListeners() {
    // Product-specific event listeners (cart functionality is in cart-shared.js)
    // No additional product-specific listeners needed currently
}


function changeProductImage(productId) {
    const product = products.find(p => p.id === productId);
    const variantSelect = document.getElementById(`variant-${productId}`);
    const productImage = document.getElementById(`img-${productId}`);
    
    const selectedVariant = variantSelect.value;
    const selectedVariantData = product.variants[selectedVariant];
    
    productImage.src = selectedVariantData.image;
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