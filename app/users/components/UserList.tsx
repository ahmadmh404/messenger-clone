"use client";

import { User } from "@prisma/client";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import UserBox from "./UserBox";
import { SidebarListContainer } from "@/app/components/sidebar/SidebarListContainer";

interface UserListProps {
  items: User[];
}

export default function UserList({ items }: UserListProps) {
  return (
    <SidebarListContainer title="People" placeholder="Search people...">
      {items.map((item) => (
        <SidebarMenuItem key={item.id} className="list-none">
          <UserBox data={item} />
        </SidebarMenuItem>
      ))}
    </SidebarListContainer>
  );
}
