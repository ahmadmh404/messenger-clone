import { getServerSession } from "next-auth";

import { authOptions } from "@/app/libs/authOptions";

export async function getSession() {
  return await getServerSession(authOptions);
}
