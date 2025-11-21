export interface Task {
  id: string;
  name: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  createdAt: Date;
}

export interface DailyLog {
  date: string;
  tasks: Task[];
  completionScore: number;
  timestamp?: unknown;
}

export interface UserData {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  tasks: Task[];
}
