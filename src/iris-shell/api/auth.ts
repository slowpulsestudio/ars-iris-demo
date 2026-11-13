export const config = { runtime: "edge" };

const COOKIE = "site_auth";

export default async function handler(request: Request) {
  const password = process.env.SITE_PASSWORD ?? "";
  const body = await request.text();
  const submitted = new URLSearchParams(body).get("password") ?? "";
  const base = new URL(request.url).origin;

  if (submitted === password) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: base + "/",
        "Set-Cookie": `${COOKIE}=${password}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,
      },
    });
  }

  return new Response(null, {
    status: 302,
    headers: { Location: base + "/?error=1" },
  });
}
