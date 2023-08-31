import { Response, Request, NextFunction } from "express";
import { catchAsync, requiredFields } from "../utils/utils";
import { AppDataSource } from "../data-source";
import { Auth } from "../entities/auth.entity";
import { Books } from "../entities/books.entity";

export const createBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, createdBy }: Books = req.body;

    const { error } = requiredFields({
      name,
      description,
      createdBy,
    });

    if (error) {
      return res.status(400).json(error);
    }

    const userRepository = AppDataSource.getRepository(Auth);

    const isUserExists = await userRepository.findOne({
      where: { id: Number(createdBy) },
    });

    if (!isUserExists) {
      return res.status(404).json({ message: "Creator not found" });
    }

    const bookRepository = AppDataSource.getRepository(Books);

    const book = new Books();
    book.name = name;
    book.description = description;
    book.createdAt = new Date();
    book.createdBy = createdBy;

    const saveBook = await bookRepository.save(book);

    if (!saveBook) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    return res.status(201).json(book);
  }
);

export const updateBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bookId, name, description }: Books & { bookId: string } = req.body;

    const { error } = requiredFields({
      bookId,
    });

    if (error) {
      return res.status(400).json(error);
    }

    const bookRepository = AppDataSource.getRepository(Books);

    const checkBookExists = await bookRepository.findOne({
      where: { id: Number(bookId) },
    });

    if (!checkBookExists) {
      return res.status(404).json({ message: "Book not found" });
    }

    const updateBook = await AppDataSource.createQueryBuilder()
      .update(Books)
      .set({ name, description })
      .where("id = :id", { id: Number(bookId) })
      .execute();

    if (updateBook.affected) {
      return res.status(200).json({ message: "Book updated successfully" });
    }

    return res
      .status(500)
      .json({ message: "Something went wrong updating the book" });
  }
);

export const deleteBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bookId } = req.params;

    const { error } = requiredFields({ bookId });

    if (error) {
      return res.status(500).json(error);
    }

    const deleteBook = await AppDataSource.createQueryBuilder()
      .delete()
      .from(Books)
      .where("id = :id", { id: Number(bookId) })
      .execute();

    if (deleteBook.affected) {
      return res.status(200).json({ message: "Book deleted successfully" });
    }

    return res.status(404).json({ message: "Book not found" });
  }
);

export const getBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bookId } = req.params;

    const { error } = requiredFields({ bookId });

    if (error) {
      return res.status(500).json(error);
    }

    const bookRepository = AppDataSource.getRepository(Books);

    const findBook = await bookRepository
      .createQueryBuilder("books")
      .select([
        "books.name as name",
        "books.description as description",
        "books.createdAt as createdAt",
      ])
      .addSelect("user.name", "createdByName")
      .addSelect("user.profile", "createdByProfile")
      .innerJoin("books.createdBy", "user")
      .where("books.id = :id", { id: Number(bookId) })
      .getRawOne();

    if (findBook) {
      return res.status(200).json(findBook);
    }

    return res.status(404).json({ message: "Book not found" });
  }
);
