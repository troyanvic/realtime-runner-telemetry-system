import { useEffect, useState } from "react";
import type { SessionMeta, TickEvent, TelemetryEvent } from "@telemetry/shared";

export function useTelemetrySocket(): {
  meta: SessionMeta | null;
  ticks: TickEvent[];
} {
  const WINDOW_SIZE = 60;

  const [meta, setMeta] = useState<SessionMeta | null>(null);
  const [ticks, setTicks] = useState<TickEvent[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/subscribe");

    ws.onopen = () => {
      console.log("The subscriber is connected");
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data) as TelemetryEvent;

      switch (msg.type) {
        case "meta":
          setMeta(msg);
          break;
        case "tick":
          setTicks((prevTicks) => [...prevTicks, msg].slice(-WINDOW_SIZE));
          break;
      }
    };

    ws.onerror = (error) => {
      console.error("error:", error);
    };

    ws.onclose = (event) => {
      const { code, reason } = event;

      console.log(
        `The subscriber is disconnected. Exit code: ${code}. Reason: ${reason}`,
      );
    };

    return () => ws.close();
  }, []);

  return { meta, ticks };
}
