# AWS Setup

- Region: us-east-1
- IAM user: f1-sim-dev (AdministratorAccess — solo dev account, revisit if this becomes a team project)
- Root account: MFA enabled, not used for daily work
- Billing: zero-spend budget alert configured

Credentials are stored locally via `aws configure` (~/.aws/credentials) — never committed to this repo.