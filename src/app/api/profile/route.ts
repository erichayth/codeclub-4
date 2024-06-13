import { NextRequest, NextResponse } from 'next/server';

export interface Env {
  CODECLUB_NAMESPACE: KVNamespace;
}

// Define the runtime environment
export const runtime = 'edge';

export async function GET(request: NextRequest, env: Env) {
  return handler(request, env);
}

export async function POST(request: NextRequest, env: Env) {
  return handler(request, env);
}

async function handler(request: NextRequest, env: Env) {
  try {
    console.log('Received request:', request);

    // Get the 'UserID' from the request headers
    const userId = request.headers.get('UserID');
    console.log('UserID:', userId);

    if (!userId) {
      console.log('UserID header is missing');
      return new NextResponse('UserID header is missing', { status: 400 });
    }

    // Fetch the value from the KV store
    const authToken = await env.CODECLUB_NAMESPACE.get(userId);
    console.log('Auth token:', authToken);

    if (!authToken) {
      console.log('Auth token not found for UserID');
      return new NextResponse('Auth token not found for UserID', { status: 404 });
    }
    
    else {
      let newRequest = new NextRequest(request);
      newRequest.headers.set("Auth-Token", authToken);
      let authValue = newRequest.headers.get("Auth-Token");
      return new NextResponse('User token for UserID added to Auth-Token header', { status: 200});
      }

  } catch (error) {
    console.error('Error in handler:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}