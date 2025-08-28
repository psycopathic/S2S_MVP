import express from "express";
import { userInformation } from "../controllers/userInformation.js";
const routes = express.Router();

routes.get("/",userInformation);

export default routes