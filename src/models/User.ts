import mongoose, { Schema, Document } from 'mongoose';

const userSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    wallet_address: { type: String, required: true },
    role: { type: String, required: true, default: 'user' },
});

const User = mongoose.model('User', userSchema);

export default User;
