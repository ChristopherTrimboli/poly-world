import { useEffect, useRef, useState } from "react";
import { SocketContext } from "./SocketContext";
import { SocketMessageType } from "../../socket/types";

const SocketProvider = ({ children }) => {
  const socket = useRef<WebSocket & { id: number }>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (socket.current) return;

    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL) as WebSocket & {
      id: number;
    };

    ws.id = null;

    socket.current = ws;

    ws.onopen = () => {
      console.log("connected");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const reader = new FileReader();

      reader.onload = function () {
        const [type, param1, param2, param3, param4] = new Float32Array(
          reader.result as ArrayBuffer
        );
        if (type === SocketMessageType.Join) {
          console.log("join", param1, param2);
          socket.current.id = param1;
          setTimeout(() => {
            socket.current.send(
              new Float32Array([SocketMessageType.UserList]).buffer
            );
          }, 1000);
        }
      };

      if (event.data instanceof Blob && reader.readyState === reader.EMPTY) {
        reader.readAsArrayBuffer(event.data);
      }
    };

    ws.onclose = () => {
      console.log("disconnected");
      socket.current = null;
      setIsConnected(false);
    };

    return () => {
      if (ws.readyState === ws.OPEN) {
        ws.close();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
