import uWebSocket, { DEDICATED_DECOMPRESSOR } from "uWebSockets.js";

export const startSocket = () => {
  try {
    const socket = uWebSocket
      .App()
      .ws(`/*`, {
        compression: DEDICATED_DECOMPRESSOR,
        message: (ws, message, isBinary) => {
          ws.send(message, isBinary, true);
        },
      })
      .listen(8888, (listenSocket) => {
        if (listenSocket) {
          console.log("poly-world uWS listening on port 8888");
        }
      });
  } catch (e) {
    console.log(e);
  }
};
