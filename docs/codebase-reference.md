# Messenger Clone - Codebase Reference

## Project Overview

A real-time messaging application built with Next.js 14, featuring:

- Real-time messaging with Pusher
- Authentication via NextAuth (Credentials, GitHub, Google)
- MongoDB database with Prisma ORM
- Image uploads via Cloudinary
- Responsive design with Tailwind CSS
- Group chats and direct messages
- Online status indicators

## Technology Stack

| Category         | Technology                        |
| ---------------- | --------------------------------- |
| Framework        | Next.js 14 (App Router)           |
| Language         | TypeScript                        |
| Styling          | Tailwind CSS + @tailwindcss/forms |
| Database         | MongoDB                           |
| ORM              | Prisma 5.5.2                      |
| Auth             | NextAuth 4.24.3                   |
| Real-time        | Pusher                            |
| State Management | Zustand                           |
| Forms            | React Hook Form                   |
| Icons            | React Icons                       |
| UI Components    | Headless UI                       |
| Notifications    | React Hot Toast                   |
| Image Hosting    | Cloudinary                        |

## Project Structure

```
app/
├── (site)/                    # Auth landing page group
│   ├── page.tsx              # Sign in page
│   └── components/
│       ├── AuthForm.tsx      # Main auth form (login/register)
│       └── AuthSocialButton.tsx  # Social login buttons
│
├── actions/                   # Server actions for data fetching
│   ├── getConversationById.ts
│   ├── getConversations.ts
│   ├── getCurrentUser.ts
│   ├── getMessages.ts
│   ├── getSession.ts
│   └── getUsers.ts
│
├── api/                       # API routes
│   ├── auth/[...nextauth]/    # NextAuth configuration
│   ├── conversations/         # Conversation CRUD
│   ├── messages/              # Message CRUD
│   ├── register/              # User registration
│   └── settings/              # User settings update
│
├── components/                # Shared UI components
│   ├── Inputs/
│   │   ├── Input.tsx         # Form input component
│   │   └── Select.tsx        # Select dropdown component
│   ├── sidebar/              # Navigation sidebar
│   │   ├── DesktopSidebar.tsx
│   │   ├── MobileFooter.tsx
│   │   ├── SettingsModal.tsx
│   │   └── ...
│   ├── ActiveStatus.tsx      # Online status indicator
│   ├── Avatar.tsx            # User avatar component
│   ├── AvatarGroup.tsx       # Group chat avatars
│   ├── Button.tsx            # Reusable button
│   ├── EmptyState.tsx        # Empty state placeholder
│   ├── SlimLoader.tsx      # Loading overlay
│   └── Modal.tsx             # Reusable modal
│
├── context/                   # React context providers
│   ├── AuthContext.tsx       # NextAuth session provider
│   └── ToasterContext.tsx    # Toast notifications provider
│
├── conversations/             # Conversations feature
│   ├── [conversationId]/     # Individual conversation pages
│   │   ├── components/
│   │   │   ├── Body.tsx      # Message list container
│   │   │   ├── Form.tsx      # Message input form
│   │   │   ├── Header.tsx    # Conversation header
│   │   │   ├── MessageBox.tsx # Individual message
│   │   │   ├── MessageInput.tsx
│   │   │   ├── ProfileDrawer.tsx
│   │   │   ├── ConfirmModal.tsx
│   │   │   └── ImageModal.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ConversationBox.tsx
│   │   ├── ConversationList.tsx
│   │   └── GroupChatModal.tsx
│   ├── layout.tsx
│   ├── loading.tsx
│   └── page.tsx
│
├── hooks/                     # Custom React hooks
│   ├── useActiveChannel.ts   # Pusher presence channel
│   ├── useActiveList.ts      # Online users state (Zustand)
│   ├── useConversation.ts    # Get current conversation ID
│   ├── useOtherUser.ts       # Get other user in 1:1 chat
│   └── useRoute.ts           # Navigation route handling
│
├── libs/                      # Utility libraries
│   ├── prismadb.ts           # Prisma client singleton
│   └── pusher.ts             # Pusher server/client config
│
├── types/                     # TypeScript type definitions
│   └── index.ts              # Extended Prisma types
│
├── users/                     # Users list feature
│   ├── components/
│   │   ├── UserBox.tsx
│   │   └── UserList.tsx
│   ├── layout.tsx
│   ├── loading.tsx
│   └── page.tsx
│
├── layout.tsx                # Root layout
├── page.tsx                  # Redirect to /users
└── globals.css               # Global styles

pages/                         # Pages router (for Pusher auth)
└── api/pusher/auth.ts        # Pusher authentication endpoint

prisma/
└── schema.prisma             # Database schema

public/
└── images/
    ├── logo.png
    └── placeholder.jpg
```

