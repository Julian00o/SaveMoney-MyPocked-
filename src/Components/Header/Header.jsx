// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import './Header.css'

// function Header() {
//   const [text, setText] = useState("")
//   const navigate = useNavigate()

//   function handleGoSearch(e) {
//     if (e.keyCode === 13) {
//       navigate(`/search/${text}`)
//       setText("")
//     }
//   }

//   return (
//     <header className="headerContainer">
//       <div className="headerInner">

//         <div className="logo">
//         <Link to='/'><h1 className='logo'>SaveMoney</h1></Link>
//         </div>

//         <nav className="navLinks">
//           <Link to="/login" className="navLink">Sign in</Link>
//           <Link to="/register" className="navLink">Sign up</Link>
//         </nav>

//       </div>
//     </header>
//   )
// }

// export default Header






import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import './Header.css'

// Если у вас установлены react-icons, импортируйте так:
// import { FaHome, FaUser, FaUserPlus } from 'react-icons/fa'

function Header() {
  const [text, setText] = useState("")
  const navigate = useNavigate()
  const location = useLocation()

  function handleGoSearch(e) {
    if (e.keyCode === 13) {
      navigate(`/search/${text}`)
      setText("")
    }
  }

  // Проверка активной страницы
  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  // Символы для иконок (если react-icons не установлены)
  const IconHome = () => (
    <svg style={{
      width: '1.5rem',
      height: '1.5rem',
      fill: 'none',
      stroke: 'url(#gradient)',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    }}>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--neon-blue)" />
          <stop offset="100%" stopColor="var(--neon-purple)" />
        </linearGradient>
      </defs>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )

  const IconUser = () => (
    <span style={{
      fontSize: '1rem',
      color: 'var(--neon-blue)',
      opacity: 0.8,
      fontWeight: 'bold'
    }}>👤</span>
  )

  const IconUserPlus = () => (
    <span style={{
      fontSize: '1rem',
      color: 'var(--neon-purple)',
      opacity: 0.8,
      fontWeight: 'bold'
    }}>➕</span>
  )

  return (
    <header className="headerContainer">
      <div className="headerInner">

        {/* Логотип */}
        <Link to='/' className="logo">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(93, 173, 236, 0.3)'
            }}>
              <span style={{
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}>₽</span>
            </div>
            
            <h1 style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontSize: '1.8rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
              letterSpacing: '-0.5px'
            }}>
              SaveMoney
              <span style={{
                fontSize: '0.7rem',
                fontWeight: '400',
                marginLeft: '8px',
                opacity: 0.7,
                color: 'var(--text-secondary)'
              }}>
                v2.0
              </span>
            </h1>
          </div>
        </Link>

        {/* Навигация */}
        <nav className="navLinks">
          <Link 
            to="/login" 
            className={`navLink ${isActive('/login')}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <IconUser />
            Войти
          </Link>
          
          <Link 
            to="/register" 
            className={`navLink ${isActive('/register')}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <IconUserPlus />
            Регистрация
          </Link>
        </nav>

      </div>
    </header>
  )
}

export default Header