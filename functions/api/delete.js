export async function onRequestPost({ request, env }) {
  const { id } = await request.json();

  const item = await env.REVIEWS_KV.get(id, { type: 'json' });
  if (!item) {
    return new Response(JSON.stringify({ error: '未找到此好评' }), { status: 404 });
  }

  item.deleted = true;
  item.updated_at = new Date().toISOString(); // 更新修改时间
  await env.REVIEWS_KV.put(id, JSON.stringify(item));

  return new Response(JSON.stringify({ message: '删除成功' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
