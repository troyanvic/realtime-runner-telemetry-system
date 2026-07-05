import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import type { SessionMeta, TelemetryEvent, TickEvent } from "@telemetry/shared";

function App() {
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
          console.log("Received session metadata:", msg);

          setMeta(msg);
          break;
        case "tick":
          console.log("Received tick event:", msg);

          setTicks((prevTicks) => [...prevTicks, msg].slice(-60));
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

  console.log("meta:", meta);
  console.log("ticks:", ticks);

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
        </div>
      </section>

      <div className="ticks">
        {ticks.map((tick) => {
          const { speed, heartRate, tick: tickNum } = tick;

          return (
            <div key={tickNum} className="tick">
              <div className="tick-row">
                <div className="tick-label">#: </div>
                <div className="tick-value">{tickNum}</div>
              </div>

              <div className="tick-row">
                <div className="tick-label">Speed: </div>
                <div className="tick-value">{speed} m/s</div>
              </div>

              <div className="tick-row">
                <div className="tick-label">HR: </div>
                <div className="tick-value">{heartRate} bpm</div>
              </div>
            </div>
          );
        })}
      </div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>
      <section id="spacer"></section>
    </>
  );
}

export default App;
