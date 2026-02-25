
import React, { useEffect, useRef, useState } from 'react';

interface MorphicEyeProps {
  className?: string;
  isActive?: boolean;
}

const MorphicEye: React.FC<MorphicEyeProps> = ({ className = "w-14 h-14", isActive = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  // Mouse & Touch Tracking Logic
  useEffect(() => {
    if (!isActive) {
        setPupilPos({ x: 0, y: 0 });
        return;
    }

    const calculateGaze = (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance from center of the eye to the input
      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;

      // Constraint the movement within the eye socket
      const maxRadius = rect.width * 0.15; 
      
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Smooth clamping
      const moveDistance = Math.min(distance / 5, maxRadius); 

      const x = Math.cos(angle) * moveDistance;
      const y = Math.sin(angle) * moveDistance;

      setPupilPos({ x, y });
    };

    const handleMouseMove = (e: MouseEvent) => {
        calculateGaze(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
            calculateGaze(e.touches[0].clientX, e.touches[0].clientY);
        }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchstart', handleTouchMove); // React to initial tap

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchstart', handleTouchMove);
    };
  }, [isActive]);

  // Blinking Logic
  useEffect(() => {
    let blinkTimeout: ReturnType<typeof setTimeout>;

    const triggerBlink = () => {
      setIsBlinking(true);
      
      // Close eyes
      setTimeout(() => {
        setIsBlinking(false);
        // Schedule next blink randomly between 2s and 6s
        const nextBlink = 2000 + Math.random() * 4000;
        blinkTimeout = setTimeout(triggerBlink, nextBlink);
      }, 150); // Blink duration
    };

    // Initial start
    blinkTimeout = setTimeout(triggerBlink, 1000);

    return () => clearTimeout(blinkTimeout);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`rounded-full aspect-square bg-[#1a1a1a] flex items-center justify-center relative shadow-2xl border border-white/5 overflow-hidden flex-shrink-0 group ${className}`}
    >
      {/* Eyes Container - Moves with Cursor/Touch */}
      <div 
        className="w-full h-full flex items-center justify-center gap-[10%] transition-transform duration-100 ease-out will-change-transform"
        style={{ transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)` }}
      >
        {/* Left Eye - Bigger & Oval */}
        <div className="relative w-[24%] h-[32%]">
            <div 
                className={`w-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-150 ease-in-out absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                    isBlinking ? 'h-[10%] scale-x-125 mt-[10%]' : 'h-full'
                }`}
            ></div>
        </div>

        {/* Right Eye - Bigger & Oval */}
        <div className="relative w-[24%] h-[32%]">
            <div 
                className={`w-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-150 ease-in-out absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                    isBlinking ? 'h-[10%] scale-x-125 mt-[10%]' : 'h-full'
                }`}
            ></div>
        </div>
      </div>
    </div>
  );
};

export default MorphicEye;
