import { WebSocket } from "ws";
import { randomUUID } from "node:crypto";
import { SessionMeta, TickEvent } from "./types.js";

const ws = new WebSocket("ws://localhost:8080/publish");

const randomInRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const CADENCE_MS = 1000;
const SPEED_MIN_MS = 2;
const SPEED_MAX_MS = 5;
const HR_MIN_BPM = 120;
const HR_MAX_BPM = 180;
const GRACE_MS = 2000;

// define ids
const sessionId = randomUUID();
const runnerId = randomUUID();

// define session meta data
const sessionMeta: SessionMeta = {
  sessionId,
  runnerId,
  startedAt: Date.now(),
};

let intervalHandle: ReturnType<typeof setInterval> | undefined;

ws.on("open", () => {
  let tick = 0;

  const emitTick = () => {
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
