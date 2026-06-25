import { useState } from "react";
import { useStore, type Application, APP_STATUSES, OPP_TYPES, type Priority } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import type { ReactNode } from "react";

const PRIORITIES: Priority[] = ["Low", "Medium", "High", "Critical"];

interface Props {
  trigger?: ReactNode;
  initial?: Partial<Application>;
  applicationId?: string;
  open?: boolean;
  onOpenChange?: (o: boolean) => void;
}

export function ApplicationFormDialog({ trigger, initial, applicationId, open: openProp, onOpenChange }: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = openProp ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const companies = useStore((s) => s.companies);
  const apps = useStore((s) => s.applications);
  const addApplication = useStore((s) => s.addApplication);
  const updateApplication = useStore((s) => s.updateApplication);
  const addCompany = useStore((s) => s.addCompany);

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    companyId: initial?.companyId ?? companies[0]?.id ?? "",
    newCompanyName: "",
    type: initial?.type ?? "Job",
    industry: initial?.industry ?? "",
    location: initial?.location ?? "",
    workMode: initial?.workMode ?? "Hybrid",
    link: initial?.link ?? "",
    closingDate: initial?.closingDate?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    status: initial?.status ?? "Saved",
    priority: initial?.priority ?? "Medium",
    notes: initial?.notes ?? "",
    tags: (initial?.tags ?? []).join(", "),
    matchScore: initial?.matchScore ?? 7,
    salary: initial?.salary ?? "",
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    let companyId = form.companyId;
    if (form.newCompanyName.trim()) {
      companyId = addCompany({
        name: form.newCompanyName.trim(),
        industry: form.industry || "—",
        location: form.location || "—",
        contactPeople: [],
        status: "Interested",
      });
    }
    const payload = {
      title: form.title.trim(),
      companyId,
      type: form.type as Application["type"],
      industry: form.industry,
      location: form.location,
      workMode: form.workMode as Application["workMode"],
      link: form.link,
      closingDate: new Date(form.closingDate).toISOString(),
      status: form.status as Application["status"],
      priority: form.priority as Priority,
      notes: form.notes,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      requiredDocs: initial?.requiredDocs ?? [
        { name: "CV", ready: true },
        { name: "Cover Letter", ready: false },
      ],
      attachments: initial?.attachments ?? [],
      matchScore: form.matchScore,
      salary: form.salary,
    };
    if (applicationId) {
      updateApplication(applicationId, payload);
      toast.success("Application updated");
    } else {
      const dup = apps.find(
        (a) => a.companyId === companyId && a.title.toLowerCase() === form.title.toLowerCase(),
      );
      if (dup) {
        toast.warning("Duplicate detected — saved anyway");
      }
      addApplication(payload);
      toast.success("Application added");
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display">{applicationId ? "Edit application" : "Add application"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Opportunity title</Label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. AI Research Engineer" />
          </div>
          <div>
            <Label>Company</Label>
            <Select value={form.companyId} onValueChange={(v) => set("companyId", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {companies.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Or new company</Label>
            <Input value={form.newCompanyName} onChange={(e) => set("newCompanyName", e.target.value)} placeholder="New company name" />
          </div>
          <div>
            <Label>Opportunity type</Label>
            <Select value={form.type} onValueChange={(v) => set("type", v as Application["type"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {OPP_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set("status", v as Application["status"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {APP_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Industry</Label>
            <Input value={form.industry} onChange={(e) => set("industry", e.target.value)} />
          </div>
          <div>
            <Label>Location</Label>
            <Input value={form.location} onChange={(e) => set("location", e.target.value)} />
          </div>
          <div>
            <Label>Work mode</Label>
            <Select value={form.workMode} onValueChange={(v) => set("workMode", v as Application["workMode"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
                <SelectItem value="On-site">On-site</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Priority</Label>
            <Select value={form.priority} onValueChange={(v) => set("priority", v as Priority)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Closing date</Label>
            <Input type="date" value={form.closingDate} onChange={(e) => set("closingDate", e.target.value)} />
          </div>
          <div>
            <Label>Salary / funding</Label>
            <Input value={form.salary} onChange={(e) => set("salary", e.target.value)} placeholder="e.g. R 720k – 900k" />
          </div>
          <div className="sm:col-span-2">
            <Label>Application link</Label>
            <Input value={form.link} onChange={(e) => set("link", e.target.value)} placeholder="https://…" />
          </div>
          <div className="sm:col-span-2">
            <Label>Tags (comma-separated)</Label>
            <Input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="dream, tech, remote" />
          </div>
          <div className="sm:col-span-2">
            <Label>Match score: {form.matchScore}/10</Label>
            <Slider value={[form.matchScore]} min={1} max={10} step={1} onValueChange={(v) => set("matchScore", v[0])} />
          </div>
          <div className="sm:col-span-2">
            <Label>Notes</Label>
            <Textarea rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} className="bg-gradient-emerald text-primary-foreground hover:opacity-95">
            {applicationId ? "Save changes" : "Add application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
