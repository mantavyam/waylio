# Project Waylio

Waylio is a complete SAAS Solution for Hospitals redefining experiences with AR navigation and seamless digital campus management.

## Project Structure

```
waylio/
├── apps/
│   ├── web/
│   └── backend/
│       ├── src/
│       │   ├── index.ts
│       │   ├── middleware/
│       │   └── routes/
│       ├── prisma/
│       │   └── schema.prisma
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   └── shared-ts/
│       ├── src/
│       │   ├── types/
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## Tech Stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS + Shadcn UI
- **Backend**: Node.js + TypeScript + Fastify
- **Database**: PostgreSQL + Prisma ORM
- **Caching**: Redis
- **Real-time**: Socket.io
- **Monorepo**: Turborepo + pnpm

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 9.0.0
- PostgreSQL >= 14
- Redis >= 7

## Important Project Steering Documents

- Project Architecture: /Users/mantavyam/Projects/waylio/docs/about/waylio-architecture.mermaid
- Product Requirements Document: /Users/mantavyam/Projects/waylio/docs/about/WAYLIO-PRD.md
- User Interface Design: /Users/mantavyam/Projects/waylio/docs/about/WAYLIO-UI-SCREENS.md

**File Location for Development Phases:**
- Overview: /Users/mantavyam/Projects/waylio/docs/about/phases/WAYLIO-DEV-PHASES.md
- Phase 1 to 3: /Users/mantavyam/Projects/waylio/docs/about/phases/PHASE-1-TO-3.md
- Phase 4 to 6: /Users/mantavyam/Projects/waylio/docs/about/phases/PHASE-4-TO-6.md
- Phase 7 to 10: /Users/mantavyam/Projects/waylio/docs/about/phases/PHASE-7-TO-10.md

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup Environment Variables

```bash
# Backend
cp apps/backend/.env.example apps/backend/.env
# Edit apps/backend/.env with your database credentials
```

### 3. Setup Database

Use Cloud Database elseIf local datbase configuration is needed, First, ensure PostgreSQL is running and create a database with command = createdb appname

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database (for development)
pnpm db:push

# Or run migrations (for production)
cd apps/backend && pnpm prisma migrate dev
```

### 4. Run Development Servers

```bash
# Run all apps in parallel
pnpm dev

# Or run individually
cd apps/web && pnpm dev      # Frontend on http://localhost:3000
cd apps/backend && pnpm dev  # Backend on http://localhost:3001
```

### 5. Access Prisma Studio (Optional)

```bash
pnpm db:studio
```

## Development Workflow

### Running Tests

```bash
pnpm test          # Run all tests
pnpm test:watch    # Watch mode
```

### Type Checking

```bash
pnpm type-check    # Check all packages
```

### Linting

```bash
pnpm lint          # Lint all packages
```

### Building for Production

```bash
pnpm build         # Build all apps
```

## Deployment (Render)

### Backend Deployment

1. Create a new Web Service on Render
2. Connect your repository
3. Configure:
   - **Build Command**: `cd apps/backend && pnpm install && pnpm prisma generate && pnpm build`
   - **Start Command**: `cd apps/backend && pnpm start`
   - **Environment**: Add all variables from `.env.example`

### Frontend Deployment

1. Create a new Static Site on Render
2. Connect your repository
3. Configure:
   - **Build Command**: `cd apps/web && pnpm install && pnpm build`
   - **Publish Directory**: `apps/web/.next`

### Database

1. Create a PostgreSQL instance on Render
2. Copy the connection string to backend environment variables

## Project Status

🔲 Authentication system  
🔲 Appointment booking  
🔲 Digital prescriptions  
🔲 AR Navigation (Multiset AI integration)  
🔲 Smart parking  

## Contributing

See individual app READMEs for specific guidelines.

## License

Proprietary - All rights reserved
