import { type WebSocket, WebSocketServer } from "ws";

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

  socket
    .on("error", (err) => console.error("socket error:", err.message))
    .on("close", () => console.log("socket closed:", req.url));
  socket.close();
});
