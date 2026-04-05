import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Logo asset from Figma
const imgLogo = "https://www.figma.com/api/mcp/asset/f1b841ea-fbd0-477c-8286-0c88724f6b73"
const imgUser = "https://www.figma.com/api/mcp/asset/65fc79f9-2074-49ef-8f15-e33386ff1c76"

export default function Navbar({ onLoginOpen, onSignUpOpen, onEnrolledOpen }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <nav style={{
      backgroundColor: '#F5F5F5',
      borderBottom: '1px solid #D1D1D1',
      boxShadow: '0px 0px 11.7px 0px rgba(0,0,0,0.04)',
      padding: '24px 177px',
      width: '1920px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>

        {/* Logo */}
        <Link to="/">
          <img src={imgLogo} alt="Logo" style={{ width: '60px', height: '60px' }} />
        </Link>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>

          {/* Browse Courses — always visible */}
          <Link to="/courses" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '15px', borderRadius: '8px', textDecoration: 'none',
            color: '#525252', fontFamily: 'Inter', fontWeight: 500, fontSize: '20px',
          }}>
            Browse Courses
          </Link>

          {user ? (
            /* Authorized */
            <>
              <button onClick={onEnrolledOpen} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '15px', borderRadius: '8px', border: 'none',
                background: 'none', cursor: 'pointer',
                color: '#525252', fontFamily: 'Inter', fontWeight: 500, fontSize: '20px',
              }}>
                Enrolled Courses
              </button>

              {/* Avatar */}
              <button onClick={() => navigate('/profile')} style={{
                width: '56px', height: '56px', borderRadius: '50%',
                backgroundColor: '#EEEDFC', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                {user.avatar
                  ? <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  : <img src={imgUser} alt="user" style={{ width: '38px', height: '38px' }} />
                }
                {/* Profile incomplete indicator */}
                {!user.profileComplete && (
                  <span style={{
                    position: 'absolute', bottom: 2, right: 2,
                    width: '12px', height: '12px', borderRadius: '50%',
                    backgroundColor: '#F4A316', border: '2px solid white',
                  }} />
                )}
              </button>
            </>
          ) : (
            /* Unauthorized */
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <button onClick={onLoginOpen} style={{
                border: '2px solid #958FEF', borderRadius: '8px', background: 'none',
                padding: '12px 16px', width: '114px', height: '60px', cursor: 'pointer',
                color: '#4F46E5', fontFamily: 'Inter', fontWeight: 500, fontSize: '20px',
              }}>
                Log In
              </button>
              <button onClick={onSignUpOpen} style={{
                backgroundColor: '#4F46E5', borderRadius: '8px', border: 'none',
                padding: '17px 25px', height: '60px', cursor: 'pointer',
                color: '#FFFFFF', fontFamily: 'Inter', fontWeight: 500, fontSize: '20px',
              }}>
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}