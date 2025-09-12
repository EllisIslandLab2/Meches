# Meche's Handmade Crafts - Next.js Version

A modern, high-performance e-commerce website built with Next.js 15, TypeScript, and Tailwind CSS, optimized for Vercel deployment.

## ✨ Performance Improvements

### Speed Enhancements
- **Next.js 15** with Turbopack for ultra-fast development and builds
- **Server-Side Rendering (SSR)** for instant page loads
- **Image optimization** with Next.js Image component
- **Code splitting** and lazy loading for optimal bundle sizes
- **Edge Functions** for API routes with global distribution

### Modern Architecture
- **TypeScript** for type safety and better developer experience
- **React 19** with latest features and optimizations
- **Tailwind CSS 4** for efficient styling with minimal CSS bundle
- **Cart Context** with React hooks for state management
- **Client-side hydration** for interactive components

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Airtable account
- Square developer account

### Installation
```bash
git clone <your-repo>
cd meches-nextjs
npm install
```

### Environment Setup
1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Configure your environment variables:
```env
# Airtable Configuration
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id
CUSTOM_TABLE=Custom_Orders
ORDERS_TABLE=Customer_Orders
INQUIRIES_TABLE=General_Inquiries

# Square Configuration
NEXT_PUBLIC_SQUARE_APPLICATION_ID=your_square_application_id
NEXT_PUBLIC_SQUARE_LOCATION_ID=your_square_location_id
```

### Development
```bash
npm run dev
```

Visit http://localhost:3000 to see your site.

## 🌐 Vercel Deployment

### Automatic Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on every push

### Manual Deployment
```bash
npm install -g vercel
vercel
```

### Environment Variables in Vercel
Configure these in your Vercel dashboard under "Environment Variables":

- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID` 
- `CUSTOM_TABLE`
- `ORDERS_TABLE`
- `INQUIRIES_TABLE`
- `NEXT_PUBLIC_SQUARE_APPLICATION_ID`
- `NEXT_PUBLIC_SQUARE_LOCATION_ID`

## 🏗 Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── api/               # API routes
│   │   └── airtable/      # Airtable integration
│   ├── checkout/          # Shopping cart page
│   ├── contact/           # Contact forms
│   ├── payment/           # Square payment integration
│   ├── success/           # Order confirmation
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── CartModal.tsx      # Shopping cart modal
│   ├── Footer.tsx         # Site footer
│   ├── Header.tsx         # Site header with navigation
│   └── ProductCard.tsx    # Product display component
├── contexts/              # React context providers
│   └── CartContext.tsx    # Shopping cart state management
├── data/                  # Static data and types
│   └── products.ts        # Product catalog
└── types/                 # TypeScript type definitions
    └── cart.ts            # Cart-related types
```

## 🔧 Configuration

### Airtable Setup
Create three tables in your Airtable base:
1. **Custom_Orders** - For custom order requests
2. **Customer_Orders** - For completed orders
3. **General_Inquiries** - For contact form submissions

### Square Payment Setup
1. Create a Square developer account
2. Get your Application ID and Location ID
3. For production, update the Square script URL in `payment/page.tsx`

## 📈 Performance Features

- **Automatic image optimization** with WebP/AVIF support
- **Lazy loading** for images and components  
- **Tree shaking** for minimal JavaScript bundles
- **Gzip compression** via Vercel
- **CDN distribution** with edge caching
- **Prefetching** for instant page transitions

## 🎨 Customization

### Adding Products
Update `src/data/products.ts` with your product information.

### Styling
Modify Tailwind classes throughout components or add custom CSS in `globals.css`.

### Payment Processing
Update Square configuration in `src/app/payment/page.tsx` for production use.

## 📱 Mobile Optimization

- Fully responsive design
- Touch-optimized interface  
- Fast mobile performance
- Progressive Web App ready

## 🔒 Security Features

- Server-side API routes protect sensitive keys
- Input validation and sanitization
- CORS protection
- Environment variable security

## 🚀 Deployment Checklist

- [ ] Environment variables configured in Vercel
- [ ] Airtable tables created and configured
- [ ] Square payment credentials updated
- [ ] Domain configured (if using custom domain)
- [ ] SSL certificate active
- [ ] Analytics configured (optional)

## 📊 Monitoring

Use Vercel Analytics and Web Vitals to monitor:
- Page load times
- Core Web Vitals scores
- User interactions
- Error tracking

Your Next.js site will be dramatically faster than the original HTML version with these optimizations! 🚀