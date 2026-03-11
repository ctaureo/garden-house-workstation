const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Estaciones
  getEstaciones: () => request('/estaciones'),
  getEstacion: (id) => request(`/estaciones/${id}`),

  // Trabajadores
  getTrabajadores: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/trabajadores${qs ? '?' + qs : ''}`);
  },
  getEstadoTrabajador: (id) => request(`/trabajadores/${id}/estado`),

  // Órdenes
  getOrdenes: (estado) => request(`/ordenes${estado ? '?estado=' + estado : ''}`),
  getOrden: (id) => request(`/ordenes/${id}`),
  crearOrden: (data) => request('/ordenes', { method: 'POST', body: data }),

  // Operaciones
  getOperacionesPendientes: () => request('/operaciones/pendientes'),
  asignarEstacion: (id, estacion_trabajo_id) =>
    request(`/operaciones/${id}/asignar-estacion`, { method: 'POST', body: { estacion_trabajo_id } }),
  iniciarOperacion: (id, data) =>
    request(`/operaciones/${id}/iniciar`, { method: 'POST', body: data }),
  pausarOperacion: (id, notas) =>
    request(`/operaciones/${id}/pausar`, { method: 'POST', body: { notas } }),
  reanudarOperacion: (id, data) =>
    request(`/operaciones/${id}/reanudar`, { method: 'POST', body: data }),
  completarOperacion: (id, notas) =>
    request(`/operaciones/${id}/completar`, { method: 'POST', body: { notas } }),

  // Registros
  getRegistros: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/registros${qs ? '?' + qs : ''}`);
  },

  // Detenciones
  registrarDetencion: (data) =>
    request('/registros/detenciones', { method: 'POST', body: data }),
  getDetenciones: (operacion_id) =>
    request(`/registros/detenciones?operacion_id=${operacion_id}`),

  // Bitácora
  agregarBitacora: (data) =>
    request('/registros/bitacora', { method: 'POST', body: data }),
  getBitacora: (operacion_id) =>
    request(`/registros/bitacora?operacion_id=${operacion_id}`),
};
