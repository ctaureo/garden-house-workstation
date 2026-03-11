import React, { useState, useEffect } from 'react'
import { api } from '../api'

export default function SupervisorLogin({ onLogin }) {
  const [supervisores, setSupervisores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getTrabajadores({ rol: 'supervisor' })
      .then(setSupervisores)
      .catch(() => setSupervisores([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 32 }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>Garden House</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Workstation - Control de Operaciones</p>
      </div>

      <div style={{ width: '100%', maxWidth: 400 }}>
        <h2 style={{ marginBottom: 16, textAlign: 'center' }}>Identificar Supervisor</h2>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Cargando...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {supervisores.map(s => (
              <button
                key={s.id}
                className="btn-primary btn-lg"
                style={{ width: '100%', textAlign: 'left' }}
                onClick={() => onLogin(s)}
              >
                <div>{s.nombre}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{s.rut}</div>
              </button>
            ))}
            {supervisores.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay supervisores registrados</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
