"use server";

import prisma from "@/app/libs/prismadb";
import { cacheTag } from "next/cache";

export async function getConversationById(conversationId: string) {
  "use cache";

  cacheTag(`conversation-${conversationId}`);
  cacheTag(`messages-${conversationId}`);

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      users: true,
      messages: {
        include: {
          sender: true,
          seen: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return conversation;
}
