"use client";

import { Canvas } from "@react-three/fiber";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  KeyboardControls,
  KeyboardControlsEntry,
  Stars,
  StatsGl,
} from "@react-three/drei";
import { Suspense, useEffect } from "react";
import { Euler, Vector3 } from "three";
import { Physics } from "@react-three/rapier";
import Tree from "./Tree";
import Terrain from "./Terrain";
import UsersManager from "./UsersManager";
import Character from "./Character";
import Thruster from "./Thruster";

// types for keyboard controls
export enum Controls {
  forward = "forward",
  backward = "backward",
  leftward = "leftward",
  rightward = "rightward",
  jump = "jump",
  run = "run",
  action1 = "action1",
  action2 = "action2",
  action3 = "action3",
  action4 = "action4",
  action5 = "action5",
  action6 = "action6",
}

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
  { name: Controls.action4, keys: ["KeyF"] },
  { name: Controls.action5, keys: ["KeyQ"] },
  { name: Controls.action6, keys: ["KeyE"] },
];

const SceneContent = () => {
  return (
    <group>
      <Stars />
      <Physics>
        <Suspense fallback={null}>
          <Terrain />
        </Suspense>

        <Character />

        <UsersManager />

        <Thruster />

        {/* trees */}
        <Tree position={new Vector3(10, 0, 0)} rotation={new Euler()} />
        <Tree position={new Vector3(15, 0, 5)} rotation={new Euler()} />
        <Tree position={new Vector3(12, 0, 6)} rotation={new Euler()} />
      </Physics>

      {/* lights */}
      <ambientLight intensity={0.05} />
      <directionalLight
        intensity={1}
        castShadow
        shadow-mapSize-height={1024}
        shadow-mapSize-width={1024}
        shadow-camera-left={40}
        shadow-camera-right={-40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        position={[100, 80, 75]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
  );
};

const Scene = () => {
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
    <Canvas
      performance={{ min: 0.8, max: 1, debounce: 200 }}
      gl={{ antialias: true }}
    >
      <KeyboardControls map={keyboardMap}>
        <SceneContent />
      </KeyboardControls>

      <StatsGl />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Canvas>
  );
};

export default Scene;
