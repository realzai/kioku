import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@clerk/clerk-react";

export const Route = createFileRoute("/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  return (
    <div className={"w-screen h-screen flex items-center justify-center"}>
      <SignIn signUpUrl={"/sign-up"} afterSignInUrl={"/home"} />
    </div>
  );
}
