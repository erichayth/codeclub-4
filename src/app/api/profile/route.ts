

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

    if (value === null) {
      return new Response("Value not found", { status: 404 });
    }

    return new Response(value);
  } catch (err) {
    console.error(`KV returned error: ${err}`);
    return new Response('Internal Server Error', { status: 500 });
  }
}
