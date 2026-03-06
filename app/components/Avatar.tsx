"use client";

import { User } from "@prisma/client";
import useActiveList from "../hooks/useActiveList";
import {
  AvatarFallback,
  AvatarImage,
  Avatar as OriginalAvatar,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarProps {
  user?: User;
  className?: string;
}

export default function Avatar({ user, className = "" }: AvatarProps) {
  const { members } = useActiveList();
  const isActive = members.indexOf(user?.email!) !== -1;
  const userInitials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  return (
    <div className="relative inline-block">
      <OriginalAvatar className={cn("h-9 w-9 md:h-11 md:w-11", className)}>
        <AvatarImage
          src={user?.image || "/images/placeholder.jpg"}
          alt={user?.name || "User Avatar"}
        />
        <AvatarFallback className="bg-sky-500 text-white font-medium">
          {userInitials}
        </AvatarFallback>
      </OriginalAvatar>

      {/* Online Status Indicator */}
      {isActive && (
        <span className="absolute top-0 right-0 block h-2 w-2 md:h-3 md:w-3 rounded-full bg-green-500 ring-2 ring-[#181818]" />
      )}
    </div>
  );
}
