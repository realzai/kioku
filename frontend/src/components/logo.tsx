import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar.tsx";

export const Logo: React.FC = () => {
  return (
    <div>
      <a href="#">
        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
          <GalleryVerticalEnd className="size-4" />
        </div>
        <div className="flex flex-col gap-0.5 leading-none">
          <span className="font-medium">Documentation</span>
          <span className="">v1.0.0</span>
        </div>
      </a>
    </div>
  );
};
