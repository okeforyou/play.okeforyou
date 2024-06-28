import { Server } from "socket.io";

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.info("Socket is already running");
  } else {
    console.info("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("joinRoom", (room) => {
        // console.log("joinRoom", room);
        socket.join(room);
        // console.log(`User joined room: ${room}`);
      });

      socket.on("message", (data) => {
        const { room, action } = data;
        io.to(room).emit("message", action);
      });

      socket.on("disconnect", () => {
        // console.info("user disconnected");
      });
    });
  }
  res.end();
};

export default SocketHandler;
