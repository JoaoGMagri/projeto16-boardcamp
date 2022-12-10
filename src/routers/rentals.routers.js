import { Router } from "express";

import { getRentals, postRentalsOpen } from "../controllers/rentals.controllers.js"
import { } from "../middleware/postCategories.middleware.js";
const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", postRentalsOpen);

export default router;