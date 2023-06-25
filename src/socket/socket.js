import { io } from "socket.io-client";

const URL = process.env.BACKEND_SERVER_URL || "http://localhost:8888";

console.log(URL);

export const socket = io(URL);
