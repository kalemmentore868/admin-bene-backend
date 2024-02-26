import User from '../models/User';
import { Request, Response } from 'express';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error fetching users', error: error.message });
        } else {
            res.status(500).json({ message: 'Error fetching users', error: 'An unknown error occurred' });
        }
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Exclude password field from user object
        const { password: userPassword, ...userWithoutPassword } = user.toObject();
        res.json(userWithoutPassword);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error fetching user', error: error.message });
        } else {
            res.status(500).json({ message: 'Error fetching user', error: 'An unknown error occurred' });
        }
    }
};