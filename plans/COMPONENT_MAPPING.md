# Component Mapping: Current to shadcn/ui

This document maps the current custom components to their shadcn/ui equivalents.

## UI Components

| Current Component | File Path                          | shadcn/ui Equivalent              | Notes                                   |
| ----------------- | ---------------------------------- | --------------------------------- | --------------------------------------- |
| Button            | `app/components/Button.tsx`        | `@/components/ui/button`          | Replace with Button with variants       |
| Modal             | `app/components/Modal.tsx`         | `@/components/ui/dialog`          | Replace with Dialog component           |
| Input             | `app/components/Inputs/Input.tsx`  | `@/components/ui/input`           | Use with Form component                 |
| Select            | `app/components/Inputs/Select.tsx` | `@/components/ui/select`          | Direct replacement                      |
| Avatar            | `app/components/Avatar.tsx`        | `@/components/ui/avatar`          | Use Avatar, AvatarImage, AvatarFallback |
| AvatarGroup       | `app/components/AvatarGroup.tsx`   | `@/components/ui/avatar` + custom | Custom implementation with Avatar       |
| EmptyState        | `app/components/EmptyState.tsx`    | Custom + Card                     | Use Card component                      |
| LoadingModal      | `app/components/LoadingModal.tsx`  | Custom + Dialog                   | Use Dialog with loading state           |

## Sidebar Components

| Current Component | File Path                                   | shadcn/ui Equivalent | Notes                     |
| ----------------- | ------------------------------------------- | -------------------- | ------------------------- |
| DesktopItem       | `app/components/sidebar/DesktopItem.tsx`    | Custom               | Uses links, keep custom   |
| DesktopSidebar    | `app/components/sidebar/DesktopSidebar.tsx` | Custom + ScrollArea  | Use ScrollArea            |
| MobileItem        | `app/components/sidebar/MobileItem.tsx`     | Custom               | Keep custom               |
| MobileFooter      | `app/components/sidebar/MobileFooter.tsx`   | Custom               | Keep custom               |
| SettingsModal     | `app/components/sidebar/SettingsModal.tsx`  | Dialog + Form        | Replace Modal with Dialog |

## Conversation Components

| Current Component | File Path                                                         | shadcn/ui Equivalent | Notes                     |
| ----------------- | ----------------------------------------------------------------- | -------------------- | ------------------------- |
| ConversationBox   | `app/conversations/components/ConversationBox.tsx`                | Card                 | Use Card for container    |
| ConversationList  | `app/conversations/components/ConversationList.tsx`               | Custom + ScrollArea  | Keep custom structure     |
| GroupChatModal    | `app/conversations/components/GroupChatModal.tsx`                 | Dialog + Form        | Replace Modal with Dialog |
| Header            | `app/conversations/[conversationId]/components/Header.tsx`        | Custom               | Keep, update styling      |
| Body              | `app/conversations/[conversationId]/components/Body.tsx`          | Custom + ScrollArea  | Keep, use ScrollArea      |
| Form              | `app/conversations/[conversationId]/components/Form.tsx`          | Custom               | Keep, update input        |
| MessageBox        | `app/conversations/[conversationId]/components/MessageBox.tsx`    | Custom               | Keep, update styling      |
| MessageInput      | `app/conversations/[conversationId]/components/MessageInput.tsx`  | Input                | Replace with shadcn Input |
| ConfirmModal      | `app/conversations/[conversationId]/components/ConfirmModal.tsx`  | Dialog + AlertDialog | Use AlertDialog           |
| ProfileDrawer     | `app/conversations/[conversationId]/components/ProfileDrawer.tsx` | Sheet                | Replace with Sheet        |
| ImageModal        | `app/conversations/[conversationId]/components/ImageModal.tsx`    | Dialog               | Replace with Dialog       |

## User Components

| Current Component | File Path                           | shadcn/ui Equivalent | Notes                  |
| ----------------- | ----------------------------------- | -------------------- | ---------------------- |
| UserBox           | `app/users/components/UserBox.tsx`  | Card                 | Use Card for container |
| UserList          | `app/users/components/UserList.tsx` | Custom + ScrollArea  | Keep structure         |

## Auth Components

| Current Component | File Path                                    | shadcn/ui Equivalent  | Notes                          |
| ----------------- | -------------------------------------------- | --------------------- | ------------------------------ |
| AuthForm          | `app/(site)/components/AuthForm.tsx`         | Form + Input + Button | Replace with shadcn components |
| AuthSocialButton  | `app/(site)/components/AuthSocialButton.tsx` | Button                | Replace with shadcn Button     |

## Usage Examples

### Button Replacement

```typescript
// Before
import Button from "@/app/components/Button";

<Button secondary fullWidth>Cancel</Button>
<Button danger>Delete</Button>

// After
import { Button } from "@/components/ui/button";

<Button variant="outline" className="w-full">Cancel</Button>
<Button variant="destructive">Delete</Button>
```

### Modal/Dialog Replacement

```typescript
// Before
import Modal from "@/app/components/Modal";

<Modal isOpen={isOpen} onClose={onClose}>
  <div>Content</div>
</Modal>

// After
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <div>Content</div>
  </DialogContent>
</Dialog>
```

### Input Replacement

```typescript
// Before
import Input from "@/app/components/Inputs/Input";

<Input
  label="Email"
  id="email"
  register={register}
  errors={errors}
/>

// After
<FormField
  control={control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Avatar Replacement

```typescript
// Before
import Avatar from "@/app/components/Avatar";

<Avatar user={user} />

// After
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

<Avatar>
  <AvatarImage src={user?.image} />
  <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
</Avatar>
```
