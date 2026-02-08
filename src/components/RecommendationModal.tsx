import { X, BookOpen, Wand2, Brain, Lightbulb } from 'lucide-react';

interface Recommendation {
  title: string;
  description: string;
  icon: 'brain' | 'wand' | 'book' | 'lightbulb';
  color: string;
  accentColor: string;
  introduction?: string;
}

interface RecommendationModalProps {
  recommendation: Recommendation;
  onClose: () => void;
}

export function RecommendationModal({ recommendation, onClose }: RecommendationModalProps) {
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
        return BookOpen;
    }
  };

  const Icon = getIcon(recommendation.icon);

  // Generate detailed introduction based on the recommendation
  const getDetailedIntroduction = () => {
    if (recommendation.introduction) {
      return recommendation.introduction;
    }

    // Generate based on title
    const introductions: { [key: string]: string } = {
      'Advanced Alchemy': 'Alchemy is the ancient art of transmutation and transformation. In this mystical discipline, you will learn to understand the fundamental properties of matter, energy, and magical essences. From brewing potent elixirs to understanding molecular structures, alchemy bridges the gap between the physical and the ethereal. Master alchemists can transform base materials into precious substances, create powerful potions, and unlock the secrets hidden within the elemental forces of nature.',
      
      'Temporal Studies': 'The study of time and history reveals the patterns that shape our present and future. Through temporal studies, you will explore the chronicles of ancient civilizations, understand the rise and fall of magical empires, and decipher the wisdom preserved in long-forgotten texts. This discipline teaches you to see connections across ages, recognize recurring patterns in human behavior, and draw upon the accumulated knowledge of countless generations to solve modern challenges.',
      
      'Geometric Enchantments': 'Mathematics and geometry form the underlying structure of reality itself. Sacred geometry reveals the mystical patterns that govern the universe - from the spirals of galaxies to the arrangement of flower petals. By mastering geometric enchantments, you will learn to harness these universal patterns, create powerful sigils and mandalas, understand the numerical harmonies that bind magic together, and use mathematical precision to enhance your spellwork.',
      
      'Linguistic Sorcery': 'Words hold power beyond mere communication. Linguistic sorcery teaches you that language itself is a form of magic - each word a spell, each sentence an incantation. You will study ancient tongues, decode mystical scripts, and learn how pronunciation and etymology can unlock hidden powers. Master linguists can speak words of power, decipher cryptic prophecies, and understand the true names of things, granting them influence over the very essence of reality.',
      
      'Cross-Discipline Magic': 'The most powerful magic emerges when different disciplines converge. Cross-discipline magic teaches you to find unexpected connections between seemingly unrelated fields of study. By combining your current knowledge with new perspectives, you can create innovative solutions, develop unique magical techniques, and discover insights that specialists might miss. This integrative approach transforms you from a practitioner into an innovator.',
      
      'Practical Applications': 'Theory without practice is merely philosophy. This path focuses on translating your accumulated knowledge into tangible results. You will learn to design experiments, create functional magical artifacts, solve real-world problems using mystical methods, and bridge the gap between academic understanding and practical mastery. The emphasis is on hands-on experience, trial and error, and developing the intuition that comes from direct engagement with magical forces.',
      
      'Meditation & Focus': 'The mind is the most powerful magical tool at your disposal. Through meditation and focus training, you will learn to quiet mental chatter, enhance concentration, develop crystal-clear visualization abilities, and maintain composure under pressure. These mental disciplines amplify all other magical abilities, allowing you to cast more precisely, maintain spells for longer periods, and access deeper states of consciousness where profound insights await.',
      
      'Begin Your Journey': 'Every master was once a beginner. The path of learning stretches infinitely before you, filled with wonder and discovery. Starting your journey means choosing to embrace curiosity, committing to regular practice, accepting that mistakes are valuable teachers, and opening yourself to transformation. There is no single right way to begin - the best first step is the one that resonates with your interests and ignites your passion for knowledge.',
      
      'Discover Magic': 'Magic is everywhere, waiting to be discovered by those with eyes to see. This introductory path teaches you to recognize the extraordinary within the ordinary, cultivate wonder and appreciation for the mysteries around you, develop your innate magical sensitivity, and begin your transformation from observer to participant in the grand tapestry of mystical forces. Discovery is not just about finding new things, but about seeing familiar things in new ways.',
      
      'Unlock Wisdom': 'Wisdom is knowledge tempered by experience and reflection. To unlock wisdom is to go beyond mere information gathering and develop deep understanding, learn from both successes and failures, cultivate discernment and good judgment, and integrate your learning into a coherent worldview. Wisdom cannot be rushed or forced - it grows naturally when you approach your studies with patience, humility, and genuine curiosity.',
    };

    return introductions[recommendation.title] || 'Explore this mystical path to expand your knowledge and unlock new abilities. Each journey into learning transforms you, revealing hidden connections and deepening your understanding of the magical arts. Take the first step and discover what awaits you on this path of enlightenment.';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className="relative max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-xl shadow-2xl animate-scaleIn"
        style={{
          background: `linear-gradient(135deg, ${recommendation.color}f0 0%, ${recommendation.color}dd 100%)`,
          boxShadow: `
            0 20px 60px rgba(0,0,0,0.7),
            0 0 0 1px ${recommendation.accentColor}60,
            0 0 40px ${recommendation.accentColor}40
          `,
        }}
      >
        {/* Magical particle effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                background: recommendation.accentColor,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                opacity: 0.4,
              }}
            />
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-black/30 hover:bg-black/50 transition-all group z-10"
          style={{
            boxShadow: `0 0 20px ${recommendation.accentColor}40`,
          }}
        >
          <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Content */}
        <div className="relative p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: `radial-gradient(circle, ${recommendation.accentColor}60, transparent 70%)`,
                boxShadow: `0 0 30px ${recommendation.accentColor}80`,
              }}
            >
              <Icon 
                className="w-8 h-8"
                style={{ 
                  color: recommendation.accentColor,
                  filter: `drop-shadow(0 0 6px ${recommendation.accentColor})`,
                }}
              />
            </div>

            <div>
              <h2 
                className="text-3xl font-serif mb-2"
                style={{ 
                  color: recommendation.accentColor,
                  textShadow: `0 0 15px ${recommendation.accentColor}80`,
                }}
              >
                {recommendation.title}
              </h2>
              <p className="text-purple-100 italic opacity-90">
                {recommendation.description}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6 opacity-50">
            {['◈', '✦', '◆'].map((rune, i) => (
              <span 
                key={i} 
                className="text-xl animate-pulse"
                style={{ 
                  color: recommendation.accentColor,
                  animationDelay: `${i * 0.3}s`,
                  textShadow: `0 0 10px ${recommendation.accentColor}80`,
                }}
              >
                {rune}
              </span>
            ))}
            <div className="flex-1 h-px" style={{ background: recommendation.accentColor }} />
          </div>

          {/* Introduction text */}
          <div className="space-y-4 text-purple-50 leading-relaxed">
            <h3 
              className="text-xl font-serif mb-3"
              style={{ 
                color: recommendation.accentColor,
                textShadow: `0 0 10px ${recommendation.accentColor}60`,
              }}
            >
              Introduction to {recommendation.title}
            </h3>
            
            <p className="text-base opacity-90" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
              {getDetailedIntroduction()}
            </p>

            {/* Call to action */}
            <div 
              className="mt-8 p-6 rounded-lg border-2"
              style={{
                background: `linear-gradient(135deg, ${recommendation.accentColor}20, transparent)`,
                borderColor: `${recommendation.accentColor}40`,
                boxShadow: `inset 0 0 20px ${recommendation.accentColor}10`,
              }}
            >
              <p className="text-sm italic text-center opacity-80">
                "The journey of a thousand spells begins with a single incantation. Are you ready to embark on this mystical path?"
              </p>
            </div>
          </div>

          {/* Decorative footer */}
          <div className="mt-6 flex justify-center gap-2 opacity-40">
            {['✧', '◈', '✦', '◆', '✧'].map((rune, i) => (
              <span 
                key={i} 
                className="text-xl animate-pulse"
                style={{ 
                  color: recommendation.accentColor,
                  animationDelay: `${i * 0.2}s`,
                  textShadow: `0 0 8px ${recommendation.accentColor}80`,
                }}
              >
                {rune}
              </span>
            ))}
          </div>
        </div>

        {/* Shimmer effect */}
        <div 
          className="absolute inset-0 rounded-xl opacity-20 pointer-events-none"
          style={{
            background: `linear-gradient(45deg, transparent 30%, ${recommendation.accentColor}40 50%, transparent 70%)`,
            backgroundSize: '200% 200%',
            animation: 'shimmer-modal 3s ease-in-out infinite',
          }}
        />
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes shimmer-modal {
          0%, 100% { background-position: -200% -200%; }
          50% { background-position: 200% 200%; }
        }
      `}</style>
    </div>
  );
}
