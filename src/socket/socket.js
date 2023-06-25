import { io } from "socket.io-client";

const URL = "https://zz-backend.vercel.app/";

console.log(URL);

export const socket = io(URL);
