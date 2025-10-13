#!/bin/bash

# Square Environment Switcher
# Usage: ./scripts/switch-square-env.sh [sandbox|production]

ENV_FILE=".env.local"

if [ "$1" == "production" ]; then
  echo "🔴 Switching to PRODUCTION Square environment..."

  # Read production values
  PROD_APP_ID=$(grep NEXT_PUBLIC_SQUARE_APPLICATION_ID_PRODUCTION $ENV_FILE | cut -d '=' -f2)
  PROD_LOCATION_ID=$(grep NEXT_PUBLIC_SQUARE_LOCATION_ID_PRODUCTION $ENV_FILE | cut -d '=' -f2)
  PROD_ACCESS_TOKEN=$(grep SQUARE_ACCESS_TOKEN_PRODUCTION $ENV_FILE | cut -d '=' -f2)

  # Update active values
  sed -i.bak "s|^NEXT_PUBLIC_SQUARE_APPLICATION_ID=.*|NEXT_PUBLIC_SQUARE_APPLICATION_ID=$PROD_APP_ID|" $ENV_FILE
  sed -i.bak "s|^NEXT_PUBLIC_SQUARE_LOCATION_ID=.*|NEXT_PUBLIC_SQUARE_LOCATION_ID=$PROD_LOCATION_ID|" $ENV_FILE
  sed -i.bak "s|^SQUARE_ACCESS_TOKEN=.*|SQUARE_ACCESS_TOKEN=$PROD_ACCESS_TOKEN|" $ENV_FILE
  sed -i.bak "s|^NEXT_PUBLIC_SQUARE_ENVIRONMENT=.*|NEXT_PUBLIC_SQUARE_ENVIRONMENT=production|" $ENV_FILE

  echo "✅ Now using PRODUCTION: Meches Creations (LEN1B06DT9WAT)"
  echo "⚠️  WARNING: Real payments will be processed!"

elif [ "$1" == "sandbox" ]; then
  echo "🟡 Switching to SANDBOX Square environment..."

  # Read sandbox values
  SANDBOX_APP_ID=$(grep NEXT_PUBLIC_SQUARE_APPLICATION_ID_SANDBOX $ENV_FILE | cut -d '=' -f2)
  SANDBOX_LOCATION_ID=$(grep NEXT_PUBLIC_SQUARE_LOCATION_ID_SANDBOX $ENV_FILE | cut -d '=' -f2)
  SANDBOX_ACCESS_TOKEN=$(grep SQUARE_ACCESS_TOKEN_SANDBOX $ENV_FILE | cut -d '=' -f2)

  # Update active values
  sed -i.bak "s|^NEXT_PUBLIC_SQUARE_APPLICATION_ID=.*|NEXT_PUBLIC_SQUARE_APPLICATION_ID=$SANDBOX_APP_ID|" $ENV_FILE
  sed -i.bak "s|^NEXT_PUBLIC_SQUARE_LOCATION_ID=.*|NEXT_PUBLIC_SQUARE_LOCATION_ID=$SANDBOX_LOCATION_ID|" $ENV_FILE
  sed -i.bak "s|^SQUARE_ACCESS_TOKEN=.*|SQUARE_ACCESS_TOKEN=$SANDBOX_ACCESS_TOKEN|" $ENV_FILE
  sed -i.bak "s|^NEXT_PUBLIC_SQUARE_ENVIRONMENT=.*|NEXT_PUBLIC_SQUARE_ENVIRONMENT=sandbox|" $ENV_FILE

  echo "✅ Now using SANDBOX: Default Test Account (L3DSCZ8Z5HHTB)"
  echo "✓ Safe for testing - no real payments"

else
  echo "Usage: ./scripts/switch-square-env.sh [sandbox|production]"
  echo ""
  echo "Current environment:"
  grep "NEXT_PUBLIC_SQUARE_ENVIRONMENT=" $ENV_FILE
  exit 1
fi

# Clean up backup file
rm -f ${ENV_FILE}.bak

echo ""
echo "🔄 Restart your dev server for changes to take effect:"
echo "   npm run dev"
