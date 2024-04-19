import { SocketMessageType } from "@/socket/types";
import { useContext, useState, useEffect, useRef } from "react";
import { Vector3 } from "three";
import { SocketContext } from "./socket/SocketContext";
import User, { UserProps } from "./User";

const UsersManager = () => {
  const socket = useContext(SocketContext);
  const [users, setUsers] = useState<UserProps[]>([]);

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
              {
                id: param1,
                position: new Vector3(0, 1, 0),
                color: param2,
              },
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
              setUsers((prev) => [
                ...prev,
                {
                  id,
                  position,
                  color,
                },
              ]);
            }
            console.log("users", users);
          } else if (type === SocketMessageType.UserPosition) {
            const userIndex = users.findIndex((user) => user.id === param1);
            if (userIndex >= 0) {
              setUsers((prev) => {
                const newUsers = [...prev];
                newUsers[userIndex].position = new Vector3(
                  param2,
                  param3,
                  param4
                );
                return newUsers;
              });
            }
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
      {users.map(({ id, position, color }) => {
        return <User key={id} id={id} position={position} color={color} />;
      })}
    </>
  );
};
export default UsersManager;
