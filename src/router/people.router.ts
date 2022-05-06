import { Request, Response, NextFunction, Router } from "express";
import PeopleService from "../service/people.service";

class PeopleRouter {
  public path = "/people";
  public router = Router();
  private _peopleService = new PeopleService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", this.getPeople);
    this.router.get("/:userId", this.getPerson);
  }

  private getPeople = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const filter = req.body;
    try {
      const result = await this._peopleService.getPeople(
        filter,
        req.user.userId
      );
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  private getPerson = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.params.userId;
    try {
      const result = await this._peopleService.getPerson(userId);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
}

export default PeopleRouter;
