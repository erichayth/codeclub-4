import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

// Define the runtime environment
export const runtime = 'edge';

interface Env {
  CODECLUB_NAMESPACE: KVNamespace;
}

export async function GET(request: NextRequest): Promise<Response> {
  const context = getRequestContext() as unknown as { env: Env };
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
