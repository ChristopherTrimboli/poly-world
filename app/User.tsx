import { useSpring } from "@react-spring/three";
import { Capsule } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";

export interface UserProps {
  id: number;
  position: Vector3;
  color: number;
}

const User = ({ id, position, color }: UserProps) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const [positionSpring, api] = useSpring(() => ({
    positionSpring: position.toArray(),
  }));

  useEffect(() => {
    api({ positionSpring: position.toArray() });
  }, [position, api]);

  useFrame(() => {
    if (rigidBodyRef.current) {
      const currentPosition = rigidBodyRef.current.translation();
      const targetPosition = positionSpring.positionSpring.get();
      const newPosition = new Vector3(
        currentPosition[0],
        currentPosition[1],
        currentPosition[2]
      ).lerp(
        new Vector3(targetPosition[0], targetPosition[1], targetPosition[2]),
        1
      );
      rigidBodyRef.current.setTranslation(newPosition, true);
    }
  });

  return (
    <RigidBody type="fixed" colliders="hull" ref={rigidBodyRef}>
      <Capsule args={[0.3, 0.5, 4, 12]}>
        <pointLight intensity={2} />
        <meshPhongMaterial
          color={color}
          attach="material"
          shininess={5}
          flatShading
        />
      </Capsule>
    </RigidBody>
  );
};

export default User;
