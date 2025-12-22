import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { 
    getCompany, 
    updateBranding, 
    updatePublishStatus, 
    getPreview, 
    seedCompanies 
} from "../controllers/company.controller.js";

const router = express.Router();

router.get("/me", requireAuth, getCompany);
router.put("/branding", requireAuth, updateBranding);
router.put("/publish", requireAuth, updatePublishStatus);
router.get("/preview", requireAuth, getPreview);
router.post("/seed", seedCompanies);

export default router;
