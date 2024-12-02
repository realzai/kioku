import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ClerkProvider } from "@clerk/clerk-react";

export const Route = createRootRoute({
  component: () => (
    <>
      <ClerkProvider
        publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY!}
      >
        <Outlet />
        <TanStackRouterDevtools />
      </ClerkProvider>
    </>
  ),
});
