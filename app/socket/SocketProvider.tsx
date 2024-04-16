import { useEffect, useRef, useState } from "react";
import { SocketContext } from "./SocketContext";

const SocketProvider = ({ children }) => {
  const socket = useRef<WebSocket>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (socket.current) return;

    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL);

    socket.current = ws;

    ws.onopen = () => {
      console.log("connected");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      console.log("message", event.data);
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
