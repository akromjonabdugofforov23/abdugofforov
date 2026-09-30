// ============================================================
// Endpoint: POST /csp-report
// Browser Content-Security-Policy (CSP) violation reporting endpoint
// ============================================================

export async function onRequestPost(context) {
  // Brauzerlar CSP buzilishlari haqida hisobotni JSON formatida yuboradi
  // (application/csp-report yoki application/reports+json)
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
