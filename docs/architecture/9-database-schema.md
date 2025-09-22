# 9. Database Schema

This is the SQL DDL for the Supabase PostgreSQL database.

```sql
-- Stores application-specific user data.
CREATE TABLE app.user_profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    updated_at timestamptz DEFAULT now(),
    report_email text,
    github_token_encrypted text
);
ALTER TABLE app.user_profiles ENABLE ROW LEVEL SECURITY;

-- Stores repositories a user wants to monitor.
CREATE TABLE app.repositories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES app.user_profiles(id) ON DELETE CASCADE,
    github_repo_id bigint NOT NULL,
    name text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    UNIQUE (user_id, github_repo_id)
);
CREATE INDEX idx_repositories_user_id ON app.repositories(user_id);
ALTER TABLE app.repositories ENABLE ROW LEVEL SECURITY;

-- Stores raw data for each fetched pull request.
CREATE TABLE app.pull_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    repository_id uuid NOT NULL REFERENCES app.repositories(id) ON DELETE CASCADE,
    github_pr_id bigint NOT NULL,
    pr_number integer NOT NULL,
    title text,
    author_username text,
    created_at_ts timestamptz,
    merged_at_ts timestamptz,
    first_commit_ts timestamptz,
    raw_payload jsonb,
    UNIQUE (repository_id, github_pr_id)
);
CREATE INDEX idx_pull_requests_repository_id ON app.pull_requests(repository_id);
ALTER TABLE app.pull_requests ENABLE ROW LEVEL SECURITY;

-- Stores calculated insights for each pull request.
CREATE TABLE app.pr_metrics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    pull_request_id uuid NOT NULL UNIQUE REFERENCES app.pull_requests(id) ON DELETE CASCADE,
    cycle_time_seconds integer,
    analysis_version integer NOT NULL,
    calculated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_pr_metrics_pull_request_id ON app.pr_metrics(pull_request_id);
ALTER TABLE app.pr_metrics ENABLE ROW LEVEL SECURITY;
```

-----
