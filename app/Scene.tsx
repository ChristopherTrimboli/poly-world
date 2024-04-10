"use client";

import { Canvas, useThree } from "@react-three/fiber";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  Capsule,
  KeyboardControls,
  KeyboardControlsEntry,
  Stars,
  StatsGl,
  useKeyboardControls,
} from "@react-three/drei";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import {
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  Euler,
  Line,
  LineBasicMaterial,
  MeshPhongMaterial,
  SphereGeometry,
  Vector3,
} from "three";
import { Physics, RigidBody } from "@react-three/rapier";
import Ecctrl from "ecctrl";
import { SUBTRACTION, Brush, Evaluator, ADDITION } from "three-bvh-csg";
import Tree from "./Tree";

// types for keyboard controls
enum Controls {
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

// Cave tunnel curve
const caveCurve = new CatmullRomCurve3([
  new Vector3(-5, 0, -5), // Start at ground level
  new Vector3(-10, -8, -10), // Go into the ground
  new Vector3(-20, 0, -20), // Come out of the ground
]);
const cavePoints = caveCurve.getPoints(20);

// sphere brush for CSG operations
const sphereGeo = new SphereGeometry(3, 6, 6);
const sphereMaterial = new MeshPhongMaterial({
  color: "tan",
  shininess: 5,
  flatShading: true,
  specular: 0x222222,
});
const sphereBrush = new Brush(sphereGeo);
sphereBrush.material = sphereMaterial;
sphereBrush.position.set(0, 0, 0);

// terrain brush for CSG operations
const terrainGeo = new BoxGeometry(50, 50, 100, 1, 1, 1);
const terrainMaterial = new MeshPhongMaterial({
  color: 0x00ff00,
  shininess: 5,
  flatShading: true,
});
const terrainBrush = new Brush(terrainGeo);
terrainBrush.material = terrainMaterial;
terrainBrush.position.set(0, -50, 0);
terrainBrush.rotation.set(-Math.PI / 2, 0, 0);

const evaluator = new Evaluator();

const Terrain = () => {
  // key to force re-render of Rigidbody on terrain
  const [key, setKey] = useState(0);

  const { raycaster, camera, scene, mouse, gl } = useThree();
  const terrianBrush = useRef<Brush>(null!);

  const qPressed = useKeyboardControls<Controls>((state) => state.action5);
  const ePressed = useKeyboardControls<Controls>((state) => state.action6);

  // track mouse for terrain editing raycasting
  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    gl.domElement.addEventListener("mousemove", onMouseMove);

    return () => {
      gl.domElement.removeEventListener("mousemove", onMouseMove);
    };
  }, [mouse, gl]);

  const onEditTerrain = useCallback(
    async (type: "sphereDelete" | "sphereAdd") => {
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children);

      const point = intersects?.[0]?.point;

      if (!point) {
        return;
      }

      let newResultCSG;

      if (type === "sphereDelete") {
        sphereBrush.position.copy(point);
        sphereBrush.updateMatrixWorld();

        newResultCSG = evaluator.evaluate(
          terrianBrush.current,
          sphereBrush,
          SUBTRACTION
        );
      } else if (type === "sphereAdd") {
        sphereBrush.position.copy(point);
        sphereBrush.updateMatrixWorld();

        newResultCSG = evaluator.evaluate(
          terrianBrush.current,
          sphereBrush,
          ADDITION
        );
      }
      terrianBrush.current = newResultCSG!;

      setKey((prevKey) => prevKey + 1);
    },
    [camera, mouse, raycaster, scene.children]
  );

  useEffect(() => {
    // Edit terrain on key press
    if (qPressed) {
      onEditTerrain("sphereDelete");
    } else if (ePressed) {
      onEditTerrain("sphereAdd");
    }
  }, [ePressed, onEditTerrain, qPressed]);

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

  useEffect(() => {
    terrainBrush.updateMatrixWorld();
    sphereBrush.updateMatrixWorld();

    let resultCSG = evaluator.evaluate(terrainBrush, sphereBrush, SUBTRACTION);

    // create a cave tunnel
    for (let i = 0; i < cavePoints.length; i++) {
      sphereBrush.position.copy(cavePoints[i]);
      sphereBrush.updateMatrixWorld();
      resultCSG = evaluator.evaluate(resultCSG, sphereBrush, SUBTRACTION);
    }

    terrianBrush.current = resultCSG;

    // helper line
    const lineGeometry = new BufferGeometry().setFromPoints(cavePoints);
    const lineMaterial = new LineBasicMaterial({ color: 0xff0000 });
    const line = new Line(lineGeometry, lineMaterial);
    scene.add(line);
  }, [camera, raycaster, scene]);

  return (
    <>
      {terrianBrush?.current && (
        <RigidBody key={key} type="fixed" colliders="trimesh">
          <primitive object={terrianBrush.current} />
        </RigidBody>
      )}
    </>
  );
};

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
        <KeyboardControls map={keyboardMap}>
          {/* terrain */}
          <Suspense fallback={null}>
            <Terrain />
          </Suspense>

          {/* player */}
          <Ecctrl camCollision={false}>
            <pointLight intensity={2} />
            <Capsule args={[0.3, 0.5, 4, 12]}>
              <meshPhongMaterial
                color="red"
                attach="material"
                shininess={5}
                flatShading
              />
            </Capsule>
          </Ecctrl>

          {/* trees */}
          <Tree position={new Vector3(10, 0, 0)} rotation={new Euler()} />
          <Tree position={new Vector3(15, 0, 5)} rotation={new Euler()} />
          <Tree position={new Vector3(-20, 0, 2)} rotation={new Euler()} />
          <Tree position={new Vector3(12, 0, 6)} rotation={new Euler()} />

          {/* lights */}
          <ambientLight intensity={0.01} />
          <directionalLight
            intensity={0.7}
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
        </KeyboardControls>
      </Physics>
    </group>
  );
};

const Scene = () => {
  return (
    <Canvas
      performance={{ min: 0.8, max: 1, debounce: 200 }}
      gl={{ antialias: false }}
    >
      <SceneContent />

      <StatsGl />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Canvas>
  );
};

export default Scene;
