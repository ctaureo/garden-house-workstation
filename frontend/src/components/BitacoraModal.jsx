import React, { useState, useEffect } from 'react'
import { api } from '../api'

export default function BitacoraModal({ operacion, supervisor, onClose }) {
  const [entries, setEntries] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loadEntries = () => {
    api.getBitacora(operacion.id).then(setEntries).catch(console.error)
  }

  useEffect(() => { loadEntries() }, [operacion.id])

  const handleSubmit = async () => {
    if (!mensaje.trim()) return
    setSubmitting(true)
    try {
      await api.agregarBitacora({
        operacion_id: operacion.id,
        trabajador_id: supervisor.id,
        mensaje: mensaje.trim()
      })
      setMensaje('')
      loadEntries()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Bitacora</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
          {operacion.ot_codigo} — {operacion.nombre}
        </p>

        {/* Input */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <textarea
            placeholder="Escribir nota..."
            value={mensaje}
            onChange={e => setMensaje(e.target.value)}
            rows={2}
            style={{ flex: 1 }}
          />
          <button
            className="btn-primary"
            disabled={!mensaje.trim() || submitting}
            onClick={handleSubmit}
            style={{ alignSelf: 'flex-end' }}
          >
            Enviar
          </button>
        </div>

        {/* Historial */}
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {entries.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Sin entradas</p>
          ) : (
            entries.map(e => (
              <div key={e.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{e.trabajador_nombre}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {new Date(e.created_at + 'Z').toLocaleString('es-CL')}
                  </span>
                </div>
                <p style={{ fontSize: '0.95rem' }}>{e.mensaje}</p>
              </div>
            ))
          )}
        </div>

        <button className="btn-ghost" style={{ width: '100%', marginTop: 16 }} onClick={onClose}>Cerrar</button>
      </div>
    </div>
  )
}
