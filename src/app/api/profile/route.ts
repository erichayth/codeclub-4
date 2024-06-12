import { NextRequest, NextResponse } from 'next/server';
import { KVNamespace } from '@cloudflare/workers-types';

// Define the runtime environment
export const runtime = 'edge';

// Declare the KV namespace
declare const codeclub_namespace: KVNamespace;

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}

async function handler(request: NextRequest) {
  // Get the 'UserID' from the request headers
  const userId = request.headers.get('userid');

  if (!userId) {
    return new NextResponse('UserID header is missing', { status: 400 });
  }

  // Fetch the value from the KV store
  const authToken = await codeclub_namespace.get(userId);

  if (!authToken) {
    return new NextResponse('Auth token not found for UserID', { status: 404 });
  }

  // Create a new headers object with the 'Auth-Token' header
  const modifiedHeaders: HeadersInit = new Headers(request.headers);
  modifiedHeaders.set('Auth-Token', authToken);

  // Forward the request to the specified URL
  const response = await fetch('https://orange.ent.haythnet.com/get', {
    method: request.method,
    headers: modifiedHeaders,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined,
  });

  // Send back the response from the forwarded request
  const responseBody = await response.text();
  return new NextResponse(responseBody, { status: response.status });
}
