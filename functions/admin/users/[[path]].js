// functions/admin/users/[[path]].js
// Cloudflare Pages Function catch-all for /admin/users/:username and /admin/users/:username/role

export {
  onRequestOptions,
  onRequestGet,
  onRequestPost,
  onRequestPut,
  onRequestDelete
} from '../users.js';
