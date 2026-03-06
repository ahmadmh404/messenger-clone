"use client";

import { MessageSquarePlus } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center bg-[#181818] px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        {/* Decorative Icon Wrapper */}
        <div className="relative mb-5">
          <div className="absolute -inset-2 animate-pulse rounded-full bg-sky-500/15 blur-xl" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#252525] shadow-2xl">
            <MessageSquarePlus className="h-8 w-8 text-sky-500" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
          Select a chat to start messaging
        </h3>

        <p className="mt-2 max-w-xs text-sm leading-relaxed text-neutral-400">
          Pick an existing conversation from the left sidebar or start a fresh
          one with your friends.
        </p>
      </div>
    </div>
  );
}
