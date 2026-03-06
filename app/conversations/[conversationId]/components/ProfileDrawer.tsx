"use client";

import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import { IoClose, IoTrash } from "react-icons/io5";
import { Conversation, User } from "@prisma/client";

import useOtherUser from "@/app/hooks/useOtherUser";
import useActiveList from "@/app/hooks/useActiveList";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";
import { ConfirmModal } from "./ConfirmModal";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: Conversation & {
    users: User[];
  };
}

export function ProfileDrawer({ isOpen, onClose, data }: ProfileDrawerProps) {
  const otherUser = useOtherUser(data);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { members } = useActiveList();

  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const joinedDate = useMemo(() => {
    return format(new Date(otherUser.createdAt), "PP");
  }, [otherUser.createdAt]);

  const title = useMemo(() => {
    return data.name || otherUser.name;
  }, [data.name, otherUser.name]);

  const statusText = useMemo(() => {
    if (data.isGroup) return `${data.users.length} members`;
    return isActive ? "Active" : "Offline";
  }, [data, isActive]);

  return (
    <>
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      />

      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md bg-[#202020] border-none p-0 text-white"
        >
          {/* Custom Header Area */}
          <div className="flex flex-col h-full">
            <div className="px-4 py-6 sm:px-6">
              <div className="flex items-start justify-end">
                <button
                  onClick={onClose}
                  className="rounded-md bg-[#303030] text-gray-400 hover:text-gray-200 focus:outline-none"
                >
                  <IoClose size={24} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-10">
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  {data.isGroup ? (
                    <AvatarGroup users={data.users} />
                  ) : (
                    <Avatar user={otherUser} />
                  )}
                </div>

                <h2 className="text-xl font-bold">{title}</h2>
                <p className="text-sm text-gray-400">{statusText}</p>

                {/* Actions */}
                <div className="flex gap-10 my-8">
                  <button
                    onClick={() => setConfirmOpen(true)}
                    className="flex flex-col gap-3 items-center hover:opacity-75 transition"
                  >
                    <div className="w-10 h-10 bg-[#303030] rounded-full flex items-center justify-center">
                      <IoTrash size={20} className="text-white" />
                    </div>
                    <span className="text-sm font-light">Delete</span>
                  </button>
                </div>

                {/* Details List */}
                <div className="w-full space-y-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-400">
                      {data.isGroup ? "Emails" : "Email"}
                    </p>
                    <p className="text-sm text-neutral-100">
                      {data.isGroup
                        ? data.users.map((u) => u.email).join(", ")
                        : otherUser.email}
                    </p>
                  </div>

                  {!data.isGroup && (
                    <>
                      <hr className="border-[#303030]" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-400">
                          Joined
                        </p>
                        <time
                          className="text-sm text-neutral-100"
                          dateTime={joinedDate}
                        >
                          {joinedDate}
                        </time>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
