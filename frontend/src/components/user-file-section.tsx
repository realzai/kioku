import * as React from "react";
import { Upload, Plus, FileIcon, FileText } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUserFiles } from "@/hooks/use-user-files";
import { useAuth } from "@clerk/clerk-react";
import { backend } from "@/lib/backend";

export const UserFileSection: React.FC = () => {
  const { data: files, isLoading, refetch } = useUserFiles();
  const { getToken } = useAuth();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const onFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const token = await getToken();
    const file = event.target.files?.[0];

    if (file) {
      const response = await backend.post(
        "/upload",
        { file },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data) await refetch();
    }
  };

  return (
    <SidebarGroup>
      <div className="flex items-center justify-between mb-1">
        <SidebarGroupLabel className="mb-0">Files</SidebarGroupLabel>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onFileUpload}
                size="icon"
                variant="ghost"
                className="h-7 w-7"
              >
                <Upload className="h-4 w-4" />
                <span className="sr-only">Upload File</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upload File</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <SidebarGroupContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : files && files.length > 0 ? (
          <SidebarMenu>
            {files.map((file) => (
              <SidebarMenuItem key={file.id}>
                <SidebarMenuButton asChild>
                  <a href="#" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{file.file_name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-2 text-center">
            <FileIcon className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">
              No files uploaded yet
            </p>
            <Button
              onClick={onFileUpload}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Upload File
            </Button>
          </div>
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
