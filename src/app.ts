import express, { Response, Request, NextFunction } from "express";
import { AppDataSource } from "./data-source";
import { User } from "./entity/user.entity";
import { Wallet } from "./entity/wallet.entity";
import bcrypt from "bcrypt";
import { Currency } from "./entity/currency.entity";
import { Company } from "./entity/company.entity";
import { Product } from "./entity/product.entity";

const port = 4001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  /*
let companyRepository = AppDataSource.getRepository(Company);

  let products: Product[] = [];
  let product = new Product();
  product.name = "SM1";
  product.description = "some demo description";

  let secondProduct = new Product();
  secondProduct.name = "SM22";
  secondProduct.description = "some another demo description";

  products.push(product, secondProduct);

  let company: Company = new Company();
  company.name = "SAMSONG";
  company.place = "new delhi";
  company.description = "a great company";
  company.product = products;

  const dataInserted = await companyRepository.save(company);

  if (dataInserted) {
    return res.status(200).json({ message: "done" });
  }

  const companyRepository = AppDataSource.getRepository(Company);

  const company = await companyRepository.find({
    relations: { product: true },
  });

  return res.status(200).json(company);

  return res.status(500).json({ message: "Some error occurred" });
  */
});

app.get(
  "/get-user-with-wallet",
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "id is reuqired" });

    const userRepository = AppDataSource.getRepository(User);

    const findUser = await userRepository.findOne({
      where: { id: Number(userId) },
      select: ["email", "id", "wallet"],
      relations: { wallet: true },
    });

    // const findUser = await userRepository
    //   .createQueryBuilder("user")
    //   .select(["user.id", "user.email"])
    //   .where("user.id = :userId", { userId: Number(userId) })
    //   .getOne();

    if (!findUser) {
      return res.status(404).json({ message: "Account not found" });
    }

    return res.status(200).json(findUser);
  }
);

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

  const userRepository = AppDataSource.getRepository(User);

  const checkAccountIsExists = await userRepository.findOne({
    where: { email },
  });

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

    const userRepository = AppDataSource.getRepository(User);

    const checkEmailIsExist = await userRepository.findOne({
      where: { email },
    });

    if (checkEmailIsExist) {
      return res.status(401).json({ message: "email already exists" });
    }

    // if we are using casecade
    // const walletRepository = AppDataSource.getRepository(Wallet);

    // const newWallet = await walletRepository.save({
    //   balance: 1000.99999,
    //   currency: "INR",
    // });

    // if (!newWallet) {
    //   return res.status(500).json({ message: "Error saving wallet" });
    // }

    const hashPassword = await bcrypt.hash(password, 10);

    let wallet: Wallet = new Wallet();
    wallet.balance = 1000.99999;

    let user: User = new User();
    user.email = email;
    user.password = hashPassword;
    user.wallet = wallet;

    // const newUser = await userRepository.save({
    //   email,
    //   password: hashPassword,
    //   wallet: {
    //     balance: 1000.99999,
    //     currency: "INR",
    //   },
    // });

    const newUser = await userRepository.save(user);

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

    const userRepository = AppDataSource.getRepository(User);

    const checkAccountIsExists = await userRepository.findOne({
      where: { email },
    });

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

// currencies
app.post(
  "/create-new-currency",
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, symbol, description } = req.body;

    const currenciesRepository = AppDataSource.getRepository(Currency);

    const saveNewCurrency = await currenciesRepository.save({
      name,
      symbol,
      description,
      createdAt: new Date(),
    });

    if (!saveNewCurrency) {
      return res.status(500).json({ message: "Something went wrong" });
    }

    return res.status(201).json(saveNewCurrency);
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
