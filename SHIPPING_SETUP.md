# Shipping & Order Tracking Setup Guide

This guide will help you set up the complete order tracking and shipping notification system for Maria's Crafts.

## Prerequisites

You'll need:
1. **Resend Account** - For sending emails
2. **Airtable Account** - Already set up
3. **Domain (optional)** - For production email sending

---

## Step 1: Set Up Resend for Email Notifications

### Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account (3,000 emails/month free)
3. Verify your email address

### Get Your API Key

1. In Resend dashboard, go to **API Keys**
2. Click **Create API Key**
3. Name it "Maria's Crafts Production"
4. Copy the API key (starts with `re_`)

### Add to Environment Variables

Add these to your `.env.local` file:

```bash
# Resend Email Configuration
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=orders@mariacrafts.com

# Base URL for your site
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### Verify Your Domain (For Production)

For testing, you can use `onboarding@resend.dev` as the sender.
For production:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `mariacrafts.com`)
4. Add the DNS records shown to your domain provider
5. Once verified, update `EMAIL_FROM` to `orders@mariacrafts.com`

---

## Step 2: Update Airtable Orders Table

### Add Required Fields

Your Orders table needs these fields (add any missing ones):

| Field Name | Field Type | Description |
|------------|-----------|-------------|
| Order ID | Single line text | Unique order identifier (primary field) |
| Customer Name | Single line text | Full customer name |
| Email | Email | Customer email address |
| Phone | Phone number | Customer phone |
| Address | Long text | Full shipping address |
| Order Items | Long text | List of ordered items |
| Subtotal | Currency | Order subtotal |
| Shipping | Currency | Shipping cost |
| Tax | Currency | Tax amount |
| Discount | Currency | Discount applied |
| Total | Currency | Final total |
| Payment Status | Single line text | "Paid", "Refunded", etc. |
| Order Date | Date | When order was placed |
| **Status** | **Single select** | **ADD THIS** - Order status |
| **Tracking Number** | **Single line text** | **ADD THIS** - Shipping tracking # |
| **Carrier** | **Single select** | **ADD THIS** - Shipping carrier |

### Configure the Status Field

Create a **Single select** field named "Status" with these options:
- Pending (default)
- Processing
- Shipped
- Delivered
- Cancelled

### Configure the Carrier Field

Create a **Single select** field named "Carrier" with these options:
- USPS
- UPS
- FedEx
- Other

---

## Step 3: Set Up Airtable Automation

This automation will automatically send shipping emails when you mark an order as "Shipped".

### Create the Automation

1. Open your Airtable base
2. Click **Automations** in the top toolbar
3. Click **Create automation**
4. Name it: "Send Shipping Notification"

### Configure the Trigger

1. **Trigger type**: "When record matches conditions"
2. **Table**: Orders
3. **Condition**:
   - When "Status" is "Shipped"
   - AND "Email" is not empty
   - AND "Tracking Number" is not empty

### Configure the Action

1. **Action type**: "Send a request to a URL"
2. **URL**: `https://your-domain.com/api/airtable-webhook`
   - Replace with your actual domain
   - For local testing: `http://localhost:3000/api/airtable-webhook`
3. **Method**: POST
4. **Headers**:
   ```
   Content-Type: application/json
   ```
5. **Body** (click "Use JSON"):
   ```json
   {
     "orderId": "{{Order ID from trigger step}}",
     "email": "{{Email from trigger step}}",
     "customerName": "{{Customer Name from trigger step}}",
     "trackingNumber": "{{Tracking Number from trigger step}}",
     "carrier": "{{Carrier from trigger step}}",
     "orderItems": "{{Order Items from trigger step}}",
     "status": "{{Status from trigger step}}"
   }
   ```

   **Note**: Use Airtable's field picker to insert the actual field values

6. Click **Test** to verify it works
7. **Turn on the automation**

---

## Step 4: Manual Order Fulfillment Workflow

Here's your day-to-day workflow when an order comes in:

### When a New Order Arrives

1. **Order appears in Airtable automatically** after payment
   - Status: "Pending"
   - Customer receives confirmation email automatically
   - All order details are logged

### When You Start Making the Item

1. In Airtable, change **Status** to "Processing"
2. This lets you track what you're actively working on

### When the Item is Complete and Ready to Ship

1. Package the item carefully
2. Create a shipping label (USPS, UPS, FedEx, etc.)
3. Note the tracking number

### When You Ship the Item

1. In Airtable, update the order record:
   - **Tracking Number**: Enter the tracking number
   - **Carrier**: Select the carrier (USPS, UPS, FedEx)
   - **Status**: Change to "Shipped"

