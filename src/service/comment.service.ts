import CommentModel from "../model/comment.model";
import PostModel from "../model/post.model";
import NotificationModel from "../model/notification.model";

class CommentService {
  public async createComment(user, comment) {
    const newComment = new CommentModel(user, comment);
    const post = await PostModel.getPostByPostId(comment.postId);
    if (!post)
      throw {
        status: 404,
        message: "Post not found.",
      };

    const result = await newComment.create();

    if (result.commentId) {
      const message = `${user.username} commented on your post`;
      const link = `/post/${comment.postId}`;
      const notification = new NotificationModel(
        comment.receiverId,
        message,
        link
      );

      let notification_result = null;

      if (user.userId !== comment.receiverId) {
        notification_result = await notification.createNotification();
      }

      const response_obj = {
        result,
        notification_result,
      };

      return response_obj;
    }

    return result;
  }

  public async getCommentsByPostId(postId) {
    const result = await CommentModel.getAllCommentsByPostId(postId);

    return result;
  }
}

export default CommentService;
