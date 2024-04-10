import mongoose, { Schema, Document } from "mongoose";

const taxSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tax_amount: { type: Number, required: true },
  status: { type: String, required: true, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

const Tax = mongoose.model("Tax", taxSchema);

export default Tax;
