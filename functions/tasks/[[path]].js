// functions/tasks/[[path]].js
// Cloudflare Pages Function catch-all for /tasks/:id

export {
  onRequestOptions,
  onRequestGet,
  onRequestPost,
  onRequestPut,
  onRequestDelete
} from '../tasks.js';
