import { NextApiRequest, NextApiResponse } from 'next';
import { KVNamespace } from '@cloudflare/workers-types';

// Declare the KV namespace
declare const codeclub_namespace: KVNamespace;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the 'UserID' from the request headers
  const userId = req.headers['userid'] as string;

  if (!userId) {
    res.status(400).json({ message: 'UserID header is missing' });
    return;
  }

  // Fetch the value from the KV store
  const authToken = await codeclub_namespace.get(userId);

  if (!authToken) {
    res.status(404).json({ message: 'Auth token not found for UserID' });
    return;
  }

  // Clone the request and add the 'Auth-Token' header
  const modifiedHeaders: HeadersInit = {
    ...req.headers,
    'Auth-Token': authToken,
  };

  // Forward the request to the specified URL
  const response = await fetch('https://orange.ent.haythnet.com/get', {
    method: req.method,
    headers: modifiedHeaders,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
  });

  // Send back the response from the forwarded request
  const responseBody = await response.text();
  res.status(response.status).send(responseBody);
}
