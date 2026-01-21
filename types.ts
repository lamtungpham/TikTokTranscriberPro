
export interface TranscriptionResult {
  fullText: string;
  summary: string;
  keywords: string[];
  segments: {
    start: string;
    text: string;
  }[];
}

export enum ProcessState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
