import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { SimulationRecord, SimulationRequest } from "@f1-sim/shared";
import { runSimulation } from "../engine/simulationEngine";
import { ddb, TABLES } from "../utils/dynamo";
import { badRequest, ok, serverError } from "../utils/http";

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    if (!event.body) return badRequest("Missing request body");
    const request: SimulationRequest = JSON.parse(event.body);

    const result = runSimulation(request);

    const record: SimulationRecord = {
      simulationId: uuidv4(),
      userId: "anonymous", // no auth yet — see docs/architecture.md
      race: request.circuitId,
      driver: request.driverId,
      weather: request.weather,
      tyres: { starting: request.startingTyre, pitLap: request.pitLap, next: request.nextTyre },
      result,
      createdAt: new Date().toISOString(),
    };

    await ddb.send(new PutCommand({ TableName: TABLES.SIMULATIONS, Item: record }));

    return ok(record, 201);
  } catch (err) {
    if (err instanceof SyntaxError) return badRequest("Malformed JSON body");
    if (err instanceof Error && (err.message.startsWith("Unknown") || err.message.startsWith("pitLap"))) {
      return badRequest(err.message);
    }
    console.error(err);
    return serverError();
  }
}