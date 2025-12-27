import React from 'react';

interface GameBackgroundProps {
  cameraX: number;
  worldWidth: number;
  screenWidth: number;
  screenHeight: number;
}

const GameBackground: React.FC<GameBackgroundProps> = ({ 
  cameraX, 
  worldWidth, 
  screenWidth,
  screenHeight 
}) => {
  // Parallax factors - lower = slower movement
  const skyParallax = 0.1;
  const cloudParallax = 0.3;
  const hillParallax = 0.5;
  const pathParallax = 1.0;
  
  const destinationX = worldWidth - 200;
  const destinationScreenX = destinationX - cameraX;
  const showDestination = destinationScreenX < screenWidth + 200 && destinationScreenX > -200;
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky gradient - moves very slowly */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, hsl(195 85% 80%) 0%, hsl(200 75% 90%) 60%, hsl(120 50% 70%) 100%)',
          transform: `translateX(${-cameraX * skyParallax}px)`,
        }}
      />
      
      {/* Sun - slow parallax */}
      <div 
        className="absolute top-8 w-24 h-24 rounded-full animate-pulse-glow"
        style={{
          right: 48 - cameraX * skyParallax,
          background: 'radial-gradient(circle, hsl(45 95% 70%) 0%, hsl(35 90% 65%) 100%)'
        }}
      />
      
      {/* Clouds layer - medium parallax */}
      <div 
        className="absolute top-0 left-0 w-full h-40"
        style={{ transform: `translateX(${-cameraX * cloudParallax}px)` }}
      >
        <div className="absolute top-16 left-8 animate-cloud-drift">
          <svg viewBox="0 0 120 60" className="w-28 h-14 opacity-90">
            <ellipse cx="30" cy="40" rx="25" ry="18" fill="white" />
            <ellipse cx="55" cy="35" rx="30" ry="22" fill="white" />
            <ellipse cx="85" cy="40" rx="25" ry="18" fill="white" />
            <ellipse cx="60" cy="45" rx="28" ry="15" fill="white" />
          </svg>
        </div>
        
        <div className="absolute top-24 left-[300px] animate-cloud-drift" style={{ animationDelay: '2s' }}>
          <svg viewBox="0 0 100 50" className="w-20 h-10 opacity-80">
            <ellipse cx="25" cy="30" rx="20" ry="15" fill="white" />
            <ellipse cx="50" cy="28" rx="25" ry="18" fill="white" />
            <ellipse cx="75" cy="32" rx="20" ry="14" fill="white" />
          </svg>
        </div>
        
        <div className="absolute top-12 left-[600px] animate-cloud-drift" style={{ animationDelay: '4s' }}>
          <svg viewBox="0 0 80 40" className="w-16 h-8 opacity-85">
            <ellipse cx="20" cy="25" rx="18" ry="12" fill="white" />
            <ellipse cx="40" cy="22" rx="22" ry="15" fill="white" />
            <ellipse cx="60" cy="26" rx="16" ry="11" fill="white" />
          </svg>
        </div>
        
        <div className="absolute top-20 left-[900px] animate-cloud-drift" style={{ animationDelay: '1s' }}>
          <svg viewBox="0 0 100 50" className="w-24 h-12 opacity-85">
            <ellipse cx="25" cy="30" rx="22" ry="16" fill="white" />
            <ellipse cx="55" cy="26" rx="28" ry="20" fill="white" />
            <ellipse cx="80" cy="32" rx="18" ry="13" fill="white" />
          </svg>
        </div>
        
        <div className="absolute top-8 left-[1200px] animate-cloud-drift" style={{ animationDelay: '3s' }}>
          <svg viewBox="0 0 90 45" className="w-20 h-10 opacity-80">
            <ellipse cx="22" cy="28" rx="20" ry="14" fill="white" />
            <ellipse cx="48" cy="24" rx="24" ry="17" fill="white" />
            <ellipse cx="70" cy="29" rx="17" ry="12" fill="white" />
          </svg>
        </div>
      </div>
      
      {/* Hills in background - medium parallax */}
      <div 
        className="absolute bottom-0 left-0 h-2/3"
        style={{ 
          width: worldWidth,
          transform: `translateX(${-cameraX * hillParallax}px)` 
        }}
      >
        <svg viewBox={`0 0 ${worldWidth / 10} 60`} preserveAspectRatio="none" className="w-full h-full">
          {/* Multiple hills across the world */}
          {Array.from({ length: Math.ceil(worldWidth / 400) }).map((_, i) => (
            <React.Fragment key={i}>
              <ellipse 
                cx={20 + i * 40} 
                cy="70" 
                rx="25" 
                ry="30" 
                className="fill-grass-light opacity-60" 
              />
              <ellipse 
                cx={40 + i * 40} 
                cy="75" 
                rx="20" 
                ry="25" 
                className="fill-grass-light opacity-50" 
              />
            </React.Fragment>
          ))}
          {/* Main grass area */}
          <rect x="0" y="45" width={worldWidth / 10} height="20" className="fill-grass" />
        </svg>
      </div>
      
      {/* Flowers scattered - moves with path */}
      <div 
        className="absolute bottom-0 left-0"
        style={{ 
          width: worldWidth,
          transform: `translateX(${-cameraX * pathParallax}px)` 
        }}
      >
        {Array.from({ length: Math.ceil(worldWidth / 150) }).map((_, i) => (
          <div 
            key={`flower-${i}`}
            className="absolute"
            style={{ 
              bottom: 80 + Math.sin(i * 2) * 20,
              left: 60 + i * 150 + Math.cos(i * 3) * 30
            }}
          >
            <svg viewBox="0 0 30 30" className="w-7 h-7 animate-gentle-bounce" style={{ animationDelay: `${i * 0.3}s` }}>
              <circle cx="15" cy="12" r="5" className={i % 3 === 0 ? 'fill-butterfly-pink' : i % 3 === 1 ? 'fill-secondary' : 'fill-butterfly-purple'} />
              <circle cx="15" cy="18" r="2.5" className="fill-star" />
              <rect x="14" y="20" width="2" height="6" className="fill-grass" />
            </svg>
          </div>
        ))}
      </div>
      
      {/* Path - moves with camera */}
      <div 
        className="absolute bottom-12 left-0 h-16"
        style={{ 
          width: worldWidth,
          transform: `translateX(${-cameraX * pathParallax}px)` 
        }}
      >
        <svg viewBox={`0 0 ${worldWidth} 64`} preserveAspectRatio="none" className="w-full h-full">
          <path
            d={`M0 32 ${Array.from({ length: Math.ceil(worldWidth / 100) }).map((_, i) => 
              `Q${50 + i * 100} ${i % 2 === 0 ? 20 : 44} ${100 + i * 100} 32`
            ).join(' ')}`}
            className="fill-none stroke-path"
            strokeWidth="40"
            strokeLinecap="round"
          />
          <path
            d={`M0 32 ${Array.from({ length: Math.ceil(worldWidth / 100) }).map((_, i) => 
              `Q${50 + i * 100} ${i % 2 === 0 ? 20 : 44} ${100 + i * 100} 32`
            ).join(' ')}`}
            className="fill-none stroke-path-dark"
            strokeWidth="3"
            strokeDasharray="8 8"
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      {/* Destination - Lake/House at end of world */}
      {showDestination && (
        <div 
          className="absolute bottom-20 transition-opacity duration-500"
          style={{ 
            left: destinationScreenX - 60,
            opacity: destinationScreenX < screenWidth ? 1 : 0.3
          }}
        >
          <svg viewBox="0 0 140 100" className="w-36 h-28">
            {/* Lake water */}
            <ellipse 
              cx="70" 
              cy="80" 
              rx="65" 
              ry="18" 
              className="fill-lake"
              style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
            />
            {/* Water shine */}
            <ellipse cx="50" cy="75" rx="18" ry="4" className="fill-background opacity-30" />
            <ellipse cx="85" cy="82" rx="12" ry="3" className="fill-background opacity-20" />
            
            {/* Little house */}
            <rect x="45" y="25" width="50" height="40" className="fill-house-wall" />
            <polygon points="30,27 70,0 110,27" className="fill-house-roof" />
            <rect x="60" y="42" width="20" height="23" className="fill-path-dark" />
            <circle cx="75" cy="54" r="2.5" className="fill-star" />
            
            {/* Windows */}
            <rect x="82" y="32" width="10" height="10" className="fill-sky-end" />
            <line x1="87" y1="32" x2="87" y2="42" stroke="hsl(var(--house-wall))" strokeWidth="1.5" />
            <line x1="82" y1="37" x2="92" y2="37" stroke="hsl(var(--house-wall))" strokeWidth="1.5" />
            
            <rect x="48" y="32" width="10" height="10" className="fill-sky-end" />
            <line x1="53" y1="32" x2="53" y2="42" stroke="hsl(var(--house-wall))" strokeWidth="1.5" />
            <line x1="48" y1="37" x2="58" y2="37" stroke="hsl(var(--house-wall))" strokeWidth="1.5" />
            
            {/* Chimney */}
            <rect x="85" y="8" width="10" height="15" className="fill-house-roof" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default GameBackground;
