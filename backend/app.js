// import dotenv from "dotenv";
// dotenv.config();
import "./config/env.js"; // MUST be first
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import Job from "./models/Job.model.js";
import jobRoutes from "./routes/job.routes.js";
import authRoutes from "./routes/auth.routes.js";
import companyRoutes from "./routes/company.routes.js";
import sectionRoutes from "./routes/section.routes.js";
import publicRoutes from "./routes/public.routes.js";

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

//routes
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/", publicRoutes);


app.get("/health", (req, res) => {
    res.json({ status: "OK" });
});




connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;