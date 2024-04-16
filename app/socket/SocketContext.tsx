import { createContext } from "react";

export const SocketContext = createContext<WebSocket | null>(null);
