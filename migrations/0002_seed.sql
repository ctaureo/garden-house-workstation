-- Datos de prueba para Garden House Workstation

INSERT OR IGNORE INTO clientes (id, codigo, nombre) VALUES
  ('cli-001', 'GH', 'Garden House'),
  ('cli-002', 'EXT1', 'Cliente Externo 1'),
  ('cli-003', 'EXT2', 'Cliente Externo 2');

INSERT OR IGNORE INTO productos (id, codigo, nombre, cliente_id) VALUES
  ('prod-001', 'SH-500', 'Shampoo Herbal 500ml', 'cli-001'),
  ('prod-002', 'CR-250', 'Crema Corporal 250ml', 'cli-001'),
  ('prod-003', 'JB-1000', 'Jabón Líquido 1000ml', 'cli-002'),
  ('prod-004', 'AC-300', 'Acondicionador 300ml', 'cli-003');

INSERT OR IGNORE INTO plantilla_operaciones (id, producto_id, numero_secuencia, nombre, duracion_estimada_hrs) VALUES
  ('plt-001', 'prod-001', 1, 'Pesaje de materias primas', 1.5),
  ('plt-002', 'prod-001', 2, 'Mezclado', 8.0),
  ('plt-003', 'prod-001', 3, 'Control de calidad', 2.0),
  ('plt-004', 'prod-001', 4, 'Envasado', 4.0),
  ('plt-005', 'prod-001', 5, 'Etiquetado', 3.0),
  ('plt-006', 'prod-001', 6, 'Empacado', 2.5);

INSERT OR IGNORE INTO plantilla_operaciones (id, producto_id, numero_secuencia, nombre, duracion_estimada_hrs) VALUES
  ('plt-007', 'prod-002', 1, 'Pesaje de materias primas', 1.0),
  ('plt-008', 'prod-002', 2, 'Mezclado', 6.0),
  ('plt-009', 'prod-002', 3, 'Homogenizado', 4.0),
  ('plt-010', 'prod-002', 4, 'Control de calidad', 2.0),
  ('plt-011', 'prod-002', 5, 'Envasado', 5.0),
  ('plt-012', 'prod-002', 6, 'Empacado', 2.0);

INSERT OR IGNORE INTO estaciones_trabajo (id, codigo, nombre, ubicacion) VALUES
  ('est-001', 'PESAJE-1', 'Balanza Industrial 1', 'Zona Pesaje'),
  ('est-002', 'MEZC-1', 'Mezcladora L1', 'Zona Mezclado'),
  ('est-003', 'MEZC-2', 'Mezcladora L2', 'Zona Mezclado'),
  ('est-004', 'HOMO-1', 'Homogeneizador 1', 'Zona Mezclado'),
  ('est-005', 'ENV-1', 'Línea Envasado 1', 'Zona Envasado'),
  ('est-006', 'ENV-2', 'Línea Envasado 2', 'Zona Envasado'),
  ('est-007', 'ETQ-1', 'Etiquetadora 1', 'Zona Etiquetado'),
  ('est-008', 'EMP-1', 'Empacadora 1', 'Zona Empacado'),
  ('est-009', 'QC-1', 'Lab Control Calidad', 'Zona QC');

INSERT OR IGNORE INTO trabajadores (id, rut, nombre, rol) VALUES
  ('trab-001', '12345678-9', 'Carlos Pérez', 'supervisor'),
  ('trab-002', '11222333-4', 'Ana Muñoz', 'supervisor'),
  ('trab-003', '15666777-8', 'Pedro Soto', 'operador'),
  ('trab-004', '16888999-0', 'María López', 'operador'),
  ('trab-005', '14555666-1', 'Juan Rojas', 'operador'),
  ('trab-006', '17111222-3', 'Luis Torres', 'operador'),
  ('trab-007', '13444555-6', 'Rosa Díaz', 'operador'),
  ('trab-008', '18777888-9', 'Diego Vargas', 'operador'),
  ('trab-009', '19000111-2', 'Camila Reyes', 'operador'),
  ('trab-010', '10333444-5', 'Roberto Silva', 'jefe_operaciones');

INSERT OR IGNORE INTO ordenes_trabajo (id, codigo, producto_id, cliente_id, cantidad, estado, prioridad) VALUES
  ('ot-001', 'OT-2024-0001', 'prod-001', 'cli-001', 5000, 'en_proceso', 1),
  ('ot-002', 'OT-2024-0002', 'prod-002', 'cli-001', 3000, 'en_proceso', 2),
  ('ot-003', 'OT-2024-0003', 'prod-003', 'cli-002', 2000, 'pendiente', 3),
  ('ot-004', 'OT-2024-0004', 'prod-001', 'cli-003', 8000, 'pendiente', 4);

INSERT OR IGNORE INTO operaciones (id, orden_trabajo_id, numero_secuencia, nombre, estacion_trabajo_id, estado, fecha_inicio, fecha_fin) VALUES
  ('op-001', 'ot-001', 1, 'Pesaje de materias primas', 'est-001', 'completada', '2024-01-15 07:00:00', '2024-01-15 08:30:00'),
  ('op-002', 'ot-001', 2, 'Mezclado', 'est-002', 'en_proceso', '2024-01-15 09:00:00', NULL),
  ('op-003', 'ot-001', 3, 'Control de calidad', NULL, 'pendiente', NULL, NULL),
  ('op-004', 'ot-001', 4, 'Envasado', NULL, 'pendiente', NULL, NULL),
  ('op-005', 'ot-001', 5, 'Etiquetado', NULL, 'pendiente', NULL, NULL),
  ('op-006', 'ot-001', 6, 'Empacado', NULL, 'pendiente', NULL, NULL);

INSERT OR IGNORE INTO operaciones (id, orden_trabajo_id, numero_secuencia, nombre, estacion_trabajo_id, estado, fecha_inicio) VALUES
  ('op-007', 'ot-002', 1, 'Pesaje de materias primas', 'est-001', 'en_proceso', '2024-01-15 10:00:00'),
  ('op-008', 'ot-002', 2, 'Mezclado', NULL, 'pendiente', NULL),
  ('op-009', 'ot-002', 3, 'Homogenizado', NULL, 'pendiente', NULL),
  ('op-010', 'ot-002', 4, 'Control de calidad', NULL, 'pendiente', NULL),
  ('op-011', 'ot-002', 5, 'Envasado', NULL, 'pendiente', NULL),
  ('op-012', 'ot-002', 6, 'Empacado', NULL, 'pendiente', NULL);
