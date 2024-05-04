import { Box } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { Mesh, Vector3 } from "three";

interface GrenadeProps {
  throwPosition: Vector3;
  throwDirection: Vector3;
  disposeGrenade: () => void;
}

const Grenade = ({
  throwPosition,
  throwDirection,
  disposeGrenade,
}: GrenadeProps) => {
  const grenadeMeshRef = useRef<Mesh>(null);
  const grenadeRigidBodyRef = useRef<RapierRigidBody>(null);
  const [bounceCount, setBounceCount] = useState(0);

  useEffect(() => {
    // throw grenade in direction
    if (grenadeRigidBodyRef.current) {
      grenadeRigidBodyRef.current.setLinvel(throwDirection, true);
    }
  }, [throwDirection]);

  const handleCollision = () => {
    setBounceCount((prev) => prev + 1);
    // explode
    if (grenadeMeshRef.current) {
      (grenadeMeshRef.current.material as any).color.set("red");
      if (bounceCount > 5) {
        disposeGrenade();
      }
    }
  };

  return (
    <RigidBody
      ref={grenadeRigidBodyRef}
      position={throwPosition}
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
