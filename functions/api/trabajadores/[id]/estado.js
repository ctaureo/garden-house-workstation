import { json } from '../../_helpers';

export async function onRequestGet({ env, params }) {
  const registro_abierto = await env.DB.prepare(`
    SELECT rt.*, o.nombre as operacion_nombre, ot.codigo as ot_codigo,
           e.nombre as estacion_nombre
    FROM registros_tiempo rt
    JOIN operaciones o ON rt.operacion_id = o.id
    JOIN ordenes_trabajo ot ON o.orden_trabajo_id = ot.id
    LEFT JOIN estaciones_trabajo e ON rt.estacion_trabajo_id = e.id
    WHERE rt.trabajador_id = ? AND rt.hora_fin IS NULL
  `).bind(params.id).first();

  return json({
    ocupado: !!registro_abierto,
    registro_actual: registro_abierto || null,
  });
}
