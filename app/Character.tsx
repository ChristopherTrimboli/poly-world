import { useContext, useRef, useCallback, MutableRefObject } from "react";
import { Capsule } from "@react-three/drei";
import Ecctrl, { EcctrlProps } from "../ecctrl/Ecctrl";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { SocketContext } from "./socket/SocketContext";
import { SocketMessageType } from "@/socket/types";
import { RapierRigidBody } from "@react-three/rapier";

const Character = ({
  ecctrlRef,
}: {
  ecctrlRef: MutableRefObject<EcctrlProps & RapierRigidBody>;
}) => {
  const socket = useContext(SocketContext);
  const userRef = useRef<Mesh>();
  const lastUpdate = useRef(performance.now());
  const previousPosition = useRef(new Vector3());

  const sendPosition = useCallback(
    (position: Vector3) => {
      if (socket?.readyState === WebSocket.OPEN) {
        const buffer = new Float32Array([
          SocketMessageType.UserPosition,
          socket.id,
          position.x,
          position.y,
          position.z,
        ]).buffer;

        socket.send(buffer);
      }
    },
    [socket]
  );

  useFrame(() => {
    const now = performance.now();
    const delta = now - lastUpdate.current;

    // Send position every 100ms
    if (delta >= 100 && userRef?.current) {
      const position = userRef.current.getWorldPosition(new Vector3());
      const fixedPosition = {
        x: position.x.toFixed(2),
        y: position.y.toFixed(2),
        z: position.z.toFixed(2),
      };

      const fixedPreviousPosition = {
        x: previousPosition.current.x.toFixed(2),
        y: previousPosition.current.y.toFixed(2),
        z: previousPosition.current.z.toFixed(2),
      };

      // Only send position if it has changed
      if (
        JSON.stringify(fixedPosition) !== JSON.stringify(fixedPreviousPosition)
      ) {
        sendPosition(position);
        previousPosition.current = position;
      }

      lastUpdate.current = now;
    }
  });

  return (
    <Ecctrl ref={ecctrlRef} camCollision={false} disableExternalRayForces>
      <pointLight intensity={2} />
      <Capsule args={[0.3, 0.5, 4, 12]} ref={userRef} castShadow receiveShadow>
        <meshPhongMaterial
          color={socket?.color || "red"}
          attach="material"
          shininess={5}
          flatShading
        />
      </Capsule>
    </Ecctrl>
  );
};

export default Character;
