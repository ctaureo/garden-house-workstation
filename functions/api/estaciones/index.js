import { json, error, generateId } from '../_helpers';

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(`
    SELECT e.*,
      (SELECT COUNT(*) FROM operaciones o WHERE o.estacion_trabajo_id = e.id AND o.estado IN ('en_proceso', 'pausada')) as operaciones_activas
    FROM estaciones_trabajo e
    WHERE e.activa = 1
    ORDER BY e.ubicacion, e.nombre
  `).all();
  return json(results);
}

export async function onRequestPost({ env, request }) {
  const { codigo, nombre, ubicacion } = await request.json();
  const id = generateId('est');
  await env.DB.prepare('INSERT INTO estaciones_trabajo (id, codigo, nombre, ubicacion) VALUES (?, ?, ?, ?)')
    .bind(id, codigo, nombre, ubicacion).run();
  return json({ id, codigo, nombre, ubicacion }, 201);
}
