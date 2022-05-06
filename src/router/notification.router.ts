import { Request, Response, NextFunction, Router } from "express";
import NotificationService from "../service/notification.service";
import NotificationModel from "../model/notification.model";

class NotificationRouter {
  // /api/notification
  public path = "/notification";
  public router = Router();
  private _notificationService = new NotificationService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/clear`, this.clearAllNotifications);

    // this.router.post(`/create`, this.createNotification);
    this.router.post(`/delete`, this.deleteNotification);
    this.router.get(`/`, this.getNotification);
  }

  private clearAllNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log("notification.router.ts - clearAllNotifications");

    try {
      const userId: string = req.user.userId;
      const result = await NotificationModel.clearAllNotifications(userId);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  private getNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      //   const userId: string = req.query.id as string;
      const userId: string = req.user.userId as string;

      const result = await this._notificationService.getNotification(userId);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  private deleteNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log("notification.router.ts - deleteNotification");
    console.log(req.body);

    const notification_obj = req.body;

    //   console.log("req.body");
    //       const notice_obj = {
    //         notificationId: noticeId,
    //         receiverId: receiverId,
    //       };

    // console.log(req.body.notificationId);
    // console.log("req.body.notificationId");

    try {
      //   const notificationId = req.body.notificationId;
      await this._notificationService.deleteNotification(
        notification_obj.notificationId
      );

      const updated_notifications =
        await this._notificationService.getNotification(
          notification_obj.receiverId
        );

      res.status(200).send(updated_notifications);
    } catch (error) {
      next(error);
    }
  };
}

export default NotificationRouter;
