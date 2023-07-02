import { io } from "socket.io-client";

const URL = "http://localhost:8888";

console.log(URL);

export const socket = io(URL);
