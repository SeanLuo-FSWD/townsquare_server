import UserModel from "../model/user.model";
import PostModel from "../model/post.model";
import LikeModel from "../model/like.model";
import CommentModel from "../model/comment.model";
import ImageModel from "../model/image.model";
import FollowingModels from "../model/following.model";
import FollowingModel from "../model/following.model";
import NotificationModel from "../model/notification.model";
import ConversationModel from "../model/conversation.model";

class UserService {
  static updateUserAvatar = async (userId, image) => {
    const newAvatarLink = await new ImageModel(
      image.originalname,
      image.buffer
    ).upload();
    await UserModel.updateUserAvatar(userId, newAvatarLink);
    await PostModel.updateUserPostsAvatar(userId, newAvatarLink);
    await CommentModel.updateUserCommentsAvatar(userId, newAvatarLink);
    await LikeModel.updateUserLikesAvatar(userId, newAvatarLink);
    return newAvatarLink;
  };

  static updateUserProfile = async (userId, updates) => {
    let newAvatarLink;
    if (updates["avatar"]) {
      newAvatarLink = await new ImageModel(
        updates["avatar"].originalname,
        updates["avatar"].buffer
      ).upload();

      updates.avatar = newAvatarLink;
    }
    await UserModel.updateProfile(userId, updates);
    if (updates["avatar"]) {
      await PostModel.updateUserPostsAvatar(userId, newAvatarLink);
      await CommentModel.updateUserCommentsAvatar(userId, newAvatarLink);
      await LikeModel.updateUserLikesAvatar(userId, newAvatarLink);
      await ConversationModel.updateUserConversationAvatar(
        userId,
        newAvatarLink
      );
    }
    const result = await UserModel.getUserById(userId);

    return result;
  };

  static followUser = async (user, followingUserId) => {
    const result = await new FollowingModel(
      user.userId,
      followingUserId
    ).toggleFollowing();

    let notification_result = null;

    if (result === "followed" && user.userId !== followingUserId) {
      const message = `${user.username} has followed you`;
      const link = `/person/${user.userId}`;
      const notification = new NotificationModel(
        followingUserId,
        message,
        link
      );
      notification_result = await notification.createNotification();
    }

    const response_obj = {
      follow_status: result,
      notification_result,
    };

    return response_obj;
  };

  static getFollowingUsers = async (userId) => {
    const followingUsers = await FollowingModels.getFollowingUsers(userId);
    return followingUsers;
  };
}

export default UserService;
