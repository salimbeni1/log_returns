import { RestClient } from "ftx-api";

/*
  Demonstrations on basic REST API calls
*/
export default async function handler(req , res) {
  const key = '';
  const secret = '';

  const client = new RestClient(key, secret);

  const val = await client.getMarkets()
  console.log(val)
/*
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
*/
res.status(200).json({val})
}