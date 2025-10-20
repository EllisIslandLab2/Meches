# Quick Start Guide - Shipping & Order Tracking

## What's Been Added

Your site now has a complete order tracking and shipping notification system! Here's what happens automatically:

### When a Customer Places an Order

1. ✅ Payment processed through Square
2. ✅ Order logged to Airtable automatically
3. ✅ Customer receives confirmation email with order details
4. ✅ Customer can track their order on the website

### When You Ship an Order

1. You update the order in Airtable with tracking info
2. Airtable automation triggers automatically
3. Customer receives shipping notification email with tracking link
4. Customer can click to track their package

---

## Quick Setup (5 Minutes)

### 1. Get Resend API Key

1. Go to [resend.com/signup](https://resend.com/signup)
2. Create a free account
3. Go to API Keys → Create API Key
4. Copy the key (starts with `re_`)

### 2. Add to .env.local

Open `.env.local` and replace:
```bash
RESEND_API_KEY=your_resend_api_key_here
```

With your actual key:
```bash
RESEND_API_KEY=re_abc123xyz...
```

### 3. Add Fields to Airtable

In your Orders table, add these 3 new fields:

| Field Name | Type | Options |
|------------|------|---------|
| Payment ID | Single line text | - |
| Status | Single select | Pending, Processing, Shipped, Delivered |
| Tracking Number | Single line text | - |
| Carrier | Single select | USPS, UPS, FedEx |

### 4. Set Up Airtable Automation

See `SHIPPING_SETUP.md` for detailed instructions, or:

1. Airtable → Automations → Create
2. Trigger: When "Status" is "Shipped"
3. Action: Send request to URL
4. URL: `http://localhost:3000/api/airtable-webhook` (or your domain)
5. Method: POST
6. Body: Copy from SHIPPING_SETUP.md
7. Turn it ON

---

## How to Use It

### Daily Workflow

1. **Check Airtable** for new orders (they appear automatically)
2. **Change Status to "Processing"** when you start making the item
3. **When ready to ship:**
   - Add tracking number
   - Set carrier (USPS/UPS/FedEx)
   - Change status to "Shipped"
4. **Customer gets email automatically** with tracking info!

---

## Test It Right Now

### Test Order Confirmation

1. Make a test purchase on your site
2. Check your email for confirmation
3. Check Airtable - order should be there!

### Test Shipping Notification

1. Pick any order in Airtable
2. Add tracking: `1Z9999999999999999`
3. Set carrier: USPS
4. Change status to: Shipped
5. Check your email!

---

## Customer Features

### Order Tracking Page

Customers can track at: `yoursite.com/track-order/[ORDER-ID]`

Shows:
- Current status with icon
- Tracking number with link to carrier
- Order items and totals
- Shipping address
- Auto-updates when you change Airtable

### Confirmation Email

Sent automatically after payment with:
- Order number and details
- Items ordered
- Totals breakdown
- Link to track order
- Beautiful Maria's Crafts branding

### Shipping Email

Sent automatically when you mark as shipped:
- Tracking number
- Carrier info
- Direct link to track package
- Estimated delivery time
- Items in shipment

---

## Files Created

- `/src/app/api/send-order-confirmation/route.ts` - Confirmation email API
- `/src/app/api/send-shipping-notification/route.ts` - Shipping email API
- `/src/app/api/airtable-webhook/route.ts` - Webhook for Airtable automation
- `/src/app/api/get-order/[orderId]/route.ts` - Fetch order for tracking page
- `/src/app/track-order/[orderId]/page.tsx` - Order tracking page
- `/src/app/success/page.tsx` - Updated with tracking link

---

## Need Help?

See `SHIPPING_SETUP.md` for:
- Detailed setup instructions
- Troubleshooting guide
- Environment variables reference
- Production deployment checklist

---

## What's Next?

Once you've tested everything locally:

1. Get a Resend API key (done above)
2. Verify your domain in Resend (for production)
3. Update `EMAIL_FROM` to `orders@yourdomain.com`
4. Update Airtable webhook URL to production domain
5. Deploy and test!

That's it! Your shipping system is ready to go! 🎉
