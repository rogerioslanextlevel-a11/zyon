export type CEFRLevel = 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface UserProfile {
  id: string;
  name: string;
  level: CEFRLevel;
  xp: number;
  crystalXP: number;
  objectives: string[];
  dailyTime: number;
  streak: number;
  medals: Medal[];
  completedTopics: string[];
  currentPlan?: StudyPlan;
}

export interface Medal {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'crystal';
  unlockedAt: Date;
}

export interface StudyPlan {
  level: CEFRLevel;
  duration: number; // weeks
  topics: StudyTopic[];
  createdAt: Date;
}

export interface StudyTopic {
  id: string;
  title: string;
  description: string;
  level: CEFRLevel;
  completed: boolean;
  xpReward: number;
  estimatedTime: number; // minutes
}

export interface Lesson {
  id: string;
  title: string;
  story: string;
  explanation: string;
  exercises: Exercise[];
  mission: Mission;
  level: CEFRLevel;
}

export interface Exercise {
  id: string;
  type: 'complete' | 'order' | 'transform' | 'choice';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  prompt: string;
  xpReward: number;
}

export interface RolePlayScenario {
  id: string;
  title: string;
  description: string;
  level: CEFRLevel;
  context: string;
  objectives: string[];
  medal?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'zion';
  content: string;
  timestamp: Date;
  language?: 'pt' | 'en' | 'mixed';
}

export interface Checkpoint {
  id: string;
  name: string;
  level: CEFRLevel;
  progress: string;
  createdAt: Date;
  data: any;
}

// Interfaces para o Sistema de Timer e Notificações
export interface StudySession {
  id: string;
  start_at: Date;
  end_at: Date;
  duration_minutes: number;
  was_manual: boolean;
  device: string;
}

export interface DailyProgress {
  date_local: string;
  minutes_done: number;
  goal_minutes: number;
  reached_80: boolean;
  reached_100: boolean;
}

export interface StudySettings {
  daily_goal_minutes: number;
  preferred_times: string[];
  preferred_days: number[];
  quiet_hours_start: string;
  quiet_hours_end: string;
  notifications_enabled: boolean;
  sound_enabled: boolean;
  vibration_enabled: boolean;
}

export interface NotificationLog {
  id: string;
  type: string;
  scheduled_for: Date;
  delivered_at: Date;
  action_taken: string | null;
  canceled: boolean;
}

export interface HabitData {
  id: string;
  name: string;
  description: string;
  category: 'study' | 'practice' | 'review' | 'speaking';
  target_minutes: number;
  current_streak: number;
  longest_streak: number;
  completed_today: boolean;
  last_completed: Date | null;
  created_at: Date;
  is_active: boolean;
}

export interface WeeklyStats {
  week_start: string;
  total_minutes: number;
  goal_minutes: number;
  days_completed: number;
  average_session_length: number;
  longest_session: number;
  habits_completed: number;
  xp_earned: number;
}