import express from 'express'
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import investmentRoutes from './routes/investmentsRoutes';
import { authenticateToken } from './middleware/auth'
import mongoose from 'mongoose';
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = 3002;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use('/auth', authRoutes)
app.use('/users', userRoutes);
app.use('/investments', /*authenticateToken*/ investmentRoutes)

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "investments@benefund.io", // Your email
    pass: "Agreatpassword123$", // Your email password or app-specific password
  },
});

const sendEmail = async (emailContent: any) => {
  const mailOptions = {
    from: "investments@benefund.io",
    to: ["dettomanagement@gmail.com", "thegreatesteverypjackson123@gmail.com"],
    subject: `New contact form submission from ${emailContent.firstName} ${emailContent.lastName}`,
    text: `You have a new submission from ${emailContent.firstName} ${emailContent.lastName}
      wallet address: ${emailContent.walletAddress}
      amount: ${emailContent.amount}
      phone: ${emailContent.phone}
      email: ${emailContent.email}
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.log(error);
  }
};

app.post("/contact", async (req, res) => {
  const emailContent = req.body;
  await sendEmail(emailContent);
  res.json({ message: "Contact submission received" });
});
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