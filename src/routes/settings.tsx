import { createFileRoute } from "@tanstack/react-router";
import { Download, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Shemove Hub" },
      { name: "description", content: "Profile, notifications, weekly goal, and data export." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const profile = useStore((s) => s.profile);
  const settings = useStore((s) => s.settings);
  const updateProfile = useStore((s) => s.updateProfile);
  const updateSettings = useStore((s) => s.updateSettings);
  const resetData = useStore((s) => s.resetData);

  const exportJson = () => {
    const data = JSON.stringify(useStore.getState(), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "career-command-export.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported data");
  };

  const exportCsv = () => {
    const apps = useStore.getState().applications;
    const headers = ["Title", "Company", "Type", "Status", "Priority", "Closing Date", "Match Score"];
    const rows = apps.map((a) => [a.title, useStore.getState().companies.find((c) => c.id === a.companyId)?.name ?? "", a.type, a.status, a.priority, a.closingDate.slice(0, 10), a.matchScore]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "applications.csv";
    a.click();
    toast.success("Exported CSV");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <PageHeader title="Settings" description="Tailor your command centre" />

      <SectionCard title="Profile">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Name</Label><Input value={profile.name} onChange={(e) => updateProfile({ name: e.target.value })} /></div>
          <div><Label>Email</Label><Input value={profile.email} onChange={(e) => updateProfile({ email: e.target.value })} /></div>
          <div className="sm:col-span-2"><Label>Skills</Label><Input value={profile.skills.join(", ")} onChange={(e) => updateProfile({ skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} /></div>
          <div className="sm:col-span-2"><Label>Interests</Label><Input value={profile.interests.join(", ")} onChange={(e) => updateProfile({ interests: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} /></div>
          <div className="sm:col-span-2"><Label>Preferred locations</Label><Input value={profile.preferredLocations.join(", ")} onChange={(e) => updateProfile({ preferredLocations: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} /></div>
          <div className="sm:col-span-2"><Label>Qualifications</Label><Textarea rows={2} value={profile.qualifications.join("\n")} onChange={(e) => updateProfile({ qualifications: e.target.value.split("\n").filter(Boolean) })} /></div>
        </div>
      </SectionCard>

      <SectionCard title="Goals & reminders">
        <div className="space-y-5">
          <div>
            <Label>Weekly goal: apply to {settings.weeklyGoal} opportunit{settings.weeklyGoal === 1 ? "y" : "ies"}</Label>
            <Slider value={[settings.weeklyGoal]} min={1} max={15} step={1} onValueChange={(v) => updateSettings({ weeklyGoal: v[0] })} />
          </div>
          <div>
            <Label>Flag applications with no response after {settings.noResponseDays} days</Label>
            <Slider value={[settings.noResponseDays]} min={3} max={45} step={1} onValueChange={(v) => updateSettings({ noResponseDays: v[0] })} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Data">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportJson}><Download className="h-4 w-4" /> Export JSON</Button>
          <Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4" /> Export applications CSV</Button>
          <Button variant="outline" onClick={() => { if (confirm("Reset to sample data?")) { resetData(); toast.success("Data reset"); } }}>
            <RotateCcw className="h-4 w-4" /> Reset to sample data
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
