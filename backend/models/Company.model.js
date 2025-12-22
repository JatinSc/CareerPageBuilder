import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    branding: {
        primaryColor: String,
        primaryBackground: String,
        secondaryBackground: String,
        primaryText: String,
        secondaryText: String,
        logoUrl: String,
        bannerUrl: String,
        selectedBannerPattern: String,
        cultureVideoUrl: String, // Keeping for backward compatibility or default
        companyVideos: [{
            url: String,
            title: String
        }],
        headline: String
    },
    published: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model("Company", companySchema);
