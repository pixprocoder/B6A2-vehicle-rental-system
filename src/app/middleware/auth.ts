import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";
import sendResponse from "../helpers/sendResponse";

const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization as string;

      if (!authHeader) {
        sendResponse(res, {
          success: false,
          message: "Token not found",
          data: null,
        });
      }

      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(
        token as string,
        config.jwt_secret as string
      ) as JwtPayload;

      req.user = decoded;
      console.log(decoded);

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
