import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AppStatus =
  | "Saved"
  | "Preparing"
  | "Applied"
  | "Application Viewed"
  | "Assessment Invited"
  | "Interview Invited"
  | "Interview Completed"
  | "Waiting for Feedback"
  | "Offer Received"
  | "Accepted"
  | "Rejected"
  | "Withdrawn"
  | "Expired";

export const APP_STATUSES: AppStatus[] = [
  "Saved",
  "Preparing",
  "Applied",
  "Application Viewed",
  "Assessment Invited",
  "Interview Invited",
  "Interview Completed",
  "Waiting for Feedback",
  "Offer Received",
  "Accepted",
  "Rejected",
  "Withdrawn",
  "Expired",
];

export type OpportunityType =
  | "Job"
  | "Internship"
  | "Learnership"
  | "Bursary"
  | "Scholarship"
  | "Graduate Programme"
  | "Training Programme"
  | "Volunteer";

export const OPP_TYPES: OpportunityType[] = [
  "Job",
  "Internship",
  "Learnership",
  "Bursary",
  "Scholarship",
  "Graduate Programme",
  "Training Programme",
  "Volunteer",
];

export type Priority = "Low" | "Medium" | "High" | "Critical";
export type WorkMode = "Remote" | "Hybrid" | "On-site";

export type CompanyStatus =
  | "Researching"
  | "Interested"
  | "Applied"
  | "Responded"
  | "Interviewing"
  | "Offer Received"
  | "Rejected"
  | "No Response Yet"
  | "Follow Up Needed";

export interface Company {
  id: string;
  name: string;
  industry: string;
  website?: string;
  location: string;
  contactPeople: { name: string; role: string; email?: string }[];
  status: CompanyStatus;
  lastContactDate?: string;
  nextFollowUpDate?: string;
  notes?: string;
  responded?: boolean;
  responseSummary?: string;
}

export interface Application {
  id: string;
  title: string;
  companyId: string;
  type: OpportunityType;
  industry: string;
  location: string;
  workMode: WorkMode;
  link?: string;
  closingDate: string; // ISO
  dateApplied?: string;
  salary?: string;
  contactPerson?: string;
  contactEmail?: string;
  status: AppStatus;
  priority: Priority;
  notes?: string;
  tags: string[];
  requiredDocs: { name: string; ready: boolean }[];
  interviewPrep?: string;
  followUpDate?: string;
  attachments: string[];
  matchScore: number; // 1-10
  wishlist?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type InterviewType = "Phone" | "Online" | "In-person" | "Assessment" | "Panel";

export interface Interview {
  id: string;
  applicationId?: string;
  companyId: string;
  role: string;
  type: InterviewType;
  datetime: string; // ISO
  interviewer?: string;
  link?: string;
  prep: { task: string; done: boolean }[];
  questionsToAsk: string[];
  expectedQuestions: string[];
  starNotes?: string;
  reflection?: string;
  thankYouSent?: boolean;
  followUpSent?: boolean;
}

export interface Task {
  id: string;
  name: string;
  applicationId?: string;
  companyId?: string;
  dueDate: string;
  priority: Priority;
  done: boolean;
  notes?: string;
}

export type DocCategory =
  | "CV"
  | "Cover Letter"
  | "Transcript"
  | "Certificate"
  | "ID"
  | "Portfolio"
  | "Reference"
  | "Motivation"
  | "Other";

export interface DocItem {
  id: string;
  name: string;
  category: DocCategory;
  updatedAt: string;
  expiryDate?: string;
  version: number;
  notes?: string;
  linkedApplicationIds: string[];
}

export type ActivityType =
  | "application_created"
  | "application_updated"
  | "application_submitted"
  | "status_changed"
  | "company_added"
  | "company_responded"
  | "interview_scheduled"
  | "interview_completed"
  | "task_created"
  | "task_completed"
  | "document_uploaded"
  | "note_added"
  | "follow_up_sent"
  | "deadline_changed";

export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  applicationId?: string;
  companyId?: string;
  at: string; // ISO
}

