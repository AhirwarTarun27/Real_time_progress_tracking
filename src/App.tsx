// ============================================
// App.tsx - Main Application Component
// ============================================

import React, { useState, useEffect, useMemo } from 'react';
import './styles/main.scss';
import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from './lib/firebase';
import type { User } from 'firebase/auth';
import { useFirestore } from './hooks/useFirestore';
import ProgressCircle from './components/ProgressCircle';
import TaskCard from './components/TaskCard';
import Insights from './components/Insights';
import type { Task } from './types';

// ============================================
// TypeScript Interfaces
// ============================================

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    targetValue: '',
    unit: '',
  });

  const { tasks, loading, saveTasks, saveDailyLog, dailyLogs } =
    useFirestore(user);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  const completionScore = useMemo(() => {
    if (tasks.length === 0) return 0;
    const totalScore = tasks.reduce(
      (sum, task) => sum + Math.min(task.currentValue / task.targetValue, 1),
      0
    );
    return (totalScore / tasks.length) * 100;
  }, [tasks]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.name || !newTask.targetValue || !newTask.unit) return;

    const task: Task = {
      id: Date.now().toString(),
      name: newTask.name,
      targetValue: parseFloat(newTask.targetValue),
      currentValue: 0,
      unit: newTask.unit,
      createdAt: new Date(),
    };

    await saveTasks([...tasks, task]);
    setNewTask({ name: '', targetValue: '', unit: '' });
    setShowAddTask(false);
  };

  const handleUpdateTask = async (id: string, value: number) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, currentValue: value } : task
    );
    await saveTasks(updatedTasks);
  };

  const handleDeleteTask = async (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    await saveTasks(updatedTasks);
  };

  const handleEndDay = async () => {
    await saveDailyLog(completionScore);
    const resetTasks = tasks.map((task) => ({ ...task, currentValue: 0 }));
    await saveTasks(resetTasks);
  };

  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-screen__spinner">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-screen">
        <div className="auth-screen__container">
          <h1 className="auth-screen__title">Completion Drive</h1>
          <p className="auth-screen__subtitle">Harness the Zeigarnik Effect</p>
          <button onClick={handleGoogleSignIn} className="auth-screen__btn">
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__header-content">
          <h1 className="app__title">Completion Drive</h1>
          <button onClick={handleSignOut} className="app__sign-out-btn">
            Sign Out
          </button>
        </div>
      </header>

      <main className="app__main">
        <section className="dashboard">
          <div className="dashboard__left">
            <div className="consistency-meter">
              <ProgressCircle percentage={completionScore} size={200} />
              <h2 className="consistency-meter__label">Daily Consistency</h2>
            </div>
          </div>

          <div className="dashboard__right">
            <h2 className="dashboard__insights-title">📊 Today's Insights</h2>
            <Insights
              tasks={tasks}
              completionScore={completionScore}
              dailyLogs={dailyLogs}
            />
          </div>
        </section>

        <section className="tasks">
          <div className="tasks__header">
            <h2 className="tasks__title">Today's Tasks</h2>
            <button
              onClick={() => setShowAddTask(!showAddTask)}
              className="tasks__add-btn"
              aria-label={
                showAddTask ? 'Close add task form' : 'Open add task form'
              }
            >
              {showAddTask ? '−' : '+'}
            </button>
          </div>

          {showAddTask && (
            <div className="add-task-form">
              <input
                type="text"
                placeholder="Task name"
                value={newTask.name}
                onChange={(e) =>
                  setNewTask({ ...newTask, name: e.target.value })
                }
                className="add-task-form__input"
              />
              <div className="add-task-form__row">
                <input
                  type="number"
                  placeholder="Target"
                  value={newTask.targetValue}
                  onChange={(e) =>
                    setNewTask({ ...newTask, targetValue: e.target.value })
                  }
                  className="add-task-form__input add-task-form__input--small"
                  min="0"
                  step="0.1"
                />
                <input
                  type="text"
                  placeholder="Unit (e.g., pages)"
                  value={newTask.unit}
                  onChange={(e) =>
                    setNewTask({ ...newTask, unit: e.target.value })
                  }
                  className="add-task-form__input add-task-form__input--small"
                />
              </div>
              <button onClick={handleAddTask} className="add-task-form__submit">
                Add Task
              </button>
            </div>
          )}

          {loading ? (
            <div className="tasks__loading">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="tasks__empty">
              <p>No tasks yet. Create your first task to start tracking!</p>
            </div>
          ) : (
            <div className="tasks__grid">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </section>

        {tasks.length > 0 && (
          <button onClick={handleEndDay} className="app__end-day-btn">
            Complete Day & Reset
          </button>
        )}
      </main>
    </div>
  );
};

export default App;
