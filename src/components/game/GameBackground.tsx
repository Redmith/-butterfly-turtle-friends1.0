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
  screenHeight,
}) => {
  // Parallax factors (0..1)
  const skyParallax = 0.08;
  const cloudParallax = 0.25;
  const hillParallax = 0.45;
  const pathParallax = 1.0;

  const destinationX = worldWidth - 200;
  const destinationScreenX = destinationX - cameraX;
  const showDestination = destinationScreenX < screenWidth + 200 && destinationScreenX > -200;

  // Helper to render multiple decorative items positioned in world coords
  const renderHills = () => {
    const hills: React.ReactNode[] = [];
    // place hills every 300px across the world
    for (let i = 0; i < Math.ceil(worldWidth / 300); i++) {
      const worldLeft = i * 300 + 40;
      hills.push(
        <div
          key={`hill-${i}`}
          style={{
            position: 'absolute',
            left: worldLeft,
            bottom: 80,
            width: 260,
            height: 120,
            pointerEvents: 'none',
            transform: 'translateZ(0)',
            opacity: 0.9,
          }}
        >
          <svg viewBox="0 0 260 120" preserveAspectRatio="none" className="w-full h-full">
            <ellipse cx="130" cy="90" rx="130" ry="70" className="fill-grass-light" />
            <ellipse cx="90" cy="100" rx="90" ry="55" className="fill-grass-light opacity-60" />
          </svg>
        </div>
      );
    }
    return hills;
  };

  const renderFlowers = () => {
    const flowers: React.ReactNode[] = [];
    for (let i = 0; i < Math.ceil(worldWidth / 150); i++) {
      const worldLeft = 60 + i * 150 + Math.cos(i * 3) * 30;
      const bottom = 80 + Math.sin(i * 2) * 20;
      flowers.push(
        <div
          key={`flower-${i}`}
          style={{
            position: 'absolute',
            left: worldLeft,
            bottom,
            pointerEvents: 'none',
            transform: 'translateZ(0)',
          }}
        >
          <svg viewBox="0 0 30 30" className="w-7 h-7">
            <circle cx="15" cy="12" r="5" className={i % 3 === 0 ? 'fill-butterfly-pink' : i % 3 === 1 ? 'fill-secondary' : 'fill-butterfly-purple'} />
            <circle cx="15" cy="18" r="2.5" className="fill-star" />
            <rect x="14" y="20" width="2" height="6" className="fill-grass" />
          </svg>
        </div>
      );
    }
    return flowers;
  };

  // The "world" container moves left as cameraX grows.
  // Each layer inside can use a slightly different transform for parallax.
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* SKY (very slow parallax) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateX(${-cameraX * skyParallax}px)`,
          background: 'linear-gradient(180deg, hsl(195 85% 80%) 0%, hsl(200 75% 90%) 60%, hsl(120 50% 70%) 100%)',
        }}
      />

      {/* SUN fixed relative to world (moves with parallax) */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          left: Math.max(48, screenWidth - 220) - cameraX * skyParallax, // keep sun roughly top-right but parallax
          width: 96,
          height: 96,
          borderRadius: '9999px',
          background: 'radial-gradient(circle, hsl(45 95% 70%) 0%, hsl(35 90% 65%) 100%)',
          filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.08))',
        }}
      />

      {/* CLOUDS layer (absolute positions but moved by cloudParallax) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: worldWidth,
          height: 160,
          transform: `translateX(${-cameraX * cloudParallax}px)`,
        }}
      >
        {[80, 420, 760, 1100, 1400].map((left, i) => (
          <div key={i} style={{ position: 'absolute', left, top: 24 + (i % 3) * 12, opacity: 0.9 }}>
            <svg viewBox="0 0 120 60" className="w-28 h-14">
              <ellipse cx="30" cy="40" rx="25" ry="18" fill="white" />
              <ellipse cx="55" cy="35" rx="30" ry="22" fill="white" />
              <ellipse cx="85" cy="40" rx="25" ry="18" fill="white" />
            </svg>
          </div>
        ))}
      </div>

      {/* WORLD container: everything that uses world coordinates sits here.
          We translate the whole world using pathParallax/hillParallax for parallax effect.
          Important: leaves and turtles use the same world coordinate system (pixels). */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: worldWidth,
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {/* Hills (move slower than path) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: worldWidth,
            height: '40%',
            transform: `translateX(${-cameraX * hillParallax}px)`,
          }}
        >
          {renderHills()}
          {/* main grass strip */}
          <div style={{ position: 'absolute', left: 0, bottom: 0, width: worldWidth, height: 140, background: 'var(--grass-color)' }} />
        </div>

        {/* Flowers and small decorations (moves with pathParallax) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: worldWidth,
            height: 200,
            transform: `translateX(${-cameraX * pathParallax}px)`,
          }}
        >
          {renderFlowers()}
        </div>

        {/* Path (moves at pathParallax, and drawn using world coordinates) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 48,
            width: worldWidth,
            height: 120,
            transform: `translateX(${-cameraX * pathParallax}px)`,
          }}
        >
          <svg viewBox={`0 0 ${worldWidth} 64`} preserveAspectRatio="none" style={{ width: worldWidth, height: '100%' }}>
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

        {/* Destination (lake/house) placed using world coords, moved by pathParallax */}
        {showDestination && (
          <div
            style={{
              position: 'absolute',
              left: destinationX,
              bottom: 80,
              transform: `translateX(${-cameraX * pathParallax}px)`,
              transition: 'opacity .3s',
              opacity: destinationScreenX < screenWidth ? 1 : 0.35,
            }}
          >
            <svg viewBox="0 0 140 100" className="w-36 h-28">
              <ellipse cx="70" cy="80" rx="65" ry="18" className="fill-lake" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }} />
              <ellipse cx="50" cy="75" rx="18" ry="4" className="fill-background opacity-30" />
              <rect x="45" y="25" width="50" height="40" className="fill-house-wall" />
              <polygon points="30,27 70,0 110,27" className="fill-house-roof" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBackground;
