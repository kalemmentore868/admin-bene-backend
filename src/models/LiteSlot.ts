import mongoose, { Schema } from "mongoose";

const liteSlotSchema = new Schema({
    slot: { type: Number, required: true }
})

const LiteSlot = mongoose.model("LiteSlot", liteSlotSchema);
export default LiteSlot;