import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  accent?: boolean;
  className?: string;
}

export function StatCard({ label, value, hint, icon: Icon, accent, className }: Props) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:border-primary/40 hover:shadow-elegant",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-glow opacity-60 transition-opacity group-hover:opacity-100" />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
          <div
            className={cn(
              "mt-2 font-display text-3xl font-semibold",
              accent ? "bg-gradient-emerald bg-clip-text text-transparent" : "text-foreground",
            )}
          >
            {value}
          </div>
          {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
        </div>
        {Icon && (
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}
