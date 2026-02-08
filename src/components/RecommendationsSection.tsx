import { useState, useEffect } from 'react';
import { Book } from '../types';
import { Sparkles, BookOpen, Wand2, Brain, Lightbulb, Settings, Loader2, RefreshCw } from 'lucide-react';
import { RecommendationModal } from './RecommendationModal';
import { AISettings } from './AISettings';
import { AnimatePresence } from 'motion/react';
import { generateAIRecommendations } from '../utils/aiRecommendations';

interface RecommendationsSectionProps {
  books: Book[];
}

interface Recommendation {
  title: string;
  description: string;
  icon: 'brain' | 'wand' | 'book' | 'lightbulb';
  color: string;
  accentColor: string;
}

export function RecommendationsSection({ books }: RecommendationsSectionProps) {
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<Recommendation[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Load API key from localStorage
  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      const trimmedKey = storedKey.trim();
      
      // Validate the key format
      if (trimmedKey && trimmedKey.startsWith('sk-') && trimmedKey.length > 10) {
        setApiKey(trimmedKey);
        // Clean up localStorage if needed
        if (trimmedKey !== storedKey) {
          localStorage.setItem('openai_api_key', trimmedKey);
        }
      } else {
        // Invalid key in storage, remove it
        console.warn('Invalid API key found in storage, clearing...');
        localStorage.removeItem('openai_api_key');
        setApiKey(null);
        setAiError('Invalid API key found. Please re-enter your OpenAI API key.');
      }
    }
  }, []);

  // Generate AI recommendations when books or API key changes
  useEffect(() => {
    if (apiKey && books.length > 0 && aiRecommendations.length === 0) {
      loadAIRecommendations();
    }
  }, [apiKey, books]);

  const loadAIRecommendations = async () => {
    if (!apiKey) return;
    
    setIsLoadingAI(true);
    setAiError(null);
    
    try {
      const recommendations = await generateAIRecommendations(books, apiKey);
      setAiRecommendations(recommendations);
      setAiError(null);
    } catch (error) {
      console.error('Failed to load AI recommendations:', error);
      const errorMessage = error instanceof Error ? error.message : 'The oracle vision is clouded. Please check your API key.';
      setAiError(errorMessage);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleSaveApiKey = (newApiKey: string) => {
    const trimmedKey = newApiKey.trim();
    if (trimmedKey) {
      localStorage.setItem('openai_api_key', trimmedKey);
      setApiKey(trimmedKey);
      setAiRecommendations([]); // Clear old recommendations
    } else {
      localStorage.removeItem('openai_api_key');
      setApiKey(null);
      setAiRecommendations([]);
    }
  };

  const handleRefreshAI = () => {
    setAiRecommendations([]);
    loadAIRecommendations();
  };
  // Generate recommendations based on existing books
  const generateRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = [];
    
    // Base recommendations if no books
    if (books.length === 0) {
      return [
        {
          title: 'Begin Your Journey',
          description: 'Start with a foundational spell book in any subject that interests you',
          icon: 'book',
          color: '#0F4C5C',
          accentColor: '#5FA8D3',
        },
        {
          title: 'Discover Magic',
          description: 'Explore the mystical arts of learning and knowledge gathering',
          icon: 'wand',
          color: '#4A0E4E',
          accentColor: '#9D50BB',
        },
        {
          title: 'Unlock Wisdom',
          description: 'Every great wizard starts with a single book of spells',
          icon: 'lightbulb',
          color: '#8B4513',
          accentColor: '#D4AF37',
        },
      ];
    }

    // Keywords to detect subjects
    const keywords = books.map(book => book.title.toLowerCase()).join(' ');
    
    // Science/Chemistry related
    if (keywords.includes('potion') || keywords.includes('chemistry') || keywords.includes('science')) {
      recommendations.push({
        title: 'Advanced Alchemy',
        description: 'Delve deeper into the transmutation of elements and molecular sorcery',
        icon: 'brain',
        color: '#1e3a8a',
        accentColor: '#60a5fa',
      });
    }
    
    // History related
    if (keywords.includes('history') || keywords.includes('rune') || keywords.includes('ancient')) {
      recommendations.push({
        title: 'Temporal Studies',
        description: 'Explore the chronicles of ancient civilizations and lost wisdom',
        icon: 'book',
        color: '#78350f',
        accentColor: '#fbbf24',
      });
    }
    
    // Math related
    if (keywords.includes('math') || keywords.includes('arithmancy') || keywords.includes('number')) {
      recommendations.push({
        title: 'Geometric Enchantments',
        description: 'Master the sacred geometry and numerical mysticism',
        icon: 'brain',
        color: '#1e1b4b',
        accentColor: '#818cf8',
      });
    }

    // Language/Literature related
    if (keywords.includes('language') || keywords.includes('literature') || keywords.includes('writing')) {
      recommendations.push({
        title: 'Linguistic Sorcery',
        description: 'Unlock the power of words and ancient tongues',
        icon: 'wand',
        color: '#4c1d95',
        accentColor: '#c4b5fd',
      });
    }

    // Always add some general recommendations
    recommendations.push({
      title: 'Cross-Discipline Magic',
      description: 'Combine your current studies to create powerful new insights',
      icon: 'lightbulb',
      color: '#831843',
      accentColor: '#f472b6',
    });

    recommendations.push({
      title: 'Practical Applications',
      description: 'Transform theory into practice with hands-on magical experiments',
      icon: 'wand',
      color: '#134e4a',
      accentColor: '#5eead4',
    });

    recommendations.push({
      title: 'Meditation & Focus',
      description: 'Strengthen your mental faculties and concentration abilities',
      icon: 'brain',
      color: '#713f12',
      accentColor: '#fcd34d',
    });

    // Return up to 6 recommendations
    return recommendations.slice(0, 6);
  };

  // Use AI recommendations if available, otherwise fall back to rule-based
  const recommendations = aiRecommendations.length > 0 ? aiRecommendations : generateRecommendations();

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'brain':
        return Brain;
      case 'wand':
        return Wand2;
      case 'book':
        return BookOpen;
      case 'lightbulb':
        return Lightbulb;
      default:
        return Sparkles;
    }
  };

  return (
    <div id="paths-of-knowledge" className="min-h-screen py-16 px-8 relative">
      {/* Mystical background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 opacity-90" />
      
      {/* Floating particles for this section */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              background: i % 2 === 0 ? '#c4b5fd' : '#fcd34d',
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-purple-300 animate-pulse" />
            <h2 className="text-4xl font-serif text-purple-100" style={{ textShadow: '0 0 20px rgba(192, 132, 252, 0.5)' }}>
              Paths of Knowledge
            </h2>
            <Sparkles className="w-6 h-6 text-purple-300 animate-pulse" />
          </div>
          <p className="text-purple-300 text-lg italic mb-4" style={{ textShadow: '0 0 10px rgba(192, 132, 252, 0.3)' }}>
            {apiKey 
              ? aiRecommendations.length > 0 
                ? 'The AI Oracle has revealed these mystical paths tailored for you'
                : 'The mystical library senses your journey and reveals new paths to explore'
              : 'The mystical library senses your journey and reveals new paths to explore'
            }
          </p>

          {/* AI Status and Controls */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {/* Settings button */}
            <button
              onClick={() => setShowSettings(true)}
              className="group px-4 py-2 rounded-lg font-serif transition-all transform hover:scale-105 flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(167, 139, 250, 0.3))',
                border: '2px solid rgba(167, 139, 250, 0.4)',
                boxShadow: '0 0 20px rgba(167, 139, 250, 0.2)',
              }}
            >
              <Settings className="w-4 h-4 text-purple-300 group-hover:rotate-90 transition-transform duration-500" />
              <span className="text-purple-200 text-sm">
                {apiKey ? 'AI Oracle Active' : 'Enable AI Oracle'}
              </span>
            </button>

            {/* Refresh button - only show if AI is active */}
            {apiKey && aiRecommendations.length > 0 && (
              <button
                onClick={handleRefreshAI}
                disabled={isLoadingAI}
                className="group px-4 py-2 rounded-lg font-serif transition-all transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.4), rgba(245, 158, 11, 0.3))',
                  border: '2px solid rgba(251, 191, 36, 0.4)',
                  boxShadow: '0 0 20px rgba(251, 191, 36, 0.2)',
                }}
              >
                <RefreshCw className={`w-4 h-4 text-amber-300 ${isLoadingAI ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                <span className="text-amber-200 text-sm">Refresh Vision</span>
              </button>
            )}
          </div>

          {/* Loading state */}
          {isLoadingAI && (
            <div className="flex items-center justify-center gap-2 mt-4 text-purple-300">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm italic">The oracle is consulting the ancient texts...</span>
            </div>
          )}

          {/* Error state */}
          {aiError && (
            <div className="mt-4 p-4 rounded-lg border border-red-500/30 bg-red-500/10 max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold text-xs mt-0.5">
                  !
                </div>
                <div className="flex-1">
                  <p className="text-red-300 text-sm mb-2">{aiError}</p>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="text-xs px-3 py-1.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-200 transition-colors border border-red-500/30"
                  >
                    Update API Key
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recommendations grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => {
            const Icon = getIcon(rec.icon);
            
            return (
              <div
                key={index}
                className="group relative cursor-pointer"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`,
                }}
                onClick={() => setSelectedRecommendation(rec)}
              >
                {/* Card glow effect - multiple layers */}
                <div 
                  className="absolute -inset-2 rounded-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-lg"
                  style={{
                    background: `radial-gradient(circle, ${rec.accentColor}80, transparent 70%)`,
                    animation: 'pulse-glow 2s ease-in-out infinite',
                  }}
                />
                
                <div 
                  className="absolute -inset-3 rounded-xl opacity-0 group-hover:opacity-40 transition-opacity duration-700 blur-xl"
                  style={{
                    background: `radial-gradient(ellipse at 60% 40%, ${rec.accentColor}60, transparent 65%)`,
                    animation: 'pulse-glow 2.5s ease-in-out infinite 0.3s',
                  }}
                />

                {/* Magical particles around card on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-visible">
                  {/* Star particles */}
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={`star-${i}`}
                      className="absolute"
                      style={{
                        left: `${10 + i * 15}%`,
                        top: `${i % 2 === 0 ? '5%' : '95%'}`,
                        animation: `orbit-star 3s ease-in-out infinite ${i * 0.2}s`,
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10">
                        <path 
                          d="M5,0 L6,4 L10,5 L6,6 L5,10 L4,6 L0,5 L4,4 Z" 
                          fill={rec.accentColor}
                          opacity="0.7"
                          style={{ filter: `drop-shadow(0 0 3px ${rec.accentColor})` }}
                        />
                      </svg>
                    </div>
                  ))}
                  
                  {/* Floating orbs */}
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={`orb-${i}`}
                      className="absolute rounded-full"
                      style={{
                        left: `${20 + i * 20}%`,
                        top: `${30 + i * 15}%`,
                        width: '6px',
                        height: '6px',
                        background: rec.accentColor,
                        boxShadow: `0 0 10px ${rec.accentColor}`,
                        animation: `float-orb 2s ease-in-out infinite ${i * 0.3}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Card */}
                <div 
                  className="relative rounded-lg p-6 h-full transition-all duration-500 ease-out"
                  style={{
                    background: `linear-gradient(135deg, ${rec.color}dd 0%, ${rec.color}aa 100%)`,
                    boxShadow: `
                      0 4px 20px rgba(0,0,0,0.5),
                      inset 0 1px 2px rgba(255,255,255,0.1),
                      0 0 0 1px ${rec.accentColor}40
                    `,
                    animation: 'card-float 4s ease-in-out infinite',
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  {/* Texture overlay */}
                  <div 
                    className="absolute inset-0 rounded-lg opacity-20"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 20% 30%, rgba(255,255,255,0.2), transparent 40%),
                        repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)
                      `,
                    }}
                  />

                  {/* Content */}
                  <div className="relative">
                    {/* Icon */}
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:animate-pulse"
                      style={{
                        background: `radial-gradient(circle, ${rec.accentColor}40, transparent 70%)`,
                        boxShadow: `0 0 20px ${rec.accentColor}60`,
                      }}
                    >
                      <Icon 
                        className="w-6 h-6"
                        style={{ 
                          color: rec.accentColor,
                          filter: `drop-shadow(0 0 4px ${rec.accentColor})`,
                        }}
                      />
                    </div>

                    {/* Title */}
                    <h3 
                      className="text-xl font-serif mb-3"
                      style={{ 
                        color: rec.accentColor,
                        textShadow: `0 0 10px ${rec.accentColor}60`,
                      }}
                    >
                      {rec.title}
                    </h3>

                    {/* Description */}
                    <p className="text-purple-100 text-sm leading-relaxed opacity-90">
                      {rec.description}
                    </p>

                    {/* Decorative rune */}
                    <div className="mt-4 flex justify-center">
                      <div 
                        className="text-2xl opacity-40 group-hover:opacity-70 transition-opacity"
                        style={{ 
                          color: rec.accentColor,
                          textShadow: `0 0 8px ${rec.accentColor}80`,
                        }}
                      >
                        ✦
                      </div>
                    </div>
                  </div>

                  {/* Shimmer effect */}
                  <div 
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none overflow-hidden"
                    style={{
                      background: `linear-gradient(110deg, transparent 40%, ${rec.accentColor}30 48%, ${rec.accentColor}50 52%, transparent 60%)`,
                      backgroundSize: '400% 100%',
                      animation: 'shimmer-card 4s ease-in-out infinite',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom decorative divider */}
        <div className="mt-16 flex items-center justify-center gap-4 opacity-40">
          {['◈', '✦', '◆', '✧', '◈'].map((rune, i) => (
            <span 
              key={i} 
              className="text-purple-300 text-2xl animate-pulse"
              style={{ 
                animationDelay: `${i * 0.2}s`,
                textShadow: '0 0 10px rgba(192, 132, 252, 0.8)',
              }}
            >
              {rune}
            </span>
          ))}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer-card {
          0% { background-position: -150% 0; }
          100% { background-position: 250% 0; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        @keyframes orbit-star {
          0% { transform: translate(0, 0); }
          50% { transform: translate(0, 10px); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes float-orb {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
        
        @keyframes card-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>

      {/* Modal */}
      {selectedRecommendation && (
        <RecommendationModal
          recommendation={selectedRecommendation}
          onClose={() => setSelectedRecommendation(null)}
        />
      )}

      {/* AI Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <AISettings
            onClose={() => setShowSettings(false)}
            currentApiKey={apiKey}
            onSaveApiKey={handleSaveApiKey}
          />
        )}
      </AnimatePresence>
    </div>
  );
}