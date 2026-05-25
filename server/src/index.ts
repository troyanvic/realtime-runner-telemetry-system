import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let producer: WebSocket | null = null;
const subscribers: Set<WebSocket> = new Set();
let lastSessionMeta: string | null = null;

wss.on("listening", () => {
  console.log("server listening");
});

wss.on("error", (err) => console.error("server error:", err.message));

wss.on("connection", (socket, req) => {
  console.log("req.url: ", req.url);

  if (req.url === "/publish") {
    if (producer === null) {
      producer = socket;
      console.log("producer connected");

      socket
        .on("message", (data, isBinary) => {
          if (lastSessionMeta === null) {
            lastSessionMeta = data.toString();
          }

          for (const s of subscribers) {
            if (s.readyState === WebSocket.OPEN)
              s.send(data, { binary: isBinary });
          }
        })
        .on("error", (err) => console.error("socket error:", err.message))
        .on("close", () => {
          producer = null;
          lastSessionMeta = null;
          console.log("producer disconnected");
        });
    } else {
      socket
        .on("error", (err) => console.error("socket error:", err.message))
        .close(1008, "producer already connected");
    }
  } else if (req.url === "/subscribe") {
    subscribers.add(socket);
    console.log("subscriber connected");

    if (lastSessionMeta !== null) {
      socket.send(lastSessionMeta, { binary: false });
    }

    socket
      .on("error", (err) => console.error("socket error:", err.message))
      .on("close", () => {
        subscribers.delete(socket);
        console.log("subscriber disconnected");
      });
  } else {
    socket
      .on("error", (err) => console.error("socket error:", err.message))
      .close();
  }
});

process.on("SIGINT", () => {
  for (const s of [producer, ...subscribers]) {
    if (s !== null) s.close(1001, "server shutting down");
  }
  wss.close(() => {
    process.exit(0);
  });
});
