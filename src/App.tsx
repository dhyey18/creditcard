import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ApplyCard from './pages/ApplyCard'
import CreditScoreResult from './pages/CreditScoreResult'
import CardApproval from './pages/CardApproval'
import ActivateCard from './pages/ActivateCard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/apply" replace />} />
          <Route path="/apply" element={<ApplyCard />} />
          <Route path="/credit-score/:id" element={<CreditScoreResult />} />
          <Route path="/approval/:id" element={<CardApproval />} />
          <Route path="/activate" element={<ActivateCard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
