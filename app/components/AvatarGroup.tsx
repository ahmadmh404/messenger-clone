"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import Image from "next/image";

interface AvatarGroupProps {
  users?: User[];
}

export default function AvatarGroup({ users = [] }: AvatarGroupProps) {
  const slicedUsers = users?.slice(0, 3);

  const positionMap = {
    0: "top-0 left-[12px]",
    1: "bottom-0",
    2: "bottom-0 right-0",
  };
  return (
    <div className="relative h-11 w-11">
      {slicedUsers.map((user, index) => (
        <div
          key={user.id}
          className={cn(
            "absolute inline-block overflow-hidden rounded-full h-5.25 w-5.25 border-2 border-[#181818]",
            positionMap[index as keyof typeof positionMap],
          )}
        >
          <Avatar className="h-full w-full">
            <AvatarImage
              src={user?.image || ""}
              alt={user?.name || "Group member"}
            />
            <AvatarFallback className="bg-neutral-700 text-[8px] text-white">
              {user?.name?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
        </div>
      ))}

      {/* Guru Touch: If more than 3 users, you could add a "+N" badge here */}
    </div>
  );
}
