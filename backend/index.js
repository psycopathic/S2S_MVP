import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import clickRoutes from "./routes/clickRoutes.js";
import postbackRoutes from "./routes/postRoute.js"
import affiliateRoutes from "./routes/affiliateRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js"

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:3000", 
}));
app.use(express.json());

app.use("/click", clickRoutes);
app.use("/postback", postbackRoutes);
app.use("/affiliate", affiliateRoutes);
app.use("/campaign", campaignRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
