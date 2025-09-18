import Link from "next/link";
import { SignInForm } from "../components/SignInForm";

export default function SignInPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-semibold mb-6">Log in</h1>
        <SignInForm />
        <p className="mt-4 text-sm text-muted-foreground">
          Don&apos;t have an account? {" "}
          <Link href="/sign-up" className="hover:underline">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
