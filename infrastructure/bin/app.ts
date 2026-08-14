#!/usr/bin/env node
import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { DatabaseStack } from "../lib/database-stack";

const app = new App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION ?? "us-east-1",
};

new DatabaseStack(app, "F1Sim-Database", { env });