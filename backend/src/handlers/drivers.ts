import { APIGatewayProxyResult } from "aws-lambda";
import { DRIVERS } from "@f1-sim/shared";
import { ok } from "../utils/http";

export async function handler(): Promise<APIGatewayProxyResult> {
  return ok(DRIVERS);
}