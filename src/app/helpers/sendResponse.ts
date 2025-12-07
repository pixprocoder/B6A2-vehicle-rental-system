import type { Response } from "express";

type IApiResponse<T> = {
  success: boolean;
  message?: string | null;
  data?: T | null;
};

const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  const responseData: IApiResponse<T> = {
    success: data.success,
    message: data.message,
    data: data.data || null || undefined,
  };
  res.json(responseData);
};

export default sendResponse;
