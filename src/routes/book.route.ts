import express from "express";
import * as bookController from "../controllers/book.controller";
const router = express.Router();

// GET
router.get("/get-book/:bookId", bookController.getBook);

// POST
router.post("/create-book", bookController.createBook);

// PATCH
router.patch("/update-book", bookController.updateBook);

// DELETE
router.delete("/delete-book/:bookId", bookController.deleteBook);

export default router;
