import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import DbConnection from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import courseAssignedRoutes from "./routes/courseAssignedRoutes.js";
// import adminRoutes from "./routes/";

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // For JSON requests
app.use(express.urlencoded({ extended: true })); // For Form-Data requests
app.use(cors());

// Routes
app.get("/", (req, res) => res.send("Server running"));
app.use("/api/admin", adminRoutes);
app.use("/api/user", adminRoutes);
app.use("/api/auth", adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/course-assigned', courseAssignedRoutes);

// Connect to Database
DbConnection.once("open", () => {
  console.log("Database connected successfully");
});

// Start the server (Important for Vercel)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
