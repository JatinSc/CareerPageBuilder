import express from "express";
import { seedJobs, getJobs } from "../controllers/job.controller.js";

const router = express.Router();

router.post("/seed", seedJobs);
router.get("/jobsData", getJobs);

export default router;
