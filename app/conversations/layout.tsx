import React from "react";
import ConversationList from "./components/ConversationList";
import { getConversations } from "../lib/queries/getConversations";
import { getUsers } from "../lib/queries/getUsers";
import { getCurrentUser } from "../lib/auth";
import { SidebarLayout } from "../components/sidebar/SidebarLayout";

export default async function ConversationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  if (currentUser == null || currentUser.email == null) return null;

  const conversations = await getConversations(currentUser.id);

  const users = await getUsers(currentUser.email);

  return (
    <SidebarLayout>
      <div className="h-full">
        <ConversationList users={users} initialItems={conversations} />
        {children}
      </div>
    </SidebarLayout>
  );
}
