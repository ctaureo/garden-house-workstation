import React, { useState, useEffect } from 'react'
import { api } from '../api'

export default function IniciarOperacionModal({ operacion, supervisor, estacion, onClose, reanudar }) {
  const [trabajadores, setTrabajadores] = useState([])
  const [seleccionados, setSeleccionados] = useState([])
  const [buscar, setBuscar] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [advertencias, setAdvertencias] = useState([])

  useEffect(() => {
    api.getTrabajadores({ rol: 'operador' })
      .then(setTrabajadores)
      .finally(() => setLoading(false))
  }, [])

  const filtrados = trabajadores.filter(t =>
    !buscar || t.nombre.toLowerCase().includes(buscar.toLowerCase()) || t.rut.includes(buscar)
  )

  const toggleTrabajador = (t) => {
    setSeleccionados(prev =>
      prev.find(s => s.id === t.id)
        ? prev.filter(s => s.id !== t.id)
        : [...prev, t]
    )
  }

  const handleSubmit = async () => {
    if (seleccionados.length === 0) return
    setSubmitting(true)
    try {
      const data = {
        trabajador_ids: seleccionados.map(t => t.id),
        supervisor_id: supervisor.id,
        estacion_trabajo_id: estacion.id
      }

      let result
      if (reanudar) {
        result = await api.reanudarOperacion(operacion.id, data)
      } else {
        result = await api.iniciarOperacion(operacion.id, data)
      }

      if (result.advertencias?.length > 0) {
        setAdvertencias(result.advertencias)
      }
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
        <h2>{reanudar ? 'Reanudar' : 'Iniciar'} Operacion</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
          {operacion.ot_codigo} — {operacion.nombre}
        </p>

        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar por nombre o RUT..."
          value={buscar}
          onChange={e => setBuscar(e.target.value)}
          autoFocus
          style={{ marginBottom: 12 }}
        />

        {/* Seleccionados */}
        {seleccionados.length > 0 && (
          <div style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {seleccionados.map(t => (
              <button
                key={t.id}
                onClick={() => toggleTrabajador(t)}
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: 20,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                {t.nombre} ✕
              </button>
            ))}
          </div>
        )}

        {/* Lista de trabajadores */}
        <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 16 }}>
          {loading ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Cargando...</p>
          ) : (
            filtrados.map(t => {
              const isSelected = seleccionados.find(s => s.id === t.id)
              return (
                <button
                  key={t.id}
                  onClick={() => toggleTrabajador(t)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: isSelected ? 'var(--primary)' : 'transparent',
                    color: isSelected ? 'white' : 'var(--text)',
                    borderRadius: 8,
                    marginBottom: 4,
                    textAlign: 'left',
                    border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                    fontSize: '1rem'
                  }}
                >
                  <span>{t.nombre}</span>
                  <span style={{ opacity: 0.7, fontSize: '0.85rem' }}>{t.rut}</span>
                </button>
              )
            })
          )}
        </div>

        {/* Advertencias */}
        {advertencias.length > 0 && (
          <div style={{ background: 'var(--warning-bg)', padding: 12, borderRadius: 8, marginBottom: 12 }}>
            {advertencias.map((a, i) => (
              <p key={i} style={{ color: 'var(--warning)', fontSize: '0.9rem' }}>{a.mensaje}</p>
            ))}
          </div>
        )}

        {/* Acciones */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancelar</button>
          <button
            className="btn-success btn-lg"
            style={{ flex: 2 }}
            disabled={seleccionados.length === 0 || submitting}
            onClick={handleSubmit}
          >
            {submitting ? 'Procesando...' : `${reanudar ? 'Reanudar' : 'Iniciar'} con ${seleccionados.length} trabajador${seleccionados.length !== 1 ? 'es' : ''}`}
          </button>
        </div>
      </div>
    </div>
  )
}
