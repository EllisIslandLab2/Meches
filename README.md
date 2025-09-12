# Meche's Handmade Crafts - Next.js Website

A beautiful, responsive ecommerce website built with Next.js for selling handmade crafts including earrings, necklaces, keychains, and laser-cut wooden designs.

## Features

### 🎨 Dynamic Visual Experience
- **Time-based Backgrounds**: Dynamic backgrounds that change based on real-time and seasons
- **Falling Animations**: Realistic particle animations (leaves, snow) with physics-based movement
- **Sun/Moon Tracking**: Accurate celestial body positioning throughout the day
- **Glassmorphism UI**: Semi-transparent containers with backdrop blur effects
- **Responsive Animations**: Hardware-accelerated CSS animations optimized for all devices

### 🛍️ Shopping Experience
- **Product Gallery**: Display products with color options and quantity selectors
- **Shopping Cart**: Add items to cart with color/quantity selection
- **Checkout Process**: Full checkout flow with cart editing capabilities
- **Payment Integration**: Square payment processing integration ready

### 📱 User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Nature-Inspired Theme**: Warm earth tones with seasonal color variations
- **Interactive Elements**: Smooth animations and hover effects
- **Dynamic Text**: Time-based text coloring for optimal readability

### 📞 Customer Service
- **Contact Forms**: General inquiries and custom order requests
- **Airtable Integration**: Automatic form submission to Airtable database
- **Custom Orders**: Detailed form for product customizations

## Technology Stack

- **Framework**: Next.js 15.5.0 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Animations**: CSS keyframes with 3D transforms
- **State Management**: React Context for cart functionality
- **Payment**: Square Web Payments SDK
- **Database**: Airtable integration for form submissions
- **Deployment**: Vercel/Netlify ready

## Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
# or
yarn install
yarn dev
# or
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## File Structure

```
meches-nextjs/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles and animations
│   │   ├── layout.tsx           # Root layout with dynamic background
│   │   ├── page.tsx             # Homepage
│   │   ├── checkout/            # Checkout flow pages
│   │   ├── contact/             # Contact and custom orders
│   │   └── api/                 # API routes
│   ├── components/
│   │   ├── DynamicBackground.tsx # Time-based background system
│   │   ├── TimeBasedText.tsx    # Dynamic text coloring
│   │   ├── GlassCard.tsx        # Glassmorphism containers
│   │   ├── ProductCard.tsx      # Product display components
│   │   ├── Header.tsx           # Navigation with cart
│   │   └── Footer.tsx           # Footer with credits
│   ├── contexts/
│   │   └── CartContext.tsx      # Shopping cart state management
│   ├── data/
│   │   └── products.ts          # Product data
│   └── types/
│       └── cart.ts              # TypeScript interfaces
├── public/
│   └── assets/images/           # Product images
├── package.json
└── README.md
```

## Animation System

The website features a sophisticated animation system:

### Time-Based Backgrounds
- **Morning**: Warm sunrise gradients with gentle particle movement
- **Day**: Bright blue skies with moderate particle activity
- **Evening**: Sunset colors with increased animation frequency
- **Night**: Dark gradients with stars and reduced particle movement

### Seasonal Effects
- **Spring**: Light green themes with gentle movements
- **Summer**: Bright colors with cloud animations
- **Fall**: Autumn leaves with realistic falling physics
- **Winter**: Snow particles with winter color palette

### Particle Physics
- **6 Animation Variations**: Unique movement patterns for each particle
- **Randomized Properties**: Speed, rotation, zigzag intensity, and drift variation
- **3D Transforms**: Realistic flipping and rotating movements
- **Left Drift**: Wind-like leftward movement for natural feel

## Customization Guide

### Adding Products
Update the products array in `src/data/products.ts`:
```typescript
{
  id: 1,
  name: "Your Product Name",
  price: 25.00,
  image: "/assets/images/your-image.jpg",
  category: "your-category",
  colors: ["Color1", "Color2"],
  description: "Product description"
}
```

### Modifying Animations
Edit animation keyframes in `src/app/globals.css`:
- Adjust `--rotation-speed` for rotation intensity
- Modify `--zigzag-intensity` for horizontal movement
- Change `--drift-variation` for wind effects

### Color Themes
Update color variables in component files:
- Background gradients in `DynamicBackground.tsx`
- Text colors in `TimeBasedText.tsx`
- Glass effects in `GlassCard.tsx`

## Setup Instructions

### 1. Environment Setup
```bash
cp .env.example .env.local
# Add your environment variables
```

### 2. Payment Integration
1. Get Square Application ID from [Square Developer Portal](https://developer.squareup.com/)
2. Update payment configuration in `src/app/payment/page.tsx`

### 3. Airtable Integration
1. Create Airtable base with required tables
2. Add API key and base ID to environment variables
3. Update API route in `src/app/api/airtable/route.ts`

## Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers with CSS animation support

## Performance Notes

- Animations use `transform` and `opacity` for hardware acceleration
- Particles are limited to prevent performance issues
- `will-change` property used strategically
- Smooth 60fps animations on modern devices

## Credits

Website created by Web Launch Academy LLC with Claude AI

## License

This project is provided for Meche's craft business. Modify and use as needed for your business requirements.
