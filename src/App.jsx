import { useState, useEffect, useMemo } from 'react'
import { RouterProvider } from 'react-router-dom'
import myRouter from './router'
import './App.css'

function App() {
  const [missionTime, setMissionTime] = useState(0)

  useEffect(() => {
    const missionTimer = setInterval(() => {
      setMissionTime(prev => prev + 1)
    }, 1000)
    
    return () => {
      clearInterval(missionTimer)
    }
  }, [])

  // Генерация звезд
  const stars = useMemo(() => {
    const starsArray = []
    for (let i = 0; i < 400; i++) {
      const size = Math.random()
      let starClass = 'star-small'
      if (size > 0.95) starClass = 'star-pulsar'
      else if (size > 0.85) starClass = 'star-nebula'
      else if (size > 0.7) starClass = 'star-large'
      else if (size > 0.4) starClass = 'star-medium'
      
      starsArray.push({
        id: i,
        class: starClass,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 15,
        duration: Math.random() * 8 + 4,
        twinkle: Math.random() * 3 + 1
      })
    }
    return starsArray
  }, [])

  // Генерация черных дыр и нейтронных звезд
  const cosmicObjects = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      type: i % 2 === 0 ? 'black-hole' : 'neutron-star',
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 15,
      size: Math.random() * 60 + 40,
      rotation: Math.random() * 360
    }))
  }, [])

  // Генерация галактик
  const galaxies = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      x: [15, 70, 40][i],
      y: [25, 60, 80][i],
      size: [120, 90, 150][i],
      type: ['spiral', 'elliptical', 'spiral'][i]
    }))
  }, [])

  // Генерация космических станций
  const spaceStations = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 70 + 15,
      speed: Math.random() * 50 + 30,
      size: Math.random() * 40 + 20,
      delay: i * 5
    }))
  }, [])

  // Генерация астероидного поля
  const asteroids = useMemo(() => {
    const asteroidsArray = []
    for (let i = 0; i < 50; i++) {
      asteroidsArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 4,
        speed: Math.random() * 20 + 10,
        delay: Math.random() * 10,
        rotation: Math.random() * 360
      })
    }
    return asteroidsArray
  }, [])

  // Генерация космических кораблей
  const spaceships = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 80 + 10,
      speed: Math.random() * 40 + 20,
      size: Math.random() * 25 + 15,
      type: i % 3 === 0 ? 'fighter' : i % 3 === 1 ? 'freighter' : 'explorer',
      delay: Math.random() * 15
    }))
  }, [])

  const formatMissionTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="app">
      {/* Фон - глубокий космос */}
      <div className="cosmos-background">
        {/* Темная туманность */}
        <div className="dark-nebula"></div>
        
        {/* Глубокий космос с градиентом */}
        <div className="deep-space-gradient"></div>
        
        {/* Галактики */}
        {galaxies.map(galaxy => (
          <div
            key={`galaxy-${galaxy.id}`}
            className={`galaxy galaxy-${galaxy.type}`}
            style={{
              left: `${galaxy.x}%`,
              top: `${galaxy.y}%`,
              width: `${galaxy.size}px`,
              height: `${galaxy.size}px`
            }}
          />
        ))}
        
        {/* Космические объекты */}
        {cosmicObjects.map(obj => (
          <div
            key={`cosmic-${obj.id}`}
            className={`cosmic-object ${obj.type}`}
            style={{
              left: `${obj.x}%`,
              top: `${obj.y}%`,
              width: `${obj.size}px`,
              height: `${obj.size}px`,
              transform: `rotate(${obj.rotation}deg)`
            }}
          >
            {obj.type === 'black-hole' && <div className="accretion-disk"></div>}
          </div>
        ))}
        
        {/* Звезды */}
        {stars.map(star => (
          <div
            key={`star-${star.id}`}
            className={`star ${star.class}`}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
              '--twinkle-speed': `${star.twinkle}s`
            }}
          />
        ))}
        
        {/* Астероидное поле */}
        <div className="asteroid-field">
          {asteroids.map(asteroid => (
            <div
              key={`asteroid-${asteroid.id}`}
              className="asteroid"
              style={{
                left: `${asteroid.x}%`,
                top: `${asteroid.y}%`,
                width: `${asteroid.size}px`,
                height: `${asteroid.size}px`,
                animationDuration: `${asteroid.speed}s`,
                animationDelay: `${asteroid.delay}s`,
                transform: `rotate(${asteroid.rotation}deg)`
              }}
            />
          ))}
        </div>
        
        {/* Космические станции */}
        <div className="space-stations">
          {spaceStations.map(station => (
            <div
              key={`station-${station.id}`}
              className="space-station"
              style={{
                left: `${station.x}%`,
                top: `${station.y}%`,
                width: `${station.size}px`,
                height: `${station.size}px`,
                animationDuration: `${station.speed}s`,
                animationDelay: `${station.delay}s`
              }}
            >
              <div className="station-ring"></div>
              <div className="station-core"></div>
              <div className="station-docking"></div>
            </div>
          ))}
        </div>
        
        {/* Космические корабли */}
        <div className="spaceship-fleet">
          {spaceships.map(ship => (
            <div
              key={`ship-${ship.id}`}
              className={`spaceship ${ship.type}`}
              style={{
                left: `${ship.x}%`,
                top: `${ship.y}%`,
                width: `${ship.size}px`,
                height: `${ship.size * 0.4}px`,
                animationDuration: `${ship.speed}s`,
                animationDelay: `${ship.delay}s`
              }}
            >
              <div className="ship-engine">
                <div className="engine-flame"></div>
              </div>
              <div className="ship-cockpit"></div>
            </div>
          ))}
        </div>
        
        {/* Космические вспышки */}
        <div className="cosmic-flares">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`flare-${i}`}
              className="cosmic-flare"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`
              }}
            />
          ))}
        </div>
        
        {/* Энергетические волны */}
        <div className="energy-waves">
          <div className="energy-wave wave-1"></div>
          <div className="energy-wave wave-2"></div>
          <div className="energy-wave wave-3"></div>
        </div>
      </div>

      {/* Основной контент - полностью прозрачный для фона */}
      <div className="app-container">
        <div className="app-content">
          <RouterProvider router={myRouter} />
        </div>
        
        {/* Компактная космическая панель */}
        <div className="cosmic-panel">
          <div className="panel-header">
            <div className="nav-status">
              <span className="status-dot active"></span>
              <span className="nav-label">MISSION</span>
            </div>
          </div>
          <div className="panel-body">
            <div className="mission-timer">
              {formatMissionTime(missionTime)}
            </div>
          </div>
          <div className="panel-footer">
            <div className="nav-data">
              <span className="data-item">
                <span className="data-icon">⚡</span>
                <span className="data-value">WARP 9.6</span>
              </span>
              <span className="data-divider">|</span>
              <span className="data-item">
                <span className="data-icon">🛡️</span>
                <span className="data-value">ONLINE</span>
              </span>
            </div>
          </div>
          <div className="panel-glow"></div>
        </div>
      </div>
      
      {/* Космическая пыль */}
      <div className="space-dust">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={`dust-${i}`}
            className="dust-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`
            }}
          />
        ))}
      </div>
      
      {/* Космическое излучение */}
      <div className="cosmic-radiation">
        <div className="radiation-pulse pulse-1"></div>
        <div className="radiation-pulse pulse-2"></div>
        <div className="radiation-pulse pulse-3"></div>
      </div>
    </div>
  )
}

export default App