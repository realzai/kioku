import { createFileRoute } from '@tanstack/react-router'
import HomePage from "@/app";

export const Route = createFileRoute('/home')({
  component: HomePage,
})


