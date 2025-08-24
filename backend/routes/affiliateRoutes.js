import express from "express";
import {
  getAffiliateData,
  getAllAffiliates,
  createAffiliate
} from "../controllers/affiliateController.js";

const router = express.Router();

router.get("/getAll", getAllAffiliates);
router.get("/:id", getAffiliateData); // <--- expects GET /affiliate/:id
router.post("/",createAffiliate)
export default router;
