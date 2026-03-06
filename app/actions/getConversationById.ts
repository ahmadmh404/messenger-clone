"use server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";
import { cacheTag } from "next/cache";

const getConversationById = async (conversationId: string) => {
  "use cache";
  cacheTag(`conversation-${conversationId}`);
  cacheTag(`messages-${conversationId}`);

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) {
      return null;
    }

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
  } catch (error: unknown) {}
};
