import { Box } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { Mesh, Vector3 } from "three";

const Grenade = ({ position }: { position: Vector3 }) => {
  const grenadeMeshRef = useRef<Mesh>(null);
  const grenadeRigidBodyRef = useRef<RapierRigidBody>(null);

  useEffect(() => {
    // throw grenade in direction
    if (grenadeRigidBodyRef.current) {
      grenadeRigidBodyRef.current.setLinvel(position, true);
    }
  });

  const handleCollision = () => {
    // explode
    if (grenadeMeshRef.current) {
      (grenadeMeshRef.current.material as any).color.set("red");
    }
  };

  return (
    <RigidBody
      ref={grenadeRigidBodyRef}
      position={position}
      type="dynamic"
      onCollisionEnter={handleCollision}
      userData={{ type: "grenade" }}
    >
      <Box ref={grenadeMeshRef} args={[0.4, 0.4, 0.4]} castShadow>
        <meshStandardMaterial color="gray" />
      </Box>
    </RigidBody>
  );
};

export default Grenade;
