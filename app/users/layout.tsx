import { SidebarLayout } from "../components/sidebar/SidebarLayout";
import { getUsers } from "../lib/queries/getUsers";
import UserList from "./components/UserList";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();

  return (
    <SidebarLayout>
      <div className="h-full">
        <UserList items={users} />
        {children}
      </div>
    </SidebarLayout>
  );
}
