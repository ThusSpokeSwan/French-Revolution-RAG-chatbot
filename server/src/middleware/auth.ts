import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest
  extends Request {
  userId?: string;
}

export function auth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    console.log(
      "AUTH HEADER:",
      req.headers.authorization
    );

    const token =
      req.headers.authorization?.split(
        " "
      )[1];

    if (!token) {
      return res
        .status(401)
        .json({
          error:
            "No token provided",
        });
    }

    console.log(
      "JWT_SECRET in auth:",
      process.env.JWT_SECRET
    );

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as {
      userId: string;
    };

    req.userId =
      decoded.userId;

    next();
  } catch (error) {
    console.error(error);

    res.status(401).json({
      error: "Invalid token",
    });
  }
}