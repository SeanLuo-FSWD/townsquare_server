import PostModel from "../model/post.model";
import ImageModel from "../model/image.model";
import LikeModel from "../model/like.model";
import NotificationModel from "../model/notification.model";

class Notification {
  public async getNotification(receiverId: string) {
    const result = await NotificationModel.getNotification(receiverId);

    return result;
  }

  public async deleteNotification(notificationId) {
    await NotificationModel.deleteNotification(notificationId);
    return;
  }
}

export default Notification;
