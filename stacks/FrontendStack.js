/* eslint-disable no-new */
// const { execSync } = require("child_process");
const path = require("path");

const cdk = require("@aws-cdk/cdk");
const { CfnParameter } = require("@aws-cdk/aws-ssm");
const { Bucket } = require("@aws-cdk/aws-s3");
const { BucketDeployment, Source } = require("@aws-cdk/aws-s3-deployment");

class FrontendStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    this.addBucket();
    this.deployDashboard();

    this.exportToSSM(
      "dashboardUrl",
      "/website/storetime/url",
      this.dashboardBucket.bucketWebsiteUrl
    );
  }

  exportToSSM(name, parameterName, value) {
    new CfnParameter(this, `param${name}`, {
      type: "String",
      name: parameterName,
      value
    });
  }

  addBucket() {
    this.dashboardBucket = new Bucket(this, "dashboardBucket", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: true
    });
  }

  deployDashboard() {
    const sourcePath = path.resolve(__dirname, "..", "dashboard", "build");

    this.deployedDashboard = new BucketDeployment(this, "deployDashboard", {
      source: Source.asset(sourcePath),
      destinationBucket: this.dashboardBucket
    });
  }
}

module.exports = { FrontendStack };
