import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock,
  Star,
  RotateCcw,
  Sparkles,
  Flag,
  Bomb,
  Heart,
} from "lucide-react";

interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

interface MinesweeperGameProps {
  petColor: string;
  petEmoji: string;
  petGifPath: string;
  onWin: (xpEarned: number) => void;
  onLose: () => void;
  onClose: () => void;
}

const GRID_SIZE = 8;
const MINE_COUNT = 10;
const TIME_LIMIT = 45; // 45 seconds
const XP_REWARD = 200;
const MAX_LIVES = 3;

export function MinesweeperGame({
  petColor,
  petEmoji,
  petGifPath,
  onWin,
  onLose,
  onClose,
}: MinesweeperGameProps) {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isGameActive, setIsGameActive] = useState(true);
  const [gameResult, setGameResult] = useState<"won" | "lost" | null>(null);
  const [flagsLeft, setFlagsLeft] = useState(MINE_COUNT);
  const [revealedCount, setRevealedCount] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [isFirstClick, setIsFirstClick] = useState(true);

  // Initialize game
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
          revealAllMines();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameActive, gameResult]);

  // Check for win condition
  useEffect(() => {
    if (grid.length === 0) return;

    const totalCells = GRID_SIZE * GRID_SIZE;
    const safeCells = totalCells - MINE_COUNT;

    if (revealedCount === safeCells && isGameActive) {
      setIsGameActive(false);
      setGameResult("won");
      onWin(XP_REWARD);
    }
  }, [revealedCount, isGameActive, grid, onWin]);

  const initializeGame = () => {
    // Create empty grid
    const newGrid: Cell[][] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      newGrid[row] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        newGrid[row][col] = {
          row,
          col,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        };
      }
    }

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < MINE_COUNT) {
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);

      if (!newGrid[row][col].isMine) {
        newGrid[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor mine counts
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!newGrid[row][col].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const newRow = row + dr;
              const newCol = col + dc;
              if (
                newRow >= 0 &&
                newRow < GRID_SIZE &&
                newCol >= 0 &&
                newCol < GRID_SIZE &&
                newGrid[newRow][newCol].isMine
              ) {
                count++;
              }
            }
          }
          newGrid[row][col].neighborMines = count;
        }
      }
    }

    setGrid(newGrid);
    setTimeLeft(TIME_LIMIT);
    setIsGameActive(true);
    setGameResult(null);
    setFlagsLeft(MINE_COUNT);
    setRevealedCount(0);
    setLives(MAX_LIVES);
    setIsFirstClick(true);
  };

  const revealAllMines = () => {
    setGrid((prev) =>
      prev.map((row) =>
        row.map((cell) => (cell.isMine ? { ...cell, isRevealed: true } : cell)),
      ),
    );
  };

  const revealCell = (row: number, col: number) => {
    if (!isGameActive || gameResult) return;

    const cell = grid[row][col];
    if (cell.isRevealed || cell.isFlagged) return;

    // First click - ensure it triggers a big cascade by clearing a 3x3 area around the click
    if (isFirstClick) {
      setIsFirstClick(false);

      const newGrid = [...grid];
      const minesToMove: { row: number; col: number }[] = [];

      // Clear the clicked cell and all neighbors from mines
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const r = row + dr;
          const c = col + dc;
          if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
            if (newGrid[r][c].isMine) {
              minesToMove.push({ row: r, col: c });
              newGrid[r][c].isMine = false;
            }
          }
        }
      }

      // Relocate the mines to other positions
      for (const mine of minesToMove) {
        let mineRelocated = false;
        while (!mineRelocated) {
          const newRow = Math.floor(Math.random() * GRID_SIZE);
          const newCol = Math.floor(Math.random() * GRID_SIZE);

          // Check if this position is not in the cleared area
          const isInClearedArea =
            Math.abs(newRow - row) <= 1 && Math.abs(newCol - col) <= 1;

          if (!newGrid[newRow][newCol].isMine && !isInClearedArea) {
            newGrid[newRow][newCol].isMine = true;
            mineRelocated = true;
          }
        }
      }

      // Recalculate ALL neighbor counts
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (!newGrid[r][c].isMine) {
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                const newRow = r + dr;
                const newCol = c + dc;
                if (
                  newRow >= 0 &&
                  newRow < GRID_SIZE &&
                  newCol >= 0 &&
                  newCol < GRID_SIZE &&
                  newGrid[newRow][newCol].isMine
                ) {
                  count++;
                }
              }
            }
            newGrid[r][c].neighborMines = count;
          }
        }
      }

      setGrid(newGrid);
      // Now reveal the safe cell with the updated grid
      setTimeout(() => revealCell(row, col), 0);
      return;
    }

    // Hit a mine - lose a life or game over
    if (cell.isMine) {
      const newLives = lives - 1;
      setLives(newLives);

      // Show the mine that was hit
      const newGrid = [...grid];
      newGrid[row][col].isRevealed = true;
      setGrid(newGrid);

      if (newLives <= 0) {
        setIsGameActive(false);
        setGameResult("lost");
        onLose();
        revealAllMines();
      }
      return;
    }

    // Reveal cell and flood fill if empty
    const newGrid = [...grid];
    const toReveal: [number, number][] = [[row, col]];
    let newRevealedCount = revealedCount;

    while (toReveal.length > 0) {
      const [r, c] = toReveal.pop()!;

      if (
        r < 0 ||
        r >= GRID_SIZE ||
        c < 0 ||
        c >= GRID_SIZE ||
        newGrid[r][c].isRevealed ||
        newGrid[r][c].isFlagged ||
        newGrid[r][c].isMine
      ) {
        continue;
      }

      newGrid[r][c].isRevealed = true;
      newRevealedCount++;

      // If no neighboring mines, reveal neighbors
      if (newGrid[r][c].neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr !== 0 || dc !== 0) {
              toReveal.push([r + dr, c + dc]);
            }
          }
        }
      }
    }

    setGrid(newGrid);
    setRevealedCount(newRevealedCount);
  };

  const toggleFlag = (row: number, col: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (!isGameActive || gameResult) return;

    const cell = grid[row][col];
    if (cell.isRevealed) return;

    const newGrid = [...grid];

    if (cell.isFlagged) {
      newGrid[row][col].isFlagged = false;
      setFlagsLeft(flagsLeft + 1);
    } else if (flagsLeft > 0) {
      newGrid[row][col].isFlagged = true;
      setFlagsLeft(flagsLeft - 1);
    }

    setGrid(newGrid);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getCellColor = (cell: Cell) => {
    if (!cell.isRevealed) return null;
    if (cell.isMine) return "#ef4444";

    const colors = [
      "#60a5fa", // 1
      "#34d399", // 2
      "#fbbf24", // 3
      "#f59e0b", // 4
      "#f97316", // 5
      "#ef4444", // 6
      "#ec4899", // 7
      "#8b5cf6", // 8
    ];

    return cell.neighborMines > 0 ? colors[cell.neighborMines - 1] : null;
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
              Mystical Minesweeper
            </h2>
            <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
          </div>
          <p className="text-purple-200 text-sm italic">
            Clear all safe tiles within 45 seconds to earn {XP_REWARD} XP!
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
                color: timeLeft < 15 ? "#ef4444" : "#fbbf24",
                textShadow:
                  timeLeft < 15 ? "0 0 10px #ef4444" : "0 0 10px #fbbf24",
              }}
            >
              {formatTime(timeLeft)}
            </span>
          </div>

          <div
            className="flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{
              background: "rgba(50, 30, 20, 0.6)",
              border: "2px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            <Flag className="w-5 h-5 text-red-400" />
            <span className="text-xl font-bold text-red-300">{flagsLeft}</span>
          </div>

          <div
            className="flex items-center gap-1 px-4 py-2 rounded-lg"
            style={{
              background: "rgba(50, 30, 20, 0.6)",
              border: "2px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            {[...Array(MAX_LIVES)].map((_, i) => (
              <Heart
                key={i}
                className="w-5 h-5"
                style={{
                  color: i < lives ? "#ef4444" : "#6b7280",
                  fill: i < lives ? "#ef4444" : "none",
                }}
              />
            ))}
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
        <div
          className="grid gap-1 mb-6 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            maxWidth: "400px",
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => revealCell(rowIndex, colIndex)}
                onContextMenu={(e) => toggleFlag(rowIndex, colIndex, e)}
                className="aspect-square rounded-md relative overflow-hidden text-lg font-bold flex items-center justify-center"
                style={{
                  background: cell.isRevealed
                    ? "linear-gradient(135deg, rgba(50, 30, 20, 0.4), rgba(40, 25, 15, 0.5))"
                    : "linear-gradient(135deg, rgba(80, 60, 40, 0.8), rgba(70, 50, 30, 0.9))",
                  border: cell.isRevealed
                    ? "2px solid rgba(100, 80, 60, 0.3)"
                    : "2px solid rgba(251, 191, 36, 0.4)",
                  boxShadow: cell.isRevealed
                    ? "inset 0 2px 4px rgba(0, 0, 0, 0.3)"
                    : "0 2px 6px rgba(0, 0, 0, 0.2)",
                  cursor:
                    cell.isRevealed || !isGameActive ? "default" : "pointer",
                  color: getCellColor(cell) || "#fff",
                }}
                whileHover={
                  !cell.isRevealed && isGameActive && !cell.isFlagged
                    ? { scale: 1.05 }
                    : {}
                }
                whileTap={
                  !cell.isRevealed && isGameActive && !cell.isFlagged
                    ? { scale: 0.95 }
                    : {}
                }
                disabled={
                  cell.isRevealed || !isGameActive || gameResult !== null
                }
              >
                {cell.isFlagged ? (
                  <Flag className="w-4 h-4 text-red-400" />
                ) : cell.isRevealed ? (
                  cell.isMine ? (
                    <Bomb className="w-5 h-5 text-red-500" />
                  ) : cell.neighborMines > 0 ? (
                    cell.neighborMines
                  ) : null
                ) : null}
              </motion.button>
            )),
          )}
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
                  {gameResult === "won" ? "🎉" : "💥"}
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
                    ? "You cleared all the mines!"
                    : "You ran out of lives!"}
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
          Left click to reveal • Right click to flag mines
        </div>
      </motion.div>
    </motion.div>
  );
}
