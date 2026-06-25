Project Overview

Applying for jobs, bursaries, learnerships, and internships can become overwhelming when opportunities, closing dates, company responses, documents, interview details, and follow-ups are spread across emails, notes, websites, and spreadsheets.

SheMove Hub provides one central career command centre where users can:

Save and manage opportunities
Track applications from preparation to final outcome
Monitor closing dates and important deadlines
Keep records of companies and their responses
Schedule interviews, assessments, meetings, and follow-ups
Organise important documents such as CVs, certificates, and academic transcripts
View career statistics and progress through charts and graphs
Review complete activity history
Get guidance from the SheMove AI pop-out assistant
Problem It Solves

Many job seekers and students miss opportunities because they forget deadlines, lose track of applications, do not follow up with companies, or cannot find the correct documents when needed.

SheMove Hub solves this problem by bringing all career-related information into one organised platform. It helps users stay prepared, take action on time, and make confident career decisions.

Key Features
Dashboard
Personal welcome message
Daily motivational career quote
Today’s priorities and tasks
Closing soon alerts
Upcoming interviews and meetings
Companies that recently responded
Weekly goal tracker
Career activity streak
Career readiness score
Quick actions for adding applications, interviews, and tasks
Application Tracker
Track jobs, internships, bursaries, learnerships, scholarships, graduate programmes, and training opportunities
Add application title, company, link, deadline, location, salary or stipend, notes, and tags
Track application status from saved opportunity to final outcome
View applications in list, table, card, or Kanban board format
Filter applications by status, opportunity type, company, deadline, priority, and location
Search applications quickly
Add follow-up dates and reminders
View an application timeline and complete history
Company Relationship Tracker
Store company and institution information
Track opportunities linked to each company
Record company contacts and response history
View companies that responded
Track the last contact date and next follow-up date
Add notes about companies and interviews
Use relationship statuses such as researching, applied, responded, interviewing, offer received, rejected, and follow-up needed
Interviews and Meetings
Schedule phone, online, in-person, panel, and assessment interviews
Add interview dates, times, links, addresses, and interviewer details
Create interview preparation checklists
Store common interview questions and STAR answer notes
Add post-interview reflections
Set thank-you email and follow-up reminders
View upcoming and past interview history
Track interview readiness
Calendar, Tasks, and Reminders
View application deadlines
Track interviews, assessments, meetings, and follow-ups
Create personal career tasks
Set task priorities and due dates
Receive reminders for closing dates, missing documents, follow-ups, and interviews
View deadlines in calendar and list format
Documents Centre
Manage CV versions
Store cover letters
Track academic transcripts
Save certificates and ID documents
Store reference letters and motivation letters
Link documents to specific applications
Track document versions and expiry dates
Use a document readiness checklist before applying
Analytics and Progress
Total applications submitted
Applications by type and status
Application success rate
Company response rate
Interview rate
Offer rate
Rejection rate
Applications by company and industry
Weekly and monthly application progress
Career activity heatmap
Follow-up completion rate
Charts, graphs, progress circles, and statistics
Activity History
Track applications created and updated
Track status changes
Record company responses
Record interviews scheduled and completed
Record tasks completed
Record documents uploaded
Record notes and follow-ups
Search and filter activity by date, company, application, and activity type
SheMove AI

SheMove AI is a floating pop-out assistant available from any page in the application.

It can help users:

Plan today’s career tasks
Identify upcoming deadlines
Find applications that need follow-up
Prepare for interviews
Draft follow-up emails
Review recent activity
Identify companies that responded
Suggest the next best career action

If live AI integration is not available, the application includes the interface, quick prompts, and smart mock responses for future AI integration.

Design and Branding

SheMove Hub uses a premium, ambitious, and feminine visual identity.

Main colours: Black, charcoal, emerald green, and soft white
Accent colour: Subtle gold for achievements and milestones
Style: Modern, clean, professional, organised, and empowering
Responsive design: Works on desktop, tablet, and mobile devices
Theme: Dark mode is the default, with optional light mode in settings
Tools and Technologies Used

The list below should be updated to match the technologies generated in your final project.

