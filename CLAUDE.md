# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a static HTML/CSS/JavaScript website with no build process. To develop:

- **Local Development**: Open `index.html` directly in a browser or use a local server
- **Testing**: Manual testing in browser - no automated test framework
- **Deployment**: Upload files directly to web hosting service

## Architecture Overview

This is a client-side ecommerce website for handmade crafts with the following architecture:

### Core Pages & Functionality
- **index.html + script.js**: Product catalog with shopping cart functionality
- **checkout.html + checkout.js**: Shopping cart management and checkout flow
- **payment.html + payment.js**: Square payment processing integration
- **contact.html + contact.js**: Contact forms with Airtable integration
- **success.html + success.js**: Order confirmation page
- **styles.css**: Unified styling for craft aesthetic (gold/brown/cream color scheme)

### Data Management
- **Products**: Defined in `products` array in `script.js:1-80`
- **Shopping Cart**: Managed via localStorage, shared across pages
- **Form Submissions**: Sent to Airtable via REST API calls in `contact.js`

### Key Integration Points
- **Square Payments**: Sandbox environment configured in `payment.js`
- **Airtable Database**: Two tables - `General_Inquiries` and `Custom_Orders`
- **LocalStorage**: Cart persistence across page navigation

### Important Configuration
- **Square Application ID**: Currently set to sandbox mode in `payment.js`
- **Airtable API**: Credentials need to be configured in `contact.js:72-75`
- **Product Images**: Referenced by filename in product data, should be in root directory

### Security Considerations
- API keys are currently exposed in client-side code (needs server-side implementation for production)
- HTTPS required for Square payment processing
- Form validation handled client-side only

## Key Files to Modify

When adding products: Edit `products` array in `script.js`
When changing styling: Modify CSS variables in `styles.css` for color scheme
When updating contact info: Edit contact details in `contact.html`
When configuring payments: Update Square credentials in `payment.js`
When setting up forms: Configure Airtable API in `contact.js`