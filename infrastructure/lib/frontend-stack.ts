import { RemovalPolicy, Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import { Bucket, BlockPublicAccess } from "aws-cdk-lib/aws-s3";
import {
  Distribution,
  ViewerProtocolPolicy,
  Function as CfFunction,
  FunctionCode,
  FunctionEventType,
} from "aws-cdk-lib/aws-cloudfront";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import * as path from "path";
import * as fs from "fs";

export class FrontendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const siteBucket = new Bucket(this, "SiteBucket", {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL, // CloudFront reaches it via OAC below, never directly
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const urlRewriteFunction = new CfFunction(this, "UrlRewriteFunction", {
      code: FunctionCode.fromFile({
        filePath: path.join(__dirname, "cloudfront-functions", "url-rewrite.js"),
      }),
    });

    const distribution = new Distribution(this, "SiteDistribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        functionAssociations: [
          { function: urlRewriteFunction, eventType: FunctionEventType.VIEWER_REQUEST },
        ],
      },
      // A genuinely missing page (not a rewrite miss) — Next's own generated 404 page.
      errorResponses: [
        { httpStatus: 403, responseHttpStatus: 404, responsePagePath: "/404.html" },
        { httpStatus: 404, responseHttpStatus: 404, responsePagePath: "/404.html" },
      ],
    });

    const frontendOutDir = path.join(__dirname, "..", "..", "frontend", "out");
    if (fs.existsSync(frontendOutDir)) {
      new BucketDeployment(this, "DeploySite", {
        sources: [Source.asset(frontendOutDir)],
        destinationBucket: siteBucket,
        distribution,
        distributionPaths: ["/*"], // invalidate CloudFront's cache on every deploy
      });
    }

    new CfnOutput(this, "DistributionDomainName", { value: distribution.distributionDomainName });
  }
}