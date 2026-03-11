import { json } from '../_helpers';

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(`
    SELECT o.*, ot.codigo as ot_codigo, ot.cantidad as ot_cantidad,
           p.nombre as producto_nombre, c.nombre as cliente_nombre,
           ot.prioridad
    FROM operaciones o
    JOIN ordenes_trabajo ot ON o.orden_trabajo_id = ot.id
    JOIN productos p ON ot.producto_id = p.id
    JOIN clientes c ON ot.cliente_id = c.id
    WHERE o.estado = 'pendiente'
      AND ot.estado IN ('pendiente', 'en_proceso')
    ORDER BY ot.prioridad ASC, o.numero_secuencia ASC
  `).all();
  return json(results);
}
