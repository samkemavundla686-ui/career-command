import { cn } from "@/lib/utils";
import type { AppStatus, CompanyStatus, Priority } from "@/lib/store";

const statusStyles: Record<string, string> = {
  Saved: "bg-secondary text-secondary-foreground",
  Preparing: "bg-chart-3/15 text-chart-3 border border-chart-3/30",
  Applied: "bg-chart-2/15 text-chart-2 border border-chart-2/30",
  "Application Viewed": "bg-chart-2/15 text-chart-2 border border-chart-2/30",
  "Assessment Invited": "bg-chart-4/15 text-chart-4 border border-chart-4/30",
  "Interview Invited": "bg-primary/15 text-primary border border-primary/30",
  "Interview Completed": "bg-primary/15 text-primary border border-primary/30",
  "Waiting for Feedback": "bg-muted text-muted-foreground border border-border",
  "Offer Received": "bg-success/20 text-success border border-success/40",
  Accepted: "bg-success/25 text-success border border-success/50",
  Rejected: "bg-destructive/15 text-destructive border border-destructive/30",
  Withdrawn: "bg-muted text-muted-foreground border border-border",
  Expired: "bg-muted text-muted-foreground border border-border",
  // company
  Researching: "bg-muted text-muted-foreground border border-border",
  Interested: "bg-chart-3/15 text-chart-3 border border-chart-3/30",
  Responded: "bg-primary/15 text-primary border border-primary/30",
  Interviewing: "bg-primary/15 text-primary border border-primary/30",
  "No Response Yet": "bg-muted text-muted-foreground border border-border",
  "Follow Up Needed": "bg-warning/20 text-warning border border-warning/40",
};

const priorityStyles: Record<Priority, string> = {
  Low: "bg-muted text-muted-foreground",
  Medium: "bg-chart-2/15 text-chart-2",
  High: "bg-warning/20 text-warning",
  Critical: "bg-destructive/20 text-destructive",
};

export function StatusBadge({ status, className }: { status: AppStatus | CompanyStatus | string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        statusStyles[status] ?? "bg-secondary text-secondary-foreground",
        className,
      )}
    >
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        priorityStyles[priority],
      )}
    >
      {priority}
    </span>
  );
}
