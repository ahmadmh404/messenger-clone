import prisma from "@/app/libs/prismadb";

import getCurrentUser from "./getCurrentUser";
import { cacheTag } from "next/cache";

const getConversations = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  ("use cache");
  cacheTag(`conversations-${currentUser.id}`);

  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        userIds: {
          has: currentUser.id,
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