export interface UserProfile {
  name: string;
  email: string;
  interests: string[];
  skills: string[];
  qualifications: string[];
  preferredLocations: string[];
}

export interface Settings {
  weeklyGoal: number;
  noResponseDays: number;
  reminderLeadDays: number[];
  theme: "dark" | "light";
}

interface State {
  applications: Application[];
  companies: Company[];
  interviews: Interview[];
  tasks: Task[];
  documents: DocItem[];
  activities: Activity[];
  profile: UserProfile;
  settings: Settings;
  recentItems: { type: string; id: string; label: string; at: string }[];

  addApplication: (a: Omit<Application, "id" | "createdAt" | "updatedAt">) => string;
  updateApplication: (id: string, patch: Partial<Application>) => void;
  deleteApplication: (id: string) => void;

  addCompany: (c: Omit<Company, "id">) => string;
  updateCompany: (id: string, patch: Partial<Company>) => void;
  deleteCompany: (id: string) => void;

  addInterview: (i: Omit<Interview, "id">) => string;
  updateInterview: (id: string, patch: Partial<Interview>) => void;
  deleteInterview: (id: string) => void;

  addTask: (t: Omit<Task, "id">) => string;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  addDocument: (d: Omit<DocItem, "id">) => string;
  updateDocument: (id: string, patch: Partial<DocItem>) => void;
  deleteDocument: (id: string) => void;

  logActivity: (type: ActivityType, message: string, ref?: { applicationId?: string; companyId?: string }) => void;
  touchRecent: (item: { type: string; id: string; label: string }) => void;

