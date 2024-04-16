export enum SocketMessageType {
  Join = 0, // type, id, color, x, y, z
  UserJoin = 1, // type, id, color
  UserLeave = 2, // type, id
  UserList = 3, // type, {id, x, y, z, color}[]
  UserPosition = 4, // type, id, x, y, z
  UserRotation = 5, // type, id, x, y, z
}
