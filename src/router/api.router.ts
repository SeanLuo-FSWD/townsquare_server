import { Request, Response, NextFunction, Router } from "express";
//routes
import UserRouter from "./user.router";
import PostRouter from "./post.router";
import PeopleRouter from "./people.router";
import CommentRouter from "./comment.router";
import ConversationRouter from "./conversation.router";
import NotificationRouter from "./notification.router";
import { checkAuth } from "../middleware/authentication.middleware";

class APIRouter {
  public router = Router();
  public path = "/api";
  private subRouters = [new UserRouter()];
  private authedSubRouters = [
    new PostRouter(),
    new CommentRouter(),
    new PeopleRouter(),
    new ConversationRouter(),
    new NotificationRouter(),
  ];
  constructor() {
    this.initRouters();
  }

  private initRouters() {
    this.subRouters.forEach((subRoute) => {
      this.router.use(`${subRoute.path}`, subRoute.router);
    });
    this.authedSubRouters.forEach((subRoute) => {
      this.router.use(`${subRoute.path}`, checkAuth, subRoute.router);
    });
  }
}

export default APIRouter;
