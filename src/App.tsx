import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import Dashboard from './pages/Dashboard'
import MaiWorkspace from './pages/MaiWorkspace'
import NataliaWorkspace from './pages/NataliaWorkspace'
import Collections from './pages/Collections'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Workflows from './pages/Workflows'
import DocumentIntelligence from './components/upload/DocumentIntelligence'
import WhatIfEngine from './components/scenarios/WhatIfEngine'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="mai" element={<MaiWorkspace />} />
          <Route path="natalia" element={<NataliaWorkspace />} />
          <Route path="collections" element={<Collections />} />
          <Route path="workflows" element={<Workflows />} />
          <Route path="documents" element={<DocumentIntelligence />} />
          <Route path="scenarios" element={<WhatIfEngine />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
