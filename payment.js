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
        itemElement.innerHTML = `
            <span>${item.name} (${item.color}) x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        orderItemsContainer.appendChild(itemElement);
    });
    
    // Display totals
    document.getElementById('payment-subtotal').textContent = `$${orderData.subtotal.toFixed(2)}`;
    document.getElementById('payment-shipping').textContent = `$${orderData.shipping.toFixed(2)}`;
    document.getElementById('payment-tax').textContent = `$${orderData.tax.toFixed(2)}`;
    document.getElementById('payment-total').textContent = `$${orderData.total.toFixed(2)}`;
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
        const customerInfo = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zipCode: document.getElementById('zipCode').value
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
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });
    
    // Email validation
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value && !emailRegex.test(email.value)) {
        email.classList.add('error');
        isValid = false;
    }
    
    if (!isValid) {
        document.getElementById('payment-status').innerHTML = 
            '<p class="payment-error">Please fill in all required fields correctly.</p>';
    }
    
    return isValid;
}

async function submitOrderToAirtable(orderConfirmation) {
    // Prepare order data for Airtable (matching README.md field names)
    const orderData = {
        'Order ID': orderConfirmation.orderId,
        'Customer Name': `${orderConfirmation.customerInfo.firstName} ${orderConfirmation.customerInfo.lastName}`,
        'Email': orderConfirmation.customerInfo.email,
        'Phone': orderConfirmation.customerInfo.phone || '',
        'Address': `${orderConfirmation.customerInfo.address}, ${orderConfirmation.customerInfo.city}, ${orderConfirmation.customerInfo.state} ${orderConfirmation.customerInfo.zipCode}`,
        'Order Items': orderConfirmation.orderData.cart.map(item => 
            `${item.name} (${item.color}) x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
        ).join('\n'),
        'Subtotal': orderConfirmation.orderData.subtotal,
        'Shipping': orderConfirmation.orderData.shipping,
        'Tax': orderConfirmation.orderData.tax,
        'Total': orderConfirmation.orderData.total,
        'Payment Status': orderConfirmation.paymentStatus || 'Pending',
        'Order Date': orderConfirmation.timestamp,
        'Payment Token': orderConfirmation.paymentToken ? orderConfirmation.paymentToken.substring(0, 20) + '...' : 'Square Payment Link'
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