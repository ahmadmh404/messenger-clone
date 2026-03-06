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
  - tailwindcss v4.
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

### 3.1 Add 'use cache' + cacheTag to Server Actions

The 'use cache' directive with cacheTag enables caching and on-demand revalidation.

#### Pattern (correct syntax):

```typescript
export async function getData() {
  "use cache";
  cacheTag("unique-tag");

  // ... fetch logic
}
```

#### 3.1.1 getCurrentUser.ts

```typescript
export async function getCurrentUser() {
  const session = await getSession();

  if (!session?.user?.email) {
    return null;
  }

  ("use cache");
  cacheTag(`user-${session.user.email}`);

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email as string },
  });

  return currentUser;
}
```

#### 3.1.2 getUsers.ts

```typescript
export async function getUsers() {
  const session = await getSession();

  if (!session?.user?.email) {
    return [];
  }

  ("use cache");
  cacheTag("users");
  cacheTag(`user-list-${session.user.email}`);

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    where: { NOT: { email: session.user.email } },
  });

  return users;
}
```

#### 3.1.3 getConversations.ts

```typescript
export async function getConversations() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  ("use cache");
  cacheTag(`conversations-${currentUser.id}`);

  const conversations = await prisma.conversation.findMany({
    orderBy: { lastMessageAt: "desc" },
    where: { userIds: { has: currentUser.id } },
    include: {
      users: true,
      messages: { include: { sender: true, seen: true } },
    },
  });

  return conversations;
}
```

#### 3.1.4 getMessages.ts (Real-time - no caching)

```typescript
// Messages should NOT be cached - use dynamic export
export const dynamic = "force-dynamic";

export async function getMessages(conversationId: string) {
  const messages = await prisma.message.findMany({
    where: { conversationId },
    include: { sender: true, seen: true },
    orderBy: { createdAt: "desc" },
  });

  return messages;
}
```

### 3.2 Cache Invalidation with revalidateTag

Use `revalidateTag()` in mutations to invalidate cached data:

```typescript
import { revalidateTag } from "next/cache";

// After creating a message
export async function createMessage(conversationId: string, content: string) {
  // ... create message ...

  revalidateTag(`conversations-${userId}`);
  revalidateTag(`conversation-${conversationId}`);
  revalidateTag(`messages-${conversationId}`);
}
```

### 3.3 Dynamic Tags with Template Literals

Use dynamic tags for granular cache control:

```typescript
cacheTag(`conversation-${conversationId}`);
cacheTag(`messages-${conversationId}`);
```

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
