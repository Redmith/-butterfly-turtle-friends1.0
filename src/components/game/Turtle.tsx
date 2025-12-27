import React, { useEffect, useState } from 'react';

interface TurtleProps {
  x: number;
  y: number;
  isWalking: boolean;
  isHappy: boolean;
  // opcional: id del contenedor si querés pasar otro
  containerId?: string;
}

const TURTLE_WIDTH = 100;
const TURTLE_HEIGHT = 70;

const Turtle: React.FC<TurtleProps> = ({ x, y, isWalking, isHappy, containerId = 'game-container' }) => {
  const [containerRect, setContainerRect] = useState<{ left: number; top: number; width: number; height: number }>({
    left: 0,
    top: 0,
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const getRect = () => {
      // preferimos visualViewport para móviles modernos
      const vv = (window as any).visualViewport;
      const container = document.getElementById(containerId) || document.getElementById('root') || document.body;
      if (!container) return;

      const rect = container.getBoundingClientRect();

      // si visualViewport existe, usa su width/height (mejor en móviles)
      const width = vv ? vv.width : rect.width || window.innerWidth;
      const height = vv ? vv.height : rect.height || window.innerHeight;

      // left/top del contenedor en relación al viewport (importante si el container no está en 0,0)
      const left = rect.left;
      const top = rect.top;

      setContainerRect({ left, top, width, height });
    };

    // inicial
    getRect();

    // eventos a escuchar: resize, orientationchange y visualViewport resize
    const onResize = () => getRect();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    const vv = (window as any).visualViewport;
    if (vv && vv.addEventListener) vv.addEventListener('resize', onResize);

    // cleanup
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      if (vv && vv.removeEventListener) vv.removeEventListener('resize', onResize);
    };
  }, [containerId]);

  // calculamos left/top relativos al container y los clampeamos
  const halfW = TURTLE_WIDTH / 2;
  const halfH = TURTLE_HEIGHT / 2;

  // desired posicion absoluta del sprite (coordenadas x,y que manejás)
  // asumimos que x,y son relativos al mismo origen que usás para posicionar (si no, ajustar)
  const desiredLeft = x - halfW - containerRect.left;
  const desiredTop = y - halfH - containerRect.top;

  const minLeft = 0;
  const maxLeft = Math.max(0, containerRect.width - TURTLE_WIDTH);
  const clampedLeft = Math.min(Math.max(desiredLeft, minLeft), maxLeft);

  const minTop = 0;
  const maxTop = Math.max(0, containerRect.height - TURTLE_HEIGHT);
  const clampedTop = Math.min(Math.max(desiredTop, minTop), maxTop);

  return (
    <div
      className={`absolute pointer-events-none transition-all duration-200 ease-out ${isWalking ? 'animate-turtle-walk' : ''} ${isHappy ? 'animate-celebration' : ''}`}
      style={{
        left: clampedLeft,
        top: clampedTop,
        width: TURTLE_WIDTH,
        height: TURTLE_HEIGHT,
        zIndex: 40,
      }}
    >
      {/* SVG igual que antes */}
      <svg viewBox="0 0 120 80" className="w-full h-full drop-shadow-lg">
        {/* ... contenido ... */}
      </svg>
    </div>
  );
};

export default Turtle;
