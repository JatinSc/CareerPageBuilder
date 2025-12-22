import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import Company from "../models/Company.model.js";
import Section from "../models/Section.model.js";

const router = express.Router();

router.get("/me", requireAuth, async (req, res) => {
    const company = await Company.findById(req.user.companyId);
    res.json(company);
});


router.put("/branding", requireAuth, async (req, res) => {
    const {
        primaryColor,
        primaryBackground,
        secondaryBackground,
        primaryText,
        secondaryText,
        logoUrl,
        bannerUrl,
        selectedBannerPattern,
        cultureVideoUrl,
        headline,
        companyVideos
    } = req.body;

    const company = await Company.findByIdAndUpdate(
        req.user.companyId,
        {
            branding: {
                primaryColor,
                primaryBackground,
                secondaryBackground,
                primaryText,
                secondaryText,
                logoUrl,
                bannerUrl,
                selectedBannerPattern,
                cultureVideoUrl,
                headline,
                companyVideos
            }
        },
        { new: true }
    );

    res.json(company);
});

// publish company page
router.put("/publish", requireAuth, async (req, res) => {
    const { published } = req.body; // true or false

    const company = await Company.findByIdAndUpdate(
        req.user.companyId,
        { published },
        { new: true }
    );

    res.json({
        message: published ? "Careers page published" : "Careers page unpublished",
        company
    });
});


// preview company page
router.get("/preview", requireAuth, async (req, res) => {
    const company = await Company.findById(req.user.companyId);
    const sections = await Section.find({
        companyId: req.user.companyId,
        visible: true
    }).sort({ order: 1 });

    res.json({ company, sections });
});



export default router;
