import { NextRequest, NextResponse } from 'next/server';

// Define the runtime environment
export const runtime = 'edge';

export interface Env {
  CODECLUB_NAMESPACE: KVNamespace;
}

// Middleware to inject environment variables
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const env: Env = {
    CODECLUB_NAMESPACE: (globalThis as any).CODECLUB_NAMESPACE as KVNamespace,
  };
  return handler(request, env);
}

async function handler(request: NextRequest, env: Env): Promise<NextResponse> {
  try {
    const userID = request.headers.get("UserID");

    if (!userID) {
      return new NextResponse("UserID is missing", { status: 400 });
    }

    const value = await env.CODECLUB_NAMESPACE.get(userID);

    if (value === null) {
      return new NextResponse("Value not found", { status: 404 });
    }

    return new NextResponse(value);
  } catch (err) {
    console.error(`KV returned error: ${err}`);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export const GET = middleware;
