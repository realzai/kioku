import { createFileRoute, useRouter } from "@tanstack/react-router";
import * as React from "react";
import { backend } from "@/lib/backend.ts";

export const Route = createFileRoute("/")({
  component: SplashPage,
});

function SplashPage() {
  const router = useRouter();
  const [loadingProgress, setLoadingProgress] = React.useState(0);

  // Constants for configuration
  const PROGRESS_INTERVAL = 500; // in ms
  const PROGRESS_INCREMENT = 15; // max increment per interval
  const NAVIGATION_DELAY = 1000; // delay before navigation after loading completes

  // Function to simulate backend processing
  const waitBackendProcess = React.useCallback(async () => {
    try {
      const response = await backend.get("/");

      console.log("RESPONSE", response);

      if (response.status === 200) {
        setLoadingProgress(100);
        setTimeout(() => {
          router.navigate({ to: "/home" });
        }, NAVIGATION_DELAY);
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
    }
  }, [router]);

  // Function to update loading progress
  const updateProgress = React.useCallback(() => {
    setLoadingProgress((prev) => {
      const newProgress = prev + Math.random() * PROGRESS_INCREMENT;
      return newProgress >= 100 ? 100 : newProgress;
    });
  }, []);

  React.useEffect(() => {
    waitBackendProcess();

    const interval = setInterval(updateProgress, PROGRESS_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [waitBackendProcess, updateProgress]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="max-w-md space-y-12">
        {/* Header Section */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-extralight tracking-tight text-neutral-900">
            Wait pls
          </h1>
          <p className="text-sm font-light text-neutral-500">
            Zai is too broke to use paid services
          </p>
        </div>

        {/* Progress Bar Section */}
        <div className="space-y-2 w-full">
          <div className="h-[1px] w-full bg-neutral-100 overflow-hidden">
            <div
              className="h-full bg-neutral-900 transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-neutral-400">
            <span>Loading</span>
            <span>{Math.round(loadingProgress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
