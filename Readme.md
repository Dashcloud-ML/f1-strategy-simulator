# F1 Strategy Simulator

![CI/CD](https://github.com/Dashcloud-ML/f1-strategy-simulator/actions/workflows/ci.yml/badge.svg)

Simulate a Formula 1 race strategy — circuit, driver, weather, starting tyre, and one pit stop —
and see the estimated result: finishing position, total race time, a lap-by-lap time chart, and
a tyre wear graph.

**Live:** [d1m3730ivprv7l.cloudfront.net](https://d1m3730ivprv7l.cloudfront.net)

## Features

- Pick a circuit and driver
- Choose weather conditions and starting tyre compound
- Set a single pit stop lap and next compound
- Run a simulation against a custom strategy engine
- View results as an interactive lap-time chart and tyre-wear chart (Recharts)
- Browse past simulations in History, and reopen any of them

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS v4, Recharts |
| Backend | AWS Lambda, API Gateway (REST) |
| Database | DynamoDB (on-demand billing) |
| Hosting | S3 + CloudFront (static export, CloudFront Function for URL rewriting) |
| Infrastructure | AWS CDK (TypeScript) |
| CI/CD | GitHub Actions, OIDC-based deploy (no long-lived AWS keys) |

## Architecture

Browser → CloudFront → S3 (static Next.js export)
Browser → API Gateway → Lambda (per-endpoint handlers) → DynamoDB

Three CDK stacks, deployed independently but chained by dependency:
- **`F1Sim-Database`** — `Users` and `Simulations` tables, with a `userId-createdAt-index` GSI powering history lookups
- **`F1Sim-Backend`** — one Lambda per REST endpoint, fronted by API Gateway
- **`F1Sim-Frontend`** — S3 bucket (private, via Origin Access Control) + CloudFront distribution + a CloudFront Function that rewrites clean URLs (`/results`) to their static file (`/results/index.html`)

## API

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/circuits` | List available circuits |
| `GET` | `/drivers` | List available drivers |
| `GET` | `/weather-options` | List weather conditions and tyre compounds |
| `POST` | `/simulate` | Run the strategy engine, persist and return the result |
| `GET` | `/simulation/{id}` | Fetch one saved simulation |
| `GET` | `/history?userId=` | List a user's past simulations, most recent first |

## Project structure

frontend/ Next.js app (App Router)
backend/ Lambda handlers + strategy engine
infrastructure/ AWS CDK stacks (database, backend, frontend)
shared/ TypeScript types + reference data, shared across frontend and backend
docs/ Project vision and AWS setup notes
.github/workflows CI (build + test) and CD (OIDC-based deploy to AWS)

## Getting started

```bash
npm install
npm run build --workspace=shared   # shared types/data must be built first

npm run dev --workspace=frontend   # http://localhost:3000
npm run test --workspace=backend   # engine unit tests
```

Create `frontend/.env.local` from `frontend/.env.example` and point it at your own deployed API
(see below) to run the frontend against real data locally.

## Deploying

Requires an AWS account with the CLI configured (`aws configure`) and `cdk bootstrap` run once per
account/region.

```bash
npm run build --workspace=shared
npm run build --workspace=frontend
cd infrastructure
npx cdk deploy --all
```

Copy the API Gateway URL from the deploy output into `frontend/.env.local` as
`NEXT_PUBLIC_API_BASE_URL`, rebuild the frontend, and redeploy so the static export points at the
live API.

Pushing to `main` deploys automatically via GitHub Actions (OIDC — see `.github/workflows/ci.yml`).

To tear everything down and stop any AWS charges between sessions:
```bash
npx cdk destroy --all
```

## Known limitations

- **Single-car simulation** — the engine models one car's pace in isolation; `finishingPosition`
  is always `1`. Modeling a full grid with overtaking (using each circuit's
  `overtakingDifficulty`) is the main planned addition.
- **No authentication** — every simulation is saved under a hardcoded `"anonymous"` user, so
  History shows everyone's runs. Optional per your original plan; not yet built.
- **Tuning is approximate** — tyre degradation and weather modifiers are reasoned estimates, not
  real telemetry.

## Docs

- [`docs/vision.md`](./docs/vision.md) — original project plan
- [`docs/aws-setup.md`](./docs/aws-setup.md) — AWS account/IAM setup notes