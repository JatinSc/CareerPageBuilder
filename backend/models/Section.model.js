import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    type: {
        type: String, // about, culture, values
        required: true
    },
    content: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        default: ""
    },
    visible: {
        type: Boolean,
        default: true
    },
    layout: {
        type: String,
        default: "default", // default, image_left, image_right, full_width, text_only, video_bg, video_split_left, video_split_right
    },
    videoUrl: {
        type: String,
        default: ""
    }
}, { timestamps: true });

export default mongoose.model("Section", sectionSchema);
