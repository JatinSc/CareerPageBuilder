import express from "express";
import { getPublicCompanies, getPublicCompanyDetail } from "../controllers/company.controller.js";

const router = express.Router();

router.get("/api/companies", getPublicCompanies);
router.get("/:companySlug/careers", getPublicCompanyDetail);

export default router;
