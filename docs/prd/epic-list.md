# Epic List

1.  **Epic 1: Foundation & User Onboarding**
    * **Goal**: Establish the core application infrastructure and allow a user to connect their GitHub account and configure their settings for receiving reports.
2.  **Epic 2: Core Data Pipeline & Insight Delivery**
    * **Goal**: Implement the backend data collection, analysis of PR Cycle Time, and delivery of the first automated weekly email report.

---
## Epic 1: Foundation & User Onboarding

**Epic Goal**: The goal of this epic is to create the foundational scaffolding for the `flow.dev` application and deliver the complete user onboarding experience. Upon completion, a new user will be able to visit the web application, sign up, securely connect their GitHub account via OAuth, and configure their settings for receiving reports. This epic establishes the technical backbone and the first critical user-facing workflow.

---
### Story 1.1: Project Scaffolding & Initial Setup
**As a** Developer,
**I want** a new Next.js project initialized with the specified tech stack and deployed to Vercel,
**so that** I have a stable foundation to build features upon.

**Acceptance Criteria:**
1.  A new Next.js monorepo is created and pushed to a Git repository.
2.  All specified dependencies (`@supabase/ssr`, Drizzle, HeroUI, Framer Motion) are installed and configured.
3.  The project is successfully connected and deployed to a Vercel project.
4.  The default Vercel deployment URL loads a simple, placeholder "Welcome to flow.dev" page.

---
### Story 1.2: User Sign-up & Database Integration
**As a** new User,
**I want** to sign up for the application using my email and password,
**so that** my user account is created and persisted.

**Acceptance Criteria:**
1.  A sign-up page is created using HeroUI components with fields for email and password.
2.  User input is validated on the client and server.
3.  Upon successful submission, a new user record is created in the Supabase `auth.users` table.
4.  The user is redirected to a placeholder dashboard page upon successful sign-up.
5.  Clear error messages are displayed for failed sign-up attempts (e.g., user already exists).

---
### Story 1.3: GitHub OAuth Connection
**As an** authenticated User,
**I want** to connect my GitHub account via a secure OAuth flow,
**so that** `flow.dev` can access my repository data.

**Acceptance Criteria:**
1.  The dashboard page displays a "Connect GitHub" button.
2.  Clicking the button initiates the standard GitHub OAuth2 flow, requesting **read-only** permissions.
3.  Upon successful authorization, the application securely stores the GitHub OAuth token associated with the user's account.
4.  The dashboard UI updates to show a "Connected" status for GitHub.
5.  The OAuth flow handles failure and cancellation gracefully, returning the user to the dashboard with an appropriate message.

---
### Story 1.4: Report Configuration
**As an** authenticated User with a connected GitHub account,
**I want** to configure the email address where my weekly reports will be sent,
**so that** I can ensure insights are delivered to the correct inbox.

**Acceptance Criteria:**
1.  The dashboard page displays a form to input a recipient email address.
2.  The email address field is pre-populated with the user's sign-up email by default.
3.  The user can change the email address and save the new configuration.
4.  The saved email address is securely stored and associated with the user's account.
5.  The UI provides clear feedback that the configuration has been saved successfully.

---
## Epic 2: Core Data Pipeline & Insight Delivery

**Epic Goal**: This epic focuses on activating the core value proposition of `flow.dev`. It will build the backend data pipeline to collect and analyze GitHub data from connected users, and then deliver the first key insight—PR Cycle Time—via an automated weekly email report. Upon completion, the system will be fully operational in its MVP state, providing tangible value to onboarded users without any manual intervention.

---
### Story 2.1: GitHub Data Collector
**As a** System,
**I want** to periodically fetch pull request data for all onboarded users using their stored GitHub tokens,
**so that** I have the raw data needed for analysis.

**Acceptance Criteria:**
1.  A scheduled serverless function (cron job) is created that runs on a recurring basis (e.g., daily).
2.  The function iterates through all users who have a valid, connected GitHub account.
3.  For each user, the function uses their stored GitHub token to fetch relevant pull request data.
4.  The raw PR data is stored in the Supabase database and associated with the user.
5.  The process includes robust error handling for issues like invalid tokens or API rate limits, and it logs its execution status.

---
### Story 2.2: PR Cycle Time Analyzer
**As a** System,
**I want** to process the collected raw PR data to calculate the PR Cycle Time metric,
**so that** I can generate meaningful insights.

**Acceptance Criteria:**
1.  A new service/function reads the raw PR data stored from the previous story.
2.  It calculates the total PR Cycle Time (e.g., time from first commit to merge) for each pull request.
3.  The calculated metric is stored in an "analyzed_metrics" table in the database, linked back to the raw PR data.
4.  The analysis logic is covered by unit tests that handle various edge cases (e.g., open PRs, abandoned PRs).

---
### Story 2.3: Weekly Report Generator
**As a** System,
**I want** to generate a weekly insight report for each user based on their PR Cycle Time data,
**so that** I can prepare the content for email delivery.

**Acceptance Criteria:**
1.  A new scheduled serverless function (cron job) is created that runs once per week.
2.  For each user, the function queries their analyzed PR Cycle Time data from the past week.
3.  It generates a simple summary (e.g., median cycle time, number of PRs merged, longest-running PR).
4.  The summary is formatted into a clean HTML structure suitable for an email body.

---
### Story 2.4: Email Delivery Service
**As a** System,
**I want** to send the generated weekly report to each user's configured email address,
**so that** they receive their proactive insights.

**Acceptance Criteria:**
1.  An email sending service (e.g., Resend, SendGrid) is integrated into the application.
2.  The weekly report function uses this service to send the generated HTML report.
3.  The email is sent to the recipient email address from the user's configuration (from Story 1.4).
4.  The email has a clear subject line (e.g., "Your Weekly flow.dev Insights") and a professional appearance.
5.  Email delivery status (success/failure) is logged.

---