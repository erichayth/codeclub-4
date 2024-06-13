

// Define the runtime environment
export const runtime = 'edge';

export interface Env {
    CODECLUB_NAMESPACE: KVNamespace;
}

export async function GET(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  try {
    const userID = request.headers.get("UserID");

    if (!userID) {
      return new Response("UserID is missing", { status: 400 });
    }

    const value = await env.CODECLUB_NAMESPACE.get(userID);

    if (!value) {
      return new Response("UserID is not valid", { status: 403});
    }

    else {
    let newRequest = new Request(request);
    newRequest.headers.set("Auth-Token", value);
    let authValue = newRequest.headers.get("Auth-Token");
    return new Response('User token for UserID added to Auth-Token header', { status: 200});
    }

  } catch (err) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
