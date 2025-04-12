import * as React from "react";
import { Link } from "@tanstack/react-router";
import { SidebarMenuButton } from "./ui/sidebar";

export const Logo: React.FC = () => {
  return (
    <SidebarMenuButton size="lg" asChild>
      <Link to="/home">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-black text-sidebar-primary-foreground">
          <img
            src={"/kioku.png"}
            alt={"Kioku"}
            width={36}
            height={36}
            className={"rounded-lg"}
          />
        </div>
        <div className="grid flex-1 text-left leading-tight">
          <span className={`font-semibold text-lg`}>kioku</span>
        </div>
      </Link>
    </SidebarMenuButton>
  );
};
