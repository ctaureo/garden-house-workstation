import { json, error } from '../_helpers';

export async function onRequestGet({ env, params }) {
  const estacion = await env.DB.prepare('SELECT * FROM estaciones_trabajo WHERE id = ?')
    .bind(params.id).first();
  if (!estacion) return error('Estación no encontrada', 404);

  const { results: operaciones } = await env.DB.prepare(`
    SELECT o.*, ot.codigo as ot_codigo, ot.cantidad as ot_cantidad,
           p.nombre as producto_nombre, c.nombre as cliente_nombre,
           (SELECT COUNT(*) FROM operaciones o2 WHERE o2.orden_trabajo_id = o.orden_trabajo_id) as total_operaciones
    FROM operaciones o
    JOIN ordenes_trabajo ot ON o.orden_trabajo_id = ot.id
    JOIN productos p ON ot.producto_id = p.id
    JOIN clientes c ON ot.cliente_id = c.id
    WHERE o.estacion_trabajo_id = ? AND o.estado IN ('en_proceso', 'pausada', 'pendiente')
    ORDER BY ot.prioridad ASC, o.numero_secuencia ASC
  `).bind(params.id).all();

  for (const op of operaciones) {
    const { results } = await env.DB.prepare(`
      SELECT rt.id as registro_id, rt.hora_inicio, rt.tipo,
             t.id as trabajador_id, t.rut, t.nombre
      FROM registros_tiempo rt
      JOIN trabajadores t ON rt.trabajador_id = t.id
      WHERE rt.operacion_id = ? AND rt.hora_fin IS NULL
      ORDER BY rt.hora_inicio
    `).bind(op.id).all();
    op.trabajadores_activos = results;
  }

  return json({ estacion, operaciones });
}
