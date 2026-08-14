import { Stack, StackProps, RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class DatabaseStack extends Stack {
  public readonly usersTable: Table;
  public readonly simulationsTable: Table;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.usersTable = new Table(this, "UsersTable", {
      tableName: "Users",
      partitionKey: { name: "userId", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.simulationsTable = new Table(this, "SimulationsTable", {
      tableName: "Simulations",
      partitionKey: { name: "simulationId", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Powers "list this user's past simulations, most recent first" —
    // without this index, DynamoDB could only fetch by simulationId.
    this.simulationsTable.addGlobalSecondaryIndex({
      indexName: "userId-createdAt-index",
      partitionKey: { name: "userId", type: AttributeType.STRING },
      sortKey: { name: "createdAt", type: AttributeType.STRING },
    });
  }
}