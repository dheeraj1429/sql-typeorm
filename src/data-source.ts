import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/user.entity";
import { Wallet } from "./entity/wallet.entity";
import { Currency } from "./entity/currency.entity";
import { Product } from "./entity/product.entity";
import { Company } from "./entity/company.entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "sql_type",
  synchronize: true,
  entities: [User, Wallet, Currency, Product, Company],
  logging: true,
});
