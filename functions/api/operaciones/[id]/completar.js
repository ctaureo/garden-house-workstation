import { json } from '../../_helpers';

export async function onRequestPost({ env, params, request }) {
  const { notas } = await request.json();
  const now = new Date().toISOString();

  const operacion = await env.DB.prepare('SELECT * FROM operaciones WHERE id = ?')
    .bind(params.id).first();

  // Check if all other operations will be completed after this one
  const pendientes = await env.DB.prepare(`
    SELECT COUNT(*) as count FROM operaciones
    WHERE orden_trabajo_id = ? AND estado != 'completada' AND id != ?
  `).bind(operacion.orden_trabajo_id, params.id).first();

  const stmts = [
    env.DB.prepare('UPDATE operaciones SET estado = ?, fecha_fin = ? WHERE id = ?')
      .bind('completada', now, params.id),
    env.DB.prepare(`
      UPDATE registros_tiempo SET hora_fin = ?, notas = COALESCE(?, notas)
      WHERE operacion_id = ? AND hora_fin IS NULL
    `).bind(now, notas || null, params.id),
  ];

  // If all other operations are done, complete the work order
  if (pendientes.count === 0) {
    stmts.push(
      env.DB.prepare('UPDATE ordenes_trabajo SET estado = ?, fecha_fin_real = ? WHERE id = ?')
        .bind('completada', now, operacion.orden_trabajo_id)
    );
  }

  await env.DB.batch(stmts);
  return json({ ok: true });
}
