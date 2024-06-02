import express from 'express';
import { Book } from '../models/bookModel.js';

const router = express.Router();

// router to create a new book
router.post("/", async (req, res) => {
    try {
      if (!req.body.title || !req.body.author || !req.body.publishYear) {
        return res.status(400).send({
          message: "Send all required felids: title, author, publishYear",
        });
      }
      const newBook = {
        title: req.body.title,
        author: req.body.author,
        publishYear: req.body.publishYear,
      };
      // send created data to database
      const book = await Book.create(newBook);
      return res.status(200).send(book);
    } catch (error) {
      console.log(error.message);
      res.status(500).send({ message: error.message });
    }
  });
  
  // route to get all books from database
  router.get("/", async (reg, res) => {
    try {
      const books = await Book.find({});
      return res.status(200).json({
        count: books.length,
        data: books,
      });
    } catch (error) {
      res.status(400).send({ message: "Failed to get books from database" });
    }
  });
  
  // route to send a single book
  router.get("/:id", async (reg, res) => {
    try {
      const { id } = reg.params;
      const books = await Book.findById(id);
      return res.status(200).json(books);
    } catch (error) {
      res.status(400).send({ message: "Failed to get books from database" });
    }
  });
  
  // route to update
  router.put("/:id", async (req, res) => {
    try {
      if (!req.body.title || !req.body.author || !req.body.publishYear) {
        return res.status(400).send({
          message: "Send all required data: title, author, publishYear",
        });
      }
      const { id } = req.params;
      const result = await Book.findByIdAndUpdate(id, req.body);
      if (!result) {
        return res.status(404).send({ message: "Book not found" });
      }
      return res.status(200).send({ message: "Book Created Successfully" });
    } catch (error) {
      console.log(error.message);
      res.status(500).send({ message: error.message });
    }
  });
  
  // route for delete
  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Book.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).json({ message: "Book not found " });
      }
      return res.status(200).send({ message: "Book Delete Successfully" });
    } catch (error) {
      console.log(error.message);
      res.status(500).send({ message: error.message });
    }
  });

  export default router;