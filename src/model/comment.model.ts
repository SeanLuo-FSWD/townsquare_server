import { getDB, client } from "../util/database.util";
import { ObjectId } from "mongodb";

class CommentModel {
  private _db = getDB();
  private _createdAt: string;
  private _text: string;
  private _userId: string;
  private _username: string;
  private _avatar: string;
  private _postId: string;

  constructor(user, input) {
    this._userId = user.userId;
    this._username = user.username;
    this._avatar = user.avatar;
    this._createdAt = new Date().toString();
    this._text = input.text;
    this._postId = input.postId;
  }

  async create() {
    const session = client.startSession();

    session.startTransaction();
    const newComment = {
      userId: this._userId,
      username: this._username,
      avatar: this._avatar,
      text: this._text,
      postId: this._postId,
      createdAt: this._createdAt,
    };

    await this._db.collection("post").updateOne(
      // { id: new ObjectId(this._postId) },
      { _id: new ObjectId(this._postId) },
      { $inc: { commentsCount: 1 } }
    );
    const result = await this._db.collection("comment").insertOne(newComment);
    session.commitTransaction();

    return {
      commentId: result.insertedId,
      ...newComment,
    };
  }

  static async getAllCommentsByPostId(postId) {
    const database = getDB();
    const comments = await database
      .collection("comment")
      .find({ postId: postId })
      .sort({ createdAt: -1 })
      .toArray();
      
    return comments;
  }

  static updateUserCommentsAvatar = async (
    userId: string,
    newAvatarLink: string
  ) => {
    const database = getDB();
    await database.collection("comment").update(
      {
        userId: userId,
      },
      {
        $set: {
          avatar: newAvatarLink,
        },
      }
    );
    return "success";
  };
}

export default CommentModel;
