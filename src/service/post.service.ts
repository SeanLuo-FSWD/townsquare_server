import PostModel from "../model/post.model";
import ImageModel from "../model/image.model";
import LikeModel from "../model/like.model";
import NotificationModel from "../model/notification.model";

class PostService {
  public async getFeed(filter: any, req: any) {
    const result = await PostModel.getFeed(filter.feedPg, req.user);
    return result;
  }

  public async createPost(req) {
    const user = req.user;
    const postData = req.body;

    let imagesUploadResult = [];

    if (req.files.length) {
      const imagesUploadArr = req.files.map(
        async (file) =>
          await new ImageModel(file.originalname, file.buffer).upload()
      );
      imagesUploadResult = await Promise.all(imagesUploadArr);
    }

    postData.images = imagesUploadResult.length
      ? imagesUploadResult.map((imageUrl: string) => imageUrl)
      : [];

    const post = new PostModel(user, postData);
    const result = await post.create();

    return result;
  }

  public async deletePost(userId, postId) {
    const result = await PostModel.delete(userId, postId);
    if (result) {
      return {
        status: 200,
        message: "success",
      };
    }
    throw {
      status: 404,
      message: "Post not found.",
    };
  }

  static async toggleLikePost(user, postId, receiverId) {
    const post = await PostModel.getPostByPostId(postId);

    if (!post) {
      throw {
        status: 404,
        message: "Post not found.",
      };
    }

    const result = await PostModel.togglePostLike(user, postId);

    let notification_result = null;

    if (result === "liked" && user.userId !== receiverId) {
      const message = `${user.username} has liked your post`;
      const link = `/post/${postId}`;
      const notification = new NotificationModel(receiverId, message, link);
      notification_result = await notification.createNotification();
    }

    const response_obj = {
      like_status: result,
      notification_result,
    };

    // return result;
    return response_obj;
  }

  static async getFullPostByPostId(postId: string) {
    const result = PostModel.getFullPostByPostId(postId);
    return result;
  }

  static async getLikesByPostId(postId: string) {
    const result = LikeModel.getLikesByPostId(postId);
    return result;
  }
}

export default PostService;
