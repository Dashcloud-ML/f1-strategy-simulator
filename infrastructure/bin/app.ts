#!/usr/bin/env node
import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { DatabaseStack } from "../lib/database-stack";
import { BackendStack } from "../lib/backend-stack";
import { FrontendStack } from "../lib/frontend-stack";

const app = new App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION ?? "us-east-1",
};

const databaseStack = new DatabaseStack(app, "F1Sim-Database", { env });

new BackendStack(app, "F1Sim-Backend", {
  env,
  usersTable: databaseStack.usersTable,
  simulationsTable: databaseStack.simulationsTable,
});

new FrontendStack(app, "F1Sim-Frontend", { env });