import { json, generateId } from '../_helpers';

export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const rol = url.searchParams.get('rol');
  const buscar = url.searchParams.get('buscar');

  let sql = 'SELECT * FROM trabajadores WHERE activo = 1';
  const params = [];

  if (rol) {
    sql += ' AND rol = ?';
    params.push(rol);
  }
  if (buscar) {
    sql += ' AND (rut LIKE ? OR nombre LIKE ?)';
    params.push(`%${buscar}%`, `%${buscar}%`);
  }

  sql += ' ORDER BY nombre';
  const stmt = env.DB.prepare(sql);
  const { results } = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all();
  return json(results);
}

export async function onRequestPost({ env, request }) {
  const { rut, nombre, rol } = await request.json();
  const id = generateId('trab');
  await env.DB.prepare('INSERT INTO trabajadores (id, rut, nombre, rol) VALUES (?, ?, ?, ?)')
    .bind(id, rut, nombre, rol || 'operador').run();
  return json({ id, rut, nombre, rol: rol || 'operador' }, 201);
}
