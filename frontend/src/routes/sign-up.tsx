import { createFileRoute } from "@tanstack/react-router";
import { SignUp } from "@clerk/clerk-react";

export const Route = createFileRoute("/sign-up")({
  component: SignUpPage,
});

function SignUpPage() {
  return (
    <div className={"w-screen h-screen flex items-center justify-center"}>
      <SignUp signInUrl={"/sign-in"} />
    </div>
  );
}
