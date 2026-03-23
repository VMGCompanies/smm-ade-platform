import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import Dashboard from './pages/Dashboard'
import MaiWorkspace from './pages/MaiWorkspace'
import NataliaWorkspace from './pages/NataliaWorkspace'
import Collections from './pages/Collections'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="mai" element={<MaiWorkspace />} />
          <Route path="natalia" element={<NataliaWorkspace />} />
          <Route path="collections" element={<Collections />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
