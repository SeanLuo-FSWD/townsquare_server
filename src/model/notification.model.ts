import { getDB, client } from "../util/database.util";
import { ObjectId } from "mongodb";

class NotificationModel {
  private _receiverId: string;
  private _createdAt: string;
  private _message: string;
  private _link: string;
  private _db = getDB();

  constructor(receiverId, message, link) {
    this._receiverId = receiverId;
    this._createdAt = new Date().toString();
    this._message = message;
    this._link = link;
  }

  public async createNotification() {
    const notification = {
      receiverId: this._receiverId,
      createdAt: this._createdAt,
      message: this._message,
      link: this._link,
    };

    const result = await this._db
      .collection("notification")
      .insertOne(notification);

    console.log(
      "notification.model.ts - createNotification Response :  result.ops[0]"
    );

    console.log(result.ops[0]);

    return result.ops[0];
  }

  static async deleteNotification(notificationId) {
    const database = getDB();

    const id = new ObjectId(notificationId);

    if (id) {
      await database.collection("notification").deleteOne({
        _id: id,
      });

      return;
    } else {
      throw {
        status: 404,
        message: "null or Invalid notification id format",
      };
    }
  }

  static async getNotification(receiverId) {
    const database = getDB();

    const result = await database
      .collection("notification")
      .find({
        receiverId: receiverId,
      })
      .limit(11)
      .sort({ _id: -1 })
      .toArray();

    return result;
  }

  static async clearAllNotifications(userId: string) {
    const database = getDB();

    const deleteResult = await database.collection("notification").remove({
      receiverId: userId,
    });

    return Boolean(deleteResult.result.n);
  }
}

export default NotificationModel;
