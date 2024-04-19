import { animated, useSpring } from "@react-spring/three";
import { Capsule } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { Vector3 } from "three";

export interface UserProps {
  id: number;
  position: Vector3;
  color: number;
}

const User = ({ id, position, color }: UserProps) => {
  const spring = useSpring({ position: position.toArray() });

  return (
    <RigidBody
      type="fixed"
      position={
        new Vector3(spring.position[0], spring.position[1], spring.position[2])
      }
      colliders="trimesh"
    >
      <animated.group position={spring.position}>
        <Capsule args={[0.3, 0.5, 4, 12]}>
          <pointLight intensity={2} />
          <meshPhongMaterial
            color={color}
            attach="material"
            shininess={5}
            flatShading
          />
        </Capsule>
      </animated.group>
    </RigidBody>
  );
};

export default User;
