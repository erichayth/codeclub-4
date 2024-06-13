import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

// Define the runtime environment
export const runtime = 'edge';

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const myKV = getRequestContext().env.CODECLUB_NAMESPACE;
    const userID = request.headers.get("UserID");

    if (!userID) {
      return new Response("UserID is missing", { status: 400 });
    }

    const value = await myKV.get(userID);

    if (value === null) {
      return new Response("Value not found", { status: 404 });
    }

    return new Response(value);
  } catch (err) {
    console.error(`KV returned error: ${err}`);
    return new Response('Internal Server Error', { status: 500 });
  }
}
