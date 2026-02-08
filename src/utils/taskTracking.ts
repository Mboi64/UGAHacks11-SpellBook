// Utility functions for tracking daily task progress

export function addTimerMinutes(minutes: number): void {
  const progress = getDailyProgress();
  progress.timerMinutes = (progress.timerMinutes || 0) + minutes;
  saveDailyProgress(progress);
}

export function addPageWritten(): void {
  const progress = getDailyProgress();
  progress.pagesWritten = (progress.pagesWritten || 0) + 1;
  saveDailyProgress(progress);
}

export function getDailyProgress(): { timerMinutes: number; pagesWritten: number } {
  const stored = localStorage.getItem('dailyTaskProgress');
  const lastReset = localStorage.getItem('dailyTaskProgressReset');
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  // Reset if it's been more than 24 hours
  if (!lastReset || now - parseInt(lastReset) >= oneDayMs) {
    const freshProgress = { timerMinutes: 0, pagesWritten: 0 };
    saveDailyProgress(freshProgress);
    localStorage.setItem('dailyTaskProgressReset', now.toString());
    return freshProgress;
  }

  return stored ? JSON.parse(stored) : { timerMinutes: 0, pagesWritten: 0 };
}

function saveDailyProgress(progress: { timerMinutes: number; pagesWritten: number }): void {
  localStorage.setItem('dailyTaskProgress', JSON.stringify(progress));
}
