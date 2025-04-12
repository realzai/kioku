import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { type QueryPayload, querySchema } from "@/schemas/querySchema.ts";
import { backend } from "@/lib/backend";
import { useAuth } from "@clerk/clerk-react";
import { QueryForm } from "@/components/query-form";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar.tsx";
import { AppSidebar } from "@/components/app-sidebar.tsx";
import { AppHeader } from "@/components/app-header.tsx";
import { useRouter } from "@tanstack/react-router";
import { Container } from "@/components/ui/container.tsx";
import { WebUrlModal } from "@/components/web-url-modal.tsx";

export const Route = createFileRoute("/home")({
  component: HomePage,
});

function HomePage() {
  const [message, setMessage] = React.useState("");
  const { getToken } = useAuth();
  const router = useRouter();

  const methods = useForm<QueryPayload>({
    resolver: zodResolver(querySchema),
  });

  const { isLoaded, isSignedIn } = useAuth();

  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.navigate({ to: "/sign-in" });
    }
  }, [isLoaded, isSignedIn, router]);

  const submit = async (data: QueryPayload) => {
    const token = await getToken();
    try {
      const response = await backend.post("/process", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data.message);
    } catch (e) {
      console.log("Error submitting form:", e);
    }
  };

  return (
    <SidebarProvider>
      <FormProvider {...methods}>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <Container className={"flex flex-1 flex-col gap-4"}>
            <div>{message}</div>
            <QueryForm onSubmit={submit} />
          </Container>
        </SidebarInset>
      </FormProvider>

      <WebUrlModal />
    </SidebarProvider>
  );
}