  updateProfile: (patch: Partial<UserProfile>) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetData: () => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();
const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

// ----- Seed data -----
const seedCompanies: Company[] = [
  { id: "c1", name: "Aurora Labs", industry: "Tech / AI", website: "auroralabs.io", location: "Cape Town, ZA", contactPeople: [{ name: "Lerato M.", role: "Recruiter", email: "lerato@auroralabs.io" }], status: "Interviewing", lastContactDate: daysFromNow(-3), nextFollowUpDate: daysFromNow(2), notes: "Strong AI research team. Friendly culture.", responded: true, responseSummary: "Invited to second-round interview." },
  { id: "c2", name: "Northwind Bank", industry: "Finance", website: "northwind.com", location: "Johannesburg, ZA", contactPeople: [{ name: "Sipho D.", role: "Graduate Lead" }], status: "Responded", lastContactDate: daysFromNow(-6), notes: "Conservative process, multiple rounds.", responded: true, responseSummary: "Application moved to assessment stage." },
  { id: "c3", name: "Helix Biotech", industry: "Healthcare", website: "helixbio.com", location: "Pretoria, ZA", contactPeople: [{ name: "Amina K.", role: "Talent" }], status: "Applied", notes: "Cutting-edge molecular research." },
  { id: "c4", name: "Bright Future Foundation", industry: "Non-profit", location: "Durban, ZA", contactPeople: [], status: "Interested", notes: "Bursary scheme for STEM students." },
  { id: "c5", name: "Quantum Edge", industry: "Tech / Cloud", website: "quantumedge.co", location: "Remote", contactPeople: [{ name: "Jordan P.", role: "Engineering Manager" }], status: "Offer Received", lastContactDate: daysFromNow(-1), responded: true, responseSummary: "Verbal offer extended, written contract pending.", notes: "Dream company." },
  { id: "c6", name: "Sable Energy", industry: "Energy", location: "Sandton, ZA", contactPeople: [], status: "No Response Yet", notes: "Applied 4 weeks ago, no update." },
  { id: "c7", name: "Coral Studios", industry: "Design", website: "coral.studio", location: "Cape Town, ZA", contactPeople: [{ name: "Naledi S.", role: "Design Director" }], status: "Follow Up Needed", lastContactDate: daysFromNow(-10), nextFollowUpDate: daysFromNow(0) },
  { id: "c8", name: "Veld Robotics", industry: "Robotics", location: "Stellenbosch, ZA", contactPeople: [], status: "Researching" },
  { id: "c9", name: "Atlas University", industry: "Education", location: "Cape Town, ZA", contactPeople: [{ name: "Dr. Mokoena", role: "Programme Lead" }], status: "Applied", notes: "Postgrad scholarship application." },
  { id: "c10", name: "Lumen Media", industry: "Media", website: "lumen.media", location: "Johannesburg, ZA", contactPeople: [], status: "Rejected", responded: true, responseSummary: "Position closed, role no longer available." },
];

const docTemplate = (): { name: string; ready: boolean }[] => [
  { name: "CV", ready: true },
  { name: "Cover Letter", ready: true },
  { name: "Transcript", ready: false },
  { name: "ID Copy", ready: true },
];

const seedApplications: Application[] = [
  { id: "a1", title: "AI Research Engineer", companyId: "c1", type: "Job", industry: "Tech / AI", location: "Cape Town, ZA", workMode: "Hybrid", link: "https://auroralabs.io/careers/ai-eng", closingDate: daysFromNow(5), dateApplied: daysFromNow(-14), salary: "R 720k – 900k", contactPerson: "Lerato M.", contactEmail: "lerato@auroralabs.io", status: "Interview Invited", priority: "Critical", notes: "Second-round interview on Friday.", tags: ["dream", "tech", "ai"], requiredDocs: docTemplate(), interviewPrep: "Review transformer architectures, prepare STAR stories.", followUpDate: daysFromNow(1), attachments: [], matchScore: 9, createdAt: daysFromNow(-20), updatedAt: daysFromNow(-1) },
  { id: "a2", title: "Graduate Programme", companyId: "c2", type: "Graduate Programme", industry: "Finance", location: "Johannesburg, ZA", workMode: "On-site", closingDate: daysFromNow(2), dateApplied: daysFromNow(-10), status: "Assessment Invited", priority: "High", tags: ["graduate", "finance"], requiredDocs: docTemplate(), attachments: [], matchScore: 7, createdAt: daysFromNow(-12), updatedAt: daysFromNow(-2) },
  { id: "a3", title: "Bioinformatics Internship", companyId: "c3", type: "Internship", industry: "Healthcare", location: "Pretoria, ZA", workMode: "On-site", closingDate: daysFromNow(12), dateApplied: daysFromNow(-7), status: "Applied", priority: "Medium", tags: ["internship", "science"], requiredDocs: docTemplate(), attachments: [], matchScore: 8, createdAt: daysFromNow(-8), updatedAt: daysFromNow(-7) },
  { id: "a4", title: "STEM Bursary 2026", companyId: "c4", type: "Bursary", industry: "Non-profit", location: "South Africa", workMode: "Remote", closingDate: daysFromNow(20), status: "Preparing", priority: "High", tags: ["bursary", "funding"], requiredDocs: docTemplate(), attachments: [], matchScore: 8, createdAt: daysFromNow(-3), updatedAt: daysFromNow(-1) },
  { id: "a5", title: "Senior Cloud Engineer", companyId: "c5", type: "Job", industry: "Tech / Cloud", location: "Remote", workMode: "Remote", closingDate: daysFromNow(30), dateApplied: daysFromNow(-21), salary: "$110k – $140k", status: "Offer Received", priority: "Critical", notes: "Offer pending written contract.", tags: ["dream", "remote", "tech"], requiredDocs: docTemplate(), attachments: [], matchScore: 10, createdAt: daysFromNow(-30), updatedAt: daysFromNow(-1) },
  { id: "a6", title: "Wind Farm Analyst", companyId: "c6", type: "Job", industry: "Energy", location: "Sandton, ZA", workMode: "Hybrid", closingDate: daysFromNow(-2), dateApplied: daysFromNow(-28), status: "Waiting for Feedback", priority: "Medium", tags: ["urgent", "energy"], requiredDocs: docTemplate(), followUpDate: daysFromNow(0), attachments: [], matchScore: 6, createdAt: daysFromNow(-30), updatedAt: daysFromNow(-28) },
  { id: "a7", title: "Brand Designer", companyId: "c7", type: "Job", industry: "Design", location: "Cape Town, ZA", workMode: "Hybrid", closingDate: daysFromNow(8), dateApplied: daysFromNow(-12), status: "Application Viewed", priority: "Medium", tags: ["design", "creative"], requiredDocs: docTemplate(), followUpDate: daysFromNow(0), attachments: [], matchScore: 7, createdAt: daysFromNow(-13), updatedAt: daysFromNow(-3) },
  { id: "a8", title: "Robotics Learnership", companyId: "c8", type: "Learnership", industry: "Robotics", location: "Stellenbosch, ZA", workMode: "On-site", closingDate: daysFromNow(45), status: "Saved", priority: "Low", tags: ["learnership", "robotics"], requiredDocs: docTemplate(), attachments: [], matchScore: 6, wishlist: true, createdAt: daysFromNow(-1), updatedAt: daysFromNow(-1) },
  { id: "a9", title: "Postgraduate Scholarship", companyId: "c9", type: "Scholarship", industry: "Education", location: "Cape Town, ZA", workMode: "On-site", closingDate: daysFromNow(6), dateApplied: daysFromNow(-5), status: "Applied", priority: "High", tags: ["scholarship", "postgrad"], requiredDocs: docTemplate(), attachments: [], matchScore: 9, createdAt: daysFromNow(-6), updatedAt: daysFromNow(-5) },
  { id: "a10", title: "Junior Producer", companyId: "c10", type: "Job", industry: "Media", location: "Johannesburg, ZA", workMode: "On-site", closingDate: daysFromNow(-15), dateApplied: daysFromNow(-40), status: "Rejected", priority: "Low", tags: ["media"], requiredDocs: docTemplate(), attachments: [], matchScore: 5, createdAt: daysFromNow(-42), updatedAt: daysFromNow(-12) },
  { id: "a11", title: "Mentorship Volunteer", companyId: "c4", type: "Volunteer", industry: "Non-profit", location: "Durban, ZA", workMode: "Hybrid", closingDate: daysFromNow(14), status: "Saved", priority: "Low", tags: ["volunteer"], requiredDocs: docTemplate(), attachments: [], matchScore: 7, wishlist: true, createdAt: daysFromNow(-2), updatedAt: daysFromNow(-2) },
  { id: "a12", title: "Software Engineering Internship", companyId: "c1", type: "Internship", industry: "Tech / AI", location: "Cape Town, ZA", workMode: "Hybrid", closingDate: daysFromNow(3), dateApplied: daysFromNow(-9), status: "Interview Completed", priority: "High", tags: ["internship", "tech"], requiredDocs: docTemplate(), attachments: [], matchScore: 8, createdAt: daysFromNow(-11), updatedAt: daysFromNow(-2) },
  { id: "a13", title: "Data Science Training", companyId: "c8", type: "Training Programme", industry: "Robotics", location: "Stellenbosch, ZA", workMode: "Hybrid", closingDate: daysFromNow(25), status: "Preparing", priority: "Medium", tags: ["training", "data"], requiredDocs: docTemplate(), attachments: [], matchScore: 7, createdAt: daysFromNow(-4), updatedAt: daysFromNow(-1) },
  { id: "a14", title: "UX Research Internship", companyId: "c7", type: "Internship", industry: "Design", location: "Cape Town, ZA", workMode: "Remote", closingDate: daysFromNow(-30), status: "Expired", priority: "Low", tags: ["ux"], requiredDocs: docTemplate(), attachments: [], matchScore: 6, wishlist: true, createdAt: daysFromNow(-60), updatedAt: daysFromNow(-30) },
  { id: "a15", title: "Cybersecurity Analyst", companyId: "c2", type: "Job", industry: "Finance", location: "Johannesburg, ZA", workMode: "Hybrid", closingDate: daysFromNow(10), dateApplied: daysFromNow(-4), status: "Application Viewed", priority: "High", tags: ["security", "finance"], requiredDocs: docTemplate(), attachments: [], matchScore: 8, createdAt: daysFromNow(-5), updatedAt: daysFromNow(-2) },
];

const seedInterviews: Interview[] = [
  { id: "i1", applicationId: "a1", companyId: "c1", role: "AI Research Engineer", type: "Online", datetime: daysFromNow(2), interviewer: "Lerato M.", link: "https://meet.example/aurora", prep: [{ task: "Review transformers", done: true }, { task: "Prepare 3 STAR stories", done: false }, { task: "Research the team", done: true }], questionsToAsk: ["What does success look like in 6 months?", "How does the team measure research impact?"], expectedQuestions: ["Walk me through a recent project.", "How do you handle ambiguous problems?"], starNotes: "Project X — situation, task, action, result." },
  { id: "i2", applicationId: "a12", companyId: "c1", role: "SWE Intern", type: "Panel", datetime: daysFromNow(-5), interviewer: "Tech Panel", prep: [{ task: "System design refresh", done: true }], questionsToAsk: [], expectedQuestions: [], reflection: "Felt good. Stumbled on one DSA question.", thankYouSent: true },
  { id: "i3", applicationId: "a2", companyId: "c2", role: "Graduate Assessment", type: "Assessment", datetime: daysFromNow(1), prep: [{ task: "Numerical reasoning practice", done: false }], questionsToAsk: [], expectedQuestions: [] },
  { id: "i4", applicationId: "a5", companyId: "c5", role: "Senior Cloud Engineer (Final)", type: "Online", datetime: daysFromNow(4), interviewer: "Jordan P.", link: "https://meet.example/quantum", prep: [{ task: "Review system design notes", done: true }, { task: "Salary research", done: true }], questionsToAsk: ["What is the on-call rotation?"], expectedQuestions: ["Tell us about a large-scale migration."] },
  { id: "i5", applicationId: "a7", companyId: "c7", role: "Brand Designer Chat", type: "Phone", datetime: daysFromNow(-12), prep: [], questionsToAsk: [], expectedQuestions: [], reflection: "Good rapport with hiring manager." },
];

const seedTasks: Task[] = [
  { id: "t1", name: "Follow up with Aurora Labs", applicationId: "a1", dueDate: daysFromNow(1), priority: "High", done: false },
  { id: "t2", name: "Submit Northwind assessment", applicationId: "a2", dueDate: daysFromNow(0), priority: "Critical", done: false },
  { id: "t3", name: "Finalise bursary motivation letter", applicationId: "a4", dueDate: daysFromNow(3), priority: "High", done: false },
  { id: "t4", name: "Update CV with new project", dueDate: daysFromNow(2), priority: "Medium", done: false },
  { id: "t5", name: "Send thank-you email — Aurora interview", applicationId: "a12", dueDate: daysFromNow(-3), priority: "Medium", done: true },
  { id: "t6", name: "Research Quantum Edge benefits package", applicationId: "a5", dueDate: daysFromNow(1), priority: "High", done: false },
  { id: "t7", name: "LinkedIn outreach to Naledi (Coral)", companyId: "c7", dueDate: daysFromNow(0), priority: "Medium", done: false },
  { id: "t8", name: "Apply to Cybersecurity Analyst role", applicationId: "a15", dueDate: daysFromNow(-1), priority: "High", done: true },
];

const seedDocs: DocItem[] = [
  { id: "d1", name: "CV — General 2026", category: "CV", updatedAt: daysFromNow(-2), version: 4, linkedApplicationIds: ["a1", "a5", "a9"] },
  { id: "d2", name: "CV — Tech focused", category: "CV", updatedAt: daysFromNow(-5), version: 2, linkedApplicationIds: ["a1", "a12"] },
  { id: "d3", name: "Cover Letter — Aurora Labs", category: "Cover Letter", updatedAt: daysFromNow(-14), version: 1, linkedApplicationIds: ["a1"] },
  { id: "d4", name: "Academic Transcript", category: "Transcript", updatedAt: daysFromNow(-60), version: 1, linkedApplicationIds: ["a2", "a9"] },
  { id: "d5", name: "ID Document", category: "ID", updatedAt: daysFromNow(-180), expiryDate: daysFromNow(720), version: 1, linkedApplicationIds: [] },
  { id: "d6", name: "Portfolio Link", category: "Portfolio", updatedAt: daysFromNow(-10), version: 3, linkedApplicationIds: ["a7"] },
  { id: "d7", name: "Reference — Prof. Khumalo", category: "Reference", updatedAt: daysFromNow(-30), version: 1, linkedApplicationIds: ["a9"] },
  { id: "d8", name: "Motivation Letter — Bursary", category: "Motivation", updatedAt: daysFromNow(-3), version: 2, linkedApplicationIds: ["a4"] },
];

const seedActivities: Activity[] = [
  { id: "ac1", type: "interview_scheduled", message: "Interview scheduled with Aurora Labs", applicationId: "a1", companyId: "c1", at: daysFromNow(-1) },
  { id: "ac2", type: "company_responded", message: "Quantum Edge extended a verbal offer", companyId: "c5", applicationId: "a5", at: daysFromNow(-1) },
  { id: "ac3", type: "status_changed", message: "Northwind Bank moved to Assessment Invited", applicationId: "a2", companyId: "c2", at: daysFromNow(-2) },
  { id: "ac4", type: "application_submitted", message: "Submitted application for Postgraduate Scholarship", applicationId: "a9", companyId: "c9", at: daysFromNow(-5) },
  { id: "ac5", type: "task_completed", message: "Sent thank-you email to Aurora Labs", at: daysFromNow(-3) },
  { id: "ac6", type: "document_uploaded", message: "Updated CV — General 2026 (v4)", at: daysFromNow(-2) },
  { id: "ac7", type: "note_added", message: "Added interview prep notes for Aurora", applicationId: "a1", at: daysFromNow(-1) },
  { id: "ac8", type: "application_created", message: "Saved Robotics Learnership to wishlist", applicationId: "a8", at: daysFromNow(-1) },
  { id: "ac9", type: "interview_completed", message: "Completed Aurora SWE Intern interview", applicationId: "a12", at: daysFromNow(-5) },
  { id: "ac10", type: "follow_up_sent", message: "Followed up with Coral Studios", companyId: "c7", at: daysFromNow(-4) },
];

const defaultProfile: UserProfile = {
  name: "Thando",
  email: "thando@example.com",
  interests: ["AI", "Cloud", "Product"],
  skills: ["TypeScript", "Python", "Public speaking"],
  qualifications: ["BSc Computer Science"],
  preferredLocations: ["Cape Town", "Remote"],
};

const defaultSettings: Settings = {
  weeklyGoal: 5,
  noResponseDays: 14,
  reminderLeadDays: [7, 3, 1, 0],
  theme: "dark",
};

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      applications: seedApplications,
      companies: seedCompanies,
      interviews: seedInterviews,
      tasks: seedTasks,
      documents: seedDocs,
      activities: seedActivities,
      profile: defaultProfile,
      settings: defaultSettings,
      recentItems: [
        { type: "application", id: "a1", label: "AI Research Engineer", at: daysFromNow(0) },
        { type: "company", id: "c5", label: "Quantum Edge", at: daysFromNow(-1) },
        { type: "document", id: "d1", label: "CV — General 2026", at: daysFromNow(-2) },
        { type: "application", id: "a5", label: "Senior Cloud Engineer", at: daysFromNow(-1) },
      ],

