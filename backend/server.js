import express from "express";
import { mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";
import booksRouter from "./routes/booksRoute.js";
import cors from "cors";

const PORT = 3001;
const app = express();

// middleware for parsing request body
app.use(express.json());

// middleware to handle CORS policy
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.get("/", (req, res) => {
  console.log(req);
  return res.status(200).send("Welcome to the book store");
});

// book request handling
app.use("/books", booksRouter);

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
