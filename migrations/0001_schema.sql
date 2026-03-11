-- Schema Garden House Workstation - Cloudflare D1

CREATE TABLE IF NOT EXISTS clientes (
  id TEXT PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS productos (
  id TEXT PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  cliente_id TEXT NOT NULL REFERENCES clientes(id),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS plantilla_operaciones (
  id TEXT PRIMARY KEY,
  producto_id TEXT NOT NULL REFERENCES productos(id),
  numero_secuencia INTEGER NOT NULL,
  nombre TEXT NOT NULL,
  duracion_estimada_hrs REAL,
  UNIQUE(producto_id, numero_secuencia)
);

CREATE TABLE IF NOT EXISTS estaciones_trabajo (
  id TEXT PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  ubicacion TEXT,
  activa INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS trabajadores (
  id TEXT PRIMARY KEY,
  rut TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL CHECK(rol IN ('operador', 'supervisor', 'jefe_operaciones')),
  activo INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS ordenes_trabajo (
  id TEXT PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  producto_id TEXT NOT NULL REFERENCES productos(id),
  cliente_id TEXT NOT NULL REFERENCES clientes(id),
  cantidad REAL NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK(estado IN ('pendiente', 'en_proceso', 'completada', 'cancelada')),
  prioridad INTEGER DEFAULT 0,
  fecha_creacion TEXT DEFAULT (datetime('now')),
  fecha_inicio_real TEXT,
  fecha_fin_real TEXT
);

CREATE TABLE IF NOT EXISTS operaciones (
  id TEXT PRIMARY KEY,
  orden_trabajo_id TEXT NOT NULL REFERENCES ordenes_trabajo(id),
  numero_secuencia INTEGER NOT NULL,
  nombre TEXT NOT NULL,
  estacion_trabajo_id TEXT REFERENCES estaciones_trabajo(id),
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK(estado IN ('pendiente', 'en_proceso', 'pausada', 'completada')),
  fecha_inicio TEXT,
  fecha_fin TEXT,
  UNIQUE(orden_trabajo_id, numero_secuencia)
);

CREATE TABLE IF NOT EXISTS registros_tiempo (
  id TEXT PRIMARY KEY,
  operacion_id TEXT NOT NULL REFERENCES operaciones(id),
  trabajador_id TEXT NOT NULL REFERENCES trabajadores(id),
  estacion_trabajo_id TEXT NOT NULL REFERENCES estaciones_trabajo(id),
  supervisor_id TEXT NOT NULL REFERENCES trabajadores(id),
  hora_inicio TEXT NOT NULL DEFAULT (datetime('now')),
  hora_fin TEXT,
  tipo TEXT NOT NULL DEFAULT 'productivo' CHECK(tipo IN ('productivo', 'detencion', 'setup')),
  notas TEXT
);

CREATE TABLE IF NOT EXISTS detenciones (
  id TEXT PRIMARY KEY,
  registro_tiempo_id TEXT REFERENCES registros_tiempo(id),
  operacion_id TEXT NOT NULL REFERENCES operaciones(id),
  motivo TEXT NOT NULL CHECK(motivo IN ('falla_mecanica', 'falta_material', 'cambio_formato', 'mantencion', 'otro')),
  descripcion TEXT,
  duracion_minutos INTEGER,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS bitacora (
  id TEXT PRIMARY KEY,
  operacion_id TEXT NOT NULL REFERENCES operaciones(id),
  trabajador_id TEXT NOT NULL REFERENCES trabajadores(id),
  mensaje TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_ordenes_estado ON ordenes_trabajo(estado);
CREATE INDEX IF NOT EXISTS idx_operaciones_orden ON operaciones(orden_trabajo_id);
CREATE INDEX IF NOT EXISTS idx_operaciones_estacion ON operaciones(estacion_trabajo_id);
CREATE INDEX IF NOT EXISTS idx_registros_operacion ON registros_tiempo(operacion_id);
CREATE INDEX IF NOT EXISTS idx_registros_trabajador ON registros_tiempo(trabajador_id);
CREATE INDEX IF NOT EXISTS idx_registros_abiertos ON registros_tiempo(hora_fin) WHERE hora_fin IS NULL;
CREATE INDEX IF NOT EXISTS idx_trabajadores_rut ON trabajadores(rut);
