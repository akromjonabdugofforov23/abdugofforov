// POST /auth/logout
// Header: x-user-token yoki Authorization: Bearer <token>
// Sessiyani o'chiradi.

import { jsonResponse, corsHeaders, deleteSession } from '../_lib.js';

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request) });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  if (env.POSTS_KV) {
    await deleteSession(env, request);
  }
  return jsonResponse({ ok: true }, 200, request);
}
