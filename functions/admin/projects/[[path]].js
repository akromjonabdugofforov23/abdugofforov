// functions/admin/projects/[[path]].js
// Cloudflare Pages Function catch-all for /admin/projects/:id

export {
  onRequestOptions,
  onRequestGet,
  onRequestPost,
  onRequestPut,
  onRequestDelete
} from '../../projects.js';
