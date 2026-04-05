import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Footer from '../components/layout/Footer'

function StarIcon({ filled }) { return <span style={{ color: filled?'#DFB300':'#d1d1d1', fontSize:'24px' }}>★</span> }

export default function CourseDetail({ onLoginOpen, onProfileOpen }) {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [weeklySchedules, setWeeklySchedules] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const [sessionTypes, setSessionTypes] = useState([])
  const [selectedWeekly, setSelectedWeekly] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [selectedSession, setSelectedSession] = useState(null)
  const [enrolling, setEnrolling] = useState(false)
  const [enrollError, setEnrollError] = useState('')
  const [enrollSuccess, setEnrollSuccess] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [ratingSubmitted, setRatingSubmitted] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.get(`/courses/${id}`).then(r => {
      setCourse(r.data.data)
      if (r.data.data.isRated) setRatingSubmitted(true)
    }).catch(()=>{}).finally(()=>setLoading(false))
    api.get(`/courses/${id}/weekly-schedules`).then(r => setWeeklySchedules(r.data.data)).catch(()=>{})
  }, [id])

  useEffect(() => {
    if (!selectedWeekly) return
    setTimeSlots([]); setSelectedTime(null); setSessionTypes([]); setSelectedSession(null)
    api.get(`/courses/${id}/time-slots?weekly_schedule_id=${selectedWeekly}`).then(r => setTimeSlots(r.data.data)).catch(()=>{})
  }, [selectedWeekly])

  useEffect(() => {
    if (!selectedWeekly || !selectedTime) return
    setSessionTypes([]); setSelectedSession(null)
    api.get(`/courses/${id}/session-types?weekly_schedule_id=${selectedWeekly}&time_slot_id=${selectedTime}`).then(r => setSessionTypes(r.data.data)).catch(()=>{})
  }, [selectedTime])

  const finalPrice = course && selectedSession ? course.basePrice + (sessionTypes.find(s=>s.id===selectedSession)?.priceModifier||0) : course?.basePrice

  const handleEnroll = async () => {
    if (!user) { onLoginOpen(); return }
    if (!user.profileComplete) { onProfileOpen(); return }
    if (!selectedWeekly || !selectedTime || !selectedSession) { setEnrollError('Please select a schedule, time slot, and session type.'); return }
    setEnrolling(true); setEnrollError('')
    try {
      await api.post('/enrollments', { course_id: Number(id), weekly_schedule_id: selectedWeekly, time_slot_id: selectedTime, session_type_id: selectedSession })
      setEnrollSuccess(true)
      api.get(`/courses/${id}`).then(r => setCourse(r.data.data))
    } catch(e) {
      if (e.response?.status === 409) {
        const conflict = e.response.data
        if (window.confirm(`Schedule conflict: ${conflict.conflicts?.[0]?.schedule}. Enroll anyway?`)) {
          await api.post('/enrollments', { course_id: Number(id), weekly_schedule_id: selectedWeekly, time_slot_id: selectedTime, session_type_id: selectedSession, force: true })
          setEnrollSuccess(true)
        }
      } else {
        setEnrollError(e.response?.data?.message || 'Enrollment failed.')
      }
    } finally { setEnrolling(false) }
  }

  const handleRate = async (stars) => {
    if (!user || ratingSubmitted) return
    try {
      await api.post(`/courses/${id}/reviews`, { rating: stars })
      setRating(stars); setRatingSubmitted(true)
    } catch(e) { console.error(e) }
  }

  const avgRating = course?.reviews?.length ? (course.reviews.reduce((a,r)=>a+r.rating,0)/course.reviews.length).toFixed(1) : 'N/A'

  if (loading) return <div style={{ padding:'100px', textAlign:'center', fontFamily:'Inter', fontSize:'20px' }}>Loading...</div>
  if (!course) return <div style={{ padding:'100px', textAlign:'center', fontFamily:'Inter', fontSize:'20px' }}>Course not found.</div>

  const isEnrolled = !!course.enrollment

  return (
    <div style={{ backgroundColor:'#f5f5f5', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center' }}>
      <div style={{ width:'1566px', padding:'172px 0 64px', display:'flex', gap:'57px' }}>

        {/* Left: Course Info */}
        <div style={{ flex:1 }}>
          {/* Breadcrumb */}
          <div style={{ display:'flex', gap:'8px', marginBottom:'32px', fontFamily:'Inter', fontSize:'14px', color:'#666' }}>
            <Link to="/" style={{ color:'#666', textDecoration:'none' }}>Home</Link>
            <span>/</span>
            <Link to="/courses" style={{ color:'#666', textDecoration:'none' }}>Courses</Link>
            <span>/</span>
            <span style={{ color:'#141414' }}>{course.title}</span>
          </div>

          <h1 style={{ fontFamily:'Inter', fontWeight:600, fontSize:'40px', color:'#141414', marginBottom:'32px', lineHeight:'48px' }}>{course.title}</h1>

          {/* Course image */}
          <div style={{ height:'474px', borderRadius:'12px', overflow:'hidden', marginBottom:'24px' }}>
            <img src={course.image} alt={course.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          </div>

          {/* Meta row */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'32px' }}>
            <div style={{ display:'flex', gap:'24px', alignItems:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                <span>📅</span><span style={{ fontFamily:'Inter', fontSize:'16px', color:'#141414' }}>{course.durationWeeks} Weeks</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                <span>⏱</span><span style={{ fontFamily:'Inter', fontSize:'16px', color:'#141414' }}>{course.durationWeeks * 10} Hours</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                <span style={{ color:'#DFB300', fontSize:'20px' }}>★</span>
                <span style={{ fontFamily:'Inter', fontSize:'16px', color:'#525252' }}>{avgRating}</span>
              </div>
            </div>
            <span style={{ backgroundColor:'#EEEDFC', color:'#4F46E5', borderRadius:'20px', padding:'8px 16px', fontFamily:'Inter', fontSize:'14px', fontWeight:500 }}>{course.category?.name}</span>
          </div>

          {/* Instructor */}
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'32px' }}>
            {course.instructor?.avatar ? <img src={course.instructor.avatar} alt="" style={{ width:'46px', height:'46px', borderRadius:'50%', objectFit:'cover' }} /> : <div style={{ width:'46px', height:'46px', borderRadius:'50%', backgroundColor:'#EEEDFC' }} />}
            <span style={{ fontFamily:'Inter', fontSize:'16px', color:'#525252' }}>Lecturer <span style={{ color:'#141414', fontWeight:500 }}>{course.instructor?.name}</span></span>
          </div>

          {/* Description */}
          <div>
            <h3 style={{ fontFamily:'Inter', fontWeight:600, fontSize:'20px', color:'#141414', marginBottom:'16px' }}>Course Description</h3>
            <p style={{ fontFamily:'Inter', fontSize:'16px', color:'#666', lineHeight:'28px' }}>{course.description}</p>
          </div>

          {/* Rating section — only if enrolled and completed */}
          {isEnrolled && course.enrollment?.progress === 100 && (
            <div style={{ marginTop:'40px', padding:'24px', backgroundColor:'#fff', borderRadius:'12px' }}>
              <h3 style={{ fontFamily:'Inter', fontWeight:600, fontSize:'20px', color:'#141414', marginBottom:'16px' }}>Rate this course</h3>
              {ratingSubmitted ? (
                <p style={{ fontFamily:'Inter', color:'#1DC31D', fontSize:'16px' }}>✓ Thank you for your rating!</p>
              ) : (
                <div style={{ display:'flex', gap:'8px' }}>
                  {[1,2,3,4,5].map(s => (
                    <button key={s} onClick={() => handleRate(s)} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)} style={{ background:'none', border:'none', cursor:'pointer', padding:0 }}>
                      <StarIcon filled={s <= (hoverRating||rating)} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Schedule + Enroll */}
        <div style={{ width:'530px', flexShrink:0 }}>
          <div style={{ backgroundColor:'#fff', borderRadius:'12px', padding:'24px', position:'sticky', top:'120px' }}>
            <h3 style={{ fontFamily:'Inter', fontWeight:600, fontSize:'20px', color:'#141414', marginBottom:'24px' }}>Select Schedule</h3>

            {isEnrolled ? (
              <div style={{ padding:'20px', backgroundColor:'#EEEDFC', borderRadius:'12px', marginBottom:'16px' }}>
                <p style={{ fontFamily:'Inter', fontWeight:600, fontSize:'16px', color:'#4F46E5', marginBottom:'8px' }}>✓ You are enrolled</p>
                <p style={{ fontFamily:'Inter', fontSize:'14px', color:'#525252' }}>{course.enrollment.schedule?.weeklySchedule?.label}</p>
                <p style={{ fontFamily:'Inter', fontSize:'14px', color:'#525252' }}>{course.enrollment.schedule?.timeSlot?.label}</p>
                <p style={{ fontFamily:'Inter', fontSize:'14px', color:'#525252' }}>{course.enrollment.schedule?.sessionType?.name}</p>
                <div style={{ marginTop:'16px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                    <span style={{ fontFamily:'Inter', fontSize:'14px', color:'#141414' }}>Progress</span>
                    <span style={{ fontFamily:'Inter', fontSize:'14px', color:'#141414' }}>{course.enrollment.progress}%</span>
                  </div>
                  <div style={{ backgroundColor:'#DDDBFA', borderRadius:'30px', height:'12px' }}>
                    <div style={{ backgroundColor:'#4F46E5', borderRadius:'30px', height:'12px', width:`${course.enrollment.progress}%` }} />
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Weekly Schedule */}
                <div style={{ marginBottom:'16px' }}>
                  <p style={{ fontFamily:'Inter', fontWeight:500, fontSize:'14px', color:'#3d3d3d', marginBottom:'8px' }}>Weekly Schedule</p>
                  {weeklySchedules.map(ws => (
                    <div key={ws.id} onClick={() => setSelectedWeekly(ws.id)} style={{ padding:'12px 16px', border:`1.5px solid ${selectedWeekly===ws.id?'#4F46E5':'#d1d1d1'}`, borderRadius:'8px', marginBottom:'8px', cursor:'pointer', backgroundColor:selectedWeekly===ws.id?'#EEEDFC':'#fff' }}>
                      <p style={{ fontFamily:'Inter', fontSize:'14px', color:selectedWeekly===ws.id?'#4F46E5':'#141414' }}>{ws.label}</p>
                      <p style={{ fontFamily:'Inter', fontSize:'12px', color:'#8a8a8a' }}>{ws.days?.join(', ')}</p>
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                {selectedWeekly && (
                  <div style={{ marginBottom:'16px' }}>
                    <p style={{ fontFamily:'Inter', fontWeight:500, fontSize:'14px', color:'#3d3d3d', marginBottom:'8px' }}>Time Slot</p>
                    {timeSlots.map(ts => (
                      <div key={ts.id} onClick={() => setSelectedTime(ts.id)} style={{ padding:'12px 16px', border:`1.5px solid ${selectedTime===ts.id?'#4F46E5':'#d1d1d1'}`, borderRadius:'8px', marginBottom:'8px', cursor:'pointer', backgroundColor:selectedTime===ts.id?'#EEEDFC':'#fff' }}>
                        <p style={{ fontFamily:'Inter', fontSize:'14px', color:selectedTime===ts.id?'#4F46E5':'#141414' }}>{ts.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Session Types */}
                {selectedTime && (
                  <div style={{ marginBottom:'16px' }}>
                    <p style={{ fontFamily:'Inter', fontWeight:500, fontSize:'14px', color:'#3d3d3d', marginBottom:'8px' }}>Session Type</p>
                    {sessionTypes.map(st => (
                      <div key={st.id} onClick={() => st.availableSeats > 0 && setSelectedSession(st.id)} style={{ padding:'12px 16px', border:`1.5px solid ${selectedSession===st.id?'#4F46E5':st.availableSeats===0?'#f5f5f5':'#d1d1d1'}`, borderRadius:'8px', marginBottom:'8px', cursor:st.availableSeats===0?'not-allowed':'pointer', backgroundColor:selectedSession===st.id?'#EEEDFC':st.availableSeats===0?'#f5f5f5':'#fff', opacity:st.availableSeats===0?0.5:1 }}>
                        <div style={{ display:'flex', justifyContent:'space-between' }}>
                          <p style={{ fontFamily:'Inter', fontSize:'14px', color:selectedSession===st.id?'#4F46E5':'#141414', textTransform:'capitalize' }}>{st.name}</p>
                          <p style={{ fontFamily:'Inter', fontSize:'14px', color:'#4F46E5', fontWeight:600 }}>+${st.priceModifier}</p>
                        </div>
                        {st.location && <p style={{ fontFamily:'Inter', fontSize:'12px', color:'#8a8a8a' }}>{st.location}</p>}
                        {st.availableSeats === 0 && <p style={{ fontFamily:'Inter', fontSize:'12px', color:'#ef4444' }}>No seats available</p>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Price */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px', padding:'16px', backgroundColor:'#f5f5f5', borderRadius:'8px' }}>
                  <span style={{ fontFamily:'Inter', fontSize:'14px', color:'#666' }}>Total Price</span>
                  <span style={{ fontFamily:'Inter', fontWeight:600, fontSize:'24px', color:'#141414' }}>${finalPrice}</span>
                </div>

                {enrollError && <p style={{ color:'#ef4444', fontSize:'13px', marginBottom:'12px' }}>{enrollError}</p>}
                {enrollSuccess && <p style={{ color:'#1DC31D', fontSize:'13px', marginBottom:'12px' }}>✓ Successfully enrolled!</p>}

                {/* Enroll / Auth / Profile status */}
                {!user ? (
                  <div style={{ padding:'16px', border:'1px solid #f5f5f5', borderRadius:'8px', marginBottom:'12px' }}>
                    <p style={{ fontFamily:'Inter', fontWeight:500, fontSize:'14px', color:'#141414', marginBottom:'4px' }}>Authentication Required</p>
                    <p style={{ fontFamily:'Inter', fontSize:'12px', color:'#666', marginBottom:'12px' }}>You need to sign in before enrolling.</p>
                    <button onClick={onLoginOpen} style={{ backgroundColor:'#4F46E5', color:'#fff', border:'none', borderRadius:'8px', padding:'12px 20px', fontFamily:'Inter', fontSize:'14px', cursor:'pointer' }}>Sign In</button>
                  </div>
                ) : !user.profileComplete ? (
                  <div style={{ padding:'16px', border:'1px solid #f5f5f5', borderRadius:'8px', marginBottom:'12px' }}>
                    <p style={{ fontFamily:'Inter', fontWeight:500, fontSize:'14px', color:'#141414', marginBottom:'4px' }}>Complete Your Profile</p>
                    <p style={{ fontFamily:'Inter', fontSize:'12px', color:'#666', marginBottom:'12px' }}>You need to fill in your profile details before enrolling.</p>
                    <button onClick={onProfileOpen} style={{ backgroundColor:'#4F46E5', color:'#fff', border:'none', borderRadius:'8px', padding:'12px 20px', fontFamily:'Inter', fontSize:'14px', cursor:'pointer' }}>Complete</button>
                  </div>
                ) : (
                  <button onClick={handleEnroll} disabled={enrolling||enrollSuccess} style={{ width:'100%', height:'54px', backgroundColor:enrolling||enrollSuccess?'#736BEA':'#4F46E5', color:'#fff', border:'none', borderRadius:'8px', fontFamily:'Inter', fontWeight:500, fontSize:'18px', cursor:enrolling||enrollSuccess?'not-allowed':'pointer' }}>
                    {enrolling ? 'Enrolling...' : enrollSuccess ? 'Enrolled ✓' : 'Enroll Now'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}