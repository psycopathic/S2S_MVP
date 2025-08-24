import express from "express";
import { createCampaign, getAllCampaigns } from "../controllers/campaignController.js";

const router = express.Router();

router.get("/", getAllCampaigns);
router.post("/", createCampaign);

export default router;