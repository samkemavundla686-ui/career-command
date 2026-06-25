import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, subDays, startOfDay, eachDayOfInterval, subMonths, startOfMonth } from "date-fns";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { ProgressRing } from "@/components/progress-ring";
import { StatCard } from "@/components/stat-card";
import { useStore, weeklyProgress } from "@/lib/store";
import { Briefcase, Send, CheckCircle2, Target } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Shemove Hub" },
      { name: "description", content: "See your career momentum, response rate, and outcomes." },
    ],
  }),
  component: AnalyticsPage,
});

const COLORS = ["oklch(0.72 0.18 152)", "oklch(0.62 0.14 200)", "oklch(0.78 0.16 80)", "oklch(0.60 0.18 320)", "oklch(0.55 0.20 25)"];

function AnalyticsPage() {
  const apps = useStore((s) => s.applications);
  const activities = useStore((s) => s.activities);

  const total = apps.length;
  const responses = apps.filter((a) => ["Application Viewed", "Assessment Invited", "Interview Invited", "Interview Completed", "Offer Received", "Accepted", "Waiting for Feedback", "Rejected"].includes(a.status)).length;
  const interviews = apps.filter((a) => ["Interview Invited", "Interview Completed", "Offer Received", "Accepted"].includes(a.status)).length;
  const offers = apps.filter((a) => ["Offer Received", "Accepted"].includes(a.status)).length;
  const rejected = apps.filter((a) => a.status === "Rejected").length;
  const responseRate = Math.round((responses / Math.max(1, total)) * 100);
  const interviewRate = Math.round((interviews / Math.max(1, total)) * 100);
  const offerRate = Math.round((offers / Math.max(1, total)) * 100);
  const rejectionRate = Math.round((rejected / Math.max(1, total)) * 100);

  const byType = Array.from(new Set(apps.map((a) => a.type))).map((t) => ({
    name: t,
    value: apps.filter((a) => a.type === t).length,
  }));

  const byStatus = Array.from(new Set(apps.map((a) => a.status))).map((s) => ({
    name: s,
    value: apps.filter((a) => a.status === s).length,
  }));

  const byMonth = Array.from({ length: 6 })
    .map((_, i) => {
      const m = startOfMonth(subMonths(new Date(), 5 - i));
      const next = startOfMonth(subMonths(new Date(), 4 - i));
      const count = apps.filter((a) => a.dateApplied && new Date(a.dateApplied) >= m && new Date(a.dateApplied) < next).length;
      return { month: format(m, "MMM"), apps: count };
    });

  // Heatmap last 60 days
  const days = eachDayOfInterval({ start: subDays(new Date(), 59), end: new Date() });
  const activityByDay = new Map<string, number>();
  activities.forEach((a) => {
    const k = startOfDay(new Date(a.at)).toISOString().slice(0, 10);
    activityByDay.set(k, (activityByDay.get(k) ?? 0) + 1);
  });

  const weekly = weeklyProgress();

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-fade-in">
      <PageHeader title="Analytics" description="Your career, in numbers" />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Applications" value={total} icon={Briefcase} accent />
        <StatCard label="Response rate" value={`${responseRate}%`} icon={Send} hint={`${responses} responses`} />
        <StatCard label="Interview rate" value={`${interviewRate}%`} icon={CheckCircle2} hint={`${interviews} interviews`} />
        <StatCard label="Offer rate" value={`${offerRate}%`} icon={Target} hint={`${offers} offers`} />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Funnel rates" className="lg:col-span-1">
          <div className="flex flex-wrap items-center justify-around gap-4">
            <ProgressRing value={responseRate} sublabel="Response" />
            <ProgressRing value={interviewRate} sublabel="Interview" />
            <ProgressRing value={offerRate} sublabel="Offer" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-lg border border-border p-3">
              <div className="font-display text-2xl font-semibold text-primary">{weekly.count}/{weekly.goal}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Weekly goal</div>
            </div>
            <div className="rounded-lg border border-border p-3">
              <div className="font-display text-2xl font-semibold text-destructive">{rejectionRate}%</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Rejection</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Applications by month" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={byMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.014 165 / 0.3)" />
              <XAxis dataKey="month" stroke="oklch(0.68 0.018 175)" fontSize={12} />
              <YAxis stroke="oklch(0.68 0.018 175)" fontSize={12} />
              <Tooltip contentStyle={{ background: "oklch(0.20 0.014 165)", border: "1px solid oklch(0.30 0.014 165)", borderRadius: 8 }} />
              <Bar dataKey="apps" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.82 0.19 152)" />
                  <stop offset="100%" stopColor="oklch(0.55 0.16 156)" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="By opportunity type">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={byType} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3}>
                {byType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "oklch(0.20 0.014 165)", border: "1px solid oklch(0.30 0.014 165)", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="By status">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byStatus} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.014 165 / 0.3)" />
              <XAxis type="number" stroke="oklch(0.68 0.018 175)" fontSize={11} />
              <YAxis type="category" dataKey="name" stroke="oklch(0.68 0.018 175)" fontSize={11} width={130} />
              <Tooltip contentStyle={{ background: "oklch(0.20 0.014 165)", border: "1px solid oklch(0.30 0.014 165)", borderRadius: 8 }} />
              <Bar dataKey="value" fill="oklch(0.72 0.18 152)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </section>

      <SectionCard title="Activity heatmap" description="Last 60 days">
        <div className="grid grid-cols-[repeat(60,minmax(0,1fr))] gap-1">
          {days.map((d) => {
            const k = d.toISOString().slice(0, 10);
            const v = activityByDay.get(k) ?? 0;
            const intensity = Math.min(1, v / 4);
            return (
              <div
                key={k}
                title={`${format(d, "MMM d")}: ${v} action${v !== 1 ? "s" : ""}`}
                className="aspect-square rounded-sm"
                style={{ background: v === 0 ? "oklch(0.22 0.014 165)" : `oklch(${0.45 + intensity * 0.35} ${0.12 + intensity * 0.08} 156)` }}
              />
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Response time trend" description="How fast companies are getting back">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={[
            { week: "W-5", days: 12 }, { week: "W-4", days: 14 }, { week: "W-3", days: 9 },
            { week: "W-2", days: 8 }, { week: "W-1", days: 6 }, { week: "Now", days: 7 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.014 165 / 0.3)" />
            <XAxis dataKey="week" stroke="oklch(0.68 0.018 175)" fontSize={12} />
            <YAxis stroke="oklch(0.68 0.018 175)" fontSize={12} />
            <Tooltip contentStyle={{ background: "oklch(0.20 0.014 165)", border: "1px solid oklch(0.30 0.014 165)", borderRadius: 8 }} />
            <Line type="monotone" dataKey="days" stroke="oklch(0.78 0.19 150)" strokeWidth={3} dot={{ fill: "oklch(0.82 0.19 152)" }} />
          </LineChart>
        </ResponsiveContainer>
      </SectionCard>
    </div>
  );
}
