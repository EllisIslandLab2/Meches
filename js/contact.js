// Contact form functionality with Airtable integration
document.addEventListener('DOMContentLoaded', function() {
    setupFormEventListeners();
});

function setupFormEventListeners() {
    const generalForm = document.getElementById('general-contact-form');
    const customOrderForm = document.getElementById('custom-order-form');
    const successModal = document.getElementById('success-modal');
    const closeButtons = document.querySelectorAll('.close, #close-success');
    
    generalForm.addEventListener('submit', handleGeneralFormSubmit);
    customOrderForm.addEventListener('submit', handleCustomOrderFormSubmit);
    
    closeButtons.forEach(button => {
        button.addEventListener('click', closeSuccessModal);
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === successModal) {
            closeSuccessModal();
        }
    });
}

async function handleGeneralFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
        'Name': formData.get('name'),
        'Email': formData.get('email'),
        'Phone': formData.get('phone') || '',
        'Subject': formData.get('subject'),
        'Message': formData.get('message'),
        'Type': 'General Inquiry',
        'Timestamp': new Date().toISOString()
    };
    
    await submitToAirtable(data, 'general-contact-form');
    showSuccessModal('Thank you for your message! We\'ll get back to you within 24 hours.');
    event.target.reset();
}

async function handleCustomOrderFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
        'Name': formData.get('name'),
        'Email': formData.get('email'),
        'Phone': formData.get('phone') || '',
        'Product Type': formData.get('productType'),
        'Colors': formData.get('colors') || '',
        'Materials': formData.get('materials') || '',
        'Size': formData.get('size') || '',
        'Quantity': parseInt(formData.get('quantity')) || 1,
        'Budget': formData.get('budget') || '',
        'Deadline': formData.get('deadline') || '',
        'Description': formData.get('description'),
        'Inspiration': formData.get('inspiration') || '',
        'Type': 'Custom Order Request',
        'Timestamp': new Date().toISOString()
    };
    
    await submitToAirtable(data, 'custom-order-form');
    showSuccessModal('Thank you for your custom order request! We\'ll review your requirements and get back to you with a quote within 2-3 business days.');
    event.target.reset();
}

async function submitToAirtable(data, formType) {
    try {
        const response = await fetch('/.netlify/functions/airtable', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'create',
                formType: formType,
                data: {
                    fields: data
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`Netlify function failed: ${response.status}`);
        }
        
        const result = await response.json();
        console.log(`${formType} submitted to Airtable:`, result);
        
    } catch (error) {
        console.error('Error submitting to Airtable:', error);
        // Show error message to user
        showErrorMessage('There was an error sending your message. Please try again or contact us directly.');
    }
}


async function simulateEmailNotification(data, formType) {
    // In a real application, you might use a service like EmailJS, SendGrid, or Mailgun
    // to send email notifications to Maria when forms are submitted
    
    const emailData = {
        to: 'maria@mariacrafts.com',
        subject: `New ${formType === 'general-inquiry' ? 'General Inquiry' : 'Custom Order Request'} from ${data.name}`,
        message: formatEmailMessage(data, formType)
    };
    
    console.log('Email notification sent:', emailData);
}

function formatEmailMessage(data, formType) {
    if (formType === 'general-inquiry') {
        return `
New General Inquiry:

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Subject: ${data.subject}

Message:
${data.message}

Submitted: ${new Date(data.timestamp).toLocaleString()}
        `;
    } else {
        return `
New Custom Order Request:

Customer Information:
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}

Order Details:
Product Type: ${data.productType}
Quantity: ${data.quantity}
Colors: ${data.colors}
Materials: ${data.materials}
Size: ${data.size}
Budget: ${data.budget}
Deadline: ${data.deadline}

Description:
${data.description}

Inspiration:
${data.inspiration}

Submitted: ${new Date(data.timestamp).toLocaleString()}
        `;
    }
}

function showSuccessModal(message) {
    const modal = document.getElementById('success-modal');
    const messageElement = document.getElementById('success-message');
    messageElement.textContent = message;
    modal.style.display = 'block';
}

function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    modal.style.display = 'none';
}

function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Airtable Integration Setup Instructions:
/*
To set up Airtable integration:

1. Create an Airtable account and base:
   - Sign up at https://airtable.com
   - Create a new base for your craft business
   - Create tables for "General_Inquiries" and "Custom_Orders"

2. Set up your tables with these fields:

   General_Inquiries table:
   - Name (Single line text)
   - Email (Email)
   - Phone (Phone number)
   - Subject (Single select)
   - Message (Long text)
   - Type (Single line text)
   - Timestamp (Date & time)

   Custom_Orders table:
   - Name (Single line text)
   - Email (Email)
   - Phone (Phone number)
   - Product Type (Single select)
   - Colors (Single line text)
   - Materials (Single line text)
   - Size (Single line text)
   - Quantity (Number)
   - Budget (Single select)
   - Deadline (Date)
   - Description (Long text)
   - Inspiration (Long text)
   - Type (Single line text)
   - Timestamp (Date & time)

3. Get your API credentials:
   - Go to https://airtable.com/account
   - Generate a personal access token
   - Get your base ID from the API documentation page

4. Update the configuration:
   - Replace 'YOUR_AIRTABLE_API_KEY' with your personal access token
   - Replace 'YOUR_AIRTABLE_BASE_ID' with your base ID
   - Uncomment the actual API call code
   - Remove or comment out the simulation code

5. Security considerations:
   - Never expose API keys in client-side code for production
   - Consider using a backend server to handle API calls
   - Implement rate limiting and validation

6. Optional enhancements:
   - Set up Airtable automations to send email notifications
   - Create views to organize and filter submissions
   - Set up Zapier integrations for additional workflows
*/