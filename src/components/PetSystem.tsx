import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Star,
  Trophy,
  CheckCircle,
  Clock,
  FileText,
  Sparkles,
  Lock,
  Check,
  Gamepad2,
  Brain,
  Bomb,
  Zap,
} from "lucide-react";
import { MemoryGame } from "./MemoryGame";
import { MinesweeperGame } from "./MinesweeperGame";
import { BulletHellGame } from "./BulletHellGame";

interface Pet {
  id: string;
  name: string;
  emoji: string;
  gifPath: string;
  description: string;
  color: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  type: "timer" | "pages" | "custom";
  requirement: number;
  icon: any;
}

interface PetProgress {
  petId: string;
  level: number;
  xp: number;
  tasksCompleted: number;
}

interface TaskCompletion {
  taskId: string;
  completedAt: number; // timestamp
  progress: number; // current progress towards requirement
}

interface PetSystemProps {
  onClose: () => void;
}

const AVAILABLE_PETS: Pet[] = [
  {
    id: "dragon",
    name: "Green Bean Rick",
    emoji: "🐉",
    gifPath: "/src/assets/pets/magicpet.gif",
    description: "Wise bean that grows stronger with knowledge",
    color: "#ef4444",
  },
  {
    id: "phoenix",
    name: "Byte The Wizard",
    emoji: "🔥",
    gifPath: "/src/assets/pets/magicpet2.gif",
    description: "Rises from the ashes of procrastination",
    color: "#f59e0b",
  },
  {
    id: "owl",
    name: "Harry Hooter",
    emoji: "🦉",
    gifPath: "/src/assets/pets/magicpet4.gif",
    description: "Guardian of the night study sessions",
    color: "#8b5cf6",
  },
  {
    id: "cat",
    name: "Sourcerer Octocat",
    emoji: "🐱",
    gifPath: "/src/assets/pets/magicpet3.gif",
    description: "Mysterious companion of scholars",
    color: "#6366f1",
  },
];

const AVAILABLE_TASKS: Task[] = [
  {
    id: "study-10",
    title: "Study Sprint",
    description: "Study for 10 minutes",
    xpReward: 50,
    type: "timer",
    requirement: 10,
    icon: Clock,
  },
  {
    id: "study-25",
    title: "Deep Focus",
    description: "Study for 25 minutes",
    xpReward: 150,
    type: "timer",
    requirement: 25,
    icon: Clock,
  },
  {
    id: "study-60",
    title: "Scholar's Hour",
    description: "Study for 60 minutes",
    xpReward: 400,
    type: "timer",
    requirement: 60,
    icon: Clock,
  },
  {
    id: "pages-5",
    title: "Quick Notes",
    description: "Write 5 pages of notes",
    xpReward: 100,
    type: "pages",
    requirement: 5,
    icon: FileText,
  },
  {
    id: "pages-10",
    title: "Chapter Complete",
    description: "Write 10 pages of notes",
    xpReward: 250,
    type: "pages",
    requirement: 10,
    icon: FileText,
  },
  {
    id: "pages-20",
    title: "Tome of Knowledge",
    description: "Write 20 pages of notes",
    xpReward: 600,
    type: "pages",
    requirement: 20,
    icon: FileText,
  },
];

