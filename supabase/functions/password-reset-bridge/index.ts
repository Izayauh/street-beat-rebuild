import { Hono } from "npm:hono@3.11.7";
const SUPABASE_EDGE_URL = Deno.env.get("SUPABASE_URL") + "/functions/v1/password-reset-token";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const app = new Hono();
// Helper to forward requests to the password-reset-token function
async function forwardToPasswordResetToken(req, path) {
  const body = await req.text();
  const headers = new Headers({
    "Content-Type": req.headers.get("Content-Type") || "application/json",
    "Authorization": `Bearer ${SERVICE_ROLE_KEY}`
  });
  const url = `${SUPABASE_EDGE_URL}${path}`;
  return fetch(url, {
    method: req.method,
    headers,
    body: body || undefined
  });
}
app.post("/initiate", async (c)=>{
  const resp = await forwardToPasswordResetToken(c.req.raw, "/initiate");
  const data = await resp.text();
  return c.text(data, resp.status);
});
app.post("/complete", async (c)=>{
  const resp = await forwardToPasswordResetToken(c.req.raw, "/complete");
  const data = await resp.text();
  return c.text(data, resp.status);
});
Deno.serve(app.fetch);