"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { FullConversationType } from "@/app/lib/types";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

export default function ConversationBox({
  data,
  selected,
}: ConversationBoxProps) {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data.id, router]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];
    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage || !userEmail) return false;
    const seenArray = lastMessage.seen || [];
    return seenArray.some((user) => user.email === userEmail);
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) return "Sent an image";
    if (lastMessage?.body) return lastMessage.body;
    return "Started a conversation";
  }, [lastMessage]);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={handleClick}
        isActive={selected}
        className={cn(
          "relative h-auto p-3 transition-all duration-200 group flex items-center gap-3",
          "hover:bg-primary/5 active:scale-[0.98]",
          selected ? "bg-primary/10 hover:bg-primary/15" : "bg-transparent",
        )}
      >
        {/* The Slick Left Accent Indicator */}
        {selected && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
        )}

        {/* Avatar Section */}
        <div className="shrink-0">
          {data.isGroup ? (
            <AvatarGroup users={data.users} />
          ) : (
            <Avatar user={otherUser} />
          )}
        </div>

        {/* Content Section */}
        <div className="min-w-0 flex-1 flex flex-col gap-0.5">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-foreground truncate">
              {data.name || otherUser?.name}
            </p>
            {lastMessage?.createdAt && (
              <p className="text-[10px] text-muted-foreground font-medium">
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-1">
            <p
              className={cn(
                "text-xs truncate flex-1",
                hasSeen ? "text-muted-foreground" : "text-foreground font-bold",
              )}
            >
              {lastMessageText}
            </p>

            {/* Unread Indicator Dot */}
            {!hasSeen && (
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
            )}
          </div>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
