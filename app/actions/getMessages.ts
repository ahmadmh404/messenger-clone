"use server";

import prisma from "@/app/libs/prismadb";

export async function getMessages(conversationId: string) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return messages;
  } catch (error: unknown) {
    return [];
  }
}
