import React, { useEffect, useState } from 'react';

interface TurtleProps {
  x: number;
  y: number;
  isWalking: boolean;
  isHappy: boolean;
}

const TURTLE_WIDTH = 100;
const TURTLE_HEIGHT = 70;

const Turtle: React.FC<TurtleProps> = ({ x, y, isWalking, isHappy }) => {
  const [vw, setVw] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );
  const [vh, setVh] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 0
  );

  useEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Calculamos left/top clamp (centramos con -half width/height como antes)
  const halfW = TURTLE_WIDTH / 2;
  const halfH = TURTLE_HEIGHT / 2;

  const minLeft = 0;
  const maxLeft = Math.max(0, vw - TURTLE_WIDTH);
  const desiredLeft = x - halfW;
  const clampedLeft = Math.min(Math.max(desiredLeft, minLeft), maxLeft);

  const minTop = 0;
  const maxTop = Math.max(0, vh - TURTLE_HEIGHT);
  const desiredTop = y - halfH;
  const clampedTop = Math.min(Math.max(desiredTop, minTop), maxTop);

  return (
    <div
      className={`absolute pointer-events-none transition-all duration-1000 ease-out ${isWalking ? 'animate-turtle-walk' : ''} ${isHappy ? 'animate-celebration' : ''}`}
      style={{
        left: clampedLeft,
        top: clampedTop,
        width: TURTLE_WIDTH,
        height: TURTLE_HEIGHT,
        zIndex: 40,
        transform: undefined, // si usás transform en otro lado, adaptá
      }}
    >
      {/* Turtle SVG - facing RIGHT */}
      <svg viewBox="0 0 120 80" className="w-full h-full drop-shadow-lg">
        {/* ... el resto igual ... */}
        <ellipse cx="35" cy="60" rx="10" ry="12" className="fill-turtle-body" />
        <ellipse cx="85" cy="60" rx="10" ry="12" className="fill-turtle-body" />
        <ellipse cx="95" cy="50" rx="12" ry="10" className="fill-turtle-body" />
        <ellipse cx="25" cy="50" rx="12" ry="10" className="fill-turtle-body" />
        <ellipse cx="15" cy="45" rx="8" ry="5" className="fill-turtle-body" />
        <ellipse cx="60" cy="40" rx="40" ry="28" className="fill-turtle-shell" />
        <ellipse cx="60" cy="35" rx="25" ry="18" className="fill-primary opacity-40" />
        <ellipse cx="45" cy="45" rx="10" ry="8" className="fill-grass-light opacity-30" />
        <ellipse cx="75" cy="45" rx="10" ry="8" className="fill-grass-light opacity-30" />
        <ellipse cx="60" cy="50" rx="8" ry="6" className="fill-grass-light opacity-30" />
        <ellipse cx="50" cy="28" rx="6" ry="4" className="fill-primary-foreground opacity-20" />
        <ellipse cx="105" cy="40" rx="15" ry="14" className="fill-turtle-body" />
        <circle cx="110" cy="35" r="5" className="fill-background" />
        <circle cx="112" cy="35" r="2.5" className="fill-foreground" />
        <ellipse cx="112" cy="42" rx="4" ry="2" className="fill-accent opacity-40" />
        {isHappy ? (
          <>
            <path
              d="M105 46 Q110 54 115 46"
              stroke="hsl(var(--foreground))"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
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

