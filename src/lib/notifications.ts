// Sistema de Notificações Inteligentes - Estilo Duolingo
import { StudySettings, DailyProgress, StudySession, NotificationLog } from './types';

export class NotificationManager {
  private static instance: NotificationManager;
  private notificationPermission: NotificationPermission = 'default';

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  // Solicitar permissão de notificações
  async requestPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      this.notificationPermission = permission;
      return permission === 'granted';
    }
    return false;
  }

  // Verificar se está em horário de silêncio
  isQuietHours(now: Date, quietStart: string, quietEnd: string): boolean {
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM
    
    // Se horário de fim é menor que início, passa pela meia-noite
    if (quietEnd < quietStart) {
      return currentTime >= quietStart || currentTime <= quietEnd;
    }
    
    return currentTime >= quietStart && currentTime <= quietEnd;
  }

  // Agendar lembrete diário
  scheduleReminder(settings: StudySettings, progress: DailyProgress): void {
    const now = new Date();
    const today = now.getDay(); // 0 = domingo, 1 = segunda...

    // Verificar se hoje é um dia preferido
    if (!settings.preferred_days.includes(today)) return;

    // Verificar se meta já foi batida
    if (progress.reached_100) return;

    // Verificar horário de silêncio
    if (this.isQuietHours(now, settings.quiet_hours_start, settings.quiet_hours_end)) {
      return;
    }

    // Agendar para próximo horário preferido
    settings.preferred_times.forEach((time, index) => {
      const [hours, minutes] = time.split(':').map(Number);
      const reminderTime = new Date();
      reminderTime.setHours(hours, minutes, 0, 0);

      // Se já passou, agendar para amanhã
      if (reminderTime <= now) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }

      const timeUntilReminder = reminderTime.getTime() - now.getTime();

      setTimeout(() => {
        this.sendReminder(index === 0 ? 'reminder1' : 'reminder2', settings);
      }, timeUntilReminder);
    });
  }

  // Enviar notificação
  private sendReminder(type: 'reminder1' | 'reminder2' | 'almost' | 'goal_done', settings: StudySettings): void {
    if (this.notificationPermission !== 'granted') return;

    const messages = {
      reminder1: {
        title: "🎯 Hora do inglês com Zion!",
        body: `${settings.daily_goal_minutes} min hoje? Se ficar sem treinar, pode se dar mal na hora H! 😄`,
        actions: [
          { action: 'start', title: 'Começar agora' },
          { action: 'snooze', title: 'Adiar 1h' }
        ]
      },
      reminder2: {
        title: "⏰ Ainda dá tempo!",
        body: "15-20 min e você mantém sua sequência. O Zion está esperando! 🌟",
        actions: [
          { action: 'start', title: 'Vamos lá!' },
          { action: 'dismiss', title: 'Depois' }
        ]
      },
      almost: {
        title: "🔥 Quase lá!",
        body: `Faltam só ${Math.ceil((settings.daily_goal_minutes - (settings.daily_goal_minutes * 0.8)))} min para bater a meta! 👏`,
        actions: [
          { action: 'continue', title: 'Finalizar' }
        ]
      },
      goal_done: {
        title: "✅ Meta concluída!",
        body: `Parabéns! Streak mantido. O Zion está orgulhoso! 🎉`,
        actions: []
      }
    };

    const config = messages[type];
    
    // Criar notificação
    const notification = new Notification(config.title, {
      body: config.body,
      icon: '/zion-icon.png',
      badge: '/zion-badge.png',
      tag: `zion-${type}`,
      requireInteraction: type === 'reminder1' || type === 'reminder2',
      actions: config.actions as any,
      data: { type, timestamp: Date.now() }
    });

    // Log da notificação
    this.logNotification(type, new Date());

    // Auto-close após 10 segundos (exceto lembretes)
    if (type === 'almost' || type === 'goal_done') {
      setTimeout(() => notification.close(), 10000);
    }
  }

  // Notificar progresso (80% e 100%)
  notifyProgress(progress: DailyProgress, settings: StudySettings): void {
    const percentage = progress.minutes_done / settings.daily_goal_minutes;

    // 80% - Quase lá
    if (percentage >= 0.8 && percentage < 1.0 && !progress.reached_80) {
      this.sendReminder('almost', settings);
      progress.reached_80 = true;
    }

    // 100% - Meta batida
    if (percentage >= 1.0 && !progress.reached_100) {
      this.sendReminder('goal_done', settings);
      progress.reached_100 = true;
      this.cancelPendingNotifications();
    }
  }

  // Cancelar notificações pendentes
  private cancelPendingNotifications(): void {
    // Em um app real, cancelaria notificações agendadas
    console.log('Cancelando notificações pendentes do dia');
  }

  // Log de notificações
  private logNotification(type: string, scheduledFor: Date): void {
    const log: NotificationLog = {
      id: Date.now().toString(),
      type,
      scheduled_for: scheduledFor,
      delivered_at: new Date(),
      action_taken: null,
      canceled: false
    };

    // Salvar no localStorage (em produção seria no banco)
    const logs = JSON.parse(localStorage.getItem('notification_logs') || '[]');
    logs.push(log);
    localStorage.setItem('notification_logs', JSON.stringify(logs));
  }

  // Calcular streak
  calculateStreak(dateLocal: string, reachedGoalToday: boolean): number {
    const streakData = JSON.parse(localStorage.getItem('streak_data') || '{"current": 0, "longest": 0, "lastDate": null}');
    
    if (reachedGoalToday) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (streakData.lastDate === yesterdayStr || streakData.current === 0) {
        streakData.current += 1;
        streakData.longest = Math.max(streakData.longest, streakData.current);
      } else {
        streakData.current = 1; // Reinicia streak
      }
      
      streakData.lastDate = dateLocal;
    } else {
      // Se não bateu a meta, zera o streak
      streakData.current = 0;
    }

    localStorage.setItem('streak_data', JSON.stringify(streakData));
    return streakData.current;
  }

  // Resumo semanal (domingo à noite)
  scheduleWeeklySummary(): void {
    const now = new Date();
    const daysUntilSunday = (7 - now.getDay()) % 7;
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + daysUntilSunday);
    nextSunday.setHours(20, 0, 0, 0); // 20:00 domingo

    const timeUntilSummary = nextSunday.getTime() - now.getTime();

    setTimeout(() => {
      this.sendWeeklySummary();
      this.scheduleWeeklySummary(); // Reagendar para próxima semana
    }, timeUntilSummary);
  }

  private sendWeeklySummary(): void {
    // Calcular progresso semanal
    const weeklyMinutes = this.getWeeklyMinutes();
    const weeklyGoal = this.getWeeklyGoal();

    if (this.notificationPermission === 'granted') {
      new Notification("📊 Resumo Semanal", {
        body: `Você fez ${weeklyMinutes}/${weeklyGoal} min esta semana. Bora fechar bonito na próxima! 🚀`,
        icon: '/zion-icon.png',
        tag: 'zion-weekly'
      });
    }
  }

  private getWeeklyMinutes(): number {
    // Implementar lógica para somar minutos da semana
    return 0; // Placeholder
  }

  private getWeeklyGoal(): number {
    const settings = JSON.parse(localStorage.getItem('study_settings') || '{}');
    return (settings.daily_goal_minutes || 20) * settings.preferred_days.length;
  }

  // Testar notificação
  testNotification(): void {
    if (this.notificationPermission === 'granted') {
      new Notification("🧪 Teste do Zion", {
        body: "Suas notificações estão funcionando perfeitamente! ✨",
        icon: '/zion-icon.png',
        tag: 'zion-test'
      });
    }
  }
}

// Funções utilitárias
export const notificationUtils = {
  // Verificar se é horário de silêncio
  isQuietHours: (now: Date, quietStart: string, quietEnd: string): boolean => {
    return NotificationManager.getInstance().isQuietHours(now, quietStart, quietEnd);
  },

  // Obter próximo horário de lembrete
  getNextReminderTime: (preferredTimes: string[]): Date => {
    const now = new Date();
    const today = now.toDateString();

    for (const time of preferredTimes) {
      const [hours, minutes] = time.split(':').map(Number);
      const reminderTime = new Date(`${today} ${hours}:${minutes}:00`);
      
      if (reminderTime > now) {
        return reminderTime;
      }
    }

    // Se todos os horários já passaram, retorna o primeiro horário de amanhã
    const [hours, minutes] = preferredTimes[0].split(':').map(Number);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(hours, minutes, 0, 0);
    
    return tomorrow;
  },

  // Formatar tempo restante
  formatTimeRemaining: (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  }
};