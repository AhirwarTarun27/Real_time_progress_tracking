import React, { useMemo } from 'react';
import type { Task, DailyLog } from '../types';

interface InsightsProps {
  tasks: Task[];
  completionScore: number;
  dailyLogs: DailyLog[];
}

const Insights: React.FC<InsightsProps> = ({
  tasks,
  completionScore,
  dailyLogs,
}) => {
  const insights = useMemo(() => {
    const incompleteTasks = tasks.filter(
      (t) => t.currentValue / t.targetValue < 1
    );
    const completedTasks = tasks.filter(
      (t) => t.currentValue / t.targetValue >= 1
    );
    const totalProgress = tasks.reduce((sum, t) => sum + t.currentValue, 0);
    const totalTarget = tasks.reduce((sum, t) => sum + t.targetValue, 0);

    let currentStreak = 0;
    const sortedLogs = [...dailyLogs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (const log of sortedLogs) {
      if (log.completionScore >= 80) {
        currentStreak++;
      } else {
        break;
      }
    }

    const avgScore =
      dailyLogs.length > 0
        ? dailyLogs.reduce((sum, log) => sum + log.completionScore, 0) /
          dailyLogs.length
        : 0;

    let message = '';
    let emoji = '';
    if (completionScore >= 90) {
      message = "Exceptional! You're crushing it today!";
      emoji = '🔥';
    } else if (completionScore >= 70) {
      message = 'Great momentum! Keep pushing forward!';
      emoji = '💪';
    } else if (completionScore >= 50) {
      message = "You're halfway there! Don't stop now!";
      emoji = '⚡';
    } else if (completionScore >= 25) {
      message = 'Good start! Time to accelerate!';
      emoji = '🚀';
    } else {
      message = 'Every journey begins with a single step!';
      emoji = '🌟';
    }

    return {
      incompleteTasks: incompleteTasks.length,
      completedTasks: completedTasks.length,
      totalProgress,
      totalTarget,
      currentStreak,
      avgScore,
      message,
      emoji,
    };
  }, [tasks, completionScore, dailyLogs]);

  return (
    <div className="insights">
      <div className="insight-card insight-card--highlight">
        <div className="insight-card__icon">{insights.emoji}</div>
        <div className="insight-card__content">
          <div className="insight-card__label">Daily Motivation</div>
          <div className="insight-card__value">{insights.message}</div>
        </div>
      </div>

      <div className="insight-card">
        <div className="insight-card__icon">✅</div>
        <div className="insight-card__content">
          <div className="insight-card__label">Tasks Completed</div>
          <div className="insight-card__value">
            {insights.completedTasks} / {tasks.length}
          </div>
        </div>
      </div>

      <div className="insight-card">
        <div className="insight-card__icon">📊</div>
        <div className="insight-card__content">
          <div className="insight-card__label">Total Progress</div>
          <div className="insight-card__value">
            {insights.totalProgress.toFixed(1)} /{' '}
            {insights.totalTarget.toFixed(1)}
          </div>
        </div>
      </div>

      <div className="insight-card">
        <div className="insight-card__icon">🔥</div>
        <div className="insight-card__content">
          <div className="insight-card__label">Current Streak</div>
          <div className="insight-card__value">
            {insights.currentStreak}{' '}
            {insights.currentStreak === 1 ? 'day' : 'days'}
          </div>
        </div>
      </div>

      <div className="insight-card">
        <div className="insight-card__icon">📈</div>
        <div className="insight-card__content">
          <div className="insight-card__label">7-Day Average</div>
          <div className="insight-card__value">
            {insights.avgScore.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="insight-card">
        <div className="insight-card__icon">⏰</div>
        <div className="insight-card__content">
          <div className="insight-card__label">Incomplete Tasks</div>
          <div className="insight-card__value">
            {insights.incompleteTasks} remaining
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
