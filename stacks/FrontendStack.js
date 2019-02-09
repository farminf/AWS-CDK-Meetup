const cdk = require("@aws-cdk/cdk");


class FrontendStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

  }
}

module.exports = { FrontendStack };