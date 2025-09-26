import { shareLinks } from "@/lib/actions";

import { ShareLinksSection } from "@/components/pages/projects";

interface ProjectShareLinksSectionProps {
  projectId: string;
}

export default async function ProjectShareLinksSection({ projectId }: ProjectShareLinksSectionProps) {
  const linkRes = await shareLinks.getShareLink(projectId);

  if (!linkRes.success) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {linkRes.error.message}
      </div>
    );
  }

  const link = linkRes.data
    ? {
        ...linkRes.data,
        createdAt: linkRes.data.createdAt.toISOString(),
        updatedAt: linkRes.data.updatedAt.toISOString(),
      }
    : null;

  return <ShareLinksSection projectId={projectId} initialLink={link} />;
}
