import Company from "../models/Company.model.js";
import Section from "../models/Section.model.js";
import Job from "../models/Job.model.js";

export const getCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.user.companyId);
        res.json(company);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateBranding = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePublishStatus = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPreview = async (req, res) => {
    try {
        const company = await Company.findById(req.user.companyId);
        const sections = await Section.find({
            companyId: req.user.companyId,
            visible: true
        }).sort({ order: 1 });

        // Fetch jobs for preview (matching public view behavior)
        // Note: Currently fetching all open jobs as per existing architecture
        const jobs = await Job.find({ status: "open" });

        res.json({ company, sections, jobs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const seedCompanies = async (req, res) => {
  try {
    const companies = req.body; // array

    // remove existing (optional – safer for demo)
    // await Company.deleteMany({});

    const inserted = await Company.insertMany(companies);

    res.status(201).json({
      message: "Companies seeded successfully",
      count: inserted.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPublicCompanies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const search = req.query.search || "";

        const query = { published: true };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { "branding.headline": { $regex: search, $options: "i" } }
            ];
        }

        const totalCompanies = await Company.countDocuments(query);
        const totalPages = Math.ceil(totalCompanies / limit);

        const companies = await Company.find(query)
            .select("name slug branding")
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });
        
        // Since Job model doesn't currently link to companies, 
        // we'll fetch global job count for now.
        // In a real multi-tenant app, this should be filtered by companyId.
        const globalJobCount = await Job.countDocuments({ status: "open" });

        const companiesWithStats = companies.map(company => ({
            ...company.toObject(),
            jobCount: globalJobCount // Using global count as placeholder per current architecture
        }));

        res.json({
            companies: companiesWithStats,
            pagination: {
                total: totalCompanies,
                page,
                totalPages,
                hasMore: page < totalPages
            }
        });
    } catch (error) {
        console.error("Error fetching companies:", error);
        res.status(500).json({ message: "Failed to fetch companies" });
    }
};

export const getPublicCompanyDetail = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
