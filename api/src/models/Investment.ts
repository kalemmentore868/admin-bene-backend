import mongoose, { Schema, Document } from 'mongoose';

const investmentSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    initial_investment: { type: Number, required: true },
    total_return: { type: Number, required: true },
    imo_deposit_amount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, required: true, default: 'Pending' }
});

const Investment = mongoose.model('Investment', investmentSchema);

export default Investment;