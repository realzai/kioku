import { createFileRoute } from '@tanstack/react-router'
import HomePage from "@/app";
import AppLayout from "@/app/layout.tsx";

export const Route = createFileRoute('/home')({
  component: () => <AppLayout>
    <HomePage/>
  </AppLayout>,
})


