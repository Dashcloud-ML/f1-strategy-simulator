import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TABLES } from "../utils/dynamo";
import { badRequest, ok, serverError } from "../utils/http";

const USER_INDEX_NAME = "userId-createdAt-index"; // matches the GSI from Step 9

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const userId = event.queryStringParameters?.userId;
    if (!userId) return badRequest("Missing required query parameter: userId");

    const { Items } = await ddb.send(
      new QueryCommand({
        TableName: TABLES.SIMULATIONS,
        IndexName: USER_INDEX_NAME,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: { ":userId": userId },
        ScanIndexForward: false, // false = descending, so most recent first
      })
    );

    return ok(Items ?? []);
  } catch (err) {
    console.error(err);
    return serverError();
  }
}