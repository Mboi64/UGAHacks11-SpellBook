import { useState, useEffect } from 'react';
import { Book } from '../types';
import { X, Save, Sparkles, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Timer } from './Timer';
import { TaskProgressTracker } from './TaskProgressTracker';

interface NoteEditorProps {
  book: Book;
  onClose: () => void;
  onSave: (bookId: string, notes: string) => void;
}

export function NoteEditor({ book, onClose, onSave }: NoteEditorProps) {
  const [notes, setNotes] = useState(book.notes);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(0);

  useEffect(() => {
    setNotes(book.notes);
  }, [book.notes]);

  const handleSave = () => {
    setIsSaving(true);
    onSave(book.id, notes);
    setTimeout(() => setIsSaving(false), 500);
  };

  // Split notes into pages (each spread shows 2 pages)
  const LINES_PER_PAGE = 20;
  const lines = notes.split('\n');
  const totalPages = Math.max(2, Math.ceil(lines.length / LINES_PER_PAGE) || 2);
  const maxSpread = Math.floor((totalPages - 1) / 2);

  const getPageContent = (pageIndex: number) => {
    const start = pageIndex * LINES_PER_PAGE;
    const end = start + LINES_PER_PAGE;
    return lines.slice(start, end).join('\n');
  };

  const updatePageContent = (pageIndex: number, content: string) => {
    const newLines = [...lines];
    const start = pageIndex * LINES_PER_PAGE;
    const contentLines = content.split('\n');
    
    // Remove old content for this page
    newLines.splice(start, LINES_PER_PAGE);
    // Insert new content
    newLines.splice(start, 0, ...contentLines);
    
    setNotes(newLines.join('\n'));
  };

  const handleNextPage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setIsTransitioning(false);
    }, 300);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const leftPageIndex = currentPage * 2;
  const rightPageIndex = currentPage * 2 + 1;

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Timer overlay */}
      {showTimer && (
        <Timer 
          accentColor={book.accentColor} 
          onClose={() => setShowTimer(false)}
          onTimerTick={setTimerMinutes}
        />
      )}
      
      <div className="max-w-4xl mx-auto">
        {/* Book header - Ancient leather-bound cover */}
        <div 
          className="p-6 shadow-2xl relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${book.color}f0, ${book.color}dd, ${book.color}e8)`,
            clipPath: `polygon(
              0% 0%, 2% 1%, 5% 0.5%, 10% 1.2%, 15% 0.8%, 20% 1%, 25% 0.6%, 30% 1.3%, 35% 0.7%, 40% 1.1%, 45% 0.9%, 
              50% 1.4%, 55% 0.5%, 60% 1.2%, 65% 0.8%, 70% 1%, 75% 0.7%, 80% 1.3%, 85% 0.6%, 90% 1.1%, 95% 0.8%, 98% 1.2%, 100% 0.5%,
              100% 100%, 98% 99%, 95% 99.5%, 90% 99.2%, 85% 99.6%, 80% 99.3%, 75% 99.7%, 70% 99.1%, 65% 99.5%, 60% 99.3%,
              55% 99.8%, 50% 99.2%, 45% 99.6%, 40% 99.4%, 35% 99.7%, 30% 99.3%, 25% 99.5%, 20% 99.2%, 15% 99.6%, 10% 99.4%, 5% 99.7%, 2% 99.3%, 0% 100%
            )`,
          }}
        >
          {/* Leather texture */}
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px),
                repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(0,0,0,0.08) 4px, rgba(0,0,0,0.08) 5px),
                radial-gradient(circle at 25% 35%, rgba(0,0,0,0.15), transparent 40%),
                radial-gradient(circle at 75% 60%, rgba(0,0,0,0.12), transparent 35%)
              `
            }}
          />
          
          {/* Worn edges and scratches */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-4" 
              style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)'
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-4" 
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)'
              }}
            />
          </div>
          
          {/* Ornate border decoration */}
          <div className="absolute inset-0 pointer-events-none opacity-60">
            <svg className="w-full h-full">
              <defs>
                <pattern id="leather-grain" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="5" cy="5" r="1" fill="rgba(0,0,0,0.1)" />
                  <circle cx="15" cy="15" r="1" fill="rgba(0,0,0,0.08)" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#leather-grain)" />
            </svg>
          </div>
          
          {/* Embossed decorative frame */}
          <div 
            className="absolute inset-3 rounded pointer-events-none opacity-40"
            style={{
              border: `2px solid ${book.accentColor}60`,
              boxShadow: `
                inset 1px 1px 2px rgba(255,255,255,0.2),
                inset -1px -1px 2px rgba(0,0,0,0.3),
                0 0 10px ${book.accentColor}30
              `
            }}
          />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Ornate magical seal/emblem */}
              <div className="relative">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center relative"
                  style={{ 
                    background: `radial-gradient(circle at 30% 30%, ${book.accentColor}40, ${book.accentColor}20)`,
                    boxShadow: `
                      0 0 20px ${book.accentColor}60,
                      inset 2px 2px 4px rgba(255,255,255,0.2),
                      inset -2px -2px 4px rgba(0,0,0,0.3)
                    `,
                    border: `3px solid ${book.accentColor}80`
                  }}
                >
                  {/* Inner decorative circle */}
                  <div 
                    className="absolute inset-2 rounded-full"
                    style={{
                      border: `1px solid ${book.accentColor}40`,
                    }}
                  />
                  
                  <Sparkles 
                    className="w-7 h-7 animate-pulse relative z-10" 
                    style={{ 
                      color: book.accentColor,
                      filter: `drop-shadow(0 0 8px ${book.accentColor})`,
                      animationDuration: '3s'
                    }} 
                  />
                  
                  {/* Magical glow */}
                  <div 
                    className="absolute inset-0 rounded-full animate-pulse"
                    style={{
                      background: `radial-gradient(circle, ${book.accentColor}30, transparent 70%)`,
                      animationDuration: '3s'
                    }}
                  />
                </div>
                
                {/* Corner decorative runes */}
                <div className="absolute -top-1 -right-1 text-xs opacity-60" style={{ color: book.accentColor }}>✦</div>
                <div className="absolute -bottom-1 -left-1 text-xs opacity-60" style={{ color: book.accentColor }}>✧</div>
              </div>
              
              <div>
                <h1 
                  className="text-3xl font-serif mb-1 relative"
                  style={{ 
                    color: book.accentColor,
                    textShadow: `
                      2px 2px 4px rgba(0,0,0,0.6),
                      0 0 15px ${book.accentColor}60,
                      1px 1px 0px rgba(255,255,255,0.1)
                    `,
                    letterSpacing: '0.5px'
                  }}
                >
                  {book.title}
                </h1>
                <p className="text-sm text-amber-100/70 italic flex items-center gap-2" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                  <span className="opacity-50">◆</span>
                  Spell Book & Study Notes
                  <span className="opacity-50">◆</span>
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              {/* Timer button - ancient scroll style */}
              <button
                onClick={() => setShowTimer(!showTimer)}
                className="group relative px-5 py-2.5 transition-all flex items-center gap-2 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(109, 40, 217, 0.95))`,
                  boxShadow: `
                    0 4px 12px rgba(0,0,0,0.4),
                    inset 1px 1px 2px rgba(255,255,255,0.3),
                    inset -1px -1px 2px rgba(0,0,0,0.2),
                    0 0 20px rgba(139, 92, 246, 0.3)
                  `,
                  border: '2px solid rgba(196, 181, 253, 0.4)',
                  borderRadius: '4px',
                  clipPath: 'polygon(3% 0%, 97% 0%, 100% 3%, 100% 97%, 97% 100%, 3% 100%, 0% 97%, 0% 3%)'
                }}
              >
                {/* Button texture */}
                <div className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `
                      repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 3px)
                    `
                  }}
                />
                
                {/* Hover glow */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(196, 181, 253, 0.3), transparent 70%)'
                  }}
                />
                
                <Clock className="w-4 h-4 relative z-10 text-white" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }} />
                <span className="relative z-10 text-white font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                  Timer
                </span>
              </button>
            
              {/* Save button - ancient scroll style */}
              <button
                onClick={handleSave}
                className="group relative px-5 py-2.5 transition-all flex items-center gap-2 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(21, 128, 61, 0.95))`,
                  boxShadow: `
                    0 4px 12px rgba(0,0,0,0.4),
                    inset 1px 1px 2px rgba(255,255,255,0.3),
                    inset -1px -1px 2px rgba(0,0,0,0.2),
                    0 0 20px rgba(34, 197, 94, 0.3)
                  `,
                  border: '2px solid rgba(187, 247, 208, 0.4)',
                  borderRadius: '4px',
                  clipPath: 'polygon(3% 0%, 97% 0%, 100% 3%, 100% 97%, 97% 100%, 3% 100%, 0% 97%, 0% 3%)'
                }}
              >
                {/* Button texture */}
                <div className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `
                      repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 3px)
                    `
                  }}
                />
                
                {/* Hover glow */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(187, 247, 208, 0.3), transparent 70%)'
                  }}
                />
                
                <Save className="w-4 h-4 relative z-10 text-white" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }} />
                <span className="relative z-10 text-white font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                  {isSaving ? 'Saved!' : 'Save'}
                </span>
              </button>
              
              {/* Close button - ancient scroll style */}
              <button
                onClick={onClose}
                className="group relative px-5 py-2.5 transition-all flex items-center gap-2 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, rgba(71, 85, 105, 0.9), rgba(51, 65, 85, 0.95))`,
                  boxShadow: `
                    0 4px 12px rgba(0,0,0,0.4),
                    inset 1px 1px 2px rgba(255,255,255,0.2),
                    inset -1px -1px 2px rgba(0,0,0,0.2),
                    0 0 20px rgba(100, 116, 139, 0.3)
                  `,
                  border: '2px solid rgba(148, 163, 184, 0.4)',
                  borderRadius: '4px',
                  clipPath: 'polygon(3% 0%, 97% 0%, 100% 3%, 100% 97%, 97% 100%, 3% 100%, 0% 97%, 0% 3%)'
                }}
              >
                {/* Button texture */}
                <div className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `
                      repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 3px)
                    `
                  }}
                />
                
                {/* Hover glow */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(203, 213, 225, 0.3), transparent 70%)'
                  }}
                />
                
                <X className="w-4 h-4 relative z-10 text-white" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }} />
                <span className="relative z-10 text-white font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                  Close
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Note pages */}
        <div 
          className="relative shadow-2xl" 
          style={{ 
            minHeight: '600px', 
            background: '#f5e6d3',
            clipPath: `polygon(
              1% 2%, 3% 0.5%, 6% 1%, 10% 0.3%, 15% 1.5%, 20% 0.8%, 25% 1.2%, 30% 0.5%, 35% 1%, 40% 0.7%, 45% 1.3%, 
              50% 0.4%, 55% 1.1%, 60% 0.6%, 65% 1.4%, 70% 0.9%, 75% 1.2%, 80% 0.5%, 85% 1%, 90% 0.8%, 94% 1.5%, 97% 0.7%, 99% 1.2%,
              99.5% 5%, 99.8% 10%, 99.3% 15%, 99.7% 20%, 99.2% 25%, 99.6% 30%, 99.4% 35%, 99.8% 40%, 99.1% 45%, 99.5% 50%,
              99.7% 55%, 99.3% 60%, 99.6% 65%, 99.2% 70%, 99.8% 75%, 99.4% 80%, 99.7% 85%, 99.1% 90%, 99.6% 94%, 99.3% 97%,
              97% 99.5%, 94% 99.2%, 90% 99.7%, 85% 99.1%, 80% 99.5%, 75% 99.3%, 70% 99.8%, 65% 99.2%, 60% 99.6%, 55% 99.4%,
              50% 99.7%, 45% 99.3%, 40% 99.8%, 35% 99.1%, 30% 99.5%, 25% 99.4%, 20% 99.7%, 15% 99.2%, 10% 99.6%, 6% 99.3%, 3% 99.8%, 1% 99.4%,
              0.5% 95%, 0.8% 90%, 0.3% 85%, 0.7% 80%, 0.2% 75%, 0.6% 70%, 0.4% 65%, 0.9% 60%, 0.3% 55%, 0.7% 50%,
              0.2% 45%, 0.6% 40%, 0.4% 35%, 0.8% 30%, 0.3% 25%, 0.7% 20%, 0.2% 15%, 0.6% 10%, 0.4% 6%, 0.8% 3%
            )`
          }}
        >
          {/* Ancient parchment texture with stains and aging - enhanced */}
          <div className="absolute inset-0 opacity-70" 
            style={{
              backgroundImage: `
                radial-gradient(ellipse at 15% 25%, rgba(139, 69, 19, 0.25), transparent 30%),
                radial-gradient(ellipse at 85% 70%, rgba(101, 67, 33, 0.3), transparent 35%),
                radial-gradient(circle at 50% 50%, rgba(160, 82, 45, 0.15), transparent 45%),
                radial-gradient(ellipse at 30% 80%, rgba(139, 69, 19, 0.28), transparent 28%),
                radial-gradient(circle at 72% 15%, rgba(101, 67, 33, 0.2), transparent 25%),
                radial-gradient(ellipse at 8% 60%, rgba(92, 64, 51, 0.22), transparent 32%),
                radial-gradient(circle at 95% 45%, rgba(139, 69, 19, 0.18), transparent 20%),
                radial-gradient(ellipse at 40% 10%, rgba(101, 67, 33, 0.15), transparent 28%)
              `
            }} 
          />
          
          {/* Aged paper texture with fibers - enhanced */}
          <div className="absolute inset-0 opacity-30" 
            style={{
              backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 69, 19, 0.12) 2px, rgba(139, 69, 19, 0.12) 3px),
                repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(101, 67, 33, 0.1) 3px, rgba(101, 67, 33, 0.1) 4px),
                repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(92, 64, 51, 0.06) 8px, rgba(92, 64, 51, 0.06) 9px),
                repeating-linear-gradient(-45deg, transparent, transparent 12px, rgba(101, 67, 33, 0.05) 12px, rgba(101, 67, 33, 0.05) 13px)
              `,
              backgroundSize: '100% 100%'
            }} 
          />
          
          {/* Random fiber texture spots */}
          <div className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 35%, rgba(139, 69, 19, 0.3) 0%, transparent 1%),
                radial-gradient(circle at 65% 55%, rgba(101, 67, 33, 0.25) 0%, transparent 1%),
                radial-gradient(circle at 80% 20%, rgba(92, 64, 51, 0.2) 0%, transparent 1%),
                radial-gradient(circle at 15% 75%, rgba(139, 69, 19, 0.28) 0%, transparent 1%),
                radial-gradient(circle at 45% 85%, rgba(101, 67, 33, 0.22) 0%, transparent 1%),
                radial-gradient(circle at 88% 70%, rgba(92, 64, 51, 0.26) 0%, transparent 1%),
                radial-gradient(circle at 32% 15%, rgba(139, 69, 19, 0.24) 0%, transparent 1%),
                radial-gradient(circle at 55% 45%, rgba(101, 67, 33, 0.2) 0%, transparent 1%)
              `,
              backgroundSize: '100% 100%'
            }}
          />

          {/* Burnt/worn edges - enhanced with irregular darkening */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: `
                inset 0 0 80px rgba(101, 67, 33, 0.5),
                inset 0 0 40px rgba(139, 69, 19, 0.4),
                inset 0 0 120px rgba(92, 64, 51, 0.3)
              `
            }}
          />
          
          {/* Torn and burned edge effects */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            {/* Top edge wear */}
            <div className="absolute top-0 left-0 right-0 h-8" 
              style={{
                background: `linear-gradient(to bottom, 
                  rgba(92, 64, 51, 0.6) 0%, 
                  rgba(101, 67, 33, 0.4) 30%, 
                  transparent 100%
                )`,
                maskImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='roughEdge'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.05' numOctaves='4'/%3E%3CfeDisplacementMap in='SourceGraphic' scale='8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23roughEdge)' fill='white'/%3E%3C/svg%3E")`,
              }}
            />
            
            {/* Bottom edge wear */}
            <div className="absolute bottom-0 left-0 right-0 h-8" 
              style={{
                background: `linear-gradient(to top, 
                  rgba(92, 64, 51, 0.6) 0%, 
                  rgba(101, 67, 33, 0.4) 30%, 
                  transparent 100%
                )`
              }}
            />
            
            {/* Left edge wear */}
            <div className="absolute left-0 top-0 bottom-0 w-6" 
              style={{
                background: `linear-gradient(to right, 
                  rgba(92, 64, 51, 0.5) 0%, 
                  rgba(101, 67, 33, 0.3) 40%, 
                  transparent 100%
                )`
              }}
            />
            
            {/* Right edge wear */}
            <div className="absolute right-0 top-0 bottom-0 w-6" 
              style={{
                background: `linear-gradient(to left, 
                  rgba(92, 64, 51, 0.5) 0%, 
                  rgba(101, 67, 33, 0.3) 40%, 
                  transparent 100%
                )`
              }}
            />
          </div>
          
          {/* Ink blots and water stains */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            {/* Large ink blot - top right */}
            <div className="absolute" 
              style={{
                top: '12%',
                right: '18%',
                width: '60px',
                height: '60px',
                background: 'radial-gradient(ellipse at 40% 35%, rgba(20, 20, 50, 0.4), rgba(40, 40, 70, 0.2) 40%, transparent 70%)',
                filter: 'blur(1px)',
                borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%',
              }}
            />
            
            {/* Medium ink spot - bottom left */}
            <div className="absolute" 
              style={{
                bottom: '25%',
                left: '22%',
                width: '40px',
                height: '40px',
                background: 'radial-gradient(circle at 30% 30%, rgba(30, 30, 55, 0.35), rgba(45, 45, 65, 0.15) 50%, transparent 75%)',
                filter: 'blur(0.5px)',
                borderRadius: '55% 45% 60% 40% / 45% 55% 45% 55%',
              }}
            />
            
            {/* Small ink spots scattered */}
            <div className="absolute" 
              style={{
                top: '55%',
                left: '70%',
                width: '20px',
                height: '20px',
                background: 'radial-gradient(circle, rgba(25, 25, 50, 0.3), transparent 60%)',
                filter: 'blur(0.5px)',
              }}
            />
            
            <div className="absolute" 
              style={{
                top: '35%',
                right: '40%',
                width: '15px',
                height: '15px',
                background: 'radial-gradient(circle, rgba(30, 30, 55, 0.25), transparent 70%)',
                filter: 'blur(0.3px)',
              }}
            />
            
            {/* Water stain - left side */}
            <div className="absolute" 
              style={{
                top: '20%',
                left: '8%',
                width: '90px',
                height: '120px',
                background: 'radial-gradient(ellipse at 45% 40%, rgba(139, 69, 19, 0.15), rgba(160, 82, 45, 0.08) 50%, transparent 75%)',
                filter: 'blur(3px)',
                borderRadius: '50% 60% 40% 50% / 60% 40% 60% 40%',
              }}
            />
          </div>
          
          {/* Wrinkles and creases */}
          <div className="absolute inset-0 pointer-events-none opacity-25">
            <svg width="100%" height="100%" style={{ filter: 'blur(0.5px)' }}>
              {/* Diagonal crease from top left */}
              <line x1="5%" y1="8%" x2="25%" y2="30%" stroke="rgba(101, 67, 33, 0.4)" strokeWidth="1.5" opacity="0.6" />
              <line x1="5%" y1="8%" x2="25%" y2="30%" stroke="rgba(139, 69, 19, 0.3)" strokeWidth="0.5" opacity="0.8" transform="translate(1, 1)" />
              
              {/* Horizontal crease near top */}
              <path d="M 10% 15% Q 30% 14%, 50% 15% T 90% 14%" stroke="rgba(101, 67, 33, 0.3)" strokeWidth="1" fill="none" opacity="0.5" />
              
              {/* Diagonal crease from bottom right */}
              <line x1="95%" y1="85%" x2="70%" y2="65%" stroke="rgba(101, 67, 33, 0.35)" strokeWidth="1.2" opacity="0.6" />
              
              {/* Curved crease in middle */}
              <path d="M 15% 40% Q 25% 50%, 20% 60%" stroke="rgba(92, 64, 51, 0.3)" strokeWidth="1" fill="none" opacity="0.5" />
              
              {/* Small wrinkles near edges */}
              <path d="M 8% 50% Q 12% 52%, 10% 55%" stroke="rgba(101, 67, 33, 0.25)" strokeWidth="0.8" fill="none" opacity="0.6" />
              <path d="M 92% 30% Q 88% 33%, 91% 36%" stroke="rgba(101, 67, 33, 0.25)" strokeWidth="0.8" fill="none" opacity="0.6" />
            </svg>
          </div>
          
          {/* Left page shadow - deeper */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-amber-950/30 via-amber-900/15 to-transparent pointer-events-none" />
          
          {/* Right page shadow */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-amber-950/30 via-amber-900/15 to-transparent pointer-events-none" />
          
          {/* Center binding with deeper shadow and ancient look */}
          <div className="absolute left-1/2 top-0 bottom-0 w-20 -translate-x-1/2 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-950/40 to-transparent" />
            <div className="absolute left-1/2 top-0 bottom-0 w-2 -translate-x-1/2 bg-gradient-to-b from-amber-950/60 via-amber-900/40 to-amber-950/60" 
              style={{
                boxShadow: `
                  -2px 0 8px rgba(101, 67, 33, 0.4),
                  2px 0 8px rgba(101, 67, 33, 0.4),
                  inset 0 0 3px rgba(0, 0, 0, 0.5)
                `
              }}
            />
            {/* Binding stitches */}
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className="absolute left-1/2 w-1 h-1 -translate-x-1/2 bg-amber-800 rounded-full opacity-60"
                style={{ top: `${8 + i * 8}%` }}
              />
            ))}
          </div>
          
          {/* Decorative corner ornaments */}
          <div className="absolute top-4 left-4 w-12 h-12 opacity-30 pointer-events-none">
            <svg viewBox="0 0 48 48" className="w-full h-full">
              <path d="M2,2 L2,20 M2,2 L20,2" stroke="#78350f" strokeWidth="2" fill="none" />
              <circle cx="12" cy="12" r="3" fill="none" stroke="#78350f" strokeWidth="1.5" />
              <path d="M8,8 L16,16 M16,8 L8,16" stroke="#78350f" strokeWidth="1" opacity="0.5" />
            </svg>
          </div>
          <div className="absolute top-4 right-4 w-12 h-12 opacity-30 pointer-events-none transform rotate-90">
            <svg viewBox="0 0 48 48" className="w-full h-full">
              <path d="M2,2 L2,20 M2,2 L20,2" stroke="#78350f" strokeWidth="2" fill="none" />
              <circle cx="12" cy="12" r="3" fill="none" stroke="#78350f" strokeWidth="1.5" />
              <path d="M8,8 L16,16 M16,8 L8,16" stroke="#78350f" strokeWidth="1" opacity="0.5" />
            </svg>
          </div>
          <div className="absolute bottom-4 left-4 w-12 h-12 opacity-30 pointer-events-none transform -rotate-90">
            <svg viewBox="0 0 48 48" className="w-full h-full">
              <path d="M2,2 L2,20 M2,2 L20,2" stroke="#78350f" strokeWidth="2" fill="none" />
              <circle cx="12" cy="12" r="3" fill="none" stroke="#78350f" strokeWidth="1.5" />
              <path d="M8,8 L16,16 M16,8 L8,16" stroke="#78350f" strokeWidth="1" opacity="0.5" />
            </svg>
          </div>
          <div className="absolute bottom-4 right-4 w-12 h-12 opacity-30 pointer-events-none transform rotate-180">
            <svg viewBox="0 0 48 48" className="w-full h-full">
              <path d="M2,2 L2,20 M2,2 L20,2" stroke="#78350f" strokeWidth="2" fill="none" />
              <circle cx="12" cy="12" r="3" fill="none" stroke="#78350f" strokeWidth="1.5" />
              <path d="M8,8 L16,16 M16,8 L8,16" stroke="#78350f" strokeWidth="1" opacity="0.5" />
            </svg>
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-0 relative transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {/* Left page */}
            <div className="p-8 md:pr-8 pb-16 min-h-[600px] h-[600px] relative">
              {/* Subtle gradient overlay for seamless blending */}
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-amber-950/20 via-amber-900/10 to-transparent pointer-events-none" />
              
              <textarea
                value={getPageContent(leftPageIndex)}
                onChange={(e) => updatePageContent(leftPageIndex, e.target.value)}
                placeholder="Begin your ancient studies here..."
                className="w-full h-full bg-transparent resize-none focus:outline-none text-amber-950 placeholder-amber-800/40 leading-loose overflow-hidden"
                style={{
                  fontFamily: '"Times New Roman", Times, serif',
                  fontSize: '16px',
                  letterSpacing: '0.3px',
                }}
              />
              
              {/* Page number - centered bottom */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-serif italic text-amber-900/70"
                style={{ 
                  fontSize: '14px',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}
              >
                {leftPageIndex + 1}
              </div>
            </div>
            
            {/* Right page */}
            <div className="p-8 md:pl-8 pb-16 min-h-[600px] h-[600px] relative">
              {/* Subtle gradient overlay for seamless blending */}
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-amber-950/20 via-amber-900/10 to-transparent pointer-events-none" />
              
              <textarea
                value={getPageContent(rightPageIndex)}
                onChange={(e) => updatePageContent(rightPageIndex, e.target.value)}
                placeholder="...and continue your transcription"
                className="w-full h-full bg-transparent resize-none focus:outline-none text-amber-950 placeholder-amber-800/40 leading-loose overflow-hidden"
                style={{
                  fontFamily: '"Times New Roman", Times, serif',
                  fontSize: '16px',
                  letterSpacing: '0.3px',
                }}
              />
              
              {/* Page number - centered bottom */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-serif italic text-amber-900/70"
                style={{ 
                  fontSize: '14px',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}
              >
                {rightPageIndex + 1}
              </div>
            </div>
          </div>

          {/* Navigation arrows */}
          {currentPage > 0 && (
            <button
              onClick={handlePrevPage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 opacity-70 hover:opacity-100 hover:scale-110 bg-amber-950/30 hover:bg-amber-900/40 backdrop-blur-sm shadow-lg"
              style={{
                animation: 'pulse-glow 2s ease-in-out infinite',
                border: '2px solid rgba(120, 53, 15, 0.4)',
              }}
            >
              <ChevronLeft className="w-6 h-6 text-amber-900" />
            </button>
          )}

          <button
            onClick={handleNextPage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 opacity-70 hover:opacity-100 hover:scale-110 bg-amber-950/30 hover:bg-amber-900/40 backdrop-blur-sm shadow-lg"
            style={{
              animation: 'pulse-glow 2s ease-in-out infinite',
              border: '2px solid rgba(120, 53, 15, 0.4)',
            }}
          >
            <ChevronRight className="w-6 h-6 text-amber-900" />
          </button>

          {/* Bottom page shadow with age marks */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-amber-950/20 to-transparent pointer-events-none" />
        </div>

        {/* Book bottom */}
        <div 
          className="h-4 rounded-b-lg shadow-2xl"
          style={{
            background: `linear-gradient(to bottom, ${book.color}dd, ${book.color})`,
          }}
        />
      </div>

      {/* Keyframe animations for arrow glow */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(120, 53, 15, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(120, 53, 15, 0.6);
          }
        }
      `}</style>

      {/* Task Progress Tracker */}
      <TaskProgressTracker
        accentColor={book.accentColor}
        pageCount={totalPages}
        timerMinutes={timerMinutes}
      />
    </div>
  );
}