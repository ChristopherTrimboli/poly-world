import { Box } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { Mesh, Vector3 } from "three";

const Thruster = () => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (rigidBodyRef.current) {
      const position = meshRef.current.getWorldPosition(new Vector3());
      if (position.y < 1) {
        rigidBodyRef.current.setLinvel(new Vector3(0, 0.5, 0), true);
      } else {
        rigidBodyRef.current.setLinvel(new Vector3(1, 0, 0), true);
      }
    }
  });

  return (
    <RigidBody ref={rigidBodyRef} type="dynamic" position={[0, 2, 7]}>
      <Box args={[1, 1, 1]} ref={meshRef}>
        <meshStandardMaterial color="yellow" />
      </Box>
    </RigidBody>
  );
};
export default Thruster;
