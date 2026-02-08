import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Book } from '../types';

interface BookOpeningAnimationProps {
  book: Book;
  onAnimationComplete: () => void;
  isClosing?: boolean;
}

export function BookOpeningAnimation({ book, onAnimationComplete, isClosing = false }: BookOpeningAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 1800);
    
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Dr. Strange style magic circles */}
      <>
        {/* Outer large circle */}
        <motion.div
          className="absolute left-1/2 top-1/2 pointer-events-none"
          style={{
            width: '700px',
            height: '700px',
            marginLeft: '-350px',
            marginTop: '-350px',
          }}
          initial={{ 
            opacity: isClosing ? 0 : 0, 
            scale: isClosing ? 1.2 : 0.5, 
            rotate: isClosing ? 360 : 0 
          }}
          animate={{ 
            opacity: isClosing ? [0, 0.8, 0.8, 0] : [0, 0.8, 0.8, 0],
            scale: isClosing ? [1.2, 1.1, 1.1, 0.5] : [0.5, 1.1, 1.1, 1.2],
            rotate: isClosing ? 0 : 360
          }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Outer ring */}
              <circle cx="100" cy="100" r="95" fill="none" stroke={book.accentColor} strokeWidth="0.5" opacity="0.8" 
                      style={{ filter: `drop-shadow(0 0 8px ${book.accentColor})` }} />
              <circle cx="100" cy="100" r="90" fill="none" stroke={book.accentColor} strokeWidth="0.3" opacity="0.6" />
              
              {/* Geometric patterns */}
              {[...Array(8)].map((_, i) => {
                const angle = (i * 45) * Math.PI / 180;
                const x1 = 100 + 85 * Math.cos(angle);
                const y1 = 100 + 85 * Math.sin(angle);
                const x2 = 100 + 95 * Math.cos(angle);
                const y2 = 100 + 95 * Math.sin(angle);
                return (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} 
                        stroke={book.accentColor} strokeWidth="0.5" opacity="0.7" />
                );
              })}
              
              {/* Runic symbols around circle */}
              {['✦', '◈', '◆', '✧', '⬟', '⬢', '⟡', '※'].map((rune, i) => {
                const angle = (i * 45 - 90) * Math.PI / 180;
                const x = 100 + 92 * Math.cos(angle);
                const y = 100 + 92 * Math.sin(angle);
                return (
                  <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                        fill={book.accentColor} fontSize="6" opacity="0.9"
                        style={{ filter: `drop-shadow(0 0 3px ${book.accentColor})` }}>
                    {rune}
                  </text>
                );
              })}
            </svg>
          </motion.div>

          {/* Middle circle - counter-rotating */}
          <motion.div
            className="absolute left-1/2 top-1/2 pointer-events-none"
            style={{
              width: '500px',
              height: '500px',
              marginLeft: '-250px',
              marginTop: '-250px',
            }}
            initial={{ 
              opacity: isClosing ? 0 : 0, 
              scale: isClosing ? 1.1 : 0.6, 
              rotate: isClosing ? -360 : 0 
            }}
            animate={{ 
              opacity: isClosing ? [0, 1, 1, 0] : [0, 1, 1, 0],
              scale: isClosing ? [1.1, 1, 1, 0.6] : [0.6, 1, 1, 1.1],
              rotate: isClosing ? 0 : -360
            }}
            transition={{ duration: 1.8, ease: "easeOut" }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="95" fill="none" stroke={book.accentColor} strokeWidth="0.4" opacity="0.7"
                      style={{ filter: `drop-shadow(0 0 6px ${book.accentColor})` }} />
              <circle cx="100" cy="100" r="85" fill="none" stroke={book.accentColor} strokeWidth="0.3" opacity="0.5"
                      strokeDasharray="5,5" />
              
              {/* Hexagon */}
              <polygon points="100,15 173,57.5 173,142.5 100,185 27,142.5 27,57.5" 
                       fill="none" stroke={book.accentColor} strokeWidth="0.4" opacity="0.6" />
              
              {/* Inner connecting lines */}
              {[...Array(6)].map((_, i) => {
                const angle = (i * 60 - 90) * Math.PI / 180;
                const x = 100 + 70 * Math.cos(angle);
                const y = 100 + 70 * Math.sin(angle);
                return (
                  <line key={i} x1="100" y1="100" x2={x} y2={y} 
                        stroke={book.accentColor} strokeWidth="0.3" opacity="0.4" />
                );
              })}
            </svg>
          </motion.div>

          {/* Inner circle - fastest rotation */}
          <motion.div
            className="absolute left-1/2 top-1/2 pointer-events-none"
            style={{
              width: '350px',
              height: '350px',
              marginLeft: '-175px',
              marginTop: '-175px',
            }}
            initial={{ 
              opacity: isClosing ? 0 : 0, 
              scale: isClosing ? 1.05 : 0.7, 
              rotate: isClosing ? 720 : 0 
            }}
            animate={{ 
              opacity: isClosing ? [0, 1, 1, 0] : [0, 1, 1, 0],
              scale: isClosing ? [1.05, 1, 1, 0.7] : [0.7, 1, 1, 1.05],
              rotate: isClosing ? 0 : 720
            }}
            transition={{ duration: 1.8, ease: "easeOut" }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="90" fill="none" stroke={book.accentColor} strokeWidth="0.5" opacity="0.8"
                      style={{ filter: `drop-shadow(0 0 10px ${book.accentColor})` }} />
              <circle cx="100" cy="100" r="80" fill="none" stroke={book.accentColor} strokeWidth="0.3" opacity="0.6" />
              
              {/* Triangle */}
              <polygon points="100,20 180,180 20,180" 
                       fill="none" stroke={book.accentColor} strokeWidth="0.5" opacity="0.7" />
              
              {/* Center star */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30) * Math.PI / 180;
                const length = i % 2 === 0 ? 25 : 15;
                const x = 100 + length * Math.cos(angle);
                const y = 100 + length * Math.sin(angle);
                return (
                  <line key={i} x1="100" y1="100" x2={x} y2={y} 
                        stroke={book.accentColor} strokeWidth="0.4" opacity="0.6" />
                );
              })}
            </svg>
          </motion.div>

          {/* Center glyph */}
          <motion.div
            className="absolute left-1/2 top-1/2 text-6xl pointer-events-none"
            style={{
              marginLeft: '-30px',
              marginTop: '-40px',
              color: book.accentColor,
              textShadow: `0 0 30px ${book.accentColor}, 0 0 60px ${book.accentColor}`,
            }}
            initial={{ 
              opacity: isClosing ? 0 : 0, 
              scale: isClosing ? 1.5 : 0, 
              rotate: isClosing ? 360 : 0 
            }}
            animate={{ 
              opacity: isClosing ? [0, 1, 1, 0] : [0, 1, 1, 0],
              scale: isClosing ? [1.5, 1, 1.2, 0] : [0, 1.2, 1, 1.5],
              rotate: isClosing ? [360, 180, 0] : [0, 180, 360]
            }}
            transition={{ duration: 1.8, ease: "easeOut" }}
          >
            ✵
          </motion.div>
        </>
      )

      {/* Magical particles */}
      {[...Array(30)].map((_, i) => {
        const randomX = (Math.random() - 0.5) * 800;
        const randomY = (Math.random() - 0.5) * 600;
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 8 + 4 + 'px',
              height: Math.random() * 8 + 4 + 'px',
              background: `radial-gradient(circle, ${book.accentColor}, transparent)`,
              boxShadow: `0 0 ${Math.random() * 20 + 10}px ${book.accentColor}`,
              left: '50%',
              top: '50%',
            }}
            initial={{ 
              opacity: isClosing ? 0 : 0, 
              scale: isClosing ? 0.5 : 0,
              x: isClosing ? randomX : 0,
              y: isClosing ? randomY : 0,
            }}
            animate={{ 
              opacity: isClosing ? [0, 1, 0] : [0, 1, 0],
              scale: isClosing ? [0.5, 1, 0] : [0, 1, 0.5],
              x: isClosing ? 0 : randomX,
              y: isClosing ? 0 : randomY,
            }}
            transition={{ 
              duration: Math.random() * 1.5 + 1,
              delay: Math.random() * 0.8,
              ease: "easeOut"
            }}
          />
        );
      })}

      {/* Energy waves */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
          style={{
            width: '400px',
            height: '400px',
            marginLeft: '-200px',
            marginTop: '-200px',
            border: `2px solid ${book.accentColor}`,
            boxShadow: `0 0 20px ${book.accentColor}`,
          }}
          initial={{ 
            opacity: isClosing ? 0 : 0, 
            scale: isClosing ? 2.5 : 0.8 
          }}
          animate={{ 
            opacity: isClosing ? [0, 0.6, 0] : [0, 0.6, 0],
            scale: isClosing ? [2.5, 2, 0.8] : [0.8, 2, 2.5]
          }}
          transition={{ 
            duration: 1.5,
            delay: i * 0.3,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Book container - top-down view */}
      <motion.div 
        className="relative w-[800px] h-[600px]" 
        style={{ perspective: '2000px' }}
        initial={{ opacity: isClosing ? 1 : 1 }}
        animate={{ opacity: isClosing ? [1, 1, 0] : [1, 1, 0] }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
      >
        
        {/* Base book (right page/back cover - always visible) */}
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: '400px',
            height: '550px',
            marginLeft: '-200px',
            marginTop: '-275px',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Right side - first page */}
          <div
            className="absolute inset-0 rounded-r-lg shadow-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(to left, #f5e6d3, #f9f0e1)',
              border: '1px solid #d4c4a8',
              borderLeft: 'none',
            }}
          >
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(139, 69, 19, 0.1) 28px, rgba(139, 69, 19, 0.1) 29px)`
              }}
            />
            
            <div className="absolute inset-0 p-12 pt-20">
              {[...Array(14)].map((_, i) => (
                <div
                  key={`page-${i}`}
                  className="h-[1px] bg-amber-900/15 mb-[27px]"
                />
              ))}
            </div>
          </div>

          {/* Spine */}
          <div
            className="absolute left-0 top-0 bottom-0"
            style={{
              width: '25px',
              background: `linear-gradient(to right, ${book.color}aa, ${book.color}f0, ${book.color}cc)`,
              border: `1px solid ${book.accentColor}40`,
              boxShadow: '0 0 15px rgba(0,0,0,0.4), inset 0 0 8px rgba(0,0,0,0.3)',
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div style={{ 
                width: '80%', 
                height: '2px', 
                background: book.accentColor + '60'
              }} />
              <div style={{ 
                width: '80%', 
                height: '2px', 
                background: book.accentColor + '60'
              }} />
            </div>
          </div>
        </div>

        {/* Front cover - opens from right to left */}
        <motion.div
          className="absolute left-1/2 top-1/2"
          style={{
            width: '400px',
            height: '550px',
            marginLeft: '-200px',
            marginTop: '-275px',
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
          }}
          initial={{ 
            rotateY: isClosing ? -175 : 0,
          }}
          animate={{ 
            rotateY: isClosing ? 0 : -175,
          }}
          transition={{ 
            duration: 1.8,
            ease: [0.4, 0.0, 0.2, 1],
            delay: 0.2
          }}
        >
          {/* Front of cover (what you see when book is closed) */}
          <div
            className="absolute inset-0 rounded-lg shadow-2xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${book.color}f0, ${book.color}dd, ${book.color}f0)`,
              border: `3px solid ${book.accentColor}80`,
              backfaceVisibility: 'hidden',
            }}
          >
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.1) 4px, rgba(0,0,0,0.1) 5px)`
              }}
            />
            
            {/* Ornate border decoration */}
            <div 
              className="absolute inset-4 rounded-md"
              style={{
                border: `2px solid ${book.accentColor}60`,
                boxShadow: `inset 0 0 20px ${book.accentColor}30`,
              }}
            />
            
            <div className="absolute inset-0 flex items-center justify-center p-12">
              <div className="text-center">
                <h2
                  className="text-4xl font-serif"
                  style={{
                    fontFamily: 'Papyrus, fantasy',
                    color: book.accentColor,
                    textShadow: `0 2px 12px rgba(0,0,0,0.8), 0 0 30px ${book.accentColor}80`,
                    filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))',
                  }}
                >
                  {book.title}
                </h2>
              </div>
            </div>

            {/* Magical glow effect */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${book.accentColor}40 0%, transparent 70%)`,
              }}
            />
          </div>

          {/* Inside of cover (what you see when opened) */}
          <div
            className="absolute inset-0 rounded-lg shadow-2xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${book.color}dd, ${book.color}aa)`,
              border: `1px solid ${book.accentColor}40`,
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)`
              }}
            />
          </div>

          {/* Cover thickness/edge */}
          <div
            className="absolute left-0 top-0 bottom-0"
            style={{
              width: '20px',
              background: `linear-gradient(to right, ${book.color}cc, ${book.color}aa)`,
              transform: 'translateZ(-1px) rotateY(90deg)',
              transformOrigin: 'left center',
              boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
