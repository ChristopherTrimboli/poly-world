import uWebSocket, { DEDICATED_DECOMPRESSOR } from "uWebSockets.js";
import process from "process";

export const startSocket = () => {
  try {
    const port = Number(process.env.PORT) || 8888;
    const socket = uWebSocket
      .App()
      .ws(`/*`, {
        compression: DEDICATED_DECOMPRESSOR,
        message: (ws, message, isBinary) => {
          ws.send(message, isBinary, true);
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
