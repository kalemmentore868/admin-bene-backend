import { Request, Response } from 'express';
import Investment from '../models/Investment';
import User from '../models/User';
import axios from 'axios';

export const getEthereumPrice = async (req: Request, res: Response) => {
  try {
    const apiKey = process.env.cmcAPIKEY; // Replace 'YOUR_API_KEY' with your actual CoinMarketCap API key
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=ETH&convert=USD', {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        'Access-Control-Allow-Origin': '*' // Set CORS header
      }
    });
    const ethereumPrice = response.data.data.ETH.quote.USD.price;
    console.log(ethereumPrice, 'is price');
    res.json({ ethereumPrice });
  } catch (error) {
    console.error('Error fetching Ethereum price:', error);
    res.status(500).json({ error: 'Error fetching Ethereum price' });
  }
};

export const getAllInvestments = async (req: Request, res: Response) => {
    try {
        const investments = await Investment.find().populate({
            path: 'user_id',
            select: '-password' // Exclude the password field
        });
        res.json(investments);
    } catch (error) {
        if (error instanceof Error) {
            // Now TypeScript knows that error is an Error object
            console.log(error)
            res.status(500).json({ message: 'Error Getting Investments', error: error.message });
        } else {
            // If the caught error is not an Error object, handle it here
            console.log('An unknown error occurred')

            res.status(500).json({ message: 'Error Getting Investments', error: 'An unknown error occurred' });
        }
    }
};

export const getInvestmentsByUserId = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        // Find investments by user ID and populate user data excluding the password field
        const investments = await Investment.find({ user_id: userId }).populate({
            path: 'user_id',
            select: '-password'
        });

        if (!investments) {
            return res.status(404).json({ message: 'No investments found for the user' });
        }
        console.log(investments, ' is user investments')

        res.json(investments);
    } catch (error) {
        if (error instanceof Error) {
            // Now TypeScript knows that error is an Error object
            res.status(500).json({ message: 'Error Getting Investment', error: error.message });
        } else {
            // If the caught error is not an Error object, handle it here
            res.status(500).json({ message: 'Error Getting Investment', error: 'An unknown error occurred' });
        }
    }
};

export const createInvestment = async (req: Request, res: Response) => {
    try {
        // Extract email from the request body
        const { email, initial_investment, total_return, imo_deposit_amount } = req.body;

        // Check if the user exists based on the provided email
        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found for the provided email');
            return res.status(404).json({ message: 'User not found for the provided email' });
        }

        // Retrieve the user_id
        const user_id = user._id;

        // Find the current balance for this user in the investment model
        const currentInvestment = await Investment.findOne({ email });

        // Calculate the new balance by adding the imo_deposit_amount to the current balance
        const newBalance = currentInvestment ? currentInvestment.balance + imo_deposit_amount : imo_deposit_amount;

        // Create the investment with the retrieved user_id and updated balance
        const investment = new Investment({
            user_id,
            initial_investment,
            total_return,
            imo_deposit_amount,
            balance: newBalance
        });

        const savedInvestment = await investment.save();
        console.log('Created investment for user');

        // Set a timer to update the investment status after 1 hour
        setTimeout(async () => {
            try {
                const updatedInvestment = await Investment.findByIdAndUpdate(savedInvestment._id, { status: 'Withdraw Funds' }, { new: true });
            } catch (updateError) {
                console.error(`Error updating investment ${savedInvestment._id} to 'Withdraw Funds':`, updateError);
            }
        }, 10000); // 1 hour in milliseconds

        res.status(201).json(savedInvestment);
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            res.status(500).json({ message: 'Error Creating Investment', error: error.message });
        } else {
            console.log('An unknown error occurred');
            res.status(500).json({ message: 'Error Creating Investment', error: 'An unknown error occurred' });
        }
    }
};


export const update = async (req: Request, res: Response) => {
  const investmentId = req.params.id;
  const fieldsToUpdate: {
    initial_investment?: number;
    total_return?: number;
    imo_deposit_amount?: number;
    createdAt?: Date;
    status?: string;
  } = {};

  // Check each possible field to see if it was provided in the request body
  const {
    initial_investment,
    total_return,
    imo_deposit_amount,
    createdAt,
    status,
  } = req.body;
  if (initial_investment !== undefined)
    fieldsToUpdate["initial_investment"] = initial_investment;
  if (total_return !== undefined) fieldsToUpdate["total_return"] = total_return;
  if (imo_deposit_amount !== undefined)
    fieldsToUpdate["imo_deposit_amount"] = imo_deposit_amount;
  if (createdAt !== undefined) fieldsToUpdate["createdAt"] = createdAt;
  if (status !== undefined) fieldsToUpdate["status"] = status;

  try {
    const updatedInvestment = await Investment.findByIdAndUpdate(
      investmentId,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );

    if (!updatedInvestment) {
      return res.status(404).json({ message: "Investment not found" });
    }

    res.json({ message: "Investment updated successfully", updatedInvestment });
  } catch (error) {
    if (error instanceof Error) {
        console.log(error.message);
        res.status(500).json({ message: 'Error Updating Investment', error: error.message });
    } else {
        console.log('An unknown error occurred');
        res.status(500).json({ message: 'Error Updating Investment', error: 'An unknown error occurred' });
    }
}
};
  