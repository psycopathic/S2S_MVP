import express from "express";
import { getAffiliateData } from "../controllers/affiliateController.js";

const router = express.Router();

router.get("/:id", getAffiliateData); // <--- expects GET /affiliate/:id

export default router;
