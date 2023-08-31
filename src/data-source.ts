import "reflect-metadata";
import { DataSource } from "typeorm";
import { Auth } from "./entities/auth.entity";
import { Books } from "./entities/books.entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "sql_type",
  synchronize: true,
  entities: [Auth, Books],
  logging: true,
});
