import type { GetMembersPayload, MemberListItem } from "@/lib/actions/members/getMembers";

interface MembersSectionProps {
  members: MemberListItem[];
  viewer?: GetMembersPayload["viewer"];
}

export function MembersSection({ members, viewer }: MembersSectionProps) {
  const canManage = viewer?.canManage ?? false;

  return (
    <div className="space-y-3 rounded-md border p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Members</h3>
        {viewer ? (
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {viewer.role === "OWNER" ? "Owner" : viewer.role.toLowerCase()}
          </span>
        ) : null}
      </div>
      <ul className="divide-y">
        {members.map((member) => (
          <li key={member.userId} className="flex items-start justify-between gap-3 py-2">
            <div>
              <div className="text-sm font-medium">{member.user.name ?? member.user.email}</div>
              <div className="text-xs text-muted-foreground">{member.user.email}</div>
            </div>
            <span className="rounded bg-muted px-2 py-0.5 text-xs uppercase tracking-wide">{member.role}</span>
          </li>
        ))}
        {members.length === 0 ? (
          <li className="py-6 text-sm text-muted-foreground">No members yet.</li>
        ) : null}
      </ul>
      {canManage ? (
        <p className="text-xs text-muted-foreground">Collaboration controls coming soon.</p>
      ) : null}
    </div>
  );
}
