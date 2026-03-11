import { json, generateId } from '../_helpers';

export async function onRequestPost({ env, request }) {
  const { operacion_id, trabajador_id, mensaje } = await request.json();
  const id = generateId('bit');

  await env.DB.prepare('INSERT INTO bitacora (id, operacion_id, trabajador_id, mensaje) VALUES (?, ?, ?, ?)')
    .bind(id, operacion_id, trabajador_id, mensaje).run();

  return json({ id, operacion_id, trabajador_id, mensaje }, 201);
}

export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const operacion_id = url.searchParams.get('operacion_id');

  const { results } = await env.DB.prepare(`
    SELECT b.*, t.nombre as trabajador_nombre
    FROM bitacora b
    JOIN trabajadores t ON b.trabajador_id = t.id
    WHERE b.operacion_id = ?
    ORDER BY b.created_at DESC
  `).bind(operacion_id).all();

  return json(results);
}
