import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

// Created once per Lambda execution context and reused across invocations
// that happen to run on the same warm instance — avoids reconnecting every call.
export const ddb = DynamoDBDocumentClient.from(client);

export const TABLES = {
  USERS: process.env.USERS_TABLE_NAME ?? "Users",
  SIMULATIONS: process.env.SIMULATIONS_TABLE_NAME ?? "Simulations",
};