import express from "express";
import {
  getAllTaxesByUserId,
  createTax,
  updateTax,
} from "../controllers/taxController";

const router = express.Router();

router.get("/:userId", getAllTaxesByUserId);
router.post("/create", createTax);
router.put("/:taxId", updateTax);

export default router;
