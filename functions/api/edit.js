export async function onRequestPost({ request, env }) {
  const { id, content, token } = await request.json();

  if (token !== env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: '无权限' }), { status: 401 });
  }

  const item = await env.REVIEWS_KV.get(id, { type: 'json' });
  if (!item) {
    return new Response(JSON.stringify({ error: '未找到此好评' }), { status: 404 });
  }

  const ts = Date.now();

  item.content = content;
  item.updated_at = new Date(ts).toISOString();
  item.updated_at_ts = ts;   // ⭐关键：更新时间戳

  await env.REVIEWS_KV.put(id, JSON.stringify(item));

  return new Response(
    JSON.stringify({ message: '修改成功' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
