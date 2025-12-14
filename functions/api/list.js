export async function onRequest({ env }) {
  let list = [];
  let cursor;

  // 拉取 KV 所有数据
  do {
    const res = await env.REVIEWS_KV.list({ cursor });
    cursor = res.cursor;

    for (const key of res.keys) {
      const val = await env.REVIEWS_KV.get(key.name, { type: 'json' });
      if (val) list.push(val);
    }
  } while (cursor);

  // 只保留未删除的，并按更新时间/创建时间排序（最新在前）
  list = list.filter(item => !item.deleted)
             .sort((a, b) => {
               const tA = a.updated_at_ts || a.created_at_ts || 0;
               const tB = b.updated_at_ts || b.created_at_ts || 0;
               return tB - tA;
             });

  // 分组返回
  const grouped = {
    膜: list.filter(item => item.category === '膜'),
    电池: list.filter(item => item.category === '电池')
  };

  return new Response(JSON.stringify(grouped), {
    headers: { 'Content-Type': 'application/json' }
  });
}
