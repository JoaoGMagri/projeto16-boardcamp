import { Router } from "express";

import { getRentals, postRentalsOpen, postRentalsClose, deleteRentals } from "../controllers/rentals.controllers.js"
import { postRentalsOpenMD } from "../middleware/postRentalsOpen.middleware.js";
import { postRentalsCloseMD } from "../middleware/postRentalsClose.middleware.js";
import { deleteRentalsMD } from "../middleware/deleteRentals.middleware.js";
const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", postRentalsOpenMD, postRentalsOpen);
router.post("/rentals/:id/return", postRentalsCloseMD, postRentalsClose);
router.delete("/rentals/:id", deleteRentalsMD, deleteRentals);

export default router;