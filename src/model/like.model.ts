import { getDB } from "../util/database.util";

class LikeModel {
  private _userId: string;
  private _username: string;
  private _avatar: string;
  private _postId: string;
  private _db = getDB();

  constructor(user, postId) {
    this._userId = user.userId;
    this._username = user.username;
    this._avatar = user.avatar;
    this._postId = postId;
  }

  public create = async () => {
    await this._db.collection("like").insertOne({
      userId: this._userId,
      username: this._username,
      avatar: this._avatar,
      postId: this._postId,
    });
    return "success";
  };

  static getLikesByPostId = async (postId) => {
    const database = getDB();
    const result = await database.collection("like").find({ postId }).toArray();

    console.log("~~~~~ like.model getLikesByPostId ~~~~~~");
    console.log(postId);
    console.log(result);

    return result;
  };

  static updateUserLikesAvatar = async (
    userId: string,
    newAvatarLink: string
  ) => {
    const database = getDB();
    await database.collection("like").update(
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

export default LikeModel;
