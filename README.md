# Meche's Handmade Crafts - Ecommerce Website

A beautiful, responsive ecommerce website for selling handmade crafts including earrings, necklaces, keychains, and laser-cut wooden designs.

## Features

### 🛍️ Shopping Experience
- **Product Gallery**: Display products with color options and quantity selectors
- **Shopping Cart**: Add items to cart with color/quantity selection
- **Checkout Process**: Full checkout flow with cart editing capabilities
- **Payment Integration**: Square payment processing (demo ready)

### 📱 User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Craft Aesthetic**: Warm colors and handmade-style design
- **Interactive Elements**: Smooth animations and hover effects
- **Logo Placeholder**: Ready for your custom logo

### 📞 Customer Service
- **Contact Forms**: General inquiries and custom order requests
- **Airtable Integration**: Automatic form submission to Airtable database
- **Custom Orders**: Detailed form for product customizations

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Styling**: Custom CSS with craft-inspired design
- **Payment**: Square Web Payments SDK
- **Database**: Airtable integration for form submissions
- **Responsive**: Mobile-first responsive design

## File Structure

```
Meche-crafts-shop/
├── index.html              # Main homepage
├── checkout.html           # Shopping cart and checkout
├── payment.html            # Payment processing page
├── contact.html            # Contact and custom orders
├── success.html            # Order confirmation page
├── styles.css              # Main stylesheet
├── script.js              # Homepage functionality
├── checkout.js            # Checkout page logic
├── payment.js             # Payment processing
├── contact.js             # Contact form handling
├── success.js             # Success page logic
└── README.md              # This file
```

## Setup Instructions

### 1. Basic Setup
1. Download all files to your web server
2. Replace `logo-placeholder.png` with your actual logo
3. Add product images to match the filenames in `script.js`
4. Open `index.html` in a web browser

### 2. Square Payment Integration
1. Sign up at [Square Developer Portal](https://developer.squareup.com/)
2. Create a new application
3. Get your Application ID
4. In `payment.js`, replace `'sandbox-sq0idb-YOUR_APPLICATION_ID'` with your actual ID
5. For production, change to production environment

### 3. Airtable Integration
1. Create an Airtable account at [airtable.com](https://airtable.com)
2. Create a base with tables:
   - `General_Inquiries` (Name, Email, Phone, Subject, Message, Type, Timestamp)
   - `Custom_Orders` (Name, Email, Phone, Product Type, Colors, Materials, Size, Quantity, Budget, Deadline, Description, Inspiration, Type, Timestamp)
   - 'Orders' (Order ID, Customer Name, Email, Phone, Address, Order Items, Subtotal, Shipping, Tax,
  Total, Payment Status, Order Date, Payment Token)
3. Get your API key and base ID
4. In `contact.js`, update the configuration:
   ```javascript
   const AIRTABLE_API_KEY = 'your_api_key_here';
   const AIRTABLE_BASE_ID = 'your_base_id_here';
   ```
5. Uncomment the actual API call code and remove simulation code

### 4. Product Customization
Edit the `products` array in `script.js` to add your own products:
```javascript
{
    id: 1,
    name: "Your Product Name",
    price: 25.00,
    image: "your-image.jpg",
    category: "your-category",
    colors: ["Color1", "Color2", "Color3"],
    description: "Product description"
}
```

## Customization Guide

### Adding Products
1. Add product images to the main directory
2. Update the `products` array in `script.js`
3. Images should be optimized for web (recommended: 400x400px)

### Changing Colors/Styling
- Primary craft colors are defined in CSS variables
- Main color scheme: Gold (#d4af37), Brown (#8b4513), Cream (#f4e4bc)
- Edit `styles.css` to customize the color palette

### Logo Integration
- Replace `logo-placeholder.png` with your logo (recommended: 100x100px)
- Logo appears in the navigation on all pages

### Contact Information
Update contact details in `contact.html`:
- Email address
- Phone number
- Business hours
- Customization options list

## Browser Compatibility

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Notes

⚠️ **Important for Production:**
- Never expose API keys in client-side code
- Use HTTPS for payment processing
- Implement server-side validation
- Set up proper CORS policies
- Use environment variables for sensitive data

## Testing

### Payment Testing
- Square provides test card numbers for development
- Use sandbox environment for testing
- Test various payment scenarios (success, decline, error)

### Form Testing
- Test all form validations
- Verify Airtable integration
- Test responsive design on various devices

## Deployment

1. Upload all files to your web hosting service
2. Ensure HTTPS is enabled (required for Square payments)
3. Test all functionality on the live server
4. Monitor form submissions and payment processing

## Support

For issues with:
- **Square Payments**: [Square Developer Documentation](https://developer.squareup.com/docs)
- **Airtable**: [Airtable API Documentation](https://airtable.com/developers/web/api/introduction)
- **General Web Issues**: Check browser console for errors

## License

This project is provided as-is for Meche's craft business. Modify and use as needed for your business requirements.