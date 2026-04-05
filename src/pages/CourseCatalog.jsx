import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Footer from '../components/layout/Footer'

function StarIcon() { return <span style={{ color:'#DFB300', fontSize:'14px' }}>★</span> }

function CourseCard({ course }) {
  const navigate = useNavigate()
  const avgRating = course.avgRating ? course.avgRating.toFixed(1) : 'N/A'
  return (
    <div onClick={() => navigate(`/courses/${course.id}`)} style={{ backgroundColor:'#fff', border:'1px solid #f5f5f5', borderRadius:'12px', padding:'20px', width:'373px', cursor:'pointer', display:'flex', flexDirection:'column', gap:'16px', boxSizing:'border-box' }}>
      <div style={{ height:'200px', borderRadius:'10px', overflow:'hidden' }}>
        <img src={course.image} alt={course.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ backgroundColor:'#EEEDFC', color:'#4F46E5', borderRadius:'20px', padding:'6px 12px', fontFamily:'Inter', fontSize:'12px', fontWeight:500 }}>{course.category?.name}</span>
        <div style={{ display:'flex', alignItems:'center', gap:'4px' }}><StarIcon /><span style={{ fontFamily:'Inter', fontSize:'14px', color:'#525252' }}>{avgRating}</span></div>
      </div>
      <p style={{ fontFamily:'Inter', fontWeight:600, fontSize:'18px', color:'#141414', lineHeight:'24px' }}>{course.title}</p>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'auto' }}>
        <div>
          <span style={{ fontFamily:'Inter', fontSize:'12px', color:'#8a8a8a' }}>Starting from </span>
          <span style={{ fontFamily:'Inter', fontWeight:600, fontSize:'24px', color:'#141414' }}>${course.basePrice}</span>
        </div>
        <span style={{ fontFamily:'Inter', fontSize:'14px', color:'#666' }}>⏱ {course.durationWeeks}w</span>
      </div>
    </div>
  )
}

const SORT_OPTIONS = [
  { value:'newest', label:'Newest First' },
  { value:'price_low', label:'Price: Low to High' },
  { value:'price_high', label:'Price: High to Low' },
  { value:'popular', label:'Most Popular' },
  { value:'title_az', label:'Title: A-Z' },
]