      addApplication: (a) => {
        const id = uid();
        const app: Application = { ...a, id, createdAt: now(), updatedAt: now() };
        set((s) => ({ applications: [app, ...s.applications] }));
        get().logActivity("application_created", `Added application: ${a.title}`, { applicationId: id, companyId: a.companyId });
        return id;
      },
      updateApplication: (id, patch) => {
        set((s) => ({
          applications: s.applications.map((a) =>
            a.id === id ? { ...a, ...patch, updatedAt: now() } : a,
          ),
        }));
        if (patch.status) {
          const app = get().applications.find((a) => a.id === id);
          get().logActivity("status_changed", `Status changed: ${app?.title} → ${patch.status}`, { applicationId: id });
        }
      },
      deleteApplication: (id) =>
        set((s) => ({ applications: s.applications.filter((a) => a.id !== id) })),

      addCompany: (c) => {
        const id = uid();
        set((s) => ({ companies: [{ ...c, id }, ...s.companies] }));
        get().logActivity("company_added", `Added company: ${c.name}`, { companyId: id });
        return id;
      },
      updateCompany: (id, patch) =>
        set((s) => ({ companies: s.companies.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
      deleteCompany: (id) =>
        set((s) => ({ companies: s.companies.filter((c) => c.id !== id) })),

      addInterview: (i) => {
        const id = uid();
        set((s) => ({ interviews: [{ ...i, id }, ...s.interviews] }));
        get().logActivity("interview_scheduled", `Scheduled ${i.type} interview for ${i.role}`, { applicationId: i.applicationId, companyId: i.companyId });
        return id;
      },
      updateInterview: (id, patch) =>
        set((s) => ({
          interviews: s.interviews.map((i) => (i.id === id ? { ...i, ...patch } : i)),
        })),
      deleteInterview: (id) =>
        set((s) => ({ interviews: s.interviews.filter((i) => i.id !== id) })),

      addTask: (t) => {
        const id = uid();
        set((s) => ({ tasks: [{ ...t, id }, ...s.tasks] }));
        get().logActivity("task_created", `Created task: ${t.name}`);
        return id;
      },
      updateTask: (id, patch) => {
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
        if (patch.done) {
          const task = get().tasks.find((t) => t.id === id);
          if (task) get().logActivity("task_completed", `Completed: ${task.name}`);
        }
      },
      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      addDocument: (d) => {
        const id = uid();
        set((s) => ({ documents: [{ ...d, id }, ...s.documents] }));
        get().logActivity("document_uploaded", `Uploaded document: ${d.name}`);
        return id;
      },
      updateDocument: (id, patch) =>
        set((s) => ({ documents: s.documents.map((d) => (d.id === id ? { ...d, ...patch } : d)) })),
      deleteDocument: (id) =>
        set((s) => ({ documents: s.documents.filter((d) => d.id !== id) })),

      logActivity: (type, message, ref) =>
        set((s) => ({
          activities: [{ id: uid(), type, message, at: now(), ...ref }, ...s.activities].slice(0, 500),
        })),
      touchRecent: (item) =>
        set((s) => ({
          recentItems: [{ ...item, at: now() }, ...s.recentItems.filter((r) => !(r.id === item.id && r.type === item.type))].slice(0, 8),
        })),

      updateProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),
      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      resetData: () =>
        set({
          applications: seedApplications,
          companies: seedCompanies,
          interviews: seedInterviews,
          tasks: seedTasks,
          documents: seedDocs,
          activities: seedActivities,
          profile: defaultProfile,
          settings: defaultSettings,
        }),
    }),
    { name: "career-command-store-v1" },
  ),
);

