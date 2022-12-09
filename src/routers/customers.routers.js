import { Router } from "express";

import { getCustomers, getCustomersID, postCustomers, putCustomers } from "../controllers/customers.controller.js"
import { postCustomersMD } from "../middleware/postCustomers.middleware.js";
import { putCustomersMD } from "../middleware/putCustomers.middleware.js";

const router = Router();

router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomersID);
router.post("/customers", postCustomersMD, postCustomers);
router.put("/customers/:id", putCustomersMD, putCustomers);

export default router;