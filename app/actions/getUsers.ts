"use server";

import prisma from "@/app/libs/prismadb";
import { getSession } from "./getSession";
import { cacheTag } from "next/cache";

export async function getUsers() {
  "use cache";
  cacheTag("users");

  const session = await getSession();
  if (!session?.user?.email) {
    return [];
  }

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
}
