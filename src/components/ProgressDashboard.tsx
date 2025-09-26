// Painel de Progresso e Estatísticas
'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Award, Target, Flame, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DailyProgress, StudySession, WeeklySummary } from '@/lib/types';

interface ProgressDashboardProps {
  className?: string;
}

export default function ProgressDashboard({ className }: ProgressDashboardProps) {
  const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(null);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklySummary | null>(null);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [weeklyHistory, setWeeklyHistory] = useState<number[]>([]);
  const [totalStudyTime, setTotalStudyTime] = useState(0);

  // Carregar dados
  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = () => {
    // Progresso diário
    const savedProgress = localStorage.getItem('daily_progress');
    if (savedProgress) {
      setDailyProgress(JSON.parse(savedProgress));
    }

    // Streak
    const savedStreak = localStorage.getItem('streak_data');
    if (savedStreak) {
      const streakData = JSON.parse(savedStreak);
      setStreak(streakData.current || 0);
      setLongestStreak(streakData.longest || 0);
    }

    // Histórico semanal (últimos 7 dias)
    const history = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayProgress = localStorage.getItem(`daily_progress_${dateStr}`);
      if (dayProgress) {
        const progress = JSON.parse(dayProgress);
        history.push(progress.minutes_done || 0);
      } else {
        history.push(0);
      }
    }
    
    setWeeklyHistory(history);

    // Progresso semanal
    const weeklyMinutes = history.reduce((sum, minutes) => sum + minutes, 0);
    const settings = JSON.parse(localStorage.getItem('study_settings') || '{}');
    const weeklyGoal = (settings.daily_goal_minutes || 20) * (settings.preferred_days?.length || 5);
    
    setWeeklyProgress({
      week_start_date: getWeekStart(today).toISOString().split('T')[0],
      minutes_done: weeklyMinutes,
      weekly_goal_minutes: weeklyGoal,
      streak_after_week: streak
    });

    // Tempo total de estudo
    const sessions = JSON.parse(localStorage.getItem('study_sessions') || '[]');
    const total = sessions.reduce((sum: number, session: StudySession) => 
      sum + session.duration_minutes, 0
    );
    setTotalStudyTime(total);
  };

  const getWeekStart = (date: Date): Date => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day;
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  const getDayName = (index: number): string => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const today = new Date().getDay();
    const dayIndex = (today - 6 + index + 7) % 7;
    return days[dayIndex];
  };

  const dailyPercentage = dailyProgress 
    ? Math.min((dailyProgress.minutes_done / dailyProgress.goal_minutes) * 100, 100)
    : 0;

  const weeklyPercentage = weeklyProgress
    ? Math.min((weeklyProgress.minutes_done / weeklyProgress.weekly_goal_minutes) * 100, 100)
    : 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Estatísticas Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-100">{streak}</div>
              <div className="text-xs text-purple-300">Sequência</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-100">
                {Math.round(dailyPercentage)}%
              </div>
              <div className="text-xs text-purple-300">Hoje</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-100">
                {Math.round(weeklyPercentage)}%
              </div>
              <div className="text-xs text-purple-300">Semana</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-100">
                {Math.floor(totalStudyTime / 60)}h
              </div>
              <div className="text-xs text-purple-300">Total</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Progresso Diário */}
      <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-purple-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              Progresso de Hoje
            </h3>
            <Badge 
              variant={dailyProgress?.reached_100 ? "default" : "outline"}
              className={dailyProgress?.reached_100 
                ? "bg-green-600 text-white" 
                : "border-purple-400 text-purple-200"
              }
            >
              {dailyProgress?.reached_100 ? 'Meta Batida!' : 'Em Progresso'}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-purple-300">
                {dailyProgress?.minutes_done || 0} / {dailyProgress?.goal_minutes || 20} minutos
              </span>
              <span className="text-purple-100 font-medium">
                {Math.round(dailyPercentage)}%
              </span>
            </div>
            <Progress 
              value={dailyPercentage} 
              className="h-3 bg-purple-900/50"
            />
          </div>

          {dailyProgress?.reached_80 && !dailyProgress?.reached_100 && (
            <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-lg p-3">
              <div className="text-yellow-200 font-medium">🔥 Quase lá!</div>
              <div className="text-yellow-300 text-sm">
                Faltam apenas {(dailyProgress?.goal_minutes || 20) - (dailyProgress?.minutes_done || 0)} min!
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Histórico Semanal */}
      <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-purple-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Últimos 7 Dias
          </h3>

          <div className="flex items-end justify-between gap-2 h-32">
            {weeklyHistory.map((minutes, index) => {
              const maxMinutes = Math.max(...weeklyHistory, 30);
              const height = (minutes / maxMinutes) * 100;
              const isToday = index === 6;
              
              return (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  <div className="text-xs text-purple-300 font-medium">
                    {minutes}min
                  </div>
                  <div 
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      isToday 
                        ? 'bg-gradient-to-t from-purple-600 to-purple-400' 
                        : 'bg-gradient-to-t from-purple-800 to-purple-600'
                    }`}
                    style={{ height: `${Math.max(height, 5)}%` }}
                  />
                  <div className={`text-xs ${isToday ? 'text-purple-200 font-bold' : 'text-purple-400'}`}>
                    {getDayName(index)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-purple-300">
              Total da semana: {formatTime(weeklyProgress?.minutes_done || 0)}
            </span>
            <span className="text-purple-100">
              Meta: {formatTime(weeklyProgress?.weekly_goal_minutes || 100)}
            </span>
          </div>
        </div>
      </Card>

      {/* Conquistas */}
      <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-purple-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            Conquistas
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className={`p-3 rounded-lg border ${
              streak >= 3 
                ? 'bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-500/30' 
                : 'bg-purple-900/30 border-purple-700/30'
            }`}>
              <div className="text-center">
                <div className="text-2xl mb-1">🔥</div>
                <div className="text-sm font-medium text-purple-100">3 Dias</div>
                <div className="text-xs text-purple-300">Sequência</div>
              </div>
            </div>

            <div className={`p-3 rounded-lg border ${
              streak >= 7 
                ? 'bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-500/30' 
                : 'bg-purple-900/30 border-purple-700/30'
            }`}>
              <div className="text-center">
                <div className="text-2xl mb-1">⭐</div>
                <div className="text-sm font-medium text-purple-100">1 Semana</div>
                <div className="text-xs text-purple-300">Perfeita</div>
              </div>
            </div>

            <div className={`p-3 rounded-lg border ${
              totalStudyTime >= 300 
                ? 'bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-500/30' 
                : 'bg-purple-900/30 border-purple-700/30'
            }`}>
              <div className="text-center">
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-sm font-medium text-purple-100">5 Horas</div>
                <div className="text-xs text-purple-300">Total</div>
              </div>
            </div>

            <div className={`p-3 rounded-lg border ${
              longestStreak >= 14 
                ? 'bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-500/30' 
                : 'bg-purple-900/30 border-purple-700/30'
            }`}>
              <div className="text-center">
                <div className="text-2xl mb-1">💎</div>
                <div className="text-sm font-medium text-purple-100">2 Semanas</div>
                <div className="text-xs text-purple-300">Máximo</div>
              </div>
            </div>

            <div className={`p-3 rounded-lg border ${
              streak >= 30 
                ? 'bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-500/30' 
                : 'bg-purple-900/30 border-purple-700/30'
            }`}>
              <div className="text-center">
                <div className="text-2xl mb-1">👑</div>
                <div className="text-sm font-medium text-purple-100">1 Mês</div>
                <div className="text-xs text-purple-300">Lenda</div>
              </div>
            </div>

            <div className={`p-3 rounded-lg border ${
              weeklyPercentage >= 100 
                ? 'bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-500/30' 
                : 'bg-purple-900/30 border-purple-700/30'
            }`}>
              <div className="text-center">
                <div className="text-2xl mb-1">🎯</div>
                <div className="text-sm font-medium text-purple-100">Meta</div>
                <div className="text-xs text-purple-300">Semanal</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}