export default function CourseCatalog() {
  const [courses, setCourses] = useState([])
  const [meta, setMeta] = useState({})
  const [categories, setCategories] = useState([])
  const [topics, setTopics] = useState([])
  const [instructors, setInstructors] = useState([])
  const [selectedCats, setSelectedCats] = useState([])
  const [selectedTopics, setSelectedTopics] = useState([])
  const [selectedInstructors, setSelectedInstructors] = useState([])
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.data)).catch(()=>{})
    api.get('/instructors').then(r => setInstructors(r.data.data)).catch(()=>{})
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedCats.length) selectedCats.forEach(id => params.append('categories[]', id))
    api.get(`/topics?${params}`).then(r => setTopics(r.data.data)).catch(()=>{})
    setSelectedTopics([])
  }, [selectedCats])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    selectedCats.forEach(id => params.append('categories[]', id))
    selectedTopics.forEach(id => params.append('topics[]', id))
    selectedInstructors.forEach(id => params.append('instructors[]', id))
    params.append('sort', sort)
    params.append('page', page)
    api.get(`/courses?${params}`).then(r => { setCourses(r.data.data); setMeta(r.data.meta) }).catch(()=>{}).finally(() => setLoading(false))
  }, [selectedCats, selectedTopics, selectedInstructors, sort, page])

  const toggleCat = (id) => { setPage(1); setSelectedCats(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]) }
  const toggleTopic = (id) => { setPage(1); setSelectedTopics(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]) }
  const toggleInstructor = (id) => { setPage(1); setSelectedInstructors(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]) }
  const clearAll = () => { setSelectedCats([]); setSelectedTopics([]); setSelectedInstructors([]); setPage(1) }
  const totalFilters = selectedCats.length + selectedTopics.length + selectedInstructors.length

  const chipStyle = (active) => ({ display:'inline-flex', alignItems:'center', padding:'8px 16px', borderRadius:'20px', border:`1.5px solid ${active?'#4F46E5':'#d1d1d1'}`, backgroundColor:active?'#EEEDFC':'#fff', color:active?'#4F46E5':'#525252', fontFamily:'Inter', fontSize:'14px', cursor:'pointer', margin:'4px', whiteSpace:'nowrap' })

  return (
    <div style={{ backgroundColor:'#f5f5f5', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center' }}>
      <div style={{ width:'1566px', padding:'172px 0 64px', display:'flex', gap:'57px' }}>

        {/* Filter Sidebar */}
        <div style={{ width:'309px', flexShrink:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px' }}>
            <span style={{ fontFamily:'Inter', fontWeight:600, fontSize:'24px', color:'#141414' }}>Filters</span>
            <button onClick={clearAll} style={{ fontFamily:'Inter', fontSize:'14px', color:'#4F46E5', background:'none', border:'none', cursor:'pointer', textDecoration:'underline' }}>Clear All Filters</button>
          </div>

          {/* Categories */}
          <div style={{ marginBottom:'32px' }}>
            <p style={{ fontFamily:'Inter', fontWeight:600, fontSize:'16px', color:'#141414', marginBottom:'16px' }}>Categories</p>
            <div style={{ display:'flex', flexWrap:'wrap' }}>
              {categories.map(c => (
                <button key={c.id} onClick={() => toggleCat(c.id)} style={chipStyle(selectedCats.includes(c.id))}>{c.name}</button>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div style={{ marginBottom:'32px' }}>
            <p style={{ fontFamily:'Inter', fontWeight:600, fontSize:'16px', color:'#141414', marginBottom:'16px' }}>Topics</p>
            <div style={{ display:'flex', flexWrap:'wrap' }}>
              {topics.map(t => (
                <button key={t.id} onClick={() => toggleTopic(t.id)} style={chipStyle(selectedTopics.includes(t.id))}>{t.name}</button>
              ))}
            </div>
          </div>

          {/* Instructors */}
          <div style={{ marginBottom:'32px' }}>
            <p style={{ fontFamily:'Inter', fontWeight:600, fontSize:'16px', color:'#141414', marginBottom:'16px' }}>Instructor</p>
            {instructors.map(ins => (
              <div key={ins.id} onClick={() => toggleInstructor(ins.id)} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'8px 0', cursor:'pointer', borderRadius:'8px', backgroundColor:selectedInstructors.includes(ins.id)?'#EEEDFC':'transparent', paddingLeft:'8px', marginBottom:'4px' }}>
                {ins.avatar ? <img src={ins.avatar} alt={ins.name} style={{ width:'36px', height:'36px', borderRadius:'50%', objectFit:'cover' }} /> : <div style={{ width:'36px', height:'36px', borderRadius:'50%', backgroundColor:'#EEEDFC', display:'flex', alignItems:'center', justifyContent:'center' }}>👤</div>}
                <span style={{ fontFamily:'Inter', fontSize:'14px', color: selectedInstructors.includes(ins.id)?'#4F46E5':'#525252' }}>{ins.name}</span>
              </div>
            ))}
          </div>

          {/* Filter count */}
          <p style={{ fontFamily:'Inter', fontSize:'14px', color:'#666' }}>{totalFilters} Filters Active</p>
        </div>

        {/* Course Grid */}
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px' }}>
            <span style={{ fontFamily:'Inter', fontSize:'16px', color:'#666' }}>
              {loading ? 'Loading...' : meta.total ? `Showing ${courses.length} of ${meta.total} courses` : 'No courses found'}
            </span>
            {/* Sort dropdown */}
            <div style={{ position:'relative' }}>
              <button onClick={() => setSortOpen(o=>!o)} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'12px 16px', border:'1.5px solid #d1d1d1', borderRadius:'8px', backgroundColor:'#fff', cursor:'pointer', fontFamily:'Inter', fontSize:'14px', color:'#141414', minWidth:'234px', justifyContent:'space-between' }}>
                {SORT_OPTIONS.find(o=>o.value===sort)?.label} <span>▼</span>
              </button>
              {sortOpen && (
                <div style={{ position:'absolute', top:'100%', right:0, backgroundColor:'#fff', border:'1px solid #d1d1d1', borderRadius:'8px', zIndex:100, width:'234px', boxShadow:'0 4px 12px rgba(0,0,0,0.1)' }}>
                  {SORT_OPTIONS.map(o => (
                    <div key={o.value} onClick={() => { setSort(o.value); setSortOpen(false); setPage(1) }} style={{ padding:'12px 20px', fontFamily:'Inter', fontSize:'14px', color:'#141414', cursor:'pointer', backgroundColor:sort===o.value?'#EEEDFC':'#fff' }}>{o.label}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Grid */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:'24px', marginBottom:'40px' }}>
            {loading ? <p style={{ fontFamily:'Inter', color:'#666' }}>Loading courses...</p>
              : courses.length === 0 ? <p style={{ fontFamily:'Inter', color:'#666' }}>No courses found with selected filters.</p>
              : courses.map(c => <CourseCard key={c.id} course={c} />)
            }
          </div>

          {/* Pagination */}
          {meta.lastPage > 1 && (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
              <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ width:'40px', height:'40px', borderRadius:'8px', border:'1.5px solid #d1d1d1', backgroundColor:page===1?'#f5f5f5':'#fff', cursor:page===1?'not-allowed':'pointer', fontSize:'16px' }}>‹</button>
              {Array.from({length:meta.lastPage},(_,i)=>i+1).map(p => (
                <button key={p} onClick={() => setPage(p)} style={{ width:'40px', height:'40px', borderRadius:'8px', border:`1.5px solid ${page===p?'#4F46E5':'#d1d1d1'}`, backgroundColor:page===p?'#4F46E5':'#fff', color:page===p?'#fff':'#141414', cursor:'pointer', fontFamily:'Inter', fontSize:'14px', fontWeight:page===p?600:400 }}>{p}</button>
              ))}
              <button onClick={() => setPage(p=>Math.min(meta.lastPage,p+1))} disabled={page===meta.lastPage} style={{ width:'40px', height:'40px', borderRadius:'8px', border:'1.5px solid #d1d1d1', backgroundColor:page===meta.lastPage?'#f5f5f5':'#fff', cursor:page===meta.lastPage?'not-allowed':'pointer', fontSize:'16px' }}>›</button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}