// Payment functionality with Square integration
let orderData = null;
let payments = null;
let cardButton = null;

document.addEventListener('DOMContentLoaded', async function() {
    loadOrderData();
    displayOrderSummary();
    await initializeSquarePayments();
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

async function initializeSquarePayments() {
    try {
        // Initialize Square Payments
        // NOTE: Replace 'sandbox-sq0idb-YOUR_APPLICATION_ID' with your actual Square Application ID
        payments = Square.payments('sandbox-sq0idb-YOUR_APPLICATION_ID', 'sandbox');
        
        // Initialize Card payment method
        const card = await payments.card();
        await card.attach('#square-card-container');
        
        cardButton = card;
        
        // Update payment status
        document.getElementById('payment-status').innerHTML = 
            '<p class="payment-ready">Payment form ready. Enter your card details above.</p>';
            
    } catch (error) {
        console.error('Square Payments initialization failed:', error);
        document.getElementById('payment-status').innerHTML = 
            '<p class="payment-error">Payment system unavailable. Please contact us directly to complete your order.</p>';
        
        // Disable pay button
        document.getElementById('pay-button').disabled = true;
    }
}

function setupEventListeners() {
    const payButton = document.getElementById('pay-button');
    payButton.addEventListener('click', handlePayment);
}

async function handlePayment() {
    if (!validateCustomerInfo()) {
        return;
    }
    
    const payButton = document.getElementById('pay-button');
    const paymentStatus = document.getElementById('payment-status');
    
    // Disable button and show processing
    payButton.disabled = true;
    payButton.textContent = 'Processing...';
    paymentStatus.innerHTML = '<p class="payment-processing">Processing payment...</p>';
    
    try {
        // Get payment token from Square
        const result = await cardButton.tokenize();
        
        if (result.status === 'OK') {
            // In a real application, you would send this token to your server
            // to process the payment with Square's Payments API
            
            // For demo purposes, we'll simulate a successful payment
            await simulatePaymentProcessing(result.token);
            
        } else {
            throw new Error(result.errors?.[0]?.detail || 'Payment failed');
        }
        
    } catch (error) {
        console.error('Payment error:', error);
        paymentStatus.innerHTML = `<p class="payment-error">Payment failed: ${error.message}</p>`;
        payButton.disabled = false;
        payButton.textContent = 'Complete Payment';
    }
}

async function simulatePaymentProcessing(token) {
    // Simulate server processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
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
        paymentToken: token,
        timestamp: new Date().toISOString()
    };
    
    // Submit order to Airtable
    await submitOrderToAirtable(orderConfirmation);
    
    // Store order confirmation
    localStorage.setItem('orderConfirmation', JSON.stringify(orderConfirmation));
    
    // Clear cart
    localStorage.removeItem('cart');
    localStorage.removeItem('orderData');
    
    // Redirect to success page
    window.location.href = 'success.html';
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
    // Prepare order data for Airtable
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
        'Payment Status': 'Completed',
        'Order Date': orderConfirmation.timestamp,
        'Payment Token': orderConfirmation.paymentToken.substring(0, 20) + '...' // Truncate for security
    };
    
    try {
        const response = await fetch('/.netlify/functions/airtable', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'create',
                tableName: 'Orders',
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