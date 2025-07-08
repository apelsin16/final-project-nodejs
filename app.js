import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from 'path';

import { sequelize } from "./db/db.js";

import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";

const app = express();

app.use('/avatars', express.static(path.resolve('public/avatars')));

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});


const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful");

    await sequelize.sync();

    app.listen(3000, () => {
        console.log("Server is running. Use our API on port: 3000");
    });
  } catch (error) {
    console.error('❌ Connection error:', error);
  }
};

start();