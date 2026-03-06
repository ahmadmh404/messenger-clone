import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { MainNavigationRail } from "./MainNavigationRail";

export function SidebarLayout({ children, currentUser }: any) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <MainNavigationRail currentUser={currentUser} />

        <SidebarInset className="flex flex-row overflow-hidden">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
