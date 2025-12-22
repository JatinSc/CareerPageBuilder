import Section from "../models/Section.model.js";

export const createSection = async (req, res) => {
    try {
        const { type, content, image, layout, videoUrl } = req.body;

        const count = await Section.countDocuments({
            companyId: req.user.companyId
        });

        const section = await Section.create({
            companyId: req.user.companyId,
            type,
            content,
            image,
            layout,
            videoUrl,
            order: count + 1
        });

        res.status(201).json(section);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const reorderSections = async (req, res) => {
    try {
        const { orderedIds } = req.body; // array of section IDs in new order

        const bulkOps = orderedIds.map((id, index) => ({
            updateOne: {
                filter: { _id: id, companyId: req.user.companyId },
                update: { order: index + 1 }
            }
        }));

        await Section.bulkWrite(bulkOps);

        res.json({ message: "Sections reordered" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSection = async (req, res) => {
    try {
        const { content, visible, type, image, layout, videoUrl } = req.body;

        const section = await Section.findOneAndUpdate(
            { _id: req.params.id, companyId: req.user.companyId },
            { content, visible, type, image, layout, videoUrl },
            { new: true }
        );

        res.json(section);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSections = async (req, res) => {
    try {
        const sections = await Section.find({
            companyId: req.user.companyId
        }).sort({ order: 1 });

        res.json(sections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteSection = async (req, res) => {
    try {
        await Section.findOneAndDelete({
            _id: req.params.id,
            companyId: req.user.companyId
        });

        res.json({ message: "Section deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
