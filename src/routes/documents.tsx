import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { FileText, Plus, ShieldCheck, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/section-card";
import { useStore, type DocCategory } from "@/lib/store";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Documents — Career Command Centre" },
      { name: "description", content: "Manage CVs, cover letters, certificates and supporting documents." },
    ],
  }),
  component: DocumentsPage,
});

const requiredCats: DocCategory[] = ["CV", "Cover Letter", "Transcript", "ID", "Reference"];

function DocumentsPage() {
  const docs = useStore((s) => s.documents);
  const ready = new Set(docs.map((d) => d.category));
  const readinessPct = Math.round((requiredCats.filter((c) => ready.has(c)).length / requiredCats.length) * 100);

  const byCat: Record<string, typeof docs> = {};
  docs.forEach((d) => {
    byCat[d.category] = byCat[d.category] ?? [];
    byCat[d.category].push(d);
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-fade-in">
      <PageHeader
        title="Documents Centre"
        description="Every document, version controlled"
        actions={<Button className="bg-gradient-emerald text-primary-foreground glow-ring-sm hover:opacity-95"><Plus className="h-4 w-4" /> Upload</Button>}
      />

      <SectionCard title="Document readiness" description="What you need before applying">
        <div className="flex flex-wrap items-center gap-4">
          <div className="font-display text-4xl font-semibold text-primary">{readinessPct}%</div>
          <ul className="flex flex-wrap gap-2">
            {requiredCats.map((c) => {
              const ok = ready.has(c);
              return (
                <li key={c} className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${ok ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-muted text-muted-foreground"}`}>
                  {ok ? <ShieldCheck className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />} {c}
                </li>
              );
            })}
          </ul>
        </div>
      </SectionCard>

      <div className="space-y-4">
        {Object.entries(byCat).map(([cat, list]) => (
          <SectionCard key={cat} title={cat} description={`${list.length} document${list.length > 1 ? "s" : ""}`}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((d) => (
                <div key={d.id} className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/40">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{d.name}</div>
                      <div className="text-xs text-muted-foreground">v{d.version} · Updated {format(new Date(d.updatedAt), "MMM d, yyyy")}</div>
                    </div>
                  </div>
                  {d.linkedApplicationIds.length > 0 && (
                    <div className="mt-3 text-xs text-muted-foreground">Used in {d.linkedApplicationIds.length} application{d.linkedApplicationIds.length > 1 ? "s" : ""}</div>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
