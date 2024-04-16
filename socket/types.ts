export enum SocketMessageType {
  UserJoin = 0, // type, id, color
  UserLeave = 1, // type, id
  UserList = 2, // type, {id, x, y, z, color}[]
  UserPosition = 3, // type, id, x, y, z
  UserRotation = 4, // type, id, x, y, z
}
