"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taxController_1 = require("../controllers/taxController");
const router = express_1.default.Router();
router.get("/:userId", taxController_1.getAllTaxesByUserId);
router.post("/create", taxController_1.createTax);
router.put("/:taxId", taxController_1.updateTax);
exports.default = router;
