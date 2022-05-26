import http from "http";
import { Server } from "socket.io";
import passport from "./passport.util";
import sessionMiddlware from "../middleware/session.middleware";
import { getDB } from "./database.util";
import { ObjectId } from "mongodb";
import ConversationModel from "../model/conversation.model";
import UserModel from "../model/user.model";
import dotenv from "dotenv";
dotenv.config();

class SocketIO {
  private _io;
  private _server;
  private _users = {};
  private _chatList = [];

  constructor(app) {
    this._server = http.createServer(app);
    this._io = new Server(this._server, {
      cors: {
        origin: process.env.CLIENT,
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
    this._server.listen(process.env.PORT, () => {
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

        console.log('socket.roomssocket.roomssocket.roomssocket.rooms__data');
        
        console.log(data);
        console.log(Object.keys(socket.rooms));
        
        const room_status = Object.keys(socket.rooms).includes(
          data.conversationId
        );

        if (!room_status) {
          console.log('joineeeed room as no status');

          // if(!this._chatList[data.conversationId])

          this._chatList.push({
            conversationId: data.conversationId,
            userId: data.currentUserId
          })

          console.log(this._chatList);
          

          socket.join(data.conversationId);
        }
      });

      socket.on("leaveChatroom", (data) => {
        socket.leave(data.conversationId);
        this._chatList = this._chatList.filter((cl) => {
          return cl.userId != socket.request.user.userId;
        });
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
        console.log(socket.request.user);
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

        console.log("emitting_________received_______message");

        this._io.to(msg.conversationId).emit("received", {
          newMsg: newMessage,
        });


        //emit to chats list

        for (const conversationMember of membersInConversation) {
          const matchedUser = this._users[conversationMember.userId];

          // everyone in the conversation has to be notified, even if not online.
            // if (socket.request.user.userId != conversationMember.userId) {
            //   await UserModel.updateProfile(conversationMember.userId, {
            //     hasMessage: true,
            //   });

            //   if (this._users[conversationMember.userId]) {
            //     socket
            //       .to(this._users[conversationMember.userId].id)
            //       .emit("new_message_notification");
            //   }
            // }

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

        // Emit notification
        let receivers = this._chatList.filter(cl => {
          // Cannot be sender
          // Must share same chat_id 
          return cl.conversationId === msg.conversationId
        }).map(r => {
          return r.userId;
        })

        let non_connected_users = []
        conversation.members.forEach(mb => {
          if(!receivers.includes(mb.userId)) {
            non_connected_users.push(mb.userId);
          }
        });
        
        console.log("non_connected_users_non_connected_users_non_connected_users");
        console.log(non_connected_users);
        non_connected_users.forEach(async (r) => {
          await UserModel.updateProfile(r, {
            hasMessage: true,
          });
          socket.to(this._users[r].id).emit("new_message_notification");
        });

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
