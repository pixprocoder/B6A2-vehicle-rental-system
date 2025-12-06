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
  } catch (error) {
    console.log(error);
  }
};

export const authControllers = {
  createUser,
};
