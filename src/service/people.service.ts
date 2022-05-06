import PostModel from "../model/post.model";
import ImageModel from "../model/image.model";
import LikeModel from "../model/like.model";
import UserModel from "../model/user.model";

class PeopleService {
  public async getPeople(filter: any, userId: string) {
    const result = await UserModel.getPeople(filter, userId);
    return result;
  }

  public async getPerson(userId: string) {
    const user = await UserModel.getUserById(userId);
    let posts = [];
    if (user) {
      posts = await PostModel.getPostsByUserId(user.userId);
    }
    return { user: user, posts: posts };
  }
}

export default PeopleService;
