export async function onRequestPost({ request, env }) {
  const { token } = await request.json();
  if (token === env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ message: "登录成功" }), {
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify({ error: "密码错误" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}
