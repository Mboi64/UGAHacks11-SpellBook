import { BookSpine } from './BookSpine';
import { AddBookModal } from './AddBookModal';
import { RecommendationsSection } from './RecommendationsSection';
import { PetSystem } from './PetSystem';
import { Book } from '../types';
import { Sparkles, Heart } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence } from 'motion/react';

interface BookshelfProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onAddBook: () => void;
  isAddingBook: boolean;
  onCancelAddBook: () => void;
  onConfirmAddBook: (title: string, color: string, accentColor: string) => void;
  onDeleteBook: (bookId: string) => void;
  onReorderBooks: (dragIndex: number, hoverIndex: number) => void;
}

export function Bookshelf({ 
  books, 
  onSelectBook, 
  onAddBook, 
  isAddingBook,
  onCancelAddBook,
  onConfirmAddBook,
  onDeleteBook,
  onReorderBooks
}: BookshelfProps) {
  const [showPetSystem, setShowPetSystem] = useState(false);

  // Distribute books across shelves (9 books per shelf)
  const BOOKS_PER_SHELF = 9;
  // Only create a new shelf if the previous one is full
  const numberOfShelves = Math.max(1, Math.ceil(books.length / BOOKS_PER_SHELF));
  const shelves: Book[][] = [];
  
  for (let i = 0; i < numberOfShelves; i++) {
    const start = i * BOOKS_PER_SHELF;
    const end = Math.min((i + 1) * BOOKS_PER_SHELF, books.length);
    shelves.push(books.slice(start, end));
  }

  return (
    <div className="relative overflow-hidden">
      {/* First Section - Bookshelf */}
      <div className="min-h-screen p-8 relative">
      {/* Magical particles effect - enhanced */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              background: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#a78bfa' : '#60a5fa',
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              opacity: 0.4,
              boxShadow: `0 0 ${4 + Math.random() * 6}px currentColor`,
            }}
          />
        ))}
      </div>

      {/* Floating mystical orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              width: `${30 + Math.random() * 40}px`,
              height: `${30 + Math.random() * 40}px`,
              background: `radial-gradient(circle at 30% 30%, ${
                i % 2 === 0 ? 'rgba(167, 139, 250, 0.3)' : 'rgba(251, 191, 36, 0.3)'
              }, transparent 70%)`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
              filter: 'blur(20px)',
            }}
          />
        ))}
      </div>

      {/* Floating candles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={`candle-${i}`}
            className="absolute"
            style={{
              left: `${5 + i * 20}%`,
              top: `${20 + (i % 2) * 30}%`,
              animation: `float-candle-${i} ${6 + i}s ease-in-out infinite`,
            }}
          >
            {/* Candle flame */}
            <div className="relative w-8 h-12">
              {/* Glow */}
              <div 
                className="absolute -inset-4 rounded-full blur-xl opacity-60"
                style={{
                  background: 'radial-gradient(circle, rgba(251, 191, 36, 0.8), rgba(251, 146, 60, 0.4), transparent 70%)',
                }}
              />
              {/* Flame */}
              <svg viewBox="0 0 24 24" className="w-full h-full animate-pulse" style={{ animationDuration: '1.5s' }}>
                <path
                  d="M12 2C12 2 8 6 8 10C8 13.31 9.79 16 12 16C14.21 16 16 13.31 16 10C16 6 12 2 12 2Z"
                  fill="url(#flame-gradient)"
                  opacity="0.9"
                />
                <defs>
                  <linearGradient id={`flame-gradient-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fef3c7" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Flying spell books in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={`flying-book-${i}`}
            className="absolute opacity-20"
            style={{
              left: i === 0 ? '10%' : i === 1 ? '70%' : '40%',
              top: i === 0 ? '15%' : i === 1 ? '60%' : '35%',
              animation: `fly-book-${i} ${20 + i * 5}s linear infinite`,
            }}
          >
            <svg width="60" height="40" viewBox="0 0 60 40" className="drop-shadow-lg">
              <rect x="5" y="5" width="50" height="30" rx="2" fill="#6b21a8" opacity="0.8"/>
              <rect x="8" y="8" width="44" height="24" rx="1" fill="#7c3aed" opacity="0.6"/>
              <line x1="30" y1="8" x2="30" y2="32" stroke="#a78bfa" strokeWidth="1" opacity="0.5"/>
              <circle cx="30" cy="20" r="6" fill="none" stroke="#c4b5fd" strokeWidth="1" opacity="0.7"/>
            </svg>
          </div>
        ))}
      </div>

      {/* Magical constellation patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="w-full h-full opacity-30">
          {/* Top left constellation */}
          <g>
            <circle cx="10%" cy="10%" r="2" fill="#fbbf24" className="animate-pulse" />
            <circle cx="15%" cy="8%" r="1.5" fill="#fbbf24" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
            <circle cx="12%" cy="15%" r="1" fill="#fbbf24" className="animate-pulse" style={{ animationDelay: '1s' }} />
            <line x1="10%" y1="10%" x2="15%" y2="8%" stroke="#fbbf24" strokeWidth="0.5" opacity="0.4" />
            <line x1="10%" y1="10%" x2="12%" y2="15%" stroke="#fbbf24" strokeWidth="0.5" opacity="0.4" />
          </g>
          
          {/* Top right constellation */}
          <g>
            <circle cx="85%" cy="12%" r="2" fill="#a78bfa" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
            <circle cx="90%" cy="15%" r="1.5" fill="#a78bfa" className="animate-pulse" style={{ animationDelay: '0.8s' }} />
            <circle cx="88%" cy="8%" r="1" fill="#a78bfa" className="animate-pulse" style={{ animationDelay: '1.3s' }} />
            <line x1="85%" y1="12%" x2="90%" y2="15%" stroke="#a78bfa" strokeWidth="0.5" opacity="0.4" />
            <line x1="85%" y1="12%" x2="88%" y2="8%" stroke="#a78bfa" strokeWidth="0.5" opacity="0.4" />
          </g>
        </svg>
      </div>

      {/* Mystical portal/circle in far background */}
      <div className="absolute left-1/2 top-1/4 -translate-x-1/2 w-96 h-96 pointer-events-none opacity-10">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <radialGradient id="portal-gradient">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="80" fill="url(#portal-gradient)" className="animate-pulse" style={{ animationDuration: '4s' }} />
          <circle cx="100" cy="100" r="60" fill="none" stroke="#a78bfa" strokeWidth="0.5" opacity="0.4" className="animate-spin" style={{ animationDuration: '20s' }} />
          <circle cx="100" cy="100" r="40" fill="none" stroke="#fbbf24" strokeWidth="0.5" opacity="0.4" className="animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Pet Button */}
        <div className="absolute top-0 right-0 z-20">
          <button
            onClick={() => setShowPetSystem(true)}
            className="group px-6 py-3 rounded-xl font-serif text-lg transition-all transform hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.6), rgba(167, 139, 250, 0.5))',
              border: '2px solid rgba(167, 139, 250, 0.6)',
              boxShadow: '0 0 30px rgba(167, 139, 250, 0.4), 0 8px 20px rgba(0, 0, 0, 0.3)',
              textShadow: '0 0 10px rgba(167, 139, 250, 0.8)',
            }}
          >
            <div className="flex items-center gap-2 text-purple-100 group-hover:text-white transition-colors">
              <Heart className="w-5 h-5 animate-pulse" />
              <span>Pets</span>
            </div>
          </button>
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
            <h1 className="text-5xl font-serif text-amber-100" style={{ textShadow: '0 0 20px rgba(251, 191, 36, 0.5)' }}>
              Magic Book
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
          </div>
          <p className="text-purple-200 text-lg italic" style={{ textShadow: '0 0 10px rgba(167, 139, 250, 0.5)' }}>
            Where knowledge becomes magic
          </p>
        </div>

        {/* Bookshelf */}
        <div className="relative">
          {/* Magical aura around shelf */}
          <div 
            className="absolute -inset-4 rounded-xl opacity-50 blur-xl animate-pulse"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(167, 139, 250, 0.4), rgba(251, 191, 36, 0.3), transparent 70%)',
              animationDuration: '3s',
            }}
          />

          {/* Floating runes around shelf */}
          <div className="absolute -top-12 left-0 right-0 flex justify-around pointer-events-none">
            {['✧', '◈', '✦', '◆', '✧'].map((rune, i) => (
              <div
                key={`float-${i}`}
                className="text-2xl text-purple-300 animate-pulse"
                style={{
                  animationDelay: `${i * 0.3}s`,
                  textShadow: '0 0 10px rgba(167, 139, 250, 0.8)',
                  animation: `pulse 2s ease-in-out infinite, float-${i} 3s ease-in-out infinite`,
                }}
              >
                {rune}
              </div>
            ))}
          </div>

          {/* Shelf structure */}
          <div className="relative space-y-8">
            {shelves.map((shelfBooks, shelfIndex) => (
              <div key={shelfIndex} className="relative rounded-lg shadow-2xl overflow-visible">
                {/* Magical glow border */}
                <div 
                  className="absolute -inset-1 rounded-lg animate-pulse"
                  style={{
                    background: 'linear-gradient(90deg, #a78bfa, #fbbf24, #60a5fa, #a78bfa)',
                    backgroundSize: '200% 200%',
                    opacity: 0.3,
                    filter: 'blur(8px)',
                    animation: 'pulse 2s ease-in-out infinite, shimmer 4s linear infinite',
                  }}
                />

                {/* Wood background with texture */}
                <div 
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: `
                      linear-gradient(180deg, #7c2d12 0%, #92400e 20%, #78350f 50%, #451a03 100%)
                    `,
                  }}
                />
                
                {/* Wood grain texture overlay */}
                <div 
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage: `
                      repeating-linear-gradient(
                        90deg,
                        transparent,
                        transparent 2px,
                        rgba(0,0,0,0.1) 2px,
                        rgba(0,0,0,0.1) 4px
                      ),
                      repeating-linear-gradient(
                        0deg,
                        rgba(139,69,19,0.3) 0px,
                        rgba(160,82,45,0.2) 8px,
                        rgba(101,67,33,0.3) 16px
                      )
                    `,
                  }}
                />

                {/* Aged/worn effect */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3), transparent 25%),
                      radial-gradient(circle at 80% 60%, rgba(0,0,0,0.4), transparent 35%),
                      radial-gradient(circle at 50% 80%, rgba(139,69,19,0.5), transparent 40%)
                    `,
                  }}
                />

                {/* Magical energy veins in the wood */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <svg className="w-full h-full" style={{ filter: 'blur(1px)' }}>
                    <path
                      d="M 0,50 Q 150,30 300,50 T 600,50"
                      stroke="url(#magic-gradient)"
                      strokeWidth="2"
                      fill="none"
                      className="animate-pulse"
                    />
                    <defs>
                      <linearGradient id={`magic-gradient-${shelfIndex}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.6" />
                        <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Decorative carved border with glow */}
                <div className="absolute inset-0 border-4 rounded-lg pointer-events-none"
                  style={{
                    borderImage: 'linear-gradient(135deg, #fbbf24, #a78bfa, #fbbf24) 1',
                    boxShadow: `
                      inset 0 2px 8px rgba(0,0,0,0.5), 
                      inset 0 -2px 8px rgba(255,255,255,0.1),
                      inset 0 0 30px rgba(167, 139, 250, 0.2)
                    `,
                  }}
                />

                {/* Books container */}
                <div className="relative p-8">
                  {/* Mystical mist effect at bottom of shelf */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to top, rgba(167, 139, 250, 0.1), transparent)',
                      filter: 'blur(10px)',
                    }}
                  />

                  <div className="flex flex-wrap gap-4 items-end justify-start min-h-[300px]">
                    {shelfBooks.map((book) => {
                      const globalIndex = books.findIndex(b => b.id === book.id);
                      return (
                        <BookSpine
                          key={book.id}
                          book={book}
                          index={globalIndex}
                          totalBooks={books.length}
                          onClick={() => onSelectBook(book)}
                          onDelete={onDeleteBook}
                          onReorder={onReorderBooks}
                        />
                      );
                    })}
                    
                    {/* Add Book Button - show on last shelf */}
                    {shelfIndex === shelves.length - 1 && (
                      <button
                        onClick={onAddBook}
                        className="w-20 h-64 bg-gradient-to-b from-slate-700 to-slate-800 border-2 border-dashed border-slate-500 flex items-center justify-center hover:border-purple-400 hover:bg-slate-600 transition-all group relative overflow-hidden"
                        style={{
                          borderRadius: '8px 8px 4px 4px',
                          boxShadow: '4px 4px 12px rgba(0,0,0,0.5)',
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute inset-0 animate-pulse" style={{ boxShadow: 'inset 0 0 20px rgba(167, 139, 250, 0.5)' }} />
                        </div>
                        <span className="text-4xl text-slate-400 group-hover:text-purple-300 transition-colors relative z-10" style={{ textShadow: '0 0 10px rgba(167, 139, 250, 0)' }}>+</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Bottom shelf lip with depth */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-4"
                  style={{
                    background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.4))',
                  }}
                />
                
                {/* Shelf 3D shadow and depth */}
                <div className="relative">
                  <div className="h-6 bg-gradient-to-b from-amber-950 to-transparent rounded-b-lg -mt-1"
                    style={{
                      boxShadow: '0 8px 16px rgba(0,0,0,0.6)',
                      clipPath: 'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)',
                    }}
                  />
                </div>

                {/* Floor shadow beneath shelf with magical glow */}
                <div 
                  className="h-3 mx-8 mt-1 rounded-full blur-sm"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.6), rgba(167, 139, 250, 0.2), transparent 70%)',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Shelf 3D shadow and depth */}
          <div className="relative">
            <div className="h-6 bg-gradient-to-b from-amber-950 to-transparent rounded-b-lg -mt-1"
              style={{
                boxShadow: '0 8px 16px rgba(0,0,0,0.6)',
                clipPath: 'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)',
              }}
            />
          </div>

          {/* Floor shadow beneath shelf with magical glow */}
          <div 
            className="h-3 mx-8 mt-1 rounded-full blur-sm"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.6), rgba(167, 139, 250, 0.2), transparent 70%)',
            }}
          />
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center text-purple-300 text-sm">
          <p style={{ textShadow: '0 0 8px rgba(167, 139, 250, 0.6)' }}>Click on a spell book to open it and begin your studies</p>
        </div>

        {/* Scroll indicator */}
        <div 
          className="mt-12 flex flex-col items-center gap-2 animate-bounce cursor-pointer group transition-all hover:scale-110"
          onClick={() => {
            const element = document.getElementById('paths-of-knowledge');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
        >
          <p className="text-purple-400 text-xs group-hover:text-purple-300 transition-colors" style={{ textShadow: '0 0 8px rgba(167, 139, 250, 0.6)' }}>
            Scroll to discover new paths
          </p>
          <div className="relative">
            {/* Magical glow effect on hover */}
            <div 
              className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"
              style={{
                background: 'radial-gradient(circle, rgba(167, 139, 250, 0.8), transparent 70%)',
              }}
            />
            <svg className="w-6 h-6 text-purple-400 group-hover:text-purple-300 relative z-10 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* End First Section */}
      </div>

      {/* Transitional Gradient Bridge between sections */}
      <div className="relative h-32 w-full">
        {/* Smooth gradient transition */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(74, 29, 149, 0.3) 20%, rgba(88, 28, 135, 0.5) 40%, rgba(74, 29, 149, 0.7) 60%, rgba(59, 7, 100, 0.85) 80%, rgba(46, 16, 101, 0.95) 100%)',
          }}
        />
        
        {/* Mystical mist effect */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(167, 139, 250, 0.15), transparent 70%)',
            filter: 'blur(30px)',
          }}
        />
        
        {/* Floating particles during transition */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={`transition-particle-${i}`}
              className="absolute rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
                background: i % 2 === 0 ? '#a78bfa' : '#c4b5fd',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 1}s`,
                opacity: 0.5,
                boxShadow: `0 0 ${4 + Math.random() * 4}px currentColor`,
              }}
            />
          ))}
        </div>
        
        {/* Decorative divider line with glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-4 opacity-60">
          {['◈', '✦', '◆', '✦', '◈'].map((rune, i) => (
            <span 
              key={i} 
              className="text-purple-300 text-xl animate-pulse"
              style={{ 
                animationDelay: `${i * 0.2}s`,
                textShadow: '0 0 15px rgba(167, 139, 250, 0.8), 0 0 25px rgba(167, 139, 250, 0.4)',
              }}
            >
              {rune}
            </span>
          ))}
        </div>
      </div>

      {/* Recommendations Section */}
      <RecommendationsSection books={books} />

      {isAddingBook && (
        <AddBookModal
          onConfirm={onConfirmAddBook}
          onCancel={onCancelAddBook}
        />
      )}

      {/* Pet System Modal */}
      <AnimatePresence>
        {showPetSystem && (
          <PetSystem onClose={() => setShowPetSystem(false)} />
        )}
      </AnimatePresence>
      
      {/* CSS animations for floating runes and decorations */}
      <style>{`
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float-0 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-9px); }
        }
        @keyframes float-4 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-11px); }
        }
        
        @keyframes float-candle-0 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-15px) translateX(5px); }
          50% { transform: translateY(-8px) translateX(-3px); }
          75% { transform: translateY(-12px) translateX(4px); }
        }
        @keyframes float-candle-1 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-12px) translateX(-4px); }
          50% { transform: translateY(-18px) translateX(6px); }
          75% { transform: translateY(-10px) translateX(-2px); }
        }
        @keyframes float-candle-2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(6px); }
          50% { transform: translateY(-15px) translateX(-5px); }
          75% { transform: translateY(-8px) translateX(3px); }
        }
        @keyframes float-candle-3 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-14px) translateX(-3px); }
          50% { transform: translateY(-9px) translateX(5px); }
          75% { transform: translateY(-16px) translateX(-4px); }
        }
        @keyframes float-candle-4 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-11px) translateX(4px); }
          50% { transform: translateY(-17px) translateX(-6px); }
          75% { transform: translateY(-13px) translateX(2px); }
        }
        
        @keyframes fly-book-0 {
          0% { transform: translateX(-100px) translateY(0px) rotate(-5deg); opacity: 0; }
          10% { opacity: 0.2; }
          90% { opacity: 0.2; }
          100% { transform: translateX(calc(100vw + 100px)) translateY(-50px) rotate(5deg); opacity: 0; }
        }
        @keyframes fly-book-1 {
          0% { transform: translateX(-100px) translateY(20px) rotate(3deg); opacity: 0; }
          10% { opacity: 0.2; }
          90% { opacity: 0.2; }
          100% { transform: translateX(calc(100vw + 100px)) translateY(-30px) rotate(-3deg); opacity: 0; }
        }
        @keyframes fly-book-2 {
          0% { transform: translateX(-100px) translateY(-10px) rotate(-3deg); opacity: 0; }
          10% { opacity: 0.2; }
          90% { opacity: 0.2; }
          100% { transform: translateX(calc(100vw + 100px)) translateY(40px) rotate(5deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}