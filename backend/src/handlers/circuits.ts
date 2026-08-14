import { APIGatewayProxyResult } from "aws-lambda";
import { CIRCUITS } from "@f1-sim/shared";
import { ok } from "../utils/http";

export async function handler(): Promise<APIGatewayProxyResult> {
  return ok(CIRCUITS);
}