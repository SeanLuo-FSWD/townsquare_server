import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      isAuthenticated: any;
    }
  }
}

function checkAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).send({
    status: "error",
    message: "Unauthorized. Please refresh and login again",
  });
}

export { checkAuth };
