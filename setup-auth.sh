#!/bin/bash

# Authentication & Dashboard Integration Setup Script
# This script helps configure the environment variables for the integrated auth system

echo "🚀 Waylio Authentication & Dashboard Integration Setup"
echo "======================================================="
echo ""

# Generate a random secret if needed
generate_secret() {
  openssl rand -base64 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
}

# Check if .env files exist
WEB_ENV="apps/web/.env"
WEBSITE_ENV="apps/website/.env"

if [ -f "$WEB_ENV" ] && [ -f "$WEBSITE_ENV" ]; then
  echo "⚠️  Environment files already exist."
  read -p "Do you want to overwrite them? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Setup cancelled."
    exit 0
  fi
fi

# Generate shared secret
echo "🔐 Generating shared authentication secret..."
SECRET=$(generate_secret)

# Create web app .env
echo "📝 Creating web app environment file..."
cat > "$WEB_ENV" << EOF
# NextAuth / Auth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$SECRET
AUTH_SECRET=$SECRET

# API
NEXT_PUBLIC_API_URL=http://localhost:4000

# Website URL (for redirects to login/signup)
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3001
EOF

# Create website app .env
echo "📝 Creating website environment file..."
cat > "$WEBSITE_ENV" << EOF
# NextAuth / Auth.js
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=$SECRET
AUTH_SECRET=$SECRET

# API Backend
NEXT_PUBLIC_API_URL=http://localhost:4000

# Web App URL (for redirects after login)
NEXT_PUBLIC_WEB_APP_URL=http://localhost:3000
EOF

echo ""
echo "✅ Environment files created successfully!"
echo ""
echo "📋 Configuration Summary:"
echo "  - Web App:     http://localhost:3000"
echo "  - Website:     http://localhost:3001"
echo "  - Backend API: http://localhost:4000"
echo ""
echo "🔑 Shared Authentication Secret: $SECRET"
echo ""
echo "⚡ Next Steps:"
echo "  1. Install dependencies:  pnpm install"
echo "  2. Start backend:         cd apps/backend && pnpm dev"
echo "  3. Start web app:         cd apps/web && pnpm dev"
echo "  4. Start website:         cd apps/website && pnpm dev"
echo ""
echo "📖 For more information, see:"
echo "   docs/status/done/AUTHENTICATION_DASHBOARD_INTEGRATION.md"
echo ""
