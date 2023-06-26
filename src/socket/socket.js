import { io } from "socket.io-client";

const URL = "http://zz-backend-n.ap-south-1.elasticbeanstalk.com";

console.log(URL);

export const socket = io(URL);
