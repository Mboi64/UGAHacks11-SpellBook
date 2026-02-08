import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Play, Pause, RotateCcw, X, Move } from 'lucide-react';
import { addTimerMinutes } from '../utils/taskTracking';

interface TimerProps {
  accentColor: string;
  onClose: () => void;
  onTimerTick?: (minutes: number) => void;
}

export function Timer({ accentColor, onClose, onTimerTick }: TimerProps) {
  const [minutes, setMinutes] = useState<string>('25');
  const [seconds, setSeconds] = useState<string>('00');
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isInputMode, setIsInputMode] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [totalTimeStudied, setTotalTimeStudied] = useState(0); // in seconds
  const intervalRef = useRef<number | null>(null);
  const timerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRunning && totalSeconds > 0) {
      intervalRef.current = window.setInterval(() => {
        setTotalSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            // Timer completed - play sound or notification
            return 0;
          }
          return prev - 1;
        });
        setTotalTimeStudied(prev => {
          const newTime = prev + 1;
          const newMinutes = Math.floor(newTime / 60);
          if (onTimerTick) {
            onTimerTick(newMinutes); // Convert to minutes
          }
          // Track completed minutes for daily tasks
          if (newTime % 60 === 0) {
            addTimerMinutes(1);
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, totalSeconds, onTimerTick]);

  // Handle dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (timerRef.current) {
      const rect = timerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleStart = () => {
    if (isInputMode) {
      const mins = parseInt(minutes) || 0;
      const secs = parseInt(seconds) || 0;
      const total = mins * 60 + secs;
      
      if (total > 0) {
        setTotalSeconds(total);
        setIsInputMode(false);
        setIsRunning(true);
      }
    } else {
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsInputMode(true);
    setTotalSeconds(0);
    setMinutes('25');
    setSeconds('00');
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return {
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0')
    };
  };

  const displayTime = isInputMode ? { minutes, seconds } : formatTime(totalSeconds);
  const progress = isInputMode ? 0 : (totalSeconds / (parseInt(minutes) * 60 + parseInt(seconds)) * 100);

  return (
    <motion.div
      ref={timerRef}
      initial={{ scale: 0, opacity: 0, rotate: -10 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      exit={{ scale: 0, opacity: 0, rotate: 10 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="fixed z-40"
      style={{
        left: position.x || 'auto',
        top: position.y || 'auto',
        right: position.x ? 'auto' : '2rem',
        bottom: position.y ? 'auto' : '2rem',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <div
        className="relative p-6 rounded-2xl shadow-2xl backdrop-blur-sm"
        style={{
          background: `linear-gradient(135deg, rgba(30, 20, 10, 0.95), rgba(20, 15, 10, 0.98))`,
          border: `3px solid ${accentColor}80`,
          boxShadow: `
            0 0 40px ${accentColor}40,
            0 20px 50px rgba(0,0,0,0.5),
            inset 0 2px 4px rgba(255,255,255,0.1),
            inset 0 -2px 4px rgba(0,0,0,0.3)
          `,
        }}
      >
        {/* Drag handle */}
        <div
          onMouseDown={handleMouseDown}
          className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-6 rounded-full flex items-center justify-center group transition-all cursor-grab active:cursor-grabbing"
          style={{
            background: `linear-gradient(135deg, rgba(100, 50, 30, 0.9), rgba(80, 40, 20, 0.95))`,
            border: `2px solid ${accentColor}60`,
            boxShadow: `0 0 15px ${accentColor}40, 0 4px 10px rgba(0,0,0,0.3)`,
          }}
        >
          <Move className="w-3 h-3 text-amber-200 group-hover:text-white transition-colors" />
        </div>

        {/* Magical particles */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: accentColor,
                boxShadow: `0 0 8px ${accentColor}`,
                left: `${20 + (i * 12)}%`,
                top: `${20 + (i % 3) * 30}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.5, 1.5, 0.5],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                delay: i * 0.3,
                repeat: Infinity,
              }}
            />
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center group transition-all"
          style={{
            background: `linear-gradient(135deg, rgba(100, 50, 30, 0.9), rgba(80, 40, 20, 0.95))`,
            border: `2px solid ${accentColor}60`,
            boxShadow: `0 0 15px ${accentColor}40, 0 4px 10px rgba(0,0,0,0.3)`,
          }}
        >
          <X className="w-4 h-4 text-amber-200 group-hover:text-white transition-colors" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${accentColor}60, ${accentColor}30)`,
              boxShadow: `0 0 20px ${accentColor}50, inset 1px 1px 3px rgba(255,255,255,0.2)`,
              border: `2px solid ${accentColor}80`,
            }}
          >
            <Clock
              className="w-5 h-5"
              style={{
                color: accentColor,
                filter: `drop-shadow(0 0 6px ${accentColor})`,
              }}
            />
          </div>
          <h3
            className="text-xl font-serif"
            style={{
              color: accentColor,
              textShadow: `0 0 15px ${accentColor}80, 1px 1px 2px rgba(0,0,0,0.8)`,
            }}
          >
            Study Timer
          </h3>
        </div>

        {/* Timer Display */}
        <div className="relative mb-6">
          {/* Progress ring */}
          {!isInputMode && (
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              style={{ filter: `drop-shadow(0 0 10px ${accentColor}60)` }}
            >
              <circle
                cx="50%"
                cy="50%"
                r="90"
                fill="none"
                stroke={`${accentColor}20`}
                strokeWidth="4"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="90"
                fill="none"
                stroke={accentColor}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 90}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 90 }}
                animate={{ strokeDashoffset: (1 - progress / 100) * 2 * Math.PI * 90 }}
                transition={{ duration: 0.5 }}
              />
            </svg>
          )}

          <div className="relative z-10 flex items-center justify-center gap-3 py-8">
            {/* Minutes */}
            <div className="text-center">
              {isInputMode ? (
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value.slice(0, 2))}
                  className="w-20 text-5xl font-serif text-center bg-transparent border-none outline-none"
                  style={{
                    color: accentColor,
                    textShadow: `0 0 20px ${accentColor}90, 2px 2px 4px rgba(0,0,0,0.9)`,
                  }}
                />
              ) : (
                <div
                  className="text-5xl font-serif"
                  style={{
                    color: accentColor,
                    textShadow: `0 0 20px ${accentColor}90, 2px 2px 4px rgba(0,0,0,0.9)`,
                  }}
                >
                  {displayTime.minutes}
                </div>
              )}
              <div className="text-xs text-amber-200/60 mt-1 font-serif italic">minutes</div>
            </div>

            {/* Separator */}
            <div
              className="text-5xl font-serif mb-5"
              style={{
                color: accentColor,
                textShadow: `0 0 20px ${accentColor}90`,
              }}
            >
              :
            </div>

            {/* Seconds */}
            <div className="text-center">
              {isInputMode ? (
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setSeconds(Math.min(59, val).toString().padStart(2, '0'));
                  }}
                  className="w-20 text-5xl font-serif text-center bg-transparent border-none outline-none"
                  style={{
                    color: accentColor,
                    textShadow: `0 0 20px ${accentColor}90, 2px 2px 4px rgba(0,0,0,0.9)`,
                  }}
                />
              ) : (
                <div
                  className="text-5xl font-serif"
                  style={{
                    color: accentColor,
                    textShadow: `0 0 20px ${accentColor}90, 2px 2px 4px rgba(0,0,0,0.9)`,
                  }}
                >
                  {displayTime.seconds}
                </div>
              )}
              <div className="text-xs text-amber-200/60 mt-1 font-serif italic">seconds</div>
            </div>
          </div>
        </div>

        {/* Timer completed message */}
        <AnimatePresence>
          {totalSeconds === 0 && !isInputMode && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 text-center"
            >
              <p
                className="text-sm font-serif italic"
                style={{
                  color: accentColor,
                  textShadow: `0 0 15px ${accentColor}80`,
                }}
              >
                ✨ Time's up! Well done! ✨
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          {/* Start/Pause button */}
          <button
            onClick={isRunning ? handlePause : handleStart}
            disabled={isInputMode && (!minutes || minutes === '0') && (!seconds || seconds === '0')}
            className="group relative px-6 py-2.5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: isRunning
                ? 'linear-gradient(135deg, rgba(234, 179, 8, 0.9), rgba(202, 138, 4, 0.95))'
                : 'linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(21, 128, 61, 0.95))',
              boxShadow: `
                0 4px 12px rgba(0,0,0,0.4),
                inset 1px 1px 2px rgba(255,255,255,0.3),
                0 0 20px ${accentColor}30
              `,
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
            }}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 text-white" />
                <span className="text-white font-medium text-sm">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-white" />
                <span className="text-white font-medium text-sm">Start</span>
              </>
            )}
          </button>

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="group relative px-6 py-2.5 transition-all flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, rgba(71, 85, 105, 0.9), rgba(51, 65, 85, 0.95))',
              boxShadow: `
                0 4px 12px rgba(0,0,0,0.4),
                inset 1px 1px 2px rgba(255,255,255,0.2),
                0 0 20px ${accentColor}20
              `,
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
            }}
          >
            <RotateCcw className="w-4 h-4 text-white" />
            <span className="text-white font-medium text-sm">Reset</span>
          </button>
        </div>

        {/* Decorative corner ornaments */}
        <div className="absolute top-3 left-3 w-8 h-8 opacity-40 pointer-events-none">
          <svg viewBox="0 0 40 40" fill={accentColor}>
            <path d="M0,0 L40,0 L40,4 L4,4 L4,40 L0,40 Z" opacity="0.6" />
            <circle cx="8" cy="8" r="2" />
          </svg>
        </div>
        <div className="absolute bottom-3 right-3 w-8 h-8 opacity-40 pointer-events-none rotate-180">
          <svg viewBox="0 0 40 40" fill={accentColor}>
            <path d="M0,0 L40,0 L40,4 L4,4 L4,40 L0,40 Z" opacity="0.6" />
            <circle cx="8" cy="8" r="2" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
