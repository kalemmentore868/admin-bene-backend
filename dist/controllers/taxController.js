"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTax = exports.createTax = exports.getAllTaxesByUserId = void 0;
const Tax_1 = __importDefault(require("../models/Tax"));
const User_1 = __importDefault(require("../models/User"));
const getAllTaxesByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const taxes = yield Tax_1.default.find({ user_id: userId });
    if (!taxes) {
        return res.status(404).json({ message: "No taxes found for the user" });
    }
    res.json(taxes);
});
exports.getAllTaxesByUserId = getAllTaxesByUserId;
const createTax = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tax_amount, email } = req.body;
    console.log("no here");
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        console.log("User not found for the provided email");
        return res
            .status(404)
            .json({ message: "User not found for the provided email" });
    }
    console.log("here");
    const user_id = user._id;
    const tax = new Tax_1.default({ user_id, tax_amount });
    yield tax.save();
    res.status(201).json(tax);
});
exports.createTax = createTax;
const updateTax = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taxId = req.params.id;
    const { status, tax_amount } = req.body;
    const fieldsToUpdate = {};
    if (tax_amount !== undefined)
        fieldsToUpdate["tax_amount"] = tax_amount;
    if (status !== undefined)
        fieldsToUpdate["status"] = status;
    const updatedTax = yield Tax_1.default.findByIdAndUpdate(taxId, fieldsToUpdate);
    res.json({ message: "Tax updated" });
});
exports.updateTax = updateTax;
