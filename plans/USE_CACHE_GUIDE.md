# Next.js 16 'use cache' Implementation Guide

This document provides detailed guidance on implementing the 'use cache' feature in Next.js 16 with cacheTag and revalidateTag for on-demand revalidation.

## The 'use cache' + cacheTag Pattern

The official Next.js pattern for caching Server Actions and async functions:

```typescript
export async function getProjectDecisions(projectId: string) {
  "use cache";
  cacheTag(`project-${projectId}-decisions`);

  const projectFeatures = await db.query.features.findMany({
    where: eq(features.projectId, projectId),
    columns: { id: true },
    with: { decisions: { columns: { createdAt: false } } },
  });

  return projectFeatures.flatMap((feature) => feature.decisions);
}
```

### Key Points:

1. `"use cache"` is a string directive at the top of the function
2. `cacheTag()` is called as a function inside the function body
3. Tags can be dynamic using template literals: ``cacheTag(`entity-${id}`)``
4. For user specific cache use `use cache: private`

## cacheTag - Tagging Cache Entries

The `cacheTag` function assigns custom tags to cached data, enabling selective invalidation.

### Syntax

```typescript
export async function getData() {
  "use cache";
  cacheTag("static-tag");

  // or with dynamic tag
  cacheTag(`user-${userId}`);

  // or multiple tags
  cacheTag("users", "user-list");

  // ... fetch logic
}
```

### With Database Queries (Prisma)

```typescript
import prisma from "@/app/libs/prismadb";

export async function getConversations(userId: string) {
  "use cache";
  cacheTag(`conversations-${userId}`);

  const conversations = await prisma.conversation.findMany({
    where: { userIds: { has: userId } },
    orderBy: { lastMessageAt: "desc" },
    include: {
      users: true,
      messages: {
        include: { sender: true, seen: true },
      },
    },
  });

  return conversations;
}
```

## revalidateTag - On-Demand Revalidation

The `revalidateTag` function purges cached data with a specific tag across the entire application.

### Syntax

```typescript
import { revalidateTag } from "next/cache";

// Revalidate a single tag
revalidateTag("users");

// Revalidate with dynamic tag
revalidateTag(`conversations-${userId}`);
```

### Use Cases

1. **After Creating/Updating Data**

```typescript
// app/actions/createMessage.ts
"use server";
import { revalidateTag } from "next/cache";
import prisma from "@/app/libs/prismadb";

export async function createMessage(
  conversationId: string,
  content: string,
  senderId: string,
) {
  const message = await prisma.message.create({
    data: {
      body: content,
      conversationId,
      senderId,
    },
    include: { sender: true, seen: true },
  });

  // Invalidate conversation cache
  revalidateTag(`conversations-${senderId}`);
  revalidateTag(`conversation-${conversationId}`);
  revalidateTag(`messages-${conversationId}`);

  return message;
}
```

2. **After Marking Messages as Seen**

```typescript
// app/api/conversations/[conversationId]/seen/route.ts
import { revalidateTag } from "next/cache";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { conversationId: string } },
) {
  const currentUser = await getCurrentUser();
  const { conversationId } = params;

  await prisma.message.updateMany({
    where: {
      conversationId,
      NOT: { seen: { some: { id: currentUser.id } } },
    },
    data: {
      seen: { connect: { id: currentUser.id } },
    },
  });

  revalidateTag(`conversation-${conversationId}`);
  revalidateTag(`messages-${conversationId}`);

  return new Response("Seen updated");
}
```

3. **API Route for Webhook**

```typescript
// app/api/revalidate/route.ts
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const { tag } = await request.json();

  if (tag) {
    revalidateTag(tag);
    return NextResponse.json({ revalidated: true, tag });
  }

  return NextResponse.json({ message: "Missing tag" }, { status: 400 });
}
```

## Applying to Your Server Actions

### getCurrentUser.ts

```typescript
import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";

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

### getUsers.ts

```typescript
import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";

export async function getUsers() {
  const session = await getSession();

  if (!session?.user?.email) {
    return [];
  }

  ("use cache");
  cacheTag("users");
  cacheTag(`user-list-${session.user.email}`);

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        NOT: { email: session.user.email },
      },
    });

    return users;
  } catch (error) {
    return [];
  }
}
```

### getConversations.ts

```typescript
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

export async function getConversations() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  ("use cache");
  cacheTag(`conversations-${currentUser.id}`);

  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: { lastMessageAt: "desc" },
      where: { userIds: { has: currentUser.id } },
      include: {
        users: true,
        messages: {
          include: { sender: true, seen: true },
        },
      },
    });

    return conversations;
  } catch (error) {
    return [];
  }
}
```

### getMessages.ts

Messages should NOT be cached - they need to be real-time via Pusher:

```typescript
import prisma from "@/app/libs/prismadb";

export async function getMessages(conversationId: string) {
  // No caching for real-time messages
  export const dynamic = "force-dynamic";

  try {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: { sender: true, seen: true },
      orderBy: { createdAt: "desc" },
    });
    return messages;
  } catch (error) {
    return [];
  }
}
```

### getConversationById.ts

```typescript
import prisma from "@/app/libs/prismadb";

export async function getConversationById(conversationId: string) {
  "use cache";
  cacheTag(`conversation-${conversationId}`);
  cacheTag(`messages-${conversationId}`);

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        users: true,
        messages: {
          include: { sender: true, seen: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return conversation;
  } catch (error) {
    return null;
  }
}
```

## Cache Invalidation Summary

| Action                | Tags to Revalidate                                                                        |
| --------------------- | ----------------------------------------------------------------------------------------- |
| New message sent      | `conversations-${userId}`, `conversation-${conversationId}`, `messages-${conversationId}` |
| Mark messages seen    | `conversation-${conversationId}`, `messages-${conversationId}`                            |
| Create conversation   | `conversations-${userId}`                                                                 |
| Update profile        | `user-${userEmail}`                                                                       |
| User settings changed | `user-${userEmail}`                                                                       |

## Migration Checklist

- [ ] Add `"use cache";` directive to cacheable server actions
- [ ] Add `cacheTag('tag-name')` inside each cached function
- [ ] Use dynamic tags with template literals: ``cacheTag(`entity-${id}`)``
- [ ] Add `revalidateTag()` calls in mutation actions (POST, PUT, DELETE)
- [ ] Keep messages and real-time data as `force-dynamic`
- [ ] Test caching behavior and invalidation
- [ ] Verify Pusher still works for real-time updates

## Best Practices

1. **Use descriptive tags**: ``cacheTag(`messages-${conversationId}`)``
2. **Include user ID in tags**: For user-specific cached data
3. **Revalidate on mutations**: Call `revalidateTag()` after create/update/delete
4. **Keep real-time data dynamic**: Messages should not be cached
5. **Combine strategies**: Use both cacheTag for on-demand + time-based if needed
