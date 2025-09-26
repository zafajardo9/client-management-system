import { shareLinks } from "@/lib/actions";

import { ShareLinksSection } from "@/components/pages/projects";

interface ProjectShareLinksSectionProps {
  projectId: string;
}

export default async function ProjectShareLinksSection({ projectId }: ProjectShareLinksSectionProps) {
  const linksRes = await shareLinks.getShareLinks(projectId);

  if (!linksRes.success) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {linksRes.error.message}
      </div>
    );
  }

  return <ShareLinksSection projectId={projectId} links={linksRes.data} />;
}
