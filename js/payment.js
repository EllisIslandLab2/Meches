// Payment functionality with Square payment link
let orderData = null;

document.addEventListener('DOMContentLoaded', function() {
    loadOrderData();
    displayOrderSummary();
    setupEventListeners();
});

function loadOrderData() {
    const storedOrderData = localStorage.getItem('orderData');
    if (storedOrderData) {
        orderData = JSON.parse(storedOrderData);
    } else {
        // Redirect to checkout if no order data
        window.location.href = 'checkout.html';
    }
}

function displayOrderSummary() {
    const orderItemsContainer = document.getElementById('order-items');
    orderItemsContainer.innerHTML = '';
    
    orderData.cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        const variantText = item.variant || item.color || 'Default';
        itemElement.innerHTML = `
            <span>${item.name} (${variantText}) x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        orderItemsContainer.appendChild(itemElement);
    });
    
    // Display totals
    document.getElementById('payment-subtotal').textContent = `$${orderData.subtotal.toFixed(2)}`;
    document.getElementById('payment-shipping').textContent = `$${orderData.shipping.toFixed(2)}`;
    document.getElementById('payment-tax').textContent = `$${orderData.tax.toFixed(2)}`;
    document.getElementById('payment-total').textContent = `$${orderData.total.toFixed(2)}`;
    
    // Update payment details display
    document.getElementById('payment-total-display').textContent = `$${orderData.total.toFixed(2)}`;
}

function initializePaymentStatus() {
    // Update payment status to show Square payment link is ready
    document.getElementById('payment-status').innerHTML = 
        '<p class="payment-ready">Ready to process your payment securely with Square.</p>';
}

function setupEventListeners() {
    // Initialize payment status
    initializePaymentStatus();
    
    // Add listener for the "Continue to Payment" button
    const saveAndPayButton = document.getElementById('save-and-pay-button');
    if (saveAndPayButton) {
        saveAndPayButton.addEventListener('click', handleSaveAndPay);
    }
    
    // Add listener for when user returns from Square payment
    // This could be enhanced to handle return URLs from Square
    window.addEventListener('focus', function() {
        // User returned to page, could check for payment completion here
        checkPaymentCompletion();
    });
    
    // Initialize delivery method handling
    handleDeliveryMethodChange();
}

async function handleSaveAndPay() {
    const saveAndPayButton = document.getElementById('save-and-pay-button');
    const paymentStatus = document.getElementById('payment-status');
    const squareContainer = document.getElementById('square-payment-container');
    
    // Disable button and show processing
    saveAndPayButton.disabled = true;
    saveAndPayButton.textContent = 'Saving Order...';
    paymentStatus.innerHTML = '<p class="payment-processing">Saving your order information...</p>';
    
    try {
        // Save order to Airtable first
        const success = await saveOrderToAirtable();
        
        if (success) {
            // Hide the "Continue to Payment" button and show Square payment link
            saveAndPayButton.style.display = 'none';
            squareContainer.style.display = 'block';
            paymentStatus.innerHTML = '<p class="payment-ready">Order saved! Click "Pay Now with Square" to complete your payment.</p>';
        } else {
            // Re-enable button if saving failed
            saveAndPayButton.disabled = false;
            saveAndPayButton.textContent = 'Continue to Payment';
        }
        
    } catch (error) {
        console.error('Error in save and pay:', error);
        paymentStatus.innerHTML = '<p class="payment-error">Error saving order. Please try again.</p>';
        saveAndPayButton.disabled = false;
        saveAndPayButton.textContent = 'Continue to Payment';
    }
}

function handleDeliveryMethodChange() {
    const isShipping = document.getElementById('delivery-shipping').checked;
    const shippingFields = document.querySelector('.shipping-fields');
    const customerInfoTitle = document.getElementById('customer-info-title');
    
    // Clear all form fields when switching delivery methods
    clearFormFields();
    
    // Clear any previous validation errors
    document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
    
    // Reset payment flow state
    resetPaymentState();
    
    // Update UI based on delivery method
    if (isShipping) {
        shippingFields.style.display = 'block';
        customerInfoTitle.textContent = 'Shipping Information';
        
        // Update labels to show required fields
        document.getElementById('firstName-label').textContent = 'First Name *';
        document.getElementById('lastName-label').textContent = 'Last Name *';
        document.getElementById('email-label').textContent = 'Email *';
        
        // Set required attributes
        document.getElementById('firstName').required = true;
        document.getElementById('lastName').required = true;
        document.getElementById('email').required = true;
        document.getElementById('address').required = true;
        document.getElementById('city').required = true;
        document.getElementById('state').required = true;
        document.getElementById('zipCode').required = true;
        
        // Update order totals with shipping
        if (orderData) {
            orderData.shipping = 5.00;
            orderData.total = orderData.subtotal + orderData.shipping + orderData.tax;
            updateOrderDisplay();
        }
    } else {
        shippingFields.style.display = 'none';
        customerInfoTitle.textContent = 'Contact Information';
        
        // Update labels to show optional fields
        document.getElementById('firstName-label').textContent = 'First Name';
        document.getElementById('lastName-label').textContent = 'Last Name';
        document.getElementById('email-label').textContent = 'Email';
        
        // Remove required attributes for in-person pickup
        document.getElementById('firstName').required = false;
        document.getElementById('lastName').required = false;
        document.getElementById('email').required = false;
        document.getElementById('address').required = false;
        document.getElementById('city').required = false;
        document.getElementById('state').required = false;
        document.getElementById('zipCode').required = false;
        
        // Update order totals without shipping
        if (orderData) {
            orderData.shipping = 0.00;
            orderData.total = orderData.subtotal + orderData.shipping + orderData.tax;
            updateOrderDisplay();
        }
    }
}

function clearFormFields() {
    // Clear all customer information fields
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('address').value = '';
    document.getElementById('city').value = '';
    document.getElementById('state').value = '';
    document.getElementById('zipCode').value = '';
}

function resetPaymentState() {
    // Reset the payment flow to initial state
    const saveAndPayButton = document.getElementById('save-and-pay-button');
    const squareContainer = document.getElementById('square-payment-container');
    const paymentStatus = document.getElementById('payment-status');
    
    // Show the "Continue to Payment" button
    saveAndPayButton.style.display = 'block';
    saveAndPayButton.disabled = false;
    saveAndPayButton.textContent = 'Continue to Payment';
    
    // Hide the Square payment link
    squareContainer.style.display = 'none';
    
    // Clear payment status messages
    paymentStatus.innerHTML = '';
    
    // Reinitialize payment status
    initializePaymentStatus();
}

function updateOrderDisplay() {
    document.getElementById('payment-shipping').textContent = `$${orderData.shipping.toFixed(2)}`;
    document.getElementById('payment-total').textContent = `$${orderData.total.toFixed(2)}`;
    document.getElementById('payment-total-display').textContent = `$${orderData.total.toFixed(2)}`;
    
    // Update the prominent Square amount display
    const squareAmountDisplay = document.getElementById('square-amount-display');
    if (squareAmountDisplay) {
        squareAmountDisplay.textContent = `$${orderData.total.toFixed(2)}`;
    }
}

function checkPaymentCompletion() {
    // This function could be enhanced to check if payment was completed
    // For now, it's a placeholder for future Square webhook integration
    console.log('Checking payment completion...');
}

async function saveOrderToAirtable() {
    // Save order information to Airtable before user goes to Square payment
    if (!validateCustomerInfo()) {
        return false;
    }
    
    try {
        // Collect customer information
        const isShipping = document.getElementById('delivery-shipping').checked;
        const customerInfo = {
            firstName: document.getElementById('firstName').value || '-',
            lastName: document.getElementById('lastName').value || '-',
            email: document.getElementById('email').value || '-',
            phone: document.getElementById('phone').value || '-',
            address: isShipping ? document.getElementById('address').value : 'In-Person Pickup',
            city: isShipping ? document.getElementById('city').value : '-',
            state: isShipping ? document.getElementById('state').value : '-',
            zipCode: isShipping ? document.getElementById('zipCode').value : '-',
            deliveryMethod: isShipping ? 'Shipping' : 'In-Person Pickup'
        };
        
        // Create order confirmation
        const orderConfirmation = {
            orderId: 'ORDER-' + Date.now(),
            orderData: orderData,
            customerInfo: customerInfo,
            paymentStatus: 'Pending',
            timestamp: new Date().toISOString()
        };
        
        // Submit order to Airtable
        await submitOrderToAirtable(orderConfirmation);
        
        // Store order confirmation
        localStorage.setItem('orderConfirmation', JSON.stringify(orderConfirmation));
        
        return true;
        
    } catch (error) {
        console.error('Error saving order:', error);
        document.getElementById('payment-status').innerHTML = 
            '<p class="payment-error">Error saving order information. Please try again.</p>';
        return false;
    }
}


function validateCustomerInfo() {
    const isShipping = document.getElementById('delivery-shipping').checked;
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
    
    if (isShipping) {
        // For shipping orders, validate all fields
        const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            }
        });
        
        // Email validation
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value && !emailRegex.test(email.value)) {
            email.classList.add('error');
            isValid = false;
        }
    } else {
        // For in-person pickup, only validate email if provided
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value && !emailRegex.test(email.value)) {
            email.classList.add('error');
            isValid = false;
        }
        // In-person pickup is valid even with minimal info
        isValid = true;
    }
    
    if (!isValid) {
        document.getElementById('payment-status').innerHTML = 
            '<p class="payment-error">Please fill in all required fields correctly.</p>';
    }
    
    return isValid;
}

async function submitOrderToAirtable(orderConfirmation) {
    // Prepare order data for Airtable (matching README.md field names)
    const isInPersonPickup = orderConfirmation.customerInfo.deliveryMethod === 'In-Person Pickup';
    const addressText = isInPersonPickup 
        ? 'In-Person Pickup' 
        : `${orderConfirmation.customerInfo.address}, ${orderConfirmation.customerInfo.city}, ${orderConfirmation.customerInfo.state} ${orderConfirmation.customerInfo.zipCode}`;
    
    // Include delivery method in order items for tracking
    const orderItemsText = orderConfirmation.orderData.cart.map(item => 
        `${item.name} (${item.variant || item.color}) x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n') + `\n\nDelivery: ${orderConfirmation.customerInfo.deliveryMethod}`;
    
    const orderData = {
        'Order ID': String(orderConfirmation.orderId),
        'Customer Name': `${orderConfirmation.customerInfo.firstName} ${orderConfirmation.customerInfo.lastName}`,
        'Email': String(orderConfirmation.customerInfo.email),
        'Phone': String(orderConfirmation.customerInfo.phone || '-'),
        'Address': String(addressText),
        'Order Items': orderItemsText,
        'Subtotal': Number(orderConfirmation.orderData.subtotal.toFixed(2)),
        'Shipping': Number(orderConfirmation.orderData.shipping.toFixed(2)),
        'Tax': Number(orderConfirmation.orderData.tax.toFixed(2)),
        'Total': Number(orderConfirmation.orderData.total.toFixed(2)),
        'Payment Status': String(orderConfirmation.paymentStatus || 'Pending'),
        'Order Date': new Date(orderConfirmation.timestamp).toLocaleDateString('en-US'),
        'Payment Token': String(orderConfirmation.paymentToken ? orderConfirmation.paymentToken.substring(0, 20) + '...' : 'Square Payment Link')
    };
    
    try {
        const response = await fetch('/.netlify/functions/airtable', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'create',
                formType: 'customer-info',
                data: {
                    fields: orderData
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`Netlify function failed: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Order submitted to Airtable:', result);
        
    } catch (error) {
        console.error('Error submitting order to Airtable:', error);
        // Don't throw the error to avoid blocking the payment flow
        // In production, you might want to store the order locally and retry later
    }
}


// Real Square Payment Integration Instructions:
/*
To implement real Square payments:

1. Get Square Application ID:
   - Sign up at https://developer.squareup.com/
   - Create a new application
   - Get your Application ID from the Square Developer Dashboard

2. Replace the sandbox ID:
   - Change 'sandbox-sq0idb-YOUR_APPLICATION_ID' to your actual Application ID
   - For production, use the production environment

3. Server-side implementation:
   - Create a server endpoint to process payments
   - Use Square's Payments API to charge the token
   - Handle webhooks for payment status updates

4. Security considerations:
   - Never process payments client-side only
   - Implement proper error handling
   - Add fraud prevention measures
   - Use HTTPS in production

5. Testing:
   - Use Square's test card numbers for testing
   - Test various scenarios (success, decline, etc.)
*/