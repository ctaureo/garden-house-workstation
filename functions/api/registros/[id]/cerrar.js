import { json } from '../../_helpers';

export async function onRequestPost({ env, params, request }) {
  const { notas } = await request.json();
  const now = new Date().toISOString();

  await env.DB.prepare('UPDATE registros_tiempo SET hora_fin = ?, notas = COALESCE(?, notas) WHERE id = ? AND hora_fin IS NULL')
    .bind(now, notas || null, params.id).run();

  const registro = await env.DB.prepare('SELECT * FROM registros_tiempo WHERE id = ?')
    .bind(params.id).first();
  return json(registro);
}
