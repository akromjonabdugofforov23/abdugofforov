// functions/api/admin/users/[[path]].js
// Cloudflare Pages Function catch-all for /api/admin/users/:username and /api/admin/users/:username/role

export {
  onRequestOptions,
  onRequestGet,
  onRequestPost,
  onRequestPut,
  onRequestDelete
} from '../../../admin/users.js';
