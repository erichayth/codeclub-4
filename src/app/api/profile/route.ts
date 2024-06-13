import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

// Define the runtime environment
export const runtime = 'edge';

export interface Env {
  CODECLUB_NAMESPACE: KVNamespace;
}

// Helper function to get the environment context
function getEnv(): Env {
  const context = getRequestContext();
  if (!context.env || !('CODECLUB_NAMESPACE' in context.env)) {
    throw new Error('Environment does not have CODECLUB_NAMESPACE');
  }
  return context.env as Env;
}

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const env = getEnv();
    const userID = request.headers.get("UserID");

    if (!userID) {
      return new Response("UserID is missing", { status: 400 });
    }

    const value = await env.CODECLUB_NAMESPACE.get(userID);

    if (value === null) {
      return new Response("Value not found", { status: 404 });
    }

    return new Response(value);
  } catch (err) {
    console.error(`KV returned error: ${err}`);
    return new Response('Internal Server Error', { status: 500 });
  }
}
