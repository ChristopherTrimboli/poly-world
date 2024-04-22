"use client";

import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, Stars, StatsGl } from "@react-three/drei";
import { Suspense } from "react";
import { Euler, Vector3 } from "three";
import { Physics } from "@react-three/rapier";
import Tree from "./Tree";
import Terrain from "./Terrain";
import UsersManager from "./UsersManager";
import Character from "./Character";
import Thruster from "./Thruster";
import Ufo from "./Ufo";

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

        <Ufo position={new Vector3(5, 2, 20)} />

        {/* trees */}
        <Tree position={new Vector3(10, 0, 0)} rotation={new Euler()} />
        <Tree position={new Vector3(15, 0, 5)} rotation={new Euler()} />
        <Tree position={new Vector3(12, 0, 6)} rotation={new Euler()} />
      </Physics>

      {/* lights */}
      <ambientLight intensity={0.05} />
      <directionalLight
        intensity={0.75}
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
  return (
    <Canvas
      performance={{ min: 0.8, max: 1, debounce: 200 }}
      gl={{ antialias: true }}
    >
      <SceneContent />

      <StatsGl />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Canvas>
  );
};

export default Scene;
