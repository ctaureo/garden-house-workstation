import React, { useState, useEffect } from 'react'
import { api } from '../api'

export default function AsignarOperacionModal({ estacion, onClose }) {
  const [operaciones, setOperaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState(null)

  useEffect(() => {
    api.getOperacionesPendientes()
      .then(setOperaciones)
      .finally(() => setLoading(false))
  }, [])

  const handleAsignar = async (op) => {
    setAssigning(op.id)
    try {
      await api.asignarEstacion(op.id, estacion.id)
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setAssigning(null)
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Asignar Operacion a {estacion.nombre}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
          Selecciona una operacion pendiente para asignarla a esta estacion
        </p>

        <div style={{ maxHeight: 500, overflowY: 'auto' }}>
          {loading ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Cargando...</p>
          ) : operaciones.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No hay operaciones pendientes</p>
          ) : (
            operaciones.map(op => (
              <div key={op.id} className="card" style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{op.ot_codigo}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {op.producto_nombre} — {op.cliente_nombre}
                  </div>
                  <div style={{ fontSize: '0.9rem', marginTop: 4 }}>
                    Op {op.numero_secuencia}: {op.nombre}
                  </div>
                </div>
                <button
                  className="btn-primary"
                  disabled={assigning === op.id}
                  onClick={() => handleAsignar(op)}
                >
                  {assigning === op.id ? '...' : 'Asignar'}
                </button>
              </div>
            ))
          )}
        </div>

        <button className="btn-ghost" style={{ width: '100%', marginTop: 16 }} onClick={onClose}>Cerrar</button>
      </div>
    </div>
  )
}
