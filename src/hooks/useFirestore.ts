import { useState, useEffect, useCallback } from 'react';
import { db } from '../lib/firebase';
import {
  doc,
  setDoc,
  onSnapshot,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import type { User } from 'firebase/auth';
import type { Task, DailyLog, UserData } from '../types';
import { Timestamp } from 'firebase/firestore';

export const useFirestore = (user: User | null) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);

  useEffect(() => {
    if (!user) {
      setTimeout(() => {
        setTasks([]);
        setDailyLogs([]);
        setLoading(false);
      }, 0);
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as UserData;
        setTasks(data.tasks || []);
      }
      setLoading(false);
    });

    const fetchLogs = async () => {
      try {
        const logsRef = collection(db, 'users', user.uid, 'dailyLogs');
        const q = query(logsRef, orderBy('timestamp', 'desc'), limit(7));
        const snapshot = await getDocs(q);
        const logs = snapshot.docs.map((d) => d.data() as DailyLog);
        setDailyLogs(logs);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    fetchLogs();

    return () => unsubscribe();
  }, [user]);

  const saveTasks = useCallback(
    async (updatedTasks: Task[]) => {
      if (!user) return;
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(
        userDocRef,
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          tasks: updatedTasks,
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );
    },
    [user]
  );

  const saveDailyLog = useCallback(
    async (completionScore: number, userRef?: User | null) => {
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      const logDocRef = doc(db, 'users', user.uid, 'dailyLogs', today);

      await setDoc(logDocRef, {
        date: today,
        tasks: tasks,
        completionScore: completionScore,
        timestamp: Timestamp.now(),
      });

      try {
        const logsRef = collection(db, 'users', user.uid, 'dailyLogs');
        const q = query(logsRef, orderBy('timestamp', 'desc'), limit(7));
        const snapshot = await getDocs(q);
        const logs = snapshot.docs.map((d) => d.data() as DailyLog);
        setDailyLogs(logs);
      } catch (error) {
        console.error('Error refreshing logs:', error);
      }
    },
    [user, tasks]
  );

  return { tasks, loading, saveTasks, saveDailyLog, dailyLogs };
};

export default useFirestore;
