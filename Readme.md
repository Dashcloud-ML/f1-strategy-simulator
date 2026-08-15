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