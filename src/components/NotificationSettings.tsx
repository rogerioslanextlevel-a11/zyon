// Configurações de Notificações e Hábitos
'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Clock, Calendar, Moon, TestTube, Save, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NotificationManager } from '@/lib/notifications';
import { StudySettings } from '@/lib/types';

export default function NotificationSettings() {
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

  const [hasPermission, setHasPermission] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const notificationManager = NotificationManager.getInstance();

  // Carregar configurações salvas
  useEffect(() => {
    const savedSettings = localStorage.getItem('study_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Verificar permissão de notificação
    if ('Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
    }
  }, []);

  // Solicitar permissão de notificações
  const requestNotificationPermission = async () => {
    const granted = await notificationManager.requestPermission();
    setHasPermission(granted);
    
    if (granted) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  // Salvar configurações
  const saveSettings = () => {
    localStorage.setItem('study_settings', JSON.stringify(settings));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Reagendar notificações com novas configurações
    const today = new Date().toISOString().split('T')[0];
    const progress = JSON.parse(localStorage.getItem('daily_progress') || `{
      "date_local": "${today}",
      "minutes_done": 0,
      "goal_minutes": ${settings.daily_goal_minutes},
      "reached_80": false,
      "reached_100": false
    }`);

    notificationManager.scheduleReminder(settings, progress);
  };

  // Testar notificação
  const testNotification = () => {
    if (hasPermission) {
      notificationManager.testNotification();
    } else {
      requestNotificationPermission();
    }
  };

  // Atualizar meta diária
  const updateDailyGoal = (minutes: number) => {
    setSettings(prev => ({ ...prev, daily_goal_minutes: minutes }));
  };

  // Atualizar horários preferidos
  const updatePreferredTime = (index: number, time: string) => {
    const newTimes = [...settings.preferred_times];
    newTimes[index] = time;
    setSettings(prev => ({ ...prev, preferred_times: newTimes }));
  };

  // Adicionar horário preferido
  const addPreferredTime = () => {
    if (settings.preferred_times.length < 3) {
      setSettings(prev => ({
        ...prev,
        preferred_times: [...prev.preferred_times, '12:00']
      }));
    }
  };

  // Remover horário preferido
  const removePreferredTime = (index: number) => {
    if (settings.preferred_times.length > 1) {
      const newTimes = settings.preferred_times.filter((_, i) => i !== index);
      setSettings(prev => ({ ...prev, preferred_times: newTimes }));
    }
  };

  // Toggle dia da semana
  const toggleDay = (day: number) => {
    const newDays = settings.preferred_days.includes(day)
      ? settings.preferred_days.filter(d => d !== day)
      : [...settings.preferred_days, day].sort();
    
    setSettings(prev => ({ ...prev, preferred_days: newDays }));
  };

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Configurações de Hábitos
        </h1>
        <p className="text-purple-300">
          Configure seus lembretes inteligentes para manter a constância
        </p>
      </div>

      {/* Permissão de Notificações */}
      <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-400" />
              <Label className="text-lg font-medium text-purple-100">
                Notificações
              </Label>
            </div>
            <p className="text-sm text-purple-300">
              {hasPermission 
                ? 'Notificações ativadas ✅' 
                : 'Permita notificações para receber lembretes'
              }
            </p>
          </div>
          <div className="flex gap-2">
            {!hasPermission && (
              <Button
                onClick={requestNotificationPermission}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Ativar
              </Button>
            )}
            <Button
              onClick={testNotification}
              variant="outline"
              size="sm"
              className="border-purple-400 text-purple-200 hover:bg-purple-800/30"
            >
              <TestTube className="w-4 h-4 mr-1" />
              Testar
            </Button>
          </div>
        </div>
      </Card>

      {/* Meta Diária */}
      <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <Label className="text-lg font-medium text-purple-100">
              Meta Diária
            </Label>
          </div>
          
          <div className="flex gap-4">
            <Button
              onClick={() => updateDailyGoal(20)}
              variant={settings.daily_goal_minutes === 20 ? "default" : "outline"}
              className={settings.daily_goal_minutes === 20 
                ? "bg-gradient-to-r from-purple-600 to-indigo-600" 
                : "border-purple-400 text-purple-200 hover:bg-purple-800/30"
              }
            >
              20 minutos
            </Button>
            <Button
              onClick={() => updateDailyGoal(30)}
              variant={settings.daily_goal_minutes === 30 ? "default" : "outline"}
              className={settings.daily_goal_minutes === 30 
                ? "bg-gradient-to-r from-purple-600 to-indigo-600" 
                : "border-purple-400 text-purple-200 hover:bg-purple-800/30"
              }
            >
              30 minutos
            </Button>
          </div>

          <p className="text-sm text-purple-300">
            Meta semanal: {settings.daily_goal_minutes * settings.preferred_days.length} minutos
          </p>
        </div>
      </Card>

      {/* Horários Preferidos */}
      <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-purple-400" />
              <Label className="text-lg font-medium text-purple-100">
                Horários de Lembrete
              </Label>
            </div>
            {settings.preferred_times.length < 3 && (
              <Button
                onClick={addPreferredTime}
                size="sm"
                variant="outline"
                className="border-purple-400 text-purple-200 hover:bg-purple-800/30"
              >
                + Adicionar
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {settings.preferred_times.map((time, index) => (
              <div key={index} className="flex items-center gap-3">
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => updatePreferredTime(index, e.target.value)}
                  className="bg-purple-900/30 border-purple-500/30 text-purple-100 w-32"
                />
                <span className="text-purple-300 text-sm">
                  {index === 0 ? 'Lembrete principal' : `Lembrete ${index + 1}`}
                </span>
                {settings.preferred_times.length > 1 && (
                  <Button
                    onClick={() => removePreferredTime(index)}
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:bg-red-800/30"
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Dias da Semana */}
      <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            <Label className="text-lg font-medium text-purple-100">
              Dias de Estudo
            </Label>
          </div>

          <div className="flex gap-2 flex-wrap">
            {dayNames.map((day, index) => (
              <Button
                key={index}
                onClick={() => toggleDay(index)}
                size="sm"
                variant={settings.preferred_days.includes(index) ? "default" : "outline"}
                className={settings.preferred_days.includes(index)
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600"
                  : "border-purple-400 text-purple-200 hover:bg-purple-800/30"
                }
              >
                {day}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Horário de Silêncio */}
      <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-purple-400" />
            <Label className="text-lg font-medium text-purple-100">
              Horário de Silêncio
            </Label>
          </div>

          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-purple-300">Início</Label>
              <Input
                type="time"
                value={settings.quiet_hours_start}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  quiet_hours_start: e.target.value 
                }))}
                className="bg-purple-900/30 border-purple-500/30 text-purple-100 w-32"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-purple-300">Fim</Label>
              <Input
                type="time"
                value={settings.quiet_hours_end}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  quiet_hours_end: e.target.value 
                }))}
                className="bg-purple-900/30 border-purple-500/30 text-purple-100 w-32"
              />
            </div>
          </div>

          <p className="text-sm text-purple-300">
            Não receberá lembretes entre {settings.quiet_hours_start} e {settings.quiet_hours_end}
          </p>
        </div>
      </Card>

      {/* Lembretes Inteligentes */}
      <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-lg font-medium text-purple-100">
              Lembretes Inteligentes
            </Label>
            <p className="text-sm text-purple-300">
              Receber até 2 lembretes por dia + confirmações de progresso
            </p>
          </div>
          <Switch
            checked={settings.smart_reminders_enabled}
            onCheckedChange={(checked) => setSettings(prev => ({ 
              ...prev, 
              smart_reminders_enabled: checked 
            }))}
          />
        </div>
      </Card>

      {/* Salvar */}
      <div className="flex justify-center">
        <Button
          onClick={saveSettings}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-8"
        >
          <Save className="w-5 h-5 mr-2" />
          Salvar Configurações
        </Button>
      </div>

      {/* Mensagem de Sucesso */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg">
          ✅ Configurações salvas com sucesso!
        </div>
      )}
    </div>
  );
}