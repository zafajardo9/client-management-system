import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-semibold mb-6">Create your account</h1>
        <div className="rounded-lg border p-4">
          <SignUp
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
            afterSignUpUrl="/dashboard"
            redirectUrl="/dashboard"
          />
        </div>
      </div>
    </main>
  );
}
