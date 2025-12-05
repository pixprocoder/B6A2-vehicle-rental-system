import type { Request, Response } from "express";
import { userServices } from "./user.service";

const getUsers = async (req: Request, res: Response) => {
  const result = await userServices.getUsers();
  res.send(result);
};

export const userControllers = {
  getUsers,
};
