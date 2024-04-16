import { SocketMessageType } from "@/socket/types";
import { Capsule } from "@react-three/drei";
import { useContext, useState, useEffect } from "react";
import { Vector3 } from "three";
import { SocketContext } from "./socket/SocketContext";
import { RigidBody } from "@react-three/rapier";

const UsersManager = () => {
  const socket = useContext(SocketContext);
  const [users, setUsers] = useState<
    { id: number; position: Vector3; color: number }[]
  >([]);

  useEffect(() => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.onmessage = (event) => {
        const reader = new FileReader();

        reader.onload = function () {
          const [type, param1, param2, param3, param4] = new Float32Array(
            reader.result as ArrayBuffer
          );

          if (type === SocketMessageType.UserJoin) {
            console.log("userJoin", param1, param2);
            setUsers((prev) => [
              ...prev,
              { id: param1, position: new Vector3(0, 1, 0), color: param2 },
            ]);
          } else if (type === SocketMessageType.UserList) {
            const data = new Float32Array(reader.result as ArrayBuffer);

            const users = [];
            for (let i = 1; i < data.length; i += 5) {
              const id = data[i];
              const color = data[i + 1];
              const position = new Vector3(
                data[i + 2],
                data[i + 3],
                data[i + 4]
              );
              users.push({ id, color, position });
            }
            console.log("users", users);
            setUsers(users);
          } else if (type === SocketMessageType.UserPosition) {
            setUsers((prev) => {
              const userIndex = prev.findIndex((user) => user.id === param1);
              if (userIndex >= 0) {
                prev[userIndex].position = new Vector3(param2, param3, param4);
              } else {
                prev.push({
                  id: param1,
                  position: new Vector3(param2, param3, param4),
                  color: Math.random() * 0xffffff,
                });
              }

              return [...prev];
            });
          } else if (type === SocketMessageType.UserLeave) {
            console.log("userLeave", param1);
            setUsers((prev) => prev.filter((user) => user.id !== param1));
          }
        };

        if (event.data instanceof Blob) {
          reader.readAsArrayBuffer(event.data);
        } else {
          console.log("received", event.data);
        }
      };
    }
  }, [socket, users]);

  return (
    <>
      {
        // other users
        users?.map(({ id, position, color }) => (
          <RigidBody
            key={id}
            type="fixed"
            position={position}
            colliders="trimesh"
          >
            <Capsule args={[0.3, 0.5, 4, 12]}>
              <meshPhongMaterial
                color={color}
                attach="material"
                shininess={5}
                flatShading
              />
            </Capsule>
          </RigidBody>
        ))
      }
    </>
  );
};
export default UsersManager;
