import type { Request, Response } from "express";
import sendResponse from "../../helpers/sendResponse";
import { authServices } from "./auth.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.createUser(req.body);
    sendResponse(res, {
      success: true,
      message: "User Created Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.log(error);
    sendResponse(res, {
      success: false,
      message: error?.message ? error?.message : "Internal Server Error",
      data: null,
    });
  }
};

// login
const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.loginUser(req.body);
    sendResponse(res, {
      success: true,
      message: "login successful",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    sendResponse(res, {
      success: false,
      message: error?.message || "Internal Server Error",
      data: null,
    });
  }
};

export const authControllers = {
  createUser,
  loginUser,
};
