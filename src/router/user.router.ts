import { Request, Response, NextFunction, Router } from "express";
import AuthService from "../service/authentication.service";
import { checkAuth } from "../middleware/authentication.middleware";
import UserService from "../service/user.service";
import multerUpload from "../middleware/multerUpload.middleware";
import UserModel from "../model/user.model";

declare global {
  namespace Express {
    interface Request {
      logout: any;
      files: File[];
      file: File;
    }
  }
}

class UserRouter {
  public path = "/user";
  public router = Router();
  private _authService = new AuthService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/signUp", this.signUp);
    this.router.post("/login", this.login);
    this.router.get("/logout", this.logout);
    this.router.get("/verify", this.verifyEmail);
    this.router.get("/authenticate", checkAuth, this.authenticate);
    this.router.post("/followUser", this.followUser);
    this.router.get("/followingUsers", this.getFollowingUsers);

    this.router.post(
      "/avatar/:userId",
      multerUpload.array("filesToUpload[]"),
      this.updateProfilePhoto
    );
    this.router.post(
      "/profile",
      [checkAuth, multerUpload.single("avatar")],
      this.updateProfile
    );
    this.router.get("/deleteaccount", this.deleteAccount);
  }

  private deleteAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log("hiiiiiiiiiiit_deleteAccount");

    try {
      await UserService.deleteAccount(req.user.userId);
      req.logout();
      res.status(200).send({ message: "success" });
    } catch (error) {
      next(error);
    }
  };

  private signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this._authService.signUp(req.body);
      res.status(200).send({ message: "success" });
    } catch (error) {
      next(error);
    }
  };

  private login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this._authService.login(req, res, next);

      await UserModel.updateLastLogin(result.userId);

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  private logout = (req: Request, res: Response) => {
    req.logout();

    res.status(200).send({ message: "logout" });
  };

  private authenticate = (req: Request, res: Response) => {
    res.status(200).send(req.user);
  };

  private verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.query.id;

      await this._authService.verifyEmail(userId);
      res.status(200).send({ message: "verified" });
    } catch (error) {
      next(error);
    }
  };

  private updateProfilePhoto = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.userId;
      const image = req.files;
      const newAvatarLink = await UserService.updateUserAvatar(userId, image);
      res.status(200).send({
        userId: req.user.userId,
        email: req.user.email,
        username: req.user.username,
        avatar: newAvatarLink,
      });
    } catch (error) {
      next(error);
    }
  };

  private updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log("updateProfile");

    try {
      const userId = req.user.userId;
      const updates = req.body;

      if (req.file) {
        updates.avatar = req.file;
      }
      const result = await UserService.updateUserProfile(userId, updates);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  private followUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // const userId = req.user.userId;
      const user = req.user;
      const followingUserId = req.body.followingUserId;
      const result = await UserService.followUser(user, followingUserId);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  private getFollowingUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await UserService.getFollowingUsers(req.user.userId);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
}

export default UserRouter;
