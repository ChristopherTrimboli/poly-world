import uWebSocket from "uWebSockets.js";
import dotenv from "dotenv";
import { SocketMessageType } from "../types";

dotenv.config();

let idCounter = 0;

const users = new Map<
  number,
  {
    id: number;
    socket: uWebSocket.WebSocket<unknown>;
    postion: [number, number, number];
    rotation: [number, number, number];
    color: number;
  }
>();

export const startSocket = () => {
  try {
    const port = Number(process.env.PORT) || 9001;

    uWebSocket
      .App()
      .ws(`/*`, {
        message: (ws, message, isBinary) => {
          const [type, param1, param2, param3, param4] = new Float32Array(
            message
          );

          if (type === SocketMessageType.UserPosition) {
            const user = users.get(param1);
            if (user) {
              users.forEach((user) => {
                if (user.socket !== ws) {
                  user.socket.send(message, isBinary);
                }
              });
              users.set(param1, {
                ...user,
                postion: [param2, param3, param4],
              });
            } else {
              console.log("User not found");
            }
          }
        },
        open: (ws) => {
          const newId = idCounter++;
          const color = Math.random() * 0xffffff;
          users.set(newId, {
            id: newId,
            socket: ws,
            postion: [0, 0, 0],
            rotation: [0, 0, 0],
            color: Math.random() * 0xffffff,
          });
          ws.send(
            new Float32Array([SocketMessageType.UserJoin, newId, color]).buffer,
            true
          );
          users.forEach((user) => {
            if (user.id !== newId) {
              user.socket.send(
                new Float32Array([SocketMessageType.UserJoin, newId, color])
                  .buffer,
                true
              );
            }
          });
          ws.send("Hello from poly-world!");
          console.log(`WebSocket connected. ID: ${newId}`);
        },
        close: (ws, code, message) => {
          const user = Array.from(users.entries()).find(
            ([, { socket }]) => socket === ws
          );
          if (user) {
            users.delete(user[0]);
            users.forEach((u) => {
              u.socket.send(
                new Float32Array([SocketMessageType.UserLeave, user[0]]).buffer,
                true
              );
            });
            console.log(`WebSocket disconnected. ID: ${user[0]}`);
          }
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
