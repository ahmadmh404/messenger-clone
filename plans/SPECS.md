# Migration Specifications

This document provides detailed specifications for each phase of the migration.

## Phase 1: Preparation and Infrastructure ✓ COMPLETED

### 1.1 Node.js Update ✓

- **Task**: Update Node.js to LTS version (20.x or higher)
- **Action**: Check current Node.js version, upgrade if necessary
- **Verification**: `node --version` should show >=20.x

### 1.2 Dependencies Update ✓

- **Task**: Update package.json for Next.js 15
- **Changes Made**:
  - Updated Next.js to ^16.1.6
  - Updated React to ^19.2.4
  - Added shadcn/ui dependencies:
    - @radix-ui/react-\* (dialog, avatar, button, etc.)
    - class-variance-authority
    - tailwindcss v4
    - tailwind-merge
    - tailwindcss-animate
    - zod
    - @hookform/resolvers
  - Removed deprecated dependencies
- **Status**: ✓ Complete

### 1.3 Next.js Configuration ✓

- **File**: `next.config.js`
- **Changes**:
  - Removed superjson plugin (handled natively in Next.js 15+)
  - Kept image configuration for Cloudinary, GitHub, Google
- **Status**: ✓ Complete

## Phase 2: shadcn/ui Setup and Component Migration ✓ COMPLETED

### 2.1 shadcn/ui Installation ✓

- Components created manually in `app/components/ui/`
- Configuration files created:
  - `app/lib/utils.ts` - cn() utility function
  - `app/globals.css` - CSS variables for theming

### 2.2 Required shadcn/ui Components Created ✓

Created components:

- button.tsx
- dialog.tsx
- input.tsx
- avatar.tsx
- card.tsx
- scroll-area.tsx
- label.tsx
- textarea.tsx
- select.tsx

### 2.3 Component Migration

#### 2.3.1 Button Component ✓

- **Source**: `app/components/Button.tsx`
- **Replace With**: `@/components/ui/button`
- **Migration**: Ready to use - shadcn Button with variants

#### 2.3.2 Modal Component ✓

- **Source**: `app/components/Modal.tsx` (uses @headlessui/react)
- **Replace With**: `@/components/ui/dialog`
- **Migration**: Ready to use - shadcn Dialog component

#### 2.3.3 Input Component ✓

- **Source**: `app/components/Inputs/Input.tsx`
- **Replace With**: `@/components/ui/input`
- **Migration**: Ready to use

#### 2.3.4 Avatar Component ✓

- **Source**: `app/components/Avatar.tsx`
- **Replace With**: `@/components/ui/avatar`
- **Migration**: Ready to use

### 2.4 Update Global Styles ✓

- **File**: `app/globals.css`
- **Changes**:
  - Added shadcn/ui CSS variables
  - Updated for dark mode support
- **Status**: ✓ Complete

## Phase 3: Next.js 16 'use cache' Implementation ✓ COMPLETED

### 3.1 Add 'use cache' + cacheTag to Server Actions ✓

#### 3.1.1 getCurrentUser.ts ✓

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

#### 3.1.2 getUsers.ts ✓

```typescript
export async function getUsers() {
  const session = await getSession();

  if (!session?.user?.email) {
    return [];
  }

  "use cache";
  cacheTag("users");
  cacheTag(`user-list-${session.user.email}`);

  const users = await prisma.user.findMany({...});
  return users;
}
```

#### 3.1.3 getConversations.ts ✓

```typescript
export async function getConversations() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  "use cache";
  cacheTag(`conversations-${currentUser.id}`);

  const conversations = await prisma.conversation.findMany({...});
  return conversations;
}
```

#### 3.1.4 getMessages.ts (Real-time - no caching) ✓

```typescript
// Messages should NOT be cached - use dynamic export
export const dynamic = "force-dynamic";

export async function getMessages(conversationId: string) {
  const messages = await prisma.message.findMany({...});
  return messages;
}
```

### 3.2 Cache Invalidation with revalidateTag ✓

Added revalidateTag to:

- `app/api/messages/route.ts` - After creating a message
- `app/api/conversations/route.ts` - After creating a conversation
- `app/api/conversations/[conversationId]/route.ts` - After deleting
- `app/api/conversations/[conversationId]/seen/route.ts` - After marking seen

### 3.3 Route Handlers ✓

- Added cache headers where appropriate
- Used `export const dynamic = 'force-dynamic'` for real-time routes

## Phase 4: Authentication and API Updates ✓ COMPLETED

### 4.1 NextAuth Configuration ✓

- **Status**: Kept NextAuth v4 for stability
- **File**: `app/libs/authOptions.ts` - No changes needed

### 4.2 API Route Updates ✓

- Renamed `middleware.ts` to `proxy.ts` for Next.js 16 convention
- All API routes reviewed and updated

## Phase 5: Testing and Optimization

### 5.1 Build Verification

- [ ] Run `npm run build`
- [ ] Fix any TypeScript errors
- [ ] Fix any Next.js specific errors

### 5.2 Feature Testing

- [ ] Test authentication flow
- [ ] Test real-time messaging
- [ ] Test all UI components

### 5.3 Performance Optimization

- [ ] Verify 'use cache' is working
- [ ] Check bundle size
- [ ] Optimize images with Next.js Image component
