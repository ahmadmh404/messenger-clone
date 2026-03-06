"use client";

import { useState } from "react";
import { User } from "@prisma/client";
import useRoutes from "../../hooks/useRoute";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Avatar from "../Avatar";
import SettingsModal from "./SettingsModal";
import Link from "next/link";

interface AppSidebarProps {
  currentUser: User;
}

export function AppSidebar({ currentUser }: AppSidebarProps) {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SettingsModal
        currentUser={currentUser}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      <Sidebar collapsible="icon" className="border-r">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {routes.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.active}
                      tooltip={item.label}
                      onClick={item.onClick}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="pb-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                onClick={() => setIsOpen(true)}
                className="hover:bg-sidebar-accent"
              >
                <Avatar user={currentUser} />
                <div className="flex flex-col gap-0.5 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {currentUser.name}
                  </span>
                  <span className="truncate text-sm text-muted-foreground">
                    {currentUser.email}
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
