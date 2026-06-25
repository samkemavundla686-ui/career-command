import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore, type Priority } from "@/lib/store";
import { toast } from "sonner";
import type { ReactNode } from "react";

const PRIORITIES: Priority[] = ["Low", "Medium", "High", "Critical"];

export function TaskFormDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  const apps = useStore((s) => s.applications);
  const addTask = useStore((s) => s.addTask);
  const [form, setForm] = useState({
    name: "",
    dueDate: new Date().toISOString().slice(0, 10),
    priority: "Medium" as Priority,
    applicationId: "none",
    notes: "",
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="font-display">Add task</DialogTitle></DialogHeader>
        <div className="space-y-3 py-2">
          <div><Label>Task name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>Due date</Label><Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></div>
          <div>
            <Label>Priority</Label>
            <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as Priority })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Linked application (optional)</Label>
            <Select value={form.applicationId} onValueChange={(v) => setForm({ ...form, applicationId: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {apps.map((a) => <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            className="bg-gradient-emerald text-primary-foreground hover:opacity-95"
            onClick={() => {
              if (!form.name.trim()) return toast.error("Task name required");
              addTask({
                name: form.name.trim(),
                dueDate: new Date(form.dueDate).toISOString(),
                priority: form.priority,
                applicationId: form.applicationId === "none" ? undefined : form.applicationId,
                done: false,
                notes: form.notes,
              });
              toast.success("Task added");
              setOpen(false);
            }}
          >
            Add task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
