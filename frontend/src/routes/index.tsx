import {createFileRoute} from '@tanstack/react-router'
import SplashPage from "@/app/splash.tsx";

export const Route = createFileRoute('/')({
  component: SplashPage,
})

