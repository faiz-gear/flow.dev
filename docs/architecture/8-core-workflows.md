# 8. Core Workflows

## User Onboarding & GitHub Connection

This workflow covers the sequence from user sign-up to successfully connecting their GitHub account via OAuth.

```mermaid
sequenceDiagram
    participant User
    participant Next.js App
    participant Supabase
    participant GitHub
    User->>Next.js App: Visits site and signs up
    Next.js App->>Supabase: Creates user account
    Next.js App-->>User: Redirects to dashboard
    User->>Next.js App: Clicks "Connect GitHub"
    Next.js App-->>User: Redirects to GitHub OAuth
    User->>GitHub: Authorizes application
    GitHub-->>User: Redirects to callback API
    User->>Next.js App: Hits callback, code is exchanged for token
    Next.js App->>Supabase: Encrypts and saves token
    Next.js App-->>User: Redirects to dashboard
```

## Scheduled Data Collection & Analysis

This workflow shows the asynchronous backend pipeline for processing data.

```mermaid
sequenceDiagram
    participant Cron (Vercel)
    participant DataCollector (Function)
    participant Analyzer (Function)
    participant Supabase
    participant GitHub
    Cron->>DataCollector: Triggers daily job
    DataCollector->>Supabase: Get users
    loop for each user
        DataCollector->>GitHub: Fetch PR data
        DataCollector->>Supabase: Save raw PR data
    end
    DataCollector->>Analyzer: Triggers analysis
    Analyzer->>Supabase: Read raw data
    Analyzer->>Analyzer: Calculate metrics
    Analyzer->>Supabase: Save calculated metrics
```

-----
