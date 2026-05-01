# realtime-runner-telemetry-system

> A monorepo that simulates a real-time telemetry system for running activities — from data generation, through a WebSocket hub, to a live visualization client.

This project is a deliberate training ground for **real-time data streaming, WebSocket architecture, and high-performance UI** — built incrementally from a minimal MVP toward Canvas/WebGL rendering, replay, and analytics.

---

## 🎯 Goals

- Build a working end-to-end real-time pipeline: `generator → server → client`
- Practice **time-series thinking**: sliding windows, backpressure, latency budgets
- Move beyond DOM-based charts toward **Canvas / WebGL** rendering
- Reason about scalability: 1 → 10 → 100 → 1000 concurrent runners
- Develop strong intuition for **system design** in real-time domains

---

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────────┐      ┌──────────────┐
│  Generator  │──────▶│      Server      │──────▶│    Client    │
│  (Node.js)  │  WS  │ (Node + WebSocket)│  WS  │   (React)    │
│             │      │  real-time hub   │      │ visualization│
└─────────────┘      └──────────────────┘      └──────────────┘
   simulates             routes / fans              charts,
   speed, HR,            out telemetry             replay,
   cadence, ...                                    comparison
```

Each layer is an **independent process**, intentionally decoupled so it can be reasoned about, scaled, and optimized in isolation.

### Data flow

1. **Generator** emits structured telemetry events at a fixed cadence (e.g. 1 Hz → 10 Hz).
2. **Server** receives events and broadcasts them to connected clients in real time.
3. **Client** consumes the stream, maintains a sliding window of recent samples, and renders it.

---

## 🧱 Tech Stack

**Current**
- **Node.js** — generator + server runtime
- **WebSocket** — real-time bidirectional transport
- **React** — client UI

**Planned**
- **Canvas API** — high-frequency rendering (Phase 2)
- **WebGL** — GPU-accelerated charts at scale (Phase 2/3)
- **Time-series storage** — replay & history (Phase 3)
- **Python** — analytics & ML for anomaly detection (Phase 4)

---

## 📦 Project Structure

```
realtime-runner-telemetry-system/
├── generator/        # telemetry data generator (Node.js)
├── server/           # WebSocket hub (Node.js)
├── client/           # React visualization client
└── README.md
```

> Structure is provisional — packages will be scaffolded as Phase 1 progresses.

---

## 🚀 Roadmap

### Phase 1 — MVP
- Telemetry generator emitting `speed` and `heartRate`
- WebSocket server acting as a real-time hub
- React client with basic visualization
- Sliding-window data handling

### Phase 2 — Performance
- Canvas-based rendering
- Multiple metrics (cadence, pace, elevation, ...)
- Stable real-time UI under sustained load

### Phase 3 — Replay & Comparison
- Replay system for completed sessions
- Run-vs-run comparison
- Backend storage with time-series semantics

### Phase 4 — Insights
- Anomaly detection
- Basic AI / ML predictions

> Phases are guidelines, not gates. Each phase builds on the previous one — no jumping ahead.

---

## 🧪 Getting Started

> 🚧 The project is in **Phase 1 setup**. Packages are not yet scaffolded.
> This section will be filled in as `generator`, `server`, and `client` come online.

Planned local workflow (subject to change):

```bash
# install dependencies (once packages exist)
pnpm install

# run each part in its own terminal
pnpm --filter generator run dev
pnpm --filter server    run dev
pnpm --filter client    run dev
```

---

## 📊 What "Real-Time" Means Here

This project treats real-time as a set of **explicit constraints**, not a buzzword:

| Constraint           | Target                                    |
| -------------------- | ----------------------------------------- |
| End-to-end latency   | < 100 ms (generator → client render)      |
| Render frame rate    | 60 fps under sustained data load          |
| Message frequency    | configurable, 1–60 Hz per metric          |
| Backpressure         | bounded queues, drop policy on slow client|
| Reconnection         | seamless resume with no data corruption   |

These targets evolve per phase — Phase 1 won't hit all of them, and that's fine.

---

## 🧭 Learning Focus

Every architectural decision should pass one filter: *does this make me a stronger real-time / data-viz engineer?*

Areas of deliberate practice:

- **Separation of concerns** between generator / server / client
- **Data flow clarity** — every byte should have a known path
- **Rendering performance** — measure, don't guess
- **Real-time correctness** — backpressure, drift, reconnection, tab backgrounding
- **System thinking** — components, contracts, failure modes

---

## 📜 License

TBD.

---

## 🙋 Status

**Phase:** 1 — MVP
**State:** Bootstrapping (repo + project guidance set up, packages not yet scaffolded)