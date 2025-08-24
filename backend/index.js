import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import clickRoutes from "./routes/clickRoutes.js";
import postbackRoutes from "./routes/postRoute.js"

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/click", clickRoutes);
app.use("/postback", postbackRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
