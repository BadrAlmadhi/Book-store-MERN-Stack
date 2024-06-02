import express from "express";
import { mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";

const PORT = 3001;
const app = express();

// middleware for parsing request body
app.use(express.json());

app.get("/", (req, res) => {
  console.log(req);
  return res.status(200).send("Welcome to the book store");
});

// router to create a new book
app.post("/books", async (req, res) => {
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
app.get("/books", async (reg, res) => {
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
app.get("/books/:id", async (reg, res) => {
  try {
    const { id } = reg.params;
    const books = await Book.findById(id);
    return res.status(200).json(books);
  } catch (error) {
    res.status(400).send({ message: "Failed to get books from database" });
  }
});

// route to update
app.put("/books/:id", async (req, res) => {
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
app.delete("/books/:id", async (req, res) => {
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

// connect database
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("Data Connected Successfully");
    app.listen(PORT, () => {
      console.log(`App is listing to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
