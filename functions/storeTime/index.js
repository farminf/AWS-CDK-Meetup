const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async () => {
  const tableName = process.env.TABLE_NAME;

  const now = new Date();
  const timestamp = now.getTime();

  try {
    await dynamo
      .put({
        TableName: tableName,
        Item: { timestamp }
      })
      .promise();
    const response = {
      statusCode: 200,
      body: JSON.stringify("success"),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Access-Control-Allow-Origin": "*"
      }
    };
    return response;
  } catch (e) {
    const error = {
      statusCode: 500
    };
    return error;
  }
};
