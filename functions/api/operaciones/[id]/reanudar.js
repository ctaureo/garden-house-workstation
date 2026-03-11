import { json, generateId } from '../../_helpers';

export async function onRequestPost({ env, params, request }) {
  const { trabajador_ids, supervisor_id } = await request.json();
  const now = new Date().toISOString();

  const operacion = await env.DB.prepare('SELECT * FROM operaciones WHERE id = ?')
    .bind(params.id).first();

  const stmts = [
    env.DB.prepare('UPDATE operaciones SET estado = ? WHERE id = ?')
      .bind('en_proceso', params.id),
  ];

  const registros = [];
  for (const tid of trabajador_ids) {
    const regId = generateId('rt');
    stmts.push(
      env.DB.prepare(`
        INSERT INTO registros_tiempo (id, operacion_id, trabajador_id, estacion_trabajo_id, supervisor_id, hora_inicio, tipo)
        VALUES (?, ?, ?, ?, ?, ?, 'productivo')
      `).bind(regId, params.id, tid, operacion.estacion_trabajo_id, supervisor_id, now)
    );
    registros.push(regId);
  }

  await env.DB.batch(stmts);
  return json({ registros }, 201);
}
