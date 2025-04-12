import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as React from "react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useAuth } from "@clerk/clerk-react";
import { backend } from "@/lib/backend";
import { toast } from "sonner";
import { useModalState } from "@/hooks/use-modal-state.ts";
import { useWebUrls } from "@/hooks/use-web-url.ts";

export const WebUrlModal: React.FC = () => {
  const { isWebUrlModalOpen, setIsWebUrlModalOpen, closeWebUrlModal } =
    useModalState();
  const [webUrl, setWebUrl] = React.useState("");
  const { getToken } = useAuth();
  const { refetch } = useWebUrls();

  const handleSubmit = async () => {
    try {
      if (!webUrl.trim()) {
        alert("Please enter a valid URL.");
        return;
      }

      const token = await getToken();

      const response = await backend.post(
        "/web_urls",
        { web_url: webUrl },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data) {
        toast.success("Web URL added successfully");
      }

      setWebUrl("");
      closeWebUrlModal();
    } catch (error) {
      console.error("Error submitting the URL:", error);
      toast.error("Failed to add the Web URL. Please try again.");
    } finally {
      await refetch();
    }
  };

  return (
    <Dialog open={isWebUrlModalOpen} onOpenChange={setIsWebUrlModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Url</DialogTitle>
        </DialogHeader>
        <div className={"space-y-4"}>
          <Input
            value={webUrl}
            onChange={(e) => setWebUrl(e.target.value)}
            placeholder="Enter a URL"
          />
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
