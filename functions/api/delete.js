export async function onRequestPost({ request, env }) {
  const { id, token } = await request.json();

  if (!id) {
    return new Response(
      JSON.stringify({ error: '缺少 id' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  /**
   * ⭐ 权限规则：
   * 1️⃣ 后台管理页：token === ADMIN_PASSWORD → 放行
   * 2️⃣ 前端展示页：token === DELETE_PASSWORD       → 放行
   * 3️⃣ 其他情况：拒绝
   */
  const isAdmin =
    token && token === env.ADMIN_PASSWORD;

  const isFrontDelete =
    token && token === env.DELETE_PASSWORD;

  if (!isAdmin && !isFrontDelete) {
    return new Response(
      JSON.stringify({ error: '无删除权限' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const item = await env.REVIEWS_KV.get(id, { type: 'json' });
  if (!item) {
    return new Response(
      JSON.stringify({ error: '未找到此好评' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 软删除
  item.deleted = true;
  item.updated_at = new Date().toISOString();
  item.updated_at_ts = Date.now();

  await env.REVIEWS_KV.put(id, JSON.stringify(item));

  return new Response(
    JSON.stringify({ message: '删除成功' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
