import { Request, Response, NextFunction, Router } from "express";

import { getDB } from "../util/database.util";
import { ObjectId } from "mongodb";

import ConversationService from "../service/conversation.service";

class ConversationRouter {
  public path = "/conversation";
  public router = Router();
  private _service = new ConversationService();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", this.getConversationByMembers);
    this.router.get("/:conversationId/message", this.getMessagesInConversation);
    this.router.get("/", this.getAllConversationsByUserId);
  }

  // renamed from "getConversationIdByMembers" to  "getConversationByConversationId", to match what code actually do.
  // same for the route "this.router.post("/", this.getConversationIdByMembers)"
  private getConversationByMembers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const target = req.body.target;
      // const senderId = req.body.userId;
      const senderId = req.user.userId;
      const membersInConversation = [...target, senderId];
      const conversation = await this._service.getConversationByMembers(
        membersInConversation
      );
      res.status(200).send(conversation);
    } catch (error) {
      next(error);
    }
  };

  private getMessagesInConversation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const conversationId = req.params.conversationId;
      const database = getDB();
      const messages = await database
        .collection("message")
        .find({ conversationId: conversationId })
        .limit(12)
        .sort({ _id: -1 })
        .toArray();
      res.status(200).send({ messages });
    } catch (error) {
      next(error);
    }
  };

  private getAllConversationsByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.userId;
      const conversations = await this._service.getAllConversationsByUserId(
        userId
      );

      res.status(200).send(conversations);
    } catch (error) {
      next(error);
    }
  };
}

export default ConversationRouter;
