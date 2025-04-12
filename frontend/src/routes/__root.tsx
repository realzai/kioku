import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ClerkProvider } from "@clerk/clerk-react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider
          publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY!}
        >
          <Outlet />
        </ClerkProvider>
      </QueryClientProvider>
    </>
  ),
});
