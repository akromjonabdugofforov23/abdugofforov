// functions/api/admin/tasks/[[path]].js
// Cloudflare Pages Function catch-all for /api/admin/tasks/:id

export {
  onRequestOptions,
  onRequestGet,
  onRequestPost,
  onRequestPut,
  onRequestDelete
} from '../../../tasks.js';
