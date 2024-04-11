import dotenv from "dotenv";
import connectDB from "./db/index";
import { app } from "./app";
import { Server } from "socket.io";
dotenv.config();

connectDB()
  .then(() => {
    const server = app.listen(process.env.PORT || 4000, () => {
      console.log(`Server is running on PORT ${process.env.PORT || 4000}`);
    });

    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: "http://localhost:3000",
      },
    });
    io.on("connection", (socket) => {
      console.log("A user connected");
      socket.on("setup", (userData) => {
        socket.join(userData?._id);
        socket.emit("connected");
      });

      socket.on("join chat", (room) => {
        socket.join(room);
        console.log("room joined", room);
      });

      socket.on("new message", (receivedData) => {
        if (!receivedData?.users && receivedData?.users?.length < 0) return;
        receivedData?.users?.forEach((user: string) => {
          socket.in(user).emit("message received", {
            message: receivedData?.message,
            chatId: receivedData?.chatId,
            toReplyMessage: receivedData?.toReplyMsg,
          });
        });
      });
    });
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });
