import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import AWS from "aws-sdk";
import { v4 } from "uuid";

const docClient = new AWS.DynamoDB.DocumentClient();
const TableName = "WorkoutsTable";
export const createWorkout = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const reqBody = JSON.parse(event.body as string);

  const workout = {
    workoutID: v4(),
    ...reqBody,
  };

  await docClient
    .put({
      TableName: TableName,
      Item: workout,
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify(workout),
  };
};

export const getWorkout = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;

  const output = await docClient
    .get({
      TableName: TableName,
      Key: {
        workoutID: id,
      },
    })
    .promise();

  if (output.Item) {
    return {
      statusCode: 200,
      body: JSON.stringify(output.Item),
    };
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Workout not found" }),
    };
  }
};
