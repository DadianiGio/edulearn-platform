import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Footer from '../components/layout/Footer'

const imgSlide1 = "https://www.figma.com/api/mcp/asset/c7963355-4aa5-4282-8fad-a4430b3c10e9"
const imgSlide2 = "https://www.figma.com/api/mcp/asset/ceb17c90-4f7b-48d1-b621-87f949f9a86c"
const imgSlide3 = "https://www.figma.com/api/mcp/asset/a6bb4b0d-2d06-44ab-bad6-92a77e76ce25"
const imgArrowLeft = "https://www.figma.com/api/mcp/asset/25b01bc0-369e-4a7d-9f27-2b174bd60677"
const imgArrowRight = "https://www.figma.com/api/mcp/asset/597c4519-0c93-46c5-8d9b-4c7843e0b5b0"
const imgLockBg = "https://www.figma.com/api/mcp/asset/4b14cd02-7b56-463e-b10a-075033fe816a"

const slides = [
  { img: imgSlide1, title: 'Start learning something new today', sub: 'Explore a wide range of expert-led courses in design, development, business, and more.', btn: 'Browse Courses', link: '/courses' },
  { img: imgSlide2, title: 'Pick up where you left off', sub: 'Your learning journey is already in progress. Continue your enrolled courses and track your progress.', btn: 'Start Learning', link: '/courses' },
  { img: imgSlide3, title: 'Learn together, grow faster', sub: 'Join a community of learners, connect with instructors, and stay motivated as you build new skills.', btn: 'Learn More', link: '/courses' },
]

function StarIcon() {
  return <span style={{ color:'#DFB300', fontSize:'16px' }}>★</span>
}

function FeaturedCard({ course }) {
  const navigate = useNavigate()
  const avgRating = course.avgRating ? course.avgRating.toFixed(1) : 'N/A'
  return (
    <div onClick={() => navigate(`/courses/${course.id}`)} style={{ backgroundColor:'#fff', border:'1px solid #f5f5f5', borderRadius:'12px', padding:'20px', width:'506px', cursor:'pointer', display:'flex', flexDirection:'column', gap:'24px', boxSizing:'border-box' }}>
      <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
        <div style={{ height:'262px', borderRadius:'10px', overflow:'hidden' }}>
          <img src={course.image} alt={course.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontFamily:'Inter', fontSize:'14px', color:'#8a8a8a' }}>Lecturer <span style={{ color:'#666' }}>{course.instructor?.name}</span></span>
            <div style={{ display:'flex', alignItems:'center', gap:'4px' }}><StarIcon /><span style={{ fontFamily:'Inter', fontSize:'14px', color:'#525252' }}>{avgRating}</span></div>
          </div>
          <p style={{ fontFamily:'Inter', fontWeight:600, fontSize:'24px', color:'#141414' }}>{course.title}</p>
        </div>
        <p style={{ fontFamily:'Inter', fontSize:'16px', color:'#666', lineHeight:'24px' }}>{course.description?.slice(0, 120)}...</p>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <span style={{ fontFamily:'Inter', fontSize:'12px', color:'#8a8a8a' }}>Starting from</span>
          <span style={{ fontFamily:'Inter', fontWeight:600, fontSize:'32px', color:'#141414' }}>${course.basePrice}</span>
        </div>
        <div style={{ backgroundColor:'#4F46E5', borderRadius:'8px', padding:'17px 25px' }}>
          <span style={{ fontFamily:'Inter', fontWeight:500, fontSize:'20px', color:'#fff' }}>Details</span>
        </div>
      </div>
    </div>
  )
}

