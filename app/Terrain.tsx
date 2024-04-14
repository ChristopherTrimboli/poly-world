import { useKeyboardControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  BufferGeometry,
  LineBasicMaterial,
  Line,
  BoxGeometry,
  CatmullRomCurve3,
  MeshPhongMaterial,
  SphereGeometry,
  Vector3,
} from "three";
import { Brush, SUBTRACTION, ADDITION, Evaluator } from "three-bvh-csg";
import { Controls } from "./Scene";
import { useJoystickControls } from "ecctrl";

// Cave tunnel curve
const caveCurve = new CatmullRomCurve3([
  new Vector3(-5, 0, -5), // Start at ground level
  new Vector3(-10, -8, -10), // Go into the ground
  new Vector3(-20, 0, -20), // Come out of the ground
]);
const cavePoints = caveCurve.getPoints(10);

// sphere brush for CSG operations
const sphereGeo = new SphereGeometry(2, 6, 6);
const sphereMaterial = new MeshPhongMaterial({
  color: "tan",
  shininess: 5,
  flatShading: true,
  specular: 0x222222,
});
const sphereBrush = new Brush(sphereGeo);
sphereBrush.material = sphereMaterial;

// terrain brush for CSG operations
const terrainGeo = new BoxGeometry(50, 50, 100, 1, 1, 1);
const terrainMaterial = new MeshPhongMaterial({
  color: 0x00ff00,
  shininess: 5,
  flatShading: true,
  side: 2,
});
const terrainBrush = new Brush(terrainGeo);
terrainBrush.material = terrainMaterial;
terrainBrush.position.set(0, -50, 0);
terrainBrush.rotation.set(-Math.PI / 2, 0, 0);

const evaluator = new Evaluator();
evaluator.consolidateMaterials = true;

const Terrain = () => {
  // key to force re-render of Rigidbody on terrain
  const [key, setKey] = useState(0);

  const { raycaster, camera, scene, mouse, gl } = useThree();
  const terrianBrushRef = useRef<Brush>(null!);

  const qPressed = useKeyboardControls<Controls>((state) => state.action5);
  const ePressed = useKeyboardControls<Controls>((state) => state.action6);
  const joystickButton2Pressed = useJoystickControls(
    (state) => state.curButton2Pressed
  );

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
          terrianBrushRef.current,
          sphereBrush,
          SUBTRACTION
        );
      } else if (type === "sphereAdd") {
        sphereBrush.position.copy(point);
        sphereBrush.updateMatrixWorld();

        newResultCSG = evaluator.evaluate(
          terrianBrushRef.current,
          sphereBrush,
          ADDITION
        );
      }
      terrianBrushRef.current = newResultCSG!;

      setKey((prevKey) => prevKey + 1);
    },
    [camera, mouse, raycaster, scene.children]
  );

  useEffect(() => {
    // Edit terrain on key press
    if (qPressed || joystickButton2Pressed) {
      onEditTerrain("sphereDelete");
    } else if (ePressed) {
      onEditTerrain("sphereAdd");
    }
  }, [ePressed, joystickButton2Pressed, onEditTerrain, qPressed]);

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

    let resultCSG = terrainBrush;

    // create a cave tunnel
    for (let i = 0; i < cavePoints.length; i++) {
      sphereBrush.position.copy(cavePoints[i]);
      sphereBrush.updateMatrixWorld();
      resultCSG = evaluator.evaluate(resultCSG, sphereBrush, SUBTRACTION);
    }

    terrianBrushRef.current = resultCSG;

    // helper line
    const lineGeometry = new BufferGeometry().setFromPoints(cavePoints);
    const lineMaterial = new LineBasicMaterial({ color: 0xff0000 });
    const line = new Line(lineGeometry, lineMaterial);
    scene.add(line);
  }, [camera, raycaster, scene]);

  return (
    <>
      {terrianBrushRef?.current && (
        <RigidBody key={key} type="fixed" colliders="trimesh">
          <primitive object={terrianBrushRef.current} />
        </RigidBody>
      )}
    </>
  );
};

export default Terrain;
