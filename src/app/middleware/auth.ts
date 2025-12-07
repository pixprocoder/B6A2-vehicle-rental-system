import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";
import sendResponse from "../helpers/sendResponse";

const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        sendResponse(res, {
          success: false,
          message: "Token not found",
          data: null,
        });
      }

      const decoded = jwt.verify(
        token as string,
        config.jwt_secret as string
      ) as JwtPayload;

      console.log(decoded);

      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        sendResponse(res, {
          success: false,
          message: "Access forbidden",
          data: null,
        });
      }
    } catch (error: any) {
      sendResponse(res, {
        success: false,
        message: error?.message ? error?.message : "Internal Server Error",
        data: null,
      });
    }
    next();
  };
};

export default auth;
