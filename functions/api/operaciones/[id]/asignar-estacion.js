import { json } from '../../_helpers';

export async function onRequestPost({ env, params, request }) {
  const { estacion_trabajo_id } = await request.json();

  await env.DB.prepare('UPDATE operaciones SET estacion_trabajo_id = ? WHERE id = ?')
    .bind(estacion_trabajo_id, params.id).run();

  const op = await env.DB.prepare(`
    SELECT o.*, e.nombre as estacion_nombre
    FROM operaciones o
    LEFT JOIN estaciones_trabajo e ON o.estacion_trabajo_id = e.id
    WHERE o.id = ?
  `).bind(params.id).first();

  return json(op);
}
