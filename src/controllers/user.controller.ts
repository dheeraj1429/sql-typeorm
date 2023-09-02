import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/utils";
import { Auth } from "../entities/auth.entity";
import { AppDataSource } from "../data-source";

export const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = AppDataSource.getRepository(Auth);

    // const users = await userRepository.find({ relations: { books: true } });

    const users = await userRepository
      .createQueryBuilder("auth")
      .leftJoin("auth.books", "books")
      .addSelect(["books.id", "books.name", "books.description"])
      .where("auth.id = :id", { id: 1 })
      .getOne();

    return res.status(200).json(users);
  }
);
