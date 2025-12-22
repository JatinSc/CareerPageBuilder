import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { 
    createSection, 
    reorderSections, 
    updateSection, 
    getSections, 
    deleteSection 
} from "../controllers/section.controller.js";

const router = express.Router();

router.post("/", requireAuth, createSection);
router.put("/reorder", requireAuth, reorderSections);
router.put("/:id", requireAuth, updateSection);
router.get("/", requireAuth, getSections);
router.delete("/:id", requireAuth, deleteSection);

export default router;
