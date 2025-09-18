import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-semibold mb-6">Log in</h1>
        <div className="rounded-lg border p-4">
          <SignIn
            path="/sign-in"
            routing="path"
            signUpUrl="/sign-up"
            afterSignInUrl="/dashboard"
            redirectUrl="/dashboard"
          />
        </div>
      </div>
    </main>
  );
}
