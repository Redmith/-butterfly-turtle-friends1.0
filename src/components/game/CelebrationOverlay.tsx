import React, { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface CelebrationOverlayProps {
  isActive: boolean;
}

const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({ isActive }) => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    if (isActive) {
      const newStars: Star[] = [];
      for (let i = 0; i < 20; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 30 + Math.random() * 40,
          delay: Math.random() * 0.5,
        });
      }
      setStars(newStars);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Colorful overlay glow */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at center, hsl(45 95% 70% / 0.5) 0%, transparent 70%)'
        }}
      />
      
      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute animate-star-burst"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
          }}
        >
          <svg viewBox="0 0 50 50" className="w-full h-full animate-pulse-glow">
            <polygon
              points="25,2 31,18 48,20 35,32 39,48 25,40 11,48 15,32 2,20 19,18"
              className="fill-star"
            />
            <polygon
              points="25,8 29,18 40,19 32,27 34,38 25,33 16,38 18,27 10,19 21,18"
              className="fill-secondary opacity-60"
            />
          </svg>
        </div>
      ))}
      
      {/* Big center star */}
      <div 
        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 animate-star-burst"
        style={{ animationDelay: '0.3s' }}
      >
        <svg viewBox="0 0 100 100" className="w-32 h-32 animate-pulse-glow">
          <polygon
            points="50,5 61,35 95,40 70,62 78,95 50,78 22,95 30,62 5,40 39,35"
            className="fill-star"
          />
          <polygon
            points="50,15 58,35 80,38 65,52 70,75 50,65 30,75 35,52 20,38 42,35"
            className="fill-secondary opacity-50"
          />
        </svg>
      </div>
      
      {/* Hearts */}
      <div className="absolute left-1/4 top-1/2 animate-celebration" style={{ animationDelay: '0.2s' }}>
        <svg viewBox="0 0 50 50" className="w-16 h-16">
          <path
            d="M25 45 L5 25 C-5 15 5 0 25 15 C45 0 55 15 45 25 Z"
            className="fill-accent"
          />
        </svg>
      </div>
      
      <div className="absolute right-1/4 top-1/3 animate-celebration" style={{ animationDelay: '0.4s' }}>
        <svg viewBox="0 0 50 50" className="w-12 h-12">
          <path
            d="M25 45 L5 25 C-5 15 5 0 25 15 C45 0 55 15 45 25 Z"
            className="fill-butterfly-pink"
          />
        </svg>
      </div>
      
      {/* Confetti circles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={`confetti-${i}`}
          className="absolute rounded-full animate-celebration"
          style={{
            left: `${10 + (i * 7)}%`,
            top: `${20 + Math.sin(i) * 30}%`,
            width: 12 + Math.random() * 12,
            height: 12 + Math.random() * 12,
            backgroundColor: [
              'hsl(var(--butterfly-pink))',
              'hsl(var(--butterfly-orange))',
              'hsl(var(--butterfly-purple))',
              'hsl(var(--star))',
              'hsl(var(--secondary))',
            ][i % 5],
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
};

export default CelebrationOverlay;
