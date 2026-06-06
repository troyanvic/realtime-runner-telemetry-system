interface BaseEvent {
  sessionId: string;
  runnerId: string;
}

export interface SessionMeta extends BaseEvent {
  type: "meta";
  startedAt: number;
  seed?: number;
}

export interface TickEvent extends BaseEvent {
  type: "tick";
  t: number;
  tick: number;
  speed: number; // m/s
  heartRate: number; // bpm
}

export type TelemetryEvent = SessionMeta | TickEvent;
