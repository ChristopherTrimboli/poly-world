import { ThreeEvent } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
  useMemo,
} from "react";
import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  SphereGeometry,
} from "three";
import { Brush, SUBTRACTION, Evaluator } from "three-bvh-csg";
import { ActionbarContext } from "./context/actionbar/ActionbarContext";

const terrainMaterial = new MeshPhongMaterial({
  color: "tan",
  shininess: 5,
  flatShading: true,
  specular: 0x222222,
});
const sphereGeo = new SphereGeometry(1.5, 6, 6);
const sphereBrush = new Brush(sphereGeo);
sphereBrush.material = terrainMaterial;

const boxGeo = new BoxGeometry(1.5, 1.5, 1.5);
const boxBrush = new Brush(boxGeo);
boxBrush.material = terrainMaterial;

const wireframeMaterial = new MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});
const previewSphere = new Mesh(sphereGeo, wireframeMaterial);
const previewBox = new Mesh(boxGeo, wireframeMaterial);

const evaluator = new Evaluator();

const gridSize = 20;
const gridSpacing = 10;

const Terrain = () => {
  const [chunkRefs, setChunkRefs] = useState<Brush[][]>([]);
  const chunkKeys = useRef<string[]>([]);
  const previewMeshRef = useRef<Mesh>();

  const { activeActionbar } = useContext(ActionbarContext);

  const shapeBrush = useMemo(() => {
    if (activeActionbar === "1") {
      return sphereBrush;
    } else if (activeActionbar === "2") {
      return boxBrush;
    } else {
      return null;
    }
  }, [activeActionbar]);

  const previewShapeBrush = useMemo(() => {
    if (activeActionbar === "1") {
      return previewSphere;
    } else if (activeActionbar === "2") {
      return previewBox;
    } else {
      return null;
    }
  }, [activeActionbar]);

  useEffect(() => {
    const loadChunks = async () => {
      for (let x = 0; x < gridSize; x++) {
        for (let z = 0; z < gridSize; z++) {
          // If the chunk is not in the database, create a new gridBrush
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

          const randomHeight = Math.random() * 6 - 12;

          gridBrush.position.set(
            x * gridSpacing,
            randomHeight,
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
        }
      }
    };

    loadChunks();
  }, []);

  const onEditChunk = useCallback(
    async (e: ThreeEvent<Mesh>, x: number, z: number) => {
      e.stopPropagation();
      if (!shapeBrush) return;
      const chunkRef = chunkRefs[x][z];
      chunkRef.updateMatrixWorld();

      shapeBrush.position.copy(e.point);
      shapeBrush.updateMatrixWorld();

      const newResultCSG = evaluator.evaluate(
        chunkRef,
        shapeBrush,
        SUBTRACTION
      );

      setChunkRefs((prev) => {
        const newChunkRefs = [...prev];
        newChunkRefs[x][z] = newResultCSG;

        return newChunkRefs;
      });
      chunkKeys.current[x + z] = Math.random().toString();
    },
    [chunkRefs, shapeBrush]
  );

  const previewEdit = useCallback((e: ThreeEvent<Mesh>) => {
    e.stopPropagation();
    if (!previewMeshRef.current) return;
    const point = e.point;
    previewMeshRef.current.position.copy(point);
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
              <primitive
                object={brush}
                onClick={(e: ThreeEvent<Mesh>) => onEditChunk(e, x, z)}
                onPointerMove={previewEdit}
                receiveShadow
                castShadow
              />
            </RigidBody>
          );
        });
      })}
      {previewShapeBrush && (
        <primitive object={previewShapeBrush} ref={previewMeshRef} />
      )}
    </>
  );
};

export default Terrain;
