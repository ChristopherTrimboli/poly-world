import { RigidBody } from "@react-three/rapier";
import { useState, useEffect, useCallback, useRef } from "react";
import { BoxGeometry, MeshPhongMaterial, SphereGeometry } from "three";
import { Brush, SUBTRACTION, Evaluator } from "three-bvh-csg";

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

const evaluator = new Evaluator();

const gridSize = 10;
const gridSpacing = 10;

const Terrain = () => {
  const [chunkRefs, setChunkRefs] = useState<Brush[][]>([]);
  const chunkKeys = useRef<string[]>([]);

  useEffect(() => {
    setChunkRefs(
      new Array(gridSize).fill(null).map((_, x) => {
        return new Array(gridSize).fill(null).map((_, z) => {
          const gridBrush = new Brush(
            new BoxGeometry(gridSpacing, gridSpacing, gridSpacing, 1, 1, 1)
          );
          gridBrush.material = new MeshPhongMaterial({
            color: Math.random() * 0xffffff,
            shininess: 5,
            flatShading: true,
            side: 2,
          });

          gridBrush.position.set(
            x * gridSpacing,
            -gridSpacing / 2,
            z * gridSpacing
          );
          gridBrush.rotation.set(-Math.PI / 2, 0, 0);

          chunkKeys.current[x + z] = Math.random().toString();
          return gridBrush;
        });
      })
    );
  }, []);

  const onEditChunk = useCallback(
    (e, x: number, z: number) => {
      e.stopPropagation();
      const chunkRef = chunkRefs[x][z];
      chunkRef.updateMatrixWorld();

      sphereBrush.position.copy(e.point);
      sphereBrush.updateMatrixWorld();

      const newResultCSG = evaluator.evaluate(
        chunkRef,
        sphereBrush,
        SUBTRACTION
      );

      setChunkRefs((prev) => {
        const newChunkRefs = [...prev];
        newChunkRefs[x][z] = newResultCSG;

        return newChunkRefs;
      });
      chunkKeys.current[x + z] = Math.random().toString();
    },
    [chunkRefs]
  );

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

  return (
    <>
      {chunkRefs.map((row, x) => {
        return row.map((brush, z) => {
          return (
            <RigidBody
              type="fixed"
              colliders="trimesh"
              key={chunkKeys.current[x + z]}
            >
              <primitive object={brush} onClick={(e) => onEditChunk(e, x, z)} />
            </RigidBody>
          );
        });
      })}
    </>
  );
};

export default Terrain;
