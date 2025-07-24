// functions/src/square-client.ts
import { Client } from "square";
import * as functions from "firebase-functions";

const { access_token } = functions.config().square;

const squareClient = new Client({
  accessToken: access_token,
  environment: "sandbox", // Use 'production' for live transactions
});

export { squareClient };