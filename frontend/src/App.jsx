import React, { useState, useEffect } from 'react'
import { api } from './api'
import SeleccionEstacion from './components/SeleccionEstacion'
import EstacionDashboard from './components/EstacionDashboard'
import SupervisorLogin from './components/SupervisorLogin'

export default function App() {
  const [supervisor, setSupervisor] = useState(null)
  const [estacion, setEstacion] = useState(null)

  // Paso 1: Login de supervisor
  if (!supervisor) {
    return <SupervisorLogin onLogin={setSupervisor} />
  }

  // Paso 2: Selección de estación
  if (!estacion) {
    return (
      <SeleccionEstacion
        supervisor={supervisor}
        onSelect={setEstacion}
        onLogout={() => setSupervisor(null)}
      />
    )
  }

  // Paso 3: Dashboard de estación
  return (
    <EstacionDashboard
      estacion={estacion}
      supervisor={supervisor}
      onBack={() => setEstacion(null)}
    />
  )
}
