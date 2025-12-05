export interface Rune {
  id: string;
  name: string;
  symbol: string;
  meaning: string;
  description: string;
  deckId?: string;
}

export interface Position {
  x: number;
  y: number;
  rot: number;
  z: number;
}

export interface RevealedRune {
  deckId: string;
  rune: Rune;
  order: number;
  position: string;
}

export interface Spread {
  id: string;
  label: string;
  count: number;
  positions: string[];
}

export interface MotionData {
  angle: number;
  intensity: number;
}

export type Mode = 'shuffle' | 'select' | 'read';
export type Language = 'pt-BR' | 'en';
