const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const userRoutes = require("./routes/userRoutes");
const socketHandler = require("./sockets");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const server = http.createServer(app);

// ✅ Allow both production URL & local dev
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173"
];

// ---------- MIDDLEWARE ----------
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
// Increase JSON body size limit to handle base64 image uploads (10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ---------- ROUTES ----------
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// ---------- SOCKET.IO ----------
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});
socketHandler(io);

// ---------- ERROR HANDLER ----------
app.use(errorHandler);

// ---------- SERVE REACT BUILD ----------
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "..", "..", "frontend", "build");
  app.use(express.static(buildPath));
  app.get("*", (req, res) =>
    res.sendFile(path.join(buildPath, "index.html"))
  );
}

app.get("/", (req, res) => {
  res.send("Backend is Running");
});

// ---------- SERVER START ----------
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Backend listening on http://localhost:${PORT}`);
  });
});
