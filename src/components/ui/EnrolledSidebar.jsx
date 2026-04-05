import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

export default function EnrolledSidebar({ onClose, onLoginOpen }) {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    api.get('/enrollments').then(r => setEnrollments(r.data.data)).catch(()=>{}).finally(()=>setLoading(false))
  }, [user])

  if (!user) {
    onLoginOpen()
    return null
  }

  const totalPrice = enrollments.reduce((a,e)=>a+e.totalPrice,0)
  const totalCount = enrollments.reduce((a,e)=>a+e.quantity,0)

  const handleCompleteEnrollment = async () => {
    setShowConfirm(true)
  }

  const handleConfirmClose = () => {
    setShowConfirm(false)
    setEnrollments([])
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{ position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.5)', zIndex:999 }} />

      {/* Sidebar */}
      <div style={{ position:'fixed', right:0, top:0, bottom:0, width:'794px', backgroundColor:'#fff', zIndex:1000, overflowY:'auto', boxShadow:'-4px 0 20px rgba(0,0,0,0.1)' }}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'42px 57px 24px', borderBottom:'1px solid #f5f5f5' }}>
          <h2 style={{ fontFamily:'Inter', fontWeight:600, fontSize:'40px', color:'#141414' }}>Enrolled Courses</h2>
          <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
            <span style={{ fontFamily:'Inter', fontSize:'16px', color:'#666' }}>Total Enrollments {totalCount}</span>
            <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'24px', color:'#525252' }}>✕</button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding:'32px 57px' }}>
          {loading ? (
            <p style={{ fontFamily:'Inter', color:'#666' }}>Loading...</p>
          ) : enrollments.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'80px 0', gap:'24px' }}>
              <span style={{ fontSize:'64px' }}>📦</span>
              <h3 style={{ fontFamily:'Inter', fontWeight:600, fontSize:'24px', color:'#141414', textAlign:'center' }}>No Enrolled Courses Yet</h3>
              <p style={{ fontFamily:'Inter', fontSize:'16px', color:'#666', textAlign:'center' }}>Start your learning journey by exploring our courses</p>
              <button onClick={onClose} style={{ backgroundColor:'#4F46E5', color:'#fff', border:'none', borderRadius:'8px', padding:'16px 32px', fontFamily:'Inter', fontWeight:500, fontSize:'16px', cursor:'pointer' }}>Browse Courses</button>
            </div>
          ) : (
            <>
              <div style={{ display:'flex', flexDirection:'column', gap:'16px', marginBottom:'32px' }}>
                {enrollments.map(e => (
                  <div key={e.id} style={{ backgroundColor:'#f9f9f9', borderRadius:'12px', padding:'20px', display:'flex', gap:'16px', alignItems:'flex-start' }}>
                    <div style={{ width:'80px', height:'80px', borderRadius:'8px', overflow:'hidden', flexShrink:0 }}>
                      <img src={e.course.image} alt={e.course.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontFamily:'Inter', fontWeight:600, fontSize:'16px', color:'#141414', marginBottom:'4px' }}>{e.course.title}</p>
                      <p style={{ fontFamily:'Inter', fontSize:'13px', color:'#666', marginBottom:'4px' }}>{e.schedule?.weeklySchedule?.label} • {e.schedule?.timeSlot?.label}</p>
                      <p style={{ fontFamily:'Inter', fontSize:'13px', color:'#666', marginBottom:'4px', textTransform:'capitalize' }}>Session: {e.schedule?.sessionType?.name}</p>
                      {e.schedule?.sessionType?.location && <p style={{ fontFamily:'Inter', fontSize:'13px', color:'#8a8a8a', marginBottom:'8px' }}>📍 {e.schedule.sessionType.location}</p>}
                      <div style={{ marginBottom:'8px' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                          <span style={{ fontFamily:'Inter', fontSize:'12px', color:'#141414' }}>{e.progress}% Complete</span>
                        </div>
                        <div style={{ backgroundColor:'#DDDBFA', borderRadius:'30px', height:'8px' }}>
                          <div style={{ backgroundColor:'#4F46E5', borderRadius:'30px', height:'8px', width:`${e.progress}%` }} />
                        </div>
                      </div>
                      <p style={{ fontFamily:'Inter', fontWeight:600, fontSize:'16px', color:'#4F46E5' }}>${e.totalPrice}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary + Complete */}
              <div style={{ borderTop:'1px solid #d1d1d1', paddingTop:'24px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
                  <span style={{ fontFamily:'Inter', fontSize:'16px', color:'#666' }}>Total ({totalCount} enrollments)</span>
                  <span style={{ fontFamily:'Inter', fontWeight:600, fontSize:'20px', color:'#141414' }}>${totalPrice}</span>
                </div>
                <button onClick={handleCompleteEnrollment} style={{ width:'100%', height:'54px', backgroundColor:'#4F46E5', color:'#fff', border:'none', borderRadius:'8px', fontFamily:'Inter', fontWeight:500, fontSize:'18px', cursor:'pointer' }}>
                  Complete Enrollment
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div style={{ position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.7)', zIndex:1100, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ backgroundColor:'#fff', borderRadius:'12px', padding:'50px', width:'480px', textAlign:'center' }}>
            <span style={{ fontSize:'48px', display:'block', marginBottom:'16px' }}>✅</span>
            <h2 style={{ fontFamily:'Inter', fontWeight:600, fontSize:'28px', color:'#141414', marginBottom:'12px' }}>Enrollment Confirmed!</h2>
            <p style={{ fontFamily:'Inter', fontSize:'16px', color:'#666', marginBottom:'24px' }}>
              You have successfully enrolled in {enrollments.length} course{enrollments.length>1?'s':''}:
            </p>
            <ul style={{ listStyle:'none', padding:0, marginBottom:'24px', textAlign:'left' }}>
              {enrollments.map(e => <li key={e.id} style={{ fontFamily:'Inter', fontSize:'14px', color:'#141414', padding:'8px 0', borderBottom:'1px solid #f5f5f5' }}>✓ {e.course.title}</li>)}
            </ul>
            <button onClick={handleConfirmClose} style={{ width:'100%', height:'50px', backgroundColor:'#4F46E5', color:'#fff', border:'none', borderRadius:'8px', fontFamily:'Inter', fontWeight:500, fontSize:'16px', cursor:'pointer' }}>Close</button>
          </div>
        </div>
      )}
    </>
  )
}