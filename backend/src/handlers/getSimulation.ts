import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TABLES } from "../utils/dynamo";
import { badRequest, notFound, ok, serverError } from "../utils/http";

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const simulationId = event.pathParameters?.id;
    if (!simulationId) return badRequest("Missing simulation id");

    const { Item } = await ddb.send(
      new GetCommand({ TableName: TABLES.SIMULATIONS, Key: { simulationId } })
    );

    if (!Item) return notFound(`No simulation found with id ${simulationId}`);
    return ok(Item);
  } catch (err) {
    console.error(err);
    return serverError();
  }
}