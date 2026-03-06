# Messenger Clone Migration Plan

## Overview

This document outlines the comprehensive migration plan for upgrading the Messenger Clone application from Next.js 14 to Next.js 16 with the new 'use cache' feature, and replacing custom UI components with shadcn/ui components.

## Current State Analysis

### Technology Stack (After Migration)

- **Framework**: Next.js 15 (App Router)
- **Authentication**: NextAuth v4 with credentials, GitHub, and Google providers
- **Database**: Prisma ORM with MongoDB
- **Real-time**: Pusher for WebSocket connections
- **UI**: shadcn/ui components with Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form

### Key Files and Components

| Category      | Key Files                                                                                     |
| ------------- | --------------------------------------------------------------------------------------------- |
| Auth          | `app/libs/authOptions.ts`, `app/api/auth/[...nextauth]/route.ts`                              |
| Components    | `app/components/ui/button.tsx`, `app/components/ui/dialog.tsx`, `app/components/ui/input.tsx` |
| Data Fetching | `app/lib/auth.ts`, `app/lib/queries/getUsers.ts`, `app/lib/queries/getConversations.ts`       |
| Pages         | `app/(site)/page.tsx`, `app/conversations/page.tsx`, `app/users/page.tsx`                     |

## Migration Phases

### Phase 1: Preparation and Infrastructure ✓ COMPLETED

- [x] Update Node.js to LTS version (20.x+)
- [x] Update package.json dependencies to Next.js 15
- [x] Configure new Next.js features in next.config.js

### Phase 2: shadcn/ui Setup and Component Migration ✓ COMPLETED

- [x] Install and configure shadcn/ui
- [x] Create UI components (button, dialog, input, avatar, card, scroll-area, label, textarea, select)
- [x] Update styling and theming in globals.css
- [x] Update tailwind.config.ts with shadcn colors and plugins

### Phase 3: Next.js 16 'use cache' Implementation ✓ COMPLETED

- [x] Add 'use cache' + cacheTag to server actions
- [x] Implement dynamic cache tags using template literals
- [x] Add revalidateTag() calls in mutation actions
- [x] Keep real-time data (messages) as dynamic (force-dynamic)

### Phase 4: Authentication and API Updates ✓ COMPLETED

- [x] Keep NextAuth v4 for stability
- [x] Update API routes for Next.js compatibility
- [x] Rename middleware.ts to proxy.ts

### Phase 5: Testing and Optimization

- [ ] Run build and fix any issues
- [ ] Test all features
- [ ] Optimize performance with new caching

## Migration Diagram

```mermaid
graph TD
    A[Current: Next.js 14] --> B[Phase 1: Infrastructure]
    B --> C[Phase 2: shadcn/ui]
    C --> D[Phase 3: use cache]
    D --> E[Phase 4: Auth & API]
    E --> F[Phase 5: Testing]
    F --> G[Target: Next.js 15 + shadcn/ui + use cache]

    subgraph "Phase 1"
        B1[Update Node.js]
        B2[Update package.json]
        B3[Configure next.config.js]
    end

    subgraph "Phase 2"
        C1[Install shadcn/ui]
        C2[Replace Button]
        C3[Replace Modal]
        C4[Replace Input]
    end

    subgraph "Phase 3"
        D1[Add use cache]
        D2[Cache tags]
        D3[Revalidation]
    end

    subgraph "Phase 4"
        E1[Auth Updates]
        E2[API Routes]
    end

    subgraph "Phase 5"
        F1[Build Test]
        F2[Feature Test]
        F3[Optimize]
    end
```

## Detailed Specifications

See [SPECS.md](./SPECS.md) for detailed specifications of each phase.

## Component Mapping

See [COMPONENT_MAPPING.md](./COMPONENT_MAPPING.md) for the mapping of current components to shadcn/ui equivalents.

## use cache Implementation

See [USE_CACHE_GUIDE.md](./USE_CACHE_GUIDE.md) for the Next.js 16 'use cache' implementation guide.

## Git Branches

```
main (production)
develop (integration branch) ✓ Pushed to origin
refactor/nextjs-upgrade-Phase-1-infra ✓ Completed
refactor/nextjs-upgrade-Phase-2-shadcn
refactor/nextjs-upgrade-Phase-3-cache
refactor/nextjs-upgrade-Phase-4-auth
refactor/nextjs-upgrade-Phase-5-testing
```

## Next Steps

1. Run `npm install` to install the new dependencies
2. Run `npm run build` to verify the build works
3. Test all features
4. Merge develop to main when ready
