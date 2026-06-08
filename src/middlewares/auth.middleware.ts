import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

const authMiddleware = (
  req: AuthRequest,

  res: Response,

  next: NextFunction,
) => {
  try {
    const authHeader = req.cookies.token;
    console.log(authHeader,"nlowdncpnc")
    // const token = authHeader?.split(" ")[1];
    console.log("token", authHeader);
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(
      authHeader,
      process.env.JWT_SECRET!,
    );

    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default authMiddleware;
