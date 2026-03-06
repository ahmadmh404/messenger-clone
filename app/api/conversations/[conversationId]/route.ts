import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { revalidateTag } from "next/cache";

interface IParams {
  conversationId?: string;
}

export async function DELETE(req: Request, { params }: { params: IParams }) {
  console.log(11, "/api/conversations/[conversationId]");
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    if (!existingConversation) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(
          user.email,
          "conversation:remove",
          existingConversation,
        );
      }
    });

    // Revalidate cache after deleting a conversation
    revalidateTag(`conversations-${currentUser.id}`, "max");
    revalidateTag(`conversation-${conversationId}`, "max");

    return NextResponse.json(deletedConversation);
  } catch (error) {
    console.log(error, "ERROR_CONVERSATION_DELETE");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
