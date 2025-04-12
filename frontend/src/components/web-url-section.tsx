import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LinkIcon, Plus, Globe } from "lucide-react";
import { useWebUrls } from "@/hooks/use-web-url";
import * as React from "react";

export const WebUrlSection: React.FC = () => {
  const { data: urls = [], isLoading } = useWebUrls();

  const handleAdd = () => {
    console.log("Open modal or handle add new URL logic");
  };

  return (
    <SidebarGroup>
      <div className="flex items-center justify-between mb-1">
        <SidebarGroupLabel className="mb-0">Web URLs</SidebarGroupLabel>
        <Button
          onClick={handleAdd}
          size="icon"
          variant="ghost"
          className="h-7 w-7"
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
        ) : urls.length > 0 ? (
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
            <Globe className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">
              No web URLs added yet
            </p>
            <Button
              onClick={handleAdd}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Web URL
            </Button>
          </div>
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
