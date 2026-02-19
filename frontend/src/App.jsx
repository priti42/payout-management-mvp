import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Vendors from './pages/Vendors'
import Payouts from './pages/Payouts'

function App() {
  return (
    <Router>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/payouts" element={<Payouts />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
