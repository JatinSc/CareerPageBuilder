import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import Section from "../models/Section.model.js";

const router = express.Router();

//  create section
router.post("/", requireAuth, async (req, res) => {
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
});

// reorder sections (moved up)
router.put("/reorder", requireAuth, async (req, res) => {
    const { orderedIds } = req.body; // array of section IDs in new order

    const bulkOps = orderedIds.map((id, index) => ({
        updateOne: {
            filter: { _id: id, companyId: req.user.companyId },
            update: { order: index + 1 }
        }
    }));

    await Section.bulkWrite(bulkOps);

    res.json({ message: "Sections reordered" });
});

// update section
router.put("/:id", requireAuth, async (req, res) => {
    const { content, visible, type, image, layout, videoUrl } = req.body;

    const section = await Section.findOneAndUpdate(
        { _id: req.params.id, companyId: req.user.companyId },
        { content, visible, type, image, layout, videoUrl },
        { new: true }
    );

    res.json(section);
});



// get all sections
router.get("/", requireAuth, async (req, res) => {
    const sections = await Section.find({
        companyId: req.user.companyId
    }).sort({ order: 1 });

    res.json(sections);
});


// delete section
router.delete("/:id", requireAuth, async (req, res) => {
    await Section.findOneAndDelete({
        _id: req.params.id,
        companyId: req.user.companyId
    });

    res.json({ message: "Section deleted" });
});



export default router;
