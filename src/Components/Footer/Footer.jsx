import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Footer.css'

function Footer() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  // Определение активной страницы
  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  // Отслеживание скролла для эффекта
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrolled])

  return (
    <footer className={`footerContainer ${scrolled ? 'scrolled' : ''}`}>
      <div className="footerInner"> 
        <div className="footerRight">
          <Link 
            to='/' 
            className={isActive('/')}
            title="Главная панель управления"
          >
            <h1>Главная</h1>
          </Link>
          
          <Link 
            to='/info' 
            className={isActive('/info')}
            title="Информация о системе"
          >
            <h1>Информация</h1>
          </Link>
          
          <Link 
            to='/plans' 
            className={isActive('/plans')}
            title="Планы и цели"
          >
            <h1>Планы</h1>
          </Link>
          
          <Link 
            to='/statistics' 
            className={isActive('/statistics')}
            title="Статистика и аналитика"
          >
            <h1>Статистика</h1>
          </Link>
        </div>
        
        {/* Декоративный элемент */}
        <div className="footer-decoration"></div>
        
        {/* Индикатор системы */}
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(59, 130, 246, 0.1)',
          color: 'rgba(226, 232, 240, 0.5)',
          fontSize: '0.85rem',
          fontFamily: 'monospace',
          letterSpacing: '1px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              boxShadow: '0 0 10px #22c55e',
              animation: 'nav-pulse 2s infinite'
            }}></span>
            СИСТЕМА: АКТИВНА
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
