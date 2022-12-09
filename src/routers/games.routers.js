import { Router } from "express";

import { getGames, postGames } from "../controllers/games.controller.js"
import { postGamesMD } from "../middleware/postGames.middleware.js";
const router = Router();

router.get("/games", getGames);
router.post("/games", postGamesMD, postGames);

export default router;