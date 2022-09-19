import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import AWS from "aws-sdk";
import { v4 } from "uuid";

const docClient = new AWS.DynamoDB.DocumentClient();
const TableName = "WorkoutsTable";

const getWorkoutByID = async (id: string) => {
  const params = {
    TableName,
    Key: {
      id,
    },
  };

  const result = await docClient.get(params).promise();
  return result.Item;
};

export const createWorkout = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const reqBody = JSON.parse(event.body as string);

  const workout = {
    workoutID: v4(),
    ...reqBody,
  };

  docClient
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

  const output = getWorkoutByID(id!);

  if (output) {
    return {
      statusCode: 200,
      body: JSON.stringify(output),
    };
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Workout not found" }),
    };
  }
};

export const updateWorkout = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  const reqBody = JSON.parse(event.body as string);

  const workout = await getWorkoutByID(id!);

  if (workout) {
    await docClient
      .put({
        TableName: TableName,
        Item: {
          ...workout,
          ...reqBody,
        },
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ ...workout, ...reqBody }),
    };
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Workout not found" }),
    };
  }
};

export const deleteWorkout = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;

  const workout = await getWorkoutByID(id!);

  if (workout) {
    await docClient
      .delete({
        TableName: TableName,
        Key: {
          id,
        },
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Workout deleted" }),
    };
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Workout not found" }),
    };
  }
};

export const listWorkouts = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const result = await docClient.scan({ TableName }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
  };
};
