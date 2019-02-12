/* eslint-disable no-new-func */
/* eslint-disable no-new */
const cdk = require("@aws-cdk/cdk");
const { CfnParameter } = require("@aws-cdk/aws-ssm");
const { Function, Code, Runtime } = require("@aws-cdk/aws-lambda");
const { LambdaRestApi } = require("@aws-cdk/aws-apigateway");
const { Table, AttributeType } = require("@aws-cdk/aws-dynamodb");
const { Role, PolicyStatement, ServicePrincipal } = require("@aws-cdk/aws-iam");

class BackendStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    this.addTable();
    this.addLambda();
    this.addAPI();

    // Export the root url for api to use it in the dashboard while we build it
    this.exportToSSM("apiURL", "/api/storetime", this.api.url);
  }

  exportToSSM(name, parameterName, value) {
    new CfnParameter(this, `param${name}`, {
      type: "String",
      name: parameterName,
      value
    });
  }

  addTable() {
    this.timeTable = new Table(this, "timeTable", {
      partitionKey: { name: "timestamp", type: AttributeType.Number }
    });
  }

  addLambda() {
    this.createLambdaRole();
    this.storeTimeLambda = new Function(this, "storeTimeLambda", {
      runtime: Runtime.NodeJS810,
      handler: "index.handler",
      code: Code.asset("./functions/storeTime"),
      role: this.lambdaRole,
      environment: {
        TABLE_NAME: this.timeTable.tableName
      }
    });
  }

  createLambdaRole() {
    this.lambdaRole = new Role(this, "storeTimefunctionExecRole", {
      assumedBy: new ServicePrincipal([
        "dynamodb.amazonaws.com",
        "lambda.amazonaws.com"
      ])
    });
    this.lambdaRole.attachManagedPolicy(
      "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
    );
    const dynamoPolicy = new PolicyStatement();
    dynamoPolicy.allow();
    dynamoPolicy.addActions(["dynamodb:GetItem", "dynamodb:PutItem"]);
    dynamoPolicy.addResources([this.timeTable.tableArn]);

    this.lambdaRole.addToPolicy(dynamoPolicy);
  }

  addAPI() {
    this.api = new LambdaRestApi(this, "storeTimeAPI", {
      handler: this.storeTimeLambda
    });
  }
}

module.exports = { BackendStack };