## Database Schema (Prisma)

### Models

#### User

```prisma
model User {
  id              String @id @default(auto()) @map("_id") @db.ObjectId
  name            String?
  email           String?   @unique
  emailVerified   DateTime?
  image           String?
  hashedPassword  String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  conversationIds String[] @db.ObjectId
  conversations Conversation[] @relation(fields: [conversationIds], references: [id])

  seenMessageIds String[] @db.ObjectId
  seenMessages Message[] @relation("Seen", fields: [seenMessageIds], references: [id])

  accounts Account[]
  messages Message[]
}
```

#### Account (NextAuth)

```prisma
model Account {
  id String @id @default(auto()) @map("_id") @db.ObjectId
  userId             String   @db.ObjectId
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String?  @db.String
  access_token       String?  @db.String
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String?  @db.String
  session_state      String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}
```

#### Conversation

```prisma
model Conversation {
  id String @id @default(auto()) @map("_id") @db.ObjectId
  createdAt       DateTime @default(now())
  lastMessageAt DateTime @default(now())
  name String?           // Group chat name
  isGroup Boolean?

  messagesIds String[] @db.ObjectId
  messages Message[]

  userIds String[] @db.ObjectId
  users User[] @relation(fields: [userIds], references: [id])
}
```

#### Message

```prisma
model Message {
  id String @id @default(auto()) @map("_id") @db.ObjectId
  body String?
  image String?
  createdAt DateTime @default(now())

  seenIds String[] @db.ObjectId
  seen User[] @relation("Seen", fields: [seenIds], references: [id])

  conversationId String @db.ObjectId
  conversation Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  senderId String @db.ObjectId
  sender User @relation(fields: [senderId], references: [id], onDelete: Cascade)
}
```

### Type Extensions (app/types/index.ts)

```typescript
export type FullMessageType = Message & {
  sender: User;
  seen: User[];
};

export type FullConversationType = Conversation & {
  users: User[];
  messages: FullMessageType[];
};
```

## API Routes

| Route                          | Method   | Description                   |
| ------------------------------ | -------- | ----------------------------- |
| `/api/auth/[...nextauth]`      | GET/POST | NextAuth authentication       |
| `/api/register`                | POST     | Create new user account       |
| `/api/settings`                | POST     | Update user profile           |
| `/api/conversations`           | POST     | Create new conversation       |
| `/api/conversations/[id]`      | DELETE   | Delete conversation           |
| `/api/conversations/[id]/seen` | POST     | Mark messages as seen         |
| `/api/messages`                | POST     | Send new message              |
| `/api/pusher/auth`             | POST     | Pusher channel authentication |

## Key Components Reference

### Auth Components

#### AuthForm (`app/(site)/components/AuthForm.tsx`)

- Handles login and registration
- Toggle between login/register modes
- Credentials + Social auth
- Form validation with React Hook Form

### Conversation Components

#### ConversationList (`app/conversations/components/ConversationList.tsx`)

- Displays all user conversations
- Real-time updates via Pusher
- Group chat creation modal
- Responsive: sidebar on desktop, full-screen on mobile

#### ConversationBox (`app/conversations/components/ConversationBox.tsx`)

- Individual conversation preview
- Shows last message, unread count, avatar
- Online status indicator
- Click to open conversation

#### Body (`app/conversations/[conversationId]/components/Body.tsx`)

- Message list container
- Auto-scroll to bottom
- Real-time message updates
- Message grouping by date

#### MessageBox (`app/conversations/[conversationId]/components/MessageBox.tsx`)

- Individual message display
- Supports text and images
- Sender/receiver styling
- Seen status indicators
- Image modal on click

#### Form (`app/conversations/[conversationId]/components/Form.tsx`)

- Message input form
- Text + image upload support
- Cloudinary image integration
- Optimistic UI updates

### Sidebar Components

#### DesktopSidebar (`app/components/sidebar/DesktopSidebar.tsx`)

- Left navigation on desktop
- User routes (conversations, users)
- Settings modal trigger
- User avatar

#### MobileFooter (`app/components/sidebar/MobileFooter.tsx`)

- Bottom navigation on mobile
- Route icons only
- Active state highlighting

## Custom Hooks

### useConversation (`app/hooks/useConversation.ts`)

```typescript
// Returns current conversation state
const { isOpen, conversationId } = useConversation();
// isOpen: boolean - whether a conversation is selected
// conversationId: string - current conversation ID from URL
```

### useActiveChannel (`app/hooks/useActiveChannel.ts`)

