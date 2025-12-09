// import { useState } from 'react'
// import { RouterProvider } from 'react-router-dom'
// import myRouter from './router'
// import './App.css'

// function App() {

//   return (
//     <>
//      <RouterProvider router={myRouter} />
//     </>
//   )
// }

// export default App





import { useState, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import myRouter from './router'
import './App.css'

function App() {
  const [time, setTime] = useState(new Date())
  const [missionTime, setMissionTime] = useState(0)

  // Обновление времени
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    
    // Миссионное время
    const missionTimer = setInterval(() => {
      setMissionTime(prev => prev + 1)
    }, 1000)
    
    return () => {
      clearInterval(timer)
      clearInterval(missionTimer)
    }
  }, [])

  // Генерация звездного поля
  const generateStars = () => {
    const stars = []
    for (let i = 0; i < 200; i++) {
      const size = Math.random()
      let starClass = 'small'
      if (size > 0.7) starClass = 'large'
      else if (size > 0.3) starClass = 'medium'
      
      stars.push({
        id: i,
        class: starClass,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5
      })
    }
    return stars
  }

  // Генерация комет
  const generateComets = () => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: i * 8,
      angle: Math.random() * 30 + 15
    }))
  }

  // Генерация дополнительных спутников
  const generateMoons = () => {
    return Array.from({ length: 2 }, (_, i) => ({
      id: i,
      planet: i === 0 ? 'mars' : 'jupiter',
      size: Math.random() * 20 + 15,
      distance: Math.random() * 80 + 100,
      period: Math.random() * 30 + 20
    }))
  }

  const stars = generateStars()
  const comets = generateComets()
  const additionalMoons = generateMoons()

  // Форматирование времени миссии
  const formatMissionTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="app-container">
      {/* Звездное небо */}
      <div className="starfield">
        {/* Млечный путь */}
        <div className="milky-way"></div>
        
        {/* Звезды */}
        {stars.map(star => (
          <div
            key={`star-${star.id}`}
            className={`star ${star.class}`}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}
        
        {/* Кометы */}
        {comets.map(comet => (
          <div
            key={`comet-${comet.id}`}
            className="comet"
            style={{
              top: `${comet.y}%`,
              left: `${comet.x}%`,
              animationDelay: `${comet.delay}s`,
              transform: `rotate(${comet.angle}deg)`
            }}
          />
        ))}
        
        {/* Туманности */}
        <div className="nebula nebula-orion"></div>
        <div className="nebula nebula-eagle"></div>
      </div>

      {/* Солнечная система */}
      
      {/* Юпитер */}
      <div className="planet planet-jupiter"></div>
      
      {/* Сатурн с кольцами */}
      <div className="saturn-container">
        <div className="saturn-rings"></div>
        <div className="planet planet-saturn"></div>
      </div>
      
      {/* Земля со спутником */}
      <div className="planet planet-earth"></div>
      <div className="moon earth-moon"></div>
      
      {/* Марс */}
      <div className="planet planet-mars"></div>
      
      {/* Дополнительные спутники */}
      {additionalMoons.map(moon => (
        <div
          key={`moon-${moon.id}`}
          className="moon"
          style={{
            width: `${moon.size}px`,
            height: `${moon.size}px`,
            top: moon.planet === 'mars' ? '25%' : '40%',
            left: moon.planet === 'mars' ? '20%' : '10%',
            animation: `moon-orbit ${moon.period}s infinite linear`,
            animationDelay: `${moon.id * 2}s`
          }}
        />
      ))}

      {/* Основной контент */}
      <div className="app-content">
        <RouterProvider router={myRouter} />
      </div>
      
      {/* Навигационный индикатор */}
      <div className="nav-indicator">
        <div className="planet-indicator"></div>
        <div>
          <div style={{ 
            fontWeight: '500',
            marginBottom: '6px',
            letterSpacing: '0.3px',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>Навигация системы</span>
            <span style={{
              fontSize: '0.7rem',
              padding: '2px 6px',
              borderRadius: '12px',
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#22c55e'
            }}>
              ONLINE
            </span>
          </div>
          <div style={{
            fontSize: '0.85rem',
            opacity: 0.8,
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            fontFamily: 'monospace'
          }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ opacity: 0.6 }}>UTC:</span>
              {time.toLocaleTimeString('ru-RU', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'UTC'
              })}
            </span>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ opacity: 0.6 }}>MISSION:</span>
              {formatMissionTime(missionTime)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App