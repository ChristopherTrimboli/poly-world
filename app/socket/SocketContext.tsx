import { createContext } from "react";

export const SocketContext = createContext<(WebSocket & { id: number }) | null>(
  null
);
