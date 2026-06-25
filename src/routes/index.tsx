import { createFileRoute, Link } from "@tanstack/react-router";
import { format, formatDistanceToNow, isToday, isTomorrow } from "date-fns";
import {
  Plus,
  Calendar as CalendarIcon,
  AlertCircle,
  Mail,
  CheckCircle2,
  Briefcase,
  Target,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/progress-ring";
import { StatCard } from "@/components/stat-card";
import { SectionCard } from "@/components/section-card";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import { ApplicationFormDialog } from "@/components/application-form-dialog";
import { InterviewFormDialog } from "@/components/interview-form-dialog";
import { TaskFormDialog } from "@/components/task-form-dialog";
import {
  useStore,
  closingSoon,
  followUpsDue,
  recentResponses,
  upcomingInterviews,
  careerReadinessScore,
  weeklyProgress,
  streakDays,
  dailyQuote,
  getCompany,
  bestChance,
} from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Shemove Hub" },
      { name: "description", content: "Your daily career command centre — focus, deadlines, follow-ups and momentum at a glance." },
    ],
  }),
  component: Dashboard,
});

function relativeDate(iso: string) {
  const d = new Date(iso);
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  return format(d, "EEE, MMM d");
}

function Dashboard() {
  const profile = useStore((s) => s.profile);
  const apps = useStore((s) => s.applications);
  const recent = useStore((s) => s.recentItems);

  const closing = closingSoon();
  const followUps = followUpsDue();
  const responses = recentResponses().slice(0, 4);
  const interviews = upcomingInterviews().slice(0, 3);
  const readiness = careerReadinessScore();
  const weekly = weeklyProgress();
  const streak = streakDays();
  const best = bestChance().slice(0, 3);
  const today = new Date();

  const totalActive = apps.filter((a) => !["Rejected", "Withdrawn", "Expired", "Accepted"].includes(a.status)).length;
  const responseRate = Math.round((apps.filter((a) => ["Application Viewed", "Assessment Invited", "Interview Invited", "Interview Completed", "Offer Received", "Accepted", "Waiting for Feedback"].includes(a.status)).length / Math.max(1, apps.length)) * 100);
  const interviewRate = Math.round((apps.filter((a) => ["Interview Invited", "Interview Completed", "Offer Received", "Accepted"].includes(a.status)).length / Math.max(1, apps.length)) * 100);

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-surface p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-glow opacity-80" />
        <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">{format(today, "EEEE, MMMM d")}</p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Welcome back, <span className="bg-gradient-emerald bg-clip-text text-transparent">{profile.name}</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm italic text-muted-foreground">"{dailyQuote()}"</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <ApplicationFormDialog
                trigger={
                  <Button className="bg-gradient-emerald text-primary-foreground glow-ring-sm hover:opacity-95">
                    <Plus className="h-4 w-4" /> Quick add application
                  </Button>
                }
              />
              <InterviewFormDialog
                trigger={
                  <Button variant="outline" className="border-primary/30 hover:border-primary/60">
                    <CalendarIcon className="h-4 w-4" /> Add interview
                  </Button>
                }
              />
              <TaskFormDialog
                trigger={
                  <Button variant="outline" className="border-primary/30 hover:border-primary/60">
                    <CheckCircle2 className="h-4 w-4" /> Add task
                  </Button>
                }
              />
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <ProgressRing value={readiness} sublabel="Readiness" />
            </div>
            <div className="hidden sm:block text-center">
              <ProgressRing value={(weekly.count / Math.max(1, weekly.goal)) * 100} label={`${weekly.count}/${weekly.goal}`} sublabel="Weekly goal" />
            </div>
          </div>
        </div>
      </section>

      {/* Stat row */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active applications" value={totalActive} icon={Briefcase} accent />
        <StatCard label="Response rate" value={`${responseRate}%`} icon={TrendingUp} hint="of applications viewed or responded to" />
        <StatCard label="Interview rate" value={`${interviewRate}%`} icon={Sparkles} hint="from total applications" />
        <StatCard label="Streak" value={`${streak} days`} icon={Target} hint="Keep the momentum" />
      </section>

      {/* Today's focus + closing soon */}
      <section className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="Today's Focus"
          description="The most important actions to move you forward"
          className="lg:col-span-2"
          action={<TaskFormDialog trigger={<Button size="sm" variant="ghost"><Plus className="h-4 w-4" /></Button>} />}
        >
          <ul className="divide-y divide-border">
            {useStore.getState().tasks.filter((t) => !t.done).slice(0, 5).map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-3">
                <button
                  onClick={() => useStore.getState().updateTask(t.id, { done: true })}
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border hover:border-primary"
                  aria-label="Mark done"
                >
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground hover:text-primary" />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">Due {relativeDate(t.dueDate)}</div>
                </div>
                <PriorityBadge priority={t.priority} />
              </li>
            ))}
            {useStore.getState().tasks.filter((t) => !t.done).length === 0 && (
              <li className="py-8 text-center text-sm text-muted-foreground">Nothing pending — beautiful day to chase a new opportunity.</li>
            )}
          </ul>
        </SectionCard>

        <SectionCard
          title="Closing Soon"
          description="Within 7 days"
          action={<span className="rounded-full bg-warning/15 px-2 py-0.5 text-xs font-semibold text-warning">{closing.length}</span>}
        >
          {closing.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No deadlines this week.</p>
          ) : (
            <ul className="space-y-3">
              {closing.slice(0, 5).map((a) => (
                <li key={a.id} className="rounded-lg border border-warning/20 bg-warning/5 p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{a.title}</div>
                      <div className="truncate text-xs text-muted-foreground">{getCompany(a.companyId)?.name} · closes {relativeDate(a.closingDate)}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </section>

      {/* Follow up + responses + interviews */}
      <section className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Follow Up Today" description="Stay top of mind">
          {followUps.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No follow-ups due.</p>
          ) : (
            <ul className="space-y-3">
              {followUps.map((a) => (
                <li key={a.id} className="flex items-start gap-2 rounded-lg border border-border p-3">
                  <Mail className="mt-0.5 h-4 w-4 text-primary" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{a.title}</div>
                    <div className="truncate text-xs text-muted-foreground">{getCompany(a.companyId)?.name}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Recent Responses" description="Companies that replied">
          {responses.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No responses yet.</p>
          ) : (
            <ul className="space-y-3">
              {responses.map((c) => (
                <li key={c.id} className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-sm font-medium">{c.name}</span>
                    <StatusBadge status={c.status} />
                  </div>
                  {c.responseSummary && <p className="mt-1 text-xs text-muted-foreground">{c.responseSummary}</p>}
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Upcoming Interviews">
          {interviews.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No interviews scheduled.</p>
          ) : (
            <ul className="space-y-3">
              {interviews.map((i) => (
                <li key={i.id} className="rounded-lg border border-border bg-surface-elevated p-3">
                  <div className="text-sm font-medium">{i.role}</div>
                  <div className="text-xs text-muted-foreground">{getCompany(i.companyId)?.name} · {i.type}</div>
                  <div className="mt-1 text-xs text-primary">{format(new Date(i.datetime), "EEE, MMM d 'at' p")}</div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </section>

      {/* Best chance + continue */}
      <section className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Your Best Chances"
          description="Strongest match scores in your pipeline"
          action={<Link to="/applications" className="text-xs text-primary hover:underline">See all <ArrowRight className="inline h-3 w-3" /></Link>}
        >
          <ul className="space-y-3">
            {best.map((a) => (
              <li key={a.id} className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/40">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-emerald font-display text-sm font-bold text-primary-foreground">
                  {a.matchScore}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{a.title}</div>
                  <div className="truncate text-xs text-muted-foreground">{getCompany(a.companyId)?.name} · {a.type}</div>
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Continue Where You Left Off" description="Pick up your recent work">
          <ul className="space-y-2">
            {recent.map((r) => (
              <li key={r.type + r.id}>
                <Link
                  to={r.type === "application" ? "/applications" : r.type === "company" ? "/companies" : r.type === "document" ? "/documents" : "/"}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2.5 text-sm transition-colors hover:border-primary/40"
                >
                  <span className="truncate">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">{r.type}</span>{" "}
                    <span className="ml-2 font-medium">{r.label}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(r.at), { addSuffix: true })}</span>
                </Link>
              </li>
            ))}
          </ul>
        </SectionCard>
      </section>
    </div>
  );
}
