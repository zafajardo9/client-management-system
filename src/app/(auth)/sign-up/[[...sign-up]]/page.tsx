import Link from "next/link";
import { SignUpForm } from "../components/SignUpForm";

export default function SignUpPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mx-auto max-w-md">
        <SignUpForm />
        <p className="mt-4 text-sm text-muted-foreground">
          Already have an account? {" "}
          <Link href="/sign-in" className="hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
