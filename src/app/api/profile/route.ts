import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

// Define the runtime environment
export const runtime = 'edge';

interface Env {
  CODECLUB_NAMESPACE: KVNamespace;
}

// Type guard to check if env has CODECLUB_NAMESPACE
function hasEnvNamespace(env: any): env is Env {
  return env && typeof env.CODECLUB_NAMESPACE !== 'undefined';
}

export async function GET(request: NextRequest): Promise<Response> {
  const context = getRequestContext();

  if (!hasEnvNamespace(context.env)) {
    throw new Error('Environment does not have CODECLUB_NAMESPACE');
  }

  const myKV = context.env.CODECLUB_NAMESPACE;
  const userID = request.headers.get("UserID");

  if (!userID) {
    return new Response("UserID is missing", { status: 404 });
  }

  const value = await myKV.get(userID);

  if (!value) {
    return new Response("UserID is not valid", { status: 404 });
  } else {
    const newRequest = new Request(request, {
      headers: new Headers(request.headers),
    });
    newRequest.headers.set("Auth-Token", value);
    const authValue = newRequest.headers.get("Auth-Token");
    console.log(authValue);
    return new Response(`User token for UserID: ${userID} added to Auth-Token header`, { status: 200 });
  }
}