2. **Automation triggers automatically:**
   - Customer receives shipping notification email with tracking link
   - Email includes tracking number and estimated delivery
   - Customer can click to track package

### When the Order is Delivered

1. Optionally update **Status** to "Delivered"
2. This helps you keep records of completed orders

---

## Step 5: Order Tracking Page

Customers can track their orders at:
```
https://your-domain.com/track-order/[ORDER-ID]
```

### Features

- Shows current order status (Pending, Processing, Shipped, Delivered)
- Displays tracking number (when available)
- Links directly to carrier tracking page
- Shows order items, totals, and shipping address
- Updates automatically when you change status in Airtable

### Customer Access

Customers get their order number:
1. On the success page after payment
2. In the confirmation email
3. Can bookmark or save it for later tracking

---

## Step 6: Testing the System

### Test Order Confirmation Email

1. Make a test purchase on your site
2. Check that you receive:
   - Order confirmation email
   - Order logged in Airtable
   - Order ID populated

### Test Shipping Notification Email

1. Find a test order in Airtable
2. Add a fake tracking number (e.g., "1Z9999999999999999")
3. Set Carrier to "USPS"
4. Change Status to "Shipped"
5. Check your email for the shipping notification
6. Verify the tracking link works

### Test Order Tracking Page

1. Get an order ID from Airtable
2. Visit: `https://your-domain.com/track-order/[ORDER-ID]`
3. Verify all information displays correctly
4. Test with different order statuses

---

## Troubleshooting

### Emails Not Sending

1. **Check Resend API key** in `.env.local`
2. **Verify domain** is verified in Resend (for production)
3. **Check spam folder** - test emails often go there
4. **View logs** in Resend dashboard to see delivery status

### Airtable Automation Not Triggering

1. **Check automation is turned ON** in Airtable
2. **Verify all required fields** are filled (Email, Tracking Number, Status)
3. **Check webhook URL** is correct in automation settings
4. **Test manually** using the "Test" button in automation
5. **View run history** in Airtable automation panel

### Order Tracking Page Shows "Not Found"

1. **Verify Order ID** matches exactly (case-sensitive)
2. **Check Airtable connection** in `.env.local`
3. **Ensure order exists** in Airtable Orders table
4. **Check field names** match exactly in code

### Confirmation Email Not Sending After Payment

1. **Check server logs** for email errors
2. **Verify NEXT_PUBLIC_BASE_URL** is set correctly
3. **Check Resend API key** is valid
4. **Ensure customer email** was captured during checkout

---

## Environment Variables Summary

Here's all the environment variables you need:

```bash
# Airtable Configuration
AIRTABLE_API_KEY=your_airtable_key
AIRTABLE_BASE_ID=your_base_id
ORDERS_TABLE=Orders
PRODUCTS_TABLE=Products
CUSTOM_TABLE=Custom_Orders
INQUIRIES_TABLE=General_Inquiries

# Square Payment Configuration
NEXT_PUBLIC_SQUARE_ENVIRONMENT=production  # or sandbox
NEXT_PUBLIC_SQUARE_APPLICATION_ID=your_app_id
NEXT_PUBLIC_SQUARE_LOCATION_ID=your_location_id
SQUARE_ACCESS_TOKEN=your_production_token  # for production
SQUARE_ACCESS_TOKEN_SANDBOX=your_sandbox_token  # for testing

# Resend Email Configuration
RESEND_API_KEY=re_your_api_key
EMAIL_FROM=orders@mariacrafts.com

# Base URL
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

---

## Email Templates

Both confirmation and shipping emails are professionally designed with:
- Maria's Crafts branding (gold/brown color scheme)
- Mobile-responsive layout
- Clear order information
- Tracking links (for shipping emails)
- Customer support contact info

You can customize the templates in:
- `/src/app/api/send-order-confirmation/route.ts`
- `/src/app/api/send-shipping-notification/route.ts`

---

## Production Checklist

Before going live:

- [ ] Resend account created and domain verified
- [ ] All environment variables set in production
- [ ] Airtable automation created and tested
- [ ] Test order placed and confirmation received
- [ ] Test shipping notification sent and received
- [ ] Order tracking page tested with real order
- [ ] Square switched to production mode
- [ ] All email templates reviewed and approved
- [ ] Webhook URL updated to production domain

---

## Support

If you need help:
1. Check the troubleshooting section above
2. Review Resend logs for email delivery status
3. Check Airtable automation run history
4. Review browser console for errors on order tracking page

---

## Future Enhancements

Consider adding:
- SMS notifications via Twilio
- Auto-update delivered status via carrier API
- Customer review requests after delivery
- Discount codes and promotions
- Gift message support
- Order status webhooks for real-time updates
