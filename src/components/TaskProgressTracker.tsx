import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Clock, FileText, Star, CheckCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  type: 'timer' | 'pages' | 'custom';
  requirement: number;
  icon: any;
}

interface TaskProgress {
  taskId: string;
  progress: number;
  requirement: number;
}

interface TaskProgressTrackerProps {
  accentColor: string;
  pageCount: number;
  timerMinutes: number;
}

const AVAILABLE_TASKS: Task[] = [
  {
    id: 'study-10',
    title: 'Study Sprint',
    description: 'Study for 10 minutes',
    xpReward: 50,
    type: 'timer',
    requirement: 10,
    icon: Clock,
  },
  {
    id: 'study-25',
    title: 'Deep Focus',
    description: 'Study for 25 minutes',
    xpReward: 150,
    type: 'timer',
    requirement: 25,
    icon: Clock,
  },
  {
    id: 'study-60',
    title: 'Scholar\'s Hour',
    description: 'Study for 60 minutes',
    xpReward: 400,
    type: 'timer',
    requirement: 60,
    icon: Clock,
  },
  {
    id: 'pages-5',
    title: 'Quick Notes',
    description: 'Write 5 pages of notes',
    xpReward: 100,
    type: 'pages',
    requirement: 5,
    icon: FileText,
  },
  {
    id: 'pages-10',
    title: 'Chapter Complete',
    description: 'Write 10 pages of notes',
    xpReward: 250,
    type: 'pages',
    requirement: 10,
    icon: FileText,
  },
  {
    id: 'pages-20',
    title: 'Tome of Knowledge',
    description: 'Write 20 pages of notes',
    xpReward: 600,
    type: 'pages',
    requirement: 20,
    icon: FileText,
  },
];

export function TaskProgressTracker({ accentColor, pageCount, timerMinutes }: TaskProgressTrackerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [taskProgress, setTaskProgress] = useState<TaskProgress[]>([]);

  useEffect(() => {
    // Calculate progress for all tasks
    const progress: TaskProgress[] = AVAILABLE_TASKS.map(task => {
      let currentProgress = 0;
      
      if (task.type === 'timer') {
        currentProgress = Math.min(timerMinutes, task.requirement);
      } else if (task.type === 'pages') {
        currentProgress = Math.min(pageCount, task.requirement);
      }
      
      return {
        taskId: task.id,
        progress: currentProgress,
        requirement: task.requirement,
      };
    });
    
    setTaskProgress(progress);
  }, [pageCount, timerMinutes]);

  const getTaskCompletions = () => {
    const saved = localStorage.getItem('taskCompletions');
    if (!saved) return [];
    return JSON.parse(saved);
  };

  const isTaskAvailable = (taskId: string): boolean => {
    const completions = getTaskCompletions();
    const completion = completions.find((c: any) => c.taskId === taskId);
    if (!completion) return true;

    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return now - completion.completedAt >= twentyFourHours;
  };

  const activeTasks = AVAILABLE_TASKS.filter(task => {
    const progress = taskProgress.find(p => p.taskId === task.id);
    if (!progress) return false;
    
    const available = isTaskAvailable(task.id);
    return available && progress.progress > 0 && progress.progress < progress.requirement;
  });

  const completedTasks = AVAILABLE_TASKS.filter(task => {
    const progress = taskProgress.find(p => p.taskId === task.id);
    if (!progress) return false;
    
    const available = isTaskAvailable(task.id);
    return available && progress.progress >= progress.requirement;
  });

  if (activeTasks.length === 0 && completedTasks.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-40 w-80"
    >
      <div
        className="rounded-xl shadow-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 20, 10, 0.95), rgba(20, 15, 10, 0.98))',
          border: `2px solid ${accentColor}60`,
          boxShadow: `0 0 30px ${accentColor}30, 0 10px 40px rgba(0, 0, 0, 0.5)`,
        }}
      >
        {/* Header */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5" style={{ color: accentColor }} />
            <span className="font-serif text-amber-100 font-semibold">Task Progress</span>
          </div>
          <motion.div
            animate={{ rotate: isCollapsed ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-amber-200" />
          </motion.div>
        </button>

        {/* Tasks List */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 space-y-3 max-h-96 overflow-y-auto">
                {/* Active Tasks */}
                {activeTasks.map(task => {
                  const progress = taskProgress.find(p => p.taskId === task.id);
                  if (!progress) return null;
                  
                  const Icon = task.icon;
                  const percentage = (progress.progress / progress.requirement) * 100;
                  
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 rounded-lg"
                      style={{
                        background: 'rgba(50, 30, 20, 0.4)',
                        border: `1px solid ${accentColor}30`,
                      }}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <Icon className="w-4 h-4 mt-0.5" style={{ color: accentColor }} />
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-amber-100">{task.title}</h4>
                          <p className="text-xs text-purple-200/70">{task.description}</p>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-purple-200/80">
                          <span>{progress.progress} / {progress.requirement} {task.type === 'timer' ? 'min' : 'pages'}</span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400" />
                            +{task.xpReward} XP
                          </span>
                        </div>
                        <div
                          className="w-full h-2 rounded-full overflow-hidden"
                          style={{
                            background: 'rgba(20, 15, 10, 0.6)',
                            border: `1px solid ${accentColor}40`,
                          }}
                        >
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${accentColor}, ${accentColor}dd)`,
                              boxShadow: `0 0 8px ${accentColor}80`,
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Completed Tasks */}
                {completedTasks.map(task => {
                  const Icon = task.icon;
                  
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 rounded-lg"
                      style={{
                        background: 'rgba(34, 197, 94, 0.15)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-green-100">{task.title}</h4>
                          <p className="text-xs text-green-200/70">Completed! Claim in Pet System</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-yellow-300">
                          <Star className="w-3 h-3" />
                          +{task.xpReward}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {activeTasks.length === 0 && completedTasks.length > 0 && (
                  <p className="text-xs text-center text-purple-200/60 italic mt-2">
                    Open Pet System to claim your rewards!
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
