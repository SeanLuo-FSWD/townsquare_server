import UserModel from "../model/user.model";
import passport from "../util/passport.util";
import sendEmail from "../util/nodemailer.util";

declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
        email: string;
        avatar: string;
        username: string;
        emailVerified: boolean;
      }; //or other type you would like to use,
      sessionID: string;
      login: any;
    }
  }
}

class AuthenticationService {
  public login(req, res, next): Promise<{ userId: string; username: string }> {
    return new Promise((resolve, reject) => {
      passport.authenticate("local", function (err, user) {
        if (err) {
          reject({
            status: 400,
            message: err.message,
          });
        }

        req.login(user, async (loginError) => {
          if (loginError)
            reject({
              status: 500,
              message: "Login error.",
            });

          resolve(user);
        });
      })(req, res, next);
    });
  }

  public async signUp(signUpInfo) {
    //signUpInfo: { email: .., password: .. }
    const user = new UserModel(signUpInfo);
    const isExisted = await user.isExisted();
    if (isExisted) {
      throw {
        status: 400,
        message: "User already exists.",
      };
    } else {
      const result = await user.create();
      await sendEmail(result.email, result.userId);
      return "success";
    }
  }

  public async verifyEmail(userId) {
    const user = await UserModel.getUserById(userId);

    if (user) {
      await UserModel.verifyUserByEmail(userId);
      return "success";
    } else {
      throw {
        status: 404,
        message: "Invalid Email verification link",
      };
    }
  }
}

export default AuthenticationService;
