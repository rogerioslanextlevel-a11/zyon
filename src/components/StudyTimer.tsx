// Timer de Estudo Integrado
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { NotificationManager } from '@/lib/notifications';
import { StudySession, DailyProgress, StudySettings } from '@/lib/types';

interface StudyTimerProps {
  onSessionComplete?: (session: StudySession) => void;
  onProgressUpdate?: (progress: DailyProgress) => void;
}

export default function StudyTimer({ onSessionComplete, onProgressUpdate }: StudyTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0); // em segundos
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [dailyMinutes, setDailyMinutes] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(20);
  const [streak, setStreak] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const notificationManager = NotificationManager.getInstance();

  // Carregar dados salvos
  useEffect(() => {
    const savedProgress = localStorage.getItem('daily_progress');
    const savedSettings = localStorage.getItem('study_settings');
    const savedStreak = localStorage.getItem('streak_data');

    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setDailyMinutes(progress.minutes_done || 0);
    }

    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setDailyGoal(settings.daily_goal_minutes || 20);
    }

    if (savedStreak) {
      const streakData = JSON.parse(savedStreak);
      setStreak(streakData.current || 0);
    }
  }, []);

  // Timer principal
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  // Iniciar sessão
  const startSession = () => {
    setIsRunning(true);
    setSessionStartTime(new Date());
    
    // Analytics
    console.log('session_started', { timestamp: new Date() });
  };

  // Pausar sessão
  const pauseSession = () => {
    setIsRunning(false);
  };

  // Parar e salvar sessão
  const stopSession = () => {
    if (!sessionStartTime) return;

    setIsRunning(false);
    const endTime = new Date();
    const durationMinutes = Math.floor(timeElapsed / 60);

    // Criar sessão
    const session: StudySession = {
      id: Date.now().toString(),
      start_at: sessionStartTime,
      end_at: endTime,
      duration_minutes: durationMinutes,
      was_manual: true,
      device: 'web'
    };

    // Atualizar progresso diário
    const newDailyMinutes = dailyMinutes + durationMinutes;
    setDailyMinutes(newDailyMinutes);

    const progress: DailyProgress = {
      date_local: new Date().toISOString().split('T')[0],
      minutes_done: newDailyMinutes,
      goal_minutes: dailyGoal,
      reached_80: newDailyMinutes >= (dailyGoal * 0.8),
      reached_100: newDailyMinutes >= dailyGoal
    };

    // Salvar progresso
    localStorage.setItem('daily_progress', JSON.stringify(progress));

    // Verificar notificações de progresso
    const settings: StudySettings = JSON.parse(localStorage.getItem('study_settings') || '{}');
    notificationManager.notifyProgress(progress, {
      ...settings,
      daily_goal_minutes: dailyGoal
    });

    // Calcular streak
    const newStreak = notificationManager.calculateStreak(
      progress.date_local,
      progress.reached_100
    );
    setStreak(newStreak);

    // Callbacks
    onSessionComplete?.(session);
    onProgressUpdate?.(progress);

    // Analytics
    console.log('session_completed', { 
      duration: durationMinutes,
      dailyTotal: newDailyMinutes,
      goalReached: progress.reached_100
    });

    // Reset timer
    setTimeElapsed(0);
    setSessionStartTime(null);
  };

  // Adicionar 5 minutos
  const addFiveMinutes = () => {
    const newDailyMinutes = dailyMinutes + 5;
    setDailyMinutes(newDailyMinutes);

    const progress: DailyProgress = {
      date_local: new Date().toISOString().split('T')[0],
      minutes_done: newDailyMinutes,
      goal_minutes: dailyGoal,
      reached_80: newDailyMinutes >= (dailyGoal * 0.8),
      reached_100: newDailyMinutes >= dailyGoal
    };

    localStorage.setItem('daily_progress', JSON.stringify(progress));
    onProgressUpdate?.(progress);
  };

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    setTimeElapsed(0);
    setSessionStartTime(null);
  };

  // Formatação de tempo
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = Math.min((dailyMinutes / dailyGoal) * 100, 100);
  const currentSessionMinutes = Math.floor(timeElapsed / 60);

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
      <div className="text-center space-y-6">
        {/* Timer Display */}
        <div className="space-y-2">
          <div className="text-6xl font-mono font-bold text-purple-100 tracking-wider">
            {formatTime(timeElapsed)}
          </div>
          <div className="text-purple-300 text-sm">
            {isRunning ? 'Estudando...' : 'Pronto para começar'}
          </div>
        </div>

        {/* Progresso da Sessão Atual */}
        {currentSessionMinutes > 0 && (
          <div className="bg-purple-800/30 rounded-lg p-3">
            <div className="text-purple-200 text-sm mb-1">Sessão Atual</div>
            <div className="text-2xl font-bold text-purple-100">
              {currentSessionMinutes} min
            </div>
          </div>
        )}

        {/* Controles */}
        <div className="flex justify-center gap-3">
          {!isRunning ? (
            <Button
              onClick={startSession}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8"
            >
              <Play className="w-5 h-5 mr-2" />
              Iniciar
            </Button>
          ) : (
            <Button
              onClick={pauseSession}
              size="lg"
              variant="outline"
              className="border-purple-400 text-purple-100 hover:bg-purple-800/30 px-8"
            >
              <Pause className="w-5 h-5 mr-2" />
              Pausar
            </Button>
          )}

          <Button
            onClick={stopSession}
            size="lg"
            variant="outline"
            className="border-red-400 text-red-300 hover:bg-red-800/30"
            disabled={timeElapsed === 0}
          >
            <Square className="w-5 h-5 mr-2" />
            Parar
          </Button>

          <Button
            onClick={resetTimer}
            size="sm"
            variant="ghost"
            className="text-purple-300 hover:bg-purple-800/30"
            disabled={isRunning}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Progresso Diário */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-purple-300">Progresso Diário</span>
            <span className="text-purple-100 font-medium">
              {dailyMinutes}/{dailyGoal} min
            </span>
          </div>
          
          <Progress 
            value={progressPercentage} 
            className="h-3 bg-purple-900/50"
          />
          
          <div className="flex justify-between items-center text-xs text-purple-400">
            <span>{Math.round(progressPercentage)}% completo</span>
            <span>🔥 {streak} dias</span>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="flex justify-center gap-2">
          <Button
            onClick={addFiveMinutes}
            size="sm"
            variant="outline"
            className="border-purple-400 text-purple-200 hover:bg-purple-800/30"
          >
            <Plus className="w-4 h-4 mr-1" />
            +5 min
          </Button>
        </div>

        {/* Mensagens de Motivação */}
        {progressPercentage >= 80 && progressPercentage < 100 && (
          <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-lg p-3">
            <div className="text-yellow-200 font-medium">🔥 Quase lá!</div>
            <div className="text-yellow-300 text-sm">
              Faltam apenas {dailyGoal - dailyMinutes} min para bater a meta!
            </div>
          </div>
        )}

        {progressPercentage >= 100 && (
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg p-3">
            <div className="text-green-200 font-medium">✅ Meta Concluída!</div>
            <div className="text-green-300 text-sm">
              Parabéns! Streak de {streak} dias mantido! 🎉
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}