import React from 'react';

interface ButterflyProps {
  x: number;
  y: number;
  isFlying: boolean;
}

const Butterfly: React.FC<ButterflyProps> = ({ x, y, isFlying }) => {
  return (
    <div
      className={`absolute pointer-events-none transition-all duration-700 ease-out ${isFlying ? 'animate-float' : ''}`}
      style={{
        left: x - 40,
        top: y - 40,
        width: 80,
        height: 80,
        zIndex: 50,
      }}
    >
      {/* Butterfly SVG */}
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        {/* Left wing top */}
        <ellipse
          cx="35"
          cy="35"
          rx="28"
          ry="22"
          className={`fill-butterfly-pink ${isFlying ? 'animate-wing-flap' : ''}`}
          style={{ transformOrigin: '50px 50px' }}
        />
        {/* Left wing bottom */}
        <ellipse
          cx="32"
          cy="60"
          rx="22"
          ry="18"
          className={`fill-butterfly-orange ${isFlying ? 'animate-wing-flap' : ''}`}
          style={{ transformOrigin: '50px 50px', animationDelay: '0.05s' }}
        />
        {/* Right wing top */}
        <ellipse
          cx="65"
          cy="35"
          rx="28"
          ry="22"
          className={`fill-butterfly-purple ${isFlying ? 'animate-wing-flap' : ''}`}
          style={{ transformOrigin: '50px 50px' }}
        />
        {/* Right wing bottom */}
        <ellipse
          cx="68"
          cy="60"
          rx="22"
          ry="18"
          className={`fill-butterfly-pink ${isFlying ? 'animate-wing-flap' : ''}`}
          style={{ transformOrigin: '50px 50px', animationDelay: '0.05s' }}
        />
        {/* Wing decorations */}
        <circle cx="35" cy="35" r="8" className="fill-secondary opacity-70" />
        <circle cx="65" cy="35" r="8" className="fill-accent opacity-70" />
        <circle cx="32" cy="58" r="5" className="fill-primary opacity-60" />
        <circle cx="68" cy="58" r="5" className="fill-secondary opacity-60" />
        {/* Body */}
        <ellipse cx="50" cy="50" rx="6" ry="25" className="fill-foreground" />
        {/* Head */}
        <circle cx="50" cy="22" r="8" className="fill-foreground" />
        {/* Eyes */}
        <circle cx="47" cy="20" r="3" className="fill-background" />
        <circle cx="53" cy="20" r="3" className="fill-background" />
        <circle cx="47" cy="20" r="1.5" className="fill-foreground" />
        <circle cx="53" cy="20" r="1.5" className="fill-foreground" />
        {/* Antennae */}
        <path
          d="M46 15 Q40 5 35 8"
          stroke="hsl(var(--foreground))"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M54 15 Q60 5 65 8"
          stroke="hsl(var(--foreground))"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="35" cy="8" r="3" className="fill-butterfly-pink" />
        <circle cx="65" cy="8" r="3" className="fill-butterfly-purple" />
        {/* Smile */}
        <path
          d="M47 25 Q50 28 53 25"
          stroke="hsl(var(--background))"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default Butterfly;
