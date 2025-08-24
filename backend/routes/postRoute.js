import express from "express";
import { handlePostback } from "../controllers/postbackController.js";

const router = express.Router();

router.get("/", handlePostback);

export default router;
