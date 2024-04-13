import { io } from "socket.io-client";
export default function socketInitialize() {
  const socket = io("https://video-call-backend3.onrender.com/");
  // const socket = io("http://localhost:5000");
  return socket;
}