- Manages Pusher presence channel
- Tracks online users
- Updates Zustand store with active users

### useActiveList (`app/hooks/useActiveList.ts`)

- Zustand store for online users
- Provides: `members`, `add`, `remove`, `set`

### useOtherUser (`app/hooks/useOtherUser.ts`)

- Returns the other user in a 1:1 conversation
- Used in conversation header and profile drawer

### useRoute (`app/hooks/useRoute.ts`)

- Navigation route configuration
- Returns routes with icons, labels, active states
- Used by DesktopItem and MobileItem

## State Management

### Zustand Store (useActiveList)

```typescript
interface ActiveListStore {
  members: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  set: (ids: string[]) => void;
}
```

## Real-time Implementation

### Pusher Configuration

#### Server (`app/libs/pusher.ts`)

```typescript
const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "eu",
  useTLS: true,
});
```

#### Client (`app/libs/pusher.ts`)

```typescript
const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
  channelAuthorization: {
    endpoint: "/api/pusher/auth",
    transport: "ajax",
  },
  cluster: "eu",
});
```

### Pusher Channels

| Channel              | Type     | Purpose                      |
| -------------------- | -------- | ---------------------------- |
| `presence-messenger` | Presence | Track online users           |
| `conversation:${id}` | Private  | New messages in conversation |

### Pusher Events

| Event                           | Direction       | Description                     |
| ------------------------------- | --------------- | ------------------------------- |
| `conversation:new`              | Server → Client | New conversation created        |
| `conversation:update`           | Server → Client | Conversation updated (messages) |
| `message:new`                   | Server → Client | New message received            |
| `pusher:subscription_succeeded` | Client          | Initial member list             |
| `pusher:member_added`           | Client          | User came online                |
| `pusher:member_removed`         | Client          | User went offline               |

## Environment Variables

```bash
# Database
DATABASE_URL=mongodb+srv://...

# NextAuth
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret

# Pusher
PUSHER_APP_ID=your_app_id
NEXT_PUBLIC_PUSHER_APP_KEY=your_key
PUSHER_SECRET=your_secret

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## Common Patterns

### Data Fetching Pattern

```typescript
// app/actions/getConversations.ts
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversations = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return [];

  return await prisma.conversation.findMany({
    where: {
      userIds: { has: currentUser.id },
    },
    include: {
      users: true,
      messages: { include: { sender: true, seen: true } },
    },
    orderBy: { lastMessageAt: "desc" },
  });
};
```

### Real-time Update Pattern

```typescript
// In ConversationList component
useEffect(() => {
  pusherClient.subscribe(pusherKey);

  const newHandler = (conversation: FullConversationType) => {
    setItems((current) => [...current, conversation]);
  };

  pusherClient.bind("conversation:new", newHandler);

  return () => {
    pusherClient.unsubscribe(pusherKey);
    pusherClient.unbind("conversation:new", newHandler);
  };
}, [pusherKey]);
```

### Auth Route Protection

```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/" },
});

export const config = {
  matcher: ["/users/:path*", "/conversations/:path*"],
};
```

## Styling Conventions

- **Color Scheme**: Dark theme with `bg-[#202020]` background
- **Spacing**: Uses Tailwind spacing scale
- **Responsive**: Mobile-first approach
- **Components**: Tailwind classes directly on elements
- **Forms**: `@tailwindcss/forms` plugin with class strategy

## File Naming Conventions

- Components: PascalCase (`AuthForm.tsx`)
- Hooks: camelCase starting with `use` (`useConversation.ts`)
- Actions: camelCase (`getConversations.ts`)
- Routes: camelCase (`route.ts`)
- Types: PascalCase (`index.ts` with exported types)

## Build & Deployment

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm run start

# Database
npx prisma generate    # Generate Prisma client
npx prisma db push     # Push schema to database
```

## External Services

| Service       | Purpose             | Environment Variables                                          |
| ------------- | ------------------- | -------------------------------------------------------------- |
| MongoDB Atlas | Database            | `DATABASE_URL`                                                 |
| GitHub OAuth  | Auth provider       | `GITHUB_ID`, `GITHUB_SECRET`                                   |
| Google OAuth  | Auth provider       | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`                     |
| Pusher        | Real-time messaging | `PUSHER_APP_ID`, `NEXT_PUBLIC_PUSHER_APP_KEY`, `PUSHER_SECRET` |
| Cloudinary    | Image hosting       | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`                            |

---

_Generated on: 2026-03-05_
_Project: Messenger Clone_
_Stack: Next.js 14, TypeScript, Prisma, MongoDB, Pusher_
