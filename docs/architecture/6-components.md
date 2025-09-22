# 6. Components

This section breaks down the application into its major logical components.

## Frontend Components

  * **AuthUI:** Manages the user authentication experience (sign-up, sign-in, etc.).
  * **GitHubConnector:** Provides the UI for initiating the GitHub OAuth connection.
  * **ConfigurationForm:** Allows users to update their report delivery settings.

## Backend Components (Serverless Functions)

  * **API Handler:** Exposes the user-facing REST API.
  * **GitHubDataCollector:** Scheduled function to fetch pull request data.
  * **PR-Analyzer:** Processes raw PR data to calculate metrics.
  * **ReportGenerator & Emailer:** Scheduled function to generate and send the weekly report.

## Core Services

  * **DatabaseClient:** Manages the database connection and provides the Drizzle ORM client.
  * **AuthManager:** Manages user sessions and authentication state using Supabase Auth.

-----
