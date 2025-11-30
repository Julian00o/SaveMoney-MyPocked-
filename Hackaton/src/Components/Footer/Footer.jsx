import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footerContainer">
      <div className="footerInner"> 
        <div className="footerRight">
          <Link to='/'><h1>Home</h1></Link>
          <Link to='/info'><h1>Info</h1></Link>
          <Link to='/plans'><h1>Plans</h1></Link>
          <Link to='/statistics'><h1>Statistics</h1></Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
