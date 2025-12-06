import type { Request, Response } from "express";
import { authServices } from "./auth.service";
import sendResponse from "../../helpers/sendResponse";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.createUser(req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User Created Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.log(error);
    sendResponse(res, {
      statusCode: 500,
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
      statusCode: 200,
      success: true,
      message: "login successful",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    sendResponse(res, {
      statusCode: error?.statusCode || 500,
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
