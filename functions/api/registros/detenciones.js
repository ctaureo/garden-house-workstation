import { json, generateId } from '../_helpers';

export async function onRequestPost({ env, request }) {
  const { operacion_id, motivo, descripcion, duracion_minutos } = await request.json();
  const id = generateId('det');

  await env.DB.prepare(`
    INSERT INTO detenciones (id, operacion_id, motivo, descripcion, duracion_minutos)
    VALUES (?, ?, ?, ?, ?)
  `).bind(id, operacion_id, motivo, descripcion || null, duracion_minutos || null).run();

  return json({ id, operacion_id, motivo, descripcion, duracion_minutos }, 201);
}

export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const operacion_id = url.searchParams.get('operacion_id');

  let sql = 'SELECT * FROM detenciones WHERE 1=1';
  const params = [];

  if (operacion_id) {
    sql += ' AND operacion_id = ?';
    params.push(operacion_id);
  }

  sql += ' ORDER BY created_at DESC';
  const stmt = env.DB.prepare(sql);
  const { results } = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all();
  return json(results);
}
