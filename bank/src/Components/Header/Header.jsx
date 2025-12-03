import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Header.css'

function Header() {
  const [text, setText] = useState("")
  const navigate = useNavigate()

  function handleGoSearch(e) {
    if (e.keyCode === 13) {
      navigate(`/search/${text}`)
      setText("")
    }
  }

  return (
    <header className="headerContainer">
      <div className="headerInner">

        <div className="logo">
        <Link to='/'><h1 className='logo'>SaveMoney</h1></Link>
        </div>

        <nav className="navLinks">
          <Link to="/login" className="navLink">Sign in</Link>
          <Link to="/register" className="navLink">Sign up</Link>
        </nav>

      </div>
    </header>
  )
}

export default Header
