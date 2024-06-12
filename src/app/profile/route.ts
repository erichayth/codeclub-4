import { KVNamespace } from '@cloudflare/workers-types';

declare const codeclub_namespace: KVNamespace;

export async function onRequest(context: { request: Request, next: () => Promise<Response> }) {
  const { request } = context;
  
  // Get the 'UserID' from the request headers
  const userId = request.headers.get('UserID');

  if (!userId) {
    return new Response('UserID header is missing', { status: 400 });
  }

  // Fetch the value from the KV store
  const authToken = await codeclub_namespace.get(userId);

  if (!authToken) {
    return new Response('Auth token not found for UserID', { status: 404 });
  }

  // Clone the request and add the 'Auth-Token' header
  const modifiedHeaders = new Headers(request.headers);
  modifiedHeaders.set('Auth-Token', authToken);

  const modifiedRequest = new Request('https://orange.ent.haythnet.com/get', {
    method: request.method,
    headers: modifiedHeaders,
    body: request.body,
  });

  // Fetch the modified request to the specified URL
  const response = await fetch(modifiedRequest);

  return response;
}
