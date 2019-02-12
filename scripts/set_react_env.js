const AWS = require("aws-sdk");

const credentials = new AWS.SharedIniFileCredentials({ profile: "farmin" });
AWS.config.credentials = credentials;

const log = (...args) => console.error("* _set-react-app-env.js:\t", ...args);

const ssm = new AWS.SSM({
  region: "eu-west-1"
});

const getAPIParam = ssm
  .getParameter({
    Name: "/api/storetime"
  })
  .promise();

const makeExportable = data => {
  const v = `REACT_APP_API_ROOT=${data.Parameter.Value}`;
  log(
    "\n",
    "The following ENV variables will be available in your CRA scripts:\n",
    `\t- process.env.REACT_APP_API_ROOT\n`,
    "\n"
  );
  return v;
};

getAPIParam
  .then(data => {
    console.log(makeExportable(data));
    process.exit(0);
  })
  .catch(e => {
    log("getSSM error", e);
    process.exit(1);
  });
