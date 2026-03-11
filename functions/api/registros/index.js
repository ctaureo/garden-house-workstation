import { json } from '../_helpers';

export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const operacion_id = url.searchParams.get('operacion_id');
  const trabajador_id = url.searchParams.get('trabajador_id');

  let sql = `
    SELECT rt.*, t.nombre as trabajador_nombre, t.rut as trabajador_rut,
           s.nombre as supervisor_nombre, e.nombre as estacion_nombre,
           o.nombre as operacion_nombre, ot.codigo as ot_codigo
    FROM registros_tiempo rt
    JOIN trabajadores t ON rt.trabajador_id = t.id
    JOIN trabajadores s ON rt.supervisor_id = s.id
    JOIN estaciones_trabajo e ON rt.estacion_trabajo_id = e.id
    JOIN operaciones o ON rt.operacion_id = o.id
    JOIN ordenes_trabajo ot ON o.orden_trabajo_id = ot.id
    WHERE 1=1
  `;
  const params = [];

  if (operacion_id) {
    sql += ' AND rt.operacion_id = ?';
    params.push(operacion_id);
  }
  if (trabajador_id) {
    sql += ' AND rt.trabajador_id = ?';
    params.push(trabajador_id);
  }

  sql += ' ORDER BY rt.hora_inicio DESC';
  const stmt = env.DB.prepare(sql);
  const { results } = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all();
  return json(results);
}
