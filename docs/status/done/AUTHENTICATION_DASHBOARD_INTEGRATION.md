# Authentication & Dashboard Integration Guide

This document explains the authentication flow and dashboard integration between the marketing website (localhost:3001) and the web app (localhost:3000).

## Overview

The system has been integrated to provide a seamless authentication experience:

1. **Marketing Website (localhost:3001)** - Handles signup and signin with Shadcn UI components
2. **Web App (localhost:3000)** - Dashboard application with Shadcn dashboard components

## Authentication Flow

### User Journey

1. User visits the marketing website at `http://localhost:3001`
2. User signs up via `/auth/signup` or signs in via `/auth/login`
3. Upon successful authentication, user is redirected to the web app dashboard at `http://localhost:3000/dashboard`
4. The web app dashboard displays the Shadcn dashboard design with backend integration

### Technical Implementation

#### Marketing Website (apps/website)

**New Components:**
- `components/login-form.tsx` - Updated with backend API integration
  - Includes role selection (PATIENT, DOCTOR, RECEPTION, ADMIN)
  - Connects to backend at `${NEXT_PUBLIC_API_URL}/api/v1/auth/login`
  - Redirects to web app dashboard after successful login
  
- `components/signup-form.tsx` - Updated with backend API integration
  - Includes first name, last name, email, phone, password, role
  - Connects to backend at `${NEXT_PUBLIC_API_URL}/api/v1/auth/register`
  - Redirects to OTP verification page after registration

**Authentication Setup:**
- `lib/auth.ts` - NextAuth configuration (same as web app)
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API routes
- `components/providers.tsx` - SessionProvider wrapper
- `app/layout.tsx` - Updated to include Providers

**Dependencies Added:**
- `next-auth@^5.0.0-beta.25`
- `zod@^3.25.76`

#### Web App (apps/web)

**Dashboard Updates:**
- `app/dashboard/page.tsx` - Now uses Shadcn dashboard components:
  - `AppSidebar` - Navigation sidebar
  - `SiteHeader` - Top header
  - `ChartAreaInteractive` - Interactive charts
  - `SectionCards` - Card sections
  - `DataTable` - Data table with dashboard data
  
- `app/dashboard/layout.tsx` - Simplified to work with SidebarProvider from Shadcn components

**Authentication Updates:**
- `app/page.tsx` - Root page redirects authenticated users to dashboard, others to marketing website login
- `app/auth/login/page.tsx` - Redirects to marketing website login page

#### Shared Components (packages/ui)

**New Components:**
- `components/field.tsx` - Field component for form inputs (used in login/signup forms)
- `components/textarea.tsx` - Textarea component

## Environment Variables

### apps/website/.env

```bash
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
AUTH_SECRET=your-secret-key-here-change-in-production
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WEB_APP_URL=http://localhost:3000
```

### apps/web/.env

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
AUTH_SECRET=your-secret-key-here-change-in-production
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3001
```

**Important:** Both apps must use the **same** `NEXTAUTH_SECRET` and `AUTH_SECRET` values for session sharing to work properly.

## Setup Instructions

### 1. Install Dependencies

```bash
# From the root of the monorepo
pnpm install
```

### 2. Configure Environment Variables

```bash
# Copy example files
cp apps/website/.env.example apps/website/.env
cp apps/web/.env.example apps/web/.env

# Update the .env files with the same secret keys
```

### 3. Start the Applications

```bash
# Terminal 1 - Backend API
cd apps/backend
pnpm dev

# Terminal 2 - Web App
cd apps/web
pnpm dev

# Terminal 3 - Marketing Website
cd apps/website
pnpm dev
```

### 4. Test the Flow

1. Visit `http://localhost:3001`
2. Click "Sign Up" or "Sign In"
3. Complete the authentication form
4. Verify you're redirected to `http://localhost:3000/dashboard`
5. Verify the Shadcn dashboard is displayed

## API Endpoints

The forms connect to these backend endpoints:

- **Login:** `POST /api/v1/auth/login`
  ```json
  {
    "identifier": "email|phone|unique_id",
    "password": "password",
    "role": "PATIENT|DOCTOR|RECEPTION|ADMIN" // optional
  }
  ```

- **Register:** `POST /api/v1/auth/register`
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "password": "password",
    "role": "PATIENT|DOCTOR|RECEPTION|ADMIN"
  }
  ```

## Features

### Login Form
- Email, phone, or user ID authentication
- Optional role selection
- Forgot password link
- Error handling with user-friendly messages
- Loading states
- Redirect to web app dashboard on success

### Signup Form
- First name and last name fields
- Email and phone number
- Role selection
- Password with confirmation
- Password validation (minimum 8 characters)
- Error handling
- Redirect to OTP verification on success

### Dashboard
- Shadcn sidebar navigation
- Interactive charts
- Section cards with data
- Data table with dashboard information
- Authenticated session with user info

## Troubleshooting

### Session Not Persisting
- Ensure both apps use the same `NEXTAUTH_SECRET` and `AUTH_SECRET`
- Check that cookies are being set correctly
- Verify both apps are running on the correct ports

### Redirect Not Working
- Check that environment variables are set correctly
- Verify `NEXT_PUBLIC_WEB_APP_URL` in website app
- Verify `NEXT_PUBLIC_WEBSITE_URL` in web app

### Backend Connection Issues
- Ensure backend is running on port 4000
- Check `NEXT_PUBLIC_API_URL` in both apps
- Verify CORS settings in backend

## Next Steps

1. Add environment-specific configurations for staging/production
2. Implement refresh token logic
3. Add social authentication (Google, etc.)
4. Enhance error handling and logging
5. Add loading states and animations
6. Implement proper session management across domains
