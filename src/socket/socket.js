import { io } from "socket.io-client";

const URL = "https://zz-backend.onrender.com";

console.log(URL);

export const socket = io(URL);
