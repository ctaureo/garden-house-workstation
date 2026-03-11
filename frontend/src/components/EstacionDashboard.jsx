import React, { useState, useEffect, useCallback } from 'react'
import { api } from '../api'
import OperacionCard from './OperacionCard'
import IniciarOperacionModal from './IniciarOperacionModal'
import DetencionModal from './DetencionModal'
import BitacoraModal from './BitacoraModal'
import AsignarOperacionModal from './AsignarOperacionModal'

export default function EstacionDashboard({ estacion, supervisor, onBack }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // { type: 'iniciar'|'detencion'|'bitacora'|'asignar', operacion }
  const [reloj, setReloj] = useState(new Date())

  const refresh = useCallback(() => {
    api.getEstacion(estacion.id)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [estacion.id])

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 10000) // Refresh cada 10s
    return () => clearInterval(interval)
  }, [refresh])

  // Reloj
  useEffect(() => {
    const t = setInterval(() => setReloj(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const enProceso = data?.operaciones?.filter(o => o.estado === 'en_proceso' || o.estado === 'pausada') || []
  const pendientes = data?.operaciones?.filter(o => o.estado === 'pendiente') || []

  const handleAction = async (action, operacion, extra) => {
    try {
      if (action === 'pausar') {
        await api.pausarOperacion(operacion.id)
      } else if (action === 'completar') {
        await api.completarOperacion(operacion.id)
      }
      refresh()
    } catch (err) {
      console.error(err)
    }
  }

  const closeModal = () => {
    setModal(null)
    refresh()
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        padding: '12px 24px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--surface)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button className="btn-ghost" onClick={onBack} style={{ padding: '8px 12px' }}>
            ← Estaciones
          </button>
          <div>
            <h1 style={{ fontSize: '1.2rem' }}>{estacion.nombre}</h1>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{estacion.codigo} — {estacion.ubicacion}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
            {reloj.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{supervisor.nombre}</div>
        </div>
      </header>

      {/* Content */}
      <div className="scroll-y" style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 40 }}>Cargando...</p>
        ) : (
          <>
            {/* Operaciones activas */}
            {enProceso.length > 0 && (
              <section>
                <h2 style={{ marginBottom: 12, fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
                  En Proceso ({enProceso.length})
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {enProceso.map(op => (
                    <OperacionCard
                      key={op.id}
                      operacion={op}
                      onPausar={() => handleAction('pausar', op)}
                      onCompletar={() => handleAction('completar', op)}
                      onReanudar={() => setModal({ type: 'reanudar', operacion: op })}
                      onDetencion={() => setModal({ type: 'detencion', operacion: op })}
                      onBitacora={() => setModal({ type: 'bitacora', operacion: op })}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Operaciones pendientes */}
            {pendientes.length > 0 && (
              <section>
                <h2 style={{ marginBottom: 12, fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Pendientes ({pendientes.length})
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {pendientes.map(op => (
                    <OperacionCard
                      key={op.id}
                      operacion={op}
                      onIniciar={() => setModal({ type: 'iniciar', operacion: op })}
                    />
                  ))}
                </div>
              </section>
            )}

            {enProceso.length === 0 && pendientes.length === 0 && (
              <div style={{ textAlign: 'center', marginTop: 60, color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '1.2rem', marginBottom: 12 }}>No hay operaciones en esta estacion</p>
                <button className="btn-primary btn-lg" onClick={() => setModal({ type: 'asignar' })}>
                  + Asignar Operacion
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer con acciones rápidas */}
      <footer style={{
        padding: '12px 24px',
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
        display: 'flex',
        gap: 12,
        flexShrink: 0
      }}>
        <button className="btn-primary" style={{ flex: 1 }} onClick={() => setModal({ type: 'asignar' })}>
          + Asignar Operacion
        </button>
      </footer>

      {/* Modales */}
      {modal?.type === 'iniciar' && (
        <IniciarOperacionModal operacion={modal.operacion} supervisor={supervisor} estacion={estacion} onClose={closeModal} />
      )}
      {modal?.type === 'reanudar' && (
        <IniciarOperacionModal operacion={modal.operacion} supervisor={supervisor} estacion={estacion} onClose={closeModal} reanudar />
      )}
      {modal?.type === 'detencion' && (
        <DetencionModal operacion={modal.operacion} onClose={closeModal} />
      )}
      {modal?.type === 'bitacora' && (
        <BitacoraModal operacion={modal.operacion} supervisor={supervisor} onClose={closeModal} />
      )}
      {modal?.type === 'asignar' && (
        <AsignarOperacionModal estacion={estacion} onClose={closeModal} />
      )}
    </div>
  )
}
