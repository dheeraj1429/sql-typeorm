import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/user.entity";
import { Wallet } from "./entity/wallet.entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "learning",
  synchronize: true,
  entities: [User, Wallet],
});
