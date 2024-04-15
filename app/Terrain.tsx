import { RigidBody } from "@react-three/rapier";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  BoxGeometry,
  MeshPhongMaterial,
  SphereGeometry,
  ObjectLoader,
  Mesh,
} from "three";
import { Brush, SUBTRACTION, Evaluator } from "three-bvh-csg";
import { openDB } from "idb";

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
    const loadChunks = async () => {
      const db = await openDB("polyworld", 1);

      for (let x = 0; x < gridSize; x++) {
        for (let z = 0; z < gridSize; z++) {
          // If the chunk is not in the database, create a new gridBrush
          const dbChunk = await db.get("chunks", `${x}-${z}`);
          if (!dbChunk) {
            const gridBrush = new Brush(
              new BoxGeometry(
                gridSpacing + 0.001,
                gridSpacing + 0.001,
                gridSpacing * 2,
                1,
                1,
                1
              )
            );
            gridBrush.material = new MeshPhongMaterial({
              color: Math.random() * 0xffffff,
              shininess: 5,
              flatShading: true,
              side: 2,
            });

            gridBrush.position.set(
              x * gridSpacing,
              -gridSpacing,
              z * gridSpacing
            );
            gridBrush.rotation.set(-Math.PI / 2, 0, 0);

            setChunkRefs((prev) => {
              const newChunkRefs = [...prev];
              newChunkRefs[x] = newChunkRefs[x] || [];
              newChunkRefs[x][z] = gridBrush;

              return newChunkRefs;
            });
            chunkKeys.current[x + z] = Math.random().toString();
          } else {
            // If the chunk is in the database, load it
            const loader = new ObjectLoader();
            const object3D = loader.parse(dbChunk);

            object3D.traverse((child) => {
              if (child instanceof Mesh) {
                // Extract the BufferGeometry from the Mesh
                const bufferGeometry = child.geometry;

                // Create a new Brush with the BufferGeometry
                const chunkRef = new Brush(bufferGeometry);
                chunkRef.material = new MeshPhongMaterial({
                  color: Math.random() * 0xffffff,
                  shininess: 5,
                  flatShading: true,
                  side: 2,
                });

                setChunkRefs((prev) => {
                  const newChunkRefs = [...prev];
                  newChunkRefs[x] = newChunkRefs[x] || [];
                  newChunkRefs[x][z] = chunkRef;

                  return newChunkRefs;
                });
                chunkKeys.current[x + z] = Math.random().toString();
              }
            });
          }
        }
      }
    };

    loadChunks();
  }, []);

  const onEditChunk = useCallback(
    async (e, x: number, z: number) => {
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

      const chunkJSON = newResultCSG.toJSON();

      const db = await openDB("polyworld", 1, {
        upgrade(db) {
          db.createObjectStore("chunks");
        },
      });

      await db.put("chunks", chunkJSON, `${x}-${z}`);

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
