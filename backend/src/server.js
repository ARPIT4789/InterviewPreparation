import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import kitRoutes from "./routes/kit.routes.js";
import { errorHandler } from "./middleware/error.js";

dotenv.config();

const app = express();

// DATABASE
await connectDB();

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);

// BODY PARSER
app.use(express.json());

// SESSION
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    }),

    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure:
        process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  })
);

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message:
      "Trao Interview Prep API is running"
  });
});

// AUTH
app.use("/api/auth", authRoutes);

// KITS
app.use("/api/kits", kitRoutes);

// ERROR HANDLER
app.use(errorHandler);

// SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Backend running on port ${PORT}`
  );
});