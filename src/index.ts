import express from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import investmentRoutes from "./routes/investmentsRoutes";
import taxRoutes from "./routes/taxRoutes";
import { authenticateToken } from "./middleware/auth";
import mongoose from "mongoose";
const bodyParser = require("body-parser");

const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = 3002;

app.use(cors({ origin: "*" }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/investments", investmentRoutes);
app.use("/taxes", taxRoutes);
const mongoURI = process.env.mongoURI;

if (!mongoURI) {
  throw new Error("The MONGO_URI environment variable is not defined.");
}
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

// Express middleware and routes here

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
