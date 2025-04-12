import * as React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { UserButton } from "@clerk/clerk-react";

export const AppHeader: React.FC = () => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
      <SidebarTrigger className="-ml-1" />

      <UserButton signInUrl={"/sign-in"} />
    </header>
  );
};
