import express from "express";
import { AppDataSource } from "./data-source";
import authRouter from "./routes/auth.route";
import bookRouter from "./routes/book.route";
import userRouter from "./routes/user.route";

const port = 4001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/book", bookRouter);
app.use("/user", userRouter);

const connection = (callback: Function) => {
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
