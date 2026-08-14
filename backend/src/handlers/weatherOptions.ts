import { APIGatewayProxyResult } from "aws-lambda";
import { TYRE_OPTIONS, WEATHER_OPTIONS } from "@f1-sim/shared";
import { ok } from "../utils/http";

export async function handler(): Promise<APIGatewayProxyResult> {
  return ok({ weather: WEATHER_OPTIONS, tyres: TYRE_OPTIONS });
}