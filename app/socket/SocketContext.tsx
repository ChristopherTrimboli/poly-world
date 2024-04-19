import { createContext } from "react";

export interface WebSocketWithData extends WebSocket {
  id: number | null;
  color: number | null;
}

export const SocketContext = createContext<WebSocketWithData | null>(null);
