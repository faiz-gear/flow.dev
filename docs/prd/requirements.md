# Requirements

## Functional

1.  **FR1**: The system must allow a user to connect their GitHub account via a secure OAuth flow.
2.  **FR2**: The system must provide a minimal user interface for a user to configure the recipient email address for reports.
3.  **FR3**: The system must passively collect pull request data from the user's connected GitHub repositories.
4.  **FR4**: The system must analyze the collected data to calculate the core metric: PR Cycle Time.
5.  **FR5**: The system must automatically generate and send a weekly insight report via email to the configured address.

## Non-Functional

1.  **NFR1**: All connections to external services (i.e., GitHub) must be strictly limited to read-only permissions.
2.  **NFR2**: The data collection process must not require any changes to a developer's standard workflow.
3.  **NFR3**: All sensitive data, including authentication tokens and user information, must be stored securely, following industry best practices.
4.  **NFR4**: The onboarding and configuration process should be completable by a first-time user in under 5 minutes.

---