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
        .on("message", (data) => {
          if (lastSessionMeta === null) {
            lastSessionMeta = data.toString();
          }

          for (const s of subscribers) {
            if (s.readyState === WebSocket.OPEN) s.send(data);
          }
        })
        .on("error", (err) => console.error("socket error:", err.message))
        .on("close", () => {
          producer = null;
          lastSessionMeta = null;
        });
    } else {
      socket
        .on("error", (err) => console.error("socket error:", err.message))
        .close(1008, "producer already connected");
    }
  } else if (req.url === "/subscribe") {
    subscribers.add(socket);
    console.log("subscriber connected");

    socket
      .on("error", (err) => console.error("socket error:", err.message))
      .on("close", () => subscribers.delete(socket));
  } else {
    socket
      .on("error", (err) => console.error("socket error:", err.message))
      .close();
  }
});
