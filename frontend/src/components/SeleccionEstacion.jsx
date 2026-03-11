import React, { useState, useEffect } from 'react'
import { api } from '../api'

export default function SeleccionEstacion({ supervisor, onSelect, onLogout }) {
  const [estaciones, setEstaciones] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getEstaciones()
      .then(setEstaciones)
      .catch(() => setEstaciones([]))
      .finally(() => setLoading(false))
  }, [])

  // Agrupar por ubicación
  const porUbicacion = estaciones.reduce((acc, e) => {
    const key = e.ubicacion || 'Sin ubicación'
    if (!acc[key]) acc[key] = []
    acc[key].push(e)
    return acc
  }, {})

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.3rem' }}>Seleccionar Estacion</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Supervisor: {supervisor.nombre}</p>
        </div>
        <button className="btn-ghost" onClick={onLogout}>Salir</button>
      </header>

      <div className="scroll-y" style={{ flex: 1, padding: 24 }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Cargando estaciones...</p>
        ) : (
          Object.entries(porUbicacion).map(([ubicacion, ests]) => (
            <div key={ubicacion} style={{ marginBottom: 24 }}>
              <h3 style={{ color: 'var(--text-muted)', marginBottom: 12, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                {ubicacion}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                {ests.map(e => (
                  <button
                    key={e.id}
                    className="card"
                    style={{ textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border)' }}
                    onClick={() => onSelect(e)}
                  >
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>{e.nombre}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{e.codigo}</div>
                    {e.operaciones_activas > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <span className="badge badge-en_proceso">{e.operaciones_activas} activa{e.operaciones_activas > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
