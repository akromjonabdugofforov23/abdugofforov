// functions/admin/tasks/[[path]].js
// Cloudflare Pages Function catch-all for /admin/tasks/:id

export {
  onRequestOptions,
  onRequestGet,
  onRequestPost,
  onRequestPut,
  onRequestDelete
} from '../../tasks.js';
