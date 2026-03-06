import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";
import { cacheTag } from "next/cache";

const getCurrentUser = async () => {
  const session = await getSession();

  if (!session?.user?.email) {
    return null;
  }

  ("use cache");
  cacheTag(`user-${session.user.email}`);

  const currentUser = await prisma.user.findUnique({
    where: {
      email: session.user.email as string,
    },
  });

  if (!currentUser) {
    return null;
  }

  return currentUser;
};

export default getCurrentUser;
