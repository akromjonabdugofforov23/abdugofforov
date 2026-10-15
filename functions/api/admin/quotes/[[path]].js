// functions/api/admin/quotes/[[path]].js
// Cloudflare Pages Function catch-all for /api/admin/quotes/:id

export {
  onRequestOptions,
  onRequestGet,
  onRequestPost,
  onRequestPut,
  onRequestDelete
} from '../../../quotes.js';
