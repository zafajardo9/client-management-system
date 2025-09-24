import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  { label: "Active projects", value: "—" },
  { label: "Updates published", value: "—" },
  { label: "Invited collaborators", value: "—" },
];

export default function DashboardAnalytics() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.label} className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {metric.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{metric.value}</p>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
