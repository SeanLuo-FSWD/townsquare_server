import http from "http";
import { Server } from "socket.io";
import passport from "./passport.util";
import sessionMiddlware from "../middleware/session.middleware";

import { getDB } from "./database.util";
import { ObjectId } from "mongodb";
import ConversationModel from "../model/conversation.model";
import UserModel from "../model/user.model";

class SocketIO {
  private _io;
  private _server;
  private _users = {};
  constructor(app) {
    this._server = http.createServer(app);
    this._io = new Server(this._server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    this.initMiddlewares();
    this.ioMessage();
  }

  private wrap = (middleware) => (socket, next) =>
    middleware(socket.request, {}, next);

  initServer = () => {
    this._server.listen(8000, () => {
      console.log("server listening");
    });
  };

  initMiddlewares() {
    this._io.use(this.wrap(sessionMiddlware));
    this._io.use(this.wrap(passport.initialize()));
    this._io.use(this.wrap(passport.session()));
    this._io.use((socket, next) => {
      if (socket.request.user) {
        next();
      } else {
        // next(new Error("Unauthorized"));
        socket.disconnect();
      }
    });
  }

  private ioMessage = () => {
    this._io.on("connection", (socket) => {
      const socketUser = socket.request.user;
      //user and correspond socket id caching
      this.cacheUser(socketUser);

      // receive and emit notification
      socket.on("notification", (data) => {
        // {
        //   receiverId: '60a76224da25031a2c9d38d0',
        //   createdAt: 'Sat May 22 2021 00:17:27 GMT-0700 (Pacific Daylight Time)',
        //   message: 'sponge bob has liked your post',
        //   link: '/post/60a76986e29a171eb6d18661',
        //   _id: '60a8b0072a244a32f6f7015d'
        // }

        console.log("notification data ~~~~~~~~~");
        console.log(data);

        const matchedUser = this._users[data.receiverId];
        if (matchedUser) {
          const socketId = matchedUser.id;
          // socket.to(socketId).emit("notification", data);
          socket.to(socketId).emit("notification");
        }
      });

      //user enter chatroom
      socket.on("enter chatroom", (data) => {
        // const room_status = socket.rooms.indexOf(data.conversationId) >= 0;

        const room_status = Object.keys(socket.rooms).includes(
          data.conversationId
        );

        if (!room_status) {
          socket.join(data.conversationId);
        }
      });

      socket.on("leaveChatroom", (data) => {
        socket.leave(data.conversationId);
      });

      socket.on("activeUsers", () => {
        let activeUsers = [];
        for (let userId in this._users) {
          activeUsers.push(this._users[userId]);
        }
        socket.emit("activeUsers", activeUsers);
      });

      socket.on("addNewMemberToGroup", async (data) => {
        const conversationId = data.conversationId;
        const newMembers = data.newMembers;

        const result = await ConversationModel.addNewMembersToConversation(
          conversationId,
          newMembers
        );
        this._io.to(conversationId).emit("addNewMemberToGroup", result);
      });

      socket.on("chat message", async (msg) => {
        console.log("on chat message - socket.request.user");
        console.log(socket.request.user.userId);
        const database = getDB();

        const conversation = await database.collection("conversation").findOne({
          _id: new ObjectId(msg.conversationId),
        });

        const membersInConversation = conversation.members;

        const newMessage = {
          ...msg,
          createdAt: Date.now(),
        };
        await database.collection("message").insertOne(newMessage);
        // this._io.to(msg.conversationId).emit("received", { messages });

        this._io.to(msg.conversationId).emit("received", {
          newMsg: newMessage,
        });

        //emit to chats list

        for (const conversationMember of membersInConversation) {
          const matchedUser = this._users[conversationMember.userId];

          // everyone in the conversation has to be notified, even if not online.

          if (socket.request.user.userId != conversationMember.userId) {
            await UserModel.updateProfile(conversationMember.userId, {
              hasMessage: true,
            });

            // If the user is online, then additionally notify via socket.io.
            console.log("conversationMember.userIddddd");
            console.log(conversationMember.userId);

            if (this._users[conversationMember.userId]) {
              console.log(
                "new______message________notification____BE conversationMember.id 1"
              );
              console.log(this._users[conversationMember.userId].id);

              socket
                .to(this._users[conversationMember.userId].id)
                .emit("new_message_notification");
            }
          }

          console.log("saving hasMessage seems successful to other user");

          if (matchedUser) {
            const socketId = matchedUser.id;
            const latestConversations =
              await ConversationModel.getAllConversationsByUserId(
                matchedUser.userId
              );
            console.log(latestConversations);

            socket.to(socketId).emit("updateChats", latestConversations);
          }
        }
      });

      socket.on("disconnect", (socket) => {
        delete this._users[socketUser.userId];
      });
    });
  };

  private cacheUser = async (user) => {
    for (let [id, socket] of this._io.of("/").sockets) {
      const isExisted = this._users[user.userId];
      if (!isExisted) {
        this._users[socket.request.user.userId] = {
          ...socket.request.user,
          id: socket.id,
        };
      } else {
        // Caching the socketId to the connected user's id property, to save all connected users.
        this._users[socket.request.user.userId].id = socket.id;
      }
    }
  };
}

export default SocketIO;
