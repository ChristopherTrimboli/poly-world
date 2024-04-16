import uWebSocket, { DEDICATED_DECOMPRESSOR } from "uWebSockets.js";
import dotenv from "dotenv";
import { kv } from "@vercel/kv";

dotenv.config();

export const startSocket = () => {
  try {
    const port = Number(process.env.PORT) || 9001;

    uWebSocket
      .App()
      .ws(`/*`, {
        compression: DEDICATED_DECOMPRESSOR,
        message: (ws, message, isBinary) => {
          console.log(message, isBinary);
          ws.send(message, isBinary, true);
        },
        open: (ws) => {
          console.log("A WebSocket connected.");
          ws.send("Hello from poly-world!");
        },
        close: (ws, code, message) => {
          console.log("A WebSocket disconnected.");
        },
      })
      .listen(port, (listenSocket) => {
        if (listenSocket) {
          console.log(`poly-world uWS listening on port ${port}`);
        }
      });
  } catch (e) {
    console.log(e);
  }
};
