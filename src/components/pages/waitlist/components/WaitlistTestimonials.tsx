import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const testimonials = [
  {
    initials: "AL",
    author: "Alicia Lee",
    role: "Agency Partner",
    quote:
      "The ability to loop in clients on a structured plan transformed our delivery experience. We can't wait for Phase 2 to add Kanban and acknowledgements.",
  },
  {
    initials: "MR",
    author: "Marcus Rivera",
    role: "Founder, BrightOps",
    quote:
      "Phase 1 gave us reliable project updates. The upcoming waitlist features promise deeper collaboration with clients and internal teams alike.",
  },
  {
    initials: "SS",
    author: "Sofia Singh",
    role: "Product Consultant",
    quote:
      "We’re eager for the automation around task appointments and tagging—everything we’ve heard aligns with our roadmap needs.",
  },
];

export default function WaitlistTestimonials() {
  return (
    <section aria-labelledby="waitlist-testimonials" className="mx-auto max-w-4xl">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">What early adopters say</p>
        <h2 id="waitlist-testimonials" className="mt-2 text-2xl font-semibold text-foreground">
          Built with ambitious teams in mind
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Hear from the partners already using our Phase 1 toolkit and preparing for what’s next.
        </p>
      </div>
      <Separator className="my-8 bg-slate-200 dark:bg-slate-800" />
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card
            key={testimonial.author}
            className="border-slate-200/80 bg-white/90 shadow-md shadow-slate-200/60 backdrop-blur transition-colors dark:border-slate-700/60 dark:bg-slate-900/70 dark:shadow-black/20"
          >
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex items-center gap-3">
                <Avatar className="bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                  <AvatarFallback>{testimonial.initials}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">“{testimonial.quote}”</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
