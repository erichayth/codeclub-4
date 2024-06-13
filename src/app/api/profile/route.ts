import { NextRequest, NextResponse } from 'next/server';
import { KVNamespace } from '@cloudflare/workers-types';

// Declare the KV namespace
declare const codeclub_namespace: KVNamespace;

// Define the runtime environment
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}

async function handler(request: NextRequest) {
  try {
    console.log('Received request:', request);

    // Get the 'UserID' from the request headers
    const userId = request.headers.get('userid');
    console.log('UserID:', userId);

    if (!userId) {
      console.log('UserID header is missing');
      return new NextResponse('UserID header is missing', { status: 400 });
    }

    // Fetch the value from the KV store
    const authToken = await codeclub_namespace.get(userId);
    console.log('Auth token:', authToken);

    if (!authToken) {
      console.log('Auth token not found for UserID');
      return new NextResponse('Auth token not found for UserID', { status: 404 });
    }

    // Create a new headers object with the 'Auth-Token' header
    const modifiedHeaders: HeadersInit = new Headers(request.headers);
    modifiedHeaders.set('Auth-Token', authToken);

    console.log('Modified headers:', modifiedHeaders);

    // Create the fetch options
    const fetchOptions: RequestInit = {
      method: request.method,
      headers: modifiedHeaders,
    };

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      fetchOptions.body = await request.text();
      console.log('Request body:', fetchOptions.body);
    }

    console.log('Fetch options:', fetchOptions);

    // Forward the request to the specified URL
    const response = await fetch('https://orange.ent.haythnet.com/get', fetchOptions);
    console.log('Fetch response status:', response.status);

    // Send back the response from the forwarded request
    const responseBody = await response.text();
    console.log('Fetch response body:', responseBody);

    return new NextResponse(responseBody, { status: response.status });

  } catch (error) {
    console.error('Error in handler:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
