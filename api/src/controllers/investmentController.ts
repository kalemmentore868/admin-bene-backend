import { Request, Response } from 'express';
import Investment from '../models/Investment';
import { startCronJobForInvestment } from '../cronJob';

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
            res.status(500).json({ message: 'Error Getting Investments', error: error.message });
        } else {
            // If the caught error is not an Error object, handle it here
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
        const investment = new Investment(req.body);
        const savedInvestment = await investment.save();

         // Set a timer to update the investment status after 1 hour
        setTimeout(async () => {
            try {
                await Investment.findByIdAndUpdate(savedInvestment._id, { status: 'Ready for Deposit' });
                console.log(`Investment ${savedInvestment._id} updated to 'Ready for Deposit'`);
            } catch (updateError) {
                console.error(`Error updating investment ${savedInvestment._id} to 'Ready for Deposit':`, updateError);
            }
        }, 10000)

        res.status(201).json(savedInvestment);
    } catch (error) {
        if (error instanceof Error) {
            // Now TypeScript knows that error is an Error object
            res.status(500).json({ message: 'Error Creating Investment', error: error.message });
        } else {
            // If the caught error is not an Error object, handle it here
            res.status(500).json({ message: 'Error Creating Investment', error: 'An unknown error occurred' });
        }
    }
};