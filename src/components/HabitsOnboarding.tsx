// Onboarding para Configuração de Hábitos
'use client';

import React, { useState } from 'react';
import { ChevronRight, Bell, Clock, Calendar, Moon, Target, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StudySettings } from '@/lib/types';
import { NotificationManager } from '@/lib/notifications';

interface HabitsOnboardingProps {
  onComplete: (settings: StudySettings) => void;
  onSkip?: () => void;
}

export default function HabitsOnboarding({ onComplete, onSkip }: HabitsOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [settings, setSettings] = useState<StudySettings>({
    id: '1',
    timezone: 'America/Sao_Paulo',
    daily_goal_minutes: 20,
    preferred_times: ['08:00', '19:00'],
    preferred_days: [1, 2, 3, 4, 5], // Segunda a sexta
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00',
    smart_reminders_enabled: true
  });
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);

  const steps = [
    {
      title: 'Defina sua meta diária',
      description: 'Quanto tempo você quer estudar por dia?',
      icon: Target
    },
    {
      title: 'Escolha seus horários',
      description: 'Quando você prefere estudar?',
      icon: Clock
    },
    {
      title: 'Selecione os dias',
      description: 'Em quais dias da semana?',
      icon: Calendar
    },
    {
      title: 'Configure o silêncio',
      description: 'Quando não quer ser incomodado?',
      icon: Moon
    },
    {
      title: 'Ative as notificações',
      description: 'Para receber lembretes inteligentes',
      icon: Bell
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    // Salvar configurações
    localStorage.setItem('study_settings', JSON.stringify(settings));
    localStorage.setItem('habits_onboarding_completed', 'true');

    // Configurar notificações iniciais
    if (hasNotificationPermission) {
      const notificationManager = NotificationManager.getInstance();
      const today = new Date().toISOString().split('T')[0];
      const initialProgress = {
        date_local: today,
        minutes_done: 0,
        goal_minutes: settings.daily_goal_minutes,
        reached_80: false,
        reached_100: false
      };
      
      notificationManager.scheduleReminder(settings, initialProgress);
      notificationManager.scheduleWeeklySummary();
    }

    onComplete(settings);
  };

  const requestNotificationPermission = async () => {
    const notificationManager = NotificationManager.getInstance();
    const granted = await notificationManager.requestPermission();
    setHasNotificationPermission(granted);
    
    if (granted) {
      nextStep();
    }
  };

  const updateDailyGoal = (minutes: number) => {
    setSettings(prev => ({ ...prev, daily_goal_minutes: minutes }));
  };

  const updatePreferredTime = (index: number, time: string) => {
    const newTimes = [...settings.preferred_times];
    newTimes[index] = time;
    setSettings(prev => ({ ...prev, preferred_times: newTimes }));
  };

  const toggleDay = (day: number) => {
    const newDays = settings.preferred_days.includes(day)
      ? settings.preferred_days.filter(d => d !== day)
      : [...settings.preferred_days, day].sort();
    
    setSettings(prev => ({ ...prev, preferred_days: newDays }));
  };

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-purple-500/20 backdrop-blur-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <StepIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-purple-100 mb-2">
            {currentStepData.title}
          </h1>
          <p className="text-purple-300 text-sm">
            {currentStepData.description}
          </p>
        </div>

        {/* Progress */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStep 
                    ? 'bg-purple-400' 
                    : 'bg-purple-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6 mb-8">
          {/* Step 0: Meta Diária */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => updateDailyGoal(20)}
                  variant={settings.daily_goal_minutes === 20 ? "default" : "outline"}
                  className={settings.daily_goal_minutes === 20 
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 h-16" 
                    : "border-purple-400 text-purple-200 hover:bg-purple-800/30 h-16"
                  }
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">20</div>
                    <div className="text-xs">minutos</div>
                  </div>
                </Button>
                <Button
                  onClick={() => updateDailyGoal(30)}
                  variant={settings.daily_goal_minutes === 30 ? "default" : "outline"}
                  className={settings.daily_goal_minutes === 30 
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 h-16" 
                    : "border-purple-400 text-purple-200 hover:bg-purple-800/30 h-16"
                  }
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">30</div>
                    <div className="text-xs">minutos</div>
                  </div>
                </Button>
              </div>
              <p className="text-center text-purple-300 text-sm">
                Meta semanal: {settings.daily_goal_minutes * settings.preferred_days.length} minutos
              </p>
            </div>
          )}

          {/* Step 1: Horários */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-purple-200 text-sm mb-2 block">
                    Primeiro lembrete
                  </Label>
                  <Input
                    type="time"
                    value={settings.preferred_times[0]}
                    onChange={(e) => updatePreferredTime(0, e.target.value)}
                    className="bg-purple-900/30 border-purple-500/30 text-purple-100"
                  />
                </div>
                <div>
                  <Label className="text-purple-200 text-sm mb-2 block">
                    Segundo lembrete (opcional)
                  </Label>
                  <Input
                    type="time"
                    value={settings.preferred_times[1]}
                    onChange={(e) => updatePreferredTime(1, e.target.value)}
                    className="bg-purple-900/30 border-purple-500/30 text-purple-100"
                  />
                </div>
              </div>
              <p className="text-purple-300 text-xs text-center">
                Você receberá lembretes gentis nesses horários
              </p>
            </div>
          )}

          {/* Step 2: Dias da Semana */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {dayNames.map((day, index) => (
                  <Button
                    key={index}
                    onClick={() => toggleDay(index)}
                    size="sm"
                    variant={settings.preferred_days.includes(index) ? "default" : "outline"}
                    className={settings.preferred_days.includes(index)
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 h-12"
                      : "border-purple-400 text-purple-200 hover:bg-purple-800/30 h-12"
                    }
                  >
                    {day}
                  </Button>
                ))}
              </div>
              <p className="text-purple-300 text-xs text-center">
                {settings.preferred_days.length} dias selecionados
              </p>
            </div>
          )}

          {/* Step 3: Horário de Silêncio */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-purple-200 text-sm mb-2 block">
                    Início
                  </Label>
                  <Input
                    type="time"
                    value={settings.quiet_hours_start}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      quiet_hours_start: e.target.value 
                    }))}
                    className="bg-purple-900/30 border-purple-500/30 text-purple-100"
                  />
                </div>
                <div>
                  <Label className="text-purple-200 text-sm mb-2 block">
                    Fim
                  </Label>
                  <Input
                    type="time"
                    value={settings.quiet_hours_end}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      quiet_hours_end: e.target.value 
                    }))}
                    className="bg-purple-900/30 border-purple-500/30 text-purple-100"
                  />
                </div>
              </div>
              <p className="text-purple-300 text-xs text-center">
                Não receberá lembretes entre {settings.quiet_hours_start} e {settings.quiet_hours_end}
              </p>
            </div>
          )}

          {/* Step 4: Notificações */}
          {currentStep === 4 && (
            <div className="space-y-6 text-center">
              {!hasNotificationPermission ? (
                <>
                  <div className="space-y-3">
                    <div className="text-4xl">🔔</div>
                    <p className="text-purple-200">
                      Permita notificações para receber lembretes inteligentes que vão te ajudar a manter a constância.
                    </p>
                    <div className="bg-purple-800/30 rounded-lg p-4 text-left">
                      <div className="text-purple-200 text-sm space-y-2">
                        <div>✅ Máximo 2 lembretes por dia</div>
                        <div>✅ Respeita horários de silêncio</div>
                        <div>✅ Confirmação quando bater a meta</div>
                        <div>✅ Mensagens motivadoras</div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
                  <p className="text-green-200 font-medium">
                    Notificações ativadas com sucesso!
                  </p>
                  <p className="text-purple-300 text-sm">
                    Você está pronto para começar sua jornada de estudos consistente.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={prevStep}
            variant="ghost"
            className="text-purple-300 hover:bg-purple-800/30"
            disabled={currentStep === 0}
          >
            Voltar
          </Button>

          <div className="flex gap-2">
            {onSkip && currentStep < steps.length - 1 && (
              <Button
                onClick={onSkip}
                variant="ghost"
                className="text-purple-400 hover:bg-purple-800/30"
              >
                Pular
              </Button>
            )}

            {currentStep === 4 && !hasNotificationPermission ? (
              <Button
                onClick={requestNotificationPermission}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Ativar Notificações
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {currentStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}