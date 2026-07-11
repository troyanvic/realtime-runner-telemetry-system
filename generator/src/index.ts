import { WebSocket } from "ws";
import { randomUUID } from "node:crypto";
import type { SessionMeta, TickEvent } from "@telemetry/shared";
import { mulberry32 } from "./utils/random.js";

const CADENCE_MS = 1000;
const SPEED_MIN_MS = 2;
const SPEED_MAX_MS = 5;
const HR_MIN_BPM = 120;
const HR_MAX_BPM = 180;
const GRACE_MS = 2000;

const ws = new WebSocket("ws://localhost:8080/publish");
const rawArg = process.argv[2];

let seed: number;
if (rawArg === undefined) {
  seed = Date.now();
} else {
  const parsed = Number(rawArg);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid seed: "${rawArg}" is not a number`);
  }
  seed = parsed;
}

const random = mulberry32(seed);
const randomInRange = (min: number, max: number) =>
  random() * (max - min) + min;

// define ids
const sessionId = randomUUID();
const runnerId = randomUUID();

// define session meta data
const sessionMeta: SessionMeta = {
  type: "meta",
  sessionId,
  runnerId,
  startedAt: Date.now(),
  seed,
};

let intervalHandle: ReturnType<typeof setInterval> | undefined;

ws.on("open", () => {
  let tick = 0;

  const emitTick = () => {
    const speed = randomInRange(SPEED_MIN_MS, SPEED_MAX_MS);
    const heartRate = Math.round(randomInRange(HR_MIN_BPM, HR_MAX_BPM));
    const tickEvent: TickEvent = {
      type: "tick",
      sessionId,
      runnerId,
      t: tick * CADENCE_MS,
      tick: tick++,
      speed,
      heartRate,
    };

    console.log("tickEvent:", tickEvent);
    ws.send(JSON.stringify(tickEvent));
  };

  ws.send(JSON.stringify(sessionMeta));
  emitTick();
  intervalHandle = setInterval(emitTick, CADENCE_MS);
})
  .on("error", (err) => console.error("error:", err))
  .on("close", () => {
    console.log("The session has ended.");
    process.exit(0);
  });

// exit
process.on("SIGINT", () => {
  clearInterval(intervalHandle);
  ws.close(1001, "The session has ended.");
  setTimeout(() => process.exit(0), GRACE_MS).unref();
});
