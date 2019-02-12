const { App } = require("@aws-cdk/cdk");

const { BackendStack } = require("./stacks/BackendStack");
const { FrontendStack } = require("./stacks/FrontendStack");

// const STAGE = process.env.STAGE || "dev";

class MeetupApp extends App {
  constructor(argv) {
    super(argv);

    // initializing backend stack on the ireland region
    this.backendStack = new BackendStack(this, "backendStack", {
      env: { region: "eu-west-1" }
    });

    // initializing frontend stack on the N.virginia region
    this.frontendStack = new FrontendStack(this, "frontendStack", {
      env: { region: "us-east-1" }
    });
  }
}

const app = new MeetupApp();
app.run();
