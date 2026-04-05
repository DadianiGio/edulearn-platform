import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Dashboard from './pages/Dashboard'
import CourseCatalog from './pages/CourseCatalog'
import CourseDetail from './pages/CourseDetail'
import LoginModal from './components/ui/LoginModal'
import RegisterModal from './components/ui/RegisterModal'

function App() {
  const [modal, setModal] = useState(null)

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar
          onLoginOpen={() => setModal('login')}
          onSignUpOpen={() => setModal('register')}
          onEnrolledOpen={() => {}}
        />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
        </Routes>

        {modal === 'login' && (
          <LoginModal
            onClose={() => setModal(null)}
            onSwitchToRegister={() => setModal('register')}
          />
        )}
        {modal === 'register' && (
          <RegisterModal
            onClose={() => setModal(null)}
            onSwitchToLogin={() => setModal('login')}
          />
        )}
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App