# "flow.dev" Product Requirements Document (PRD)

## Goals and Background Context

### Goals

* Enable engineering managers to make data-driven decisions regarding team performance and project health.
* Uncover and identify hidden bottlenecks within the development lifecycle, such as slow code reviews or excessive rework.
* Proactively mitigate project risks by delivering real-time, actionable alerts to team leads.
* Empower managers to effectively coach and improve their teams using concrete, objective data.
* Automate administrative work for developers by providing auto-generated summaries of their contributions.

### Background Context

Currently, many engineering leaders rely on subjective feedback and intuition to manage their teams, leading to several critical pain points. Hidden inefficiencies like slow code reviews remain unquantified, and project risks are often only discovered after they've caused significant delays. This reactive, "firefighting" approach is compounded by time-consuming and often biased manual status reporting.

"flow.dev" addresses this by integrating directly with a team's existing tools (e.g., GitHub, Jira) to passively analyze development signals. Its core AI engine will interpret metrics like PR Cycle Time and Ticket Flow Efficiency to generate actionable insights. These insights will be proactively delivered to managers through channels like email and Slack, shifting them from a reactive to a proactive management style without altering developer workflows.

### Change Log

| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| Sep 22, 2025 | 1.0 | Initial PRD draft based on Project Brief v1.0.0 | John (PM) |

---
## Requirements

### Functional

1.  **FR1**: The system must allow a user to connect their GitHub account via a secure OAuth flow.
2.  **FR2**: The system must provide a minimal user interface for a user to configure the recipient email address for reports.
3.  **FR3**: The system must passively collect pull request data from the user's connected GitHub repositories.
4.  **FR4**: The system must analyze the collected data to calculate the core metric: PR Cycle Time.
5.  **FR5**: The system must automatically generate and send a weekly insight report via email to the configured address.

### Non-Functional

1.  **NFR1**: All connections to external services (i.e., GitHub) must be strictly limited to read-only permissions.
2.  **NFR2**: The data collection process must not require any changes to a developer's standard workflow.
3.  **NFR3**: All sensitive data, including authentication tokens and user information, must be stored securely, following industry best practices.
4.  **NFR4**: The onboarding and configuration process should be completable by a first-time user in under 5 minutes.

---
## User Interface Design Goals

### Overall UX Vision

The user experience for flow.dev's interface will be **clean, direct, and professional**. The primary goal is to enable a new user to connect their tools and start receiving value with the least possible friction. The design should prioritize clarity and efficiency over aesthetic complexity.

### Key Interaction Paradigms

For the MVP, interactions will be based on standard, universally understood web patterns. This includes simple form inputs, clear button actions (e.g., "Connect GitHub," "Save Configuration"), and straightforward navigation. There will be no complex or novel interaction models to learn.

### Core Screens and Views

1.  **Onboarding & Configuration Screen**: A single, primary screen where users can authenticate with GitHub and input their configuration details (e.g., recipient email). This screen will provide clear feedback on the connection status.
2.  **Dashboard/Status Screen**: A simple landing page users see after successfully configuring their account. For the MVP, this may simply confirm that the setup is complete and that they will receive their first report on the next cycle.

### Accessibility: WCAG AA

The interface will be designed to meet WCAG 2.1 AA standards to ensure it is usable by people with a wide range of disabilities.

### Branding

Branding elements (logo, color palette, typography) are to be determined. The initial implementation will use a minimalist, neutral design palette that can be easily updated with official brand assets later.

#### Target Device and Platforms: Web Responsive

The configuration interface will be a responsive web application, ensuring a seamless experience on both desktop and mobile browsers.

---
## Technical Assumptions

### Repository Structure: Monorepo

The project will be housed in a single monorepo.

* **Rationale**: For an MVP with a small, focused team, a monorepo simplifies dependency management and allows for easy sharing of code and types between the frontend UI and any backend services (e.g., sharing data models), which significantly increases development velocity.

#### Service Architecture: Serverless

The application will be built using a serverless architecture.

* **Rationale**: This approach minimizes operational overhead and infrastructure management, allowing the team to focus on feature development. It is cost-effective (pay-per-use) and scales automatically, which is ideal for a new product with unpredictable load. The passive, scheduled nature of the core analysis task is a perfect fit for a serverless function (cron job).

#### Testing Requirements: Unit + Integration

The testing strategy will focus on a combination of unit tests and integration tests.

