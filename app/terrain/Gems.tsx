import { Icosahedron } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { MutableRefObject, useEffect, useState } from "react";
import { Vector3 } from "three";
import { gridSize, gridSpacing } from "./Terrain";

const TerrianGems = () => {
  const [gems, setGems] = useState<
    {
      position: Vector3;
      ref: MutableRefObject<RapierRigidBody | undefined>;
      isLocked: boolean;
    }[]
  >([]);

  useEffect(() => {
    const newGems = [];
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        if (Math.random() > 0.5) {
          newGems.push({
            position: new Vector3(
              x * gridSpacing,
              Math.random() * 6 - 8,
              z * gridSpacing
            ),
            ref: { current: undefined },
            isLocked: true,
          });
        }
      }
    }
    setGems(newGems);
  }, []);

  return (
    <>
      {gems.map((gem, index) => (
        <RigidBody
          key={index}
          ref={gem.ref}
          type="dynamic"
          position={gem.position}
          lockTranslations={gem.isLocked}
          lockRotations={gem.isLocked}
          onCollisionExit={() => {
            gem.isLocked = false;
            console.log("collision exit");
          }}
        >
          <Icosahedron args={[1, 0]}>
            <meshPhongMaterial color="#D09BDB" specular={10} />
          </Icosahedron>
        </RigidBody>
      ))}
    </>
  );
};

export default TerrianGems;
