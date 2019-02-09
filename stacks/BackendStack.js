const cdk = require("@aws-cdk/cdk");


class BackendStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

  }
}


module.exports = { BackendStack };