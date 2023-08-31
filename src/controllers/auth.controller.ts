import { catchAsync, requiredFields } from "../utils/utils";
import { Response, Request, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import bcrypt from "bcrypt";
import { Auth } from "../entities/auth.entity";

export const signIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, profile, name }: Auth = req.body;

    const { error } = requiredFields({ email, password });

    if (error) {
      return res.status(400).json(error);
    }

    const authRepository = AppDataSource.getRepository(Auth);

    // check the email is already exists or not.
    const isExisting = await authRepository.findOne({ where: { email } });

    if (isExisting) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // create new user
    const user = new Auth();
    user.email = email;
    user.password = hashPassword;
    user.profile = profile;
    user.name = name;

    const createUser = await authRepository.save(user);

    if (!createUser) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    return res.status(201).json({
      name: user.name,
      email: user.email,
      profile: user.profile,
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: Auth = req.body;

    const { error } = requiredFields({ email, password });

    if (error) {
      return res.status(400).json(error);
    }

    const userRepository = AppDataSource.getRepository(Auth);

    // check the account is exists or not.
    const isExistingAccount = await userRepository.findOne({
      where: { email },
    });

    if (!isExistingAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    // check the password is match or not.
    const checkPassword = await bcrypt.compare(
      password,
      isExistingAccount.password
    );

    if (!checkPassword) {
      return res.status(400).json({ message: "Password is not match" });
    }

    return res.status(200).json({
      name: isExistingAccount.name,
      email: isExistingAccount.email,
      profile: isExistingAccount.profile,
    });
  }
);
