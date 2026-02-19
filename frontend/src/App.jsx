import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Vendors from './pages/Vendors'
import Payouts from './pages/Payouts'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/payouts" element={<Payouts />} />
      </Routes>
    </Router>
  )
}

export default App
