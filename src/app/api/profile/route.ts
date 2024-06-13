import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

// Define the runtime environment
export const runtime = 'edge';

export interface Env {
  CODECLUB_NAMESPACE: KVNamespace;
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    try {
      const userID = request.headers.get("UserID");
      const value = await env.CODECLUB_NAMESPACE.get(userID)

      if (value === null) {           
        return new Response("Value not found", { status: 404 });       
      }       
      return new Response(value);
    } catch (err) {
      // In a production application, you could instead choose to retry your KV
      // read or fall back to a default code path.
      console.error(`KV returned error: ${err}`)
      return new Response(err, { status: 500 })
    }
}
} satisfies ExportedHandler<Env>;