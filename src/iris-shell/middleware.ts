export const config = { matcher: ["/:path*"] };

const COOKIE = "site_auth";

const gate = (err: boolean) =>
  `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Access required</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,sans-serif;background:#f1f5f9;display:flex;align-items:center;justify-content:center;min-height:100vh}.card{background:white;border-radius:12px;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(2,6,24,.08);padding:40px;width:100%;max-width:360px}h1{font-size:18px;font-weight:600;color:#0f172b;margin-bottom:4px}p{font-size:14px;color:#62748e;margin-bottom:24px}input{width:100%;height:40px;padding:0 12px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;color:#0f172b;outline:none;margin-bottom:12px}input:focus{border-color:#00a6f4}button{width:100%;height:40px;background:#00a6f4;color:white;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer}button:hover{background:#0084d1}.err{color:#e7000b;font-size:13px;margin-top:8px}</style></head><body><div class="card"><h1>Access required</h1><p>Enter the session password to continue.</p><form action="/api/auth" method="POST"><input type="password" name="password" placeholder="Password" autofocus/><button type="submit">Continue</button>${err ? '<p class="err">Incorrect password.</p>' : ''}</form></div></body></html>`;

export default function middleware(request: Request) {
  const password = process.env.SITE_PASSWORD;
  if (!password) return;

  // Only protect snapshot/release branches. main is always open.
  if (process.env.VERCEL_GIT_COMMIT_REF === "main") return;

  const url = new URL(request.url);
  // Let the auth handler through unconditionally
  if (url.pathname.startsWith("/api/")) return;

  const cookie = request.headers.get("cookie") ?? "";
  const token = cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(COOKIE + "="))
    ?.split("=")[1];
  if (token === password) return;

  const err = url.searchParams.get("error") === "1";
  return new Response(gate(err), {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}
