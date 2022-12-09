import { Router } from "express";

import { getCategories, postCategories } from "../controllers/categories.controller.js"
import { postCategoriesMD } from "../middleware/postCategories.middleware.js";
const router = Router();

router.get("/categories", getCategories);
router.post("/categories", postCategoriesMD, postCategories);

export default router;