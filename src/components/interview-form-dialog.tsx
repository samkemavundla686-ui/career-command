import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore, type InterviewType } from "@/lib/store";
import { toast } from "sonner";
import type { ReactNode } from "react";

const TYPES: InterviewType[] = ["Phone", "Online", "In-person", "Assessment", "Panel"];

export function InterviewFormDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  const companies = useStore((s) => s.companies);
  const apps = useStore((s) => s.applications);
  const addInterview = useStore((s) => s.addInterview);

  const [form, setForm] = useState({
    role: "",
    companyId: companies[0]?.id ?? "",
    applicationId: "none",
    type: "Online" as InterviewType,
    datetime: new Date().toISOString().slice(0, 16),
    interviewer: "",
    link: "",
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="font-display">Schedule interview</DialogTitle></DialogHeader>
        <div className="space-y-3 py-2">
          <div><Label>Role</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></div>
          <div>
            <Label>Company</Label>
            <Select value={form.companyId} onValueChange={(v) => setForm({ ...form, companyId: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{companies.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Application (optional)</Label>
            <Select value={form.applicationId} onValueChange={(v) => setForm({ ...form, applicationId: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {apps.map((a) => <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as InterviewType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Date & time</Label><Input type="datetime-local" value={form.datetime} onChange={(e) => setForm({ ...form, datetime: e.target.value })} /></div>
          <div><Label>Interviewer</Label><Input value={form.interviewer} onChange={(e) => setForm({ ...form, interviewer: e.target.value })} /></div>
          <div><Label>Meeting link / address</Label><Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            className="bg-gradient-emerald text-primary-foreground hover:opacity-95"
            onClick={() => {
              if (!form.role.trim()) return toast.error("Role required");
              addInterview({
                role: form.role.trim(),
                companyId: form.companyId,
                applicationId: form.applicationId === "none" ? undefined : form.applicationId,
                type: form.type,
                datetime: new Date(form.datetime).toISOString(),
                interviewer: form.interviewer,
                link: form.link,
                prep: [],
                questionsToAsk: [],
                expectedQuestions: [],
              });
              toast.success("Interview scheduled");
              setOpen(false);
            }}
          >
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
