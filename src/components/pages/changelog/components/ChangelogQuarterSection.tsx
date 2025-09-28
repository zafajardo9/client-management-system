import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import ChangelogEntryCard from "./ChangelogEntryCard";
import type { ChangelogQuarter } from "../types";

export default function ChangelogQuarterSection({
  quarter,
}: {
  quarter: ChangelogQuarter;
}) {
  return (
    <AccordionItem value={quarter.id}>
      <AccordionTrigger className="items-start gap-4 rounded-lg px-4 text-base font-semibold">
        <div className="flex flex-col gap-1 text-left">
          <span>{quarter.title}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {quarter.summary}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-2">
        <div className="flex flex-col gap-4">
          {quarter.entries.map((entry) => (
            <ChangelogEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
