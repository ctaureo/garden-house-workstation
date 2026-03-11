import { json, generateId } from '../_helpers';

export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const estado = url.searchParams.get('estado');

  let sql = `
    SELECT ot.*, p.nombre as producto_nombre, p.codigo as producto_codigo,
           c.nombre as cliente_nombre,
           (SELECT COUNT(*) FROM operaciones o WHERE o.orden_trabajo_id = ot.id) as total_operaciones,
           (SELECT COUNT(*) FROM operaciones o WHERE o.orden_trabajo_id = ot.id AND o.estado = 'completada') as operaciones_completadas
    FROM ordenes_trabajo ot
    JOIN productos p ON ot.producto_id = p.id
    JOIN clientes c ON ot.cliente_id = c.id
  `;
  const params = [];

  if (estado) {
    sql += ' WHERE ot.estado = ?';
    params.push(estado);
  }

  sql += ' ORDER BY ot.prioridad ASC, ot.fecha_creacion DESC';
  const stmt = env.DB.prepare(sql);
  const { results } = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all();
  return json(results);
}

export async function onRequestPost({ env, request }) {
  const { producto_id, cliente_id, cantidad, prioridad, codigo } = await request.json();

  const id = generateId('ot');
  const otCodigo = codigo || `OT-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

  const { results: plantilla } = await env.DB.prepare(
    'SELECT * FROM plantilla_operaciones WHERE producto_id = ? ORDER BY numero_secuencia'
  ).bind(producto_id).all();

  const stmts = [
    env.DB.prepare('INSERT INTO ordenes_trabajo (id, codigo, producto_id, cliente_id, cantidad, prioridad) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(id, otCodigo, producto_id, cliente_id, cantidad, prioridad || 0),
  ];

  for (const p of plantilla) {
    stmts.push(
      env.DB.prepare('INSERT INTO operaciones (id, orden_trabajo_id, numero_secuencia, nombre) VALUES (?, ?, ?, ?)')
        .bind(generateId('op'), id, p.numero_secuencia, p.nombre)
    );
  }

  await env.DB.batch(stmts);

  const orden = await env.DB.prepare('SELECT * FROM ordenes_trabajo WHERE id = ?').bind(id).first();
  return json(orden, 201);
}
