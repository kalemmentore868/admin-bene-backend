import mongoose, { Schema } from "mongoose";

const maxSlotSchema = new Schema({
    slot: { type: Number, required: true }
})

const MaxSlot = mongoose.model("MaxSlot", maxSlotSchema);
export default MaxSlot;