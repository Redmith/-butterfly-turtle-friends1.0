import React from 'react';

interface TurtleProps {
  x: number;
  y: number;
  isWalking: boolean;
  isHappy: boolean;
}

const Turtle: React.FC<TurtleProps> = ({ x, y, isWalking, isHappy }) => {
  return (
    <div
      className={`absolute pointer-events-none transition-all duration-1000 ease-out ${isWalking ? 'animate-turtle-walk' : ''} ${isHappy ? 'animate-celebration' : ''}`}
      style={{
        left: x - 50,
        top: y - 35,
        width: 100,
        height: 70,
        zIndex: 40,
      }}
    >
      {/* Turtle SVG - facing RIGHT */}
      <svg viewBox="0 0 120 80" className="w-full h-full drop-shadow-lg">
        {/* Back legs (now on left side) */}
        <ellipse cx="35" cy="60" rx="10" ry="12" className="fill-turtle-body" />
        <ellipse cx="85" cy="60" rx="10" ry="12" className="fill-turtle-body" />
        
        {/* Front legs (now on right side) */}
        <ellipse cx="95" cy="50" rx="12" ry="10" className="fill-turtle-body" />
        <ellipse cx="25" cy="50" rx="12" ry="10" className="fill-turtle-body" />
        
        {/* Tail (now on left) */}
        <ellipse cx="15" cy="45" rx="8" ry="5" className="fill-turtle-body" />
        
        {/* Shell base */}
        <ellipse cx="60" cy="40" rx="40" ry="28" className="fill-turtle-shell" />
        
        {/* Shell pattern */}
        <ellipse cx="60" cy="35" rx="25" ry="18" className="fill-primary opacity-40" />
        <ellipse cx="45" cy="45" rx="10" ry="8" className="fill-grass-light opacity-30" />
        <ellipse cx="75" cy="45" rx="10" ry="8" className="fill-grass-light opacity-30" />
        <ellipse cx="60" cy="50" rx="8" ry="6" className="fill-grass-light opacity-30" />
        
        {/* Shell highlights */}
        <ellipse cx="50" cy="28" rx="6" ry="4" className="fill-primary-foreground opacity-20" />
        
        {/* Head (now on right side) */}
        <ellipse cx="105" cy="40" rx="15" ry="14" className="fill-turtle-body" />
        
        {/* Eyes (facing right) */}
        <circle cx="110" cy="35" r="5" className="fill-background" />
        <circle cx="112" cy="35" r="2.5" className="fill-foreground" />
        
        {/* Blush */}
        <ellipse cx="112" cy="42" rx="4" ry="2" className="fill-accent opacity-40" />
        
        {/* Mouth - changes with happiness */}
        {isHappy ? (
          <>
            <path
              d="M105 46 Q110 54 115 46"
              stroke="hsl(var(--foreground))"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            {/* Sparkles when happy */}
            <circle cx="118" cy="30" r="2" className="fill-star animate-star-twinkle" />
            <circle cx="100" cy="28" r="1.5" className="fill-star animate-star-twinkle" style={{ animationDelay: '0.3s' }} />
          </>
        ) : (
          <path
            d="M106 48 Q110 50 114 48"
            stroke="hsl(var(--foreground))"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  );
};

export default Turtle;
