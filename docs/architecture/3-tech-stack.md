# 3. Tech Stack

The following table represents the **single source of truth** for all technologies used in the "flow.dev" project. The choices are derived directly from the PRD's technical assumptions and supplemented with industry-standard tooling to ensure a complete, modern, and maintainable stack. All development must adhere to these specific versions.

## Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js | 14.2.3 | Core application framework | PRD specified. Enables performant, server-rendered React applications with a great developer experience. |
| **Styling** | Tailwind CSS | 3.4.3 | CSS framework for styling | PRD specified. Provides a utility-first approach for rapid and consistent UI development. |
| **UI Components** | HeroUI | 2.1.1 | Pre-built React components | PRD specified. Accelerates UI development by providing a set of accessible components. |
| **UI Animation** | Framer Motion | 11.1.9 | Animation library for React | PRD specified. Offers a simple and powerful API for creating fluid animations and micro-interactions. |
| **Database & Auth** | Supabase (Postgres) | 1.165.0 | Backend-as-a-Service | PRD specified. Provides a scalable Postgres database, authentication, and serverless functions out-of-the-box. |
| **ORM / DB Toolkit** | Drizzle ORM | 0.30.10 | TypeScript ORM for SQL | PRD specified. A lightweight, type-safe ORM that integrates well with Supabase and TypeScript. |
| **Server-Side Auth** | @supabase/ssr | 0.3.0 | Server-side Supabase helper | PRD specified. Simplifies secure handling of user sessions in a server-rendered Next.js environment. |
| **Unit Testing** | Jest & RTL | 29.7.0 | Component/function testing | Fulfills PRD's unit testing requirement. Industry standard for testing React applications. |
| **Integration Testing**| Playwright | 1.44.0 | End-to-end browser testing | Fulfills PRD's integration testing requirement. Recommended by Vercel for robust, cross-browser testing. |
| **Email Service** | Resend | 3.2.0 | Transactional email API | Fulfills Story 2.4 requirement. Modern API designed for React/Next.js with seamless Vercel integration. |
| **Linting / Formatting**| ESLint & Prettier | 9.2.0 / 3.2.5 | Code quality and style | Essential for maintaining code consistency, especially with AI-driven development. |
| **Deployment & Hosting**| Vercel | N/A | Application platform | PRD specified. Native platform for Next.js, providing CI/CD, hosting, and serverless functions. |
| **CI/CD** | GitHub Actions | N/A | Workflow automation | Vercel's CI/CD is triggered via Git. GitHub Actions can be used for any additional required checks. |

-----
