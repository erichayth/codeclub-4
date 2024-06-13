import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

// Define the runtime environment
export const runtime = 'edge';

export interface Env {
  CODECLUB_NAMESPACE: KVNamespace;
}

// Type guard to check if env has CODECLUB_NAMESPACE
function hasEnvNamespace(env: any): env is Env {
  return env && typeof env.CODECLUB_NAMESPACE !== 'undefined';
}

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const context = getRequestContext();

    if (!hasEnvNamespace(context.env)) {
      throw new Error('Environment does not have CODECLUB_NAMESPACE');
    }

    const userID = request.headers.get("UserID");

    if (!userID) {
      return new Response("UserID is missing", { status: 400 });
    }

    const value = await context.env.CODECLUB_NAMESPACE.get(userID);

    if (value === null) {
      return new Response("Value not found", { status: 404 });
    }

    return new Response(value);
  } catch (err) {
    console.error(`KV returned error: ${err}`);
    return new Response('Internal Server Error', { status: 500 });
  }
}
