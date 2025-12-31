import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import User from "./models/User.js";
import Note from "./models/Note.js";
import auth from "./middleware/auth.js";

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

connectDB();

app.use(
  cors({
    origin: "https://notes-mern-five.vercel.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

/* test */
app.get("/", (req, res) => {
  res.send("Backend running (MongoDB)");
});

/* ================= AUTH ================= */

/* REGISTER */
app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hash,
    });

    res.status(201).json({ message: "User registered (MongoDB)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* LOGIN */
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.json({ message: "Logged in" });
});

/* ME */
app.get("/auth/me", auth, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

/* LOGOUT */
app.post("/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.sendStatus(200);
});

/* ================= NOTES ================= */

/* GET NOTES */
app.get("/notes", auth, async (req, res) => {
  const notes = await Note.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(notes);
});

/* ADD NOTE */
app.post("/notes", auth, async (req, res) => {
  const note = await Note.create({
    content: req.body.content,
    user: req.userId,
  });
  res.status(201).json(note);
});

/* UPDATE NOTE */
app.put("/notes/:id", auth, async (req, res) => {
  await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { content: req.body.content }
  );
  res.json({ success: true });
});

/* DELETE NOTE */
app.delete("/notes/:id", auth, async (req, res) => {
  await Note.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  });
  res.json({ success: true });
});

/* server */
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
