import React, { useState, useEffect, useCallback, useRef } from 'react';
import Butterfly from './Butterfly';
import Turtle from './Turtle';
import GameBackground from './GameBackground';
import CelebrationOverlay from './CelebrationOverlay';
import Leaf from './Leaf';

interface LeafData {
  id: number;
  worldX: number; // Position in world coordinates
  y: number;
  isRemoving: boolean;
  removed: boolean;
}

const TOTAL_LEAVES = 18;
const WORLD_WIDTH = 3000; // Total world width in pixels
const CAMERA_ADVANCE_PER_LEAF = 50; // Pixels to scroll per leaf removed
const TURTLE_SCREEN_X = 120; // Turtle stays near left side of screen

const GameCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const exitTimerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  const [butterflyPos, setButterflyPos] = useState({ x: 200, y: 200 }); // local (container) coords
  const [isDragging, setIsDragging] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [isTurtleWalking, setIsTurtleWalking] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [cameraX, setCameraX] = useState(0); // Camera offset in world coordinates
  const [targetCameraX, setTargetCameraX] = useState(0);
  const [exitProgress, setExitProgress] = useState(0);
  const [leaves, setLeaves] = useState<LeafData[]>([]);
  const [turtleWorldX, setTurtleWorldX] = useState(80);
  const [celebrationPhase, setCelebrationPhase] = useState(0); // 0: playing, 1: turtle advancing, 2: celebration

  // New flag to coordinate removal -> turtle movement
  const [leafJustRemoved, setLeafJustRemoved] = useState(false);

  const pathY = dimensions.height - 85;
  const destinationWorldX = WORLD_WIDTH - 200;

  // Initialize leaves spread across the world
  useEffect(() => {
    const newLeaves: LeafData[] = [];
    const startX = 200;
    const endX = WORLD_WIDTH - 300;
    const spacing = (endX - startX) / (TOTAL_LEAVES - 1);
    
    for (let i = 0; i < TOTAL_LEAVES; i++) {
      newLeaves.push({
        id: i,
        worldX: startX + (i * spacing) + (Math.random() * 40 - 20),
        y: pathY + (Math.sin(i * 0.8) * 10),
        isRemoving: false,
        removed: false,
      });
    }
    setLeaves(newLeaves);
  }, [pathY]);

  // Update dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Smooth camera animation
  useEffect(() => {
    if (Math.abs(cameraX - targetCameraX) < 1) return;
    
    const animationFrame = requestAnimationFrame(() => {
      setCameraX(prev => prev + (targetCameraX - prev) * 0.08);
    });
    
    return () => cancelAnimationFrame(animationFrame);
  }, [cameraX, targetCameraX]);

  // Play soft sound
  const playSound = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.03);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio not available
    }
  }, []);

  // Play whoosh sound for leaf removal
  const playWhooshSound = useCallback(() => {
    playSound(400, 0.2, 'sine');
    setTimeout(() => playSound(300, 0.15, 'sine'), 50);
  }, [playSound]);

  // Play celebration melody
  const playCelebrationMelody = useCallback(() => {
    const notes = [523, 587, 659, 784, 880, 784, 880, 988];
    notes.forEach((freq, i) => {
      setTimeout(() => playSound(freq, 0.3, 'sine'), i * 200);
    });
  }, [playSound]);

  // Find the next leaf blocking the turtle
  const getNextBlockingLeaf = useCallback(() => {
    const activeLeaves = leaves.filter(l => !l.removed && !l.isRemoving);
    if (activeLeaves.length === 0) return null;
    
    const blockingLeaves = activeLeaves.filter(l => l.worldX > turtleWorldX + 50);
    if (blockingLeaves.length === 0) return null;
    
    return blockingLeaves.reduce((min, l) => l.worldX < min.worldX ? l : min);
  }, [leaves, turtleWorldX]);

  // Move turtle when path is clear AND a leaf was just removed
  useEffect(() => {
    // Only start turtle movement when a leaf was just removed.
    if (!leafJustRemoved) return;
    if (gameWon || celebrationPhase > 0) return;

    const nextLeaf = getNextBlockingLeaf();
    const allLeavesCleared = leaves.filter(l => !l.removed && !l.isRemoving).length === 0;
    
    if (allLeavesCleared && celebrationPhase === 0) {
      // Start celebration sequence
      setCelebrationPhase(1);
      // consume the flag so turtle celebration effect can manage movement
      setLeafJustRemoved(false);
      return;
    }
    
    const targetWorldX = nextLeaf ? nextLeaf.worldX - 60 : turtleWorldX;
    
    if (turtleWorldX < targetWorldX) {
      setIsTurtleWalking(true);
      
      const moveInterval = setInterval(() => {
        setTurtleWorldX(prev => {
          const newX = Math.min(prev + 1.5, targetWorldX);

          // When the turtle reaches the target, clear the flag and stop walking
          if (newX >= targetWorldX) {
            setIsTurtleWalking(false);
            setLeafJustRemoved(false);
            // Note: the interval cleanup will run because effect will re-run/cleanup
          }

          return newX;
        });
      }, 40);

      return () => clearInterval(moveInterval);
    } else {
      // if no movement needed, just clear flags
      setIsTurtleWalking(false);
      setLeafJustRemoved(false);
    }
  }, [getNextBlockingLeaf, leaves, celebrationPhase, gameWon, turtleWorldX, leafJustRemoved]);

  // Handle celebration phase - turtle advances to destination
  useEffect(() => {
    if (celebrationPhase !== 1) return;
    
    // ensure no leaf removal races
    setLeafJustRemoved(false);
    setIsTurtleWalking(true);
    
    const advanceInterval = setInterval(() => {
      setTurtleWorldX(prev => {
        const newX = prev + 3;
        
        // Also advance camera to follow
        setTargetCameraX(curr => Math.min(curr + 3, WORLD_WIDTH - dimensions.width));
        
        if (newX >= destinationWorldX - 50) {
          setCelebrationPhase(2);
          setGameWon(true);
          setIsTurtleWalking(false);
          playCelebrationMelody();
          return destinationWorldX - 50;
        }
        return newX;
      });
    }, 30);
    
    return () => clearInterval(advanceInterval);
  }, [celebrationPhase, destinationWorldX, dimensions.width, playCelebrationMelody]);

  // Check if butterfly is dragged over the ACTIVE leaf only
  const checkLeafCollision = useCallback(
    (screenX: number, screenY: number) => {
      const hitRadius = 55;

      const activeLeaf = leaves
        .filter(
          l =>
            !l.removed &&
            !l.isRemoving &&
            l.worldX > turtleWorldX + 50
        )
        .sort((a, b) => a.worldX - b.worldX)[0];

      if (!activeLeaf) return null;

      const leafScreenX = activeLeaf.worldX - cameraX;

      if (
        leafScreenX < -50 ||
        leafScreenX > dimensions.width + 50
      )
        return null;

      const distance = Math.sqrt(
        Math.pow(screenX - leafScreenX, 2) +
          Math.pow(screenY - activeLeaf.y, 2)
      );

      return distance < hitRadius ? activeLeaf.id : null;
    },
    [leaves, cameraX, dimensions.width, turtleWorldX]
  );

  // Remove ONLY one leaf and wait for turtle
  const removeLeaf = useCallback(
    (leafId: number) => {
      // Block if turtle is already walking
      if (isTurtleWalking) return;

      playWhooshSound();
      setLeafJustRemoved(true);
      setIsTurtleWalking(true);

      setLeaves(prev =>
        prev.map(l =>
          l.id === leafId
            ? { ...l, isRemoving: true }
            : l
        )
      );

      setTargetCameraX(prev =>
        Math.min(
          prev + CAMERA_ADVANCE_PER_LEAF,
          WORLD_WIDTH - dimensions.width
        )
      );

      setTimeout(() => {
        setLeaves(prev =>
          prev.map(l =>
            l.id === leafId
              ? {
                  ...l,
                  removed: true,
                  isRemoving: false,
                }
              : l
          )
        );
      }, 500);
    },
    [isTurtleWalking, playWhooshSound, dimensions.width]
  );

  // Convert client (viewport) coords to container-local coords
  const clientToLocal = useCallback((clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    const left = rect?.left ?? 0;
    const top = rect?.top ?? 0;

    return { x: clientX - left, y: clientY - top };
  }, []);

  // Handle drag move
  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || gameWon) return;

    const local = clientToLocal(clientX, clientY);
    setButterflyPos({ x: local.x, y: local.y });
    setIsFlying(true);
    
    // Check for leaf collision (local coordinates)
    const hitLeafId = checkLeafCollision(local.x, local.y);
    if (hitLeafId !== null) {
      removeLeaf(hitLeafId);
    }
  }, [isDragging, gameWon, checkLeafCollision, removeLeaf, clientToLocal]);

  // Handle drag start
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    if (gameWon) {
      // Reset game on tap after winning
      setButterflyPos({ x: 200, y: 200 });
      setTurtleWorldX(80);
      setGameWon(false);
      setCelebrationPhase(0);
      setCameraX(0);
      setTargetCameraX(0);
      setLeaves(prev => prev.map(l => ({ ...l, isRemoving: false, removed: false })));
      return;
    }
    
    const local = clientToLocal(clientX, clientY);
    setIsDragging(true);
    setButterflyPos({ x: local.x, y: local.y });
    setIsFlying(true);
    playSound(600, 0.1, 'sine');
  }, [gameWon, playSound, clientToLocal]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setTimeout(() => setIsFlying(false), 300);
  }, []);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length > 1) return;
    
    const touch = e.touches[0];
    const local = clientToLocal(touch.clientX, touch.clientY);

    // Check for exit corner (top-left relative to container)
    if (local.x < 50 && local.y < 50) {
      exitTimerRef.current = window.setTimeout(() => {
        window.close();
        window.location.href = 'about:blank';
      }, 5000);
      
      const startTime = Date.now();
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setExitProgress(Math.min(elapsed / 5000, 1));
        if (elapsed >= 5000) clearInterval(progressInterval);
      }, 100);
      
      return;
    }
    
    handleDragStart(touch.clientX, touch.clientY);
  }, [handleDragStart, clientToLocal]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  }, [handleDragMove]);

  const handleTouchEnd = useCallback(() => {
    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
      setExitProgress(0);
    }
    handleDragEnd();
  }, [handleDragEnd]);

  // Mouse handlers for desktop
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    handleDragStart(e.clientX, e.clientY);
  }, [handleDragStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    handleDragMove(e.clientX, e.clientY);
  }, [handleDragMove]);

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Prevent context menu and other gestures
  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();
    
    document.addEventListener('contextmenu', preventDefault);
    document.addEventListener('selectstart', preventDefault);
    document.addEventListener('dragstart', preventDefault);
    
    return () => {
      document.removeEventListener('contextmenu', preventDefault);
      document.removeEventListener('selectstart', preventDefault);
      document.removeEventListener('dragstart', preventDefault);
    };
  }, []);

  // Count remaining leaves for progress indicator
  const remainingLeaves = leaves.filter(l => !l.removed && !l.isRemoving).length;
  const totalLeaves = TOTAL_LEAVES;

  // Calculate visible leaves (on screen)
  const visibleLeaves = leaves.filter(leaf => {
    if (leaf.removed) return false;
    const screenX = leaf.worldX - cameraX;
    return screenX >= -60 && screenX <= dimensions.width + 60;
  });
    // --- FIX DEFINITIVO: clamp de la tortuga en pantalla ---
  const TURTLE_WIDTH = 100;

  const turtleScreenX =
    TURTLE_SCREEN_X + (turtleWorldX - cameraX - 80);

  const clampedTurtleX = Math.min(
    Math.max(turtleScreenX, 0),
    dimensions.width - TURTLE_WIDTH

  return (
    <div
      id="game-container"
      ref={containerRef}
      className="fixed inset-0 overflow-hidden cursor-pointer"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
    >
      <GameBackground 
        cameraX={cameraX} 
        worldWidth={WORLD_WIDTH}
        screenWidth={dimensions.width}
        screenHeight={dimensions.height}
      />
      
      {/* Leaves on the path - only render visible ones */}
      {visibleLeaves.map(leaf => (
        <Leaf
          key={leaf.id}
          id={leaf.id}
          x={leaf.worldX - cameraX}
          y={leaf.y}
          isRemoving={leaf.isRemoving}
        />
      ))}
      
      <Butterfly x={butterflyPos.x} y={butterflyPos.y} isFlying={isFlying} />
      
      {/* Turtle stays in fixed screen position while world moves */}
    <Turtle 
  x={clampedTurtleX}
  y={pathY}
  isWalking={isTurtleWalking} 
  isHappy={gameWon}
/>
      
      <CelebrationOverlay isActive={gameWon} />
      
      {/* Hidden exit progress indicator */}
      {exitProgress > 0 && (
        <div className="absolute top-2 left-2 w-8 h-8">
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="3"
              opacity="0.3"
            />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="hsl(var(--foreground))"
              strokeWidth="3"
              strokeDasharray={`${exitProgress * 100} 100`}
              strokeLinecap="round"
              transform="rotate(-90 18 18)"
              opacity="0.5"
            />
          </svg>
        </div>
      )}
      
      {/* Drag hint */}
      {remainingLeaves > 0 && !isDragging && cameraX < 50 && (
        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 animate-gentle-bounce opacity-50 pointer-events-none">
          <svg viewBox="0 0 80 80" className="w-16 h-16">
            {/* Hand with drag motion */}
            <ellipse cx="40" cy="50" rx="12" ry="16" className="fill-foreground opacity-30" />
            <circle cx="40" cy="30" r="6" className="fill-foreground opacity-30" />
            {/* Drag arrows */}
            <path d="M20 40 L10 40 M10 40 L15 35 M10 40 L15 45" 
              stroke="hsl(var(--foreground))" strokeWidth="2" opacity="0.3" fill="none" strokeLinecap="round" />
            <path d="M60 40 L70 40 M70 40 L65 35 M70 40 L65 45" 
              stroke="hsl(var(--foreground))" strokeWidth="2" opacity="0.3" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      )}
      
      {/* Progress indicator - leaf icons */}
      {!gameWon && remainingLeaves > 0 && (
        <div className="absolute top-4 right-4 flex items-center gap-2 opacity-50 pointer-events-none">
          {/* Progress bar */}
          <div className="w-20 h-3 bg-muted/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary/60 rounded-full transition-all duration-500"
              style={{ width: `${((totalLeaves - remainingLeaves) / totalLeaves) * 100}%` }}
            />
          </div>
          <svg viewBox="0 0 30 25" className="w-5 h-4">
            <ellipse cx="15" cy="12" rx="12" ry="9" className="fill-primary" />
          </svg>
          <span className="text-foreground font-nunito font-bold text-sm">
            {remainingLeaves}
          </span>
        </div>
      )}
    </div>
  );
};

export default GameCanvas;
