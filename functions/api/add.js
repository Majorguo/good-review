export async function onRequestPost({ request, env }) {
  const { content, token, category } = await request.json();

  if (token !== env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: '无权限' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 允许的分类
  const allowedCategories = ['膜', '电池'];
  if (!content || !category || !allowedCategories.includes(category)) {
    return new Response(JSON.stringify({ error: '内容或分类缺失，或分类不合法' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const ts = Date.now();
  const id = ts.toString(); 

  const record = {
    id,
    content,
    category,                
    created_at: new Date(ts).toISOString(),
    updated_at: new Date(ts).toISOString(),
    created_at_ts: ts,
    updated_at_ts: ts,
    deleted: false
  };

  await env.REVIEWS_KV.put(id, JSON.stringify(record));

  return new Response(JSON.stringify({
    message: '添加成功',
    data: record
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
