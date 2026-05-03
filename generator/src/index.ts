import { randomUUID } from "node:crypto";
import { SessionMeta, TickEvent } from "./types.js";

const randomInRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const CADENCE_MS = 1000;
const SPEED_MIN_MS = 2;
const SPEED_MAX_MS = 5;
const HR_MIN_BPM = 120;
const HR_MAX_BPM = 180;

// define ids
const sessionId = randomUUID();
const runnerId = randomUUID();

// define session meta data
const sessionMeta: SessionMeta = {
  sessionId,
  runnerId,
  startedAt: Date.now(),
};

console.log("sessionMeta:", sessionMeta);

// tick is 0-indexed; first emitted event has tick=0
let tick = 0;

// generate ticks
const handle = setInterval(() => {
  const t = Date.now() - sessionMeta.startedAt;
  const speed = randomInRange(SPEED_MIN_MS, SPEED_MAX_MS);
  const heartRate = Math.round(randomInRange(HR_MIN_BPM, HR_MAX_BPM));
  const tickEvent: TickEvent = {
    sessionId,
    runnerId,
    t,
    tick: tick++,
    speed,
    heartRate,
  };
  console.log("tickEvent:", tickEvent);
}, CADENCE_MS);

// exit
process.on("SIGINT", () => {
  clearInterval(handle);
  console.log(" The session has ended.");
  process.exit(0);
});
