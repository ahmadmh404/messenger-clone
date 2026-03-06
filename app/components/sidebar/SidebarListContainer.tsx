"use client";

import { Search, Plus } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SidebarListProps {
  title: string;
  placeholder: string;
  onAction?: () => void;
  children: React.ReactNode;
}

export function SidebarListContainer({
  title,
  placeholder,
  onAction,
  children,
}: SidebarListProps) {
  return (
    <Sidebar
      variant="inset"
      collapsible="none"
      className="hidden lg:flex w-80 border-r bg-muted/20 backdrop-blur-xl"
    >
      <SidebarHeader className="p-4 pb-2 gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {onAction && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onAction}
              className="rounded-full hover:bg-primary/10 hover:text-primary"
            >
              <Plus className="h-5 w-5" />
            </Button>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            className="pl-9 bg-background/50 border-none shadow-none focus-visible:ring-1 ring-primary/30"
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarMenu className="gap-1">{children}</SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
