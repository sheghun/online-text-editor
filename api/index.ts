import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as notebookController from "./controller/notebook.controller";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// Connect to database
(async () => {
  try {
    const options: mongoose.ConnectOptions = {
      autoIndex: false,
    };
    await mongoose.connect("mongodb://localhost:27017/jupiter", options);
  } catch (error) {
    throw error;
  }
})();

app.post("/run", notebookController.run);

app.listen(4000, () => {
  console.info("Express server started on port: " + 4000);
});
