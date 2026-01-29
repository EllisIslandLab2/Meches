# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a Next.js 15 application using the App Router and React Server Components:

- **Local Development**: `npm run dev` (uses Turbopack for fast refresh)
- **Build**: `npm run build` (production build with Turbopack)
- **Start Production**: `npm start` (runs production server)
- **Lint**: `npm run lint` (ESLint)
- **Square Import**: `npm run square:import` (import products from Airtable to Square)
- **Square Environment**: `npm run square:sandbox` or `npm run square:production`

## Architecture Overview

This is a server-rendered ecommerce website for handmade crafts built with Next.js.

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **UI**: React 19, TypeScript, Tailwind CSS 4
- **Payment Processing**: Square API
- **Database**: Airtable (product catalog, orders, inquiries)
- **Email**: Resend API
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics

### Core Pages & Routes
- **`src/app/page.tsx`**: Product catalog homepage with shopping cart
- **`src/app/checkout/page.tsx`**: Shopping cart management and checkout flow
- **`src/app/payment/page.tsx`**: Square payment processing integration
- **`src/app/contact/page.tsx`**: Contact forms for inquiries and custom orders
- **`src/app/success/page.tsx`**: Order confirmation page
- **`src/app/track-order/`**: Order tracking interface
- **`src/app/admin/`**: Admin panel for shipping notifications

### Key Components
- **`src/components/Header.tsx`**: Site header with cart, navigation (mobile/desktop variants)
- **`src/components/ProductCard.tsx`**: Individual product display
- **`src/components/ProductsClient.tsx`**: Client-side product catalog with filtering
- **`src/components/CartModal.tsx`**: Shopping cart overlay
- **`src/components/DynamicBackground.tsx`**: Seasonal background images
- **`src/components/WLABadge.tsx`**: "Women in Louisiana Arts" badge

### API Routes (`src/app/api/`)
- **`products-swr/route.ts`**: Fetch products from Airtable (with SWR support)
- **`square-payment/route.ts`**: Process Square payments
- **`square-locations/route.ts`**: Fetch Square shipping locations
- **`airtable/route.ts`**: General Airtable operations
- **`airtable-webhook/route.ts`**: Webhook for Airtable updates
- **`send-order-confirmation/route.ts`**: Send order confirmation emails via Resend
- **`send-shipping-notification/route.ts`**: Send shipping notifications
- **`get-order/[orderId]/route.ts`**: Retrieve order details
- **`admin/verify-password/route.ts`**: Admin authentication

### Data Management
- **Products**: Fetched from Airtable via `/api/products-swr` endpoint
- **Shopping Cart**: Managed via localStorage on client-side, shared across pages
- **Orders**: Created in Airtable after successful Square payment
- **Form Submissions**: Contact and custom order forms sent to Airtable tables

### Key Integration Points
- **Square Payments**: Environment-based configuration (sandbox/production)
- **Airtable**: Two main tables - `Products`, `Orders`, `General_Inquiries`, `Custom_Orders`
- **Resend**: Transactional emails for order confirmations and shipping
- **LocalStorage**: Cart persistence across page navigation

### Important Configuration
- **Environment Variables**: See `.env.example` for required variables
  - Square API credentials (sandbox/production)
  - Airtable API token and base IDs
  - Resend API key
  - Admin password for shipping notifications
- **Vercel Configuration**: `vercel.json` sets API timeouts (30s), CORS headers, cache control
- **Product Images**: Stored in Airtable and referenced via URL

### Security Considerations
- API keys stored in environment variables (never exposed to client)
- Server-side API routes handle all sensitive operations
- Admin routes protected with password verification
- HTTPS required for Square payment processing (enforced in production)
- CORS configured for API endpoints

### Styling
- **Tailwind CSS 4**: Utility-first styling with custom color scheme
- **Color Scheme**: Gold/brown/cream aesthetic for handmade crafts
- **Responsive Design**: Mobile-first with distinct mobile/desktop header layouts
- **Glass Morphism**: `GlassCard` component for modern UI elements

## Key Files to Modify

**Adding/modifying products**: Update Airtable `Products` table, or use Square import script
**Styling changes**: Edit `src/app/globals.css` for Tailwind config and custom CSS
**Contact forms**: Modify `src/app/contact/page.tsx` and `src/app/api/airtable/route.ts`
**Payment flow**: Update `src/app/payment/page.tsx` and `src/app/api/square-payment/route.ts`
**Email templates**: Edit email content in `src/app/api/send-order-confirmation/route.ts`
**Header/navigation**: Modify `src/components/Header.tsx`
**Product display**: Update `src/components/ProductCard.tsx` or `src/components/ProductsClient.tsx`
