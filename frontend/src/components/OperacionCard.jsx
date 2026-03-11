import React, { useState, useEffect } from 'react'

function formatDuration(startStr) {
  if (!startStr) return '--:--'
  const start = new Date(startStr + 'Z')
  const diff = Math.floor((Date.now() - start.getTime()) / 1000)
  const h = Math.floor(diff / 3600)
  const m = Math.floor((diff % 3600) / 60)
  return `${h}h ${String(m).padStart(2, '0')}m`
}

export default function OperacionCard({ operacion, onIniciar, onPausar, onCompletar, onReanudar, onDetencion, onBitacora }) {
  const [, setTick] = useState(0)
  const op = operacion

  // Actualizar duración cada 30s
  useEffect(() => {
    if (op.estado !== 'en_proceso') return
    const t = setInterval(() => setTick(n => n + 1), 30000)
    return () => clearInterval(t)
  }, [op.estado])

  const isPausada = op.estado === 'pausada'
  const isEnProceso = op.estado === 'en_proceso'
  const isPendiente = op.estado === 'pendiente'

  return (
    <div className="card" style={{
      borderLeft: `4px solid ${isEnProceso ? 'var(--primary)' : isPausada ? 'var(--warning)' : 'var(--border)'}`,
    }}>
      {/* Header de la card */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{op.ot_codigo}</span>
            <span className={`badge badge-${op.estado}`}>{op.estado.replace('_', ' ')}</span>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 2 }}>
            {op.producto_nombre} — {op.cliente_nombre}
          </div>
        </div>
        {isEnProceso && (
          <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)' }}>
              {formatDuration(op.fecha_inicio)}
            </div>
          </div>
        )}
      </div>

      {/* Info de operación */}
      <div style={{ marginBottom: 12, padding: '8px 12px', background: 'var(--bg)', borderRadius: 8 }}>
        <div style={{ fontWeight: 600 }}>
          Operacion {op.numero_secuencia}/{op.total_operaciones}: {op.nombre}
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Cantidad: {op.ot_cantidad?.toLocaleString()}
        </div>
      </div>

      {/* Trabajadores activos */}
      {op.trabajadores_activos?.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>EQUIPO:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {op.trabajadores_activos.map(t => (
              <span key={t.trabajador_id} style={{
                background: 'var(--bg)',
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: '0.85rem'
              }}>
                {t.nombre} <span style={{ color: 'var(--text-muted)' }}>({t.rut})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Acciones */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {isPendiente && onIniciar && (
          <button className="btn-success btn-lg" style={{ flex: 1 }} onClick={onIniciar}>
            Iniciar
          </button>
        )}
        {isEnProceso && (
          <>
            <button className="btn-warning" style={{ flex: 1 }} onClick={onPausar}>Pausar</button>
            <button className="btn-success" style={{ flex: 1 }} onClick={onCompletar}>Completar</button>
            <button className="btn-danger" onClick={onDetencion}>Detencion</button>
            <button className="btn-ghost" onClick={onBitacora}>Bitacora</button>
          </>
        )}
        {isPausada && (
          <>
            <button className="btn-primary btn-lg" style={{ flex: 1 }} onClick={onReanudar}>Reanudar</button>
            <button className="btn-ghost" onClick={onBitacora}>Bitacora</button>
          </>
        )}
      </div>
    </div>
  )
}
