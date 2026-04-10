import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessageModel.js";
import Channel from "./models/ChannelModel.js";
import {
  setUserOnline,
  setUserOffline,
  getUserSocketId,
} from "./utils/cache.js";

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      await setUserOnline(userId, socket.id);
      console.log(`User Connected: ${userId} with socket ID: ${socket.id}`);
    } else {
      console.log("User ID not provided during connection");
    }

    socket.on("sendMessage", (message) => {
      sendMessage(message);
    });

    socket.on("disconnect", async () => {
      await handleDisconnect(socket);
    });

    socket.on("send-channel-message", (message) => {
      sendChannelMessage(message);
    });
  });

  const handleDisconnect = async (socket) => {
    console.log(`Client disconnected: ${socket.id}`);
    await setUserOffline(socket.id);
  };

  const sendMessage = async (message) => {
    const senderSocketId = await getUserSocketId(message.sender);
    const recipientSocketId = await getUserSocketId(message.recipient);

    const createdMessage = await Message.create(message);
    console.log("Message created:", createdMessage);

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .populate("recipient", "id email firstName lastName image color");

    console.log("Message data:", messageData);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", messageData);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
    }
  };

  const sendChannelMessage = async (message) => {
    const { channelId, sender, content, messageType, fileUrl } = message;

    const createdMessage = await Message.create({
      sender,
      recipient: null,
      content,
      messageType,
      timestamp: new Date(),
      fileUrl,
    });

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .exec();

    await Channel.findByIdAndUpdate(channelId, {
      $push: { messages: messageData._id },
    });

    const channel = await Channel.findById(channelId).populate("members");

    const finalData = { ...messageData._doc, channelId: channel._id };

    if (channel && channel.members) {
      for (const member of channel.members) {
        const memberSocketId = await getUserSocketId(member._id.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("receive-channel-message", finalData);
        }
      }
      if (channel.admin && channel.admin._id) {
        const adminSocketId = await getUserSocketId(
          channel.admin._id.toString(),
        );
        if (adminSocketId) {
          io.to(adminSocketId).emit("receive-channel-message", finalData);
        }
      }
    }
  };
};

export default setupSocket;
