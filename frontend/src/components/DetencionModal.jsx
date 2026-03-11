import React, { useState } from 'react'
import { api } from '../api'

const MOTIVOS = [
  { value: 'falla_mecanica', label: 'Falla Mecanica' },
  { value: 'falta_material', label: 'Falta Material' },
  { value: 'cambio_formato', label: 'Cambio Formato' },
  { value: 'mantencion', label: 'Mantencion' },
  { value: 'otro', label: 'Otro' },
]

export default function DetencionModal({ operacion, onClose }) {
  const [motivo, setMotivo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [duracion, setDuracion] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!motivo) return
    setSubmitting(true)
    try {
      await api.registrarDetencion({
        operacion_id: operacion.id,
        motivo,
        descripcion: descripcion || null,
        duracion_minutos: duracion ? parseInt(duracion) : null
      })
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Registrar Detencion</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
          {operacion.ot_codigo} — {operacion.nombre}
        </p>

        {/* Motivo - botones grandes para touch */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-muted)', fontSize: '0.9rem' }}>MOTIVO</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {MOTIVOS.map(m => (
              <button
                key={m.value}
                onClick={() => setMotivo(m.value)}
                className={motivo === m.value ? 'btn-danger' : 'btn-ghost'}
                style={{ padding: '14px 12px', fontSize: '1rem' }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Duración */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-muted)', fontSize: '0.9rem' }}>DURACION (minutos, opcional)</label>
          <input
            type="number"
            placeholder="ej: 30"
            value={duracion}
            onChange={e => setDuracion(e.target.value)}
            inputMode="numeric"
          />
        </div>

        {/* Descripción */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-muted)', fontSize: '0.9rem' }}>DESCRIPCION (opcional)</label>
          <textarea
            placeholder="Detalle breve..."
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            rows={3}
          />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancelar</button>
          <button
            className="btn-danger btn-lg"
            style={{ flex: 2 }}
            disabled={!motivo || submitting}
            onClick={handleSubmit}
          >
            {submitting ? 'Registrando...' : 'Registrar Detencion'}
          </button>
        </div>
      </div>
    </div>
  )
}
