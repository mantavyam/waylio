# Environment Setup Guide

## ✅ Required Services

Before running the application, make sure you have these services running:

### 1. PostgreSQL Database
- **Required**: Yes
- **Default Connection**: `postgresql://mantavyam:2024@localhost:5432/waylio_dev`
- **Check if running**: `psql -U mantavyam -d waylio_dev -c "SELECT 1;"`

### 2. Redis
- **Required**: Yes
- **Default Connection**: `redis://localhost:6379`
- **Check if running**: `redis-cli ping` (should return "PONG")
- **Start if not running**: `brew services start redis` (on macOS)

## Environment Variables

### Backend (`apps/backend/.env`)

**Required for Testing:**
```bash
# Database - REQUIRED
DATABASE_URL="postgresql://mantavyam:2024@localhost:5432/waylio_dev?schema=public"

# Redis - REQUIRED
REDIS_URL="redis://localhost:6379"

# JWT - REQUIRED
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server - REQUIRED
PORT=4000
NODE_ENV="development"

# CORS - REQUIRED
CORS_ORIGIN="http://localhost:3000"
```

**Optional (for testing):**
```bash
# File Upload
MAX_FILE_SIZE=10485760

# Multiset AI (for future AR navigation)
MULTISET_API_KEY="your-multiset-api-key"

# Payment Gateway (not needed for testing)
PAYMENT_GATEWAY_KEY="your-payment-gateway-key"
PAYMENT_GATEWAY_SECRET="your-payment-gateway-secret"

# Email (not needed for testing)
SMTP_HOST=""
SMTP_PORT=587
SMTP_USER=""
SMTP_PASS=""

# SMS (not needed for testing)
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""
```

### Web App (`apps/web/.env`)

**Required for Testing:**
```bash
# NextAuth / Auth.js - REQUIRED
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=waylio-super-secret-key-change-in-production-min-32-chars
AUTH_SECRET=waylio-super-secret-key-change-in-production-min-32-chars

# API - REQUIRED
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 🚀 Starting the Application

### Step 1: Start Required Services

```bash
# Start PostgreSQL (if not running)
brew services start postgresql@14

# Start Redis (if not running)
brew services start redis
```

### Step 2: Seed the Database (First Time Only)

```bash
cd apps/backend
pnpm prisma:seed
```

### Step 3: Start Backend Server

```bash
cd apps/backend
pnpm dev
```

**Expected Output:**
```
✅ Redis connected
Server listening at http://127.0.0.1:4000
✅ Socket.IO initialized
🚀 Backend server running on port 4000
```

### Step 4: Start Web App

```bash
cd apps/web
pnpm dev
```

**Expected Output:**
```
▲ Next.js 15.4.5
- Local:        http://localhost:3000
✓ Ready in XXXXms
```

### Step 5: Access the Application

Open your browser and go to: **http://localhost:3000**

## Test Credentials

Use these credentials to sign in:

**Admin Account:**
- Email: `admin@waylio.com`
- Password: `admin123`

**Other Accounts:**
- Reception: `reception@waylio.com` / `reception123`
- Doctor: `dr.smith@waylio.com` / `doctor123`
- Patient: `patient1@example.com` / `patient123`

## Troubleshooting

### "fetch failed" error when signing in

**Cause**: Backend is not running or not accessible

**Solution**:
1. Check if backend is running on port 4000: `lsof -ti:4000`
2. If not, start it: `cd apps/backend && pnpm dev`
3. Check backend logs for errors

### "Port already in use" error

**Solution**:
```bash
# Find process using the port (e.g., 4000)
lsof -ti:4000

# Kill the process
kill -9 $(lsof -ti:4000)
```

### Database connection error

**Solution**:
1. Verify PostgreSQL is running: `brew services list`
2. Check database exists: `psql -U mantavyam -l`
3. Run migrations: `cd apps/backend && pnpm prisma migrate dev`

### Redis connection error

**Solution**:
1. Verify Redis is running: `redis-cli ping`
2. If not: `brew services start redis`

## Summary

**For testing, you only need:**
1. ✅ PostgreSQL running
2. ✅ Redis running
3. ✅ Backend .env with database URL, Redis URL, and JWT secrets
4. ✅ Web .env with Auth secrets and API URL
5. ✅ Database seeded with test users

**NOT needed for testing:**
- Email/SMTP configuration
- SMS/Twilio configuration
- Payment gateway keys
- Multiset AI API key
