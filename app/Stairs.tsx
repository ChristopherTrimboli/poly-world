import { useEffect, useRef } from "react";
import { Mesh } from "three";
import { RigidBody } from "@react-three/rapier";
import { Plane } from "@react-three/drei";

const Stairs = () => {
  const planeRef = useRef<Mesh>(null);

  // create stair treads with plane geometry
  useEffect(() => {
    if (planeRef.current) {
      const plane = planeRef.current;
      for (let i = 1; i < 5000; i++) {
        // alternate between tread and riser
        const isRiser = i % 2 === 0;
        if (isRiser) {
          const riser = plane.clone();
          riser.position.y = i / 2;
          riser.position.z = -(i / 2);
          plane.parent.add(riser);
        } else {
          // is tread
          const tread = plane.clone();
          tread.position.y = i / 2;
          tread.position.z = -(i / 2);
          tread.rotation.x = -Math.PI / 2;
          plane.parent.add(tread);
        }
      }
    }
  }, [planeRef]);

  return (
    <RigidBody position={[0, 0, 0]} lockTranslations lockRotations>
      {new Array(10).fill(0).map((_, i) => (
        <RigidBody
          key={i}
          position={[0, i, -i]}
          rotation={[i % 2 === 0 ? Math.PI / 2 : 0, 0, 0]}
          lockRotations
          lockTranslations
        >
          <Plane args={[1, 1]} ref={planeRef}>
            <meshBasicMaterial />
          </Plane>
        </RigidBody>
      ))}
    </RigidBody>
  );
};

export default Stairs;
