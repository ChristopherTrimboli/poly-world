"use client";

import Overlay from "./Overlay";
import Scene from "./Scene";
import SocketProvider from "./socket/SocketProvider";

export default function PolyWorld() {
  return (
    <SocketProvider>
      <Overlay />
      <Scene />
    </SocketProvider>
  );
}
