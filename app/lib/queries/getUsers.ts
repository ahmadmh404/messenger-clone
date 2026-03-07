"use server";

import prisma from "@/app/libs/prismadb";
import { getSession } from "@/app/lib/auth";
import { cacheTag } from "next/cache";

export async function getUsers(userEmail: string) {
  "use cache";
  cacheTag("users");

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      NOT: {
        email: userEmail,
      },
    },
  });

  return users;
}
