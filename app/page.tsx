"use client";

import { KeyboardControls, KeyboardControlsEntry } from "@react-three/drei";
import Overlay from "./overlay/Overlay";
import Scene from "./Scene";
import SocketProvider from "./socket/SocketProvider";
import { Controls } from "./types";
import { useEffect } from "react";

const keyboardMap: KeyboardControlsEntry<Controls>[] = [
  { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
  { name: Controls.backward, keys: ["ArrowDown", "KeyS"] },
  { name: Controls.leftward, keys: ["ArrowLeft", "KeyA"] },
  { name: Controls.rightward, keys: ["ArrowRight", "KeyD"] },
  { name: Controls.jump, keys: ["Space"] },
  { name: Controls.run, keys: ["Shift"] },
  { name: Controls.action1, keys: ["1"] },
  { name: Controls.action2, keys: ["2"] },
  { name: Controls.action3, keys: ["3"] },
  { name: Controls.action4, keys: ["4"] },
  { name: Controls.action5, keys: ["5"] },
  { name: Controls.action6, keys: ["6"] },
  { name: Controls.action7, keys: ["7"] },
  { name: Controls.action8, keys: ["8"] },
  { name: Controls.action9, keys: ["9"] },
  { name: Controls.action0, keys: ["0"] },
  { name: Controls.actionF, keys: ["KeyF"] },
  { name: Controls.actionQ, keys: ["KeyQ"] },
  { name: Controls.actionE, keys: ["KeyE"] },
];

export default function PolyWorld() {
  useEffect(() => {
    // Prevent context menu on right mouse click
    const preventDefaultOnContextMenu = (event: any) => {
      event.preventDefault();
    };

    window.addEventListener("contextmenu", preventDefaultOnContextMenu);

    return () => {
      window.removeEventListener("contextmenu", preventDefaultOnContextMenu);
    };
  }, []);

  return (
    <SocketProvider>
      <KeyboardControls map={keyboardMap}>
        <Overlay />
        <Scene />
      </KeyboardControls>
    </SocketProvider>
  );
}