* **Rationale**: This provides a strong balance for an MVP. Unit tests will ensure individual components and functions are correct, while integration tests will verify that critical workflows, like connecting to the GitHub API and running the analysis engine, work end-to-end. A full end-to-end (E2E) test suite is deferred post-MVP to maintain development speed.

#### Additional Technical Assumptions and Requests

* **Core Technology Stack**: We will use a modern, TypeScript-first stack: **Next.js** for the framework and **Tailwind CSS** for styling.
* **Deployment Target**: The application will be deployed to **Vercel**.
* **Database & Auth**: The project will use **Supabase** (PostgreSQL), specifically leveraging the **`@supabase/ssr`** library for server-side rendering integration.
* **Database Toolkit**: Database interactions will be managed using **Drizzle ORM**.
* **UI Animation**: Animations and micro-interactions will be implemented using **Framer Motion**.
* **UI Component Library**: The project will use the **HeroUI** library for pre-built React components.

---
## Epic List

1.  **Epic 1: Foundation & User Onboarding**
    * **Goal**: Establish the core application infrastructure and allow a user to connect their GitHub account and configure their settings for receiving reports.
2.  **Epic 2: Core Data Pipeline & Insight Delivery**
    * **Goal**: Implement the backend data collection, analysis of PR Cycle Time, and delivery of the first automated weekly email report.

---
### Epic 1: Foundation & User Onboarding

**Epic Goal**: The goal of this epic is to create the foundational scaffolding for the `flow.dev` application and deliver the complete user onboarding experience. Upon completion, a new user will be able to visit the web application, sign up, securely connect their GitHub account via OAuth, and configure their settings for receiving reports. This epic establishes the technical backbone and the first critical user-facing workflow.

---
#### Story 1.1: Project Scaffolding & Initial Setup
**As a** Developer,
**I want** a new Next.js project initialized with the specified tech stack and deployed to Vercel,
**so that** I have a stable foundation to build features upon.

**Acceptance Criteria:**
1.  A new Next.js monorepo is created and pushed to a Git repository.
2.  All specified dependencies (`@supabase/ssr`, Drizzle, HeroUI, Framer Motion) are installed and configured.
3.  The project is successfully connected and deployed to a Vercel project.
4.  The default Vercel deployment URL loads a simple, placeholder "Welcome to flow.dev" page.

---
#### Story 1.2: User Sign-up & Database Integration
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
#### Story 1.3: GitHub OAuth Connection
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
#### Story 1.4: Report Configuration
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
### Epic 2: Core Data Pipeline & Insight Delivery

**Epic Goal**: This epic focuses on activating the core value proposition of `flow.dev`. It will build the backend data pipeline to collect and analyze GitHub data from connected users, and then deliver the first key insight—PR Cycle Time—via an automated weekly email report. Upon completion, the system will be fully operational in its MVP state, providing tangible value to onboarded users without any manual intervention.

---
#### Story 2.1: GitHub Data Collector
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
#### Story 2.2: PR Cycle Time Analyzer
**As a** System,
**I want** to process the collected raw PR data to calculate the PR Cycle Time metric,
**so that** I can generate meaningful insights.

**Acceptance Criteria:**
1.  A new service/function reads the raw PR data stored from the previous story.
2.  It calculates the total PR Cycle Time (e.g., time from first commit to merge) for each pull request.
3.  The calculated metric is stored in an "analyzed_metrics" table in the database, linked back to the raw PR data.
4.  The analysis logic is covered by unit tests that handle various edge cases (e.g., open PRs, abandoned PRs).

---
#### Story 2.3: Weekly Report Generator
**As a** System,
**I want** to generate a weekly insight report for each user based on their PR Cycle Time data,
**so that** I can prepare the content for email delivery.

**Acceptance Criteria:**
1.  A new scheduled serverless function (cron job) is created that runs once per week.
2.  For each user, the function queries their analyzed PR Cycle Time data from the past week.
3.  It generates a simple summary (e.g., median cycle time, number of PRs merged, longest-running PR).
4.  The summary is formatted into a clean HTML structure suitable for an email body.

---
#### Story 2.4: Email Delivery Service
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
## Checklist Results Report

### Executive Summary

* **Overall PRD Completeness**: 95%+
* **MVP Scope Appropriateness**: Just Right
* **Readiness for Architecture Phase**: Ready
* **Critical Gaps or Concerns**: None identified. The PRD is robust, well-aligned with the project brief, and provides a clear, actionable plan for the "Lean MVP".