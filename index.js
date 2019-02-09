const { App } = require("@aws-cdk/cdk");

const { BackendStack } = require("./stacks/BackendStack");
const { FrontendStack } = require("./stacks/FrontendStack");

const STAGE = process.env.STAGE || "dev";

class MeetupApp extends App {
  constructor(argv) {
    super(argv);

    this.backendStack = new BackendStack(this, "backendStack", {
      env: { region: "eu-west-1" },
    });


    this.frontendStack = new FrontendStack(this, "frontendStack", {
      env: { region: "us-east-1" },
    });

  }
}

const app = new MeetupApp();
app.run();
