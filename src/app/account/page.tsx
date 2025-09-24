import { UserProfile } from "@clerk/nextjs";

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Manage account</h1>
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <UserProfile appearance={{ elements: { card: "shadow-none" } }} />
      </div>
    </div>
  );
}
