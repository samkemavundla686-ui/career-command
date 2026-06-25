# Career Command Centre

A premium, dark-themed career tracking app with deep black/charcoal surfaces, emerald accents, and a polished command-centre feel. Built as a client-side app with rich seeded sample data persisted to localStorage so every feature is immediately functional.

## Design system (src/styles.css)

- Dark-first theme as default. Background: near-black `oklch(0.14 0.01 160)`, surfaces in charcoal layers. Foreground in soft white/light grey.
- Emerald palette: `--primary` deep emerald, `--primary-glow` lighter emerald used for glows/gradients/rings. Green reserved for actions, success, progress, key stats.
- Tokens: `--gradient-emerald`, `--gradient-surface`, `--shadow-glow`, `--shadow-elegant`, `--ring-glow`.
- Typography: Space Grotesk (display) + Inter (body) loaded via `<link>` in `__root.tsx`.
- Shadcn components customised via variants (no hardcoded colors in JSX). Custom button variants: `emerald`, `glow`, `ghost-emerald`.
- Animations: fade-in, scale-in, glow-pulse, shimmer for loading; smooth 200–300ms transitions.

## Layout & navigation

- `__root.tsx`: SidebarProvider wraps app. Left sidebar (collapsible, icon mini variant) with 9 items: Dashboard, Applications, Calendar, Interviews, Companies, Documents, Analytics, Activity, Settings. Active route highlighted with emerald accent + glow.
- Top header strip with sidebar trigger, global search, streak chip, profile avatar.
- Floating AI assistant button (bottom-right, fixed) on every page — emerald gradient with glow-pulse. Opens a Sheet/Dialog pop-out chat panel.

## Data layer (`src/lib/store.ts`)

- Zustand store persisted to localStorage. Entities: applications, companies, interviews, tasks, documents, notes, activities, notifications, user profile, settings.
- Seed data: ~15 applications across all statuses/types, 10 companies, 8 interviews (past+upcoming), 12 tasks, 8 documents, 30+ activity entries, realistic dates spanning past 60 / future 30 days.
- CRUD helpers automatically write to activity log.
- Derived selectors: closingSoon, followUpsDue, recentResponses, upcomingInterviews, careerReadinessScore, streakDays, weeklyGoalProgress, bestChance, missedOpportunities.

## Routes & features

1. **Dashboard** (`/`): welcome + daily quote, Today's Focus, Closing Soon, Follow Up Today, Recent Responses, Upcoming Interviews, Quick Add buttons (application/interview/task open dialogs), Continue Where You Left Off, streak counter, weekly goal ring, career readiness score ring.
2. **Applications** (`/applications`): card / list / kanban view toggle. Filters (status, type, company, location, deadline, priority). Search. Add/edit dialog with all fields, required-docs checklist, tags, attachments. Duplicate warning. Application timeline drawer per card.
3. **Calendar** (`/calendar`): month grid with colour-coded events (deadlines, interviews, tasks, follow-ups). Day detail side panel. Task create dialog.
4. **Interviews** (`/interviews`): calendar + list, upcoming cards, past history, full interview detail with prep checklist, questions to ask/asked, STAR notes, reflection, thank-you reminder, readiness score.
5. **Companies** (`/companies`): CRM-style grid. Detail page (`/companies/$id`) with contacts, opportunities, response history, notes, interview history. "Companies that responded" highlighted section.
6. **Documents** (`/documents`): grid by category, version, expiry, linked applications. Readiness checklist.
7. **Analytics** (`/analytics`): Recharts — bar (apps/month, by type), doughnut (status, industry), line (response time trend), progress circles (success/response/interview/offer rates), heatmap (activity), goals progress.
8. **Activity** (`/activity`): searchable timeline grouped by day, filters by type/company/application/date.
9. **Settings** (`/settings`): profile (name, interests, skills, qualifications, preferred locations), notifications, reminder timing, weekly goal, theme toggle (dark default), export CSV/JSON.

## AI Assistant pop-out

- `<FloatingAssistant />` mounted in `__root.tsx`. Sheet opens from bottom-right with chat-style UI (AI Elements primitives where possible, otherwise custom).
- Name: "Career Command AI". Quick-action chips for the 9 prompts.
- Mock smart responses: reads live store data (e.g. "What should I do today?" → lists overdue tasks, closing-soon apps, today's interviews, due follow-ups). Pure local logic, no API call yet.
- Minimisable (collapses to floating button), easy close.

## Smart features layered in

- Application score (1–10 slider on form), wish list flag, duplicate detector, no-response auto-flag after configurable days, best-chance computed selector, missed-opportunity selector, tag system with chips, CSV/JSON export from Settings.

## Technical notes

- TanStack Start file-based routes; each route file with `head()` metadata.
- Reusable components in `src/components/`: `app-sidebar`, `floating-assistant`, `stat-card`, `progress-ring`, `application-card`, `application-form`, `kanban-board`, `activity-item`, `calendar-grid`, etc.
- Recharts for analytics, date-fns for date math, zustand+persist for state.
- All colours via semantic tokens; no hardcoded hex/tailwind colour utilities in components.

## Build order

1. Design tokens + fonts + sidebar shell + floating assistant skeleton + sample-data store.
2. Dashboard + Applications (with all 3 views + form).
3. Companies + Interviews + Calendar.
4. Documents + Analytics + Activity + Settings.
5. AI assistant smart responses + polish pass.
