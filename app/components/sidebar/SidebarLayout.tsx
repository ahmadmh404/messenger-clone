import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export async function SidebarLayout({ children }: SidebarLayoutProps) {
  const currentUser = await getCurrentUser();
  if (currentUser == null) redirect("/");

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* The Sidebar component we refactored */}
        <AppSidebar currentUser={currentUser} />

        <SidebarInset className="flex flex-col">
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
