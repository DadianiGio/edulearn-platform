import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

const imgClose = "https://www.figma.com/api/mcp/asset/42b40eaf-803e-4de2-9618-a8f03f0913a4"

// Reusable input style
const inputStyle = (hasError) => ({
  width: '100%', height: '48px',
  border: `1.5px solid ${hasError ? '#ef4444' : '#d1d1d1'}`,
  borderRadius: '8px', padding: '12px 15px',
  fontFamily: 'Inter', fontSize: '14px', color: '#141414',
  outline: 'none', boxSizing: 'border-box',
})

const labelStyle = {
  display: 'block', fontFamily: 'Inter', fontWeight: 500,
  fontSize: '14px', color: '#3d3d3d', marginBottom: '8px',
}

const errorStyle = { color: '#ef4444', fontSize: '12px', marginTop: '4px' }

export default function RegisterModal({ onClose, onSwitchToLogin }) {
  const { login } = useAuth()
  const [step, setStep] = useState(1) // 1=email, 2=password, 3=username+avatar
  const [formData, setFormData] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarError, setAvatarError] = useState('')
  const [apiErrors, setApiErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm()

  // Progress bar colors per step
  const stepColors = ['#B7B3F4', '#EEEDFC', '#EEEDFC']
  const getBarColor = (barIndex) => {
    if (barIndex < step) return '#4F46E5'
    if (barIndex === step - 1) return '#B7B3F4'
    return '#EEEDFC'
  }

  const handleNext = (data) => {
    setFormData(prev => ({ ...prev, ...data }))
    setStep(prev => prev + 1)
    reset()
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      setAvatarError('Only JPG, PNG or WebP allowed')
      return
    }
    setAvatarError('')
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleFinalSubmit = async (data) => {
    setIsSubmitting(true)
    setApiErrors({})
    const payload = new FormData()
    payload.append('username', data.username)
    payload.append('email', formData.email)
    payload.append('password', formData.password)
    payload.append('password_confirmation', formData.password_confirmation)
    if (avatarFile) payload.append('avatar', avatarFile)

    try {
      const res = await api.post('/register', payload)
      login(res.data.data.user, res.data.data.token)
      onClose()
    } catch (err) {
      const errs = err.response?.data?.errors || {}
      setApiErrors(errs)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        backgroundColor: '#fff', borderRadius: '12px',
        padding: '50px', width: '460px', position: 'relative',
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '20px', right: '20px',
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}>
          <img src={imgClose} alt="close" style={{ width: '24px', height: '24px' }} />
        </button>

        {/* Back button on steps 2 & 3 */}
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} style={{
            position: 'absolute', top: '20px', left: '20px',
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '20px', color: '#525252',
          }}>←</button>
        )}

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '32px', color: '#141414', marginBottom: '6px' }}>
            Create Account
          </h2>
          <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#666' }}>
            Join and start learning today
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              flex: 1, height: '8px', borderRadius: '30px',
              backgroundColor: i < step ? '#4F46E5' : i === step - 1 ? '#B7B3F4' : '#EEEDFC',
            }} />
          ))}
        </div>

        {/* STEP 1 — Email */}
        {step === 1 && (
          <form onSubmit={handleSubmit(handleNext)}>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Email*</label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                  minLength: { value: 3, message: 'Min 3 characters' },
                })}
                style={inputStyle(errors.email)}
              />
              {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
            </div>
            <button type="submit" style={{
              width: '100%', height: '47px', backgroundColor: '#4F46E5',
              color: '#fff', border: 'none', borderRadius: '8px',
              fontFamily: 'Inter', fontWeight: 500, fontSize: '16px', cursor: 'pointer',
            }}>Next</button>
          </form>
        )}

        {/* STEP 2 — Password */}
        {step === 2 && (
          <form onSubmit={handleSubmit(handleNext)}>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Password*</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 3, message: 'Min 3 characters' },
                  })}
                  style={{ ...inputStyle(errors.password), paddingRight: '40px' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#8a8a8a',
                }}>
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
              {errors.password && <p style={errorStyle}>{errors.password.message}</p>}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Confirm Password*</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password_confirmation', {
                    required: 'Please confirm your password',
                    validate: val => val === watch('password') || 'Passwords do not match',
                  })}
                  style={{ ...inputStyle(errors.password_confirmation), paddingRight: '40px' }}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#8a8a8a',
                }}>
                  {showConfirm ? '🙈' : '👁'}
                </button>
              </div>
              {errors.password_confirmation && <p style={errorStyle}>{errors.password_confirmation.message}</p>}
            </div>

            <button type="submit" style={{
              width: '100%', height: '47px', backgroundColor: '#4F46E5',
              color: '#fff', border: 'none', borderRadius: '8px',
              fontFamily: 'Inter', fontWeight: 500, fontSize: '16px', cursor: 'pointer',
            }}>Next</button>
          </form>
        )}

        {/* STEP 3 — Username + Avatar */}
        {step === 3 && (
          <form onSubmit={handleSubmit(handleFinalSubmit)}>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Username*</label>
              <input
                type="text"
                placeholder="Your username"
                {...register('username', {
                  required: 'Username is required',
                  minLength: { value: 3, message: 'Min 3 characters' },
                })}
                style={inputStyle(errors.username || apiErrors.username)}
              />
              {errors.username && <p style={errorStyle}>{errors.username.message}</p>}
              {apiErrors.username && <p style={errorStyle}>{apiErrors.username[0]}</p>}
              {apiErrors.email && <p style={errorStyle}>Email: {apiErrors.email[0]}</p>}
            </div>

            {/* Avatar upload */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Avatar (optional)</label>
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', border: '1.5px dashed #d1d1d1',
                borderRadius: '8px', padding: '20px', cursor: 'pointer',
                backgroundColor: '#fafafa',
              }}>
                {avatarPreview
                  ? <img src={avatarPreview} alt="preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
                  : <>
                      <span style={{ fontSize: '24px', marginBottom: '8px' }}>⬆</span>
                      <span style={{ fontSize: '13px', color: '#666' }}>Click to upload avatar</span>
                      <span style={{ fontSize: '12px', color: '#8a8a8a' }}>JPG, PNG or WebP</span>
                    </>
                }
                <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleAvatarChange} style={{ display: 'none' }} />
              </label>
              {avatarError && <p style={errorStyle}>{avatarError}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} style={{
              width: '100%', height: '47px', backgroundColor: isSubmitting ? '#736BEA' : '#4F46E5',
              color: '#fff', border: 'none', borderRadius: '8px',
              fontFamily: 'Inter', fontWeight: 500, fontSize: '16px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}>
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        )}

        {/* Divider + Footer */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', gap: '8px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#d1d1d1' }} />
          <span style={{ fontFamily: 'Inter', fontSize: '14px', color: '#8a8a8a' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#d1d1d1' }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontFamily: 'Inter', fontSize: '12px', color: '#666' }}>Already have an account? </span>
          <button onClick={onSwitchToLogin} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'Inter', fontWeight: 500, fontSize: '14px',
            color: '#141414', textDecoration: 'underline',
          }}>Log In</button>
        </div>
      </div>
    </div>
  )
}