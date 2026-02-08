import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Star, RotateCcw, Sparkles } from "lucide-react";

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  petColor: string;
  petEmoji: string;
  petGifPath: string;
  onWin: (xpEarned: number) => void;
  onLose: () => void;
  onClose: () => void;
}

const CARD_EMOJIS = ["✨", "🔮", "📜", "🗝️", "⚗️", "🕯️", "🌙", "⭐"];
const TIME_LIMIT = 80; // 1:20 in seconds
const XP_REWARD = 200;

export function MemoryGame({
  petColor,
  petEmoji,
  petGifPath,
  onWin,
  onLose,
  onClose,
}: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isGameActive, setIsGameActive] = useState(true);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameResult, setGameResult] = useState<"won" | "lost" | null>(null);

  // Initialize cards
  useEffect(() => {
    initializeGame();
  }, []);

  // Timer
  useEffect(() => {
    if (!isGameActive || gameResult) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsGameActive(false);
          setGameResult("lost");
          onLose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameActive, gameResult]);

  // Check for win condition
  useEffect(() => {
    if (matchedPairs === CARD_EMOJIS.length && isGameActive) {
      setIsGameActive(false);
      setGameResult("won");
      onWin(XP_REWARD);
    }
  }, [matchedPairs, isGameActive, onWin]);

  const initializeGame = () => {
    // Create pairs of cards
    const cardPairs = [...CARD_EMOJIS, ...CARD_EMOJIS];

    // Shuffle cards
    const shuffled = cardPairs
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setFlippedCards([]);
    setTimeLeft(TIME_LIMIT);
    setIsGameActive(true);
    setMoves(0);
    setMatchedPairs(0);
    setGameResult(null);
  };

  const handleCardClick = (cardId: number) => {
    if (!isGameActive || gameResult) return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2)
      return;

    // Flip the card
    const newCards = cards.map((c) =>
      c.id === cardId ? { ...c, isFlipped: true } : c,
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Check for match when two cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);

      const [firstId, secondId] = newFlippedCards;
      const firstCard = newCards.find((c) => c.id === firstId);
      const secondCard = newCards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true }
                : c,
            ),
          );
          setMatchedPairs((prev) => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match, flip back
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c,
            ),
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(0, 0, 0, 0.9)",
        backdropFilter: "blur(12px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative max-w-3xl w-full rounded-3xl shadow-2xl p-8"
        style={{
          background:
            "linear-gradient(135deg, rgba(30, 20, 10, 0.98), rgba(20, 15, 10, 0.99))",
          border: `3px solid ${petColor}80`,
          boxShadow: `0 0 60px ${petColor}50, 0 20px 60px rgba(0, 0, 0, 0.5)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Magical particles */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: petColor,
                boxShadow: `0 0 10px ${petColor}`,
                left: `${10 + i * 8}%`,
                top: `${10 + (i % 4) * 25}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.5, 1.5, 0.5],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2.5,
                delay: i * 0.2,
                repeat: Infinity,
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div className="text-center mb-6 relative">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
            <h2
              className="text-3xl font-serif text-amber-100"
              style={{ textShadow: "0 0 20px rgba(251, 191, 36, 0.5)" }}
            >
              Memory Enchantment
            </h2>
            <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
          </div>
          <p className="text-purple-200 text-sm italic">
            Match all pairs within 1:20 to earn {XP_REWARD} XP!
          </p>
        </div>

        {/* Pet watching */}
        <div className="flex justify-center mb-4">
          <motion.div
            className="text-6xl flex justify-center items-center h-24 w-24"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <img
              src={petGifPath}
              alt="Pet"
              className="h-24 w-24 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                if ((e.target as HTMLImageElement).nextElementSibling) {
                  (
                    (e.target as HTMLImageElement)
                      .nextElementSibling as HTMLElement
                  ).style.display = "block";
                }
              }}
            />
            <div className="text-6xl hidden">{petEmoji}</div>
          </motion.div>
        </div>

        {/* Game Stats */}
        <div className="flex justify-between items-center mb-6 px-4">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{
              background: "rgba(50, 30, 20, 0.6)",
              border: "2px solid rgba(251, 191, 36, 0.3)",
            }}
          >
            <Clock className="w-5 h-5 text-yellow-400" />
            <span
              className="text-xl font-bold"
              style={{
                color: timeLeft < 20 ? "#ef4444" : "#fbbf24",
                textShadow:
                  timeLeft < 20 ? "0 0 10px #ef4444" : "0 0 10px #fbbf24",
              }}
            >
              {formatTime(timeLeft)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-purple-200">
              <span className="text-sm">Moves: </span>
              <span className="font-bold text-lg">{moves}</span>
            </div>
            <div className="text-purple-200">
              <span className="text-sm">Pairs: </span>
              <span className="font-bold text-lg">
                {matchedPairs}/{CARD_EMOJIS.length}
              </span>
            </div>
          </div>

          <button
            onClick={initializeGame}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{
              border: "2px solid rgba(167, 139, 250, 0.4)",
            }}
            title="Restart Game"
          >
            <RotateCcw className="w-5 h-5 text-purple-300" />
          </button>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {cards.map((card) => (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className="aspect-square rounded-xl relative overflow-hidden"
              style={{
                background: card.isMatched
                  ? `linear-gradient(135deg, ${petColor}40, ${petColor}20)`
                  : card.isFlipped
                    ? "linear-gradient(135deg, rgba(167, 139, 250, 0.3), rgba(139, 92, 246, 0.4))"
                    : "linear-gradient(135deg, rgba(50, 30, 20, 0.8), rgba(40, 25, 15, 0.9))",
                border: card.isMatched
                  ? `3px solid ${petColor}`
                  : "3px solid rgba(251, 191, 36, 0.4)",
                boxShadow: card.isMatched
                  ? `0 0 20px ${petColor}60`
                  : card.isFlipped
                    ? "0 0 15px rgba(167, 139, 250, 0.4)"
                    : "0 4px 10px rgba(0, 0, 0, 0.3)",
                cursor:
                  card.isMatched || card.isFlipped || !isGameActive
                    ? "default"
                    : "pointer",
              }}
              whileHover={
                !card.isFlipped && !card.isMatched && isGameActive
                  ? { scale: 1.05 }
                  : {}
              }
              whileTap={
                !card.isFlipped && !card.isMatched && isGameActive
                  ? { scale: 0.95 }
                  : {}
              }
              disabled={
                card.isMatched ||
                card.isFlipped ||
                !isGameActive ||
                gameResult !== null
              }
            >
              <AnimatePresence mode="wait">
                {card.isFlipped || card.isMatched ? (
                  <motion.div
                    key="front"
                    initial={{ rotateY: 90 }}
                    animate={{ rotateY: 0 }}
                    exit={{ rotateY: 90 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center text-5xl"
                  >
                    {card.emoji}
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: 0 }}
                    exit={{ rotateY: 90 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div
                      className="w-12 h-12 rounded-lg opacity-40"
                      style={{
                        background: `radial-gradient(circle, ${petColor}40, transparent 70%)`,
                      }}
                    />
                    <div className="absolute text-3xl opacity-30">✦</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {/* Game Result */}
        <AnimatePresence>
          {gameResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center rounded-3xl"
              style={{
                background: "rgba(0, 0, 0, 0.8)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="text-center p-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10, stiffness: 200 }}
                  className="text-8xl mb-4"
                >
                  {gameResult === "won" ? "🎉" : "⏰"}
                </motion.div>
                <h3
                  className="text-4xl font-serif mb-3"
                  style={{
                    color: gameResult === "won" ? "#10b981" : "#ef4444",
                    textShadow:
                      gameResult === "won"
                        ? "0 0 20px #10b981"
                        : "0 0 20px #ef4444",
                  }}
                >
                  {gameResult === "won" ? "Victory!" : "Time's Up!"}
                </h3>
                <p className="text-purple-200 mb-4">
                  {gameResult === "won"
                    ? `You completed the challenge in ${moves} moves!`
                    : "Better luck next time!"}
                </p>
                {gameResult === "won" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-center gap-2 mb-6 px-6 py-3 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${petColor}40, ${petColor}20)`,
                      border: `2px solid ${petColor}`,
                      boxShadow: `0 0 20px ${petColor}60`,
                    }}
                  >
                    <Star className="w-6 h-6 text-yellow-400" />
                    <span className="text-2xl font-bold text-yellow-300">
                      +{XP_REWARD} XP
                    </span>
                  </motion.div>
                )}
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={initializeGame}
                    className="px-6 py-3 rounded-lg font-serif text-lg transition-all hover:scale-105"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(139, 92, 246, 0.6), rgba(167, 139, 250, 0.5))",
                      border: "2px solid rgba(167, 139, 250, 0.6)",
                      boxShadow: "0 0 20px rgba(167, 139, 250, 0.4)",
                    }}
                  >
                    <div className="flex items-center gap-2 text-purple-100">
                      <RotateCcw className="w-5 h-5" />
                      <span>Play Again</span>
                    </div>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-lg font-serif text-lg transition-all hover:scale-105"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(50, 30, 20, 0.6), rgba(40, 25, 15, 0.8))",
                      border: "2px solid rgba(251, 191, 36, 0.4)",
                      boxShadow: "0 0 20px rgba(251, 191, 36, 0.3)",
                    }}
                  >
                    <span className="text-amber-100">Close</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        <div className="text-center text-purple-200/60 text-sm italic">
          Click cards to flip and find matching pairs
        </div>
      </motion.div>
    </motion.div>
  );
}
