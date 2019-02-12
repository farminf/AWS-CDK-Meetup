/* eslint-disable no-new */
// const { execSync } = require("child_process");
const path = require("path");

const cdk = require("@aws-cdk/cdk");
const { Bucket } = require("@aws-cdk/aws-s3");
const { BucketDeployment, Source } = require("@aws-cdk/aws-s3-deployment");

class FrontendStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    this.addBucket();
    this.deployDashboard();

    new cdk.Output(this, "DashboardURL", {
      value: this.dashboardBucket.bucketWebsiteUrl
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
