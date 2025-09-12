#!/bin/bash

echo "🚀 Starting Meche's Handmade Crafts - Next.js Version"
echo "=================================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found!"
    echo "   Copy .env.example to .env.local and configure your environment variables"
    echo "   cp .env.example .env.local"
    echo ""
fi

echo "🌐 Starting development server..."
echo "   Your site will be available at: http://localhost:3000"
echo ""
echo "📋 Quick Start Checklist:"
echo "   ✓ Next.js 15 project created"
echo "   ✓ TypeScript configured"  
echo "   ✓ Tailwind CSS setup"
echo "   ✓ Components created"
echo "   ✓ Shopping cart functionality"
echo "   ✓ Airtable integration"
echo "   ✓ Square payment integration"
echo "   ✓ Vercel deployment ready"
echo ""
echo "🔧 To deploy to Vercel:"
echo "   1. Push to GitHub"
echo "   2. Connect repo to Vercel"
echo "   3. Configure environment variables"
echo "   4. Deploy!"
echo ""

npm run dev