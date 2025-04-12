import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LinkIcon, Plus } from "lucide-react";
import { useWebUrls } from "@/hooks/use-web-url";
import * as React from "react";
import { useModalState } from "@/hooks/use-modal-state.ts";

export const WebUrlSection: React.FC = () => {
  const { data: urls = [], isLoading } = useWebUrls();
  const { setIsWebUrlModalOpen } = useModalState();

  return (
    <SidebarGroup>
      <div className="flex items-center justify-between mb-1">
        <SidebarGroupLabel className="mb-0">Web URLs</SidebarGroupLabel>
        <Button
          onClick={() => setIsWebUrlModalOpen(true)}
          size="icon"
          variant="ghost"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add Web URL</span>
        </Button>
      </div>

      <SidebarGroupContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : urls.length ? (
          <SidebarMenu>
            {urls.map((url) => (
              <SidebarMenuItem key={url.id}>
                <SidebarMenuButton asChild>
                  <a
                    href={url.web_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{url.web_url}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-2 text-center">
            <p className="text-sm text-muted-foreground">
              No web URLs added yet
            </p>
          </div>
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
