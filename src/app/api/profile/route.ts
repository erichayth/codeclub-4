import { NextRequest, NextResponse } from 'next/server';

// Define the runtime environment
export const runtime = 'edge';

export interface Env {
    CODECLUB_NAMESPACE: KVNamespace;
}

export async function GET(request: NextRequest, env: Env): Promise<NextResponse> {
  try {
    const userID = request.headers.get("UserID");

    if (!userID) {
      return new NextResponse("UserID is missing", { status: 400 });
    }

    const value = await env.CODECLUB_NAMESPACE.get(userID);

    if (!value) {
      return new NextResponse("UserID is not valid", { status: 403});
    }

    else {
    let newRequest = new NextRequest(request);
    newRequest.headers.set("Auth-Token", value);
    let authValue = newRequest.headers.get("Auth-Token");
    return new NextResponse('User token for UserID added to Auth-Token header', { status: 200});
    }

  } catch (err) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
