export enum Eye {
  RIGHT = 'RIGHT',
  LEFT = 'LEFT'
}

export enum AmslerMarkType {
  DISTORTION = 'DISTORTION',
  SCOTOMA_DARK = 'SCOTOMA_DARK',
  SCOTOMA_LIGHT = 'SCOTOMA_LIGHT'
}

export interface AmslerMark {
  x: number;
  y: number;
  type: AmslerMarkType;
}

export interface AmslerTestResult {
  sessionId: string;
  eyeTested: Eye;
  marks: AmslerMark[];
  fixationLossCount: number;
  durationMillis: number;
  startTimestamp: number;
  endTimestamp: number;
  reliabilityScore: number;
}

export interface PhpTrial {
  trialIndex: number;
  offsetSegment: number;
  offsetAmount: number;
}

export interface SdhTrial {
  trialIndex: number;
  hiddenSegment: number;
}

export interface CentralStimulus {
  row: number;
  col: number;
  index: number;
}

export interface ReadingSentence {
  text: string;
  wordCount: number;
}