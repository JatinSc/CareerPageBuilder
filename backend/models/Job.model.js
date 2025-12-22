import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    workPolicy: String,        // remote / hybrid / onsite
    location: String,
    department: String,
    employmentType: String,    // full-time / part-time
    experienceLevel: String,
    jobType: String,
    salaryRange: String,
    jobSlug: {
        type: String,
        required: true
    },
    postedDaysAgo: String,
    status: {
        type: String,
        default: "open"
    }
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);
