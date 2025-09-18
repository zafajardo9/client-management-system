export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-md border p-6 text-center space-y-2">
      <div className="font-medium">{title}</div>
      {description ? (
        <p className="text-sm text-muted-foreground max-w-prose mx-auto">{description}</p>
      ) : null}
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}
