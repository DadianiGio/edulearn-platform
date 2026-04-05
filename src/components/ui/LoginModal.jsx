import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

const imgClose = "https://www.figma.com/api/mcp/asset/61e54db1-13b2-4ffd-96a3-fdf29c4069d3"

export default function LoginModal({ onClose, onSwitchToRegister }) {
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    setApiError('')
    try {
      const res = await api.post('/login', data)
      login(res.data.data.user, res.data.data.token)
      onClose()
    } catch (err) {
      setApiError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    /* Overlay */
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      {/* Modal box — stop click from closing when clicking inside */}
      <div onClick={e => e.stopPropagation()} style={{
        backgroundColor: '#fff', borderRadius: '12px',
        padding: '50px', width: '460px', position: 'relative',
      }}>
        {/* Close button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '20px', right: '20px',
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}>
          <img src={imgClose} alt="close" style={{ width: '24px', height: '24px' }} />
        </button>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '32px', color: '#141414', marginBottom: '6px' }}>
            Welcome Back
          </h2>
          <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#666' }}>
            Log in to continue your learning
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#3d3d3d', marginBottom: '8px' }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register('email', {
                required: 'Email is required',
                minLength: { value: 3, message: 'Must be at least 3 characters' },
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' }
              })}
              style={{
                width: '100%', height: '48px', border: `1.5px solid ${errors.email ? '#ef4444' : '#d1d1d1'}`,
                borderRadius: '8px', padding: '12px 15px', fontFamily: 'Inter',
                fontSize: '14px', color: '#141414', outline: 'none', boxSizing: 'border-box',
              }}
            />
            {errors.email && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#3d3d3d', marginBottom: '8px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 3, message: 'Must be at least 3 characters' }
                })}
                style={{
                  width: '100%', height: '48px', border: `1.5px solid ${errors.password ? '#ef4444' : '#d1d1d1'}`,
                  borderRadius: '8px', padding: '12px 40px 12px 15px', fontFamily: 'Inter',
                  fontSize: '14px', color: '#141414', outline: 'none', boxSizing: 'border-box',
                }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#8a8a8a',
                fontSize: '16px',
              }}>
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
            {errors.password && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.password.message}</p>}
          </div>

          {/* API error */}
          {apiError && <p style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center', marginBottom: '12px' }}>{apiError}</p>}

          {/* Submit */}
          <button type="submit" disabled={isSubmitting} style={{
            width: '100%', height: '47px', backgroundColor: isSubmitting ? '#736BEA' : '#4F46E5',
            color: '#fff', border: 'none', borderRadius: '8px', cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontFamily: 'Inter', fontWeight: 500, fontSize: '16px',
          }}>
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', gap: '8px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#d1d1d1' }} />
          <span style={{ fontFamily: 'Inter', fontSize: '14px', color: '#8a8a8a' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#d1d1d1' }} />
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontFamily: 'Inter', fontSize: '12px', color: '#666' }}>Don't have an account? </span>
          <button onClick={onSwitchToRegister} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'Inter', fontWeight: 500, fontSize: '14px',
            color: '#141414', textDecoration: 'underline',
          }}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}