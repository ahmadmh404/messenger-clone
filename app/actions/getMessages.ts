import prisma from "@/app/libs/prismadb";

// Messages should NOT be cached - use dynamic export for real-time data
export const dynamic = "force-dynamic";

const getMessages = async (conversationId: string) => {
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
};

export default getMessages;
