import express from "express";
import { trackClick } from "../controllers/clickControllers.js";

const router = express.Router();
router.get("/", trackClick);
export default router;