// ---------- Selectors / helpers ----------
export const getCompany = (id?: string) =>
  useStore.getState().companies.find((c) => c.id === id);

export function closingSoon(days = 7) {
  const cutoff = daysFromNow(days);
  return useStore
    .getState()
    .applications.filter(
      (a) =>
        a.closingDate <= cutoff &&
        a.closingDate >= now() &&
        !["Rejected", "Withdrawn", "Accepted", "Expired"].includes(a.status),
    )
    .sort((a, b) => a.closingDate.localeCompare(b.closingDate));
}

export function followUpsDue() {
  const today = new Date().toISOString().slice(0, 10);
  return useStore
    .getState()
    .applications.filter((a) => a.followUpDate && a.followUpDate.slice(0, 10) <= today);
}

export function recentResponses() {
  return useStore
    .getState()
    .companies.filter((c) => c.responded)
    .sort((a, b) => (b.lastContactDate ?? "").localeCompare(a.lastContactDate ?? ""));
}

export function upcomingInterviews() {
  return useStore
    .getState()
    .interviews.filter((i) => i.datetime >= now())
    .sort((a, b) => a.datetime.localeCompare(b.datetime));
}

export function pastInterviews() {
  return useStore
    .getState()
    .interviews.filter((i) => i.datetime < now())
    .sort((a, b) => b.datetime.localeCompare(a.datetime));
}

