import logo from "./assets/logo-track.svg";
import "./App.css";
import { formatSpeed, toPace, formatHr } from "./helpers";
import { useTelemetrySocket } from "./hooks/useTelemetrySocket";

function App() {
  const { meta, ticks } = useTelemetrySocket();

  return (
    <>
      <section id="center">
        <div className="hero">
          <img
            className="base"
            src={logo}
            width="200"
            height="150"
            alt="Runner pitwall"
          />
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
