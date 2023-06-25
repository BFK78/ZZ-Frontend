import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.BACKEND_SERVER_URL || "http://localhost:8888";

console.log(URL);

export const socket = io(URL);
