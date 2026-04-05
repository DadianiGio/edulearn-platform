import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Dashboard from './pages/Dashboard'
import CourseCatalog from './pages/CourseCatalog'
import CourseDetail from './pages/CourseDetail'
import LoginModal from './components/ui/LoginModal'
import RegisterModal from './components/ui/RegisterModal'
import ProfileModal from './components/ui/ProfileModal'
import EnrolledSidebar from './components/ui/EnrolledSidebar'

function AppInner() {
  const [modal, setModal] = useState(null) // 'login'|'register'|'profile'|'enrolled'

  const openLogin = () => setModal('login')
  const openProfile = () => setModal('profile')
  const openEnrolled = () => setModal('enrolled')
  const closeAll = () => setModal(null)

  return (
    <>
      <Navbar
        onLoginOpen={openLogin}
        onSignUpOpen={() => setModal('register')}
        onEnrolledOpen={openEnrolled}
        onProfileOpen={openProfile}
      />
      <Routes>
        <Route path="/" element={<Dashboard onLoginOpen={openLogin} onEnrolledOpen={openEnrolled} />} />
        <Route path="/courses" element={<CourseCatalog />} />
        <Route path="/courses/:id" element={<CourseDetail onLoginOpen={openLogin} onProfileOpen={openProfile} />} />
      </Routes>

      {modal === 'login' && <LoginModal onClose={closeAll} onSwitchToRegister={() => setModal('register')} />}
      {modal === 'register' && <RegisterModal onClose={closeAll} onSwitchToLogin={() => setModal('login')} />}
      {modal === 'profile' && <ProfileModal onClose={closeAll} />}
      {modal === 'enrolled' && <EnrolledSidebar onClose={closeAll} onLoginOpen={openLogin} />}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </AuthProvider>
  )
}