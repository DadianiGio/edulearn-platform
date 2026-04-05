const imgLogo = "https://www.figma.com/api/mcp/asset/1406c51b-3925-4242-8b98-d15b072fdd62"
const imgFb = "https://www.figma.com/api/mcp/asset/8799f863-4bb2-4a5c-9284-1bb34c00121f"
const imgTw = "https://www.figma.com/api/mcp/asset/5db73353-4b4d-4907-b2db-aa466413ab29"
const imgIg = "https://www.figma.com/api/mcp/asset/94e99eef-3bc8-4461-829d-fe00abd694fb"

export default function Footer() {
  return (
    <footer style={{ backgroundColor:'#f5f5f5', borderTop:'1px solid #d1d1d1', padding:'80px 177px 20px', width:'1920px', boxSizing:'border-box' }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'74px' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <img src={imgLogo} alt="logo" style={{ width:'45px', height:'45px' }} />
              <span style={{ fontFamily:'Inter', fontWeight:500, fontSize:'24px', color:'#130e67' }}>Bootcamp</span>
            </div>
            <p style={{ fontFamily:'Inter', fontWeight:500, fontSize:'14px', color:'#130e67', maxWidth:'310px' }}>
              Your learning journey starts here!<br />Browse courses to get started.
            </p>
          </div>
          <div style={{ display:'flex', gap:'22px', alignItems:'center' }}>
            <img src={imgFb} alt="facebook" style={{ height:'19px' }} />
            <img src={imgTw} alt="twitter" style={{ height:'15px' }} />
            <img src={imgIg} alt="instagram" style={{ height:'19px' }} />
          </div>
        </div>
        <div style={{ display:'flex', gap:'120px' }}>
          <div>
            <p style={{ fontFamily:'Inter', fontWeight:600, fontSize:'20px', color:'#130e67', marginBottom:'16px' }}>Explore</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              <a href="/courses" style={{ fontFamily:'Inter', fontSize:'18px', color:'#666', textDecoration:'none' }}>Browse Courses</a>
            </div>
          </div>
          <div>
            <p style={{ fontFamily:'Inter', fontWeight:600, fontSize:'20px', color:'#130e67', marginBottom:'16px' }}>Account</p>
            <p style={{ fontFamily:'Inter', fontSize:'18px', color:'#666' }}>My Profile</p>
          </div>
          <div>
            <p style={{ fontFamily:'Inter', fontWeight:600, fontSize:'20px', color:'#130e67', marginBottom:'16px' }}>Contact</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              <p style={{ fontFamily:'Inter', fontSize:'18px', color:'#666' }}>📧 contact@company.com</p>
              <p style={{ fontFamily:'Inter', fontSize:'18px', color:'#666' }}>📞 (+995) 555 111 222</p>
              <p style={{ fontFamily:'Inter', fontSize:'18px', color:'#666' }}>📍 Aghmashenebeli St.115</p>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', paddingTop:'20px', borderTop:'1px solid #d1d1d1' }}>
        <p style={{ fontFamily:'Inter', fontSize:'18px', color:'#666' }}>Copyright © 2026 Redberry International</p>
        <p style={{ fontFamily:'Inter', fontSize:'18px', color:'#666' }}>
          All Rights Reserved | <span style={{ color:'#4f46e5' }}>Terms and Conditions</span> | <span style={{ color:'#4f46e5' }}>Privacy Policy</span>
        </p>
      </div>
    </footer>
  )
}