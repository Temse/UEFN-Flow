import React, { useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';
import { useSettings } from '../lib/SettingsContext';

export default function MouseEffect() {
  const { mouseEffect, performanceMode, mouseColor, mouseSize } = useSettings();
  
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  
  const springConfig = performanceMode 
    ? { stiffness: 1000, damping: 50, mass: 0.1 } 
    : { stiffness: 35, damping: 20, mass: 1 };
    
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  const opacity = useSpring(0, { stiffness: 20, damping: 10 });

  useEffect(() => {
    if (!mouseEffect) {
      opacity.set(0);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      opacity.set(1);
    };
    
    const handleMouseLeave = () => {
      opacity.set(0);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.body.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseEffect, mouseX, mouseY, opacity]);

  if (!mouseEffect) return null;

  // Determine size multiplier
  const sizeMult = mouseSize === 'small' ? 0.6 : mouseSize === 'large' ? 1.5 : 1;

  // Calculate sizes based on multiplier and performance mode
  const coreSize = (performanceMode ? 300 : 500) * sizeMult;
  const coreBlur = (performanceMode ? 60 : 100) * sizeMult;
  
  const outerSize = 800 * sizeMult;
  const outerBlur = 140 * sizeMult;

  // Determine colors based on selection
  let coreBgClass = '';
  let outerBgClass = '';

  switch (mouseColor) {
    case 'dual':
      coreBgClass = 'bg-epic-cyan/20 dark:bg-epic-cyan/15';
      outerBgClass = 'bg-unreal-orange/15 dark:bg-unreal-orange/10';
      break;
    case 'cyan':
      coreBgClass = 'bg-[#00E5FF]/20 dark:bg-[#00E5FF]/15';
      outerBgClass = 'bg-[#00E5FF]/15 dark:bg-[#00E5FF]/10';
      break;
    case 'orange':
      coreBgClass = 'bg-[#FF5E00]/20 dark:bg-[#FF5E00]/15';
      outerBgClass = 'bg-[#FF5E00]/15 dark:bg-[#FF5E00]/10';
      break;
    case 'purple':
      coreBgClass = 'bg-purple-500/20 dark:bg-purple-500/15';
      outerBgClass = 'bg-purple-500/15 dark:bg-purple-500/10';
      break;
    case 'green':
      coreBgClass = 'bg-emerald-500/20 dark:bg-emerald-500/15';
      outerBgClass = 'bg-emerald-500/15 dark:bg-emerald-500/10';
      break;
    case 'white':
      coreBgClass = 'bg-white/20 dark:bg-white/10';
      outerBgClass = 'bg-white/15 dark:bg-white/5';
      break;
    default:
      coreBgClass = 'bg-epic-cyan/20 dark:bg-epic-cyan/15';
      outerBgClass = 'bg-unreal-orange/15 dark:bg-unreal-orange/10';
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden mix-blend-screen transition-colors duration-500">
      {/* Core Intense Glow */}
      <motion.div
        className={`absolute rounded-full transition-colors duration-500 ${coreBgClass}`}
        style={{
          width: coreSize,
          height: coreSize,
          filter: `blur(${coreBlur}px)`,
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          opacity
        }}
      />
      {/* Outer Subtle Glow - Disable in performance mode to save fill-rate */}
      {!performanceMode && (
        <motion.div
          className={`absolute rounded-full transition-colors duration-500 ${outerBgClass}`}
          style={{
            width: outerSize,
            height: outerSize,
            filter: `blur(${outerBlur}px)`,
            x: springX,
            y: springY,
            translateX: mouseColor === 'dual' ? '-40%' : '-50%',
            translateY: mouseColor === 'dual' ? '-60%' : '-50%',
            opacity: opacity as any
          }}
        />
      )}
    </div>
  );
}
