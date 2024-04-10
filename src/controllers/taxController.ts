import Tax from "../models/Tax";
import { Request, Response } from "express";
import User from "../models/User";

export const getAllTaxesByUserId = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const taxes = await Tax.find({ user_id: userId });

  if (!taxes) {
    return res.status(404).json({ message: "No taxes found for the user" });
  }

  res.json(taxes);
};

export const createTax = async (req: Request, res: Response) => {
  const { tax_amount, email } = req.body;

  console.log("no here");
  const user = await User.findOne({ email });

  if (!user) {
    console.log("User not found for the provided email");
    return res
      .status(404)
      .json({ message: "User not found for the provided email" });
  }

  console.log("here");

  const user_id = user._id;

  const tax = new Tax({ user_id, tax_amount });

  await tax.save();

  res.status(201).json(tax);
};

export const updateTax = async (req: Request, res: Response) => {
  const taxId = req.params.id;
  const { status, tax_amount } = req.body;
  const fieldsToUpdate: {
    tax_amount?: number;
    status?: string;
  } = {};

  if (tax_amount !== undefined) fieldsToUpdate["tax_amount"] = tax_amount;
  if (status !== undefined) fieldsToUpdate["status"] = status;

  const updatedTax = await Tax.findByIdAndUpdate(taxId, fieldsToUpdate);

  res.json({ message: "Tax updated" });
};
