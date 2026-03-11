import { json, error, generateId } from '../../_helpers';

export async function onRequestPost({ env, params, request }) {
  const { trabajador_ids, supervisor_id, estacion_trabajo_id } = await request.json();
  const now = new Date().toISOString();

  const operacion = await env.DB.prepare('SELECT * FROM operaciones WHERE id = ?')
    .bind(params.id).first();
  if (!operacion) return error('Operación no encontrada', 404);

  const estacionId = estacion_trabajo_id || operacion.estacion_trabajo_id;

  // Verificar trabajadores ocupados (advertencia soft)
  const advertencias = [];
  for (const tid of trabajador_ids) {
    const ocupado = await env.DB.prepare(`
      SELECT rt.id, o.nombre as op_nombre, ot.codigo as ot_codigo
      FROM registros_tiempo rt
      JOIN operaciones o ON rt.operacion_id = o.id
      JOIN ordenes_trabajo ot ON o.orden_trabajo_id = ot.id
      WHERE rt.trabajador_id = ? AND rt.hora_fin IS NULL
    `).bind(tid).first();

    if (ocupado) {
      advertencias.push({
        trabajador_id: tid,
        mensaje: `Ya está en ${ocupado.ot_codigo} - ${ocupado.op_nombre}`,
      });
    }
  }

  // Batch: actualizar operación, OT y crear registros de tiempo
  const stmts = [
    env.DB.prepare(`
      UPDATE operaciones SET estado = 'en_proceso', estacion_trabajo_id = COALESCE(estacion_trabajo_id, ?), fecha_inicio = COALESCE(fecha_inicio, ?)
      WHERE id = ?
    `).bind(estacionId, now, params.id),
    env.DB.prepare(`
      UPDATE ordenes_trabajo SET estado = 'en_proceso', fecha_inicio_real = COALESCE(fecha_inicio_real, ?)
      WHERE id = ? AND estado = 'pendiente'
    `).bind(now, operacion.orden_trabajo_id),
  ];

  const registros = [];
  for (const tid of trabajador_ids) {
    const regId = generateId('rt');
    stmts.push(
      env.DB.prepare(`
        INSERT INTO registros_tiempo (id, operacion_id, trabajador_id, estacion_trabajo_id, supervisor_id, hora_inicio, tipo)
        VALUES (?, ?, ?, ?, ?, ?, 'productivo')
      `).bind(regId, params.id, tid, estacionId, supervisor_id, now)
    );
    registros.push(regId);
  }

  await env.DB.batch(stmts);
  return json({ registros, advertencias }, 201);
}
