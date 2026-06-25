import { cn } from "@/lib/utils";

interface Props {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

export function ProgressRing({ value, size = 120, stroke = 10, label, sublabel, className }: Props) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;
  return (
    <div className={cn("relative grid place-items-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`pr-grad-${size}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.68 0.17 156)" />
            <stop offset="100%" stopColor="oklch(0.82 0.19 152)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="oklch(0.28 0.014 165)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#pr-grad-${size})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-display text-2xl font-semibold text-foreground">{label ?? `${Math.round(value)}%`}</div>
          {sublabel && <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{sublabel}</div>}
        </div>
      </div>
    </div>
  );
}
