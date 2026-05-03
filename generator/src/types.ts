export interface SessionMeta {
  sessionId: string;
  runnerId: string;
  startedAt: number;
  seed?: number;
}

export interface TickEvent {
  sessionId: string;
  runnerId: string;
  t: number;
  tick: number;
  speed: number;      // m/s
  heartRate: number;  // bpm
}