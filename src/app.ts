import express, { Response, Request, NextFunction } from "express";
import { AppDataSource } from "./data-source";
import { User } from "./entity/user.entity";
import bcrypt from "bcrypt";

const port = 4001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({ message: "done" });
});

app.post(
  "/update-account",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, updateEmail } = req.body;

    const checkAccountIsExists = await User.findOne({ where: { email } });

    if (!checkAccountIsExists) {
      return res.status(403).json({ message: "Account not found" });
    }

    try {
      const updateAccount = await User.update(
        { email },
        { email: updateEmail }
      );
      console.log(updateAccount);
      return res.status(200).json({ message: "Account updated" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
);

app.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const checkAccountIsExists = await User.findOne({ where: { email } });

  if (!checkAccountIsExists) {
    return res.status(403).json({ message: "Account not found" });
  }

  const checkPasswordMatch = await bcrypt.compare(
    password,
    checkAccountIsExists.password
  );

  if (!checkPasswordMatch) {
    return res.status(403).json({ message: "Password not match" });
  }

  return res.status(200).json({ message: "Login successful" });
});

app.post(
  "/sign-in",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const checkEmailIsExist = await User.findOne({ where: { email } });

    if (checkEmailIsExist) {
      return res.status(401).json({ message: "email already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.save({ email, password: hashPassword });

    if (!newUser) {
      return res.status(500).json({ message: "Error adding new Enrollee" });
    }

    return res.status(201).json({
      message: "User added successfully",
    });
  }
);

app.post(
  "/delete-account",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const checkAccountIsExists = await User.findOne({ where: { email } });

    if (!checkAccountIsExists) {
      return res.status(403).json({ message: "Account not found" });
    }

    try {
      await User.delete({ email });
      return res.status(200).json({ message: "Account Deleted" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
);

const connection = async (callback: Function) => {
  AppDataSource.initialize()
    .then(() => {
      callback();
      console.log("Connection established");
    })
    .catch((err) => {
      console.log(`database connection error: ${err}`);
    });
};

connection(() => {
  app.listen(port, () => {
    console.log(`listening on ${port}`);
  });
});
