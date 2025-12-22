import express from "express";
import Company from "../models/Company.model.js";
import Section from "../models/Section.model.js";
import Job from "../models/Job.model.js";

const router = express.Router();

router.get("/api/companies", async (req, res) => {
    try {
        const companies = await Company.find({ published: true })
            .select("name slug branding");
        
        // Since Job model doesn't currently link to companies, 
        // we'll fetch global job count for now.
        // In a real multi-tenant app, this should be filtered by companyId.
        const globalJobCount = await Job.countDocuments({ status: "open" });

        const companiesWithStats = companies.map(company => ({
            ...company.toObject(),
            jobCount: globalJobCount // Using global count as placeholder per current architecture
        }));

        res.json(companiesWithStats);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch companies" });
    }
});

router.get("/:companySlug/careers", async (req, res) => {
    const { companySlug } = req.params;

    const company = await Company.findOne({
        slug: companySlug,
        published: true
    });

    if (!company) {
        return res.status(404).json({ message: "Company not found" });
    }

    const sections = await Section.find({
        companyId: company._id,
        visible: true
    }).sort({ order: 1 });

    const jobs = await Job.find({ status: "open" });

    res.json({
        company,
        sections,
        jobs
    });
});

export default router;
