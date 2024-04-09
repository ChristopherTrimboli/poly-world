import { Cylinder } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";
import {
  CylinderGeometry,
  Euler,
  Group,
  Mesh,
  MeshPhongMaterial,
  Vector3,
} from "three";

const TreeBranch = () => {
  return <></>;
};

const treeStumpGeo = new CylinderGeometry(0.5, 0.5, 0.5, 32);
const treeStumpMaterial = new MeshPhongMaterial({
  color: "tan",
  shininess: 5,
  flatShading: true,
});
const treeStumpMesh = new Mesh(treeStumpGeo, treeStumpMaterial);

const TreeStump = ({ position }: { position: Vector3 }) => {
  return (
    <RigidBody position={position} type="fixed">
      <primitive object={treeStumpMesh.clone()} />
    </RigidBody>
  );
};

const TreeTrunk = ({
  position,
  index,
  isStatic,
}: {
  position: Vector3;
  index: number;
  isStatic: boolean;
}) => {
  const baseRadius = 0.5;
  let radiusTop = baseRadius - index * 0.05; // Decrease radius as we go up
  let radiusBottom = baseRadius - (index - 1) * 0.05; // Decrease radius as we go up

  // Ensure the radius never goes below a certain value
  if (radiusTop < 0.1) radiusTop = 0.1;
  if (radiusBottom < 0.1) radiusBottom = 0.1;
  return (
    <RigidBody position={position} type={isStatic ? "fixed" : "dynamic"}>
      <Cylinder args={[radiusTop, radiusBottom, 2, 32]}>
        <meshPhongMaterial color="tan" shininess={5} flatShading />
      </Cylinder>
    </RigidBody>
  );
};

const Tree = ({
  position,
  rotation,
}: {
  position: Vector3;
  rotation: Euler;
}) => {
  const treeRef = useRef<Group>();
  const shakeStartTime = useRef(0);
  const originalPosition = useRef<Vector3 | null>(null);

  const [isShaking, setIsShaking] = useState<boolean>(false);

  const [tryHitCounter, setTryHitCounter] = useState<number>(0);

  const handleClick = () => {
    if (!treeRef.current) return;
    if (isShaking) return;
    if (tryHitCounter >= 5) return;
    setTryHitCounter((prev) => prev + 1);
    setIsShaking(true);
    shakeStartTime.current = Date.now();
    originalPosition.current = treeRef.current?.position.clone();
  };

  useFrame(() => {
    if (treeRef.current) {
      if (isShaking) {
        const elapsed = Date.now() - shakeStartTime.current;
        if (elapsed < 1000) {
          // Shake for 1 second
          const shakeAmount = Math.sin(elapsed / 100) * 0.001; // Adjust as needed
          treeRef.current.position.x += shakeAmount;
        } else {
          setIsShaking(false);
        }
      } else if (originalPosition.current) {
        // Gradually move the tree back to its original position
        treeRef.current.position.lerp(originalPosition.current, 0.1);
      }
    }
  });

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={handleClick}
      ref={treeRef}
    >
      <TreeStump position={new Vector3(0, 0, 0)} />
      {new Array(8).fill(null).map((_, index) => (
        <TreeTrunk
          position={new Vector3(0, 1 + index * 2, 0)}
          index={index}
          isStatic={tryHitCounter < 5}
          key={index}
        />
      ))}
      <TreeBranch />
    </group>
  );
};

export default Tree;