React — Used to build the user interface with reusable components.
TypeScript — Used to make the application code more reliable and easier to maintain.
Vite — Used to create and run the front-end development environment.
Tailwind CSS — Used to style the application and create the green-and-black visual design.
shadcn/ui — Used for reusable user interface components such as buttons, cards, forms, dialogs, and menus.
Supabase — Used for authentication, database storage, and file management if connected.
PostgreSQL — Used as the database for applications, companies, interviews, tasks, documents, and activity history.
Recharts — Used to create charts and graphs for analytics.
Lucide React — Used for modern icons throughout the interface.
date-fns — Used to format and manage dates, deadlines, reminders, and calendar events.
Git and GitHub — Used for version control and storing the project repository.
Lovable AI — Used to help generate and develop the initial application structure and interface.
Project Structure

The exact folder structure may differ depending on the final version of the project.

shemove-hub/
│
├── public/                  # Static files such as images and icons
├── src/
│   ├── components/          # Reusable interface components
│   ├── pages/               # Main pages such as Dashboard and Applications
│   ├── hooks/               # Reusable logic and custom hooks
│   ├── lib/                 # Helper functions and configuration files
│   ├── integrations/        # Database and external service integrations
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
│
├── .env.example             # Example environment variable file
├── package.json             # Project dependencies and scripts
├── README.md                # Project documentation
└── vite.config.ts           # Vite configuration
Setup Instructions

Follow these steps to run SheMove Hub on your computer.

1. Clone the Repository
git clone https://github.com/your-username/shemove-hub.git
2. Open the Project Folder
cd shemove-hub

Open the folder in VS Code or your preferred code editor.

3. Install Dependencies
npm install
4. Create Environment Variables

If the project uses Supabase or another external service, create a .env file in the root folder of the project.

Example:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

Do not upload your .env file or secret keys to GitHub.

5. Start the Development Server
npm run dev
6. Open the Application

After running the command, the terminal will show a local link similar to:

http://localhost:5173

Open that link in your browser.

Supabase Setup

If Supabase is used in the project, follow these additional steps:

Create a project in Supabase.
Copy the project URL and anonymous key.
Add them to your .env file.
Create database tables for:
Users
Applications
Companies
Interviews
Tasks
Documents
Notes
Notifications
Activity History
Configure authentication if users need to create accounts and sign in.
Configure storage buckets if users need to upload CVs, certificates, or other documents.
How to Use SheMove Hub
Add an Application
Open the My Applications page.
Select Add Application.
Enter the opportunity title, company, type, deadline, application link, and other details.
Select a status such as Preparing or Applied.
Save the application.
Track a Company
Open the Companies page.
Add a new company or institution.
Add contact details, notes, website, industry, and location.
Link the company to one or more applications.
Update the company relationship status when the company responds.
Schedule an Interview
Open the Interviews and Meetings page.
Select Add Interview.
Add the company, role, date, time, meeting link or address, and interviewer details.
Add preparation tasks and reminders.
Save the interview.
Manage Documents
Open the Documents page.
Upload or link your CV, cover letter, transcript, certificate, ID document, or reference letter.
Add document details and version information.
Link documents to relevant applications.
View Analytics
Open the Analytics page.
View application totals, response rate, interview rate, offer rate, and progress charts.
Use the statistics to understand where to improve your application strategy.
Use SheMove AI
Click the floating SheMove AI button in the bottom-right corner.
Select a quick action or type a question.
Ask for help with deadlines, follow-ups, interview preparation, email drafting, or next actions.
Future Improvements

Possible future features include:

Live AI integration for SheMove AI
Email integration for sending and tracking follow-up emails
Automatic opportunity discovery from trusted job boards
Push notifications and email reminders
CV scoring and improvement suggestions
Cover-letter generation
Mentor and career-coach collaboration
Native Android and iOS mobile application
Advanced career recommendations
Application document templates
Multi-user accounts and secure cloud storage
Integration with calendar platforms
Screenshots

Add screenshots of the completed project below.

Dashboard

Add dashboard screenshot here

My Applications

Add applications page screenshot here

Company Tracker

Add company tracker screenshot here

Calendar and Deadlines

Add calendar screenshot here

Analytics

Add analytics screenshot here

SheMove AI

Add SheMove AI pop-out screenshot here

Author

Created by: Samukelisiwe Mavundla

License

This project is currently for educational and portfolio purposes.
