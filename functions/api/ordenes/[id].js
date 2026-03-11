import { json, error } from '../_helpers';

export async function onRequestGet({ env, params }) {
  const orden = await env.DB.prepare(`
    SELECT ot.*, p.nombre as producto_nombre, c.nombre as cliente_nombre
    FROM ordenes_trabajo ot
    JOIN productos p ON ot.producto_id = p.id
    JOIN clientes c ON ot.cliente_id = c.id
    WHERE ot.id = ?
  `).bind(params.id).first();

  if (!orden) return error('Orden no encontrada', 404);

  const { results } = await env.DB.prepare(`
    SELECT o.*, e.nombre as estacion_nombre, e.codigo as estacion_codigo
    FROM operaciones o
    LEFT JOIN estaciones_trabajo e ON o.estacion_trabajo_id = e.id
    WHERE o.orden_trabajo_id = ?
    ORDER BY o.numero_secuencia
  `).bind(params.id).all();

  orden.operaciones = results;
  return json(orden);
}

export async function onRequestPatch({ env, params, request }) {
  const { estado } = await request.json();
  const now = new Date().toISOString();

  const updates = ['estado = ?'];
  const binds = [estado];

  if (estado === 'en_proceso') {
    updates.push('fecha_inicio_real = COALESCE(fecha_inicio_real, ?)');
    binds.push(now);
  } else if (estado === 'completada' || estado === 'cancelada') {
    updates.push('fecha_fin_real = ?');
    binds.push(now);
  }

  binds.push(params.id);
  await env.DB.prepare(`UPDATE ordenes_trabajo SET ${updates.join(', ')} WHERE id = ?`)
    .bind(...binds).run();

  const orden = await env.DB.prepare('SELECT * FROM ordenes_trabajo WHERE id = ?')
    .bind(params.id).first();
  return json(orden);
}
