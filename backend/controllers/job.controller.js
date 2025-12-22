import Job from "../models/Job.model.js";

export const seedJobs = async (req, res) => {
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
};

export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
