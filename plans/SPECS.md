# Migration Specifications

This document provides detailed specifications for each phase of the migration.

## Phase 1: Preparation and Infrastructure

### 1.1 Node.js Update

- **Task**: Update Node.js to LTS version (20.x or higher)
- **Action**: Check current Node.js version, upgrade if necessary
- **Verification**: `node --version` should show >=20.x

### 1.2 Dependencies Update

- **Task**: Update package.json for Next.js 16
- **Changes Required**:
  ```json
  {
    "next": "^16.0.0" (latest),
    "react": "^19.0.0" (latest),
    "react-dom": "^19.0.0" (latest),
    "@types/react": "^19.0.0" (latest),
    "@types/react-dom": "^19.0.0" (latest),
    "typescript": "^5.7.0" (latest)
  }
  ```
- **Remove**: `eslint-config-next: "13.5.6"` (will use Next.js 16's built-in linter)
- **Add**: Check Next.js 16 release notes for any new required dependencies

### 1.3 Next.js Configuration

- **File**: `next.config.js`
- **Changes**:
  - Update experimental features for Next.js 16
  - Remove deprecated configurations
  - Add new performance optimizations
- **New Configuration**:
  ```javascript
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    images: {
      remotePatterns: [
        { protocol: "https", hostname: "res.cloudinary.com" },
        { protocol: "https", hostname: "avatars.githubusercontent.com" },
        { protocol: "https", hostname: "lh3.googleusercontent.com" },
      ],
    },
    // Next.js 16 may have new config options
  };
  ```

## Phase 2: shadcn/ui Setup and Component Migration

### 2.1 shadcn/ui Installation

- **Command**: `npx shadcn-ui@latest init`
- **Configuration Options**:
  - Style: Default
  - Base Color: Slate
  - CSS Variables: Yes
  - Use --yes flag for defaults

### 2.2 Required shadcn/ui Components

Install these components:

```bash
npx shadcn-ui@latest add button dialog input avatar card select textarea form toast dropdown-menu scroll-area label separator sheet popover
```

### 2.3 Component Migration Tasks

#### 2.3.1 Button Component

- **Current**: `app/components/Button.tsx`
- **Replace With**: shadcn/ui Button
- **Migration Steps**:
  1. Import Button from `@/components/ui/button`
  2. Replace `secondary` prop with `variant="outline"`
  3. Replace `danger` prop with `variant="destructive"`
  4. Replace `fullWidth` prop with `className="w-full"`

#### 2.3.2 Modal Component

- **Current**: `app/components/Modal.tsx` (uses @headlessui/react)
- **Replace With**: shadcn/ui Dialog
- **Migration Steps**:
  1. Import Dialog, DialogContent, DialogHeader from `@/components/ui/dialog`
  2. Replace Transition animations with shadcn/ui defaults
  3. Use Dialog for trigger, DialogContent for modal content

#### 2.3.3 Input Component

- **Current**: `app/components/Inputs/Input.tsx`
- **Replace With**: shadcn/ui Input with Form
- **Migration Steps**:
  1. Use shadcn/ui Form components (Form, FormField, FormItem, FormLabel, FormControl, FormMessage)
  2. Replace react-hook-form register with shadcn/ui's useForm
  3. Update styling classes

#### 2.3.4 Avatar Component

- **Current**: `app/components/Avatar.tsx`
- **Replace With**: shadcn/ui Avatar
- **Migration Steps**:
  1. Import Avatar, AvatarImage, AvatarFallback from `@/components/ui/avatar`
  2. Maintain active status indicator logic
  3. Update Image component integration

### 2.4 Update Global Styles

- **File**: `app/globals.css`
- **Changes**:
  - Add shadcn/ui CSS variables
  - Keep custom color variables for the messenger theme
  - Update body classes

## Phase 3: Next.js 16 'use cache' Implementation

### 3.1 Add 'use cache' to Server Actions

The 'use cache' directive can be added to async functions to enable caching of their return values.

#### 3.1.1 getCurrentUser.ts

```typescript
"use cache";
import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";

const getCurrentUser = async () => {
  // ... existing code
};
```

**Note**: Will need to handle session dynamically since it depends on request headers.

#### 3.1.2 getUsers.ts

```typescript
"use cache";
const getUsers = async () => {
  // ... existing code
};
export const dynamic = "force-dynamic"; // May need this instead
```

#### 3.1.3 getConversations.ts

- Add cache tags: `'use cache', { tags: ['conversations'] }`
- Add revalidation on new message

### 3.2 Cache Invalidation Strategy

- Use `revalidateTag()` for dynamic content
- Use `revalidatePath()` for page-level caching
- Set `cache: 'no-store'` for real-time data (messages, active status)

### 3.3 Route Handlers

- Add cache headers where appropriate
- Use `export const dynamic = 'force-dynamic'` for API routes that should not be cached

## Phase 4: Authentication and API Updates

### 4.1 NextAuth Configuration

- **Current**: NextAuth v4 in `app/libs/authOptions.ts`
- **Update Options**:
  1. Stay with NextAuth v4 (most stable)
  2. Migrate to NextAuth v5 (Auth.js) - requires significant changes
- **Recommended**: Stay with v4 for stability

### 4.2 API Route Updates

- Review all API routes for Next.js 16 compatibility
- Update any deprecated patterns
- Add proper caching headers where applicable

## Phase 5: Testing and Optimization

### 5.1 Build Verification

- Run `npm run build`
- Fix any TypeScript errors
- Fix any Next.js specific errors

### 5.2 Feature Testing

- Test authentication flow
- Test real-time messaging
- Test all UI components

### 5.3 Performance Optimization

- Verify 'use cache' is working
- Check bundle size
- Optimize images with Next.js Image component
