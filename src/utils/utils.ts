import { Response, Request, NextFunction } from "express";

interface ResponseObjectInterface {
  code?: string;
  message?: string | string[];
}

export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: Error) => {
      console.log(err);
    });
  };
};

export const responseObject = function <
  T extends object & ResponseObjectInterface
>(options?: T) {
  return { ...options };
};

export const requiredFields = function <T extends object>(
  requiredObject: T
): { error: ResponseObjectInterface | null } {
  const messageArray: string[] = [];
  for (let item in requiredObject) {
    const key = requiredObject[item];
    if (!key) {
      messageArray.push(`${item} is required`);
    }
  }

  if (messageArray.length) {
    const error = responseObject({
      code: "INVALID_INPUTS",
      message: messageArray,
    });

    return {
      error,
    };
  } else {
    return { error: null };
  }
};
