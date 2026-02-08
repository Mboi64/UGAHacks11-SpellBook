import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Star, RotateCcw, Sparkles, Heart, Zap } from "lucide-react";

interface Projectile {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  color: string;
}

interface BulletHellGameProps {
  petColor: string;
  petEmoji: string;
  petGifPath: string;
  onWin: (xpEarned: number) => void;
  onLose: () => void;
  onClose: () => void;
}

const GAME_WIDTH = 500;
const GAME_HEIGHT = 600;
const PET_SIZE = 50;
const TIME_LIMIT = 30; // 30 seconds
const XP_REWARD = 200;

export function BulletHellGame({
  petColor,
  petEmoji,
  petGifPath,
  onWin,
  onLose,
  onClose,
}: BulletHellGameProps) {
  const [petPos, setPetPos] = useState({
    x: GAME_WIDTH / 2 - PET_SIZE / 2,
    y: GAME_HEIGHT - 100,
  });
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isGameActive, setIsGameActive] = useState(true);
  const [gameResult, setGameResult] = useState<"won" | "lost" | null>(null);
  const [lives, setLives] = useState(1);
  const [isInvulnerable, setIsInvulnerable] = useState(false);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const projectileIdRef = useRef(0);
  const keysPressed = useRef<Set<string>>(new Set());
  const mousePos = useRef<{ x: number; y: number } | null>(null);
  const lastSpawnTime = useRef(0);
  const gameStartTimeRef = useRef<number | null>(null);

  // Robust Timer - uses actual elapsed time for accuracy
  useEffect(() => {
    if (!isGameActive || gameResult) return;

    // Initialize start time on first run
    if (gameStartTimeRef.current === null) {
      gameStartTimeRef.current = Date.now();
    }

    const updateTimer = setInterval(() => {
      if (gameStartTimeRef.current === null) return;

      const elapsedSeconds = Math.floor(
        (Date.now() - gameStartTimeRef.current) / 1000,
      );
      const remainingSeconds = Math.max(0, TIME_LIMIT - elapsedSeconds);

      setTimeLeft(remainingSeconds);

      // Win condition - time ran out
      if (remainingSeconds <= 0) {
        setIsGameActive(false);
        setGameResult("won");
        onWin(XP_REWARD);
      }
    }, 100); // Update every 100ms for smooth display and accuracy

    return () => clearInterval(updateTimer);
  }, [isGameActive, gameResult, onWin]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        [
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "a",
          "d",
          "w",
          "s",
        ].includes(e.key)
      ) {
        e.preventDefault();
        keysPressed.current.add(e.key.toLowerCase());
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Mouse controls
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        mousePos.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }
    };

    const gameArea = gameAreaRef.current;
    if (gameArea) {
      gameArea.addEventListener("mousemove", handleMouseMove);
      return () => gameArea.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  // Pet movement
  useEffect(() => {
    if (!isGameActive || gameResult) return;

    const moveInterval = setInterval(() => {
      setPetPos((prev) => {
        let newX = prev.x;
        let newY = prev.y;
        const speed = 5;

        // Mouse control (takes priority)
        if (mousePos.current) {
          const targetX = mousePos.current.x - PET_SIZE / 2;
          const targetY = mousePos.current.y - PET_SIZE / 2;

          const dx = targetX - prev.x;
          const dy = targetY - prev.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 5) {
            newX += (dx / distance) * Math.min(speed * 2, distance);
            newY += (dy / distance) * Math.min(speed * 2, distance);
          }
        } else {
          // Keyboard control
          if (
            keysPressed.current.has("arrowleft") ||
            keysPressed.current.has("a")
          ) {
            newX -= speed;
          }
          if (
            keysPressed.current.has("arrowright") ||
            keysPressed.current.has("d")
          ) {
            newX += speed;
          }
          if (
            keysPressed.current.has("arrowup") ||
            keysPressed.current.has("w")
          ) {
            newY -= speed;
          }
          if (
            keysPressed.current.has("arrowdown") ||
            keysPressed.current.has("s")
          ) {
            newY += speed;
          }
        }

        // Boundary constraints
        newX = Math.max(0, Math.min(GAME_WIDTH - PET_SIZE, newX));
        newY = Math.max(0, Math.min(GAME_HEIGHT - PET_SIZE, newY));

        return { x: newX, y: newY };
      });
    }, 16); // ~60 FPS

    return () => clearInterval(moveInterval);
  }, [isGameActive, gameResult]);

  // Spawn projectiles
  useEffect(() => {
    if (!isGameActive || gameResult) return;

    const spawnInterval = setInterval(() => {
      const now = Date.now();

      // Difficulty scaling based on remaining time - progressively harder as timer counts down
      // 0:30 - 0:24 (30-24s remaining): Easy
      // 0:24 - 0:18 (24-18s remaining): Medium
      // 0:18 - 0:12 (18-12s remaining): Medium-Hard
      // 0:12 - 0:06 (12-6s remaining): Hard
      // 0:06 - 0:00 (6-0s remaining): EXTREME!!!
      let spawnRate = 800; // Base spawn rate in ms
      let maxProjectiles = 1;
      let speedMultiplier = 1.5;

      if (timeLeft <= 6) {
        // EXTREME difficulty (0:06 - 0:00 remaining)
        spawnRate = 150;
        maxProjectiles = 5;
        speedMultiplier = 4.5;
      } else if (timeLeft <= 12) {
        // Hard (0:12 - 0:06 remaining)
        spawnRate = 300;
        maxProjectiles = 3;
        speedMultiplier = 3.5;
      } else if (timeLeft <= 18) {
        // Medium-hard (0:18 - 0:12 remaining)
        spawnRate = 450;
        maxProjectiles = 2;
        speedMultiplier = 2.8;
      } else if (timeLeft <= 24) {
        // Medium (0:24 - 0:18 remaining)
        spawnRate = 600;
        maxProjectiles = 2;
        speedMultiplier = 2.2;
      }
      // else: Easy (0:30 - 0:24 remaining) - uses default values

      if (now - lastSpawnTime.current < spawnRate) return;
      lastSpawnTime.current = now;

      const newProjectiles: Projectile[] = [];
      const projectilesToSpawn = Math.floor(Math.random() * maxProjectiles) + 1;

      for (let i = 0; i < projectilesToSpawn; i++) {
        const size = 15 + Math.random() * 15;
        const colors = ["#ef4444", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"];

        newProjectiles.push({
          id: projectileIdRef.current++,
          x: Math.random() * (GAME_WIDTH - size),
          y: -size,
          speed: (3 + Math.random() * 4) * speedMultiplier,
          size,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      setProjectiles((prev) => [...prev, ...newProjectiles]);
    }, 50);

    return () => clearInterval(spawnInterval);
  }, [isGameActive, gameResult, timeLeft]);

  // Move projectiles and check collisions
  useEffect(() => {
    if (!isGameActive || gameResult) return;

    const updateInterval = setInterval(() => {
      setProjectiles((prev) => {
        const updated = prev
          .map((proj) => ({
            ...proj,
            y: proj.y + proj.speed,
          }))
          .filter((proj) => proj.y < GAME_HEIGHT + 50);

        // Collision detection
        if (!isInvulnerable) {
          const petCenterX = petPos.x + PET_SIZE / 2;
          const petCenterY = petPos.y + PET_SIZE / 2;
          const petRadius = PET_SIZE / 3; // Smaller hitbox for fairness

          for (const proj of updated) {
            const projCenterX = proj.x + proj.size / 2;
            const projCenterY = proj.y + proj.size / 2;
            const projRadius = proj.size / 2;

            const distance = Math.sqrt(
              Math.pow(petCenterX - projCenterX, 2) +
                Math.pow(petCenterY - projCenterY, 2),
            );

            if (distance < petRadius + projRadius) {
              handleHit();
              return updated.filter((p) => p.id !== proj.id);
            }
          }
        }

        return updated;
      });
    }, 16);

    return () => clearInterval(updateInterval);
  }, [isGameActive, gameResult, petPos, isInvulnerable]);

  const handleHit = () => {
    const newLives = lives - 1;
    setLives(newLives);

    if (newLives <= 0) {
      setIsGameActive(false);
      setGameResult("lost");
      onLose();
      return;
    }

    // Invulnerability period
    setIsInvulnerable(true);
    setTimeout(() => setIsInvulnerable(false), 1500);
  };

  const resetGame = () => {
    setPetPos({ x: GAME_WIDTH / 2 - PET_SIZE / 2, y: GAME_HEIGHT - 100 });
    setProjectiles([]);
    setTimeLeft(TIME_LIMIT);
    setIsGameActive(true);
    setGameResult(null);
    setLives(1);
    setIsInvulnerable(false);
    projectileIdRef.current = 0;
    lastSpawnTime.current = 0;
    gameStartTimeRef.current = null; // Reset the timer reference
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getDifficultyText = () => {
    // Progressively harder as time runs out (start at Easy, end at EXTREME)
    if (timeLeft > 24) return "Easy";
    if (timeLeft > 18) return "Medium";
    if (timeLeft > 12) return "Medium-Hard";
    if (timeLeft > 6) return "Hard";
    return "EXTREME!!!";
  };

  const getDifficultyColor = () => {
    // Color progression: Green (Easy) → Yellow → Amber → Orange → Red (EXTREME)
    if (timeLeft > 24) return "#10b981"; // Green
    if (timeLeft > 18) return "#fbbf24"; // Yellow
    if (timeLeft > 12) return "#f59e0b"; // Amber
    if (timeLeft > 6) return "#f97316"; // Orange
    return "#dc2626"; // Red
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(0, 0, 0, 0.95)",
        backdropFilter: "blur(12px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative rounded-3xl shadow-2xl p-8"
        style={{
          background:
            "linear-gradient(135deg, rgba(30, 20, 10, 0.98), rgba(20, 15, 10, 0.99))",
          border: `3px solid ${petColor}80`,
          boxShadow: `0 0 60px ${petColor}50, 0 20px 60px rgba(0, 0, 0, 0.5)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center mb-4 relative">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Zap className="w-6 h-6 text-yellow-300 animate-pulse" />
            <h2
              className="text-3xl font-serif text-amber-100"
              style={{ textShadow: "0 0 20px rgba(251, 191, 36, 0.5)" }}
            >
              Mystical Dodge
            </h2>
            <Zap className="w-6 h-6 text-yellow-300 animate-pulse" />
          </div>
          <p className="text-purple-200 text-sm italic">
            Survive for 1:20 to earn {XP_REWARD} XP!
          </p>
        </div>

        {/* Game Stats */}
        <div className="flex justify-between items-center mb-4 px-4">
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
                color:
                  timeLeft < 6
                    ? "#ef4444"
                    : timeLeft < 12
                      ? "#f97316"
                      : "#fbbf24",
                textShadow:
                  timeLeft < 6
                    ? "0 0 10px #ef4444"
                    : timeLeft < 12
                      ? "0 0 10px #f97316"
                      : "0 0 10px #fbbf24",
              }}
            >
              {formatTime(timeLeft)}
            </span>
          </div>

          <div
            className="px-4 py-2 rounded-lg font-bold text-lg"
            style={{
              background: "rgba(50, 30, 20, 0.6)",
              border: `2px solid ${getDifficultyColor()}40`,
              color: getDifficultyColor(),
              textShadow: `0 0 10px ${getDifficultyColor()}`,
            }}
          >
            {getDifficultyText()}
          </div>

          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className="w-6 h-6"
                style={{
                  color: i < lives ? "#ef4444" : "#4b5563",
                  fill: i < lives ? "#ef4444" : "none",
                  filter: i < lives ? "drop-shadow(0 0 8px #ef4444)" : "none",
                }}
              />
            ))}
          </div>

          <button
            onClick={resetGame}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{
              border: "2px solid rgba(167, 139, 250, 0.4)",
            }}
            title="Restart Game"
          >
            <RotateCcw className="w-5 h-5 text-purple-300" />
          </button>
        </div>

        {/* Timer Progress Bar - Visual Timer */}
        <div
          className="w-full h-3 rounded-full overflow-hidden mb-4 px-4"
          style={{
            background: "rgba(20, 15, 10, 0.6)",
            border: "2px solid rgba(251, 191, 36, 0.3)",
          }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: getDifficultyColor(),
              boxShadow: `0 0 15px ${getDifficultyColor()}`,
            }}
            animate={{ width: `${(timeLeft / TIME_LIMIT) * 100}%` }}
            transition={{ duration: 0.05 }}
          />
        </div>

        {/* Game Area */}
        <div
          ref={gameAreaRef}
          className="relative rounded-xl overflow-hidden mx-auto cursor-none"
          style={{
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
            background:
              "linear-gradient(180deg, rgba(10, 5, 20, 0.9), rgba(20, 10, 30, 0.95))",
            border: "3px solid rgba(139, 92, 246, 0.4)",
            boxShadow: "0 0 40px rgba(139, 92, 246, 0.3) inset",
          }}
        >
          {/* Projectiles */}
          {projectiles.map((proj) => (
            <div
              key={proj.id}
              className="absolute rounded-full"
              style={{
                left: proj.x,
                top: proj.y,
                width: proj.size,
                height: proj.size,
                background: `radial-gradient(circle, ${proj.color}, ${proj.color}dd)`,
                boxShadow: `0 0 ${proj.size}px ${proj.color}`,
                transform: "translateZ(0)",
                willChange: "transform",
                transition: "top 0.016s linear, left 0.016s linear",
              }}
            />
          ))}

          {/* Player Pet */}
          <motion.div
            className="absolute"
            style={{
              left: petPos.x,
              top: petPos.y,
              width: PET_SIZE,
              height: PET_SIZE,
              filter: isInvulnerable
                ? "drop-shadow(0 0 20px #fff)"
                : `drop-shadow(0 0 15px ${petColor})`,
              opacity: isInvulnerable ? 0.5 : 1,
            }}
            animate={
              isInvulnerable
                ? {
                    opacity: [0.3, 0.8, 0.3],
                  }
                : {}
            }
            transition={
              isInvulnerable
                ? {
                    duration: 0.2,
                    repeat: Infinity,
                  }
                : {}
            }
          >
            <img
              src={petGifPath}
              alt="Pet"
              className="h-full w-full object-contain"
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
            <div className="text-5xl text-center leading-none hidden">
              {petEmoji}
            </div>
          </motion.div>
        </div>

        {/* Instructions */}
        <div className="text-center text-purple-200/60 text-sm italic mt-4">
          Use arrow keys / WASD / mouse to move • Avoid the projectiles!
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
                background: "rgba(0, 0, 0, 0.9)",
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
                  {gameResult === "won" ? "🎉" : "💫"}
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
                  {gameResult === "won" ? "Victory!" : "Game Over!"}
                </h3>
                <p className="text-purple-200 mb-4">
                  {gameResult === "won"
                    ? "You survived the mystical storm!"
                    : "You were hit too many times!"}
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
                    onClick={resetGame}
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
      </motion.div>
    </motion.div>
  );
}
