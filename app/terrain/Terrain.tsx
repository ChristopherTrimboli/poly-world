import { ThreeEvent } from "@react-three/fiber";
import { CollisionEnterPayload, RigidBody } from "@react-three/rapier";
import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
  useMemo,
  Suspense,
} from "react";
import { BoxGeometry, Mesh, MeshPhongMaterial, SphereGeometry } from "three";
import { Brush, SUBTRACTION, Evaluator, ADDITION } from "three-bvh-csg";
import { ActionbarContext } from "../context/actionbar/ActionbarContext";
import { throttle, debounce } from "lodash";
import TerrianGems from "./Gems";

const terrainMaterial = new MeshPhongMaterial({
  color: "tan",
  shininess: 5,
  flatShading: true,
  specular: 0x222222,
});
const previewMaterial = new MeshPhongMaterial({
  color: 0x00ff00,
  wireframe: true,
});

const sphereGeo = new SphereGeometry(1.5, 6, 6);
const sphereBrush = new Brush(sphereGeo, previewMaterial);

const boxGeo = new BoxGeometry(1.5, 1.5, 1.5);
const boxBrush = new Brush(boxGeo, previewMaterial);

const evaluator = new Evaluator();
evaluator.consolidateMaterials = true;

export const gridSize = 20;
export const gridSpacing = 10;

const TerrianShapeTools = ({
  shapeBrushRef,
}: {
  shapeBrushRef: React.MutableRefObject<Brush | null>;
}) => {
  const { activeActionbar, editType, editSize } = useContext(ActionbarContext);

  const shapeBrush = useMemo(() => {
    if (activeActionbar === "1") {
      return sphereBrush;
    } else if (activeActionbar === "2") {
      return boxBrush;
    } else {
      return null;
    }
  }, [activeActionbar]);

  useEffect(() => {
    if (!shapeBrushRef.current) return;
    shapeBrushRef.current.material = new MeshPhongMaterial({
      color: editType === "add" ? 0x00ff00 : 0xff0000,
      wireframe: true,
    });
  }, [editType, shapeBrushRef]);

  useEffect(() => {
    if (shapeBrush) {
      shapeBrush.scale.set(editSize, editSize, editSize);
    }
  }, [editSize, shapeBrush]);

  return (
    <>{shapeBrush && <primitive object={shapeBrush} ref={shapeBrushRef} />}</>
  );
};

const Terrain = () => {
  const [chunkRefs, setChunkRefs] = useState<Brush[][]>([]);
  const chunkKeys = useRef<string[]>([]);
  const shapeBrushRef = useRef<Brush>();

  const { editType } = useContext(ActionbarContext);

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
      if (!shapeBrushRef.current) return;
      const chunkRef = chunkRefs[x][z];
      chunkRef.updateMatrixWorld();

      shapeBrushRef.current.position.copy(e.point);
      shapeBrushRef.current.updateMatrixWorld();
      shapeBrushRef.current.material = terrainMaterial;

      const newResultCSG = evaluator.evaluate(
        chunkRef,
        shapeBrushRef.current,
        editType === "subtract" ? SUBTRACTION : ADDITION
      );

      shapeBrushRef.current.material = new MeshPhongMaterial({
        color: editType === "add" ? 0x00ff00 : 0xff0000,
        wireframe: true,
      });

      setChunkRefs((prev) => {
        const newChunkRefs = [...prev];
        newChunkRefs[x][z] = newResultCSG;

        return newChunkRefs;
      });
      chunkKeys.current[x + z] = Math.random().toString();
    },
    [chunkRefs, editType]
  );

  const previewEdit = useCallback((e: ThreeEvent<Mesh>) => {
    e.stopPropagation();
    if (!shapeBrushRef.current) return;
    const point = e.point;
    shapeBrushRef.current.position.copy(point);
  }, []);

  const setTerrainChunk = useCallback(
    debounce((chunk: Brush, x: number, z: number) => {
      chunkKeys.current[x + z] = Math.random().toString();
    }, 2000),
    [chunkRefs]
  );

  const handleCollision = useCallback(
    throttle((e: CollisionEnterPayload, x: number, z: number) => {
      if (e.rigidBodyObject.userData.type === "grenade") {
        const chunkRef = chunkRefs[x][z];
        chunkRef.updateMatrixWorld();

        const grenadePosition = e.other.rigidBodyObject.position;

        const brush = new Brush(new SphereGeometry(1, 4, 4), terrainMaterial);

        brush.position.copy(grenadePosition);
        brush.updateMatrixWorld();

        const newResultCSG = evaluator.evaluate(chunkRef, brush, SUBTRACTION);
        setChunkRefs((prev) => {
          const newChunkRefs = [...prev];
          newChunkRefs[x][z] = newResultCSG;

          return newChunkRefs;
        });
        setTerrainChunk(newResultCSG, x, z);
      }
    }, 100),
    [chunkRefs, setTerrainChunk]
  );

  return (
    <>
      {chunkRefs.map((row, x) => {
        return row.map((brush, z) => {
          return (
            <Suspense key={chunkKeys.current[x + z]} fallback={null}>
              <RigidBody
                type="fixed"
                colliders="trimesh"
                onCollisionEnter={(e) => handleCollision(e, x, z)}
              >
                <primitive
                  object={brush}
                  onClick={(e: ThreeEvent<Mesh>) => onEditChunk(e, x, z)}
                  onPointerMove={previewEdit}
                  receiveShadow
                  castShadow
                />
              </RigidBody>
            </Suspense>
          );
        });
      })}
      <TerrianShapeTools shapeBrushRef={shapeBrushRef} />
      <TerrianGems />
    </>
  );
};

export default Terrain;
