import { json } from '../../_helpers';

export async function onRequestPost({ env, params, request }) {
  const { notas } = await request.json();
  const now = new Date().toISOString();

  await env.DB.batch([
    env.DB.prepare('UPDATE operaciones SET estado = ? WHERE id = ?')
      .bind('pausada', params.id),
    env.DB.prepare(`
      UPDATE registros_tiempo SET hora_fin = ?, notas = COALESCE(?, notas)
      WHERE operacion_id = ? AND hora_fin IS NULL
    `).bind(now, notas || null, params.id),
  ]);

  return json({ ok: true });
}