function ProgressCard({ enrollment, onContinue }) {
  const course = enrollment.course
  const progress = enrollment.progress || 0
  return (
    <div onClick={() => onContinue(course.id)} style={{ backgroundColor:'#fff', border:'0.5px solid #f5f5f5', borderRadius:'12px', padding:'20px', width:'506px', cursor:'pointer', display:'flex', flexDirection:'column', gap:'8px', boxSizing:'border-box', boxShadow:'0px 0px 11.7px 0px rgba(0,0,0,0.04)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0', height:'123px' }}>
        <div style={{ width:'140px', height:'123px', borderRadius:'12px', overflow:'hidden', flexShrink:0 }}>
          <img src={course.image} alt={course.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        </div>
        <div style={{ flex:1, paddingLeft:'16px', display:'flex', flexDirection:'column', gap:'9px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontFamily:'Inter', fontSize:'14px', color:'#8a8a8a' }}>Lecturer <span style={{ color:'#666' }}>{course.instructor?.name}</span></span>
            <div style={{ display:'flex', alignItems:'center', gap:'4px' }}><StarIcon /><span style={{ fontFamily:'Inter', fontSize:'14px', color:'#525252' }}>{course.avgRating?.toFixed(1)||'N/A'}</span></div>
          </div>
          <p style={{ fontFamily:'Inter', fontWeight:600, fontSize:'20px', color:'#141414', lineHeight:'24px' }}>{course.title}</p>
        </div>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
        <div style={{ flex:1, paddingBottom:'4px', display:'flex', flexDirection:'column', gap:'4px', maxWidth:'336px' }}>
          <span style={{ fontFamily:'Inter', fontSize:'12px', color:'#141414' }}>{progress}% Complete</span>
          <div style={{ backgroundColor:'#DDDBFA', borderRadius:'30px', height:'15px', width:'100%' }}>
            <div style={{ backgroundColor:'#4F46E5', borderRadius:'30px', height:'15px', width:`${progress}%` }} />
          </div>
        </div>
        <div style={{ border:'2px solid #958FEF', borderRadius:'8px', padding:'12px 16px', width:'90px', textAlign:'center' }}>
          <span style={{ fontFamily:'Inter', fontWeight:500, fontSize:'16px', color:'#4F46E5' }}>View</span>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard({ onLoginOpen, onEnrolledOpen }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [featured, setFeatured] = useState([])
  const [inProgress, setInProgress] = useState([])
  const [slide, setSlide] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    api.get('/courses/featured').then(r => setFeatured(r.data.data)).catch(() => {})
    if (user) api.get('/courses/in-progress').then(r => setInProgress(r.data.data)).catch(() => {})
  }, [user])

  useEffect(() => {
    intervalRef.current = setInterval(() => setSlide(s => (s+1)%3), 4000)
    return () => clearInterval(intervalRef.current)
  }, [])

  const goSlide = (i) => { setSlide(i); clearInterval(intervalRef.current); intervalRef.current = setInterval(() => setSlide(s => (s+1)%3), 4000) }

  return (
    <div style={{ backgroundColor:'#f5f5f5', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', gap:'64px', paddingBottom:'0' }}>

      {/* Hero Slider */}
      <div style={{ position:'relative', width:'1566px', height:'420px', borderRadius:'30px', overflow:'hidden', marginTop:'64px', flexShrink:0 }}>
        {slides.map((s, i) => (
          <div key={i} style={{ position:'absolute', inset:0, opacity: slide===i?1:0, transition:'opacity 0.5s ease', borderRadius:'30px', overflow:'hidden' }}>
            <img src={s.img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'30px' }} />
            <div style={{ position:'absolute', inset:0, padding:'48px', display:'flex', flexDirection:'column', justifyContent:'flex-start', gap:'40px' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:'12px', color:'#fff', maxWidth:'900px' }}>
                <p style={{ fontFamily:'Inter', fontWeight:700, fontSize:'48px', lineHeight:'56px' }}>{s.title}</p>
                <p style={{ fontFamily:'Inter', fontWeight:300, fontSize:'24px' }}>{s.sub}</p>
              </div>
              <Link to={s.link} style={{ backgroundColor:'#4F46E5', borderRadius:'8px', padding:'17px 25px', textDecoration:'none', display:'inline-block' }}>
                <span style={{ fontFamily:'Inter', fontWeight:500, fontSize:'20px', color:'#fff' }}>{s.btn}</span>
              </Link>
            </div>
          </div>
        ))}
        {/* Dots */}
        <div style={{ position:'absolute', bottom:'24px', left:'50%', transform:'translateX(-50%)', display:'flex', gap:'12px' }}>
          {[0,1,2].map(i => (
            <button key={i} onClick={() => goSlide(i)} style={{ width:'57px', height:'8px', borderRadius:'999px', border:'none', cursor:'pointer', backgroundColor: slide===i?'#f5f5f5':'rgba(193,188,188,0.5)' }} />
          ))}
        </div>
        {/* Arrows */}
        <button onClick={() => goSlide((slide+2)%3)} style={{ position:'absolute', right:'80px', bottom:'20px', background:'none', border:'none', cursor:'pointer', opacity:0.7 }}>
          <img src={imgArrowLeft} alt="prev" style={{ width:'54px', height:'54px' }} />
        </button>
        <button onClick={() => goSlide((slide+1)%3)} style={{ position:'absolute', right:'20px', bottom:'20px', background:'none', border:'none', cursor:'pointer' }}>
          <img src={imgArrowRight} alt="next" style={{ width:'54px', height:'54px' }} />
        </button>
      </div>

      {/* Courses in Progress */}
      <div style={{ width:'1566px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'32px' }}>
          <div>
            <p style={{ fontFamily:'Inter', fontWeight:600, fontSize:'40px', color:'#0a0a0a' }}>Continue Learning</p>
            <p style={{ fontFamily:'Inter', fontWeight:500, fontSize:'18px', color:'#3d3d3d' }}>Pick up where you left</p>
          </div>
          {user && inProgress.length >= 4 && (
            <button onClick={onEnrolledOpen} style={{ fontFamily:'Inter', fontWeight:500, fontSize:'20px', color:'#4f46e5', textDecoration:'underline', background:'none', border:'none', cursor:'pointer' }}>See All</button>
          )}
        </div>

        {!user ? (
          /* Locked state */
          <div style={{ position:'relative', display:'flex', gap:'24px' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width:'506px', height:'219px', borderRadius:'12px', overflow:'hidden', position:'relative', flexShrink:0 }}>
                <img src={imgLockBg} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                <div style={{ position:'absolute', inset:0, backdropFilter:'blur(6px)', backgroundColor:'rgba(255,255,255,0.3)' }} />
              </div>
            ))}
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'16px' }}>
              <span style={{ fontSize:'48px' }}>🔒</span>
              <p style={{ fontFamily:'Inter', fontWeight:600, fontSize:'20px', color:'#141414', textAlign:'center' }}>Sign in to track your learning progress</p>
              <button onClick={onLoginOpen} style={{ backgroundColor:'#4F46E5', color:'#fff', border:'none', borderRadius:'8px', padding:'12px 24px', fontFamily:'Inter', fontWeight:500, fontSize:'16px', cursor:'pointer' }}>Log In</button>
            </div>
          </div>
        ) : inProgress.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 0' }}>
            <p style={{ fontFamily:'Inter', fontSize:'18px', color:'#666', marginBottom:'16px' }}>You haven't enrolled in any courses yet. Start your learning journey today!</p>
            <Link to="/courses" style={{ backgroundColor:'#4F46E5', color:'#fff', borderRadius:'8px', padding:'12px 24px', textDecoration:'none', fontFamily:'Inter', fontWeight:500, fontSize:'16px' }}>Browse Courses</Link>
          </div>
        ) : (
          <div style={{ display:'flex', gap:'24px', flexWrap:'wrap' }}>
            {inProgress.slice(0,4).map(e => <ProgressCard key={e.id} enrollment={e} onContinue={(id) => navigate(`/courses/${id}`)} />)}
          </div>
        )}
      </div>

      {/* Featured Courses */}
      <div style={{ width:'1566px', marginBottom:'0' }}>
        <div style={{ marginBottom:'32px' }}>
          <p style={{ fontFamily:'Inter', fontWeight:600, fontSize:'40px', color:'#0a0a0a' }}>Start Learning Today</p>
          <p style={{ fontFamily:'Inter', fontSize:'18px', color:'#3d3d3d' }}>Choose from our most popular courses and begin your journey</p>
        </div>
        <div style={{ display:'flex', gap:'24px', flexWrap:'wrap' }}>
          {featured.map(c => <FeaturedCard key={c.id} course={c} />)}
        </div>
      </div>

      <Footer />
    </div>
  )
}