import prisma from "@/app/libs/prismadb";

import { cacheTag } from "next/cache";

const getConversations = async (userId: string) => {
  "use cache";
  cacheTag(`conversations-${userId}`);

  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        userIds: {
          has: userId,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });

    return conversations;
  } catch (error: unknown) {
    return [];
  }
};

export default getConversations;
