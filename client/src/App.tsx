import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import { formatSpeed, toPace, formatHr } from "./helpers";
import { useTelemetrySocket } from "./hooks/useTelemetrySocket";

function App() {
  const { meta, ticks } = useTelemetrySocket();

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Runner pitwall</h1>
          {meta && <h2>Session id: {meta.sessionId}</h2>}
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
                <div className="tick-value">{formatSpeed(speed)}</div>
              </div>

              <div className="tick-row">
                <div className="tick-label">Pace: </div>
                <div className="tick-value">{toPace(speed)}</div>
              </div>

              <div className="tick-row">
                <div className="tick-label">HR: </div>
                <div className="tick-value">{formatHr(heartRate)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
