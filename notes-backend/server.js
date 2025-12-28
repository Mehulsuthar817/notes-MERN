import express from "express";
import cors from "cors";
import fs from "fs";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";


const app = express();
const PORT = 5000;
app.use(cors({
  origin: "http://localhost:5173",
  credentials:true
}));
app.use(express.json());

const FILE = "./data/notes.json";
const USERS_FILE = "./data/users.json";
const JWT_SECRET = "supersecretkey";

app.use(cookieParser());


/* helpers */
const readNotes = () => {
  if (!fs.existsSync(FILE)) return [];
  const data = fs.readFileSync(FILE, "utf-8");
  return data ? JSON.parse(data) : [];
};

const writeNotes = (notes) => {
  fs.writeFileSync(FILE, JSON.stringify(notes, null, 2));
};

const readUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8") || "[]");
};

const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

const authMiddleware = (req, res, next) => {
  console.log("COOKIES:", req.cookies);
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};



/* test route */
app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/auth/me", authMiddleware, (req, res) => {
  console.log("🔥 /auth/me HIT, userId =", req.userId);
  res.json({ authenticated: true });
});

/* get notes */
app.get("/notes", authMiddleware ,(req, res) => {
  const notes = readNotes();
  const userNotes = notes.filter(n=> n.userId == req.userId);
  res.json(userNotes);
});

/* add note */
app.post("/notes", authMiddleware ,(req, res) => {
  const notes = readNotes();

  const newNote = {
    id: crypto.randomUUID(),
    userId:req.userId,
    content: req.body.content,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  notes.unshift(newNote);
  writeNotes(notes);

  res.status(201).json(newNote);
});

/* update note */
app.put("/notes/:id", authMiddleware ,(req, res) => {
  const notes = readNotes();

  const updatedNotes = notes.map((n) => {
    if(n.id=== req.params.id && n.userId === req.userId){
      return {...n,content:req.body.content,updatedAt:Date.now() };
    }
    return n;
  }
  );

  writeNotes(updatedNotes);
  res.json({ success: true });
});

/* delete note */
app.delete("/notes/:id", authMiddleware ,(req, res) => {
  const notes = readNotes();
  const filtered = notes.filter(
    n=> !(n.id === req.params.id && n.userId === req.userId)
  );
  writeNotes(filtered);
  res.json({ success: true });
});

app.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Missing fields" });

  const users = readUsers();

  const exists = users.find((u) => u.email === email);
  if (exists) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: crypto.randomUUID(),
    name,
    email,
    password: hashedPassword,
  };

  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ message: "User registered" });
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const users = readUsers();
  const user = users.find((u) => u.email === email);

  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, 
  });

  res.json({ message: "Logged in" });
});

app.post("/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.sendStatus(200);
});


app.listen(PORT, () => {
  console.log(` Backend running on http://localhost:${PORT}`);
});
