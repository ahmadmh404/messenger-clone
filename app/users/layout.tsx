import { ReactNode, Suspense } from "react";
import { SidebarLayout } from "../components/sidebar/SidebarLayout";
import { getUsers } from "../lib/queries/getUsers";
import UserList from "./components/UserList";
import { getCurrentUser } from "../lib/auth";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <SuspendedLayout>{children}</SuspendedLayout>
    </Suspense>
  );
}

async function SuspendedLayout({ children }: { children: ReactNode }) {
  const currentUser = await getCurrentUser();
  if (currentUser == null || currentUser.email == null) return null;

  const users = await getUsers(currentUser.email);

  return (
    <SidebarLayout>
      <div className="h-full">
        <UserList items={users} />
        {children}
      </div>
    </SidebarLayout>
  );
}
