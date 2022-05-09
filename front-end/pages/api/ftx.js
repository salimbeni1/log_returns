import { RestClient } from "ftx-api";

/*
  Demonstrations on basic REST API calls
*/
export default function handler() {
  console.log("Connecting.");
(async () => {
  // Optional, but required for private endpoints
  const key = '';
  const secret = '';

  const client = new RestClient(key, secret);

  // Try some public API calls
  try {
    console.log('getMarkets: ', await client.getMarkets());
  } catch (e) {
    console.error('public get method failed: ', e);
  }

})()
}