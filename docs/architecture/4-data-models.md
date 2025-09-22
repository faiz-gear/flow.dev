# 4. Data Models

These are the primary data entities required to operate "flow.dev".

## User Profile

  * **Purpose:** To store application-specific data related to a user, extending the built-in Supabase `auth.users` table.
  * **Relationships:** A one-to-one relationship with the `auth.users` table.
  * **TypeScript Interface:**
    ```typescript
    export interface UserProfile {
      id: string; // UUID
      updated_at: string; // ISO 8601 timestamp
      report_email: string | null;
    }
    ```

## Repository

  * **Purpose:** To store the specific GitHub repositories that a user has selected for analysis.
  * **Relationships:** A `User Profile` can have many `Repositories`.
  * **TypeScript Interface:**
    ```typescript
    export interface Repository {
      id: string; // UUID
      user_id: string; // UUID
      github_repo_id: number;
      name: string;
      is_active: boolean;
    }
    ```

## Pull Request

  * **Purpose:** To store the essential, raw data for each pull request fetched from the GitHub API.
  * **Relationships:** A `Repository` can have many `PullRequests`.
  * **TypeScript Interface:**
    ```typescript
    export interface PullRequest {
      id: string; // UUID
      repository_id: string; // UUID
      github_pr_id: number;
      pr_number: number;
      title: string;
      author_username: string;
      created_at_ts: string; // ISO 8601 timestamp
      merged_at_ts: string | null;
      first_commit_ts: string | null;
    }
    ```

## PR Metric

  * **Purpose:** To store the calculated metrics and analytical insights derived from the raw pull request data.
  * **Relationships:** Each `PullRequest` has one `PRMetric`.
  * **TypeScript Interface:**
    ```typescript
    export interface PRMetric {
      id: string; // UUID
      pull_request_id: string; // UUID
      cycle_time_seconds: number;
      analysis_version: number;
      calculated_at: string; // ISO 8601 timestamp
    }
    ```

-----
