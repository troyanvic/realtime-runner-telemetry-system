export function formatSpeed(speedMs: number): string {
  const val = speedMs * 3.6;

  return `${val.toFixed(1)} km/h`;
}

export function toPace(speedMs: number): string {
  if (speedMs === 0) return `---`;

  const total = Math.floor(1000 / speedMs);
  const min = Math.floor(total / 60);
  const sec = total % 60;

  return `${min}:${String(sec).padStart(2, "0")}/km`;
}

export function formatHr(hr: number): string {
  return `${hr} bpm`;
}
