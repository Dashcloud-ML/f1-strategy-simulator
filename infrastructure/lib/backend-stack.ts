import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { RestApi, LambdaIntegration, Cors } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import * as path from "path";

export interface BackendStackProps extends StackProps {
  usersTable: Table;
  simulationsTable: Table;
}

export class BackendStack extends Stack {
  public readonly api: RestApi;

  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    const handlersDir = path.join(__dirname, "..", "..", "backend", "src", "handlers");

    const sharedEnv = {
      USERS_TABLE_NAME: props.usersTable.tableName,
      SIMULATIONS_TABLE_NAME: props.simulationsTable.tableName,
    };

    const makeFunction = (name: string, entryFile: string) =>
      new NodejsFunction(this, name, {
        entry: path.join(handlersDir, entryFile),
        handler: "handler",
        runtime: Runtime.NODEJS_22_X,
        memorySize: 256,
        timeout: Duration.seconds(10),
        environment: sharedEnv,
      });

    const simulateFn = makeFunction("SimulateFunction", "simulate.ts");
    const circuitsFn = makeFunction("CircuitsFunction", "circuits.ts");
    const driversFn = makeFunction("DriversFunction", "drivers.ts");
    const weatherOptionsFn = makeFunction("WeatherOptionsFunction", "weatherOptions.ts");
    const getSimulationFn = makeFunction("GetSimulationFunction", "getSimulation.ts");
    const historyFn = makeFunction("HistoryFunction", "history.ts");

    props.simulationsTable.grantReadWriteData(simulateFn);
    props.simulationsTable.grantReadData(getSimulationFn);
    props.simulationsTable.grantReadData(historyFn);

    this.api = new RestApi(this, "F1StrategyApi", {
      restApiName: "f1-strategy-simulator-api",
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    });

    this.api.root.addResource("simulate").addMethod("POST", new LambdaIntegration(simulateFn));
    this.api.root.addResource("circuits").addMethod("GET", new LambdaIntegration(circuitsFn));
    this.api.root.addResource("drivers").addMethod("GET", new LambdaIntegration(driversFn));
    this.api.root.addResource("weather-options").addMethod("GET", new LambdaIntegration(weatherOptionsFn));
    this.api.root.addResource("history").addMethod("GET", new LambdaIntegration(historyFn));

    const simulationResource = this.api.root.addResource("simulation").addResource("{id}");
    simulationResource.addMethod("GET", new LambdaIntegration(getSimulationFn));
  }
}