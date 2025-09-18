import { type MemberListItem } from "@/lib/actions/members/getMembers";

export function MembersSection({ members }: { members: MemberListItem[] }) {
  return (
    <div className="rounded-md border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Members</h3>
      </div>
      <ul className="divide-y">
        {members.map((m) => (
          <li key={`${m.userId}`} className="py-2 flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-medium">{m.user.name ?? m.user.email}</div>
              <div className="text-xs text-muted-foreground">{m.user.email}</div>
            </div>
            <span className="text-xs rounded bg-secondary px-2 py-0.5">{m.role}</span>
          </li>
        ))}
        {members.length === 0 && (
          <li className="py-6 text-sm text-muted-foreground">No members yet.</li>
        )}
      </ul>
      {/* TODO: Add AddMemberForm (client component) and remove action with AlertDialog */}
    </div>
  );
}
