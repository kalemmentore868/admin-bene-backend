import mongoose, { Schema } from "mongoose";

const proslotSchema = new Schema({
    slot: { type: Number, required: true }
})

const ProSlot = mongoose.model("proSlot", proslotSchema);
export default ProSlot;