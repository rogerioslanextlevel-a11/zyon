import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CEFRLevel } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLevelColor(level: CEFRLevel): string {
  const colors = {
    A0: "text-gray-400",
    A1: "text-green-400",
    A2: "text-blue-400", 
    B1: "text-yellow-400",
    B2: "text-orange-400",
    C1: "text-purple-400",
    C2: "text-pink-400"
  };
  return colors[level];
}

export function getLevelProgress(level: CEFRLevel): number {
  const progress = {
    A0: 0,
    A1: 15,
    A2: 30,
    B1: 50,
    B2: 70,
    C1: 85,
    C2: 100
  };
  return progress[level];
}

export function formatXP(xp: number): string {
  if (xp >= 1000000) {
    return `${(xp / 1000000).toFixed(1)}M`;
  }
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K`;
  }
  return xp.toString();
}

export function getNextLevel(currentLevel: CEFRLevel): CEFRLevel | null {
  const levels: CEFRLevel[] = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const currentIndex = levels.indexOf(currentLevel);
  return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
}

export function calculateLevelXP(level: CEFRLevel): { current: number; required: number } {
  const requirements = {
    A0: { current: 0, required: 1000 },
    A1: { current: 1000, required: 2500 },
    A2: { current: 2500, required: 5000 },
    B1: { current: 5000, required: 8000 },
    B2: { current: 8000, required: 12000 },
    C1: { current: 12000, required: 18000 },
    C2: { current: 18000, required: 25000 }
  };
  return requirements[level];
}

export function detectLanguage(text: string): 'pt' | 'en' | 'mixed' {
  const englishWords = /\b(the|and|or|but|in|on|at|to|for|of|with|by|from|up|about|into|through|during|before|after|above|below|between|among|under|over|is|are|was|were|be|been|being|have|has|had|do|does|did|will|would|could|should|may|might|can|must|shall)\b/gi;
  const portugueseWords = /\b(o|a|os|as|e|ou|mas|em|no|na|nos|nas|para|de|com|por|do|da|dos|das|um|uma|uns|umas|é|são|foi|foram|ser|estar|ter|tem|tinha|vai|vou|pode|deve|que|como|quando|onde|porque|se|não|sim|muito|mais|menos|bem|mal|aqui|ali|isso|isto|ele|ela|eles|elas|eu|tu|você|nós|vocês)\b/gi;
  
  const englishMatches = (text.match(englishWords) || []).length;
  const portugueseMatches = (text.match(portugueseWords) || []).length;
  
  if (englishMatches > portugueseMatches * 2) return 'en';
  if (portugueseMatches > englishMatches * 2) return 'pt';
  return 'mixed';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}