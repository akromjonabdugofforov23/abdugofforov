// functions/projects/[[path]].js
// Cloudflare Pages Function catch-all for /projects/:id

export {
  onRequestOptions,
  onRequestGet,
  onRequestPost,
  onRequestPut,
  onRequestDelete
} from '../projects.js';
