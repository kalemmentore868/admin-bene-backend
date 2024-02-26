import express from 'express'
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import investmentRoutes from './routes/investmentsRoutes';
import mongoose from 'mongoose';
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/auth', authRoutes)
app.use('/users', userRoutes);
app.use('/investments', investmentRoutes)
// MongoDB connection string
const mongoURI = process.env.mongoURI

if (!mongoURI) {
  throw new Error('The MONGO_URI environment variable is not defined.');
}
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Express middleware and routes here

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});