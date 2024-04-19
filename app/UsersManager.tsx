import { SocketMessageType } from "@/socket/types";
import { useContext, useState, useEffect, useRef } from "react";
import { Vector3 } from "three";
import { SocketContext } from "./socket/SocketContext";
import User, { UserProps } from "./User";

const UsersManager = () => {
  const socket = useContext(SocketContext);
  const usersRef = useRef<UserProps[]>([]);
  const [renderTrigger, setRenderTrigger] = useState(0);

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
            usersRef.current = [
              ...usersRef.current,
              {
                id: param1,
                position: new Vector3(0, 1, 0),
                color: Math.random() * 0xffffff,
              },
            ];
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
            usersRef.current = users;
          } else if (type === SocketMessageType.UserPosition) {
            const userIndex = usersRef.current.findIndex(
              (user) => user.id === param1
            );
            if (userIndex >= 0) {
              usersRef.current[userIndex].position = new Vector3(
                param2,
                param3,
                param4
              );
            }
          } else if (type === SocketMessageType.UserLeave) {
            console.log("userLeave", param1);
            usersRef.current = usersRef.current.filter(
              (user) => user.id !== param1
            );
          }
          setRenderTrigger((prev) => prev + 1); // Trigger a re-render
        };

        if (event.data instanceof Blob) {
          reader.readAsArrayBuffer(event.data);
        } else {
          console.log("received", event.data);
        }
      };
    }
  }, [socket]);

  return (
    <>
      {usersRef?.current.map(({ id, position, color }) => {
        return <User key={id} id={id} position={position} color={color} />;
      })}
    </>
  );
};
export default UsersManager;
