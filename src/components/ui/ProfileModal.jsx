import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

const imgClose = "https://www.figma.com/api/mcp/asset/4ffdc502-df8c-4b18-8b1a-4e98f9d6fcbb"
const imgUploadIcon = "https://www.figma.com/api/mcp/asset/3d735fe7-43b4-490f-9bf7-da0743fb8472"

const label = { display:'block', fontFamily:'Inter', fontWeight:500, fontSize:'14px', color:'#3d3d3d', marginBottom:'8px' }
const inp = (err, dis) => ({ width:'100%', height:'48px', border:`1.5px solid ${err?'#ef4444':'#d1d1d1'}`, borderRadius:'8px', padding:'12px 15px', fontFamily:'Inter', fontSize:'14px', color:'#141414', outline:'none', boxSizing:'border-box', backgroundColor:dis?'#f5f5f5':'#fff', cursor:dis?'not-allowed':'text' })
const err = { color:'#ef4444', fontSize:'12px', marginTop:'4px' }

export default function ProfileModal({ onClose }) {
  const { user, setUser } = useAuth()
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarError, setAvatarError] = useState('')
  const [apiErrors, setApiErrors] = useState({})
  const [successMsg, setSuccessMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { full_name: user?.fullName||'', mobile_number: user?.mobileNumber||'', age: user?.age||'' }
  })

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!['image/jpeg','image/jpg','image/png','image/webp'].includes(file.type)) { setAvatarError('Only JPG, PNG or WebP allowed'); return }
    setAvatarError(''); setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file))
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true); setApiErrors({}); setSuccessMsg('')
    const payload = new FormData()
    payload.append('full_name', data.full_name)
    payload.append('mobile_number', data.mobile_number.replace(/\s/g,''))
    payload.append('age', data.age)
    if (avatarFile) payload.append('avatar', avatarFile)
    try {
      const res = await api.post('/profile', payload)
      setUser(res.data.data)
      setSuccessMsg('Profile updated successfully')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch(e) { setApiErrors(e.response?.data?.errors||{}) }
    finally { setIsSubmitting(false) }
  }

  const handleClose = () => {
    if (!user?.profileComplete) {
      if (!window.confirm("Your profile is incomplete. You won't be able to enroll in courses until you complete it. Close anyway?")) return
    }
    onClose()
  }

  return (
    <div onClick={handleClose} style={{ position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, overflowY:'auto', padding:'20px' }}>
      <div onClick={e=>e.stopPropagation()} style={{ backgroundColor:'#fff', borderRadius:'12px', padding:'50px', width:'460px', position:'relative' }}>
        <button onClick={handleClose} style={{ position:'absolute', top:'20px', right:'20px', background:'none', border:'none', cursor:'pointer', padding:0 }}>
          <img src={imgClose} alt="close" style={{ width:'24px', height:'24px' }} />
        </button>
        <h2 style={{ fontFamily:'Inter', fontWeight:600, fontSize:'32px', color:'#141414', textAlign:'center', marginBottom:'24px' }}>Profile</h2>
        <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'24px' }}>
          <div style={{ position:'relative', width:'56px', height:'56px' }}>
            {avatarPreview
              ? <img src={avatarPreview} alt="avatar" style={{ width:'56px', height:'56px', borderRadius:'50%', objectFit:'cover' }} />
              : <div style={{ width:'56px', height:'56px', borderRadius:'50%', backgroundColor:'#EEEDFC', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px' }}>👤</div>
            }
            <span style={{ position:'absolute', bottom:2, right:2, width:'12px', height:'12px', borderRadius:'50%', backgroundColor:user?.profileComplete?'#1DC31D':'#F4A316', border:'2px solid white' }} />
          </div>
          <div>
            <p style={{ fontFamily:'Inter', fontWeight:600, fontSize:'20px', color:'#0a0a0a' }}>{user?.username}</p>
            <p style={{ fontFamily:'Inter', fontSize:'10px', color:user?.profileComplete?'#1DC31D':'#F4A316' }}>{user?.profileComplete ? 'Profile is Complete' : 'Profile is Incomplete'}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom:'12px' }}>
            <label style={label}>Full Name</label>
            <input type="text" placeholder="Your full name" {...register('full_name',{ required:'Name is required', minLength:{value:3,message:'Min 3 characters'}, maxLength:{value:50,message:'Max 50 characters'} })} style={inp(errors.full_name)} />
            {errors.full_name && <p style={err}>{errors.full_name.message}</p>}
            {apiErrors.full_name && <p style={err}>{apiErrors.full_name[0]}</p>}
          </div>
          <div style={{ marginBottom:'12px' }}>
            <label style={label}>Email</label>
            <input type="email" value={user?.email||''} disabled style={inp(false,true)} />
          </div>
          <div style={{ display:'flex', gap:'8px', marginBottom:'12px' }}>
            <div style={{ flex:1 }}>
              <label style={label}>Mobile Number</label>
              <input type="text" placeholder="5XX XXX XXX" {...register('mobile_number',{ required:'Mobile number is required', validate: v => { const d=v.replace(/\s/g,''); if(!d.startsWith('5')) return 'Must start with 5'; if(d.length!==9) return 'Must be exactly 9 digits'; if(!/^\d+$/.test(d)) return 'Numbers only'; return true } })} style={inp(errors.mobile_number)} />
              {errors.mobile_number && <p style={err}>{errors.mobile_number.message}</p>}
            </div>
            <div style={{ width:'100px' }}>
              <label style={label}>Age</label>
              <input type="number" placeholder="25" {...register('age',{ required:'Age is required', min:{value:16,message:'Must be at least 16'}, max:{value:120,message:'Enter a valid age'} })} style={inp(errors.age)} />
              {errors.age && <p style={err}>{errors.age.message}</p>}
            </div>
          </div>
          <div style={{ marginBottom:'24px' }}>
            <label style={label}>Upload Avatar</label>
            <label style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', border:'1.5px solid #d1d1d1', borderRadius:'8px', padding:'30px 20px', cursor:'pointer', backgroundColor:'#fff', width:'100%', boxSizing:'border-box' }}>
              <span style={{ fontSize:'24px', marginBottom:'8px' }}>⬆</span>
              <span style={{ fontFamily:'Inter', fontSize:'14px', color:'#666' }}>Drag and drop or <span style={{ color:'#281ed2', textDecoration:'underline' }}>Upload file</span></span>
              <span style={{ fontFamily:'Inter', fontSize:'12px', color:'#adadad', marginTop:'4px' }}>JPG, PNG or WebP</span>
              <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleAvatarChange} style={{ display:'none' }} />
            </label>
            {avatarError && <p style={err}>{avatarError}</p>}
            {avatarPreview && avatarFile && <p style={{ fontSize:'12px', color:'#1DC31D', marginTop:'4px' }}>✓ New avatar selected</p>}
          </div>
          {successMsg && <p style={{ color:'#1DC31D', fontSize:'13px', textAlign:'center', marginBottom:'12px' }}>{successMsg}</p>}
          <button type="submit" disabled={isSubmitting} style={{ width:'100%', height:'47px', backgroundColor:isSubmitting?'#736BEA':'#4F46E5', color:'#fff', border:'none', borderRadius:'8px', fontFamily:'Inter', fontWeight:500, fontSize:'16px', cursor:isSubmitting?'not-allowed':'pointer' }}>
            {isSubmitting ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}