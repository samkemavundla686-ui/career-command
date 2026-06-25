import { createFileRoute } from "@tanstack/react-router";
import { Building2, Globe, MapPin, Mail, Plus, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { useStore, recentResponses, type Company } from "@/lib/store";

export const Route = createFileRoute("/companies")({
  head: () => ({
    meta: [
      { title: "Companies — Career Command Centre" },
      { name: "description", content: "Your personal CRM for companies and institutions." },
    ],
  }),
  component: CompaniesPage,
});

function CompaniesPage() {
  const companies = useStore((s) => s.companies);
  const apps = useStore((s) => s.applications);
  const responded = recentResponses();

  const countFor = (c: Company) => apps.filter((a) => a.companyId === c.id).length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-fade-in">
      <PageHeader
        title="Companies"
        description={`${companies.length} companies in your pipeline`}
        actions={<Button className="bg-gradient-emerald text-primary-foreground glow-ring-sm hover:opacity-95"><Plus className="h-4 w-4" /> Add company</Button>}
      />

      <SectionCard
        title="Companies that responded"
        description="People are paying attention — keep the momentum"
        action={<span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">{responded.length}</span>}
      >
        {responded.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No replies yet — keep applying.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {responded.map((c) => (
              <div key={c.id} className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-display font-semibold">{c.name}</div>
                  <MessageCircle className="h-4 w-4 text-primary" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{c.responseSummary}</p>
                <div className="mt-3 flex items-center justify-between">
                  <StatusBadge status={c.status} />
                  <span className="text-xs text-muted-foreground">Next: respond</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((c) => (
          <article key={c.id} className="group rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-elegant">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-emerald text-primary-foreground">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <h3 className="truncate font-display text-base font-semibold">{c.name}</h3>
                <p className="truncate text-xs text-muted-foreground">{c.industry}</p>
              </div>
            </div>
            <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {c.location}</div>
              {c.website && <div className="flex items-center gap-1.5"><Globe className="h-3 w-3" /> {c.website}</div>}
              {c.contactPeople[0] && <div className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {c.contactPeople[0].name} ({c.contactPeople[0].role})</div>}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <StatusBadge status={c.status} />
              <span className="text-xs text-muted-foreground"><span className="font-display text-sm font-semibold text-foreground">{countFor(c)}</span> apps</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
