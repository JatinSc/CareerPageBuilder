import express from "express";
import Job from "../models/Job.model.js";

const router = express.Router();

/**
 * Seed jobs (one-time / demo use)
 */
router.post("/seed", async (req, res) => {
    try {
        const jobs = req.body; // array of jobs
        await Job.deleteMany();
        const savedJobs = await Job.insertMany(jobs);

        res.status(201).json({
            message: "Jobs seeded successfully",
            count: savedJobs.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/jobsData", async (req, res) => {
    const jobs = await Job.find();
    res.json(jobs);
});

export default router;
