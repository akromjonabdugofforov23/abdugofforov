// functions/quotes/[[path]].js
// Cloudflare Pages Function catch-all for /quotes/:id

export {
  onRequestOptions,
  onRequestGet,
  onRequestPost,
  onRequestPut,
  onRequestDelete
} from '../quotes.js';