export function PetSystem({ onClose }: PetSystemProps) {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [petProgress, setPetProgress] = useState<PetProgress | null>(null);
  const [showPetSelection, setShowPetSelection] = useState(true);
  const [taskCompletions, setTaskCompletions] = useState<TaskCompletion[]>([]);
  const [showGameMenu, setShowGameMenu] = useState(false);
  const [activeGame, setActiveGame] = useState<
    "memory" | "minesweeper" | "bullethell" | null
  >(null);
  const [lastMemoryGameTime, setLastMemoryGameTime] = useState<number>(0);
  const [lastMinesweeperGameTime, setLastMinesweeperGameTime] =
    useState<number>(0);
  const [lastBulletHellGameTime, setLastBulletHellGameTime] =
    useState<number>(0);
  const [memoryGameTimeLeft, setMemoryGameTimeLeft] = useState<string>("");
  const [minesweeperGameTimeLeft, setMinesweeperGameTimeLeft] =
    useState<string>("");
  const [bulletHellGameTimeLeft, setBulletHellGameTimeLeft] =
    useState<string>("");
  const [devMode, setDevMode] = useState<boolean>(false);

  // Load pet progress from localStorage
  useEffect(() => {
    // Load current pet progress
    const saved = localStorage.getItem("petProgress");
    if (saved) {
      const progress = JSON.parse(saved);
      setPetProgress(progress);
      const pet = AVAILABLE_PETS.find((p) => p.id === progress.petId);
      if (pet) {
        setSelectedPet(pet);
        setShowPetSelection(false);
      }
    }

    const savedCompletions = localStorage.getItem("taskCompletions");
    if (savedCompletions) {
      setTaskCompletions(JSON.parse(savedCompletions));
    }

    const savedMemoryGameTime = localStorage.getItem("lastMemoryGameTime");
    if (savedMemoryGameTime) {
      setLastMemoryGameTime(parseInt(savedMemoryGameTime));
    }

    const savedMinesweeperGameTime = localStorage.getItem(
      "lastMinesweeperGameTime",
    );
    if (savedMinesweeperGameTime) {
      setLastMinesweeperGameTime(parseInt(savedMinesweeperGameTime));
    }

    const savedBulletHellGameTime = localStorage.getItem(
      "lastBulletHellGameTime",
    );
    if (savedBulletHellGameTime) {
      setLastBulletHellGameTime(parseInt(savedBulletHellGameTime));
    }

    const savedDevMode = localStorage.getItem("devMode");
    if (savedDevMode) {
      setDevMode(JSON.parse(savedDevMode));
    }
  }, []);

  // Save pet progress to localStorage (both current and all pets)
  useEffect(() => {
    if (petProgress) {
      // Save current pet progress
      localStorage.setItem("petProgress", JSON.stringify(petProgress));

      // Also save to allPetProgress for persistence when switching
      const allProgress = JSON.parse(
        localStorage.getItem("allPetProgress") || "{}",
      );
      allProgress[petProgress.petId] = petProgress;
      localStorage.setItem("allPetProgress", JSON.stringify(allProgress));
    }
  }, [petProgress]);

  // Save task completions to localStorage
  useEffect(() => {
    localStorage.setItem("taskCompletions", JSON.stringify(taskCompletions));
  }, [taskCompletions]);

  // Developer mode toggle (Ctrl+Alt+Shift+D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.shiftKey && e.key === "D") {
        e.preventDefault();
        setDevMode((prev) => {
          const newMode = !prev;
          localStorage.setItem("devMode", JSON.stringify(newMode));
          return newMode;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Update memory game cooldown timer
  useEffect(() => {
    const updateTimer = () => {
      if (lastMemoryGameTime === 0) {
        setMemoryGameTimeLeft("");
        return;
      }

      const now = Date.now();
      const oneHour = 60 * 60 * 1000;
      const timeLeft = oneHour - (now - lastMemoryGameTime);

      if (timeLeft <= 0) {
        setMemoryGameTimeLeft("");
      } else {
        const minutes = Math.floor(timeLeft / (60 * 1000));
        const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
        setMemoryGameTimeLeft(
          `${minutes}:${seconds.toString().padStart(2, "0")}`,
        );
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [lastMemoryGameTime]);

  // Update minesweeper game cooldown timer
  useEffect(() => {
    const updateTimer = () => {
      if (lastMinesweeperGameTime === 0) {
        setMinesweeperGameTimeLeft("");
        return;
      }

      const now = Date.now();
      const oneHour = 60 * 60 * 1000;
      const timeLeft = oneHour - (now - lastMinesweeperGameTime);

      if (timeLeft <= 0) {
        setMinesweeperGameTimeLeft("");
      } else {
        const minutes = Math.floor(timeLeft / (60 * 1000));
        const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
        setMinesweeperGameTimeLeft(
          `${minutes}:${seconds.toString().padStart(2, "0")}`,
        );
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [lastMinesweeperGameTime]);

  // Update bullet hell game cooldown timer
  useEffect(() => {
    const updateTimer = () => {
      if (lastBulletHellGameTime === 0) {
        setBulletHellGameTimeLeft("");
        return;
      }

      const now = Date.now();
      const oneHour = 60 * 60 * 1000;
      const timeLeft = oneHour - (now - lastBulletHellGameTime);

      if (timeLeft <= 0) {
        setBulletHellGameTimeLeft("");
      } else {
        const minutes = Math.floor(timeLeft / (60 * 1000));
        const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
        setBulletHellGameTimeLeft(
          `${minutes}:${seconds.toString().padStart(2, "0")}`,
        );
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [lastBulletHellGameTime]);

  const handleSelectPet = (pet: Pet) => {
    // Save current pet's progress before switching
    if (petProgress) {
      const allProgress = JSON.parse(
        localStorage.getItem("allPetProgress") || "{}",
      );
      allProgress[petProgress.petId] = petProgress;
      localStorage.setItem("allPetProgress", JSON.stringify(allProgress));
    }

    // Load existing progress for the new pet, or create new progress
    const allProgress = JSON.parse(
      localStorage.getItem("allPetProgress") || "{}",
    );
    const existingProgress = allProgress[pet.id];

    setSelectedPet(pet);
    if (existingProgress) {
      // Restore saved progress for this pet
      setPetProgress(existingProgress);
    } else {
      // Create new progress for first-time selection
      setPetProgress({
        petId: pet.id,
        level: 1,
        xp: 0,
        tasksCompleted: 0,
      });
    }
    setShowPetSelection(false);
  };

  const isTaskAvailable = (taskId: string): boolean => {
    const completion = taskCompletions.find((c) => c.taskId === taskId);
    if (!completion) return true;

    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return now - completion.completedAt >= twentyFourHours;
  };

  const getTaskProgress = (taskId: string, task: Task): number => {
    // Check if task was already claimed today
    const completion = taskCompletions.find((c) => c.taskId === taskId);
    if (completion && !isTaskAvailable(taskId)) {
      return task.requirement; // Show as complete if claimed
    }

    // Get current progress from daily tracking
    const dailyProgress = JSON.parse(
      localStorage.getItem("dailyTaskProgress") || "{}",
    );
    const lastReset = localStorage.getItem("dailyTaskProgressReset");
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    // Reset if it's been more than 24 hours
    if (!lastReset || now - parseInt(lastReset) >= oneDayMs) {
      localStorage.setItem(
        "dailyTaskProgress",
        JSON.stringify({ timerMinutes: 0, pagesWritten: 0 }),
      );
      localStorage.setItem("dailyTaskProgressReset", now.toString());
      return 0;
    }

    // Return actual progress based on task type
    if (task.type === "timer") {
      return Math.min(dailyProgress.timerMinutes || 0, task.requirement);
    } else if (task.type === "pages") {
      return Math.min(dailyProgress.pagesWritten || 0, task.requirement);
    }

    return 0;
  };

  const getTimeUntilReset = (taskId: string): string => {
    const completion = taskCompletions.find((c) => c.taskId === taskId);
    if (!completion) return "";

    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const timeLeft = twentyFourHours - (now - completion.completedAt);

    if (timeLeft <= 0) return "Available now!";

    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));

    return `Resets in ${hours}h ${minutes}m`;
  };

  const isMemoryGameAvailable = (): boolean => {
    if (devMode) return true; // Dev mode: always available
    if (lastMemoryGameTime === 0) return true;
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    return now - lastMemoryGameTime >= oneHour;
  };

  const isMinesweeperGameAvailable = (): boolean => {
    if (devMode) return true; // Dev mode: always available
    if (lastMinesweeperGameTime === 0) return true;
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    return now - lastMinesweeperGameTime >= oneHour;
  };

  const isBulletHellGameAvailable = (): boolean => {
    if (devMode) return true; // Dev mode: always available
    if (lastBulletHellGameTime === 0) return true;
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    return now - lastBulletHellGameTime >= oneHour;
  };

  const handleCompleteTask = (task: Task) => {
    if (!petProgress || !isTaskAvailable(task.id)) return;

    // Check if user has actually completed the task requirement
    const currentProgress = getTaskProgress(task.id, task);
    if (currentProgress < task.requirement) {
      // Task not actually completed yet
      return;
    }

    const newXp = petProgress.xp + task.xpReward;
    const xpForNextLevel = petProgress.level * 200;

    let newLevel = petProgress.level;
    let remainingXp = newXp;

    // Level up if enough XP
    while (remainingXp >= newLevel * 200) {
      remainingXp -= newLevel * 200;
      newLevel += 1;
    }

    setPetProgress({
      ...petProgress,
      xp: remainingXp,
      level: newLevel,
      tasksCompleted: petProgress.tasksCompleted + 1,
    });

    // Mark task as completed
    const newCompletions = taskCompletions.filter((c) => c.taskId !== task.id);
    newCompletions.push({
      taskId: task.id,
      completedAt: Date.now(),
      progress: task.requirement,
    });
    setTaskCompletions(newCompletions);
  };

  const handleChangePet = () => {
    setShowPetSelection(true);
  };

  const handleMemoryGameWin = (xpEarned: number) => {
    if (!petProgress) return;

    const newXp = petProgress.xp + xpEarned;
    const xpForNextLevel = petProgress.level * 200;

    let newLevel = petProgress.level;
    let remainingXp = newXp;

    // Level up if enough XP
    while (remainingXp >= newLevel * 200) {
      remainingXp -= newLevel * 200;
      newLevel += 1;
    }

    setPetProgress({
      ...petProgress,
      xp: remainingXp,
      level: newLevel,
    });

    // Set cooldown
    const now = Date.now();
    setLastMemoryGameTime(now);
    localStorage.setItem("lastMemoryGameTime", now.toString());
  };

  const handleMinesweeperGameWin = (xpEarned: number) => {
    if (!petProgress) return;

    const newXp = petProgress.xp + xpEarned;
    const xpForNextLevel = petProgress.level * 200;

    let newLevel = petProgress.level;
    let remainingXp = newXp;

    // Level up if enough XP
    while (remainingXp >= newLevel * 200) {
      remainingXp -= newLevel * 200;
      newLevel += 1;
    }

    setPetProgress({
      ...petProgress,
      xp: remainingXp,
      level: newLevel,
    });

    // Set cooldown
    const now = Date.now();
    setLastMinesweeperGameTime(now);
    localStorage.setItem("lastMinesweeperGameTime", now.toString());
  };

  const handleBulletHellGameWin = (xpEarned: number) => {
    if (!petProgress) return;

    const newXp = petProgress.xp + xpEarned;
    const xpForNextLevel = petProgress.level * 200;

    let newLevel = petProgress.level;
    let remainingXp = newXp;

    // Level up if enough XP
    while (remainingXp >= newLevel * 200) {
      remainingXp -= newLevel * 200;
      newLevel += 1;
    }

    setPetProgress({
      ...petProgress,
      xp: remainingXp,
      level: newLevel,
    });

    // Set cooldown
    const now = Date.now();
    setLastBulletHellGameTime(now);
    localStorage.setItem("lastBulletHellGameTime", now.toString());
  };

  const handleMemoryGameLose = () => {
    const now = Date.now();
    setLastMemoryGameTime(now);
    localStorage.setItem("lastMemoryGameTime", now.toString());
  };

  const handleMinesweeperGameLose = () => {
    const now = Date.now();
    setLastMinesweeperGameTime(now);
    localStorage.setItem("lastMinesweeperGameTime", now.toString());
  };

  const handleBulletHellGameLose = () => {
    const now = Date.now();
    setLastBulletHellGameTime(now);
    localStorage.setItem("lastBulletHellGameTime", now.toString());
  };

  const xpForNextLevel = petProgress ? petProgress.level * 200 : 200;
  const xpProgress = petProgress ? (petProgress.xp / xpForNextLevel) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(30, 20, 10, 0.98), rgba(20, 15, 10, 0.99))",
          border: "3px solid rgba(251, 191, 36, 0.5)",
          boxShadow:
            "0 0 60px rgba(251, 191, 36, 0.3), 0 20px 60px rgba(0, 0, 0, 0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Magical particles */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: selectedPet?.color || "#fbbf24",
                boxShadow: `0 0 10px ${selectedPet?.color || "#fbbf24"}`,
                left: `${10 + i * 6}%`,
                top: `${10 + (i % 5) * 20}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.5, 1.5, 0.5],
                y: [0, -15, 0],
              }}
              transition={{
                duration: 3,
                delay: i * 0.2,
                repeat: Infinity,
              }}
            />
          ))}
        </div>

        {/* Dev Mode Indicator */}
        {devMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 left-4 z-10 px-3 py-1 rounded-lg text-xs font-bold"
            style={{
              background: "rgba(34, 197, 94, 0.8)",
              border: "2px solid rgba(34, 197, 94, 0.6)",
              boxShadow: "0 0 15px rgba(34, 197, 94, 0.5)",
              color: "#ffffff",
            }}
          >
            DEVELOPER MODE
          </motion.div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-white/10 transition-colors"
          style={{
            background: "rgba(20, 15, 10, 0.8)",
            border: "2px solid rgba(251, 191, 36, 0.3)",
          }}
        >
          <X className="w-5 h-5 text-amber-200" />
        </button>

        {/* Header */}
        <div className="relative p-8 pb-6 text-center border-b border-amber-900/30">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
            <h2
              className="text-4xl font-serif text-amber-100"
              style={{ textShadow: "0 0 20px rgba(251, 191, 36, 0.5)" }}
            >
              Familiar Companions
            </h2>
            <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
          </div>
          <p
            className="text-purple-200 italic"
            style={{ textShadow: "0 0 10px rgba(167, 139, 250, 0.5)" }}
          >
            Choose a mystical companion to join you on your learning journey
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {showPetSelection ? (
              <motion.div
                key="pet-selection"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {AVAILABLE_PETS.map((pet) => (
                  <motion.button
                    key={pet.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectPet(pet)}
                    className="relative p-6 rounded-xl text-left transition-all"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(50, 30, 20, 0.6), rgba(40, 25, 15, 0.8))",
                      border: `2px solid ${pet.color}40`,
                      boxShadow: `0 0 20px ${pet.color}20, 0 8px 20px rgba(0, 0, 0, 0.3)`,
                    }}
                  >
                    <div className="flex justify-center mb-3">
                      <img
                        src={pet.gifPath}
                        alt={pet.name}
                        className="h-24 w-24 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          if (
                            (e.target as HTMLImageElement).nextElementSibling
                          ) {
                            (
                              (e.target as HTMLImageElement)
                                .nextElementSibling as HTMLElement
                            ).style.display = "block";
                          }
                        }}
                      />
                      <div className="text-6xl text-center hidden">
                        {pet.emoji}
                      </div>
                    </div>
                    <h3
                      className="text-xl font-serif text-amber-100 mb-2 text-center"
                      style={{ color: pet.color }}
                    >
                      {pet.name}
                    </h3>
                    <p className="text-sm text-purple-200/80 text-center">
                      {pet.description}
                    </p>
                  </motion.button>
                ))}

                {/* Coming Soon placeholder boxes */}
                {[1, 2].map((index) => (
                  <motion.div
                    key={`coming-soon-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.1 * (AVAILABLE_PETS.length + index),
                    }}
                    className="relative p-6 rounded-xl text-center flex flex-col items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(40, 30, 20, 0.4), rgba(30, 20, 15, 0.6))",
                      border: "2px dashed rgba(251, 191, 36, 0.3)",
                      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                      minHeight: "200px",
                    }}
                  >
                    <div className="flex justify-center mb-3">
                      <div
                        className="h-24 w-24 rounded-full flex items-center justify-center"
                        style={{
                          background: "rgba(251, 191, 36, 0.1)",
                          border: "2px dashed rgba(251, 191, 36, 0.3)",
                        }}
                      >
                        <Lock className="w-10 h-10 text-amber-400/50" />
                      </div>
                    </div>
                    <h3
                      className="text-xl font-serif mb-2 text-center"
                      style={{ color: "rgba(251, 191, 36, 0.6)" }}
                    >
                      Coming Soon
                    </h3>
                    <p className="text-sm text-purple-200/50 text-center">
                      New companion arriving soon...
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            ) : selectedPet && petProgress ? (
              <motion.div
                key="pet-dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Pet Info */}
                <div
                  className="mb-8 p-6 rounded-xl text-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, rgba(50, 30, 20, 0.6), rgba(40, 25, 15, 0.8))`,
                    border: `3px solid ${selectedPet.color}60`,
                    boxShadow: `0 0 30px ${selectedPet.color}30, inset 0 2px 4px rgba(255,255,255,0.1)`,
                  }}
                >
                  {/* Glow effect */}
                  <div
                    className="absolute inset-0 opacity-20 blur-2xl"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${selectedPet.color}, transparent 70%)`,
                    }}
                  />

                  <div className="relative">
                    <div className="flex justify-center mb-4">
                      <img
                        src={selectedPet.gifPath}
                        alt={selectedPet.name}
                        className="h-32 w-32 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          if (
                            (e.target as HTMLImageElement).nextElementSibling
                          ) {
                            (
                              (e.target as HTMLImageElement)
                                .nextElementSibling as HTMLElement
                            ).style.display = "block";
                          }
                        }}
                      />
                      <div className="text-8xl hidden">{selectedPet.emoji}</div>
                    </div>
                    <h3
                      className="text-3xl font-serif mb-2"
                      style={{
                        color: selectedPet.color,
                        textShadow: `0 0 15px ${selectedPet.color}`,
                      }}
                    >
                      {selectedPet.name}
                    </h3>
                    <div className="flex items-center justify-center gap-6 text-amber-100">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span className="text-xl font-bold">
                          Level {petProgress.level}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-purple-400" />
                        <span className="text-lg">
                          {petProgress.tasksCompleted} Tasks
                        </span>
                      </div>
                    </div>

                    {/* XP Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-purple-200 mb-2">
                        <span>{petProgress.xp} XP</span>
                        <span>{xpForNextLevel} XP</span>
                      </div>
                      <div
                        className="w-full h-4 rounded-full overflow-hidden"
                        style={{
                          background: "rgba(20, 15, 10, 0.6)",
                          border: "2px solid rgba(251, 191, 36, 0.3)",
                        }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${selectedPet.color}, ${selectedPet.color}dd)`,
                            boxShadow: `0 0 10px ${selectedPet.color}`,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${xpProgress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 justify-center mt-4">
                      <button
                        onClick={handleChangePet}
                        className="px-4 py-2 rounded-lg text-sm text-amber-200 hover:bg-white/10 transition-colors"
                        style={{
                          border: "1px solid rgba(251, 191, 36, 0.3)",
                        }}
                      >
                        Change Companion
                      </button>
                      <button
                        onClick={() => setShowGameMenu(true)}
                        className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                        style={{
                          background: `linear-gradient(135deg, ${selectedPet.color}60, ${selectedPet.color}40)`,
                          border: `2px solid ${selectedPet.color}`,
                          boxShadow: `0 0 15px ${selectedPet.color}40`,
                          color: "#fef3c7",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Gamepad2 className="w-4 h-4" />
                          <span>Play Games</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tasks */}
                <div>
                  <h4 className="text-2xl font-serif text-amber-100 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    Daily Tasks
                  </h4>
                  <p className="text-purple-200/70 text-sm mb-4 italic">
                    Complete tasks to earn XP and level up your companion. Each
                    task can be claimed once per day.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {AVAILABLE_TASKS.map((task) => {
                      const Icon = task.icon;
                      const available = isTaskAvailable(task.id);
                      const timeUntilReset = getTimeUntilReset(task.id);
                      const currentProgress = getTaskProgress(task.id, task);
                      const isComplete = currentProgress >= task.requirement;
                      const canClaim = available && isComplete;

                      return (
                        <motion.button
                          key={task.id}
                          whileHover={canClaim ? { scale: 1.02 } : {}}
                          whileTap={canClaim ? { scale: 0.98 } : {}}
                          onClick={() => canClaim && handleCompleteTask(task)}
                          disabled={!canClaim}
                          className="p-4 rounded-lg text-left transition-all group relative overflow-hidden"
                          style={{
                            background: canClaim
                              ? "linear-gradient(135deg, rgba(50, 30, 20, 0.4), rgba(40, 25, 15, 0.6))"
                              : "linear-gradient(135deg, rgba(30, 20, 15, 0.4), rgba(25, 18, 13, 0.6))",
                            border: canClaim
                              ? "2px solid rgba(251, 191, 36, 0.4)"
                              : "2px solid rgba(100, 100, 100, 0.2)",
                            boxShadow: canClaim
                              ? "0 4px 15px rgba(251, 191, 36, 0.3)"
                              : "0 2px 8px rgba(0, 0, 0, 0.3)",
                            opacity: canClaim ? 1 : 0.6,
                            cursor: canClaim ? "pointer" : "not-allowed",
                          }}
                        >
                          {/* Completed and claimed indicator */}
                          {!available && (
                            <div className="absolute top-2 right-2">
                              <div className="p-1 rounded-full bg-green-500/20">
                                <Check className="w-4 h-4 text-green-400" />
                              </div>
                            </div>
                          )}

                          {/* Locked indicator */}
                          {!available && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                              <div className="text-center">
                                <Lock className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                                <p className="text-xs text-gray-300">
                                  {timeUntilReset}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-start gap-3">
                            <div
                              className="p-2 rounded-lg"
                              style={{
                                background: canClaim
                                  ? `${selectedPet.color}20`
                                  : "rgba(100, 100, 100, 0.2)",
                              }}
                            >
                              <Icon
                                className="w-5 h-5"
                                style={{
                                  color: canClaim ? selectedPet.color : "#888",
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-amber-100 mb-1 group-hover:text-amber-50 transition-colors">
                                {task.title}
                              </h5>
                              <p className="text-sm text-purple-200/70 mb-2">
                                {task.description}
                              </p>

                              {/* Progress bar */}
                              {available && (
                                <div className="mb-2">
                                  <div className="flex justify-between text-xs text-purple-200/60 mb-1">
                                    <span>Progress</span>
                                    <span>
                                      {currentProgress} / {task.requirement}
                                    </span>
                                  </div>
                                  <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{
                                        width: `${(currentProgress / task.requirement) * 100}%`,
                                      }}
                                      className="h-full rounded-full"
                                      style={{
                                        background: isComplete
                                          ? "linear-gradient(90deg, #10b981, #34d399)"
                                          : `linear-gradient(90deg, ${selectedPet.color}, ${selectedPet.color}dd)`,
                                      }}
                                    />
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm font-bold text-yellow-300">
                                  +{task.xpReward} XP
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Game Selection Menu */}
      <AnimatePresence>
        {showGameMenu && selectedPet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: "rgba(0, 0, 0, 0.9)",
              backdropFilter: "blur(12px)",
            }}
            onClick={() => setShowGameMenu(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-6xl w-full rounded-3xl shadow-2xl p-8"
              style={{
                background:
                  "linear-gradient(135deg, rgba(30, 20, 10, 0.98), rgba(20, 15, 10, 0.99))",
                border: `3px solid ${selectedPet.color}80`,
                boxShadow: `0 0 60px ${selectedPet.color}50, 0 20px 60px rgba(0, 0, 0, 0.5)`,
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
                      background: selectedPet.color,
                      boxShadow: `0 0 10px ${selectedPet.color}`,
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
              <div className="text-center mb-8 relative">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                  <h2
                    className="text-3xl font-serif text-amber-100"
                    style={{ textShadow: "0 0 20px rgba(251, 191, 36, 0.5)" }}
                  >
                    Mystical Games
                  </h2>
                  <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                </div>
                <p className="text-purple-200 text-sm italic">
                  Choose a game to play with your companion
                </p>
              </div>

              {/* Games Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Memory Game */}
                <motion.button
                  onClick={() => {
                    if (isMemoryGameAvailable()) {
                      setShowGameMenu(false);
                      setActiveGame("memory");
                    }
                  }}
                  disabled={!isMemoryGameAvailable()}
                  whileHover={
                    isMemoryGameAvailable() ? { scale: 1.03, y: -5 } : {}
                  }
                  whileTap={isMemoryGameAvailable() ? { scale: 0.97 } : {}}
                  className="p-8 rounded-xl text-left transition-all relative overflow-hidden"
                  style={{
                    background: isMemoryGameAvailable()
                      ? "linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(167, 139, 250, 0.2))"
                      : "linear-gradient(135deg, rgba(60, 60, 60, 0.3), rgba(50, 50, 50, 0.4))",
                    border: isMemoryGameAvailable()
                      ? "3px solid rgba(167, 139, 250, 0.5)"
                      : "3px solid rgba(100, 100, 100, 0.3)",
                    boxShadow: isMemoryGameAvailable()
                      ? "0 0 25px rgba(167, 139, 250, 0.3)"
                      : "0 0 10px rgba(0, 0, 0, 0.3)",
                    cursor: isMemoryGameAvailable() ? "pointer" : "not-allowed",
                    opacity: isMemoryGameAvailable() ? 1 : 0.6,
                  }}
                >
                  {!isMemoryGameAvailable() && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/80">
                      <Clock className="w-3 h-3 text-white" />
                      <span className="text-xs text-white font-bold">
                        {memoryGameTimeLeft}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="p-3 rounded-lg"
                      style={{
                        background: isMemoryGameAvailable()
                          ? "rgba(167, 139, 250, 0.2)"
                          : "rgba(100, 100, 100, 0.2)",
                      }}
                    >
                      <Brain
                        className="w-8 h-8"
                        style={{
                          color: isMemoryGameAvailable() ? "#a78bfa" : "#888",
                        }}
                      />
                    </div>
                    <div>
                      <h3
                        className="text-xl font-serif mb-1"
                        style={{
                          color: isMemoryGameAvailable() ? "#a78bfa" : "#888",
                        }}
                      >
                        Memory Match
                      </h3>
                      <div className="flex items-center gap-1 text-yellow-400 text-sm">
                        <Star className="w-4 h-4" />
                        <span className="font-bold">+200 XP</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-purple-200/80 mb-3">
                    Match all card pairs within 1:20
                  </p>
                  <p className="text-xs text-purple-300/60 italic">
                    Test your memory skills
                  </p>
                </motion.button>

                {/* Minesweeper Game */}
                <motion.button
                  onClick={() => {
                    if (isMinesweeperGameAvailable()) {
                      setShowGameMenu(false);
                      setActiveGame("minesweeper");
                    }
                  }}
                  disabled={!isMinesweeperGameAvailable()}
                  whileHover={
                    isMinesweeperGameAvailable() ? { scale: 1.03, y: -5 } : {}
                  }
                  whileTap={isMinesweeperGameAvailable() ? { scale: 0.97 } : {}}
                  className="p-8 rounded-xl text-left transition-all relative overflow-hidden"
                  style={{
                    background: isMinesweeperGameAvailable()
                      ? "linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(248, 113, 113, 0.2))"
                      : "linear-gradient(135deg, rgba(60, 60, 60, 0.3), rgba(50, 50, 50, 0.4))",
                    border: isMinesweeperGameAvailable()
                      ? "3px solid rgba(239, 68, 68, 0.5)"
                      : "3px solid rgba(100, 100, 100, 0.3)",
                    boxShadow: isMinesweeperGameAvailable()
                      ? "0 0 25px rgba(239, 68, 68, 0.3)"
                      : "0 0 10px rgba(0, 0, 0, 0.3)",
                    cursor: isMinesweeperGameAvailable()
                      ? "pointer"
                      : "not-allowed",
                    opacity: isMinesweeperGameAvailable() ? 1 : 0.6,
                  }}
                >
                  {!isMinesweeperGameAvailable() && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/80">
                      <Clock className="w-3 h-3 text-white" />
                      <span className="text-xs text-white font-bold">
                        {minesweeperGameTimeLeft}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="p-3 rounded-lg"
                      style={{
                        background: isMinesweeperGameAvailable()
                          ? "rgba(239, 68, 68, 0.2)"
                          : "rgba(100, 100, 100, 0.2)",
                      }}
                    >
                      <Bomb
                        className="w-8 h-8"
                        style={{
                          color: isMinesweeperGameAvailable()
                            ? "#ef4444"
                            : "#888",
                        }}
                      />
                    </div>
                    <div>
                      <h3
                        className="text-xl font-serif mb-1"
                        style={{
                          color: isMinesweeperGameAvailable()
                            ? "#ef4444"
                            : "#888",
                        }}
                      >
                        Minesweeper
                      </h3>
                      <div className="flex items-center gap-1 text-yellow-400 text-sm">
                        <Star className="w-4 h-4" />
                        <span className="font-bold">+200 XP</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-purple-200/80 mb-3">
                    Clear all safe tiles within 1:20
                  </p>
                  <p className="text-xs text-purple-300/60 italic">
                    Test your logic and strategy
                  </p>
                </motion.button>

                {/* Bullet Hell Game */}
                <motion.button
                  onClick={() => {
                    if (isBulletHellGameAvailable()) {
                      setShowGameMenu(false);
                      setActiveGame("bullethell");
                    }
                  }}
                  disabled={!isBulletHellGameAvailable()}
                  whileHover={
                    isBulletHellGameAvailable() ? { scale: 1.03, y: -5 } : {}
                  }
                  whileTap={isBulletHellGameAvailable() ? { scale: 0.97 } : {}}
                  className="p-8 rounded-xl text-left transition-all relative overflow-hidden"
                  style={{
                    background: isBulletHellGameAvailable()
                      ? "linear-gradient(135deg, rgba(234, 179, 8, 0.3), rgba(250, 204, 21, 0.2))"
                      : "linear-gradient(135deg, rgba(60, 60, 60, 0.3), rgba(50, 50, 50, 0.4))",
                    border: isBulletHellGameAvailable()
                      ? "3px solid rgba(234, 179, 8, 0.5)"
                      : "3px solid rgba(100, 100, 100, 0.3)",
                    boxShadow: isBulletHellGameAvailable()
                      ? "0 0 25px rgba(234, 179, 8, 0.3)"
                      : "0 0 10px rgba(0, 0, 0, 0.3)",
                    cursor: isBulletHellGameAvailable()
                      ? "pointer"
                      : "not-allowed",
                    opacity: isBulletHellGameAvailable() ? 1 : 0.6,
                  }}
                >
                  {!isBulletHellGameAvailable() && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/80">
                      <Clock className="w-3 h-3 text-white" />
                      <span className="text-xs text-white font-bold">
                        {bulletHellGameTimeLeft}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="p-3 rounded-lg"
                      style={{
                        background: isBulletHellGameAvailable()
                          ? "rgba(234, 179, 8, 0.2)"
                          : "rgba(100, 100, 100, 0.2)",
                      }}
                    >
                      <Zap
                        className="w-8 h-8"
                        style={{
                          color: isBulletHellGameAvailable()
                            ? "#eab308"
                            : "#888",
                        }}
                      />
                    </div>
                    <div>
                      <h3
                        className="text-xl font-serif mb-1"
                        style={{
                          color: isBulletHellGameAvailable()
                            ? "#eab308"
                            : "#888",
                        }}
                      >
                        Mystical Dodge
                      </h3>
                      <div className="flex items-center gap-1 text-yellow-400 text-sm">
                        <Star className="w-4 h-4" />
                        <span className="font-bold">+200 XP</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-purple-200/80 mb-3">
                    Survive the projectile storm for 1:20
                  </p>
                  <p className="text-xs text-purple-300/60 italic">
                    Test your reflexes and agility
                  </p>
                </motion.button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowGameMenu(false)}
                className="w-full px-6 py-3 rounded-lg font-serif text-lg transition-all hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(50, 30, 20, 0.6), rgba(40, 25, 15, 0.8))",
                  border: "2px solid rgba(251, 191, 36, 0.4)",
                  boxShadow: "0 0 20px rgba(251, 191, 36, 0.3)",
                }}
              >
                <span className="text-amber-100">Close</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Modals */}
      <AnimatePresence>
        {activeGame === "memory" && selectedPet && (
          <MemoryGame
            petColor={selectedPet.color}
            petEmoji={selectedPet.emoji}
            petGifPath={selectedPet.gifPath}
            onWin={handleMemoryGameWin}
            onLose={handleMemoryGameLose}
            onClose={() => setActiveGame(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeGame === "minesweeper" && selectedPet && (
          <MinesweeperGame
            petColor={selectedPet.color}
            petEmoji={selectedPet.emoji}
            petGifPath={selectedPet.gifPath}
            onWin={handleMinesweeperGameWin}
            onLose={handleMinesweeperGameLose}
            onClose={() => setActiveGame(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeGame === "bullethell" && selectedPet && (
          <BulletHellGame
            petColor={selectedPet.color}
            petEmoji={selectedPet.emoji}
            petGifPath={selectedPet.gifPath}
            onWin={handleBulletHellGameWin}
            onLose={handleBulletHellGameLose}
            onClose={() => setActiveGame(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
