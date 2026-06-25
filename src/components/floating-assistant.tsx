import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  closingSoon,
  followUpsDue,
  upcomingInterviews,
  recentResponses,
  bestChance,
  useStore,
} from "@/lib/store";
import { format } from "date-fns";

type Msg = { role: "user" | "ai"; text: string };

const quickPrompts = [
  "Help me plan today",
  "What deadlines are coming up?",
  "Which applications need follow-up?",
  "Help me prepare for an interview",
  "Draft a follow-up email",
  "Improve my CV",
  "Suggest my next best action",
  "Summarise my recent activity",
  "Show companies that responded",
];

function answer(prompt: string): string {
  const s = useStore.getState();
  const lower = prompt.toLowerCase();
  if (lower.includes("today") && (lower.includes("plan") || lower.includes("focus") || lower.includes("next"))) {
    const closing = closingSoon(3);
    const followUps = followUpsDue();
    const interviews = upcomingInterviews().slice(0, 2);
    const tasks = s.tasks.filter((t) => !t.done).slice(0, 3);
    const lines = ["**Here's your plan for today**", ""];
    if (interviews.length) lines.push(`📅 **${interviews.length} interview${interviews.length > 1 ? "s" : ""}** coming up — next: ${interviews[0].role} (${format(new Date(interviews[0].datetime), "EEE p")})`);
    if (closing.length) lines.push(`⏰ **${closing.length} deadline${closing.length > 1 ? "s" : ""}** within 3 days — top: ${closing[0].title}`);
    if (followUps.length) lines.push(`✉️ **${followUps.length} follow-up${followUps.length > 1 ? "s" : ""}** due today`);
    if (tasks.length) {
      lines.push("", "**Open tasks**");
      tasks.forEach((t) => lines.push(`• ${t.name}`));
    }
    return lines.join("\n");
  }
  if (lower.includes("deadline")) {
    const closing = closingSoon(14);
    if (!closing.length) return "No deadlines in the next 14 days. Nice work staying ahead!";
    return ["**Upcoming deadlines**", "", ...closing.map((c) => `• ${c.title} — closes ${format(new Date(c.closingDate), "MMM d")}`)].join("\n");
  }
  if (lower.includes("follow")) {
    const fu = followUpsDue();
    if (!fu.length) return "No follow-ups due today. You're caught up.";
    return ["**Follow-ups due**", "", ...fu.map((a) => `• ${a.title}${a.contactPerson ? ` — contact ${a.contactPerson}` : ""}`)].join("\n");
  }
  if (lower.includes("interview")) {
    const next = upcomingInterviews()[0];
    if (!next) return "No upcoming interviews scheduled.";
    return `**Next interview:** ${next.role}\nWhen: ${format(new Date(next.datetime), "EEE, MMM d 'at' p")}\nType: ${next.type}\n\nPrep checklist:\n${next.prep.map((p) => `${p.done ? "✅" : "⬜️"} ${p.task}`).join("\n")}\n\nTip: write 3 STAR stories and 2 questions to ask the interviewer.`;
  }
  if (lower.includes("follow-up email") || lower.includes("draft")) {
    return `**Draft follow-up email**\n\nSubject: Following up on my application\n\nHi [Name],\n\nI hope you're well. I wanted to follow up on my application for the [Role] position submitted on [date]. I remain very interested in the opportunity and would love to hear about the next steps.\n\nHappy to provide any further information needed.\n\nBest regards,\n${s.profile.name}`;
  }
  if (lower.includes("cv")) {
    return "**CV tips**\n• Lead with measurable impact (numbers, %)\n• Tailor the top third per role\n• Keep it to 1–2 pages\n• Use strong action verbs\n• Add a short, sharp summary aligned to the role";
  }
  if (lower.includes("best") || lower.includes("next")) {
    const best = bestChance().slice(0, 3);
    return ["**Your strongest opportunities right now**", "", ...best.map((a) => `• ${a.title} — match score ${a.matchScore}/10`)].join("\n");
  }
  if (lower.includes("summar")) {
    const recent = s.activities.slice(0, 6);
    return ["**Recent activity**", "", ...recent.map((a) => `• ${a.message}`)].join("\n");
  }
  if (lower.includes("respond")) {
    const r = recentResponses();
    if (!r.length) return "No company responses logged yet.";
    return ["**Companies that responded**", "", ...r.map((c) => `• ${c.name} — ${c.responseSummary ?? c.status}`)].join("\n");
  }
  return "I can help plan your day, surface deadlines, follow-ups, interview prep, and CV tips. Try one of the quick actions below.";
}

export function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  const [minimised, setMinimised] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Hi — I'm **Career Command AI**. Ask me anything about your career pipeline, or tap a quick action below." },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const user: Msg = { role: "user", text };
    setMsgs((m) => [...m, user]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "ai", text: answer(text) }]);
    }, 250);
  };

  return (
    <>
      {/* Floating button */}
      <button
        aria-label="Open Career Command AI"
        onClick={() => {
          setOpen(true);
          setMinimised(false);
        }}
        className={cn(
          "fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-emerald text-primary-foreground transition-transform animate-glow-pulse hover:scale-105",
          open && !minimised && "scale-0 opacity-0 pointer-events-none",
        )}
      >
        <Bot className="h-6 w-6" />
      </button>

      <Sheet open={open && !minimised} onOpenChange={(v) => setOpen(v)}>
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 border-l border-border bg-card p-0 sm:max-w-md"
        >
          <SheetHeader className="border-b border-border bg-gradient-surface px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-emerald glow-ring-sm">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <SheetTitle className="font-display text-base">Career Command AI</SheetTitle>
                  <p className="text-[11px] text-muted-foreground">Your personal career copilot</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => setMinimised(true)} aria-label="Minimise">
                  <Minus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SheetHeader>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed animate-fade-in",
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "border border-border bg-surface-elevated text-foreground",
                )}
                dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>") }}
              />
            ))}
          </div>

          <div className="border-t border-border bg-card/60 px-3 py-2">
            <div className="flex gap-1.5 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="shrink-0 rounded-full border border-border bg-secondary px-3 py-1 text-[11px] text-secondary-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <form
            className="flex items-center gap-2 border-t border-border bg-card px-3 py-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything…"
              className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/60"
            />
            <Button type="submit" size="icon" className="bg-gradient-emerald text-primary-foreground glow-ring-sm hover:opacity-95">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </SheetContent>
      </Sheet>

      {/* Minimised pill */}
      {minimised && (
        <button
          onClick={() => setMinimised(false)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-primary/40 bg-card px-4 py-2.5 text-sm font-medium shadow-elegant glow-ring-sm hover:border-primary"
        >
          <Bot className="h-4 w-4 text-primary" />
          Career Command AI
        </button>
      )}
    </>
  );
}
