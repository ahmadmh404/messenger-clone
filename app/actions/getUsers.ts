import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";
import { cacheTag } from "next/cache";

const getUsers = async () => {
  const session = await getSession();

  if (!session?.user?.email) {
    return [];
  }

  ("use cache");
  cacheTag("users");
  cacheTag(`user-list-${session.user.email}`);

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        NOT: {
          email: session.user.email,
        },
      },
    });

    return users;
  } catch (error: any) {
    return [];
  }
};

export default getUsers;