export function careerReadinessScore() {
  const s = useStore.getState();
  let score = 0;
  // profile completeness 30
  const p = s.profile;
  const pBits = [p.name, p.email, p.interests.length > 0, p.skills.length > 0, p.qualifications.length > 0, p.preferredLocations.length > 0];
  score += (pBits.filter(Boolean).length / pBits.length) * 30;
  // docs 25
  const docCats = new Set(s.documents.map((d) => d.category));
  const requiredCats: DocCategory[] = ["CV", "Cover Letter", "Transcript", "ID", "Reference"];
  score += (requiredCats.filter((c) => docCats.has(c)).length / requiredCats.length) * 25;
  // applications activity 20
  score += Math.min(20, s.applications.length * 1.5);
  // interviews prep 15
  const interviewsPrepped = s.interviews.filter((i) => i.prep.length > 0 && i.prep.every((p) => p.done)).length;
  score += Math.min(15, interviewsPrepped * 5);
  // follow-ups 10
  const completedTasks = s.tasks.filter((t) => t.done).length;
  score += Math.min(10, completedTasks * 2);
  return Math.round(score);
}

export function streakDays() {
  const days = new Set(
    useStore.getState().activities.map((a) => a.at.slice(0, 10)),
  );
  let streak = 0;
  const d = new Date();
  while (days.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak || 1;
}

export function weeklyProgress() {
  const goal = useStore.getState().settings.weeklyGoal;
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const count = useStore
    .getState()
    .applications.filter((a) => a.dateApplied && new Date(a.dateApplied) >= weekStart).length;
  return { count, goal };
}

export function bestChance() {
  return useStore
    .getState()
    .applications.filter((a) => a.matchScore >= 8 && !["Rejected", "Expired", "Withdrawn"].includes(a.status))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
}

export function missedOpportunities() {
  return useStore
    .getState()
    .applications.filter((a) => a.status === "Expired" || (a.status === "Saved" && a.closingDate < now()));
}

export function noResponseFlagged() {
  const days = useStore.getState().settings.noResponseDays;
  const cutoff = daysFromNow(-days);
  return useStore
    .getState()
    .applications.filter(
      (a) =>
        a.dateApplied &&
        a.dateApplied < cutoff &&
        ["Applied", "Application Viewed", "Waiting for Feedback"].includes(a.status),
    );
}

export const QUOTES = [
  "The future depends on what you do today. — Mahatma Gandhi",
  "Opportunities don't happen, you create them. — Chris Grosser",
  "Success is the sum of small efforts, repeated day-in and day-out. — Robert Collier",
  "Believe you can and you're halfway there. — Theodore Roosevelt",
  "Don't watch the clock; do what it does. Keep going. — Sam Levenson",
  "Your career is a marathon, not a sprint. Pace, persist, prevail.",
  "Small consistent actions compound into extraordinary careers.",
];

export function dailyQuote() {
  const day = new Date().getDate();
  return QUOTES[day % QUOTES.length];
}
