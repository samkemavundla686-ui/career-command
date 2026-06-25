import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  Plus,
  LayoutGrid,
  List,
  Columns3,
  Search,
  Filter,
  ExternalLink,
  Edit2,
  Trash2,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import { PageHeader } from "@/components/page-header";
import { ApplicationFormDialog } from "@/components/application-form-dialog";
import {
  useStore,
  APP_STATUSES,
  OPP_TYPES,
  type AppStatus,
  type Application,
  getCompany,
} from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/applications")({
  head: () => ({
    meta: [
      { title: "Applications — Career Command Centre" },
      { name: "description", content: "Track every application with card, list, and Kanban views." },
    ],
  }),
  component: ApplicationsPage,
});

type ViewMode = "cards" | "list" | "kanban";

function ApplicationsPage() {
  const apps = useStore((s) => s.applications);
  const updateApplication = useStore((s) => s.updateApplication);
  const deleteApplication = useStore((s) => s.deleteApplication);

  const [view, setView] = useState<ViewMode>("cards");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [type, setType] = useState<string>("all");

  const filtered = useMemo(() => {
    return apps.filter((a) => {
      if (status !== "all" && a.status !== status) return false;
      if (type !== "all" && a.type !== type) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !a.title.toLowerCase().includes(q) &&
          !getCompany(a.companyId)?.name.toLowerCase().includes(q) &&
          !a.tags.some((t) => t.toLowerCase().includes(q))
        ) return false;
      }
      return true;
    });
  }, [apps, status, type, search]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-fade-in">
      <PageHeader
        title="My Applications"
        description={`${filtered.length} of ${apps.length} applications`}
        actions={
          <ApplicationFormDialog
            trigger={
              <Button className="bg-gradient-emerald text-primary-foreground glow-ring-sm hover:opacity-95">
                <Plus className="h-4 w-4" /> New application
              </Button>
            }
          />
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, company, tag…" className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]"><Filter className="mr-1 h-4 w-4" /><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {APP_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {OPP_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex rounded-lg border border-border p-1">
          {[
            { v: "cards" as const, icon: LayoutGrid },
            { v: "list" as const, icon: List },
            { v: "kanban" as const, icon: Columns3 },
          ].map((b) => (
            <button
              key={b.v}
              onClick={() => setView(b.v)}
              className={cn(
                "grid h-7 w-9 place-items-center rounded-md text-muted-foreground transition-colors",
                view === b.v && "bg-primary/15 text-primary",
              )}
              aria-label={b.v}
            >
              <b.icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      {view === "cards" && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((a) => (
            <ApplicationCard key={a.id} app={a} onDelete={() => deleteApplication(a.id)} />
          ))}
        </div>
      )}

      {view === "list" && (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Opportunity</th>
                <th className="px-4 py-3 text-left">Company</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Closes</th>
                <th className="px-4 py-3 text-left">Match</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((a) => (
                <tr key={a.id} className="transition-colors hover:bg-surface/50">
                  <td className="px-4 py-3 font-medium">{a.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{getCompany(a.companyId)?.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.type}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{format(new Date(a.closingDate), "MMM d")}</td>
                  <td className="px-4 py-3"><span className="font-display text-base font-bold text-primary">{a.matchScore}</span><span className="text-xs text-muted-foreground">/10</span></td>
                  <td className="px-4 py-3 text-right">
                    <ApplicationFormDialog applicationId={a.id} initial={a} trigger={<Button variant="ghost" size="icon"><Edit2 className="h-4 w-4" /></Button>} />
                    <Button variant="ghost" size="icon" onClick={() => deleteApplication(a.id)}><Trash2 className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === "kanban" && (
        <div className="grid grid-flow-col auto-cols-[280px] gap-4 overflow-x-auto pb-4">
          {APP_STATUSES.map((s) => {
            const items = filtered.filter((a) => a.status === s);
            return (
              <div key={s} className="rounded-xl border border-border bg-card p-3">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s}</h3>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => {
                        const next = prompt(`Move "${a.title}" to status:\n${APP_STATUSES.join(", ")}`, a.status);
                        if (next && APP_STATUSES.includes(next as AppStatus)) updateApplication(a.id, { status: next as AppStatus });
                      }}
                      className="block w-full rounded-lg border border-border bg-surface p-3 text-left transition-colors hover:border-primary/40"
                    >
                      <div className="line-clamp-2 text-sm font-medium">{a.title}</div>
                      <div className="mt-1 truncate text-xs text-muted-foreground">{getCompany(a.companyId)?.name}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <PriorityBadge priority={a.priority} />
                        <span className="text-xs text-muted-foreground">{format(new Date(a.closingDate), "MMM d")}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ApplicationCard({ app, onDelete }: { app: Application; onDelete: () => void }) {
  const company = getCompany(app.companyId);
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:border-primary/40 hover:shadow-elegant">
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-glow opacity-50 transition-opacity group-hover:opacity-100" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{app.type}</span>
            {app.wishlist && <Star className="h-3 w-3 text-warning" fill="currentColor" />}
          </div>
          <h3 className="mt-1 font-display text-base font-semibold leading-snug">{app.title}</h3>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{company?.name} · {app.location} · {app.workMode}</p>
        </div>
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-emerald font-display text-base font-bold text-primary-foreground">
          {app.matchScore}
        </div>
      </div>
      <div className="relative mt-4 flex flex-wrap items-center gap-2">
        <StatusBadge status={app.status} />
        <PriorityBadge priority={app.priority} />
        {app.tags.slice(0, 2).map((t) => (
          <span key={t} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">#{t}</span>
        ))}
      </div>
      <div className="relative mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>Closes {format(new Date(app.closingDate), "MMM d, yyyy")}</span>
        <div className="flex items-center gap-1">
          {app.link && (
            <a href={app.link} target="_blank" rel="noreferrer" className="grid h-7 w-7 place-items-center rounded-md hover:bg-secondary"><ExternalLink className="h-3.5 w-3.5" /></a>
          )}
          <ApplicationFormDialog applicationId={app.id} initial={app} trigger={<button className="grid h-7 w-7 place-items-center rounded-md hover:bg-secondary"><Edit2 className="h-3.5 w-3.5" /></button>} />
          <button onClick={onDelete} className="grid h-7 w-7 place-items-center rounded-md hover:bg-destructive/15 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </article>
  );
}
