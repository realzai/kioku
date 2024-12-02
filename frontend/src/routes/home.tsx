import { createFileRoute } from "@tanstack/react-router";
import HomePage from "@/app";
import AppLayout from "@/app/layout.tsx";

export const Route = createFileRoute("/home")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppLayout>
      <HomePage />
    </AppLayout>
  );
}
