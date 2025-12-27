import React from 'react';

interface LeafProps {
  x: number;
  y: number;
  id: number;
  isRemoving: boolean;
}

const Leaf: React.FC<LeafProps> = ({ x, y, isRemoving }) => {
  return (
    <div
      className={`absolute pointer-events-none transition-all duration-500 ease-out ${
        isRemoving 
          ? 'opacity-0 scale-150 -translate-y-16 rotate-45' 
          : 'opacity-100 scale-100 rotate-0'
      }`}
      style={{
        left: x - 25,
        top: y - 20,
        width: 50,
        height: 40,
        zIndex: 30,
      }}
    >
      <svg viewBox="0 0 60 50" className="w-full h-full drop-shadow-md">
        {/* Leaf shape */}
        <ellipse 
          cx="30" 
          cy="25" 
          rx="25" 
          ry="18" 
          className="fill-primary"
          style={{ filter: 'brightness(0.9)' }}
        />
        {/* Leaf vein */}
        <path
          d="M10 25 Q30 20 50 25"
          stroke="hsl(var(--grass-light))"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M20 20 Q30 22 30 25"
          stroke="hsl(var(--grass-light))"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M40 20 Q30 22 30 25"
          stroke="hsl(var(--grass-light))"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M20 30 Q30 28 30 25"
          stroke="hsl(var(--grass-light))"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M40 30 Q30 28 30 25"
          stroke="hsl(var(--grass-light))"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Highlight */}
        <ellipse 
          cx="25" 
          cy="20" 
          rx="8" 
          ry="5" 
          className="fill-grass-light opacity-40"
        />
      </svg>
    </div>
  );
};

export default Leaf;
