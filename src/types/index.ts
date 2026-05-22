export interface Scene {
  id: string;
  category: string;
  name: string;
  description: string;
  icon: string;
}

export interface ScriptResult {
  gentle: string;
  firm: string;
  emotional: string;
  analysis: string;
}

export interface EmotionResult {
  level: 'red' | 'yellow' | 'green';
  score: number;
  riskWords: Array<{
    word: string;
    type: 'shift' | 'confront' | 'emotional' | 'attack';
    position: [number, number];
  }>;
  suggestions: string[];
  rewrites: {
    gentle: string;
    professional: string;
    firm: string;
  };
}

export interface PracticeMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}

export interface PracticeScore {
  logic: number;
  tone: number;
  stance: number;
  risk: number;
  solution: number;
  total: number;
}

export interface PracticeSession {
  id: string;
  role: 'boss' | 'hr' | 'client' | 'colleague';
  scene: string;
  messages: PracticeMessage[];
  score?: PracticeScore;
  feedback?: string[];
}

export type RewriteStyle = 'gentle' | 'professional' | 'firm';

export interface RiskWord {
  word: string;
  type: 'shift' | 'confront' | 'emotional' | 'attack';
  description: string;
}
