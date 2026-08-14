import { APIGatewayProxyResult } from "aws-lambda";

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

export function ok(body: unknown, statusCode = 200): APIGatewayProxyResult {
  return { statusCode, headers: CORS_HEADERS, body: JSON.stringify(body) };
}

export function badRequest(message: string): APIGatewayProxyResult {
  return ok({ error: message }, 400);
}

export function notFound(message = "Not found"): APIGatewayProxyResult {
  return ok({ error: message }, 404);
}

export function serverError(message = "Internal server error"): APIGatewayProxyResult {
  return ok({ error: message }, 500);
}